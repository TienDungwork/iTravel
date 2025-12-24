import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import { Trip } from '@/models';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET user's trips
export async function GET() {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Vui lòng đăng nhập' },
                { status: 401 }
            );
        }

        await connectDB();

        const trips = await Trip.find({ userId: session.user.id })
            .populate({
                path: 'destinations.destinationId',
                select: 'name slug images rating priceRange provinceId',
                populate: { path: 'provinceId', select: 'name' },
            })
            .sort({ updatedAt: -1 })
            .lean();

        return NextResponse.json({
            success: true,
            data: trips,
        });
    } catch (error) {
        console.error('Trips GET error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch trips' },
            { status: 500 }
        );
    }
}

// POST create new trip or add destination to trip
export async function POST(request: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session?.user?.id) {
            return NextResponse.json(
                { success: false, error: 'Vui lòng đăng nhập' },
                { status: 401 }
            );
        }

        await connectDB();
        const { destinationId, tripId, name } = await request.json();

        // If tripId provided, add destination to existing trip
        if (tripId && destinationId) {
            const trip = await Trip.findOne({ _id: tripId, userId: session.user.id });
            if (!trip) {
                return NextResponse.json(
                    { success: false, error: 'Không tìm thấy chuyến đi' },
                    { status: 404 }
                );
            }

            // Check if destination already in trip
            const exists = trip.destinations.some(
                (d) => d.destinationId.toString() === destinationId
            );
            if (exists) {
                return NextResponse.json({
                    success: true,
                    data: trip,
                    message: 'Địa điểm đã có trong chuyến đi',
                });
            }

            trip.destinations.push({
                destinationId,
                order: trip.destinations.length,
            });
            await trip.save();

            return NextResponse.json({
                success: true,
                data: trip,
                message: 'Đã thêm địa điểm vào chuyến đi!',
            });
        }

        // If only destinationId, add to default trip or create new
        if (destinationId) {
            // Find or create default trip
            let trip = await Trip.findOne({
                userId: session.user.id,
                status: 'planning',
            }).sort({ updatedAt: -1 });

            if (!trip) {
                trip = await Trip.create({
                    userId: session.user.id,
                    name: name || 'Chuyến đi của tôi',
                    destinations: [{ destinationId, order: 0 }],
                });
            } else {
                // Check if already exists
                const exists = trip.destinations.some(
                    (d) => d.destinationId.toString() === destinationId
                );
                if (!exists) {
                    trip.destinations.push({
                        destinationId,
                        order: trip.destinations.length,
                    });
                    await trip.save();
                }
            }

            const populatedTrip = await Trip.findById(trip._id)
                .populate({
                    path: 'destinations.destinationId',
                    select: 'name slug images',
                })
                .lean();

            return NextResponse.json({
                success: true,
                data: populatedTrip,
                message: 'Đã thêm vào lịch trình!',
            });
        }

        // Create new empty trip
        const trip = await Trip.create({
            userId: session.user.id,
            name: name || 'Chuyến đi mới',
            destinations: [],
        });

        return NextResponse.json({
            success: true,
            data: trip,
            message: 'Đã tạo chuyến đi mới!',
        });
    } catch (error) {
        console.error('Trips POST error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to create trip' },
            { status: 500 }
        );
    }
}
