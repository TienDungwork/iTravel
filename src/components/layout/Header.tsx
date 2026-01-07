'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Search, User, MapPin, LogOut, Heart, Settings, ChevronDown, Plane, Sparkles } from 'lucide-react';

export function Header() {
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
            ? 'bg-white shadow-lg shadow-gray-100/50 border-b border-gray-200/50'
            : 'bg-white shadow-md border-b border-gray-100'
            }`}>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-3 group">
                        <div className="p-2 rounded-xl transition-all bg-gradient-to-br from-emerald-500 to-teal-500">
                            <MapPin className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold transition-colors bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                            iTravel
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-1">
                        {[
                            { href: '/', label: 'Trang chủ' },
                            { href: '/destinations', label: 'Địa điểm' },
                            { href: '/itinerary', label: 'AI Lịch trình', icon: Sparkles },
                            { href: '/about', label: 'Giới thiệu' },
                        ].map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-medium transition-all duration-200 text-gray-700 hover:text-emerald-600 hover:bg-gradient-to-r hover:from-emerald-50 hover:to-teal-50 hover:shadow-sm hover:scale-105"
                            >
                                {item.icon && <item.icon className="w-4 h-4 text-yellow-500" />}
                                {item.label}
                            </Link>
                        ))}
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-3">

                        {status === 'loading' ? (
                            <div className="w-10 h-10 rounded-xl bg-gray-200 animate-pulse" />
                        ) : session?.user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className={`flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${isScrolled
                                        ? 'hover:bg-gray-100'
                                        : 'hover:bg-white/10'
                                        }`}
                                >
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex items-center justify-center font-bold text-lg shadow-lg shadow-emerald-500/30">
                                        {session.user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div className={`text-left ${isScrolled ? 'text-gray-900' : 'text-white'}`}>
                                        <p className="font-semibold text-sm">{session.user.name}</p>
                                        <p className={`text-xs ${isScrolled ? 'text-gray-500' : 'text-white/70'}`}>
                                            {session.user.role === 'admin' ? 'Quản trị viên' : 'Thành viên'}
                                        </p>
                                    </div>
                                    <ChevronDown className={`w-4 h-4 transition-transform ${isUserMenuOpen ? 'rotate-180' : ''} ${isScrolled ? 'text-gray-400' : 'text-white/70'}`} />
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-2xl border border-gray-100 py-2 z-50 animate-scale-in">
                                        <div className="px-4 py-4 border-b border-gray-100 bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-2xl">
                                            <p className="font-bold text-gray-900">{session.user.name}</p>
                                            <p className="text-sm text-gray-500">{session.user.email}</p>
                                        </div>
                                        <div className="py-2">
                                            <Link
                                                href="/trips"
                                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <div className="p-2 bg-blue-100 rounded-lg">
                                                    <Plane className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <span className="font-medium">Lịch trình của tôi</span>
                                            </Link>
                                            <Link
                                                href="/favorites"
                                                className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <div className="p-2 bg-pink-100 rounded-lg">
                                                    <Heart className="w-4 h-4 text-pink-600" />
                                                </div>
                                                <span className="font-medium">Yêu thích</span>
                                            </Link>
                                            {session.user.role === 'admin' && (
                                                <Link
                                                    href="/admin"
                                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                                                    onClick={() => setIsUserMenuOpen(false)}
                                                >
                                                    <div className="p-2 bg-purple-100 rounded-lg">
                                                        <Settings className="w-4 h-4 text-purple-600" />
                                                    </div>
                                                    <span className="font-medium">Quản trị</span>
                                                </Link>
                                            )}
                                        </div>
                                        <div className="px-3 pt-2 border-t border-gray-100">
                                            <button
                                                onClick={() => {
                                                    setIsUserMenuOpen(false);
                                                    signOut({ callbackUrl: '/' });
                                                }}
                                                className="flex items-center gap-3 w-full px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                                            >
                                                <div className="p-2 bg-red-100 rounded-lg">
                                                    <LogOut className="w-4 h-4 text-red-600" />
                                                </div>
                                                <span className="font-medium">Đăng xuất</span>
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:scale-105"
                            >
                                <User className="w-4 h-4" />
                                <span>Đăng nhập</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className={`md:hidden p-2.5 rounded-xl transition-colors ${isScrolled
                            ? 'text-gray-600 hover:bg-gray-100'
                            : 'text-white hover:bg-white/10'
                            }`}
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-6 border-t border-gray-100 bg-white rounded-b-3xl shadow-lg animate-slide-up">
                        <nav className="flex flex-col gap-2 px-2">
                            {[
                                { href: '/', label: 'Trang chủ', icon: MapPin },
                                { href: '/destinations', label: 'Địa điểm', icon: MapPin },
                                { href: '/itinerary', label: 'AI Lịch trình', icon: Sparkles },
                                { href: '/about', label: 'Giới thiệu', icon: User },
                            ].map((item) => (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl font-medium transition-colors"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </Link>
                            ))}

                            {session?.user ? (
                                <>
                                    <div className="border-t border-gray-100 my-2" />
                                    <Link href="/trips" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl font-medium" onClick={() => setIsMenuOpen(false)}>
                                        <Plane className="w-5 h-5" />
                                        Lịch trình của tôi
                                    </Link>
                                    <Link href="/favorites" className="flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl font-medium" onClick={() => setIsMenuOpen(false)}>
                                        <Heart className="w-5 h-5" />
                                        Yêu thích
                                    </Link>
                                    {session.user.role === 'admin' && (
                                        <Link href="/admin" className="flex items-center gap-3 px-4 py-3 text-emerald-600 hover:bg-emerald-50 rounded-xl font-medium" onClick={() => setIsMenuOpen(false)}>
                                            <Settings className="w-5 h-5" />
                                            Quản trị
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl font-medium text-left"
                                    >
                                        <LogOut className="w-5 h-5" />
                                        Đăng xuất
                                    </button>
                                </>
                            ) : (
                                <Link
                                    href="/auth/login"
                                    className="flex items-center justify-center gap-2 mx-2 mt-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl font-semibold"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <User className="w-5 h-5" />
                                    Đăng nhập
                                </Link>
                            )}
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
