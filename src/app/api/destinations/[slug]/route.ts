import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Destination } from '@/models';

export async function GET(
    request: NextRequest,
    { params }: { params: Promise<{ slug: string }> }
) {
    try {
        await connectDB();
        const { slug } = await params;

        const destination = await Destination.findOneAndUpdate(
            { slug, isActive: true },
            { $inc: { viewCount: 1 } },
            { new: true }
        )
            .populate('categoryId', 'name slug icon')
            .populate('provinceId', 'name code region')
            .lean();

        if (!destination) {
            return NextResponse.json(
                { success: false, error: 'Destination not found' },
                { status: 404 }
            );
        }

        // Get related destinations
        const related = await Destination.find({
            _id: { $ne: destination._id },
            $or: [
                { categoryId: destination.categoryId },
                { provinceId: destination.provinceId },
            ],
            isActive: true,
        })
            .populate('categoryId', 'name slug icon')
            .populate('provinceId', 'name code')
            .limit(4)
            .lean();

        return NextResponse.json({
            success: true,
            data: destination,
            related,
        });
    } catch (error) {
        console.error('Destination detail API error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch destination' },
            { status: 500 }
        );
    }
}
