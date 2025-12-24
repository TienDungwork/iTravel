import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import { Destination } from '@/models';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET all destinations (admin)
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user || session.user.role !== 'admin') {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '20');
        const skip = (page - 1) * limit;

        const [destinations, total] = await Promise.all([
            Destination.find()
                .populate('categoryId', 'name slug')
                .populate('provinceId', 'name code')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Destination.countDocuments(),
        ]);

        return NextResponse.json({
            success: true,
            data: destinations,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error('Admin destinations GET error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch destinations' },
            { status: 500 }
        );
    }
}

// POST create new destination
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
        const body = await request.json();

        // Generate slug from name
        const slug = body.name
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/đ/g, 'd')
            .replace(/Đ/g, 'D')
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');

        // Check if slug exists
        const existing = await Destination.findOne({ slug });
        if (existing) {
            return NextResponse.json(
                { success: false, error: 'Địa điểm với tên này đã tồn tại' },
                { status: 400 }
            );
        }

        const destination = await Destination.create({
            ...body,
            slug,
        });

        return NextResponse.json({
            success: true,
            data: destination,
            message: 'Tạo địa điểm thành công!',
        });
    } catch (error) {
        console.error('Admin destinations POST error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create destination' },
            { status: 500 }
        );
    }
}
