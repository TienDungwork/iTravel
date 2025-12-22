import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Destination, Itinerary } from '@/models';

interface GenerateRequest {
    budget: number;
    days: number;
    travelers: number;
    preferences: string[];
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body: GenerateRequest = await request.json();

        const { budget, days, travelers, preferences } = body;

        // Simple rule-based AI recommendation
        // In production, this would use ML models or external AI services

        // Calculate budget per person per day
        const dailyBudget = budget / days / travelers;

        // Query destinations based on preferences and budget
        const query: Record<string, unknown> = { isActive: true };

        if (preferences.length > 0) {
            // Get categories matching preferences
            const categoryMap: Record<string, string[]> = {
                beach: ['bien-dao'],
                mountain: ['nui-rung'],
                culture: ['di-tich', 'tam-linh'],
                nature: ['sinh-thai'],
                city: ['do-thi'],
            };

            const categorySlugs = preferences.flatMap(p => categoryMap[p] || []);
            if (categorySlugs.length > 0) {
                const { Category } = await import('@/models');
                const categories = await Category.find({ slug: { $in: categorySlugs } }).select('_id');
                query.categoryId = { $in: categories.map(c => c._id) };
            }
        }

        // Filter by price range
        query['priceRange.min'] = { $lte: dailyBudget * 1.5 };

        // Get matching destinations
        const destinations = await Destination.find(query)
            .populate('categoryId', 'name slug icon')
            .populate('provinceId', 'name code')
            .sort({ rating: -1 })
            .limit(days * 2)
            .lean();

        if (destinations.length === 0) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy địa điểm phù hợp với tiêu chí của bạn' },
                { status: 404 }
            );
        }

        // Generate itinerary
        const items = [];
        let totalCost = 0;

        for (let day = 1; day <= days; day++) {
            const destIndex = (day - 1) % destinations.length;
            const dest = destinations[destIndex];

            items.push({
                day,
                destinationId: dest._id,
                destination: dest,
                duration: dest.duration || '1 ngày',
                notes: `Khám phá ${dest.name}`,
            });

            totalCost += (dest.priceRange.min + dest.priceRange.max) / 2;
        }

        // Create itinerary document
        const itinerary = await Itinerary.create({
            title: `Lịch trình ${days} ngày - ${preferences.join(', ') || 'Khám phá'}`,
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
            isAIGenerated: true,
        });

        return NextResponse.json({
            success: true,
            data: {
                _id: itinerary._id,
                title: itinerary.title,
                budget,
                days,
                travelers,
                preferences,
                items,
                totalEstimatedCost: totalCost * travelers,
                tips: [
                    'Đặt phòng trước ít nhất 1 tuần để có giá tốt',
                    'Mang theo kem chống nắng và nón',
                    'Tải bản đồ offline khi đi vùng sâu vùng xa',
                ],
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
