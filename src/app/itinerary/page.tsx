  'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
    Sparkles, Wallet, Calendar, Users, Heart, Mountain, Building, Waves,
    Info, MapPin, Clock, ArrowRight, Check, Compass, UtensilsCrossed,
    TreePine, Flower2
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface ItineraryItem {
    day: number;
    destination: {
        _id: string;
        name: string;
        slug: string;
        images: string[];
        shortDescription: string;
        priceRange: { min: number; max: number };
        provinceId?: { name: string };
    };
    duration: string;
    notes: string;
    estimatedCost?: number;
}

interface ItineraryResult {
    _id: string;
    title: string;
    items: ItineraryItem[];
    totalEstimatedCost: number;
    tips: string[];
}

const preferenceOptions = [
    { id: 'beach', label: 'Biển đảo', icon: Waves, emoji: '🏖️', gradient: 'from-sky-400 to-blue-500', bg: 'bg-sky-50', text: 'text-sky-600' },
    { id: 'mountain', label: 'Núi rừng', icon: Mountain, emoji: '🏔️', gradient: 'from-green-400 to-emerald-600', bg: 'bg-green-50', text: 'text-green-600' },
    { id: 'culture', label: 'Văn hóa', icon: Building, emoji: '🏛️', gradient: 'from-amber-400 to-orange-500', bg: 'bg-amber-50', text: 'text-amber-600' },
    { id: 'nature', label: 'Sinh thái', icon: TreePine, emoji: '🌿', gradient: 'from-teal-400 to-green-500', bg: 'bg-teal-50', text: 'text-teal-600' },
    { id: 'adventure', label: 'Mạo hiểm', icon: Compass, emoji: '🧗', gradient: 'from-red-400 to-rose-500', bg: 'bg-red-50', text: 'text-red-600' },
    { id: 'food', label: 'Ẩm thực', icon: UtensilsCrossed, emoji: '🍜', gradient: 'from-pink-400 to-fuchsia-500', bg: 'bg-pink-50', text: 'text-pink-600' },
    { id: 'relax', label: 'Nghỉ dưỡng', icon: Flower2, emoji: '🧘', gradient: 'from-violet-400 to-purple-500', bg: 'bg-violet-50', text: 'text-violet-600' },
    { id: 'romantic', label: 'Lãng mạn', icon: Heart, emoji: '💕', gradient: 'from-rose-400 to-pink-500', bg: 'bg-rose-50', text: 'text-rose-600' },
];

export default function ItineraryPage() {
    const { data: session } = useSession();
    const router = useRouter();
    const { showToast } = useToast();
    const [step, setStep] = useState(1);
    const [budget, setBudget] = useState(3000000);
    const [days, setDays] = useState(3);
    const [travelers, setTravelers] = useState(2);
    const [preferences, setPreferences] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ItineraryResult | null>(null);
    const [error, setError] = useState('');
    const [isSaved, setIsSaved] = useState(false);

    const togglePreference = (id: string) => {
        setPreferences(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(Math.round(price));
    };

    // Calculate cost for a single item
    const getItemCost = (item: ItineraryItem): number => {
        if (item.estimatedCost) return item.estimatedCost;
        return (item.destination.priceRange.min + item.destination.priceRange.max) / 2;
    };

    // Calculate real total from items
    const calculateTotal = (): number => {
        if (!result) return 0;
        return result.items.reduce((sum, item) => sum + getItemCost(item), 0);
    };

    const handleGenerate = async () => {
        setLoading(true);
        setError('');
        try {
            const res = await fetch('/api/itinerary/generate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ budget, days, travelers, preferences }),
            });
            const data = await res.json();

            if (data.success) {
                setResult(data.data);
                setStep(5);
            } else {
                setError(data.error || 'Có lỗi xảy ra');
            }
        } catch (err) {
            setError('Không thể kết nối đến server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-12">
                <div className="max-w-4xl mx-auto px-4 text-center text-white">
                    <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-4">
                        <Sparkles className="w-5 h-5 text-yellow-300" />
                        <span>AI Recommendation</span>
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">
                        Lập lịch trình thông minh
                    </h1>
                    <p className="text-emerald-100 max-w-2xl mx-auto">
                        Cho chúng tôi biết sở thích của bạn, AI sẽ gợi ý lịch trình hoàn hảo
                    </p>
                </div>
            </div>

            {/* Progress Steps */}
            {step < 5 && (
                <div className="max-w-4xl mx-auto px-4 py-8">
                    <div className="flex items-center justify-center gap-2 md:gap-4">
                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="flex items-center">
                                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold ${s === step ? 'bg-emerald-600 text-white' :
                                    s < step ? 'bg-emerald-100 text-emerald-600' :
                                        'bg-gray-200 text-gray-400'
                                    }`}>
                                    {s < step ? <Check className="w-5 h-5" /> : s}
                                </div>
                                {s < 4 && (
                                    <div className={`hidden md:block w-16 h-1 mx-2 rounded ${s < step ? 'bg-emerald-600' : 'bg-gray-200'}`} />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Form Steps */}
            <div className="max-w-4xl mx-auto px-4 pb-16">
                {/* Step 1: Budget */}
                {step === 1 && (
                    <div className="bg-white rounded-3xl p-8 shadow-xl animate-fade-in">
                        <div className="text-center mb-8">
                            <Wallet className="w-16 h-16 mx-auto text-emerald-600 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ngân sách mỗi người?</h2>
                            <p className="text-gray-600">Chi phí dự kiến cho 1 người (bao gồm vé, ăn ở, tham quan)</p>
                        </div>

                        <div className="max-w-md mx-auto">
                            <div className="text-center mb-6">
                                <span className="text-4xl font-bold text-emerald-600">{formatPrice(budget)}đ</span>
                                <span className="text-gray-500 text-lg ml-1">/người</span>
                            </div>
                            <input
                                type="range"
                                min={1000000}
                                max={20000000}
                                step={500000}
                                value={budget}
                                onChange={(e) => setBudget(Number(e.target.value))}
                                className="w-full h-3 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-emerald-600"
                            />
                            <div className="flex justify-between text-sm text-gray-500 mt-2">
                                <span>1 triệu</span>
                                <span>20 triệu</span>
                            </div>

                            {/* Total preview */}
                            <div className="mt-6 p-4 bg-emerald-50 rounded-xl text-center">
                                <p className="text-sm text-emerald-700">
                                    Tổng cho <strong>{travelers} người</strong>:
                                    <span className="font-bold text-emerald-600 ml-1">{formatPrice(budget * travelers)}đ</span>
                                </p>
                            </div>
                        </div>

                        <div className="mt-8 flex justify-center">
                            <button
                                onClick={() => setStep(2)}
                                className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
                            >
                                Tiếp theo
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 2: Days */}
                {step === 2 && (
                    <div className="bg-white rounded-3xl p-8 shadow-xl animate-fade-in">
                        <div className="text-center mb-8">
                            <Calendar className="w-16 h-16 mx-auto text-emerald-600 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bạn đi mấy ngày?</h2>
                            <p className="text-gray-600">Số ngày dự kiến cho chuyến du lịch</p>
                        </div>

                        <div className="flex justify-center gap-4 mb-8">
                            {[1, 2, 3, 4, 5, 7].map((d) => (
                                <button
                                    key={d}
                                    onClick={() => setDays(d)}
                                    className={`w-16 h-16 rounded-2xl font-bold text-lg transition-all ${days === d
                                        ? 'bg-emerald-600 text-white shadow-lg scale-110'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {d}
                                </button>
                            ))}
                        </div>
                        <p className="text-center text-gray-500 mb-8">{days} ngày {days - 1} đêm</p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="px-8 py-3 text-gray-600 hover:text-gray-900"
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={() => setStep(3)}
                                className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
                            >
                                Tiếp theo
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 3: Travelers */}
                {step === 3 && (
                    <div className="bg-white rounded-3xl p-8 shadow-xl animate-fade-in">
                        <div className="text-center mb-8">
                            <Users className="w-16 h-16 mx-auto text-emerald-600 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Đi cùng bao nhiêu người?</h2>
                            <p className="text-gray-600">Số lượng người tham gia chuyến đi</p>
                        </div>

                        <div className="flex justify-center items-center gap-6 mb-8">
                            <button
                                onClick={() => setTravelers(Math.max(1, travelers - 1))}
                                className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold text-xl"
                            >
                                -
                            </button>
                            <span className="text-5xl font-bold text-emerald-600 w-20 text-center">{travelers}</span>
                            <button
                                onClick={() => setTravelers(Math.min(20, travelers + 1))}
                                className="w-12 h-12 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 font-bold text-xl"
                            >
                                +
                            </button>
                        </div>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setStep(2)}
                                className="px-8 py-3 text-gray-600 hover:text-gray-900"
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={() => setStep(4)}
                                className="flex items-center gap-2 bg-emerald-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-emerald-700 transition-colors"
                            >
                                Tiếp theo
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 4: Preferences */}
                {step === 4 && (
                    <div className="bg-white rounded-3xl p-8 shadow-xl animate-fade-in">
                        <div className="text-center mb-8">
                            <div className="relative inline-block">
                                <div className="w-20 h-20 mx-auto bg-gradient-to-br from-emerald-400 to-teal-500 rounded-full flex items-center justify-center mb-4 shadow-lg">
                                    <Sparkles className="w-10 h-10 text-white" />
                                </div>
                                <div className="absolute -right-1 -bottom-1 w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-lg animate-bounce">
                                    ✨
                                </div>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bạn thích gì?</h2>
                            <p className="text-gray-600">Chọn một hoặc nhiều sở thích để AI gợi ý địa điểm phù hợp</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {preferenceOptions.map((pref, index) => {
                                const isSelected = preferences.includes(pref.id);
                                return (
                                    <button
                                        key={pref.id}
                                        onClick={() => togglePreference(pref.id)}
                                        className={`group relative p-5 rounded-2xl border-2 transition-all duration-300 transform hover:scale-105 ${isSelected
                                            ? 'border-transparent shadow-lg scale-105'
                                            : 'border-gray-200 hover:border-gray-300 bg-white hover:shadow-md'
                                            }`}
                                        style={{
                                            animationDelay: `${index * 0.05}s`
                                        }}
                                    >
                                        {/* Gradient Background when selected */}
                                        {isSelected && (
                                            <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${pref.gradient} opacity-10`} />
                                        )}

                                        {/* Checkmark when selected */}
                                        {isSelected && (
                                            <div className={`absolute -top-2 -right-2 w-6 h-6 rounded-full bg-gradient-to-br ${pref.gradient} flex items-center justify-center shadow-md animate-scale-in`}>
                                                <Check className="w-4 h-4 text-white" />
                                            </div>
                                        )}

                                        {/* Content */}
                                        <div className="relative z-10 flex flex-col items-center">
                                            {/* Icon */}
                                            <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-3 transition-all duration-300 ${isSelected
                                                ? `bg-gradient-to-br ${pref.gradient} shadow-lg`
                                                : `${pref.bg} group-hover:shadow-md`
                                                }`}>
                                                <pref.icon className={`w-7 h-7 transition-colors ${isSelected ? 'text-white' : pref.text}`} />
                                            </div>

                                            {/* Label */}
                                            <span className={`font-semibold text-sm transition-colors ${isSelected ? 'text-gray-900' : 'text-gray-600 group-hover:text-gray-900'
                                                }`}>
                                                {pref.label}
                                            </span>
                                        </div>

                                        {/* Hover glow effect */}
                                        <div className={`absolute inset-0 rounded-2xl transition-opacity duration-300 ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-50'
                                            }`} style={{
                                                boxShadow: isSelected ? `0 8px 32px -4px var(--tw-shadow-color, rgba(16, 185, 129, 0.3))` : 'none'
                                            }} />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Selected count */}
                        {preferences.length > 0 && (
                            <div className="text-center mb-6 animate-fade-in">
                                <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                                    <Check className="w-4 h-4" />
                                    Đã chọn {preferences.length} sở thích
                                </span>
                            </div>
                        )}

                        {error && (
                            <div className="text-center text-red-500 mb-4">{error}</div>
                        )}

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setStep(3)}
                                className="px-8 py-3 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full transition-all"
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-8 py-3 rounded-full font-semibold hover:from-emerald-700 hover:to-teal-600 transition-all disabled:opacity-50 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                        <span>Đang tạo...</span>
                                    </>
                                ) : (
                                    <>
                                        <Sparkles className="w-5 h-5" />
                                        <span>Tạo lịch trình AI</span>
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {/* Step 5: Result */}
                {step === 5 && result && (
                    <div className="animate-fade-in">
                        {/* Header Card */}
                        <div className="relative bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 rounded-3xl p-8 text-white mb-8 overflow-hidden animate-gradient" style={{ backgroundSize: '200% 200%' }}>
                            {/* Decorative elements */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                            <div className="absolute bottom-0 left-0 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />

                            {/* Success Badge */}
                            <div className="relative flex items-center gap-2 mb-4">
                                <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full animate-pulse-glow">
                                    <Sparkles className="w-5 h-5 text-yellow-300" />
                                    <span className="text-sm font-medium">AI đã tạo xong lịch trình</span>
                                </div>
                            </div>

                            <h2 className="relative text-2xl md:text-3xl font-bold mb-3">{result.title}</h2>
                            <p className="relative text-emerald-100 mb-8 max-w-xl">
                                Lịch trình hoàn hảo được tạo bởi AI dựa trên sở thích và ngân sách của bạn
                            </p>

                            <div className="relative grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-colors">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Wallet className="w-4 h-4 text-emerald-200" />
                                        <p className="text-xs text-emerald-200">Ngân sách</p>
                                    </div>
                                    <p className="font-bold text-lg">{formatPrice(budget)}đ</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-colors">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Calendar className="w-4 h-4 text-emerald-200" />
                                        <p className="text-xs text-emerald-200">Thời gian</p>
                                    </div>
                                    <p className="font-bold text-lg">{days}N{days - 1}Đ</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-colors">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Users className="w-4 h-4 text-emerald-200" />
                                        <p className="text-xs text-emerald-200">Số người</p>
                                    </div>
                                    <p className="font-bold text-lg">{travelers} người</p>
                                </div>
                                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/10 hover:bg-white/20 transition-colors">
                                    <div className="flex items-center gap-2 mb-1">
                                        <MapPin className="w-4 h-4 text-emerald-200" />
                                        <p className="text-xs text-emerald-200">Địa điểm</p>
                                    </div>
                                    <p className="font-bold text-lg">{result.items.length} nơi</p>
                                </div>
                            </div>
                        </div>

                        {/* Timeline */}
                        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
                            <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                                <Calendar className="w-6 h-6 text-emerald-600" />
                                Lịch trình chi tiết
                            </h3>

                            <div className="space-y-8">
                                {result.items.map((item, index) => (
                                    <div key={index} className="relative">
                                        {/* Day Header */}
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-white flex flex-col items-center justify-center shadow-lg">
                                                <span className="text-xs font-medium">NGÀY</span>
                                                <span className="text-xl font-bold">{item.day}</span>
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-lg text-gray-900">{item.destination.name}</h4>
                                                {item.destination.provinceId && (
                                                    <p className="text-gray-500 flex items-center gap-1">
                                                        <MapPin className="w-4 h-4" />
                                                        {item.destination.provinceId.name}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Destination Card */}
                                        <div className="ml-[4.5rem] bg-gray-50 rounded-2xl overflow-hidden border border-gray-100">
                                            <div className="flex flex-col md:flex-row">
                                                {/* Image */}
                                                <Link href={`/destinations/${item.destination.slug}`} className="relative w-full md:w-64 h-48 flex-shrink-0">
                                                    <Image
                                                        src={item.destination.images[0] || 'https://images.unsplash.com/photo-1528127269322-539801943592?w=800'}
                                                        alt={item.destination.name}
                                                        fill
                                                        className="object-cover hover:scale-105 transition-transform"
                                                    />
                                                </Link>

                                                {/* Content */}
                                                <div className="p-6 flex-1">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div>
                                                            <Link href={`/destinations/${item.destination.slug}`} className="font-bold text-xl text-gray-900 hover:text-emerald-600 transition-colors">
                                                                {item.destination.name}
                                                            </Link>
                                                            <p className="text-gray-500 mt-1">{item.destination.shortDescription}</p>
                                                        </div>
                                                        <div className="text-right flex-shrink-0">
                                                            <p className="text-xs text-gray-400">Chi phí ước tính</p>
                                                            <p className="font-bold text-emerald-600 text-lg">
                                                                {formatPrice(getItemCost(item))}đ
                                                            </p>
                                                            <p className="text-xs text-gray-400">/người</p>
                                                        </div>
                                                    </div>

                                                    {/* Timeline of day */}
                                                    <div className="bg-white rounded-xl p-4 mb-4">
                                                        <div className="flex items-center gap-2 text-gray-600 mb-2">
                                                            <Clock className="w-4 h-4" />
                                                            <span className="font-medium">Lịch trình trong ngày</span>
                                                        </div>
                                                        <div className="text-sm text-gray-600 space-y-1">
                                                            <p>🌅 <span className="font-medium">Sáng:</span> Di chuyển và check-in, tham quan khu vực xung quanh</p>
                                                            <p>🌞 <span className="font-medium">Trưa:</span> Thưởng thức ẩm thực địa phương</p>
                                                            <p>🌄 <span className="font-medium">Chiều:</span> Khám phá các điểm tham quan chính</p>
                                                            <p>🌙 <span className="font-medium">Tối:</span> Dạo chơi, mua sắm và nghỉ ngơi</p>
                                                        </div>
                                                    </div>

                                                    {/* Notes */}
                                                    {item.notes && (
                                                        <div className="flex items-start gap-2 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                                                            <Info className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                                                            <div>
                                                                <p className="font-medium text-amber-800">Gợi ý từ AI:</p>
                                                                <p className="text-amber-700 text-sm">{item.notes}</p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Quick Info */}
                                                    <div className="flex items-center gap-4 mt-4 text-sm text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {item.duration}
                                                        </span>
                                                        <Link href={`/destinations/${item.destination.slug}`} className="text-emerald-600 hover:underline font-medium">
                                                            Xem chi tiết →
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Connector Line */}
                                        {index < result.items.length - 1 && (
                                            <div className="absolute left-7 top-20 bottom-0 w-0.5 bg-gradient-to-b from-emerald-300 to-emerald-100" />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Summary Card */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                            {/* Cost Summary */}
                            <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100">
                                <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2 text-lg">
                                    <Wallet className="w-6 h-6 text-emerald-600" />
                                    Chi tiết chi phí
                                </h3>
                                <div className="space-y-2">
                                    {result.items.map((item, index) => {
                                        const itemCost = getItemCost(item);
                                        return (
                                            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
                                                <div className="flex items-center gap-3">
                                                    <span className="w-7 h-7 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 text-white flex items-center justify-center text-xs font-bold">
                                                        {item.day}
                                                    </span>
                                                    <span className="text-gray-700 text-sm">{item.destination.name}</span>
                                                </div>
                                                <span className="font-semibold text-gray-900 text-sm">{formatPrice(itemCost)}đ</span>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Total Section */}
                                <div className="mt-4 pt-4 border-t-2 border-gray-200 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-600">Tổng/người ({days} ngày)</span>
                                        <span className="font-bold text-gray-900 text-xl">{formatPrice(calculateTotal())}đ</span>
                                    </div>
                                    <div className="flex justify-between items-center bg-emerald-50 -mx-6 px-6 py-3">
                                        <span className="font-bold text-emerald-800">Tổng cho {travelers} người</span>
                                        <span className="font-bold text-emerald-600 text-2xl">{formatPrice(calculateTotal() * travelers)}đ</span>
                                    </div>
                                </div>

                                {/* Budget Progress */}
                                <div className="mt-4">
                                    <div className="flex justify-between text-sm mb-1">
                                        <span className="text-gray-500">Ngân sách: {formatPrice(budget)}đ</span>
                                        <span className={`font-medium ${calculateTotal() * travelers > budget ? 'text-amber-600' : 'text-emerald-600'}`}>
                                            {Math.round((calculateTotal() * travelers / budget) * 100)}%
                                        </span>
                                    </div>
                                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                        <div
                                            className={`h-full rounded-full transition-all duration-500 ${calculateTotal() * travelers > budget
                                                ? 'bg-gradient-to-r from-amber-400 to-red-500'
                                                : 'bg-gradient-to-r from-emerald-400 to-teal-500'
                                                }`}
                                            style={{ width: `${Math.min((calculateTotal() * travelers / budget) * 100, 100)}%` }}
                                        />
                                    </div>
                                </div>

                                {calculateTotal() * travelers > budget && (
                                    <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl text-amber-700 text-sm">
                                        ⚠️ Vượt ngân sách {formatPrice(calculateTotal() * travelers - budget)}đ
                                    </div>
                                )}
                                <p className="text-xs text-gray-400 mt-3">* Đã bao gồm chi phí ăn uống, di chuyển và vé tham quan cơ bản</p>
                            </div>

                            {/* Tips */}
                            <div className="bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-3xl p-6 border border-emerald-200">
                                <h3 className="font-bold text-emerald-800 mb-4 flex items-center gap-2 text-lg">
                                    <Sparkles className="w-6 h-6 text-emerald-500" />
                                    Mẹo du lịch từ AI
                                </h3>
                                <ul className="space-y-3">
                                    {result.tips.map((tip, index) => (
                                        <li key={index} className="flex items-start gap-3 text-emerald-700">
                                            <span className="w-6 h-6 rounded-full bg-emerald-200 text-emerald-700 flex items-center justify-center text-sm font-bold flex-shrink-0">
                                                {index + 1}
                                            </span>
                                            <span className="pt-0.5">{tip}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={() => {
                                    setStep(1);
                                    setResult(null);
                                }}
                                className="px-8 py-4 border-2 border-emerald-600 text-emerald-600 rounded-full font-semibold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2"
                            >
                                <ArrowRight className="w-5 h-5 rotate-180" />
                                Tạo lịch trình mới
                            </button>
                            <button
                                onClick={async () => {
                                    if (!session) {
                                        showToast('info', 'Vui lòng đăng nhập để lưu lịch trình!');
                                        router.push('/auth/login');
                                        return;
                                    }
                                    try {
                                        const res = await fetch('/api/user/itineraries', {
                                            method: 'POST',
                                            headers: { 'Content-Type': 'application/json' },
                                            body: JSON.stringify({ itineraryId: result._id }),
                                        });
                                        if (res.ok) {
                                            setIsSaved(true);
                                            showToast('success', 'Đã lưu lịch trình vào tài khoản!');
                                        } else {
                                            showToast('error', 'Không thể lưu lịch trình!');
                                        }
                                    } catch {
                                        showToast('error', 'Có lỗi xảy ra, vui lòng thử lại!');
                                    }
                                }}
                                disabled={isSaved}
                                className={`px-8 py-4 rounded-full font-semibold transition-all flex items-center justify-center gap-2 shadow-lg ${isSaved
                                    ? 'bg-emerald-50 text-emerald-600 border-2 border-emerald-200'
                                    : 'bg-gradient-to-r from-emerald-600 to-teal-500 text-white hover:from-emerald-700 hover:to-teal-600'
                                    }`}
                            >
                                {isSaved ? (
                                    <>
                                        <Check className="w-5 h-5" />
                                        Đã lưu lịch trình
                                    </>
                                ) : (
                                    <>
                                        <Heart className="w-5 h-5" />
                                        Lưu lịch trình
                                    </>
                                )}
                            </button>
                            <Link
                                href="/destinations"
                                className="px-8 py-4 bg-gray-900 text-white rounded-full font-semibold hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                            >
                                Khám phá thêm
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
