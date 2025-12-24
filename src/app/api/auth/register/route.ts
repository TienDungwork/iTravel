import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { User } from '@/models/User';

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const { name, email, password } = await request.json();

        // Validation
        if (!name || !email || !password) {
            return NextResponse.json(
                { success: false, error: 'Vui lòng điền đầy đủ thông tin' },
                { status: 400 }
            );
        }

        if (password.length < 6) {
            return NextResponse.json(
                { success: false, error: 'Mật khẩu phải có ít nhất 6 ký tự' },
                { status: 400 }
            );
        }

        // Check existing user
        const existingUser = await User.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'Email đã được sử dụng' },
                { status: 400 }
            );
        }

        // Create user
        const user = await User.create({
            name,
            email: email.toLowerCase(),
            password,
            role: 'user',
        });

        return NextResponse.json({
            success: true,
            message: 'Đăng ký thành công',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        return NextResponse.json(
            { success: false, error: 'Có lỗi xảy ra, vui lòng thử lại' },
            { status: 500 }
        );
    }
}
