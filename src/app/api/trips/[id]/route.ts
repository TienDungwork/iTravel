import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import { Trip } from '@/models';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET single trip
export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Vui lòng đăng nhập' },
                { status: 401 }
            );
        }

        await connectDB();
        const { id } = await params;

        const trip = await Trip.findOne({ _id: id, userId: session.user.id })
            .populate({
                path: 'destinations.destinationId',
                select: 'name slug images rating priceRange provinceId categoryId amenities',
                populate: [
                    { path: 'provinceId', select: 'name' },
                    { path: 'categoryId', select: 'name icon' },
                ],
            })
            .lean();

        if (!trip) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy chuyến đi' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: trip,
        });
    } catch (error) {
        console.error('Trip GET error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch trip' },
            { status: 500 }
        );
    }
}

// PUT update trip
export async function PUT(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Vui lòng đăng nhập' },
                { status: 401 }
            );
        }

        await connectDB();
        const { id } = await params;
        const updates = await request.json();

        const trip = await Trip.findOneAndUpdate(
            { _id: id, userId: session.user.id },
            { $set: updates },
            { new: true }
        );

        if (!trip) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy chuyến đi' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: trip,
            message: 'Đã cập nhật chuyến đi!',
        });
    } catch (error) {
        console.error('Trip PUT error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update trip' },
            { status: 500 }
        );
    }
}

// DELETE trip or remove destination from trip
export async function DELETE(
    request: NextRequest,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Vui lòng đăng nhập' },
                { status: 401 }
            );
        }

        await connectDB();
        const { id } = await params;
        const { searchParams } = new URL(request.url);
        const destinationId = searchParams.get('destinationId');

        const trip = await Trip.findOne({ _id: id, userId: session.user.id });
        if (!trip) {
            return NextResponse.json(
                { success: false, error: 'Không tìm thấy chuyến đi' },
                { status: 404 }
            );
        }

        // If destinationId provided, remove only that destination
        if (destinationId) {
            trip.destinations = trip.destinations.filter(
                (d) => d.destinationId.toString() !== destinationId
            );
            await trip.save();

            return NextResponse.json({
                success: true,
                data: trip,
                message: 'Đã xóa địa điểm khỏi chuyến đi!',
            });
        }

        // Delete entire trip
        await Trip.findByIdAndDelete(id);

        return NextResponse.json({
            success: true,
            message: 'Đã xóa chuyến đi!',
        });
    } catch (error) {
        console.error('Trip DELETE error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete trip' },
            { status: 500 }
        );
    }
}
