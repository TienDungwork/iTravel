import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import { Category, Destination } from '@/models';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// PUT update category
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
        const { name, icon, description, isActive } = await request.json();

        const category = await Category.findByIdAndUpdate(
            id,
            { $set: { name, icon, description, isActive } },
            { new: true }
        );

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: category,
            message: 'Cập nhật danh mục thành công!',
        });
    } catch (error) {
        console.error('Admin category PUT error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update category' },
            { status: 500 }
        );
    }
}

// DELETE category
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

        // Check if category has destinations
        const destinationCount = await Destination.countDocuments({ categoryId: id });
        if (destinationCount > 0) {
            return NextResponse.json(
                { success: false, error: `Không thể xóa: có ${destinationCount} địa điểm thuộc danh mục này` },
                { status: 400 }
            );
        }

        const category = await Category.findByIdAndDelete(id);

        if (!category) {
            return NextResponse.json(
                { success: false, error: 'Category not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            message: 'Xóa danh mục thành công!',
        });
    } catch (error) {
        console.error('Admin category DELETE error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to delete category' },
            { status: 500 }
        );
    }
}
