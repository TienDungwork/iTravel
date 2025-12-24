import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import { Itinerary } from '@/models';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET single itinerary
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();
        const { id } = await params;

        const itinerary = await Itinerary.findOne({
            _id: id,
            userId: session.user.id,
        })
            .populate({
                path: 'items.destinationId',
                select: 'name slug images rating priceRange provinceId',
                populate: { path: 'provinceId', select: 'name' },
            })
            .lean();

        if (!itinerary) {
            return NextResponse.json(
                { success: false, error: 'Itinerary not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: itinerary,
        });
    } catch (error) {
        console.error('Get itinerary error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch itinerary' },
            { status: 500 }
        );
    }
}

// DELETE itinerary
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();
        const { id } = await params;

        const itinerary = await Itinerary.findOneAndDelete({
            _id: id,
            userId: session.user.id,
        });

        if (!itinerary) {
            return NextResponse.json(
                { success: false, error: 'Itinerary not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Đã xóa lịch trình!',
        });
    } catch (error) {
        console.error('Delete itinerary error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete itinerary' },
            { status: 500 }
        );
    }
}
