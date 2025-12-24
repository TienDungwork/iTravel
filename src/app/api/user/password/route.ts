import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import { User } from '@/models';
import bcrypt from 'bcryptjs';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// PUT change password
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
        const { currentPassword, newPassword } = await request.json();

        if (!currentPassword || !newPassword) {
            return NextResponse.json(
                { success: false, error: 'Vui lòng điền đầy đủ thông tin' },
                { status: 400 }
            );
        }

        if (newPassword.length < 6) {
            return NextResponse.json(
                { success: false, error: 'Mật khẩu mới phải có ít nhất 6 ký tự' },
                { status: 400 }
            );
        }

        const user = await User.findById(session.user.id).select('+password');

        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        // Verify current password
        const isValid = await user.comparePassword(currentPassword);
        if (!isValid) {
            return NextResponse.json(
                { success: false, error: 'Mật khẩu hiện tại không đúng' },
                { status: 400 }
            );
        }

        // Update password (will be hashed by pre-save hook)
        user.password = newPassword;
        await user.save();

        return NextResponse.json({
            success: true,
            message: 'Đổi mật khẩu thành công!',
        });
    } catch (error) {
        console.error('Change password error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to change password' },
            { status: 500 }
        );
    }
}
