import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { connectDB } from '@/lib/db';
import { Destination, Itinerary } from '@/models';

interface GenerateRequest {
    budget: number;
    days: number;
    travelers: number;
    preferences: string[];
}

// Lazy initialization to avoid build-time errors
function getOpenAIClient() {
    if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY not configured');
    }
    return new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}
export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body: GenerateRequest = await request.json();
        const { budget, days, travelers, preferences } = body;

        // Get all destinations for context
        const rawDestinations = await Destination.find({ isActive: true })
            .populate('categoryId', 'name slug icon')
            .populate('provinceId', 'name code region')
            .lean();

        if (rawDestinations.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Chưa có địa điểm trong hệ thống' },
                { status: 404 }
            );
        }

        // Type for populated destination
        type PopulatedDest = typeof rawDestinations[0] & {
            categoryId?: { name: string; slug: string; icon: string };
            provinceId?: { name: string; code: string; region: string };
        };
        const destinations = rawDestinations as PopulatedDest[];

        // Build destinations context for ChatGPT
        const destinationsContext = destinations.map(d => ({
            id: d._id.toString(),
            name: d.name,
            category: d.categoryId?.name || 'Khác',
            province: d.provinceId?.name || 'Việt Nam',
            region: d.provinceId?.region || 'Trung',
            priceMin: d.priceRange?.min || 500000,
            priceMax: d.priceRange?.max || 2000000,
            duration: d.duration || '1-2 ngày',
            rating: d.rating || 4.0,
            description: d.shortDescription || d.description?.substring(0, 100),
            bestTime: d.bestTime?.join(', ') || 'Quanh năm',
        }));

        // Map preferences to Vietnamese
        const prefMap: Record<string, string> = {
            beach: 'biển đảo',
            mountain: 'núi rừng',
            culture: 'văn hóa lịch sử',
            nature: 'sinh thái thiên nhiên',
            city: 'đô thị thành phố',
        };
        const prefVi = preferences.map(p => prefMap[p] || p).join(', ');

        // Call ChatGPT
        const prompt = `Bạn là chuyên gia du lịch Việt Nam. Hãy tạo lịch trình du lịch chi tiết dựa trên thông tin sau:

THÔNG TIN CHUYẾN ĐI:
- Ngân sách: ${budget.toLocaleString('vi-VN')} VNĐ (tổng cho cả nhóm)
- Số ngày: ${days} ngày
- Số người: ${travelers} người
- Sở thích: ${prefVi || 'đa dạng'}

DANH SÁCH ĐỊA ĐIỂM CÓ SẴN:
${JSON.stringify(destinationsContext, null, 2)}

YÊU CẦU:
1. Chọn các địa điểm phù hợp với ngân sách và sở thích
2. Sắp xếp lịch trình hợp lý theo ngày
3. Mỗi ngày nên có 1-2 địa điểm chính
4. Ưu tiên địa điểm rating cao

TRẢ VỀ JSON theo format sau (KHÔNG có markdown, chỉ JSON thuần):
{
  "title": "Tiêu đề lịch trình hấp dẫn",
  "items": [
    {
      "day": 1,
      "destinationId": "id của địa điểm từ danh sách",
      "destinationName": "Tên địa điểm",
      "duration": "Thời gian tham quan",
      "notes": "Gợi ý hoạt động chi tiết",
      "estimatedCost": 500000
    }
  ],
  "totalEstimatedCost": 5000000,
  "tips": ["Mẹo 1", "Mẹo 2", "Mẹo 3"]
}`;

        const openai = getOpenAIClient();
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'Bạn là AI hỗ trợ lập kế hoạch du lịch Việt Nam. Mô tả chi tiết về lịch trình. Luôn trả về JSON hợp lệ, không markdown. '
                },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 2000,
        });

        const responseText = completion.choices[0]?.message?.content || '';

        // Parse JSON from response
        let aiResult;
        try {
            // Remove markdown code blocks if present
            const cleanJson = responseText.replace(/```json\n?|\n?```/g, '').trim();
            aiResult = JSON.parse(cleanJson);
        } catch {
            console.error('Failed to parse AI response:', responseText);
            // Fallback to rule-based if AI fails
            return generateFallbackItinerary(destinations, budget, days, travelers, preferences);
        }

        // Map AI destination IDs to actual destinations
        const items = aiResult.items.map((item: {
            day: number;
            destinationId: string;
            destinationName: string;
            duration: string;
            notes: string;
            estimatedCost: number;
        }) => {
            const dest = destinations.find(d => d._id.toString() === item.destinationId);
            return {
                day: item.day,
                destinationId: dest?._id || destinations[0]._id,
                destination: dest || destinations[0],
                duration: item.duration,
                notes: item.notes,
                estimatedCost: item.estimatedCost,
            };
        });

        // Save itinerary
        const itinerary = await Itinerary.create({
            title: aiResult.title,
            budget,
            days,
            travelers,
            preferences,
            items: items.map((i: { day: number; destinationId: string; duration: string; notes: string }) => ({
                day: i.day,
                destinationId: i.destinationId,
                duration: i.duration,
                notes: i.notes,
            })),
            totalEstimatedCost: aiResult.totalEstimatedCost,
            isAIGenerated: true,
        });

        return NextResponse.json({
            success: true,
            data: {
                _id: itinerary._id,
                title: aiResult.title,
                budget,
                days,
                travelers,
                preferences,
                items,
                totalEstimatedCost: aiResult.totalEstimatedCost,
                tips: aiResult.tips || [
                    'Đặt phòng trước ít nhất 1 tuần để có giá tốt',
                    'Mang theo kem chống nắng và nón',
                    'Kiểm tra thời tiết trước khi đi',
                ],
                aiPowered: true,
            },
        });
    } catch (error) {
        console.error('Itinerary generation error:', error);
        return NextResponse.json(
            { success: false, error: 'Không thể tạo lịch trình' },
            { status: 500 }
        );
    }
}

// Fallback when AI fails
async function generateFallbackItinerary(
    destinations: any[],
    budget: number,
    days: number,
    travelers: number,
    preferences: string[]
) {
    const items = [];
    let totalCost = 0;

    for (let day = 1; day <= days; day++) {
        const destIndex = (day - 1) % destinations.length;
        const dest = destinations[destIndex];

        const cost = (dest.priceRange?.min || 500000 + dest.priceRange?.max || 1500000) / 2;
        items.push({
            day,
            destinationId: dest._id,
            destination: dest,
            duration: dest.duration || '1 ngày',
            notes: `Khám phá ${dest.name}`,
            estimatedCost: cost,
        });

        totalCost += cost;
    }

    await Itinerary.create({
        title: `Lịch trình ${days} ngày`,
        budget,
        days,
        travelers,
        preferences,
        items: items.map(i => ({
            day: i.day,
            destinationId: i.destinationId,
            duration: i.duration,
            notes: i.notes,
        })),
        totalEstimatedCost: totalCost * travelers,
        isAIGenerated: false,
    });

    return NextResponse.json({
        success: true,
        data: {
            title: `Lịch trình ${days} ngày khám phá`,
            budget,
            days,
            travelers,
            preferences,
            items,
            totalEstimatedCost: totalCost * travelers,
            tips: [
                'Đặt phòng trước ít nhất 1 tuần',
                'Mang theo kem chống nắng',
                'Tải bản đồ offline',
            ],
            aiPowered: false,
        },
    });
}
