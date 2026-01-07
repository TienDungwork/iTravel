import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Calendar, Sparkles, ArrowRight, Star, Users, TrendingUp, Heart, Compass, Sun, Mountain, Waves, Building2 } from 'lucide-react';

const categories = [
  { icon: Waves, name: 'Biển đảo', slug: 'bien-dao', gradient: 'from-cyan-400 via-blue-500 to-blue-600', bgColor: 'bg-blue-50' },
  { icon: Mountain, name: 'Núi rừng', slug: 'nui-rung', gradient: 'from-green-400 via-emerald-500 to-teal-600', bgColor: 'bg-green-50' },
  { icon: Sun, name: 'Tâm linh', slug: 'tam-linh', gradient: 'from-amber-400 via-orange-500 to-red-500', bgColor: 'bg-amber-50' },
  { icon: Building2, name: 'Di tích', slug: 'di-tich', gradient: 'from-purple-400 via-violet-500 to-indigo-600', bgColor: 'bg-purple-50' },
  { icon: Compass, name: 'Sinh thái', slug: 'sinh-thai', gradient: 'from-teal-400 via-cyan-500 to-sky-600', bgColor: 'bg-teal-50' },
  { icon: Heart, name: 'Lãng mạn', slug: 'lang-man', gradient: 'from-pink-400 via-rose-500 to-red-500', bgColor: 'bg-pink-50' },
];

const featuredDestinations = [
  {
    id: 1,
    name: 'Vịnh Hạ Long',
    slug: 'vinh-ha-long',
    province: 'Quảng Ninh',
    image: 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800',
    rating: 4.8,
    reviews: 1250,
    price: '1.500.000đ',
    tag: 'UNESCO',
  },
  {
    id: 2,
    name: 'Đà Lạt',
    slug: 'da-lat',
    province: 'Lâm Đồng',
    image: 'https://images.unsplash.com/photo-1582639510494-c80b5de9f148?w=800',
    rating: 4.7,
    reviews: 980,
    price: '800.000đ',
    tag: 'Yêu thích',
  },
  {
    id: 3,
    name: 'Phú Quốc',
    slug: 'phu-quoc',
    province: 'Kiên Giang',
    image: 'https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=800',
    rating: 4.6,
    reviews: 1520,
    price: '2.000.000đ',
    tag: 'Hot',
  },
  {
    id: 4,
    name: 'Sapa',
    slug: 'sapa',
    province: 'Lào Cai',
    image: 'https://images.unsplash.com/photo-1570366583862-f91883984fde?w=800',
    rating: 4.7,
    reviews: 890,
    price: '1.000.000đ',
    tag: 'Trending',
  },
];

const stats = [
  { icon: MapPin, value: '50+', label: 'Địa điểm', color: 'text-emerald-500' },
  { icon: Users, value: '10K+', label: 'Du khách', color: 'text-blue-500' },
  { icon: Star, value: '4.8', label: 'Đánh giá', color: 'text-amber-500' },
  { icon: TrendingUp, value: '95%', label: 'Hài lòng', color: 'text-pink-500' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-mesh">
      {/* Hero Section */}
      <section className="relative min-h-[95vh] flex items-center justify-center overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1920"
            alt="Vietnam landscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-emerald-900/80" />

          {/* Floating Elements */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center text-white">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20 mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-medium">Khám phá Việt Nam thông minh với AI</span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-6 animate-fade-in">
            <span className="bg-gradient-to-r from-white via-emerald-200 to-cyan-200 bg-clip-text text-transparent">
              Khám phá
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent animate-gradient bg-[length:200%_200%]">
              Việt Nam
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-200 mb-10 max-w-3xl mx-auto animate-fade-in opacity-0 stagger-1">
            Hành trình khám phá những điểm đến tuyệt vời nhất cùng lịch trình AI thông minh
          </p>

          {/* Search Box - Glassmorphism */}
          <div className="glass rounded-3xl p-6 md:p-8 max-w-5xl mx-auto shadow-2xl animate-fade-in opacity-0 stagger-2">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-gray-200/50 group hover:bg-white/80 transition-all">
                <div className="p-2 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl text-white">
                  <MapPin className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Bạn muốn đi đâu?"
                  className="bg-transparent w-full outline-none text-gray-800 placeholder-gray-500 font-medium"
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-gray-200/50 group hover:bg-white/80 transition-all">
                <div className="p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl text-white">
                  <Calendar className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Thời gian"
                  className="bg-transparent w-full outline-none text-gray-800 placeholder-gray-500 font-medium"
                />
              </div>
              <div className="flex items-center gap-3 p-4 bg-white/50 rounded-2xl border border-gray-200/50 group hover:bg-white/80 transition-all">
                <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl text-white">
                  <Users className="w-5 h-5" />
                </div>
                <input
                  type="text"
                  placeholder="Số người"
                  className="bg-transparent w-full outline-none text-gray-800 placeholder-gray-500 font-medium"
                />
              </div>
              <Link
                href="/destinations"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 text-white px-6 py-4 rounded-2xl font-bold hover:shadow-lg hover:shadow-emerald-500/30 transition-all transform hover:scale-[1.02] animate-gradient bg-[length:200%_200%]"
              >
                <Search className="w-5 h-5" />
                <span>Tìm kiếm</span>
              </Link>
            </div>
          </div>

          {/* AI CTA */}
          <Link
            href="/itinerary"
            className="inline-flex items-center gap-3 mt-10 px-8 py-4 bg-white/10 backdrop-blur-md text-white border border-white/30 rounded-full hover:bg-white/20 hover:border-white/50 transition-all group animate-fade-in opacity-0 stagger-3"
          >
            <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-medium">Hoặc để AI gợi ý lịch trình hoàn hảo cho bạn</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-8 h-12 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <div className="w-1.5 h-3 bg-white/80 rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats - Floating Cards */}
      <section className="relative z-20 py-12 bg-gradient-to-b from-emerald-900/20 to-transparent">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="glass rounded-2xl p-6 text-center hover-lift animate-fade-in opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-br ${index === 0 ? 'from-emerald-100 to-teal-100' :
                  index === 1 ? 'from-blue-100 to-cyan-100' :
                    index === 2 ? 'from-amber-100 to-orange-100' :
                      'from-pink-100 to-rose-100'
                  } mb-3`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories - Vibrant Cards */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-14">
            <span className="inline-block px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full text-sm font-semibold mb-4">
              Danh mục
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Khám phá theo <span className="text-gradient">phong cách</span>
            </h2>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Chọn loại hình du lịch phù hợp với sở thích của bạn
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5">
            {categories.map((category, index) => (
              <Link
                key={category.slug}
                href={`/destinations?category=${category.slug}`}
                className="group relative overflow-hidden rounded-3xl p-6 text-center bg-white shadow-lg hover-lift animate-fade-in opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${category.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-300`} />

                {/* Icon with gradient background */}
                <div className={`relative z-10 inline-flex p-4 ${category.bgColor} rounded-2xl mb-4 group-hover:bg-white/20 transition-colors`}>
                  <category.icon className={`w-8 h-8 bg-gradient-to-br ${category.gradient} bg-clip-text text-transparent group-hover:text-white transition-colors`}
                    style={{ stroke: 'url(#gradient)' }}
                  />
                  <svg width="0" height="0">
                    <defs>
                      <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#10b981" />
                        <stop offset="100%" stopColor="#0ea5e9" />
                      </linearGradient>
                    </defs>
                  </svg>
                </div>

                <h3 className="relative z-10 font-bold text-gray-900 group-hover:text-white transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations - Premium Cards */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-14 gap-4">
            <div>
              <span className="inline-block px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold mb-4">
                Nổi bật
              </span>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Điểm đến <span className="text-gradient-vibrant">yêu thích</span>
              </h2>
              <p className="text-gray-600 text-lg">Những địa điểm được du khách đánh giá cao nhất</p>
            </div>
            <Link
              href="/destinations"
              className="group inline-flex items-center gap-2 px-6 py-3 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((dest, index) => (
              <Link
                key={dest.id}
                href={`/destinations/${dest.slug}`}
                className="animate-fade-in opacity-0"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="group relative h-[420px] rounded-3xl overflow-hidden shadow-xl hover-lift">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    sizes="(max-width: 768px) 100vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />

                  {/* Tag */}
                  <div className="absolute top-4 left-4">
                    <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${dest.tag === 'Hot' ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white' :
                      dest.tag === 'UNESCO' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white' :
                        dest.tag === 'Trending' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' :
                          'bg-gradient-to-r from-emerald-500 to-teal-500 text-white'
                      }`}>
                      {dest.tag}
                    </span>
                  </div>

                  {/* Rating */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1.5 bg-white/95 backdrop-blur-sm rounded-full shadow-lg">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-bold text-gray-900">{dest.rating}</span>
                  </div>

                  {/* Favorite Button */}
                  <button className="absolute top-16 right-4 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 hover:scale-110">
                    <Heart className="w-4 h-4 text-gray-600 hover:text-red-500" />
                  </button>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-emerald-400 transition-colors">{dest.name}</h3>
                    <div className="flex items-center gap-2 text-gray-300 text-sm mb-4">
                      <MapPin className="w-4 h-4" />
                      <span>{dest.province}</span>
                    </div>
                    <div className="flex items-center justify-between pt-4 border-t border-white/20">
                      <div>
                        <span className="text-xs text-gray-400">Từ</span>
                        <p className="text-xl font-bold text-emerald-400">{dest.price}</p>
                      </div>
                      <div className="text-right">
                        <span className="text-xs text-gray-400">{dest.reviews}</span>
                        <p className="text-sm font-medium">đánh giá</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* AI CTA Section - Premium Design */}
      <section className="py-24 relative overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700" />
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-10 w-80 h-80 bg-yellow-400/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }} />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white">
          <div className="inline-flex p-4 bg-white/10 backdrop-blur-sm rounded-full mb-8 animate-pulse-glow">
            <Sparkles className="w-12 h-12 text-yellow-300" />
          </div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Để <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">AI</span> lên lịch trình cho bạn
          </h2>
          <p className="text-xl text-emerald-100 mb-10 max-w-3xl mx-auto">
            Chỉ cần cho chúng tôi biết ngân sách, thời gian và sở thích - AI sẽ tạo ra lịch trình hoàn hảo nhất cho chuyến đi của bạn trong vài giây
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/itinerary"
              className="group flex items-center gap-3 bg-white text-emerald-600 px-10 py-5 rounded-full font-bold text-lg hover:bg-emerald-50 transition-all shadow-2xl hover:shadow-white/20"
            >
              <Sparkles className="w-6 h-6" />
              <span>Bắt đầu ngay - Miễn phí!</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/destinations"
              className="flex items-center gap-2 px-8 py-5 border-2 border-white/50 text-white rounded-full font-semibold hover:bg-white/10 transition-colors"
            >
              <Compass className="w-5 h-5" />
              Khám phá thủ công
            </Link>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-emerald-200">
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-300 fill-yellow-300" />
              <span>4.9/5 Rating</span>
            </div>
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              <span>10K+ Du khách hài lòng</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              <span>98% Đề xuất cho bạn bè</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
