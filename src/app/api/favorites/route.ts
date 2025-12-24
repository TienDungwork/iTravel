import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import { User } from '@/models';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET user favorites
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
            .populate({
                path: 'favorites',
                populate: [
                    { path: 'categoryId', select: 'name icon' },
                    { path: 'provinceId', select: 'name' },
                ],
            })
            .lean();

        return NextResponse.json({
            success: true,
            data: user?.favorites || [],
        });
    } catch (error) {
        console.error('Favorites GET error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch favorites' },
            { status: 500 }
        );
    }
}

// POST add/remove favorite
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        console.log('Favorites API - Session:', JSON.stringify(session, null, 2));

        if (!session?.user?.id) {
            console.log('Favorites API - No session or user id found');
            return NextResponse.json(
                { success: false, error: 'Vui lòng đăng nhập' },
                { status: 401 }
            );
        }

        await connectDB();
        const { destinationId, action } = await request.json();

        if (!destinationId) {
            return NextResponse.json(
                { success: false, error: 'Missing destinationId' },
                { status: 400 }
            );
        }

        const user = await User.findById(session.user.id);
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'User not found' },
                { status: 404 }
            );
        }

        const isFavorited = user.favorites.includes(destinationId);

        if (action === 'add' && !isFavorited) {
            user.favorites.push(destinationId);
            await user.save();
            return NextResponse.json({ success: true, isFavorited: true, message: 'Đã thêm vào yêu thích' });
        } else if (action === 'remove' && isFavorited) {
            user.favorites = user.favorites.filter((id) => id.toString() !== destinationId);
            await user.save();
            return NextResponse.json({ success: true, isFavorited: false, message: 'Đã xóa khỏi yêu thích' });
        } else if (!action) {
            // Toggle if no action specified
            if (isFavorited) {
                user.favorites = user.favorites.filter((id) => id.toString() !== destinationId);
                await user.save();
                return NextResponse.json({ success: true, isFavorited: false, message: 'Đã xóa khỏi yêu thích' });
            } else {
                user.favorites.push(destinationId);
                await user.save();
                return NextResponse.json({ success: true, isFavorited: true, message: 'Đã thêm vào yêu thích' });
            }
        }

        return NextResponse.json({
            success: true,
            isFavorited,
        });
    } catch (error) {
        console.error('Favorites POST error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to update favorites' },
            { status: 500 }
        );
    }
}
