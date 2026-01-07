import Link from 'next/link';
import { MapPin, Mail, Phone, Facebook, Instagram, Youtube, Heart, Sparkles, ArrowRight } from 'lucide-react';

export function Footer() {
    return (
        <footer className="relative overflow-hidden">
            {/* Newsletter Section */}
            <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <Sparkles className="w-10 h-10 text-yellow-300 mx-auto mb-4" />
                    <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
                        Nhận tin tức du lịch mới nhất
                    </h3>
                    <p className="text-emerald-100 mb-8">
                        Đăng ký nhận thông tin về điểm đến hot và ưu đãi đặc biệt
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 max-w-xl mx-auto">
                        <input
                            type="email"
                            placeholder="Nhập email của bạn..."
                            className="flex-1 px-6 py-4 rounded-xl bg-white/20 backdrop-blur-sm text-white placeholder-white/70 border border-white/30 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                        <button className="px-8 py-4 bg-white text-emerald-600 font-bold rounded-xl hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 shadow-lg">
                            Đăng ký
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Main Footer */}
            <div className="bg-gray-900 text-gray-300">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
                        {/* Brand */}
                        <div>
                            <Link href="/" className="flex items-center gap-3 mb-6">
                                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl">
                                    <MapPin className="w-6 h-6 text-white" />
                                </div>
                                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
                                    iTravel
                                </span>
                            </Link>
                            <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                Website quảng bá du lịch địa phương và hỗ trợ lựa chọn lịch trình du lịch thông minh với AI.
                            </p>
                            <div className="flex gap-3">
                                {[
                                    { icon: Facebook, color: 'hover:bg-blue-600' },
                                    { icon: Instagram, color: 'hover:bg-pink-600' },
                                    { icon: Youtube, color: 'hover:bg-red-600' },
                                ].map((social, index) => (
                                    <a
                                        key={index}
                                        href="#"
                                        className={`p-3 bg-gray-800 rounded-xl text-gray-400 hover:text-white ${social.color} transition-all`}
                                    >
                                        <social.icon className="w-5 h-5" />
                                    </a>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-6">Liên kết nhanh</h3>
                            <ul className="space-y-4">
                                {[
                                    { href: '/destinations', label: 'Địa điểm du lịch' },
                                    { href: '/itinerary', label: 'Lập lịch trình AI' },
                                    { href: '/trips', label: 'Lịch trình của tôi' },
                                    { href: '/favorites', label: 'Yêu thích' },
                                    { href: '/about', label: 'Về chúng tôi' },
                                ].map((link) => (
                                    <li key={link.href}>
                                        <Link
                                            href={link.href}
                                            className="text-gray-400 hover:text-emerald-400 transition-colors flex items-center gap-2 group"
                                        >
                                            <ArrowRight className="w-4 h-4 opacity-0 -ml-5 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Categories */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-6">Loại hình du lịch</h3>
                            <ul className="space-y-4">
                                {[
                                    { href: 'bien-dao', label: '🏖️ Biển đảo' },
                                    { href: 'nui-rung', label: '🏔️ Núi rừng' },
                                    { href: 'di-tich', label: '🏛️ Di tích lịch sử' },
                                    { href: 'tam-linh', label: '🛕 Tâm linh' },
                                    { href: 'sinh-thai', label: '🌿 Sinh thái' },
                                ].map((cat) => (
                                    <li key={cat.href}>
                                        <Link
                                            href={`/destinations?category=${cat.href}`}
                                            className="text-gray-400 hover:text-emerald-400 transition-colors"
                                        >
                                            {cat.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Contact */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-6">Liên hệ</h3>
                            <ul className="space-y-4">
                                <li className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-800 rounded-lg">
                                        <Mail className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <span className="text-sm">contact@itravel.vn</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-800 rounded-lg">
                                        <Phone className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <span className="text-sm">1900 1234</span>
                                </li>
                                <li className="flex items-center gap-3">
                                    <div className="p-2 bg-gray-800 rounded-lg">
                                        <MapPin className="w-4 h-4 text-emerald-400" />
                                    </div>
                                    <span className="text-sm">Hà Nội, Việt Nam</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Bottom */}
                <div className="border-t border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-sm text-gray-500">
                            © 2024 iTravel. All rights reserved.
                        </p>
                        <p className="text-sm text-gray-500 flex items-center gap-1">
                            Made with <Heart className="w-4 h-4 text-red-500 fill-red-500" /> in Vietnam
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
