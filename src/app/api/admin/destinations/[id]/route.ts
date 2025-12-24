import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import { Destination } from '@/models';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET single destination
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

        const destination = await Destination.findById(id)
            .populate('categoryId', 'name slug')
            .populate('provinceId', 'name code')
            .lean();

        if (!destination) {
            return NextResponse.json(
                { success: false, error: 'Not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: destination });
    } catch (error) {
        console.error('Admin destination GET error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch destination' },
            { status: 500 }
        );
    }
}

// PUT update destination
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
        const body = await request.json();

        const destination = await Destination.findByIdAndUpdate(
            id,
            { $set: body },
            { new: true }
        );

        if (!destination) {
            return NextResponse.json(
                { success: false, error: 'Not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: destination,
            message: 'Cập nhật thành công!',
        });
    } catch (error) {
        console.error('Admin destination PUT error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update destination' },
            { status: 500 }
        );
    }
}

// DELETE destination
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

        const destination = await Destination.findByIdAndDelete(id);

        if (!destination) {
            return NextResponse.json(
                { success: false, error: 'Not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Xóa thành công!',
        });
    } catch (error) {
        console.error('Admin destination DELETE error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete destination' },
            { status: 500 }
        );
    }
}
