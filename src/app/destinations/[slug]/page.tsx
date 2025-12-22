'use client';

import { useState, useEffect, use } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Star, Clock, Calendar, DollarSign, Heart, Share2, ArrowLeft, Check } from 'lucide-react';

interface Destination {
    _id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription: string;
    images: string[];
    priceRange: { min: number; max: number };
    bestTime: string[];
    duration: string;
    rating: number;
    reviewCount: number;
    viewCount: number;
    amenities: string[];
    location: {
        address: string;
        coordinates: { lat: number; lng: number };
    };
    categoryId?: { name: string; icon: string; slug: string };
    provinceId?: { name: string; code: string; region: string };
}

export default function DestinationDetailPage({
    params,
}: {
    params: Promise<{ slug: string }>;
}) {
    const { slug } = use(params);
    const [destination, setDestination] = useState<Destination | null>(null);
    const [related, setRelated] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedImage, setSelectedImage] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch(`/api/destinations/${slug}`);
                const data = await res.json();

                if (data.success) {
                    setDestination(data.data);
                    setRelated(data.related || []);
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [slug]);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="h-96 bg-gray-200 rounded-3xl mb-8" />
                        <div className="grid grid-cols-3 gap-8">
                            <div className="col-span-2 space-y-4">
                                <div className="h-8 bg-gray-200 rounded w-1/2" />
                                <div className="h-4 bg-gray-200 rounded w-1/3" />
                                <div className="h-32 bg-gray-200 rounded" />
                            </div>
                            <div className="h-64 bg-gray-200 rounded-2xl" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!destination) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy địa điểm</h1>
                    <Link href="/destinations" className="text-emerald-600 hover:underline">
                        Quay lại danh sách
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Back Button */}
            <div className="max-w-7xl mx-auto px-4 py-4">
                <Link
                    href="/destinations"
                    className="inline-flex items-center gap-2 text-gray-600 hover:text-emerald-600 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    <span>Quay lại</span>
                </Link>
            </div>

            {/* Image Gallery */}
            <div className="max-w-7xl mx-auto px-4 mb-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Main Image */}
                    <div className="lg:col-span-2 relative h-96 lg:h-[500px] rounded-3xl overflow-hidden">
                        <Image
                            src={destination.images[selectedImage] || 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800'}
                            alt={destination.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

                        {/* Actions */}
                        <div className="absolute top-4 right-4 flex gap-2">
                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`p-3 rounded-full backdrop-blur-sm transition-colors ${isFavorite ? 'bg-red-500 text-white' : 'bg-white/90 text-gray-700 hover:text-red-500'
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-white' : ''}`} />
                            </button>
                            <button className="p-3 bg-white/90 rounded-full backdrop-blur-sm text-gray-700 hover:text-emerald-600 transition-colors">
                                <Share2 className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-3 lg:grid-cols-1 gap-2">
                        {(destination.images.length > 0 ? destination.images : ['https://images.unsplash.com/photo-1528127269322-539801943592?w=400']).slice(0, 3).map((img, index) => (
                            <button
                                key={index}
                                onClick={() => setSelectedImage(index)}
                                className={`relative h-24 lg:h-40 rounded-xl overflow-hidden transition-all ${selectedImage === index ? 'ring-4 ring-emerald-500' : 'opacity-70 hover:opacity-100'
                                    }`}
                            >
                                <Image src={img} alt={`${destination.name} ${index + 1}`} fill className="object-cover" />
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-4 pb-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Header */}
                        <div>
                            <div className="flex items-center gap-3 mb-3">
                                {destination.categoryId && (
                                    <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium">
                                        {destination.categoryId.icon} {destination.categoryId.name}
                                    </span>
                                )}
                                <div className="flex items-center gap-1 text-yellow-500">
                                    <Star className="w-5 h-5 fill-yellow-500" />
                                    <span className="font-semibold">{destination.rating}</span>
                                    <span className="text-gray-500">({destination.reviewCount} đánh giá)</span>
                                </div>
                            </div>
                            <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                                {destination.name}
                            </h1>
                            <div className="flex items-center gap-2 text-gray-600">
                                <MapPin className="w-5 h-5 text-emerald-600" />
                                <span>{destination.location?.address || destination.provinceId?.name}</span>
                            </div>
                        </div>

                        {/* Quick Info */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                                <Clock className="w-6 h-6 mx-auto text-emerald-600 mb-2" />
                                <p className="text-sm text-gray-500">Thời gian</p>
                                <p className="font-semibold text-gray-900">{destination.duration || '2-3 ngày'}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                                <DollarSign className="w-6 h-6 mx-auto text-emerald-600 mb-2" />
                                <p className="text-sm text-gray-500">Từ</p>
                                <p className="font-semibold text-gray-900">{formatPrice(destination.priceRange.min)}đ</p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                                <Calendar className="w-6 h-6 mx-auto text-emerald-600 mb-2" />
                                <p className="text-sm text-gray-500">Thời điểm</p>
                                <p className="font-semibold text-gray-900">{destination.bestTime[0] || 'Quanh năm'}</p>
                            </div>
                            <div className="bg-white rounded-2xl p-4 text-center shadow-sm">
                                <MapPin className="w-6 h-6 mx-auto text-emerald-600 mb-2" />
                                <p className="text-sm text-gray-500">Vùng miền</p>
                                <p className="font-semibold text-gray-900">{destination.provinceId?.region || 'Việt Nam'}</p>
                            </div>
                        </div>

                        {/* Description */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="text-xl font-bold text-gray-900 mb-4">Giới thiệu</h2>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {destination.description}
                            </p>
                        </div>

                        {/* Amenities */}
                        {destination.amenities && destination.amenities.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Tiện ích & Hoạt động</h2>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    {destination.amenities.map((amenity, index) => (
                                        <div key={index} className="flex items-center gap-2 text-gray-700">
                                            <Check className="w-5 h-5 text-emerald-600" />
                                            <span>{amenity}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Best Time */}
                        {destination.bestTime && destination.bestTime.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h2 className="text-xl font-bold text-gray-900 mb-4">Thời điểm lý tưởng</h2>
                                <div className="flex flex-wrap gap-2">
                                    {destination.bestTime.map((time, index) => (
                                        <span key={index} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full font-medium">
                                            {time}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Price Card */}
                        <div className="bg-white rounded-2xl p-6 shadow-lg sticky top-24">
                            <div className="text-center mb-6">
                                <p className="text-gray-500 mb-1">Chi phí tham khảo</p>
                                <div className="text-3xl font-bold text-emerald-600">
                                    {formatPrice(destination.priceRange.min)}đ - {formatPrice(destination.priceRange.max)}đ
                                </div>
                                <p className="text-sm text-gray-400 mt-1">/người</p>
                            </div>

                            <Link
                                href={`/itinerary?destination=${destination.slug}`}
                                className="block w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-500 text-white text-center rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-600 transition-all"
                            >
                                Thêm vào lịch trình
                            </Link>

                            <button
                                onClick={() => setIsFavorite(!isFavorite)}
                                className={`w-full mt-3 py-3 rounded-xl font-semibold transition-colors flex items-center justify-center gap-2 ${isFavorite
                                        ? 'bg-red-50 text-red-600 border border-red-200'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-600' : ''}`} />
                                {isFavorite ? 'Đã yêu thích' : 'Thêm yêu thích'}
                            </button>

                            <div className="mt-6 pt-6 border-t border-gray-100">
                                <p className="text-sm text-gray-500 text-center">
                                    👁️ {destination.viewCount.toLocaleString()} lượt xem
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Related Destinations */}
                {related.length > 0 && (
                    <div className="mt-16">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Địa điểm liên quan</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {related.map((dest) => (
                                <Link key={dest._id} href={`/destinations/${dest.slug}`}>
                                    <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all">
                                        <div className="relative h-40 overflow-hidden">
                                            <Image
                                                src={dest.images[0] || 'https://images.unsplash.com/photo-1528127269322-539801943592?w=400'}
                                                alt={dest.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                        </div>
                                        <div className="p-4">
                                            <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                                {dest.name}
                                            </h3>
                                            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                                <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                                <span>{dest.rating}</span>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
