// ============================================================
// iTravel - MongoDB Queries
// File này tập hợp các câu truy vấn MongoDB quan trọng nhất
// của dự án. Chạy trong mongosh hoặc MongoDB Compass shell.
// Database: itravel
// ============================================================

// Kết nối vào đúng database trước khi chạy bất kỳ lệnh nào
use('itravel');


// ============================================================
// PHẦN 1: TRUY VẤN CƠ BẢN - USERS
// ============================================================

// Xem tất cả user (bỏ qua trường password cho an toàn)
db.users.find({}, { password: 0 });

// Tìm user theo email - dùng khi đăng nhập hay tra cứu nhanh
db.users.findOne(
    { email: 'admin@itravel.vn' },
    { password: 0 }  // không cần xem password
);

// Đếm số user theo từng role để biết cộng đồng đang có bao nhiêu người
db.users.aggregate([
    {
        $group: {
            _id: '$role',
            soLuong: { $sum: 1 }
        }
    }
]);

// Tìm user được tạo trong 30 ngày gần đây - theo dõi tốc độ tăng trưởng
db.users.find({
    createdAt: {
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    }
}, { password: 0 }).sort({ createdAt: -1 });

// Những user có nhiều địa điểm yêu thích nhất
db.users.aggregate([
    {
        $project: {
            name: 1,
            email: 1,
            soYeuThich: { $size: '$favorites' }
        }
    },
    { $sort: { soYeuThich: -1 } },
    { $limit: 10 }
]);

// Đổi role của một user lên admin (dùng khi cấp quyền)
db.users.updateOne(
    { email: 'user@itravel.vn' },
    { $set: { role: 'admin' } }
);


// ============================================================
// PHẦN 2: TRUY VẤN ĐỊA ĐIỂM - DESTINATIONS
// ============================================================

// Lấy tất cả địa điểm đang hiển thị, sắp xếp theo rating từ cao xuống
db.destinations.find(
    { isActive: true },
    { name: 1, rating: 1, reviewCount: 1, provinceId: 1, categoryId: 1 }
).sort({ rating: -1 });

// Tìm kiếm địa điểm bằng text search
db.destinations.find(
    { $text: { $search: 'Vịnh Hạ Long' } },
    { score: { $meta: 'textScore' } }
).sort({ score: { $meta: 'textScore' } });

// Lấy địa điểm kèm thông tin đầy đủ về danh mục và tỉnh thành
db.destinations.aggregate([
    { $match: { isActive: true } },
    {
        $lookup: {
            from: 'categories',
            localField: 'categoryId',
            foreignField: '_id',
            as: 'category'
        }
    },
    {
        $lookup: {
            from: 'provinces',
            localField: 'provinceId',
            foreignField: '_id',
            as: 'province'
        }
    },
    { $unwind: '$category' },
    { $unwind: '$province' },
    {
        $project: {
            name: 1,
            slug: 1,
            shortDescription: 1,
            rating: 1,
            reviewCount: 1,
            priceRange: 1,
            'images': { $arrayElemAt: ['$images', 0] },  // chỉ lấy ảnh đầu tiên
            'category.name': 1,
            'category.icon': 1,
            'province.name': 1,
            'province.region': 1
        }
    },
    { $sort: { rating: -1 } }
]);

// Top 10 địa điểm có rating cao nhất - dùng cho trang chủ
db.destinations.find(
    { isActive: true, rating: { $gte: 4.0 } },
    { name: 1, slug: 1, rating: 1, reviewCount: 1, images: { $slice: 1 } }
).sort({ rating: -1, reviewCount: -1 }).limit(10);

// Lọc địa điểm theo khoảng giá phù hợp ngân sách người dùng
// Ví dụ: tìm địa điểm có giá trung bình dưới 2 triệu/người
db.destinations.find({
    isActive: true,
    $expr: {
        $lte: [
            { $divide: [{ $add: ['$priceRange.min', '$priceRange.max'] }, 2] },
            2000000
        ]
    }
});

// Địa điểm thuộc miền nào - join với provinces để biết region
db.destinations.aggregate([
    {
        $lookup: {
            from: 'provinces',
            localField: 'provinceId',
            foreignField: '_id',
            as: 'province'
        }
    },
    { $unwind: '$province' },
    {
        $group: {
            _id: '$province.region',
            soLuong: { $sum: 1 },
            ratingTrungBinh: { $avg: '$rating' }
        }
    }
]);

// Thêm một địa điểm mới vào hệ thống
db.destinations.insertOne({
    name: 'Bãi Biển Mỹ Khê',
    slug: 'bai-bien-my-khe',
    categoryId: ObjectId('...'),  // lấy từ collection categories
    provinceId: ObjectId('...'),  // lấy từ collection provinces
    description: 'Một trong những bãi biển đẹp nhất Đà Nẵng với bãi cát trắng kéo dài.',
    shortDescription: 'Bãi cát trắng mịn, nước trong xanh, phù hợp tắm biển và nghỉ dưỡng.',
    images: [
        'https://images.unsplash.com/photo-...'
    ],
    priceRange: { min: 200000, max: 800000, currency: 'VND' },
    bestTime: ['Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 8', 'Tháng 9'],
    duration: 'Nửa ngày đến 1 ngày',
    location: {
        address: 'Quận Sơn Trà, Đà Nẵng',
        coordinates: { lat: 16.0669, lng: 108.247 }
    },
    amenities: ['Bãi tắm', 'Quán ăn', 'Cho thuê dù', 'Gửi xe'],
    rating: 0,
    reviewCount: 0,
    viewCount: 0,
    isActive: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date()
});


// ============================================================
// PHẦN 3: TRUY VẤN ĐÁNH GIÁ - REVIEWS
// ============================================================
db.reviews.aggregate([
    { $match: { isApproved: false } },
    {
        $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
        }
    },
    {
        $lookup: {
            from: 'destinations',
            localField: 'destinationId',
            foreignField: '_id',
            as: 'destination'
        }
    },
    { $unwind: '$user' },
    { $unwind: '$destination' },
    {
        $project: {
            rating: 1,
            title: 1,
            comment: 1,
            createdAt: 1,
            'user.name': 1,
            'user.email': 1,
            'destination.name': 1
        }
    },
    { $sort: { createdAt: -1 } }
]);

// Lấy tất cả đánh giá đã duyệt của một địa điểm cụ thể
// Đây là query chạy khi user mở trang chi tiết địa điểm
db.reviews.aggregate([
    {
        $match: {
            destinationId: ObjectId('...'),  // thay bằng ID địa điểm thực
            isApproved: true
        }
    },
    {
        $lookup: {
            from: 'users',
            localField: 'userId',
            foreignField: '_id',
            as: 'user'
        }
    },
    { $unwind: '$user' },
    {
        $project: {
            rating: 1,
            title: 1,
            comment: 1,
            images: 1,
            createdAt: 1,
            'user.name': 1,
            'user.avatar': 1
        }
    },
    { $sort: { createdAt: -1 } }
]);

// Thống kê phân phối rating của một địa điểm (bao nhiêu 5 sao, 4 sao...)
db.reviews.aggregate([
    {
        $match: {
            destinationId: ObjectId('...'),
            isApproved: true
        }
    },
    {
        $group: {
            _id: '$rating',
            soLuong: { $sum: 1 }
        }
    },
    { $sort: { _id: -1 } }
]);

// Duyệt một đánh giá (admin approves)
db.reviews.updateOne(
    { _id: ObjectId('...') },
    {
        $set: {
            isApproved: true,
            updatedAt: new Date()
        }
    }
);

// Cập nhật lại rating trung bình của địa điểm sau khi có review mới được duyệt
// Query này chạy sau khi approve một review
db.reviews.aggregate([
    {
        $match: {
            destinationId: ObjectId('...'),
            isApproved: true
        }
    },
    {
        $group: {
            _id: '$destinationId',
            ratingTrungBinh: { $avg: '$rating' },
            tongSoReview: { $sum: 1 }
        }
    }
]).forEach(result => {
    db.destinations.updateOne(
        { _id: result._id },
        {
            $set: {
                rating: Math.round(result.ratingTrungBinh * 10) / 10,
                reviewCount: result.tongSoReview
            }
        }
    );
});


// ============================================================
// PHẦN 4: TRUY VẤN LỊCH TRÌNH AI - ITINERARIES
// ============================================================

// Xem lịch sử lịch trình của một user cụ thể
db.itineraries.find(
    { userId: ObjectId('...') }
).sort({ createdAt: -1 });

// Thống kê: bao nhiêu lịch trình được AI tạo, bao nhiêu dùng fallback
db.itineraries.aggregate([
    {
        $group: {
            _id: '$isAIGenerated',
            soLuong: { $sum: 1 },
            nganSachTrungBinh: { $avg: '$budget' }
        }
    }
]);

// Sở thích phổ biến nhất người dùng chọn khi tạo lịch trình
db.itineraries.aggregate([
    { $unwind: '$preferences' },
    {
        $group: {
            _id: '$preferences',
            soLuot: { $sum: 1 }
        }
    },
    { $sort: { soLuot: -1 } }
]);

// Lấy lịch trình kèm thông tin đầy đủ của các địa điểm trong từng ngày
db.itineraries.aggregate([
    { $match: { _id: ObjectId('...') } },
    { $unwind: '$items' },
    {
        $lookup: {
            from: 'destinations',
            localField: 'items.destinationId',
            foreignField: '_id',
            as: 'items.destination'
        }
    },
    { $unwind: '$items.destination' },
    {
        $group: {
            _id: '$_id',
            title: { $first: '$title' },
            budget: { $first: '$budget' },
            days: { $first: '$days' },
            travelers: { $first: '$travelers' },
            totalEstimatedCost: { $first: '$totalEstimatedCost' },
            isAIGenerated: { $first: '$isAIGenerated' },
            items: { $push: '$items' }
        }
    }
]);

// Phạm vi ngân sách phổ biến khi người dùng tạo lịch trình
db.itineraries.aggregate([
    {
        $bucket: {
            groupBy: '$budget',
            boundaries: [0, 1000000, 3000000, 5000000, 10000000, 50000000],
            default: 'Trên 50 triệu',
            output: {
                soLuot: { $sum: 1 },
                nganSachTrungBinh: { $avg: '$budget' }
            }
        }
    }
]);


// ============================================================
// PHẦN 5: TRUY VẤN CHUYẾN ĐI - TRIPS
// ============================================================

// Xem tất cả chuyến đi của một user kèm tên địa điểm
db.trips.aggregate([
    { $match: { userId: ObjectId('...') } },
    { $unwind: { path: '$destinations', preserveNullAndEmptyArrays: true } },
    {
        $lookup: {
            from: 'destinations',
            localField: 'destinations.destinationId',
            foreignField: '_id',
            as: 'destinations.info'
        }
    },
    {
        $group: {
            _id: '$_id',
            name: { $first: '$name' },
            status: { $first: '$status' },
            startDate: { $first: '$startDate' },
            endDate: { $first: '$endDate' },
            budget: { $first: '$budget' },
            destinations: { $push: '$destinations' }
        }
    }
]);

// Thống kê trip theo trạng thái
db.trips.aggregate([
    {
        $group: {
            _id: '$status',
            soLuong: { $sum: 1 }
        }
    }
]);


// ============================================================
// PHẦN 6: THỐNG KÊ TỔNG QUAN - DASHBOARD ADMIN
// ============================================================

// Thống kê tổng hợp để hiển thị trên trang Admin Dashboard
// Mỗi lần chạy cho ra một bức tranh toàn cảnh của hệ thống

// Tổng số theo từng collection
db.destinations.countDocuments({ isActive: true });
db.categories.countDocuments({ isActive: true });
db.provinces.countDocuments({ isActive: true });
db.users.countDocuments();
db.reviews.countDocuments({ isApproved: true });

// Tổng lượt xem của toàn bộ địa điểm
db.destinations.aggregate([
    { $group: { _id: null, tongLuotXem: { $sum: '$viewCount' } } }
]);

// Địa điểm được xem nhiều nhất
db.destinations.find(
    { isActive: true },
    { name: 1, viewCount: 1, rating: 1 }
).sort({ viewCount: -1 }).limit(5);

// Người dùng vừa tham gia (30 ngày gần nhất)
db.users.countDocuments({
    createdAt: { $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
});

// Tỷ lệ đánh giá đang chờ duyệt / tổng đánh giá
db.reviews.aggregate([
    {
        $group: {
            _id: '$isApproved',
            soLuong: { $sum: 1 }
        }
    }
]);


// ============================================================
// PHẦN 7: TẠO INDEX - QUAN TRỌNG CHO HIỆU SUẤT
// ============================================================

// Text index để tìm kiếm địa điểm theo từ khóa (tiếng Việt)
// Phải tạo cái này trước khi dùng $text search
db.destinations.createIndex(
    { name: 'text', description: 'text', shortDescription: 'text' },
    { name: 'destination_text_search_index' }
);

// Compound index cho lọc theo danh mục + tỉnh + trạng thái
// Giúp trang danh sách địa điểm load nhanh hơn
db.destinations.createIndex(
    { categoryId: 1, provinceId: 1, isActive: 1 }
);

// Index cho truy vấn địa điểm nổi bật trên trang chủ
db.destinations.createIndex(
    { isFeatured: 1, rating: -1 }
);

// Index cho review - thường query theo destinationId + isApproved
db.reviews.createIndex(
    { destinationId: 1, isApproved: 1, createdAt: -1 }
);

// Index cho user - tìm theo email (dùng hàng ngày khi đăng nhập)
db.users.createIndex(
    { email: 1 },
    { unique: true }  // đảm bảo không có email trùng
);

// Index cho itinerary - xem lịch sử của một user
db.itineraries.createIndex(
    { userId: 1, createdAt: -1 }
);

// Index cho trip - xem chuyến đi của một user
db.trips.createIndex(
    { userId: 1, status: 1 }
);

// Xem tất cả index hiện có của một collection
db.destinations.getIndexes();


// ============================================================
// PHẦN 8: MAINTENANCE - VỆ SINH DỮ LIỆU
// ============================================================

// Tăng viewCount khi user mở trang chi tiết địa điểm
// API gọi lệnh này mỗi khi có người xem
db.destinations.updateOne(
    { slug: 'vinh-ha-long' },
    { $inc: { viewCount: 1 } }
);

// Xóa các lịch trình không có userId (khách chưa đăng nhập tạo)
// Có thể chạy định kỳ để dọn dữ liệu rác
db.itineraries.deleteMany({ userId: { $exists: false } });

// Xóa review bị spam (rating 1 sao, comment quá ngắn, chưa được duyệt)
db.reviews.deleteMany({
    isApproved: false,
    $expr: { $lt: [{ $strLenCP: '$comment' }, 10] }
});

// Tìm địa điểm có nhiều review nhưng chưa cập nhật rating
// Dùng khi cần sync lại dữ liệu
db.reviews.aggregate([
    { $match: { isApproved: true } },
    {
        $group: {
            _id: '$destinationId',
            ratingTrungBinh: { $avg: '$rating' },
            tongSoReview: { $sum: 1 }
        }
    }
]).forEach(result => {
    db.destinations.updateOne(
        { _id: result._id },
        {
            $set: {
                rating: parseFloat(result.ratingTrungBinh.toFixed(1)),
                reviewCount: result.tongSoReview,
                updatedAt: new Date()
            }
        }
    );
});
