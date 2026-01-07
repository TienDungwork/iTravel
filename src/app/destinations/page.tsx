'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, MapPin, Grid, List, Sparkles, X, SlidersHorizontal, Globe } from 'lucide-react';
import { DestinationCard } from '@/components/destination';
import { CategoryIcon } from '@/components/ui/CategoryIcon';

interface Category {
    _id: string;
    name: string;
    slug: string;
    icon: string;
}

interface Province {
    _id: string;
    name: string;
    code: string;
    region: string;
}

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

function DestinationsContent() {
    const searchParams = useSearchParams();
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [provinces, setProvinces] = useState<Province[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
    const [showFilters, setShowFilters] = useState(false);

    // Filters
    const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || '');
    const [selectedProvince, setSelectedProvince] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [catRes, provRes] = await Promise.all([
                    fetch('/api/categories'),
                    fetch('/api/provinces'),
                ]);
                const catData = await catRes.json();
                const provData = await provRes.json();

                if (catData.success) setCategories(catData.data);
                if (provData.success) setProvinces(provData.data);
            } catch (error) {
                console.error('Error fetching filters:', error);
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
        const fetchDestinations = async () => {
            setLoading(true);
            try {
                const params = new URLSearchParams();
                if (selectedCategory) params.append('category', selectedCategory);
                if (selectedProvince) params.append('province', selectedProvince);
                if (searchQuery) params.append('search', searchQuery);

                const res = await fetch(`/api/destinations?${params.toString()}`);
                const data = await res.json();

                if (data.success) {
                    setDestinations(data.data);
                }
            } catch (error) {
                console.error('Error fetching destinations:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDestinations();
    }, [selectedCategory, selectedProvince, searchQuery]);

    const activeFiltersCount = [selectedCategory, selectedProvince, searchQuery].filter(Boolean).length;

    return (
        <div className="min-h-screen bg-gradient-mesh">
            {/* Hero Header */}
            <div className="relative overflow-hidden">
                {/* Background Decorations */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700" />
                <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
                <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl" />

                <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
                    <div className="flex items-center gap-3 text-emerald-200 mb-4">
                        <Sparkles className="w-5 h-5" />
                        <span className="text-sm font-medium">Hơn 50+ địa điểm du lịch</span>
                    </div>

                    <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
                        Khám phá <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Việt Nam</span>
                    </h1>
                    <p className="text-lg text-emerald-100 max-w-2xl mb-10">
                        Tìm kiếm hàng trăm địa điểm du lịch hấp dẫn từ biển đảo, núi rừng đến di tích lịch sử
                    </p>

                    {/* Search Bar - Glassmorphism */}
                    <div className="flex flex-col sm:flex-row gap-4 max-w-3xl">
                        <div className="flex-1 flex items-center gap-3 bg-white/95 backdrop-blur-lg rounded-2xl px-5 py-4 shadow-xl">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm địa điểm, tỉnh thành..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent w-full outline-none text-gray-800 font-medium placeholder-gray-400"
                            />
                            {searchQuery && (
                                <button onClick={() => setSearchQuery('')} className="p-1 hover:bg-gray-100 rounded-full">
                                    <X className="w-4 h-4 text-gray-400" />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className={`flex items-center justify-center gap-2 px-6 py-4 rounded-2xl font-semibold transition-all ${showFilters
                                ? 'bg-white text-emerald-600'
                                : 'bg-white/20 text-white border border-white/30 hover:bg-white/30'
                                }`}
                        >
                            <SlidersHorizontal className="w-5 h-5" />
                            <span>Bộ lọc</span>
                            {activeFiltersCount > 0 && (
                                <span className="w-6 h-6 bg-emerald-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {activeFiltersCount}
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-10">
                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-72 flex-shrink-0`}>
                        <div className="glass rounded-3xl p-6 shadow-xl sticky top-24">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="font-bold text-gray-900 flex items-center gap-2">
                                    <Filter className="w-5 h-5 text-emerald-600" />
                                    Bộ lọc
                                </h3>
                                {activeFiltersCount > 0 && (
                                    <button
                                        onClick={() => {
                                            setSelectedCategory('');
                                            setSelectedProvince('');
                                            setSearchQuery('');
                                        }}
                                        className="text-sm text-red-500 hover:text-red-600 font-medium"
                                    >
                                        Xóa tất cả
                                    </button>
                                )}
                            </div>

                            {/* Categories */}
                            <div className="mb-6">
                                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                                    Loại hình du lịch
                                </label>
                                <div className="space-y-2">
                                    <button
                                        onClick={() => setSelectedCategory('')}
                                        className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl transition-all ${!selectedCategory
                                            ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium'
                                            : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                            }`}
                                    >
                                        <Globe className="w-5 h-5" />
                                        Tất cả
                                    </button>
                                    {categories.map((cat) => (
                                        <button
                                            key={cat._id}
                                            onClick={() => setSelectedCategory(cat.slug)}
                                            className={`w-full flex items-center gap-3 text-left px-4 py-3 rounded-xl transition-all ${selectedCategory === cat.slug
                                                ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium'
                                                : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                                                }`}
                                        >
                                            <CategoryIcon iconName={cat.icon} className="w-5 h-5" />
                                            {cat.name}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Province */}
                            <div className="mb-6">
                                <label className="text-sm font-semibold text-gray-700 mb-3 block">
                                    Tỉnh/Thành phố
                                </label>
                                <select
                                    value={selectedProvince}
                                    onChange={(e) => setSelectedProvince(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none font-medium"
                                >
                                    <option value="">🗺️ Tất cả tỉnh thành</option>
                                    {provinces.map((prov) => (
                                        <option key={prov._id} value={prov._id}>
                                            {prov.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* AI Suggestion */}
                            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
                                <div className="flex items-center gap-2 text-purple-600 mb-2">
                                    <Sparkles className="w-4 h-4" />
                                    <span className="font-semibold text-sm">Gợi ý AI</span>
                                </div>
                                <p className="text-xs text-gray-600 mb-3">
                                    Để AI tạo lịch trình phù hợp với sở thích của bạn
                                </p>
                                <a
                                    href="/itinerary"
                                    className="block text-center py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-opacity"
                                >
                                    Thử ngay
                                </a>
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-8">
                            <div>
                                <p className="text-gray-900 font-semibold text-lg">
                                    {destinations.length} địa điểm
                                </p>
                                <p className="text-gray-500 text-sm">
                                    {selectedCategory || selectedProvince ? 'Đã lọc theo tiêu chí' : 'Hiển thị tất cả'}
                                </p>
                            </div>
                            <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-sm">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2.5 rounded-lg transition-all ${viewMode === 'list' ? 'bg-emerald-500 text-white shadow-lg' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Loading */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-3xl h-80 animate-pulse shadow-lg">
                                        <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-100 rounded-t-3xl" />
                                        <div className="p-5 space-y-3">
                                            <div className="h-4 bg-gray-200 rounded-full w-3/4" />
                                            <div className="h-3 bg-gray-100 rounded-full w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : destinations.length === 0 ? (
                            <div className="text-center py-20 bg-white rounded-3xl shadow-lg">
                                <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <MapPin className="w-10 h-10 text-gray-300" />
                                </div>
                                <h3 className="text-xl font-bold text-gray-900 mb-2">
                                    Không tìm thấy địa điểm
                                </h3>
                                <p className="text-gray-500 mb-6">
                                    Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                                </p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory('');
                                        setSelectedProvince('');
                                        setSearchQuery('');
                                    }}
                                    className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        ) : (
                            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                                {destinations.map((dest, index) => (
                                    <div
                                        key={dest._id}
                                        className="animate-fade-in opacity-0"
                                        style={{ animationDelay: `${index * 0.05}s` }}
                                    >
                                        <DestinationCard destination={dest} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function DestinationsPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gradient-mesh flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Đang tải...</p>
                </div>
            </div>
        }>
            <DestinationsContent />
        </Suspense>
    );
}
