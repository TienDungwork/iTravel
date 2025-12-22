'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
    LayoutDashboard, MapPin, Users, FileText, Settings, LogOut,
    Plus, Search, Edit, Trash2, Eye, TrendingUp, Star, BarChart3
} from 'lucide-react';

interface Destination {
    _id: string;
    name: string;
    slug: string;
    rating: number;
    reviewCount: number;
    viewCount: number;
    isActive: boolean;
    categoryId?: { name: string };
    provinceId?: { name: string };
}

interface Stats {
    destinations: number;
    categories: number;
    provinces: number;
    totalViews: number;
}

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [stats, setStats] = useState<Stats>({ destinations: 0, categories: 0, provinces: 0, totalViews: 0 });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await fetch('/api/destinations?limit=100');
                const data = await res.json();

                if (data.success) {
                    setDestinations(data.data);
                    const totalViews = data.data.reduce((sum: number, d: Destination) => sum + (d.viewCount || 0), 0);
                    setStats({
                        destinations: data.pagination?.total || data.data.length,
                        categories: 6,
                        provinces: 10,
                        totalViews,
                    });
                }
            } catch (error) {
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const menuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'destinations', label: 'Địa điểm', icon: MapPin },
        { id: 'users', label: 'Người dùng', icon: Users },
        { id: 'content', label: 'Nội dung', icon: FileText },
        { id: 'settings', label: 'Cài đặt', icon: Settings },
    ];

    const statsCards = [
        { label: 'Địa điểm', value: stats.destinations, icon: MapPin, color: 'bg-emerald-500' },
        { label: 'Danh mục', value: stats.categories, icon: BarChart3, color: 'bg-blue-500' },
        { label: 'Tỉnh/Thành', value: stats.provinces, icon: TrendingUp, color: 'bg-purple-500' },
        { label: 'Lượt xem', value: stats.totalViews.toLocaleString(), icon: Eye, color: 'bg-amber-500' },
    ];

    return (
        <div className="min-h-screen bg-gray-100 flex">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white fixed inset-y-0 left-0 z-50">
                <div className="p-6">
                    <Link href="/" className="flex items-center gap-2">
                        <MapPin className="w-8 h-8 text-emerald-500" />
                        <span className="text-xl font-bold">iTravel</span>
                    </Link>
                    <p className="text-gray-500 text-sm mt-1">Admin Panel</p>
                </div>

                <nav className="mt-6">
                    {menuItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full flex items-center gap-3 px-6 py-3 transition-colors ${activeTab === item.id
                                    ? 'bg-emerald-600 text-white'
                                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="absolute bottom-0 left-0 right-0 p-6">
                    <Link
                        href="/"
                        className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors"
                    >
                        <LogOut className="w-5 h-5" />
                        <span>Về trang chủ</span>
                    </Link>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 ml-64 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            {activeTab === 'dashboard' && 'Dashboard'}
                            {activeTab === 'destinations' && 'Quản lý địa điểm'}
                            {activeTab === 'users' && 'Quản lý người dùng'}
                            {activeTab === 'content' && 'Quản lý nội dung'}
                            {activeTab === 'settings' && 'Cài đặt'}
                        </h1>
                        <p className="text-gray-500">Quản lý hệ thống iTravel</p>
                    </div>
                    {activeTab === 'destinations' && (
                        <button className="flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl hover:bg-emerald-700 transition-colors">
                            <Plus className="w-5 h-5" />
                            <span>Thêm địa điểm</span>
                        </button>
                    )}
                </div>

                {/* Dashboard */}
                {activeTab === 'dashboard' && (
                    <div className="space-y-8">
                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {statsCards.map((stat, index) => (
                                <div key={index} className="bg-white rounded-2xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className={`p-3 rounded-xl ${stat.color} text-white`}>
                                            <stat.icon className="w-6 h-6" />
                                        </div>
                                        <span className="text-sm text-emerald-600 font-medium">+12%</span>
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                                    <p className="text-gray-500">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-gray-900 mb-4">Địa điểm phổ biến</h2>
                            <div className="space-y-4">
                                {destinations.slice(0, 5).map((dest) => (
                                    <div key={dest._id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                                        <div>
                                            <p className="font-medium text-gray-900">{dest.name}</p>
                                            <p className="text-sm text-gray-500">{dest.provinceId?.name}</p>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="flex items-center gap-1 text-yellow-500">
                                                <Star className="w-4 h-4 fill-yellow-500" />
                                                <span className="font-medium">{dest.rating}</span>
                                            </div>
                                            <div className="flex items-center gap-1 text-gray-500">
                                                <Eye className="w-4 h-4" />
                                                <span>{dest.viewCount || 0}</span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Seed Data Button */}
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                            <h3 className="font-bold text-amber-800 mb-2">Khởi tạo dữ liệu mẫu</h3>
                            <p className="text-amber-700 text-sm mb-4">
                                Nếu chưa có dữ liệu, nhấn nút bên dưới để tạo dữ liệu mẫu cho hệ thống.
                            </p>
                            <button
                                onClick={async () => {
                                    if (confirm('Bạn có chắc muốn khởi tạo lại dữ liệu? Dữ liệu cũ sẽ bị xóa.')) {
                                        const res = await fetch('/api/seed', { method: 'POST' });
                                        const data = await res.json();
                                        if (data.success) {
                                            alert('Đã khởi tạo dữ liệu thành công!');
                                            window.location.reload();
                                        } else {
                                            alert('Lỗi: ' + data.error);
                                        }
                                    }
                                }}
                                className="bg-amber-600 text-white px-4 py-2 rounded-xl hover:bg-amber-700 transition-colors"
                            >
                                Khởi tạo dữ liệu mẫu
                            </button>
                        </div>
                    </div>
                )}

                {/* Destinations List */}
                {activeTab === 'destinations' && (
                    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                        {/* Search */}
                        <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center gap-3 bg-gray-100 rounded-xl px-4 py-2 max-w-md">
                                <Search className="w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    placeholder="Tìm kiếm địa điểm..."
                                    className="bg-transparent w-full outline-none"
                                />
                            </div>
                        </div>

                        {/* Table */}
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tên địa điểm</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Danh mục</th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Tỉnh/TP</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Rating</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Lượt xem</th>
                                    <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase">Trạng thái</th>
                                    <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {loading ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            Đang tải...
                                        </td>
                                    </tr>
                                ) : destinations.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                                            Chưa có dữ liệu. Hãy khởi tạo dữ liệu mẫu từ Dashboard.
                                        </td>
                                    </tr>
                                ) : (
                                    destinations.map((dest) => (
                                        <tr key={dest._id} className="hover:bg-gray-50">
                                            <td className="px-6 py-4">
                                                <p className="font-medium text-gray-900">{dest.name}</p>
                                            </td>
                                            <td className="px-6 py-4 text-gray-500">{dest.categoryId?.name || '-'}</td>
                                            <td className="px-6 py-4 text-gray-500">{dest.provinceId?.name || '-'}</td>
                                            <td className="px-6 py-4 text-center">
                                                <div className="inline-flex items-center gap-1 text-yellow-500">
                                                    <Star className="w-4 h-4 fill-yellow-500" />
                                                    <span>{dest.rating}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-center text-gray-500">{dest.viewCount || 0}</td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${dest.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'
                                                    }`}>
                                                    {dest.isActive ? 'Hoạt động' : 'Ẩn'}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <div className="flex items-center justify-end gap-2">
                                                    <Link
                                                        href={`/destinations/${dest.slug}`}
                                                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                                                    >
                                                        <Eye className="w-5 h-5" />
                                                    </Link>
                                                    <button className="p-2 text-gray-400 hover:text-emerald-600 transition-colors">
                                                        <Edit className="w-5 h-5" />
                                                    </button>
                                                    <button className="p-2 text-gray-400 hover:text-red-600 transition-colors">
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Users Placeholder */}
                {activeTab === 'users' && (
                    <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                        <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Quản lý người dùng</h3>
                        <p className="text-gray-500">Tính năng sẽ được phát triển trong giai đoạn tiếp theo</p>
                    </div>
                )}

                {/* Content Placeholder */}
                {activeTab === 'content' && (
                    <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                        <FileText className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Quản lý nội dung</h3>
                        <p className="text-gray-500">Tính năng sẽ được phát triển trong giai đoạn tiếp theo</p>
                    </div>
                )}

                {/* Settings Placeholder */}
                {activeTab === 'settings' && (
                    <div className="bg-white rounded-2xl p-8 shadow-sm text-center">
                        <Settings className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Cài đặt hệ thống</h3>
                        <p className="text-gray-500">Tính năng sẽ được phát triển trong giai đoạn tiếp theo</p>
                    </div>
                )}
            </main>
        </div>
    );
}
