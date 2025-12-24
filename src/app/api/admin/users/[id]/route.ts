import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import { User } from '@/models';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET single user
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

        const user = await User.findById(id).select('-password').lean();

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true, data: user });
    } catch (error) {
        console.error('Admin user GET error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch user' },
            { status: 500 }
        );
    }
}

// PUT update user
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
        const { name, role } = await request.json();

        const user = await User.findByIdAndUpdate(
            id,
            { $set: { name, role } },
            { new: true }
        ).select('-password');

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: user,
            message: 'Cập nhật người dùng thành công!',
        });
    } catch (error) {
        console.error('Admin user PUT error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update user' },
            { status: 500 }
        );
    }
}

// DELETE user
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

        // Prevent deleting self
        if (id === session.user.id) {
            return NextResponse.json(
                { success: false, error: 'Không thể xóa tài khoản của chính bạn' },
                { status: 400 }
            );
        }

        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Xóa người dùng thành công!',
        });
    } catch (error) {
        console.error('Admin user DELETE error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete user' },
            { status: 500 }
        );
    }
}
