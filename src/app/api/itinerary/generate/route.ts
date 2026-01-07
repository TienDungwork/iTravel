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

// Map preference IDs to category slugs for filtering
const preferenceToCategory: Record<string, string[]> = {
    beach: ['bien-dao', 'bien'],
    mountain: ['nui-rung', 'nui', 'cao-nguyen'],
    culture: ['di-tich', 'tam-linh', 'van-hoa', 'bao-tang'],
    nature: ['sinh-thai', 'thien-nhien', 'vuon-quoc-gia'],
    adventure: ['mao-hiem', 'tham-hiem', 'the-thao'],
    food: ['am-thuc', 'cho-dem', 'pho-di-bo'],
    relax: ['nghi-duong', 'resort', 'suoi-nuoc-nong'],
    romantic: ['lang-man', 'honeymoon'],
};

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

        // Calculate budget per person per day (budget is already per person)
        const budgetPerPersonPerDay = budget / days;
        const totalBudgetForGroup = budget * travelers;

        // Filter destinations by preferences and budget
        let filteredDestinations = destinations;

        // Filter by preferences if any selected
        if (preferences.length > 0) {
            const targetCategories = preferences.flatMap(p => preferenceToCategory[p] || []);
            if (targetCategories.length > 0) {
                filteredDestinations = destinations.filter(d =>
                    targetCategories.includes(d.categoryId?.slug || '')
                );
            }
        }

        // If no matching destinations, use all
        if (filteredDestinations.length === 0) {
            filteredDestinations = destinations;
        }

        // Sort by rating and filter by budget
        filteredDestinations = filteredDestinations
            .filter(d => {
                const avgPrice = ((d.priceRange?.min || 500000) + (d.priceRange?.max || 2000000)) / 2;
                return avgPrice <= budgetPerPersonPerDay * 1.5; // Allow 50% flexibility
            })
            .sort((a, b) => (b.rating || 0) - (a.rating || 0));

        // If still empty, use all destinations sorted by rating
        if (filteredDestinations.length === 0) {
            filteredDestinations = destinations.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        // Build destinations context for ChatGPT
        const destinationsContext = filteredDestinations.slice(0, 10).map((d, idx) => ({
            id: d._id.toString(),
            index: idx + 1,
            name: d.name,
            category: d.categoryId?.name || 'Khác',
            categorySlug: d.categoryId?.slug || 'other',
            province: d.provinceId?.name || 'Việt Nam',
            region: d.provinceId?.region || 'Trung',
            priceMin: d.priceRange?.min || 500000,
            priceMax: d.priceRange?.max || 2000000,
            avgPrice: ((d.priceRange?.min || 500000) + (d.priceRange?.max || 2000000)) / 2,
            duration: d.duration || '1-2 ngày',
            rating: d.rating || 4.0,
            description: d.shortDescription || d.description?.substring(0, 150),
        }));

        // Map preferences to Vietnamese
        const prefMap: Record<string, string> = {
            beach: 'biển đảo, đảo hoang',
            mountain: 'núi rừng, leo núi',
            culture: 'văn hóa, di tích lịch sử',
            nature: 'sinh thái, thiên nhiên hoang sơ',
            adventure: 'mạo hiểm, phiêu lưu',
            food: 'ẩm thực, khám phá đồ ăn địa phương',
            relax: 'nghỉ dưỡng, thư giãn',
            romantic: 'lãng mạn, cặp đôi',
        };
        const prefVi = preferences.map(p => prefMap[p] || p).join(', ') || 'đa dạng';

        // Call ChatGPT with improved prompt
        const prompt = `Bạn là chuyên gia lập kế hoạch du lịch Việt Nam. Hãy tạo lịch trình chi tiết và THỰC TẾ.

THÔNG TIN CHUYẾN ĐI:
- Ngân sách MỖI NGƯỜI: ${budget.toLocaleString('vi-VN')} VNĐ
- Ngân sách mỗi người/ngày: ${Math.round(budgetPerPersonPerDay).toLocaleString('vi-VN')} VNĐ
- Tổng ngân sách cho ${travelers} người: ${totalBudgetForGroup.toLocaleString('vi-VN')} VNĐ
- Số ngày: ${days} ngày ${days - 1} đêm
- Số người: ${travelers} người
- Sở thích: ${prefVi}

DANH SÁCH ĐỊA ĐIỂM PHÙ HỢP (đã lọc theo sở thích và ngân sách):
${destinationsContext.map(d => `${d.index}. ${d.name} (${d.province}) - ${d.category} - Rating: ${d.rating}/5 - Giá: ${d.priceMin.toLocaleString()}-${d.priceMax.toLocaleString()}đ/người - ${d.description}`).join('\n')}

NGUYÊN TẮC LẬP LỊCH TRÌNH:
1. Mỗi ngày chỉ nên có 1 địa điểm chính để có thời gian khám phá kỹ
2. Chọn địa điểm gần nhau về mặt địa lý để tiết kiệm thời gian di chuyển
3. Chi phí ước tính cho MỖI NGƯỜI phải nằm trong ngân sách ${budget.toLocaleString('vi-VN')} VNĐ/người
4. Ưu tiên địa điểm có rating cao
5. Đa dạng trải nghiệm nếu có nhiều ngày

TRẢ VỀ JSON THUẦN (KHÔNG markdown):
{
  "title": "Tiêu đề hấp dẫn mô tả lịch trình",
  "items": [
    {
      "day": 1,
      "destinationId": "ID từ danh sách trên",
      "destinationName": "Tên địa điểm",
      "duration": "Cả ngày/Nửa ngày",
      "activities": ["Hoạt động 1", "Hoạt động 2"],
      "notes": "Chi tiết về hoạt động, ăn uống, nghỉ ngơi",
      "estimatedCost": 1500000
    }
  ],
  "totalEstimatedCost": 5000000,
  "tips": ["Mẹo quan trọng 1", "Mẹo 2", "Mẹo 3"]
}`;

        const openai = getOpenAIClient();
        const completion = await openai.chat.completions.create({
            model: 'gpt-3.5-turbo',
            messages: [
                {
                    role: 'system',
                    content: 'Bạn là AI lập lịch trình du lịch chuyên nghiệp. Luôn trả lời bằng JSON thuần túy, không dùng markdown. Đảm bảo lịch trình thực tế, khả thi và trong ngân sách.'
                },
                { role: 'user', content: prompt }
            ],
            temperature: 0.7,
            max_tokens: 2500,
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
            // Fallback to smart rule-based generation
            return generateSmartFallbackItinerary(filteredDestinations, budget, days, travelers, preferences);
        }

        // Map AI destination IDs to actual destinations with validation
        const items = aiResult.items.map((item: {
            day: number;
            destinationId: string;
            destinationName: string;
            duration: string;
            activities?: string[];
            notes: string;
            estimatedCost: number;
        }) => {
            // Try to find by ID first, then by name
            let dest = destinations.find(d => d._id.toString() === item.destinationId);
            if (!dest) {
                dest = destinations.find(d =>
                    d.name.toLowerCase().includes(item.destinationName.toLowerCase()) ||
                    item.destinationName.toLowerCase().includes(d.name.toLowerCase())
                );
            }
            if (!dest) {
                dest = filteredDestinations[0] || destinations[0];
            }

            return {
                day: item.day,
                destinationId: dest._id,
                destination: dest,
                duration: item.duration,
                activities: item.activities || [],
                notes: item.notes,
                estimatedCost: item.estimatedCost,
            };
        });

        // Validate total cost
        const calculatedTotal = items.reduce((sum: number, item: { estimatedCost: number }) => sum + item.estimatedCost, 0);
        const finalTotal = Math.min(calculatedTotal, budget);

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
            totalEstimatedCost: finalTotal,
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
                totalEstimatedCost: finalTotal,
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
            { success: false, error: 'Không thể tạo lịch trình. Vui lòng thử lại!' },
            { status: 500 }
        );
    }
}

// Smart fallback when AI fails - uses preference matching and budget optimization
async function generateSmartFallbackItinerary(
    destinations: any[],
    budget: number,
    days: number,
    travelers: number,
    preferences: string[]
) {
    const budgetPerDay = budget / days;
    const items = [];
    let totalCost = 0;
    const usedDestinations = new Set<string>();

    for (let day = 1; day <= days; day++) {
        // Find best destination for this day
        let bestDest = null;
        let bestScore = -1;

        for (const dest of destinations) {
            if (usedDestinations.has(dest._id.toString())) continue;

            const avgCost = ((dest.priceRange?.min || 500000) + (dest.priceRange?.max || 2000000)) / 2;
            if (avgCost > budgetPerDay) continue;

            // Score based on rating and budget fit
            const rating = dest.rating || 4.0;
            const budgetFit = 1 - Math.abs(avgCost - budgetPerDay * 0.7) / budgetPerDay;
            const score = rating * 0.7 + budgetFit * 0.3;

            if (score > bestScore) {
                bestScore = score;
                bestDest = dest;
            }
        }

        // Fallback to first available
        if (!bestDest) {
            bestDest = destinations.find(d => !usedDestinations.has(d._id.toString())) || destinations[0];
        }

        const estimatedCost = ((bestDest.priceRange?.min || 500000) + (bestDest.priceRange?.max || 2000000)) / 2;

        items.push({
            day,
            destinationId: bestDest._id,
            destination: bestDest,
            duration: bestDest.duration || '1 ngày',
            notes: `Khám phá ${bestDest.name} - ${bestDest.shortDescription || 'Địa điểm du lịch hấp dẫn'}`,
            estimatedCost,
        });

        totalCost += estimatedCost;
        usedDestinations.add(bestDest._id.toString());
    }

    await Itinerary.create({
        title: `Hành trình ${days} ngày khám phá Việt Nam`,
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
        totalEstimatedCost: Math.min(totalCost, budget),
        isAIGenerated: false,
    });

    return NextResponse.json({
        success: true,
        data: {
            title: `Hành trình ${days} ngày khám phá Việt Nam`,
            budget,
            days,
            travelers,
            preferences,
            items,
            totalEstimatedCost: Math.min(totalCost, budget),
            tips: [
                'Đặt phòng khách sạn trước ít nhất 1 tuần',
                'Mang theo thuốc chống say xe nếu di chuyển nhiều',
                'Tải bản đồ offline để sử dụng khi không có mạng',
            ],
            aiPowered: false,
        },
    });
}
