import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import { Review, Destination } from '@/models';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET reviews for a destination
export async function GET(request: NextRequest) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const destinationId = searchParams.get('destinationId');
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');

        if (!destinationId) {
            return NextResponse.json(
                { success: false, error: 'Missing destinationId' },
                { status: 400 }
            );
        }

        const skip = (page - 1) * limit;

        const [reviews, total] = await Promise.all([
            Review.find({ destinationId, isApproved: true })
                .populate('userId', 'name avatar')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Review.countDocuments({ destinationId, isApproved: true }),
        ]);

        return NextResponse.json({
            success: true,
            data: reviews,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error('Reviews GET error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch reviews' },
            { status: 500 }
        );
    }
}

// POST new review
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Vui lòng đăng nhập để đánh giá' },
                { status: 401 }
            );
        }

        await connectDB();
        const { destinationId, rating, title, comment } = await request.json();

        if (!destinationId || !rating || !title || !comment) {
            return NextResponse.json(
                { success: false, error: 'Vui lòng điền đầy đủ thông tin' },
                { status: 400 }
            );
        }

        // Check if user already reviewed
        const existingReview = await Review.findOne({
            userId: session.user.id,
            destinationId,
        });

        if (existingReview) {
            return NextResponse.json(
                { success: false, error: 'Bạn đã đánh giá địa điểm này rồi' },
                { status: 400 }
            );
        }

        const review = await Review.create({
            userId: session.user.id,
            destinationId,
            rating,
            title,
            comment,
        });

        // Update destination rating
        const reviews = await Review.find({ destinationId, isApproved: true });
        const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
        await Destination.findByIdAndUpdate(destinationId, {
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: reviews.length,
        });

        return NextResponse.json({
            success: true,
            data: review,
            message: 'Đánh giá thành công!',
        });
    } catch (error) {
        console.error('Reviews POST error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create review' },
            { status: 500 }
        );
    }
}
