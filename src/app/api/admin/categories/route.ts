import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import { Category } from '@/models';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET all categories (admin)
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const categories = await Category.find()
            .sort({ order: 1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error('Admin categories GET error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}

// POST create category
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();
        const { name, icon, description } = await request.json();

        if (!name) {
            return NextResponse.json(
                { success: false, error: 'Tên danh mục là bắt buộc' },
                { status: 400 }
            );
        }

        // Generate slug
        const slug = name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Check existing
        const existing = await Category.findOne({ slug });
        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Danh mục này đã tồn tại' },
                { status: 400 }
            );
        }

        // Get max order
        const maxOrder = await Category.findOne().sort({ order: -1 }).select('order');
        const order = (maxOrder?.order || 0) + 1;

        const category = await Category.create({
            name,
            slug,
            icon: icon || '📍',
            description,
            order,
        });

        return NextResponse.json({
            success: true,
            data: category,
            message: 'Tạo danh mục thành công!',
        });
    } catch (error) {
        console.error('Admin categories POST error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create category' },
            { status: 500 }
        );
    }
}
