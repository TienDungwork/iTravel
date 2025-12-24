import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import { Review } from '@/models';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET all reviews (admin)
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
        const status = searchParams.get('status'); // 'approved', 'pending'
        const skip = (page - 1) * limit;

        const query: Record<string, unknown> = {};
        if (status === 'approved') query.isApproved = true;
        if (status === 'pending') query.isApproved = false;

        const [reviews, total] = await Promise.all([
            Review.find(query)
                .populate('userId', 'name email')
                .populate('destinationId', 'name slug')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Review.countDocuments(query),
        ]);

        return NextResponse.json({
            success: true,
            data: reviews,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error('Admin reviews GET error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}
