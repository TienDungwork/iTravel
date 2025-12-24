'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, Search, User, MapPin, LogOut, Heart, Settings, ChevronDown, Plane } from 'lucide-react';

export function Header() {
    const { data: session, status } = useSession();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <Link href="/" className="flex items-center gap-2">
                        <MapPin className="w-8 h-8 text-emerald-600" />
                        <span className="text-xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                            iTravel
                        </span>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link href="/" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                            Trang chủ
                        </Link>
                        <Link href="/destinations" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                            Địa điểm
                        </Link>
                        <Link href="/itinerary" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                            Lập lịch trình AI
                        </Link>
                        <Link href="/about" className="text-gray-700 hover:text-emerald-600 transition-colors font-medium">
                            Giới thiệu
                        </Link>
                    </nav>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-4">
                        <button className="p-2 text-gray-600 hover:text-emerald-600 transition-colors">
                            <Search className="w-5 h-5" />
                        </button>

                        {status === 'loading' ? (
                            <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse" />
                        ) : session?.user ? (
                            <div className="relative">
                                <button
                                    onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                                    className="flex items-center gap-2 px-3 py-2 rounded-full hover:bg-gray-100 transition-colors"
                                >
                                    <div className="w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center font-semibold">
                                        {session.user.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <span className="font-medium text-gray-700">{session.user.name}</span>
                                    <ChevronDown className="w-4 h-4 text-gray-500" />
                                </button>

                                {isUserMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50">
                                        <div className="px-4 py-3 border-b border-gray-100">
                                            <p className="font-semibold text-gray-900">{session.user.name}</p>
                                            <p className="text-sm text-gray-500">{session.user.email}</p>
                                        </div>
                                        <Link
                                            href="/trips"
                                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <Plane className="w-4 h-4" />
                                            <span>Lịch trình của tôi</span>
                                        </Link>
                                        <Link
                                            href="/favorites"
                                            className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                            onClick={() => setIsUserMenuOpen(false)}
                                        >
                                            <Heart className="w-4 h-4" />
                                            <span>Yêu thích</span>
                                        </Link>
                                        {session.user.role === 'admin' && (
                                            <Link
                                                href="/admin"
                                                className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50"
                                                onClick={() => setIsUserMenuOpen(false)}
                                            >
                                                <Settings className="w-4 h-4" />
                                                <span>Quản trị</span>
                                            </Link>
                                        )}
                                        <button
                                            onClick={() => {
                                                setIsUserMenuOpen(false);
                                                signOut({ callbackUrl: '/' });
                                            }}
                                            className="flex items-center gap-3 w-full px-4 py-2 text-red-600 hover:bg-red-50"
                                        >
                                            <LogOut className="w-4 h-4" />
                                            <span>Đăng xuất</span>
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <Link
                                href="/auth/login"
                                className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
                            >
                                <User className="w-4 h-4" />
                                <span>Đăng nhập</span>
                            </Link>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="md:hidden p-2 text-gray-600"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>

                {/* Mobile Menu */}
                {isMenuOpen && (
                    <div className="md:hidden py-4 border-t border-gray-100">
                        <nav className="flex flex-col gap-4">
                            <Link href="/" className="text-gray-700 hover:text-emerald-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                                Trang chủ
                            </Link>
                            <Link href="/destinations" className="text-gray-700 hover:text-emerald-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                                Địa điểm
                            </Link>
                            <Link href="/itinerary" className="text-gray-700 hover:text-emerald-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                                Lập lịch trình AI
                            </Link>
                            <Link href="/about" className="text-gray-700 hover:text-emerald-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                                Giới thiệu
                            </Link>
                            {session?.user ? (
                                <>
                                    <Link href="/trips" className="text-gray-700 hover:text-emerald-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                                        Lịch trình của tôi
                                    </Link>
                                    <Link href="/favorites" className="text-gray-700 hover:text-emerald-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                                        Yêu thích
                                    </Link>
                                    {session.user.role === 'admin' && (
                                        <Link href="/admin" className="text-emerald-600 font-medium" onClick={() => setIsMenuOpen(false)}>
                                            Quản trị
                                        </Link>
                                    )}
                                    <button
                                        onClick={() => signOut({ callbackUrl: '/' })}
                                        className="text-red-600 font-medium text-left"
                                    >
                                        Đăng xuất
                                    </button>
                                </>
                            ) : (
                                <Link href="/auth/login" className="text-emerald-600 font-medium" onClick={() => setIsMenuOpen(false)}>
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
