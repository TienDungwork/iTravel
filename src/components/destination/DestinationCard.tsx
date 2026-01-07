'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Clock, Heart } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';
import { CategoryIcon } from '@/components/ui/CategoryIcon';

interface DestinationCardProps {
    destination: {
        _id: string;
        name: string;
        slug: string;
        shortDescription: string;
        images: string[];
        priceRange: {
            min: number;
            max: number;
        };
        rating: number;
        reviewCount: number;
        duration?: string;
        categoryId?: {
            name: string;
            icon: string;
        };
        provinceId?: {
            name: string;
        };
    };
    isFavorite?: boolean;
}

export function DestinationCard({ destination, isFavorite: initialFavorite = false }: DestinationCardProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const { showToast } = useToast();
    const [isFavorite, setIsFavorite] = useState(initialFavorite);
    const [isLoading, setIsLoading] = useState(false);

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const handleFavoriteClick = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!session) {
            showToast('info', 'Vui lòng đăng nhập để thêm yêu thích!');
            router.push('/auth/login');
            return;
        }

        setIsLoading(true);
        try {
            const res = await fetch('/api/favorites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destinationId: destination._id }),
            });

            if (res.ok) {
                const newState = !isFavorite;
                setIsFavorite(newState);
                showToast('success', newState ? 'Đã thêm vào yêu thích!' : 'Đã xóa khỏi yêu thích!');
            } else {
                showToast('error', 'Có lỗi xảy ra!');
            }
        } catch {
            showToast('error', 'Có lỗi xảy ra!');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Link href={`/destinations/${destination.slug}`}>
            <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src={destination.images[0] || '/images/placeholder.svg'}
                        alt={destination.name}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Category Badge */}
                    {destination.categoryId && (
                        <span className="absolute top-3 left-3 px-3 py-1.5 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700 flex items-center gap-1.5">
                            <CategoryIcon iconName={destination.categoryId.icon} className="w-4 h-4 text-emerald-600" />
                            {destination.categoryId.name}
                        </span>
                    )}

                    {/* Favorite Button */}
                    <button
                        className={`absolute top-3 right-3 p-2 backdrop-blur-sm rounded-full transition-all ${isFavorite
                            ? 'bg-red-500 text-white'
                            : 'bg-white/90 hover:bg-white text-gray-600 hover:text-red-500'
                            } ${isLoading ? 'opacity-50' : ''}`}
                        onClick={handleFavoriteClick}
                        disabled={isLoading}
                    >
                        <Heart className={`w-4 h-4 ${isFavorite ? 'fill-white' : ''}`} />
                    </button>

                    {/* Rating */}
                    <div className="absolute bottom-3 left-3 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                        <span className="text-sm font-medium">{destination.rating.toFixed(1)}</span>
                        <span className="text-xs text-gray-500">({destination.reviewCount})</span>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4">
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-emerald-600 transition-colors line-clamp-1">
                        {destination.name}
                    </h3>

                    {destination.provinceId && (
                        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                            <MapPin className="w-4 h-4" />
                            <span>{destination.provinceId.name}</span>
                        </div>
                    )}

                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                        {destination.shortDescription}
                    </p>

                    <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                        <div>
                            <span className="text-xs text-gray-500">Từ</span>
                            <p className="text-emerald-600 font-bold">
                                {formatPrice(destination.priceRange.min)}đ
                            </p>
                        </div>

                        {destination.duration && (
                            <div className="flex items-center gap-1 text-gray-500 text-sm">
                                <Clock className="w-4 h-4" />
                                <span>{destination.duration}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
}
