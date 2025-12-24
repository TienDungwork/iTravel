import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import { User } from '@/models';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET current user profile
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const user = await User.findById(session.user.id)
            .select('-password')
            .populate({
                path: 'favorites',
                select: 'name slug images rating',
            })
            .lean();

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: user,
        });
    } catch (error) {
        console.error('User profile GET error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch profile' },
            { status: 500 }
        );
    }
}

// PUT update current user profile
export async function PUT(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();
        const { name, avatar } = await request.json();

        const updateData: Record<string, string> = {};
        if (name) updateData.name = name;
        if (avatar) updateData.avatar = avatar;

        const user = await User.findByIdAndUpdate(
            session.user.id,
            { $set: updateData },
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
            message: 'Cập nhật thông tin thành công!',
        });
    } catch (error) {
        console.error('User profile PUT error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update profile' },
            { status: 500 }
        );
    }
}
