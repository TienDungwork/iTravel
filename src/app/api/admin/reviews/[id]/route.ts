import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import { Review, Destination } from '@/models';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// PUT approve/reject review
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();
        const { id } = await params;
        const { isApproved } = await request.json();

        const review = await Review.findByIdAndUpdate(
            id,
            { isApproved },
            { new: true }
        );

        if (!review) {
            return NextResponse.json(
                { success: false, error: 'Review not found' },
                { status: 404 }
            );
        }

        // Recalculate destination rating
        const reviews = await Review.find({
            destinationId: review.destinationId,
            isApproved: true
        });

        if (reviews.length > 0) {
            const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
            await Destination.findByIdAndUpdate(review.destinationId, {
                rating: Math.round(avgRating * 10) / 10,
                reviewCount: reviews.length,
            });
        }

        return NextResponse.json({
            success: true,
            data: review,
            message: isApproved ? 'Đã phê duyệt đánh giá!' : 'Đã từ chối đánh giá!',
        });
    } catch (error) {
        console.error('Admin review PUT error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update review' },
            { status: 500 }
        );
    }
}

// DELETE review
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();
        const { id } = await params;

        const review = await Review.findByIdAndDelete(id);

        if (!review) {
            return NextResponse.json(
                { success: false, error: 'Review not found' },
                { status: 404 }
            );
        }

        // Recalculate destination rating
        const reviews = await Review.find({
            destinationId: review.destinationId,
            isApproved: true
        });

        const avgRating = reviews.length > 0
            ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
            : 0;

        await Destination.findByIdAndUpdate(review.destinationId, {
            rating: Math.round(avgRating * 10) / 10,
            reviewCount: reviews.length,
        });

        return NextResponse.json({
            success: true,
            message: 'Xóa đánh giá thành công!',
        });
    } catch (error) {
        console.error('Admin review DELETE error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete review' },
            { status: 500 }
        );
    }
}
