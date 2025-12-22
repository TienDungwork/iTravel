import Link from 'next/link';
import Image from 'next/image';
import { Search, MapPin, Calendar, Sparkles, ArrowRight, Star, Users, TrendingUp } from 'lucide-react';

const categories = [
  { icon: '🏖️', name: 'Biển đảo', slug: 'bien-dao', color: 'from-blue-500 to-cyan-400' },
  { icon: '🏔️', name: 'Núi rừng', slug: 'nui-rung', color: 'from-green-500 to-emerald-400' },
  { icon: '🛕', name: 'Tâm linh', slug: 'tam-linh', color: 'from-amber-500 to-orange-400' },
  { icon: '🏛️', name: 'Di tích', slug: 'di-tich', color: 'from-purple-500 to-pink-400' },
  { icon: '🌿', name: 'Sinh thái', slug: 'sinh-thai', color: 'from-teal-500 to-green-400' },
  { icon: '🏙️', name: 'Đô thị', slug: 'do-thi', color: 'from-gray-600 to-gray-500' },
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
  },
];

const stats = [
  { icon: MapPin, value: '50+', label: 'Địa điểm' },
  { icon: Users, value: '10K+', label: 'Du khách' },
  { icon: Star, value: '4.8', label: 'Đánh giá' },
  { icon: TrendingUp, value: '95%', label: 'Hài lòng' },
];

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1920"
            alt="Vietnam landscape"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/20 to-black/60" />
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-fade-in">
            Khám phá <span className="text-emerald-400">Việt Nam</span>
            <br />cùng iTravel
          </h1>
          <p className="text-lg md:text-xl text-gray-200 mb-8 max-w-2xl mx-auto animate-fade-in">
            Trải nghiệm du lịch thông minh với AI - Gợi ý lịch trình phù hợp cho mọi chuyến đi
          </p>

          {/* Search Box */}
          <div className="bg-white/95 backdrop-blur-md rounded-2xl p-4 md:p-6 max-w-4xl mx-auto shadow-2xl animate-fade-in">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl">
                <MapPin className="w-5 h-5 text-emerald-600" />
                <input
                  type="text"
                  placeholder="Bạn muốn đi đâu?"
                  className="bg-transparent w-full outline-none text-gray-800 placeholder-gray-500"
                />
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl">
                <Calendar className="w-5 h-5 text-emerald-600" />
                <input
                  type="text"
                  placeholder="Thời gian"
                  className="bg-transparent w-full outline-none text-gray-800 placeholder-gray-500"
                />
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-100 rounded-xl">
                <Users className="w-5 h-5 text-emerald-600" />
                <input
                  type="text"
                  placeholder="Số người"
                  className="bg-transparent w-full outline-none text-gray-800 placeholder-gray-500"
                />
              </div>
              <Link
                href="/destinations"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-600 transition-all"
              >
                <Search className="w-5 h-5" />
                <span>Tìm kiếm</span>
              </Link>
            </div>
          </div>

          {/* AI CTA */}
          <Link
            href="/itinerary"
            className="inline-flex items-center gap-2 mt-8 px-6 py-3 bg-white/20 backdrop-blur-sm text-white border border-white/30 rounded-full hover:bg-white/30 transition-all animate-fade-in"
          >
            <Sparkles className="w-5 h-5 text-yellow-400" />
            <span>Hoặc để AI gợi ý lịch trình cho bạn</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <stat.icon className="w-8 h-8 mx-auto mb-2 text-emerald-600" />
                <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-500">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Khám phá theo loại hình
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Chọn phong cách du lịch phù hợp với bạn
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.slug}
                href={`/destinations?category=${category.slug}`}
                className="group relative overflow-hidden rounded-2xl p-6 text-center bg-white shadow-md hover:shadow-xl transition-all transform hover:-translate-y-1"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity`} />
                <span className="text-4xl mb-3 block">{category.icon}</span>
                <h3 className="font-semibold text-gray-900 group-hover:text-emerald-600 transition-colors">
                  {category.name}
                </h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Điểm đến nổi bật
              </h2>
              <p className="text-gray-600">Những địa điểm được yêu thích nhất</p>
            </div>
            <Link
              href="/destinations"
              className="hidden md:flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-semibold"
            >
              Xem tất cả
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredDestinations.map((dest) => (
              <Link key={dest.id} href={`/destinations/${dest.slug}`}>
                <div className="group relative h-80 rounded-2xl overflow-hidden shadow-lg">
                  <Image
                    src={dest.image}
                    alt={dest.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Rating */}
                  <div className="absolute top-4 right-4 flex items-center gap-1 px-2 py-1 bg-white/90 backdrop-blur-sm rounded-full">
                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">{dest.rating}</span>
                  </div>

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-xl font-bold mb-1">{dest.name}</h3>
                    <div className="flex items-center gap-1 text-gray-300 text-sm mb-3">
                      <MapPin className="w-4 h-4" />
                      <span>{dest.province}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-emerald-400 font-semibold">
                        Từ {dest.price}
                      </p>
                      <span className="text-gray-400 text-sm">
                        {dest.reviews} đánh giá
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-8 text-center md:hidden">
            <Link
              href="/destinations"
              className="inline-flex items-center gap-2 text-emerald-600 font-semibold"
            >
              Xem tất cả điểm đến
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* AI CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-teal-600">
        <div className="max-w-4xl mx-auto px-4 text-center text-white">
          <Sparkles className="w-16 h-16 mx-auto mb-6 text-yellow-300" />
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            Để AI lên lịch trình cho bạn
          </h2>
          <p className="text-lg text-emerald-100 mb-8 max-w-2xl mx-auto">
            Chỉ cần cho chúng tôi biết ngân sách, thời gian và sở thích - AI sẽ gợi ý lịch trình hoàn hảo cho chuyến đi của bạn
          </p>
          <Link
            href="/itinerary"
            className="inline-flex items-center gap-2 bg-white text-emerald-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-50 transition-colors shadow-xl"
          >
            <Sparkles className="w-5 h-5" />
            <span>Bắt đầu ngay</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}
