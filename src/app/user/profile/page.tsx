'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
    User, Mail, Camera, Save, Lock, Eye, EyeOff,
    Calendar, Shield, Heart, MapPin, CheckCircle, AlertCircle
} from 'lucide-react';

interface UserProfile {
    _id: string;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    createdAt: string;
    favorites?: { _id: string; name: string; slug: string; images: string[] }[];
}

export default function ProfilePage() {
    const { data: session, status, update } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [activeTab, setActiveTab] = useState<'profile' | 'password' | 'favorites'>('profile');

    // Profile form
    const [name, setName] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    // Password form
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    // Messages
    const [message, setMessage] = useState({ type: '', text: '' });

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        }
    }, [status, router]);

    useEffect(() => {
        if (session?.user) {
            fetchProfile();
        }
    }, [session]);

    const fetchProfile = async () => {
        try {
            const res = await fetch('/api/user/profile');
            const data = await res.json();
            if (data.success) {
                setProfile(data.data);
                setName(data.data.name);
                setAvatarUrl(data.data.avatar || '');
            }
        } catch (error) {
            console.error('Failed to fetch profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const showMessage = (type: 'success' | 'error', text: string) => {
        setMessage({ type, text });
        setTimeout(() => setMessage({ type: '', text: '' }), 4000);
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            showMessage('error', 'Vui lòng nhập tên');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: name.trim(), avatar: avatarUrl }),
            });
            const data = await res.json();

            if (data.success) {
                showMessage('success', 'Cập nhật thông tin thành công!');
                setProfile(data.data);
                // Update session
                await update({ name: name.trim() });
            } else {
                showMessage('error', data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            showMessage('error', 'Không thể cập nhật thông tin');
        } finally {
            setSaving(false);
        }
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!currentPassword || !newPassword || !confirmPassword) {
            showMessage('error', 'Vui lòng điền đầy đủ thông tin');
            return;
        }

        if (newPassword.length < 6) {
            showMessage('error', 'Mật khẩu mới phải có ít nhất 6 ký tự');
            return;
        }

        if (newPassword !== confirmPassword) {
            showMessage('error', 'Mật khẩu xác nhận không khớp');
            return;
        }

        setSaving(true);
        try {
            const res = await fetch('/api/user/password', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ currentPassword, newPassword }),
            });
            const data = await res.json();

            if (data.success) {
                showMessage('success', 'Đổi mật khẩu thành công!');
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            } else {
                showMessage('error', data.error || 'Có lỗi xảy ra');
            }
        } catch (error) {
            showMessage('error', 'Không thể đổi mật khẩu');
        } finally {
            setSaving(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
            </div>
        );
    }

    if (!session || !profile) {
        return null;
    }

    const tabs = [
        { id: 'profile', label: 'Thông tin cá nhân', icon: User },
        { id: 'password', label: 'Đổi mật khẩu', icon: Lock },
        { id: 'favorites', label: 'Yêu thích', icon: Heart },
    ];

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white py-8">
            {/* Toast Message */}
            {message.text && (
                <div className={`fixed top-24 right-4 z-50 flex items-center gap-2 px-5 py-4 rounded-2xl shadow-xl ${message.type === 'success' ? 'bg-emerald-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                    {message.text}
                </div>
            )}

            <div className="max-w-5xl mx-auto px-4">
                {/* Header Card */}
                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-3xl p-8 text-white mb-8 shadow-xl">
                    <div className="flex flex-col md:flex-row items-center gap-6">
                        {/* Avatar */}
                        <div className="relative">
                            <div className="w-28 h-28 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center overflow-hidden border-4 border-white/30">
                                {profile.avatar ? (
                                    <Image
                                        src={profile.avatar}
                                        alt={profile.name}
                                        fill
                                        className="object-cover"
                                    />
                                ) : (
                                    <span className="text-4xl font-bold">{profile.name.charAt(0).toUpperCase()}</span>
                                )}
                            </div>
                            <div className="absolute -bottom-1 -right-1 p-2 bg-white rounded-full shadow-lg">
                                <Camera className="w-4 h-4 text-emerald-600" />
                            </div>
                        </div>

                        {/* Info */}
                        <div className="text-center md:text-left flex-1">
                            <h1 className="text-2xl md:text-3xl font-bold mb-2">{profile.name}</h1>
                            <p className="text-emerald-100 flex items-center justify-center md:justify-start gap-2">
                                <Mail className="w-4 h-4" />
                                {profile.email}
                            </p>
                            <div className="flex items-center justify-center md:justify-start gap-4 mt-3 text-sm text-emerald-100">
                                <span className="flex items-center gap-1">
                                    <Calendar className="w-4 h-4" />
                                    Tham gia {formatDate(profile.createdAt)}
                                </span>
                                <span className="flex items-center gap-1">
                                    <Shield className="w-4 h-4" />
                                    {profile.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                                </span>
                            </div>
                        </div>

                        {/* Stats */}
                        <div className="flex gap-6">
                            <div className="text-center">
                                <p className="text-3xl font-bold">{profile.favorites?.length || 0}</p>
                                <p className="text-emerald-100 text-sm">Yêu thích</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="flex flex-col md:flex-row gap-6">
                    {/* Sidebar Tabs */}
                    <div className="md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-2xl shadow-lg p-4">
                            <nav className="space-y-2">
                                {tabs.map(tab => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id as typeof activeTab)}
                                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all ${activeTab === tab.id
                                                ? 'bg-emerald-50 text-emerald-600 font-medium'
                                                : 'text-gray-600 hover:bg-gray-50'
                                            }`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        {tab.label}
                                    </button>
                                ))}
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Profile Tab */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <User className="w-6 h-6 text-emerald-600" />
                                    Thông tin cá nhân
                                </h2>

                                <form onSubmit={handleUpdateProfile} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                            placeholder="Nhập họ và tên"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={profile.email}
                                            disabled
                                            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-500 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Email không thể thay đổi</p>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            URL Ảnh đại diện
                                        </label>
                                        <input
                                            type="url"
                                            value={avatarUrl}
                                            onChange={(e) => setAvatarUrl(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                            placeholder="https://example.com/avatar.jpg"
                                        />
                                        <p className="text-xs text-gray-400 mt-1">Nhập URL hình ảnh từ Unsplash, Gravatar, hoặc nguồn công khai khác</p>

                                        {avatarUrl && (
                                            <div className="mt-3 flex items-center gap-4">
                                                <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-100">
                                                    {/* eslint-disable-next-line @next/next/no-img-element */}
                                                    <img
                                                        src={avatarUrl}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => (e.currentTarget.style.display = 'none')}
                                                    />
                                                </div>
                                                <span className="text-sm text-gray-500">Xem trước</span>
                                            </div>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                                    >
                                        <Save className="w-5 h-5" />
                                        {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Password Tab */}
                        {activeTab === 'password' && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Lock className="w-6 h-6 text-emerald-600" />
                                    Đổi mật khẩu
                                </h2>

                                <form onSubmit={handleChangePassword} className="space-y-6">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mật khẩu hiện tại
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showCurrentPassword ? 'text' : 'password'}
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                placeholder="Nhập mật khẩu hiện tại"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Mật khẩu mới
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showNewPassword ? 'text' : 'password'}
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                                className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowNewPassword(!showNewPassword)}
                                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                            >
                                                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Xác nhận mật khẩu mới
                                        </label>
                                        <input
                                            type="password"
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                            placeholder="Nhập lại mật khẩu mới"
                                        />
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex items-center justify-center gap-2 w-full py-4 bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                                    >
                                        <Lock className="w-5 h-5" />
                                        {saving ? 'Đang xử lý...' : 'Đổi mật khẩu'}
                                    </button>
                                </form>
                            </div>
                        )}

                        {/* Favorites Tab */}
                        {activeTab === 'favorites' && (
                            <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
                                <h2 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                    <Heart className="w-6 h-6 text-emerald-600" />
                                    Địa điểm yêu thích
                                </h2>

                                {profile.favorites && profile.favorites.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {profile.favorites.map((dest) => (
                                            <a
                                                key={dest._id}
                                                href={`/destinations/${dest.slug}`}
                                                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-emerald-50 transition-all group"
                                            >
                                                <div className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                                                    {dest.images?.[0] ? (
                                                        <Image
                                                            src={dest.images[0]}
                                                            alt={dest.name}
                                                            width={64}
                                                            height={64}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-emerald-100 flex items-center justify-center">
                                                            <MapPin className="w-6 h-6 text-emerald-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                                                        {dest.name}
                                                    </h3>
                                                </div>
                                                <Heart className="w-5 h-5 text-red-400 fill-red-400" />
                                            </a>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-12">
                                        <Heart className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                                        <p className="text-gray-500 mb-4">Bạn chưa có địa điểm yêu thích nào</p>
                                        <a
                                            href="/destinations"
                                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-colors"
                                        >
                                            <MapPin className="w-5 h-5" />
                                            Khám phá địa điểm
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
