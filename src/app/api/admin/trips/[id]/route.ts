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

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();
        const { id } = await params;

        const trip = await Trip.findById(id)
            .populate('userId', 'name email avatar')
            .populate({
                path: 'destinations.destinationId',
                select: 'name slug images priceRange provinceId',
                populate: { path: 'provinceId', select: 'name' },
            })
            .lean();

        if (!trip) {
            return NextResponse.json(
                { success: false, error: 'Trip not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: trip });
    } catch (error) {
        console.error('Admin trip GET error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch trip' },
            { status: 500 }
        );
    }
}

// PUT update trip (admin)
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
        const updates = await request.json();

        const trip = await Trip.findByIdAndUpdate(
            id,
            { $set: updates },
            { new: true }
        )
            .populate('userId', 'name email')
            .lean();

        if (!trip) {
            return NextResponse.json(
                { success: false, error: 'Trip not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: trip,
            message: 'Trip updated successfully',
        });
    } catch (error) {
        console.error('Admin trip PUT error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update trip' },
            { status: 500 }
        );
    }
}

// DELETE trip (admin)
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

        const trip = await Trip.findByIdAndDelete(id);

        if (!trip) {
            return NextResponse.json(
                { success: false, error: 'Trip not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Trip deleted successfully',
        });
    } catch (error) {
        console.error('Admin trip DELETE error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete trip' },
            { status: 500 }
        );
    }
}
