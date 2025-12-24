import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import { Itinerary } from '@/models';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET user's saved itineraries
export async function GET(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Unauthorized' },
                { status: 401 }
            );
        }

        await connectDB();

        const { searchParams } = new URL(request.url);
        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const skip = (page - 1) * limit;

        const [itineraries, total] = await Promise.all([
            Itinerary.find({ userId: session.user.id })
                .populate({
                    path: 'items.destinationId',
                    select: 'name slug images rating',
                })
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            Itinerary.countDocuments({ userId: session.user.id }),
        ]);

        return NextResponse.json({
            success: true,
            data: itineraries,
            pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
        });
    } catch (error) {
        console.error('User itineraries GET error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch itineraries' },
            { status: 500 }
        );
    }
}

// POST save itinerary to user account
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user) {
            return NextResponse.json(
                { success: false, error: 'Vui lòng đăng nhập để lưu lịch trình' },
                { status: 401 }
            );
        }

        await connectDB();
        const { itineraryId } = await request.json();

        // Update itinerary with user ID
        const itinerary = await Itinerary.findByIdAndUpdate(
            itineraryId,
            { userId: session.user.id },
            { new: true }
        );

        if (!itinerary) {
            return NextResponse.json(
                { success: false, error: 'Itinerary not found' },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: itinerary,
            message: 'Đã lưu lịch trình vào tài khoản!',
        });
    } catch (error) {
        console.error('Save itinerary error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to save itinerary' },
            { status: 500 }
        );
    }
}
