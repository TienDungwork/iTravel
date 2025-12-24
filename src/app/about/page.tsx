import Image from 'next/image';
import Link from 'next/link';
import { MapPin, Compass, Heart, Sparkles, ArrowRight, Shield, Clock, Award, Globe, Users } from 'lucide-react';

const features = [
    {
        icon: Compass,
        title: 'Khám phá dễ dàng',
        description: 'Hàng trăm địa điểm du lịch tuyệt đẹp được cập nhật liên tục với thông tin chi tiết và đánh giá thực tế',
    },
    {
        icon: Sparkles,
        title: 'Lịch trình thông minh',
        description: 'Công nghệ AI tiên tiến giúp bạn lên kế hoạch chuyến đi hoàn hảo chỉ trong vài phút',
    },
    {
        icon: Heart,
        title: 'Trải nghiệm cá nhân hóa',
        description: 'Gợi ý địa điểm phù hợp với sở thích, ngân sách và thời gian của riêng bạn',
    },
    {
        icon: Shield,
        title: 'Thông tin đáng tin cậy',
        description: 'Đánh giá chân thực từ cộng đồng du khách đã trải nghiệm thực tế',
    },
];

const stats = [
    { number: '500+', label: 'Địa điểm', icon: MapPin },
    { number: '50K+', label: 'Du khách', icon: Users },
    { number: '63', label: 'Tỉnh thành', icon: Globe },
    { number: '4.9', label: 'Đánh giá', icon: Award },
];

const testimonials = [
    {
        content: 'iTravel giúp tôi lên kế hoạch cho chuyến đi Đà Lạt chỉ trong 10 phút. Lịch trình AI gợi ý rất hợp lý và tiết kiệm chi phí!',
        author: 'Minh Anh',
        location: 'Hà Nội',
        avatar: '👩',
    },
    {
        content: 'Trang web rất dễ sử dụng, thông tin địa điểm chi tiết và hình ảnh đẹp. Đây là công cụ không thể thiếu cho mỗi chuyến đi.',
        author: 'Hoàng Nam',
        location: 'TP. Hồ Chí Minh',
        avatar: '👨',
    },
    {
        content: 'Chức năng lập lịch trình AI thật sự ấn tượng! Nó hiểu được sở thích của tôi và đề xuất những địa điểm phù hợp.',
        author: 'Thu Hương',
        location: 'Đà Nẵng',
        avatar: '👩',
    },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen">
            {/* Hero */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-600" />
                <div className="absolute inset-0 opacity-20">
                    <Image
                        src="https://images.unsplash.com/photo-1528127269322-539801943592?w=1920"
                        alt="Vietnam travel"
                        fill
                        className="object-cover"
                    />
                </div>
                <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
                    <span className="inline-block px-4 py-2 bg-white/20 rounded-full text-sm font-medium mb-6 backdrop-blur-sm">
                        🇻🇳 Nền tảng du lịch #1 Việt Nam
                    </span>
                    <h1 className="text-4xl md:text-6xl font-bold mb-6">
                        Khám phá Việt Nam
                        <br />
                        <span className="text-emerald-200">theo cách của bạn</span>
                    </h1>
                    <p className="text-xl text-emerald-100 max-w-2xl mx-auto mb-8">
                        iTravel là người bạn đồng hành đáng tin cậy trong mỗi hành trình khám phá vẻ đẹp Việt Nam - từ những bãi biển xanh ngắt đến những đỉnh núi hùng vĩ.
                    </p>
                    <Link
                        href="/destinations"
                        className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all transform hover:scale-105"
                    >
                        Bắt đầu khám phá
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>

            {/* Stats */}
            <section className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                    <stat.icon className="w-8 h-8 text-white" />
                                </div>
                                <p className="text-4xl font-bold text-gray-900 mb-1">{stat.number}</p>
                                <p className="text-gray-500">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Mission */}
            <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-emerald-600 font-semibold mb-4 block">Về chúng tôi</span>
                            <h2 className="text-4xl font-bold text-gray-900 mb-6">
                                Mang đến trải nghiệm du lịch hoàn hảo
                            </h2>
                            <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                                Chúng tôi tin rằng mỗi chuyến đi đều là một câu chuyện đáng nhớ. iTravel ra đời với sứ mệnh kết nối du khách với những điểm đến tuyệt vời nhất Việt Nam, từ những bãi biển hoang sơ đến những thành phố sôi động.
                            </p>
                            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
                                Với công nghệ AI tiên tiến và dữ liệu được cập nhật liên tục từ cộng đồng, chúng tôi giúp bạn tiết kiệm thời gian lên kế hoạch và tối đa hóa trải nghiệm trong mỗi hành trình.
                            </p>
                            <div className="flex items-center gap-6">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-5 h-5 text-emerald-600" />
                                    <span className="text-gray-700">Tiết kiệm thời gian</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Award className="w-5 h-5 text-emerald-600" />
                                    <span className="text-gray-700">Trải nghiệm tốt nhất</span>
                                </div>
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute -top-4 -left-4 w-72 h-72 bg-emerald-200 rounded-3xl -z-10" />
                            <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                                <Image
                                    src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=800"
                                    alt="Vietnam landscape"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-xl">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                                        <Heart className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-gray-900">98%</p>
                                        <p className="text-sm text-gray-500">Hài lòng</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Tại sao chọn iTravel?
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Chúng tôi mang đến những công cụ và tính năng tốt nhất để hành trình của bạn trở nên hoàn hảo
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div key={index} className="group bg-gradient-to-b from-gray-50 to-white rounded-3xl p-8 hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-emerald-200">
                                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                                    <feature.icon className="w-7 h-7 text-white" />
                                </div>
                                <h3 className="font-bold text-xl text-gray-900 mb-3">{feature.title}</h3>
                                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials */}
            <section className="py-20 bg-gradient-to-b from-emerald-50 to-white">
                <div className="max-w-7xl mx-auto px-4">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl font-bold text-gray-900 mb-4">
                            Khách hàng nói gì về chúng tôi
                        </h2>
                        <p className="text-gray-600 max-w-2xl mx-auto text-lg">
                            Hàng nghìn du khách đã tin tưởng iTravel cho hành trình của họ
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((item, index) => (
                            <div key={index} className="bg-white rounded-3xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                                <div className="flex items-center gap-1 text-yellow-400 mb-4">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20">
                                            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-gray-600 mb-6 leading-relaxed">&ldquo;{item.content}&rdquo;</p>
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">{item.avatar}</span>
                                    <div>
                                        <p className="font-semibold text-gray-900">{item.author}</p>
                                        <p className="text-sm text-gray-500">{item.location}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2" />
                </div>
                <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
                    <h2 className="text-4xl font-bold mb-4">
                        Sẵn sàng cho chuyến phiêu lưu tiếp theo?
                    </h2>
                    <p className="text-emerald-100 text-xl mb-8 max-w-2xl mx-auto">
                        Hàng trăm địa điểm tuyệt đẹp đang chờ bạn khám phá. Bắt đầu hành trình ngay hôm nay!
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/destinations"
                            className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all transform hover:scale-105"
                        >
                            <MapPin className="w-5 h-5" />
                            Khám phá địa điểm
                        </Link>
                        <Link
                            href="/itinerary"
                            className="inline-flex items-center gap-2 bg-emerald-700 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-800 transition-all border-2 border-emerald-500"
                        >
                            <Sparkles className="w-5 h-5" />
                            Tạo lịch trình AI
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
