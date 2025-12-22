import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Category } from '@/models';

export async function GET() {
    try {
        await connectDB();

        const categories = await Category.find({ isActive: true })
            .sort({ order: 1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: categories,
        });
    } catch (error) {
        console.error('Categories API error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch categories' },
            { status: 500 }
        );
    }
}
