import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/db';
import { Category, Province, Destination, User, Review } from '@/models';

const seedCategories = [
    { name: 'Biển đảo', slug: 'bien-dao', icon: '🏖️', description: 'Du lịch biển, đảo', order: 1 },
    { name: 'Núi rừng', slug: 'nui-rung', icon: '🏔️', description: 'Du lịch núi, trekking', order: 2 },
    { name: 'Tâm linh', slug: 'tam-linh', icon: '🛕', description: 'Du lịch tâm linh, chùa chiền', order: 3 },
    { name: 'Di tích lịch sử', slug: 'di-tich', icon: '🏛️', description: 'Di tích, bảo tàng', order: 4 },
    { name: 'Sinh thái', slug: 'sinh-thai', icon: '🌿', description: 'Du lịch sinh thái, nghỉ dưỡng', order: 5 },
    { name: 'Đô thị', slug: 'do-thi', icon: '🏙️', description: 'Du lịch thành phố', order: 6 },
];

const seedProvinces = [
    { name: 'Hà Nội', code: 'HN', region: 'Bắc' as const },
    { name: 'Hồ Chí Minh', code: 'HCM', region: 'Nam' as const },
    { name: 'Đà Nẵng', code: 'DN', region: 'Trung' as const },
    { name: 'Quảng Ninh', code: 'QN', region: 'Bắc' as const },
    { name: 'Khánh Hòa', code: 'KH', region: 'Trung' as const },
    { name: 'Lào Cai', code: 'LC', region: 'Bắc' as const },
    { name: 'Thừa Thiên Huế', code: 'TTH', region: 'Trung' as const },
    { name: 'Kiên Giang', code: 'KG', region: 'Nam' as const },
    { name: 'Lâm Đồng', code: 'LD', region: 'Trung' as const },
    { name: 'Bình Thuận', code: 'BTH', region: 'Trung' as const },
];

const seedUsers = [
    { name: 'Admin', email: 'admin@itravel.vn', password: '123456', role: 'admin' as const },
    { name: 'User Demo', email: 'user@itravel.vn', password: '123456', role: 'user' as const },
];

export async function POST() {
    try {
        await connectDB();

        // Clear existing data
        await Category.deleteMany({});
        await Province.deleteMany({});
        await Destination.deleteMany({});
        await User.deleteMany({});
        await Review.deleteMany({});

        // Seed categories
        const categories = await Category.insertMany(seedCategories);

        // Seed provinces
        const provinces = await Province.insertMany(seedProvinces);

        // Get IDs for destinations
        const getCatId = (slug: string) => categories.find(c => c.slug === slug)?._id;
        const getProvId = (code: string) => provinces.find(p => p.code === code)?._id;

        // Seed destinations
        const seedDestinations = [
            {
                name: 'Vịnh Hạ Long',
                slug: 'vinh-ha-long',
                categoryId: getCatId('bien-dao'),
                provinceId: getProvId('QN'),
                description: 'Vịnh Hạ Long là một vịnh nhỏ thuộc phần bờ Tây vịnh Bắc Bộ tại khu vực biển Đông Bắc Việt Nam, được UNESCO công nhận là Di sản thiên nhiên thế giới. Vịnh có diện tích khoảng 1.553 km² bao gồm 1.969 hòn đảo lớn nhỏ, phần lớn là đảo đá vôi. Đây là điểm đến không thể bỏ qua khi du lịch Việt Nam.',
                shortDescription: 'Di sản thiên nhiên thế giới với hàng nghìn đảo đá vôi',
                images: [
                    'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
                    'https://images.unsplash.com/photo-1573790387438-4da905039392?w=800'
                ],
                priceRange: { min: 1500000, max: 5000000, currency: 'VND' },
                bestTime: ['Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 9', 'Tháng 10'],
                duration: '2-3 ngày',
                location: { address: 'Thành phố Hạ Long, Quảng Ninh', coordinates: { lat: 20.9101, lng: 107.1839 } },
                amenities: ['Du thuyền', 'Kayak', 'Hang động', 'Bơi lội'],
                rating: 4.8,
                reviewCount: 1250,
                isFeatured: true,
            },
            {
                name: 'Đà Lạt',
                slug: 'da-lat',
                categoryId: getCatId('nui-rung'),
                provinceId: getProvId('LD'),
                description: 'Đà Lạt là thành phố trực thuộc tỉnh Lâm Đồng, nằm trên cao nguyên Lâm Viên. Được mệnh danh là "thành phố ngàn hoa" với khí hậu mát mẻ quanh năm. Nơi đây có những đồi thông, hồ nước thơ mộng và kiến trúc Pháp cổ kính.',
                shortDescription: 'Thành phố ngàn hoa với khí hậu mát mẻ',
                images: [
                    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800',
                    'https://images.unsplash.com/photo-1570366805577-f5e4cc5e0f72?w=800'
                ],
                priceRange: { min: 800000, max: 3000000, currency: 'VND' },
                bestTime: ['Tháng 12', 'Tháng 1', 'Tháng 2', 'Tháng 3'],
                duration: '3-4 ngày',
                location: { address: 'Thành phố Đà Lạt, Lâm Đồng', coordinates: { lat: 11.9404, lng: 108.4583 } },
                amenities: ['Cắm trại', 'Tham quan', 'Cafe', 'Thác nước'],
                rating: 4.7,
                reviewCount: 980,
                isFeatured: true,
            },
            {
                name: 'Phú Quốc',
                slug: 'phu-quoc',
                categoryId: getCatId('bien-dao'),
                provinceId: getProvId('KG'),
                description: 'Phú Quốc là hòn đảo lớn nhất Việt Nam, nổi tiếng với bãi biển đẹp, nước biển trong xanh và hải sản tươi ngon. Đảo có hệ sinh thái đa dạng với rừng nguyên sinh và các bãi biển hoang sơ.',
                shortDescription: 'Đảo ngọc với biển xanh cát trắng',
                images: [
                    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
                    'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800'
                ],
                priceRange: { min: 2000000, max: 8000000, currency: 'VND' },
                bestTime: ['Tháng 11', 'Tháng 12', 'Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4'],
                duration: '3-5 ngày',
                location: { address: 'Huyện Phú Quốc, Kiên Giang', coordinates: { lat: 10.2899, lng: 103.9840 } },
                amenities: ['Lặn biển', 'Câu cá', 'Safari', 'Vinwonders'],
                rating: 4.6,
                reviewCount: 1520,
                isFeatured: true,
            },
            {
                name: 'Sapa',
                slug: 'sapa',
                categoryId: getCatId('nui-rung'),
                provinceId: getProvId('LC'),
                description: 'Sa Pa là thị xã vùng cao thuộc tỉnh Lào Cai, nổi tiếng với ruộng bậc thang, núi Fansipan và văn hóa dân tộc thiểu số đặc sắc. Khí hậu mát mẻ quanh năm, có khi có tuyết rơi vào mùa đông.',
                shortDescription: 'Vùng núi với ruộng bậc thang tuyệt đẹp',
                images: [
                    'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=800',
                    'https://images.unsplash.com/photo-1534008897995-27a23e859048?w=800'
                ],
                priceRange: { min: 1000000, max: 4000000, currency: 'VND' },
                bestTime: ['Tháng 9', 'Tháng 10', 'Tháng 3', 'Tháng 4', 'Tháng 5'],
                duration: '2-4 ngày',
                location: { address: 'Thị xã Sa Pa, Lào Cai', coordinates: { lat: 22.3364, lng: 103.8438 } },
                amenities: ['Trekking', 'Homestay', 'Cáp treo Fansipan', 'Chợ phiên'],
                rating: 4.7,
                reviewCount: 890,
                isFeatured: true,
            },
            {
                name: 'Cố đô Huế',
                slug: 'co-do-hue',
                categoryId: getCatId('di-tich'),
                provinceId: getProvId('TTH'),
                description: 'Huế là cố đô của Việt Nam thời nhà Nguyễn, nổi tiếng với quần thể di tích cung đình, lăng tẩm và ẩm thực đặc sắc. Thành phố bên dòng sông Hương thơ mộng với những công trình kiến trúc cổ kính.',
                shortDescription: 'Cố đô với di sản văn hóa thế giới',
                images: [
                    'https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?w=800',
                    'https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800'
                ],
                priceRange: { min: 600000, max: 2500000, currency: 'VND' },
                bestTime: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4'],
                duration: '2-3 ngày',
                location: { address: 'Thành phố Huế, Thừa Thiên Huế', coordinates: { lat: 16.4637, lng: 107.5909 } },
                amenities: ['Tham quan di tích', 'Sông Hương', 'Ẩm thực Huế', 'Áo dài'],
                rating: 4.5,
                reviewCount: 720,
                isFeatured: true,
            },
            {
                name: 'Nha Trang',
                slug: 'nha-trang',
                categoryId: getCatId('bien-dao'),
                provinceId: getProvId('KH'),
                description: 'Nha Trang là thành phố biển nổi tiếng với bãi biển đẹp, hải sản tươi ngon và các hoạt động vui chơi giải trí đa dạng. Đây là điểm đến lý tưởng cho kỳ nghỉ biển với khí hậu nắng ấm quanh năm.',
                shortDescription: 'Thành phố biển với nhiều hoạt động giải trí',
                images: [
                    'https://images.unsplash.com/photo-1540541338287-41700207dee6?w=800',
                    'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'
                ],
                priceRange: { min: 1200000, max: 4500000, currency: 'VND' },
                bestTime: ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8'],
                duration: '3-5 ngày',
                location: { address: 'Thành phố Nha Trang, Khánh Hòa', coordinates: { lat: 12.2388, lng: 109.1967 } },
                amenities: ['Lặn biển', 'Vinpearl', 'Tháp Bà Ponagar', 'Hải sản'],
                rating: 4.5,
                reviewCount: 1100,
                isFeatured: false,
            },
        ];

        await Destination.insertMany(seedDestinations);

        // Seed users
        for (const userData of seedUsers) {
            await User.create(userData);
        }

        return NextResponse.json({
            success: true,
            message: 'Database seeded successfully',
            data: {
                categories: categories.length,
                provinces: provinces.length,
                destinations: seedDestinations.length,
                users: seedUsers.length,
            },
        });
    } catch (error) {
        console.error('Seed error:', error);
        return NextResponse.json(
            { success: false, error: 'Failed to seed database' },
            { status: 500 }
        );
    }
}

