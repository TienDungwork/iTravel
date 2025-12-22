import Link from 'next/link';
import { MapPin, Mail, Phone, Facebook, Instagram, Youtube } from 'lucide-react';

export function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div>
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <MapPin className="w-8 h-8 text-emerald-500" />
                            <span className="text-xl font-bold text-white">iTravel</span>
                        </Link>
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Website quảng bá du lịch địa phương và hỗ trợ lựa chọn lịch trình du lịch thông minh với AI.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Liên kết nhanh</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/destinations" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                                    Địa điểm du lịch
                                </Link>
                            </li>
                            <li>
                                <Link href="/itinerary" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                                    Lập lịch trình AI
                                </Link>
                            </li>
                            <li>
                                <Link href="/about" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                                    Về chúng tôi
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Loại hình du lịch</h3>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/destinations?category=bien-dao" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                                    🏖️ Biển đảo
                                </Link>
                            </li>
                            <li>
                                <Link href="/destinations?category=nui-rung" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                                    🏔️ Núi rừng
                                </Link>
                            </li>
                            <li>
                                <Link href="/destinations?category=di-tich" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                                    🏛️ Di tích lịch sử
                                </Link>
                            </li>
                            <li>
                                <Link href="/destinations?category=tam-linh" className="text-gray-400 hover:text-emerald-500 transition-colors text-sm">
                                    🛕 Tâm linh
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-white font-semibold mb-4">Liên hệ</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-2 text-sm">
                                <Mail className="w-4 h-4 text-emerald-500" />
                                <span>contact@itravel.vn</span>
                            </li>
                            <li className="flex items-center gap-2 text-sm">
                                <Phone className="w-4 h-4 text-emerald-500" />
                                <span>1900 1234</span>
                            </li>
                        </ul>
                        <div className="flex gap-4 mt-4">
                            <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="text-gray-400 hover:text-emerald-500 transition-colors">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-500">
                    <p>© 2024 iTravel. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
