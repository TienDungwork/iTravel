'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, User, MapPin } from 'lucide-react';

export function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

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
                        <Link
                            href="/admin"
                            className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
                        >
                            <User className="w-4 h-4" />
                            <span>Admin</span>
                        </Link>
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
                            <Link href="/" className="text-gray-700 hover:text-emerald-600 font-medium">
                                Trang chủ
                            </Link>
                            <Link href="/destinations" className="text-gray-700 hover:text-emerald-600 font-medium">
                                Địa điểm
                            </Link>
                            <Link href="/itinerary" className="text-gray-700 hover:text-emerald-600 font-medium">
                                Lập lịch trình AI
                            </Link>
                            <Link href="/about" className="text-gray-700 hover:text-emerald-600 font-medium">
                                Giới thiệu
                            </Link>
                            <Link href="/admin" className="text-emerald-600 font-medium">
                                Admin
                            </Link>
                        </nav>
                    </div>
                )}
            </div>
        </header>
    );
}
