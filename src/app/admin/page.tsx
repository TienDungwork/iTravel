'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
    LayoutDashboard, MapPin, Users, Tag, MessageSquare, Settings,
    Plus, Edit, Trash2, Eye, Search, ChevronRight, Database, TrendingUp,
    Star, CheckCircle, XCircle, AlertCircle, X, Mail, Shield, Plane, Calendar, Image as ImageIcon
} from 'lucide-react';
import { CategoryIcon } from '@/components/ui/CategoryIcon';

interface Destination {
    _id: string;
    name: string;
    slug: string;
    categoryId?: { name: string; icon: string };
    provinceId?: { name: string };
    rating: number;
    viewCount: number;
    isFeatured: boolean;
}

interface User {
    _id: string;
    name: string;
    email: string;
    role: 'user' | 'admin';
    createdAt: string;
}

interface Review {
    _id: string;
    userId: { _id: string; name: string; email: string };
    destinationId: { _id: string; name: string; slug: string };
    rating: number;
    title: string;
    comment: string;
    isApproved: boolean;
    createdAt: string;
}

interface Category {
    _id: string;
    name: string;
    icon: string;
    slug: string;
    isActive: boolean;
}

interface Trip {
    _id: string;
    userId: { _id: string; name: string; email: string };
    name: string;
    destinations: { destinationId: { name: string; slug: string; images: string[] }; }[];
    status: 'planning' | 'ongoing' | 'completed';
    travelers?: number;
    createdAt: string;
    updatedAt: string;
}

interface Stats {
    destinations: number;
    categories: number;
    provinces: number;
    users: number;
    reviews: number;
    totalViews: number;
}

type TabType = 'dashboard' | 'destinations' | 'users' | 'categories' | 'reviews' | 'trips' | 'settings';

export default function AdminPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [activeTab, setActiveTab] = useState<TabType>('dashboard');
    const [destinations, setDestinations] = useState<Destination[]>([]);
    const [users, setUsers] = useState<User[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [trips, setTrips] = useState<Trip[]>([]);
    const [provinces, setProvinces] = useState<{ _id: string; name: string }[]>([]);
    const [stats, setStats] = useState<Stats>({
        destinations: 0, categories: 0, provinces: 0, users: 0, reviews: 0, totalViews: 0
    });
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [showModal, setShowModal] = useState(false);
    const [modalType, setModalType] = useState<'destination' | 'user' | 'category'>('destination');
    const [editingItem, setEditingItem] = useState<Destination | User | Category | null>(null);
    const [seedLoading, setSeedLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Form states
    const [formData, setFormData] = useState({
        name: '', description: '', shortDescription: '', categoryId: '', provinceId: '',
        priceMin: 500000, priceMax: 2000000, duration: '2-3 ngày', isFeatured: false,
        role: 'user', icon: '📍',
        images: ['', '', '']
    });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (status === 'authenticated' && session?.user?.role !== 'admin') {
            router.push('/');
        }
    }, [status, session, router]);

    useEffect(() => {
        if (session?.user?.role === 'admin') {
            fetchAllData();
        }
    }, [session]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [destRes, catRes, provRes, userRes, reviewRes, tripsRes] = await Promise.all([
                fetch('/api/destinations?limit=100'),
                fetch('/api/categories'),
                fetch('/api/provinces'),
                fetch('/api/admin/users'),
                fetch('/api/admin/reviews'),
                fetch('/api/admin/trips'),
            ]);

            const [destData, catData, provData, userData, reviewData, tripsData] = await Promise.all([
                destRes.json(),
                catRes.json(),
                provRes.json(),
                userRes.ok ? userRes.json() : { success: false, data: [] },
                reviewRes.ok ? reviewRes.json() : { success: false, data: [] },
                tripsRes.ok ? tripsRes.json() : { success: false, data: [] },
            ]);

            if (destData.success) {
                setDestinations(destData.data);
                setStats(prev => ({
                    ...prev,
                    destinations: destData.data.length,
                    totalViews: destData.data.reduce((sum: number, d: Destination) => sum + (d.viewCount || 0), 0),
                }));
            }

            if (catData.success) {
                setCategories(catData.data);
                setStats(prev => ({ ...prev, categories: catData.data.length }));
            }

            if (provData.success) {
                const allProvinces = Object.values(provData.data).flat() as { _id: string; name: string }[];
                setProvinces(allProvinces);
                setStats(prev => ({ ...prev, provinces: allProvinces.length }));
            }

            if (userData.success) {
                setUsers(userData.data);
                setStats(prev => ({ ...prev, users: userData.data.length }));
            }

            if (reviewData.success) {
                setReviews(reviewData.data);
                setStats(prev => ({ ...prev, reviews: reviewData.data.length }));
            }

            if (tripsData.success) {
                setTrips(tripsData.data);
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const handleSeedData = async () => {
        setSeedLoading(true);
        try {
            const res = await fetch('/api/seed', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                showMessage('success', 'Khởi tạo dữ liệu mẫu thành công!');
                fetchAllData();
            } else {
                showMessage('error', data.error || 'Có lỗi xảy ra');
            }
        } catch {
            showMessage('error', 'Không thể kết nối server');
        } finally {
            setSeedLoading(false);
        }
    };

    // Destination handlers
    const handleDeleteDestination = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa địa điểm này?')) return;
        try {
            const res = await fetch(`/api/admin/destinations/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setDestinations(destinations.filter(d => d._id !== id));
                showMessage('success', 'Xóa thành công!');
            }
        } catch {
            showMessage('error', 'Không thể xóa');
        }
    };

    // User handlers
    const handleUpdateUserRole = async (id: string, role: string) => {
        try {
            const res = await fetch(`/api/admin/users/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ role }),
            });
            if (res.ok) {
                setUsers(users.map(u => u._id === id ? { ...u, role: role as 'user' | 'admin' } : u));
                showMessage('success', 'Cập nhật quyền thành công!');
            }
        } catch {
            showMessage('error', 'Không thể cập nhật');
        }
    };

    const handleDeleteUser = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa người dùng này?')) return;
        try {
            const res = await fetch(`/api/admin/users/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setUsers(users.filter(u => u._id !== id));
                showMessage('success', 'Xóa thành công!');
            } else {
                showMessage('error', data.error);
            }
        } catch {
            showMessage('error', 'Không thể xóa');
        }
    };

    // Review handlers
    const handleApproveReview = async (id: string, isApproved: boolean) => {
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ isApproved }),
            });
            if (res.ok) {
                setReviews(reviews.map(r => r._id === id ? { ...r, isApproved } : r));
                showMessage('success', isApproved ? 'Đã phê duyệt!' : 'Đã từ chối!');
            }
        } catch {
            showMessage('error', 'Không thể cập nhật');
        }
    };

    const handleDeleteReview = async (id: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;
        try {
            const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
            if (res.ok) {
                setReviews(reviews.filter(r => r._id !== id));
                showMessage('success', 'Xóa thành công!');
            }
        } catch {
            showMessage('error', 'Không thể xóa');
        }
    };

    const openCreateModal = (type: 'destination' | 'user' | 'category') => {
        setEditingItem(null);
        setModalType(type);
        setFormData({
            name: '', description: '', shortDescription: '', categoryId: categories[0]?._id || '',
            provinceId: provinces[0]?._id || '', priceMin: 500000, priceMax: 2000000,
            duration: '2-3 ngày', isFeatured: false, role: 'user', icon: 'Globe',
            images: ['', '', '']
        });
        setShowModal(true);
    };

    const openEditDestinationModal = async (dest: Destination) => {
        try {
            const res = await fetch(`/api/destinations/${dest.slug}`);
            const data = await res.json();
            if (data.success) {
                const d = data.data;
                setEditingItem(dest);
                setModalType('destination');
                setFormData({
                    name: d.name || '',
                    description: d.description || '',
                    shortDescription: d.shortDescription || '',
                    categoryId: d.categoryId?._id || categories[0]?._id || '',
                    provinceId: d.provinceId?._id || provinces[0]?._id || '',
                    priceMin: d.priceRange?.min || 500000,
                    priceMax: d.priceRange?.max || 2000000,
                    duration: d.duration || '2-3 ngày',
                    isFeatured: d.isFeatured || false,
                    role: 'user',
                    icon: d.categoryId?.icon || 'Globe',
                    images: d.images?.length ? [...d.images, '', '', ''].slice(0, 3) : ['', '', '']
                });
                setShowModal(true);
            }
        } catch (error) {
            showMessage('error', 'Không thể tải thông tin địa điểm');
        }
    };

    const handleSave = async () => {
        try {
            let url = '';
            let body: Record<string, unknown> = {};

            if (modalType === 'destination') {
                url = editingItem ? `/api/admin/destinations/${(editingItem as Destination)._id}` : '/api/admin/destinations';
                body = {
                    ...formData,
                    priceRange: { min: formData.priceMin, max: formData.priceMax },
                    images: formData.images.filter(img => img.trim() !== ''),
                };
            } else if (modalType === 'category') {
                url = editingItem ? `/api/admin/categories/${(editingItem as Category)._id}` : '/api/admin/categories';
                body = { name: formData.name, icon: formData.icon };
            }

            const res = await fetch(url, {
                method: editingItem ? 'PUT' : 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
            });

            const data = await res.json();
            if (data.success) {
                showMessage('success', editingItem ? 'Cập nhật thành công!' : 'Tạo mới thành công!');
                setShowModal(false);
                fetchAllData();
            } else {
                showMessage('error', data.error || 'Có lỗi xảy ra');
            }
        } catch {
            showMessage('error', 'Không thể lưu');
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN');
    };

    const filteredDestinations = destinations.filter(d =>
        d.name.toLowerCase().includes(search.toLowerCase())
    );

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(search.toLowerCase()) ||
        u.email.toLowerCase().includes(search.toLowerCase())
    );

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
            </div>
        );
    }

    if (session?.user?.role !== 'admin') {
        return null;
    }

    const tabs = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'destinations', label: 'Địa điểm', icon: MapPin, count: stats.destinations },
        { id: 'users', label: 'Người dùng', icon: Users, count: stats.users },
        { id: 'categories', label: 'Danh mục', icon: Tag, count: stats.categories },
        { id: 'reviews', label: 'Đánh giá', icon: MessageSquare, count: stats.reviews },
        { id: 'trips', label: 'Lịch trình', icon: Plane, count: trips.length },
        { id: 'settings', label: 'Cài đặt', icon: Settings },
    ];

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Toast */}
            {message.text && (
                <div className={`fixed top-20 right-4 z-50 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg ${message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            <div className="flex">
                {/* Sidebar */}
                <aside className="w-64 bg-white h-screen fixed left-0 top-16 border-r border-gray-200 overflow-y-auto">
                    <div className="p-4">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Quản trị viên</h2>
                        <nav className="space-y-1">
                            {tabs.map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as TabType)}
                                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-left transition-colors ${activeTab === tab.id
                                        ? 'bg-emerald-50 text-emerald-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <tab.icon className="w-5 h-5" />
                                        <span className="font-medium">{tab.label}</span>
                                    </div>
                                    {tab.count !== undefined && (
                                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-full">
                                            {tab.count}
                                        </span>
                                    )}
                                </button>
                            ))}
                        </nav>

                        <div className="mt-8 pt-8 border-t border-gray-200">
                            <button
                                onClick={handleSeedData}
                                disabled={seedLoading}
                                className="w-full flex items-center gap-2 px-4 py-3 bg-amber-50 text-amber-700 rounded-xl hover:bg-amber-100 transition-colors disabled:opacity-50"
                            >
                                <Database className="w-5 h-5" />
                                <span className="font-medium">{seedLoading ? 'Đang tạo...' : 'Seed Data'}</span>
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Main Content */}
                <main className="ml-64 flex-1 p-8">
                    {/* Dashboard */}
                    {activeTab === 'dashboard' && (
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                                {[
                                    { label: 'Địa điểm', value: stats.destinations, icon: MapPin, color: 'emerald' },
                                    { label: 'Người dùng', value: stats.users, icon: Users, color: 'blue' },
                                    { label: 'Đánh giá', value: stats.reviews, icon: MessageSquare, color: 'purple' },
                                    { label: 'Lượt xem', value: stats.totalViews, icon: TrendingUp, color: 'orange' },
                                ].map((stat, i) => (
                                    <div key={i} className="bg-white rounded-2xl p-6 shadow-sm">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 bg-${stat.color}-100 rounded-xl`}>
                                                <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
                                            </div>
                                            <div>
                                                <p className="text-sm text-gray-500">{stat.label}</p>
                                                <p className="text-2xl font-bold text-gray-900">{stat.value.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-900 mb-4">Địa điểm gần đây</h3>
                                    <div className="space-y-3">
                                        {destinations.slice(0, 5).map(dest => (
                                            <div key={dest._id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                                                <div className="flex items-center gap-3">
                                                    <CategoryIcon iconName={dest.categoryId?.icon || 'Globe'} className="w-6 h-6 text-emerald-600" />
                                                    <span className="font-medium">{dest.name}</span>
                                                </div>
                                                <div className="flex items-center gap-1 text-yellow-500">
                                                    <Star className="w-4 h-4 fill-yellow-500" />
                                                    <span>{dest.rating}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white rounded-2xl p-6 shadow-sm">
                                    <h3 className="font-bold text-gray-900 mb-4">Đánh giá mới</h3>
                                    <div className="space-y-3">
                                        {reviews.slice(0, 5).map(review => (
                                            <div key={review._id} className="p-3 bg-gray-50 rounded-xl">
                                                <div className="flex items-center justify-between mb-2">
                                                    <span className="font-medium">{review.userId?.name || 'Ẩn danh'}</span>
                                                    <span className={`text-xs px-2 py-1 rounded-full ${review.isApproved ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                                                        }`}>
                                                        {review.isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
                                                    </span>
                                                </div>
                                                <p className="text-sm text-gray-600 line-clamp-2">{review.comment}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Destinations */}
                    {activeTab === 'destinations' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Quản lý Địa điểm</h1>
                                <button
                                    onClick={() => openCreateModal('destination')}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                                >
                                    <Plus className="w-5 h-5" />
                                    Thêm mới
                                </button>
                            </div>

                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Tìm kiếm..."
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl"
                                />
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left py-4 px-6 font-semibold">Địa điểm</th>
                                            <th className="text-left py-4 px-6 font-semibold">Danh mục</th>
                                            <th className="text-center py-4 px-6 font-semibold">Rating</th>
                                            <th className="text-center py-4 px-6 font-semibold">Views</th>
                                            <th className="text-center py-4 px-6 font-semibold">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredDestinations.map(dest => (
                                            <tr key={dest._id} className="border-t border-gray-100 hover:bg-gray-50">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <CategoryIcon iconName={dest.categoryId?.icon || 'Globe'} className="w-6 h-6 text-emerald-600" />
                                                        <div>
                                                            <p className="font-medium">{dest.name}</p>
                                                            {dest.isFeatured && (
                                                                <span className="text-xs px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full">Nổi bật</span>
                                                            )}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-gray-600">{dest.categoryId?.name || '-'}</td>
                                                <td className="py-4 px-6 text-center">
                                                    <div className="flex items-center justify-center gap-1 text-yellow-500">
                                                        <Star className="w-4 h-4 fill-yellow-500" />
                                                        <span>{dest.rating}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-center text-gray-600">{dest.viewCount}</td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <Link href={`/destinations/${dest.slug}`} className="p-2 hover:bg-gray-100 rounded-lg" title="Xem">
                                                            <Eye className="w-4 h-4 text-gray-500" />
                                                        </Link>
                                                        <button onClick={() => openEditDestinationModal(dest)} className="p-2 hover:bg-emerald-50 rounded-lg" title="Sửa">
                                                            <Edit className="w-4 h-4 text-emerald-600" />
                                                        </button>
                                                        <button onClick={() => handleDeleteDestination(dest._id)} className="p-2 hover:bg-red-50 rounded-lg" title="Xóa">
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Users */}
                    {activeTab === 'users' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Quản lý Người dùng</h1>
                            </div>

                            <div className="relative mb-6">
                                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                                <input
                                    type="text"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    placeholder="Tìm theo tên hoặc email..."
                                    className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl"
                                />
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                <table className="w-full">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="text-left py-4 px-6 font-semibold">Người dùng</th>
                                            <th className="text-left py-4 px-6 font-semibold">Email</th>
                                            <th className="text-center py-4 px-6 font-semibold">Quyền</th>
                                            <th className="text-center py-4 px-6 font-semibold">Ngày tạo</th>
                                            <th className="text-center py-4 px-6 font-semibold">Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map(user => (
                                            <tr key={user._id} className="border-t border-gray-100 hover:bg-gray-50">
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                                            <span className="text-emerald-600 font-semibold">
                                                                {user.name.charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <span className="font-medium">{user.name}</span>
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center gap-2 text-gray-600">
                                                        <Mail className="w-4 h-4" />
                                                        {user.email}
                                                    </div>
                                                </td>
                                                <td className="py-4 px-6 text-center">
                                                    <select
                                                        value={user.role}
                                                        onChange={(e) => handleUpdateUserRole(user._id, e.target.value)}
                                                        className={`px-3 py-1 rounded-full text-sm font-medium ${user.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-700'
                                                            : 'bg-gray-100 text-gray-700'
                                                            }`}
                                                    >
                                                        <option value="user">User</option>
                                                        <option value="admin">Admin</option>
                                                    </select>
                                                </td>
                                                <td className="py-4 px-6 text-center text-gray-600">
                                                    {formatDate(user.createdAt)}
                                                </td>
                                                <td className="py-4 px-6">
                                                    <div className="flex items-center justify-center gap-2">
                                                        <button
                                                            onClick={() => handleDeleteUser(user._id)}
                                                            className="p-2 hover:bg-red-50 rounded-lg"
                                                            title="Xóa người dùng"
                                                        >
                                                            <Trash2 className="w-4 h-4 text-red-500" />
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                                {filteredUsers.length === 0 && (
                                    <div className="text-center py-12 text-gray-500">Chưa có người dùng nào</div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Categories */}
                    {activeTab === 'categories' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Quản lý Danh mục</h1>
                                <button
                                    onClick={() => openCreateModal('category')}
                                    className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                                >
                                    <Plus className="w-5 h-5" />
                                    Thêm mới
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {categories.map(cat => (
                                    <div key={cat._id} className="bg-white rounded-2xl p-6 shadow-sm">
                                        <div className="flex items-center justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 bg-emerald-100 rounded-xl">
                                                    <CategoryIcon iconName={cat.icon} className="w-6 h-6 text-emerald-600" />
                                                </div>
                                                <h3 className="font-bold text-gray-900">{cat.name}</h3>
                                            </div>
                                        </div>
                                        <p className="text-sm text-gray-500">
                                            {destinations.filter(d => d.categoryId?.name === cat.name).length} địa điểm
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Reviews */}
                    {activeTab === 'reviews' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Quản lý Đánh giá</h1>
                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-500">
                                        {reviews.filter(r => !r.isApproved).length} chờ duyệt
                                    </span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {reviews.length === 0 ? (
                                    <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
                                        Chưa có đánh giá nào
                                    </div>
                                ) : (
                                    reviews.map(review => (
                                        <div key={review._id} className="bg-white rounded-2xl p-6 shadow-sm">
                                            <div className="flex items-start justify-between">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-3 mb-2">
                                                        <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                                            <span className="text-emerald-600 font-semibold">
                                                                {(review.userId?.name || 'U').charAt(0).toUpperCase()}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-semibold">{review.userId?.name || 'Ẩn danh'}</p>
                                                            <p className="text-sm text-gray-500">{review.userId?.email}</p>
                                                        </div>
                                                        <div className="flex items-center gap-1 text-yellow-500 ml-4">
                                                            {[...Array(5)].map((_, i) => (
                                                                <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-yellow-500' : 'text-gray-300'}`} />
                                                            ))}
                                                        </div>
                                                        <span className={`ml-auto px-3 py-1 rounded-full text-sm ${review.isApproved
                                                            ? 'bg-emerald-100 text-emerald-700'
                                                            : 'bg-amber-100 text-amber-700'
                                                            }`}>
                                                            {review.isApproved ? 'Đã duyệt' : 'Chờ duyệt'}
                                                        </span>
                                                    </div>

                                                    <div className="ml-13 pl-13">
                                                        <Link
                                                            href={`/destinations/${review.destinationId?.slug}`}
                                                            className="text-emerald-600 hover:underline text-sm mb-2 inline-block"
                                                        >
                                                            📍 {review.destinationId?.name}
                                                        </Link>
                                                        <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                                                        <p className="text-gray-600">{review.comment}</p>
                                                        <p className="text-sm text-gray-400 mt-2">{formatDate(review.createdAt)}</p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2 ml-4">
                                                    {!review.isApproved && (
                                                        <button
                                                            onClick={() => handleApproveReview(review._id, true)}
                                                            className="p-2 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"
                                                            title="Phê duyệt"
                                                        >
                                                            <CheckCircle className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    {review.isApproved && (
                                                        <button
                                                            onClick={() => handleApproveReview(review._id, false)}
                                                            className="p-2 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-100"
                                                            title="Hủy duyệt"
                                                        >
                                                            <XCircle className="w-5 h-5" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={() => handleDeleteReview(review._id)}
                                                        className="p-2 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"
                                                        title="Xóa"
                                                    >
                                                        <Trash2 className="w-5 h-5" />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    )}

                    {/* Trips */}
                    {activeTab === 'trips' && (
                        <div>
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold text-gray-900">Quản lý Lịch trình</h1>
                                <span className="text-gray-500">{trips.length} lịch trình</span>
                            </div>

                            {trips.length === 0 ? (
                                <div className="bg-white rounded-2xl p-12 text-center text-gray-500">
                                    Chưa có lịch trình nào
                                </div>
                            ) : (
                                <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                <th className="text-left py-4 px-6 font-semibold">Người dùng</th>
                                                <th className="text-left py-4 px-6 font-semibold">Tên lịch trình</th>
                                                <th className="text-center py-4 px-6 font-semibold">Địa điểm</th>
                                                <th className="text-center py-4 px-6 font-semibold">Trạng thái</th>
                                                <th className="text-center py-4 px-6 font-semibold">Ngày tạo</th>
                                                <th className="text-center py-4 px-6 font-semibold">Thao tác</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {trips.map(trip => (
                                                <tr key={trip._id} className="border-t border-gray-100 hover:bg-gray-50">
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                                                <span className="text-emerald-600 font-semibold">
                                                                    {(trip.userId?.name || 'U').charAt(0).toUpperCase()}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium">{trip.userId?.name || 'Không xác định'}</p>
                                                                <p className="text-sm text-gray-500">{trip.userId?.email}</p>
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center gap-2">
                                                            <Plane className="w-4 h-4 text-emerald-500" />
                                                            <span className="font-medium">{trip.name}</span>
                                                        </div>
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm">
                                                            <MapPin className="w-3 h-3" />
                                                            {trip.destinations?.length || 0}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-center">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${trip.status === 'planning' ? 'bg-blue-100 text-blue-700' :
                                                            trip.status === 'ongoing' ? 'bg-amber-100 text-amber-700' :
                                                                'bg-emerald-100 text-emerald-700'
                                                            }`}>
                                                            {trip.status === 'planning' ? 'Đang lên KH' :
                                                                trip.status === 'ongoing' ? 'Đang đi' : 'Hoàn thành'}
                                                        </span>
                                                    </td>
                                                    <td className="py-4 px-6 text-center text-gray-600">
                                                        {formatDate(trip.createdAt)}
                                                    </td>
                                                    <td className="py-4 px-6">
                                                        <div className="flex items-center justify-center gap-2">
                                                            <button
                                                                onClick={async () => {
                                                                    if (!confirm('Bạn có chắc chắn muốn xóa lịch trình này?')) return;
                                                                    try {
                                                                        const res = await fetch(`/api/admin/trips/${trip._id}`, { method: 'DELETE' });
                                                                        if (res.ok) {
                                                                            setTrips(trips.filter(t => t._id !== trip._id));
                                                                            showMessage('success', 'Xóa lịch trình thành công!');
                                                                        }
                                                                    } catch {
                                                                        showMessage('error', 'Không thể xóa');
                                                                    }
                                                                }}
                                                                className="p-2 hover:bg-red-50 rounded-lg"
                                                                title="Xóa lịch trình"
                                                            >
                                                                <Trash2 className="w-4 h-4 text-red-500" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}

                            {/* Trip destinations detail */}
                            {trips.filter(t => t.destinations?.length > 0).length > 0 && (
                                <div className="mt-8">
                                    <h2 className="text-lg font-bold text-gray-900 mb-4">Chi tiết lịch trình của từng người dùng</h2>
                                    <div className="space-y-4">
                                        {trips.filter(t => t.destinations?.length > 0).map(trip => (
                                            <div key={trip._id} className="bg-white rounded-2xl p-6 shadow-sm">
                                                <div className="flex items-center gap-3 mb-4">
                                                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                                                        <span className="text-emerald-600 font-semibold">
                                                            {(trip.userId?.name || 'U').charAt(0).toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-semibold">{trip.userId?.name}</p>
                                                        <p className="text-sm text-gray-500">{trip.name}</p>
                                                    </div>
                                                    <span className={`ml-auto px-3 py-1 rounded-full text-sm ${trip.status === 'planning' ? 'bg-blue-100 text-blue-700' :
                                                        trip.status === 'ongoing' ? 'bg-amber-100 text-amber-700' :
                                                            'bg-emerald-100 text-emerald-700'
                                                        }`}>
                                                        {trip.status === 'planning' ? 'Đang lên KH' :
                                                            trip.status === 'ongoing' ? 'Đang đi' : 'Hoàn thành'}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {trip.destinations.map((dest, i) => (
                                                        <Link
                                                            key={i}
                                                            href={`/destinations/${dest.destinationId?.slug || ''}`}
                                                            className="flex items-center gap-2 px-3 py-2 bg-gray-50 rounded-lg hover:bg-gray-100"
                                                        >
                                                            <span className="w-5 h-5 bg-emerald-500 text-white rounded-full flex items-center justify-center text-xs">
                                                                {i + 1}
                                                            </span>
                                                            <span className="text-sm font-medium">{dest.destinationId?.name || 'Unknown'}</span>
                                                        </Link>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* Settings */}
                    {activeTab === 'settings' && (
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900 mb-6">Cài đặt hệ thống</h1>
                            <div className="bg-white rounded-2xl p-6 shadow-sm">
                                <h3 className="font-bold text-gray-900 mb-4">Thông tin</h3>
                                <div className="space-y-3">
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Tổng địa điểm</span>
                                        <span className="font-semibold">{stats.destinations}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Tổng người dùng</span>
                                        <span className="font-semibold">{stats.users}</span>
                                    </div>
                                    <div className="flex justify-between py-2 border-b">
                                        <span className="text-gray-600">Tổng đánh giá</span>
                                        <span className="font-semibold">{stats.reviews}</span>
                                    </div>
                                    <div className="flex justify-between py-2">
                                        <span className="text-gray-600">Tổng lượt xem</span>
                                        <span className="font-semibold">{stats.totalViews.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </main>
            </div>

            {/* Modal */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                        <div className="flex items-center justify-between mb-6">
                            <h2 className="text-xl font-bold text-gray-900">
                                {editingItem ? 'Chỉnh sửa' : 'Thêm mới'} {modalType === 'destination' ? 'địa điểm' : modalType === 'category' ? 'danh mục' : 'người dùng'}
                            </h2>
                            <button onClick={() => setShowModal(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {modalType === 'destination' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên địa điểm *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                        placeholder="VD: Vịnh Hạ Long"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Danh mục</label>
                                        <select
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                        >
                                            {categories.map(cat => (
                                                <option key={cat._id} value={cat._id}>{cat.icon} {cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Tỉnh/Thành</label>
                                        <select
                                            value={formData.provinceId}
                                            onChange={(e) => setFormData({ ...formData, provinceId: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                        >
                                            {provinces.map(prov => (
                                                <option key={prov._id} value={prov._id}>{prov.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả ngắn</label>
                                    <input
                                        type="text"
                                        value={formData.shortDescription}
                                        onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chi tiết</label>
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        rows={4}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Giá từ (VNĐ)</label>
                                        <input
                                            type="number"
                                            value={formData.priceMin}
                                            onChange={(e) => setFormData({ ...formData, priceMin: Number(e.target.value) })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Giá đến (VNĐ)</label>
                                        <input
                                            type="number"
                                            value={formData.priceMax}
                                            onChange={(e) => setFormData({ ...formData, priceMax: Number(e.target.value) })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Thời gian</label>
                                        <input
                                            type="text"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="isFeatured"
                                        checked={formData.isFeatured}
                                        onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                        className="w-5 h-5 text-emerald-600 rounded"
                                    />
                                    <label htmlFor="isFeatured">Đánh dấu là nổi bật</label>
                                </div>

                                {/* Image URLs */}
                                <div className="border-t pt-4">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
                                        <ImageIcon className="w-4 h-4" />
                                        URL Hình ảnh (tối đa 3)
                                    </label>
                                    <div className="space-y-3">
                                        {formData.images.map((url, index) => (
                                            <div key={index} className="flex items-center gap-3">
                                                <span className="text-sm text-gray-400 w-4">{index + 1}.</span>
                                                <input
                                                    type="url"
                                                    value={url}
                                                    onChange={(e) => {
                                                        const newImages = [...formData.images];
                                                        newImages[index] = e.target.value;
                                                        setFormData({ ...formData, images: newImages });
                                                    }}
                                                    placeholder="https://images.unsplash.com/photo-..."
                                                    className="flex-1 px-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500"
                                                />
                                                {url && (
                                                    <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                        {/* eslint-disable-next-line @next/next/no-img-element */}
                                                        <img
                                                            src={url}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => (e.currentTarget.style.display = 'none')}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <p className="text-xs text-gray-400 mt-2">
                                        💡 Có thể lấy ảnh từ Unsplash, Pexels hoặc URL công khai khác
                                    </p>
                                </div>
                            </div>
                        )}

                        {modalType === 'category' && (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên danh mục *</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                        placeholder="VD: Biển đảo"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Icon (emoji)</label>
                                    <input
                                        type="text"
                                        value={formData.icon}
                                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-200 rounded-xl"
                                        placeholder="VD: 🏖️"
                                    />
                                </div>
                            </div>
                        )}

                        <div className="flex justify-end gap-3 mt-6 pt-6 border-t">
                            <button onClick={() => setShowModal(false)} className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-xl">
                                Hủy
                            </button>
                            <button onClick={handleSave} className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700">
                                {editingItem ? 'Cập nhật' : 'Tạo mới'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
