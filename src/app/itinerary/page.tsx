'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Sparkles, Wallet, Calendar, Users, Heart, Mountain, Building, Waves, Info, MapPin, Clock, ArrowRight, Check } from 'lucide-react';

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
}

interface ItineraryResult {
    _id: string;
    title: string;
    items: ItineraryItem[];
    totalEstimatedCost: number;
    tips: string[];
}

const preferenceOptions = [
    { id: 'beach', label: 'Biển đảo', icon: Waves, color: 'bg-blue-100 text-blue-600 border-blue-200' },
    { id: 'mountain', label: 'Núi rừng', icon: Mountain, color: 'bg-green-100 text-green-600 border-green-200' },
    { id: 'culture', label: 'Văn hóa', icon: Building, color: 'bg-amber-100 text-amber-600 border-amber-200' },
    { id: 'nature', label: 'Sinh thái', icon: Heart, color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
];

export default function ItineraryPage() {
    const [step, setStep] = useState(1);
    const [budget, setBudget] = useState(3000000);
    const [days, setDays] = useState(3);
    const [travelers, setTravelers] = useState(2);
    const [preferences, setPreferences] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<ItineraryResult | null>(null);
    const [error, setError] = useState('');

    const togglePreference = (id: string) => {
        setPreferences(prev =>
            prev.includes(id) ? prev.filter(p => p !== id) : [...prev, id]
        );
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price);
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
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Ngân sách của bạn?</h2>
                            <p className="text-gray-600">Tổng ngân sách cho chuyến đi (bao gồm vé, ăn ở)</p>
                        </div>

                        <div className="max-w-md mx-auto">
                            <div className="text-center mb-6">
                                <span className="text-4xl font-bold text-emerald-600">{formatPrice(budget)}đ</span>
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
                            <Heart className="w-16 h-16 mx-auto text-emerald-600 mb-4" />
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Bạn thích gì?</h2>
                            <p className="text-gray-600">Chọn một hoặc nhiều sở thích (có thể bỏ qua)</p>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                            {preferenceOptions.map((pref) => (
                                <button
                                    key={pref.id}
                                    onClick={() => togglePreference(pref.id)}
                                    className={`p-4 rounded-2xl border-2 transition-all ${preferences.includes(pref.id)
                                            ? `${pref.color} border-current`
                                            : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                                        }`}
                                >
                                    <pref.icon className="w-8 h-8 mx-auto mb-2" />
                                    <span className="font-medium">{pref.label}</span>
                                </button>
                            ))}
                        </div>

                        {error && (
                            <div className="text-center text-red-500 mb-4">{error}</div>
                        )}

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setStep(3)}
                                className="px-8 py-3 text-gray-600 hover:text-gray-900"
                            >
                                Quay lại
                            </button>
                            <button
                                onClick={handleGenerate}
                                disabled={loading}
                                className="flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-500 text-white px-8 py-3 rounded-full font-semibold hover:from-emerald-700 hover:to-teal-600 transition-all disabled:opacity-50"
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
                        <div className="bg-white rounded-3xl p-8 shadow-xl mb-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Sparkles className="w-8 h-8 text-yellow-500" />
                                <h2 className="text-2xl font-bold text-gray-900">{result.title}</h2>
                            </div>

                            <div className="grid grid-cols-3 gap-4 p-4 bg-emerald-50 rounded-2xl mb-8">
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Ngân sách</p>
                                    <p className="font-bold text-emerald-600">{formatPrice(budget)}đ</p>
                                </div>
                                <div className="text-center border-x border-emerald-200">
                                    <p className="text-sm text-gray-500">Thời gian</p>
                                    <p className="font-bold text-emerald-600">{days} ngày</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-sm text-gray-500">Số người</p>
                                    <p className="font-bold text-emerald-600">{travelers} người</p>
                                </div>
                            </div>

                            {/* Timeline */}
                            <div className="space-y-6">
                                {result.items.map((item, index) => (
                                    <div key={index} className="flex gap-4">
                                        <div className="flex-shrink-0">
                                            <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold">
                                                {item.day}
                                            </div>
                                            {index < result.items.length - 1 && (
                                                <div className="w-0.5 h-16 bg-emerald-200 mx-auto mt-2" />
                                            )}
                                        </div>
                                        <div className="flex-1 bg-gray-50 rounded-2xl p-4">
                                            <Link
                                                href={`/destinations/${item.destination.slug}`}
                                                className="flex gap-4 hover:bg-white rounded-xl transition-colors p-2 -m-2"
                                            >
                                                <div className="relative w-24 h-24 rounded-xl overflow-hidden flex-shrink-0">
                                                    <Image
                                                        src={item.destination.images[0] || '/images/placeholder.jpg'}
                                                        alt={item.destination.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h3 className="font-bold text-gray-900 hover:text-emerald-600 transition-colors">
                                                        {item.destination.name}
                                                    </h3>
                                                    {item.destination.provinceId && (
                                                        <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                                            <MapPin className="w-4 h-4" />
                                                            <span>{item.destination.provinceId.name}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-1 text-gray-500 text-sm mt-1">
                                                        <Clock className="w-4 h-4" />
                                                        <span>{item.duration}</span>
                                                    </div>
                                                    <p className="text-emerald-600 font-semibold mt-2">
                                                        ~{formatPrice((item.destination.priceRange.min + item.destination.priceRange.max) / 2)}đ
                                                    </p>
                                                </div>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Total */}
                            <div className="mt-8 p-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl text-white">
                                <div className="flex items-center justify-between">
                                    <span className="text-emerald-100">Tổng chi phí ước tính:</span>
                                    <span className="text-2xl font-bold">{formatPrice(result.totalEstimatedCost)}đ</span>
                                </div>
                            </div>
                        </div>

                        {/* Tips */}
                        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
                            <div className="flex items-start gap-3">
                                <Info className="w-6 h-6 text-amber-600 flex-shrink-0 mt-1" />
                                <div>
                                    <h3 className="font-semibold text-amber-800 mb-2">Mẹo du lịch</h3>
                                    <ul className="space-y-1 text-amber-700 text-sm">
                                        {result.tips.map((tip, index) => (
                                            <li key={index}>• {tip}</li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-center gap-4 mt-8">
                            <button
                                onClick={() => {
                                    setStep(1);
                                    setResult(null);
                                }}
                                className="px-6 py-3 border border-emerald-600 text-emerald-600 rounded-full font-semibold hover:bg-emerald-50 transition-colors"
                            >
                                Tạo lịch trình mới
                            </button>
                            <Link
                                href="/destinations"
                                className="px-6 py-3 bg-emerald-600 text-white rounded-full font-semibold hover:bg-emerald-700 transition-colors"
                            >
                                Khám phá thêm
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
