import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { connectDB } from '@/lib/db';
import { Destination, Category, Province, User, Review, Itinerary } from '@/models';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

// GET dashboard stats
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

        // Get all stats in parallel
        const [
            destinationCount,
            categoryCount,
            provinceCount,
            userCount,
            reviewCount,
            itineraryCount,
            totalViews,
            recentDestinations,
            recentUsers,
            recentReviews,
            destinationsByCategory,
        ] = await Promise.all([
            Destination.countDocuments(),
            Category.countDocuments(),
            Province.countDocuments(),
            User.countDocuments(),
            Review.countDocuments(),
            Itinerary.countDocuments(),
            Destination.aggregate([
                { $group: { _id: null, total: { $sum: '$viewCount' } } }
            ]),
            Destination.find()
                .populate('categoryId', 'name icon')
                .populate('provinceId', 'name')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
            User.find()
                .select('-password')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
            Review.find()
                .populate('userId', 'name')
                .populate('destinationId', 'name')
                .sort({ createdAt: -1 })
                .limit(5)
                .lean(),
            Destination.aggregate([
                { $group: { _id: '$categoryId', count: { $sum: 1 } } },
                {
                    $lookup: {
                        from: 'categories',
                        localField: '_id',
                        foreignField: '_id',
                        as: 'category'
                    }
                },
                { $unwind: '$category' },
                { $project: { name: '$category.name', icon: '$category.icon', count: 1 } }
            ]),
        ]);

        return NextResponse.json({
            success: true,
            data: {
                stats: {
                    destinations: destinationCount,
                    categories: categoryCount,
                    provinces: provinceCount,
                    users: userCount,
                    reviews: reviewCount,
                    itineraries: itineraryCount,
                    totalViews: totalViews[0]?.total || 0,
                },
                recent: {
                    destinations: recentDestinations,
                    users: recentUsers,
                    reviews: recentReviews,
                },
                charts: {
                    destinationsByCategory,
                },
            },
        });
    } catch (error) {
        console.error('Admin stats GET error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to fetch stats' },
            { status: 500 }
        );
    }
}
