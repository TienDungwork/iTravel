'use client';

import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Mail, Lock, ArrowRight, AlertCircle, Sparkles, Star } from 'lucide-react';

export default function LoginPage() {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                setError(result.error);
            } else {
                router.push('/');
                router.refresh();
            }
        } catch {
            setError('Có lỗi xảy ra, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex">
            {/* Left Side - Image */}
            <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
                <Image
                    src="https://images.unsplash.com/photo-1528127269322-539801943592?w=1920"
                    alt="Vietnam Travel"
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600/90 via-teal-600/80 to-cyan-700/90" />

                {/* Floating elements */}
                <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                <div className="absolute bottom-20 right-20 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl" />

                {/* Content */}
                <div className="relative z-10 flex flex-col justify-center p-12 text-white">
                    <div className="flex items-center gap-3 mb-8">
                        <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                            <MapPin className="w-8 h-8" />
                        </div>
                        <span className="text-3xl font-bold">iTravel</span>
                    </div>

                    <h1 className="text-4xl font-bold mb-4">
                        Khám phá <span className="text-yellow-300">Việt Nam</span>
                        <br />cùng chúng tôi
                    </h1>
                    <p className="text-lg text-emerald-100 mb-10 max-w-md">
                        Hàng trăm địa điểm du lịch tuyệt vời đang chờ bạn khám phá
                    </p>

                    {/* Stats */}
                    <div className="flex gap-8">
                        {[
                            { value: '50+', label: 'Địa điểm' },
                            { value: '10K+', label: 'Du khách' },
                            { value: '4.9', label: 'Đánh giá', icon: Star },
                        ].map((stat, i) => (
                            <div key={i} className="text-center">
                                <p className="text-3xl font-bold flex items-center justify-center gap-1">
                                    {stat.value}
                                    {stat.icon && <stat.icon className="w-5 h-5 text-yellow-300 fill-yellow-300" />}
                                </p>
                                <p className="text-emerald-200 text-sm">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 bg-gradient-mesh">
                <div className="w-full max-w-md">
                    {/* Mobile Logo */}
                    <div className="text-center mb-8 lg:hidden">
                        <Link href="/" className="inline-flex items-center gap-2">
                            <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                                <MapPin className="w-6 h-6 text-white" />
                            </div>
                            <span className="text-2xl font-bold text-gradient">iTravel</span>
                        </Link>
                    </div>

                    {/* Welcome */}
                    <div className="text-center mb-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Chào mừng trở lại! 👋</h2>
                        <p className="text-gray-600">Đăng nhập để tiếp tục hành trình</p>
                    </div>

                    {/* Form */}
                    <div className="glass rounded-3xl p-8 shadow-2xl">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Error Message */}
                            {error && (
                                <div className="flex items-center gap-3 p-4 bg-red-50 text-red-600 rounded-2xl border border-red-100 animate-scale-in">
                                    <div className="p-2 bg-red-100 rounded-lg">
                                        <AlertCircle className="w-5 h-5" />
                                    </div>
                                    <span className="text-sm font-medium">{error}</span>
                                </div>
                            )}

                            {/* Email */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Email
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-100 rounded-lg">
                                        <Mail className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="w-full pl-16 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    Mật khẩu
                                </label>
                                <div className="relative">
                                    <div className="absolute left-4 top-1/2 -translate-y-1/2 p-2 bg-gray-100 rounded-lg">
                                        <Lock className="w-4 h-4 text-gray-500" />
                                    </div>
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="w-full pl-16 pr-4 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-emerald-500 outline-none transition-all font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white py-4 rounded-2xl font-bold text-lg hover:shadow-lg hover:shadow-emerald-500/30 transition-all disabled:opacity-50 transform hover:scale-[1.02]"
                            >
                                {loading ? (
                                    <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin" />
                                ) : (
                                    <>
                                        <span>Đăng nhập</span>
                                        <ArrowRight className="w-5 h-5" />
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Divider */}
                        <div className="flex items-center gap-4 my-6">
                            <div className="flex-1 h-px bg-gray-200" />
                            <span className="text-gray-400 text-sm">hoặc</span>
                            <div className="flex-1 h-px bg-gray-200" />
                        </div>

                        {/* Register Link */}
                        <div className="text-center text-gray-600">
                            Chưa có tài khoản?{' '}
                            <Link href="/auth/register" className="text-emerald-600 font-bold hover:underline">
                                Đăng ký ngay
                            </Link>
                        </div>
                    </div>

                    {/* Demo Account */}
                    <div className="mt-6 p-5 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl">
                        <div className="flex items-center gap-2 text-amber-700 mb-2">
                            <Sparkles className="w-4 h-4" />
                            <span className="font-bold text-sm">Tài khoản demo</span>
                        </div>
                        <div className="text-sm text-amber-800 space-y-1">
                            <p><span className="font-medium">Admin:</span> admin@itravel.vn / 123456</p>
                            <p><span className="font-medium">User:</span> user@itravel.vn / 123456</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
