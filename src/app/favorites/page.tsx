'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MapPin, Trash2, Star, Clock } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface Destination {
    _id: string;
    name: string;
    slug: string;
    shortDescription: string;
    images: string[];
    priceRange: { min: number; max: number };
    rating: number;
    reviewCount: number;
    duration?: string;
    categoryId?: { name: string; icon: string };
    provinceId?: { name: string };
}

export default function FavoritesPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { showToast } = useToast();
    const [favorites, setFavorites] = useState<Destination[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
            return;
        }

        if (status === 'authenticated') {
            fetchFavorites();
        }
    }, [status, router]);

    const fetchFavorites = async () => {
        try {
            const res = await fetch('/api/favorites');
            const data = await res.json();
            if (data.success) {
                setFavorites(data.data);
            }
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setLoading(false);
        }
    };

    const removeFavorite = async (e: React.MouseEvent, destinationId: string, destName: string) => {
        e.preventDefault();
        e.stopPropagation();
        try {
            const res = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destinationId, action: 'remove' }),
            });
            const data = await res.json();
            if (data.success) {
                setFavorites(favorites.filter(f => f._id !== destinationId));
                showToast('success', `Đã xóa "${destName}" khỏi yêu thích!`);
            }
        } catch (error) {
            console.error('Error removing favorite:', error);
            showToast('error', 'Không thể xóa!');
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-8">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="animate-pulse">
                        <div className="h-8 bg-gray-200 rounded w-48 mb-8" />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[...Array(3)].map((_, i) => (
                                <div key={i} className="bg-white rounded-2xl h-72">
                                    <div className="h-40 bg-gray-200 rounded-t-2xl" />
                                    <div className="p-4 space-y-2">
                                        <div className="h-4 bg-gray-200 rounded w-3/4" />
                                        <div className="h-3 bg-gray-200 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-red-500 to-pink-500 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="flex items-center gap-3 text-white mb-2">
                        <Heart className="w-8 h-8 fill-white" />
                        <h1 className="text-3xl font-bold">Yêu thích của tôi</h1>
                    </div>
                    <p className="text-red-100">
                        {favorites.length > 0
                            ? `${favorites.length} địa điểm đã lưu`
                            : 'Chưa có địa điểm nào'}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {favorites.length === 0 ? (
                    <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
                        <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-bold text-gray-900 mb-2">
                            Chưa có địa điểm yêu thích
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Khám phá và thêm địa điểm vào danh sách yêu thích của bạn
                        </p>
                        <Link
                            href="/destinations"
                            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
                        >
                            <MapPin className="w-5 h-5" />
                            Khám phá địa điểm
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {favorites.map((dest) => (
                            <Link key={dest._id} href={`/destinations/${dest.slug}`}>
                                <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                                    {/* Image */}
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={dest.images[0] || '/images/placeholder.svg'}
                                            alt={dest.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                                        {/* Category Badge */}
                                        {dest.categoryId && (
                                            <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                                                {dest.categoryId.icon} {dest.categoryId.name}
                                            </span>
                                        )}

                                        {/* Favorited Heart (always red since it's in favorites) */}
                                        <div className="absolute top-3 right-3 p-2 bg-red-500 rounded-full">
                                            <Heart className="w-4 h-4 text-white fill-white" />
                                        </div>

                                        {/* Delete Button on Hover */}
                                        <button
                                            onClick={(e) => removeFavorite(e, dest._id, dest.name)}
                                            className="absolute top-3 right-14 p-2 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50"
                                            title="Xóa khỏi yêu thích"
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>

                                        {/* Rating */}
                                        <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                                            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                            <span className="text-sm font-medium">{dest.rating?.toFixed(1) || '0.0'}</span>
                                            <span className="text-xs text-gray-500">({dest.reviewCount || 0})</span>
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-4">
                                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                                            {dest.name}
                                        </h3>

                                        {dest.provinceId && (
                                            <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                                <MapPin className="w-4 h-4" />
                                                <span>{dest.provinceId.name}</span>
                                            </div>
                                        )}

                                        <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                            {dest.shortDescription}
                                        </p>

                                        <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                                            <div>
                                                <span className="text-xs text-gray-500">Từ</span>
                                                <p className="text-emerald-600 font-bold">
                                                    {formatPrice(dest.priceRange?.min || 0)}đ
                                                </p>
                                            </div>

                                            {dest.duration && (
                                                <div className="flex items-center gap-1 text-gray-500 text-sm">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{dest.duration}</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
