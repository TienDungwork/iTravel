import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Destination } from '@/models';

export async function GET(request: NextRequest) {
    try {
        await connectDB();

        const { searchParams } = new URL(request.url);
        const category = searchParams.get('category');
        const province = searchParams.get('province');
        const featured = searchParams.get('featured');
        const search = searchParams.get('search');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '12');

        // Build query
        const query: Record<string, unknown> = { isActive: true };

        if (category) {
            query.categoryId = category;
        }
        if (province) {
            query.provinceId = province;
        }
        if (featured === 'true') {
            query.isFeatured = true;
        }
        if (search) {
            query.$text = { $search: search };
        }

        const skip = (page - 1) * limit;

        const [destinations, total] = await Promise.all([
            Destination.find(query)
                .populate('categoryId', 'name slug icon')
                .populate('provinceId', 'name code region')
                .sort({ rating: -1, createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Destination.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            data: destinations,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Destinations API error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch destinations' },
            { status: 500 }
        );
    }
}
