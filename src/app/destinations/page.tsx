'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Search, Filter, MapPin, Grid, List, ChevronDown } from 'lucide-react';
import { DestinationCard } from '@/components/destination';

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

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-12">
                <div className="max-w-7xl mx-auto px-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        Khám phá địa điểm du lịch
                    </h1>
                    <p className="text-emerald-100 max-w-2xl">
                        Tìm kiếm hàng trăm địa điểm du lịch hấp dẫn trên khắp Việt Nam
                    </p>

                    {/* Search Bar */}
                    <div className="mt-6 flex gap-4">
                        <div className="flex-1 flex items-center gap-3 bg-white rounded-xl px-4 py-3">
                            <Search className="w-5 h-5 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Tìm kiếm địa điểm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="bg-transparent w-full outline-none text-gray-800"
                            />
                        </div>
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center gap-2 bg-white/20 text-white px-4 py-3 rounded-xl"
                        >
                            <Filter className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Filters Sidebar */}
                    <aside className={`${showFilters ? 'block' : 'hidden'} md:block w-full md:w-64 flex-shrink-0`}>
                        <div className="bg-white rounded-2xl p-6 shadow-md sticky top-24">
                            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <Filter className="w-5 h-5 text-emerald-600" />
                                Bộ lọc
                            </h3>

                            {/* Categories */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Loại hình
                                </label>
                                <select
                                    value={selectedCategory}
                                    onChange={(e) => setSelectedCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                >
                                    <option value="">Tất cả</option>
                                    {categories.map((cat) => (
                                        <option key={cat._id} value={cat._id}>
                                            {cat.icon} {cat.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Province */}
                            <div className="mb-6">
                                <label className="text-sm font-medium text-gray-700 mb-2 block">
                                    Tỉnh/Thành
                                </label>
                                <select
                                    value={selectedProvince}
                                    onChange={(e) => setSelectedProvince(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                                >
                                    <option value="">Tất cả</option>
                                    {provinces.map((prov) => (
                                        <option key={prov._id} value={prov._id}>
                                            {prov.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Reset */}
                            <button
                                onClick={() => {
                                    setSelectedCategory('');
                                    setSelectedProvince('');
                                    setSearchQuery('');
                                }}
                                className="w-full py-2 text-emerald-600 hover:bg-emerald-50 rounded-xl transition-colors"
                            >
                                Xóa bộ lọc
                            </button>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Toolbar */}
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-gray-600">
                                Tìm thấy <span className="font-semibold text-gray-900">{destinations.length}</span> địa điểm
                            </p>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setViewMode('grid')}
                                    className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <Grid className="w-5 h-5" />
                                </button>
                                <button
                                    onClick={() => setViewMode('list')}
                                    className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-emerald-100 text-emerald-600' : 'text-gray-400 hover:text-gray-600'}`}
                                >
                                    <List className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        {/* Loading */}
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="bg-white rounded-2xl h-80 animate-pulse">
                                        <div className="h-48 bg-gray-200 rounded-t-2xl" />
                                        <div className="p-4 space-y-3">
                                            <div className="h-4 bg-gray-200 rounded w-3/4" />
                                            <div className="h-3 bg-gray-200 rounded w-1/2" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : destinations.length === 0 ? (
                            <div className="text-center py-16">
                                <MapPin className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Không tìm thấy địa điểm
                                </h3>
                                <p className="text-gray-500">
                                    Thử thay đổi bộ lọc hoặc tìm kiếm với từ khóa khác
                                </p>
                            </div>
                        ) : (
                            <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1'}`}>
                                {destinations.map((dest) => (
                                    <DestinationCard key={dest._id} destination={dest} />
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
        <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-600"></div></div>}>
            <DestinationsContent />
        </Suspense>
    );
}
