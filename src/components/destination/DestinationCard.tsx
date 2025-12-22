import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Star, Clock, Heart } from 'lucide-react';

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
}

export function DestinationCard({ destination }: DestinationCardProps) {
    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    return (
        <Link href={`/destinations/${destination.slug}`}>
            <div className="group bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src={destination.images[0] || '/images/placeholder.jpg'}
                        alt={destination.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

                    {/* Category Badge */}
                    {destination.categoryId && (
                        <span className="absolute top-3 left-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-gray-700">
                            {destination.categoryId.icon} {destination.categoryId.name}
                        </span>
                    )}

                    {/* Favorite Button */}
                    <button
                        className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-sm rounded-full hover:bg-white transition-colors"
                        onClick={(e) => {
                            e.preventDefault();
                            // TODO: Add to favorites
                        }}
                    >
                        <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
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
