import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import { Trip } from '@/models';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET all trips (admin)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const status = searchParams.get('status');
        const search = searchParams.get('search');

        const query: Record<string, unknown> = {};
        if (status) query.status = status;
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const skip = (page - 1) * limit;

        const [trips, total] = await Promise.all([
            Trip.find(query)
                .populate('userId', 'name email avatar')
                .populate({
                    path: 'destinations.destinationId',
                    select: 'name slug images priceRange',
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Trip.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            data: trips,
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    } catch (error) {
        console.error('Admin trips GET error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch trips' },
            { status: 500 }
        );
    }
}
