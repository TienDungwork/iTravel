'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
    MapPin, Calendar, Users, Wallet, Trash2, Plus, Star, ArrowRight,
    Plane, ChevronDown, ChevronUp, Clock, Settings, X, CalendarDays, Phone, Mail, CreditCard, Check
} from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

interface Destination {
    _id: string;
    name: string;
    slug: string;
    images: string[];
    rating: number;
    priceRange: { min: number; max: number };
    provinceId?: { name: string };
    categoryId?: { name: string; icon: string };
}

interface TripDestination {
    destinationId: Destination;
    order: number;
    notes?: string;
    plannedDate?: string;
}

interface Trip {
    _id: string;
    name: string;
    description?: string;
    startDate?: string;
    endDate?: string;
    destinations: TripDestination[];
    budget?: number;
    travelers?: number;
    status: 'planning' | 'ongoing' | 'completed';
    createdAt: string;
    updatedAt: string;
}

interface BookingForm {
    tripId: string;
    tripName: string;
    startDate: string;
    endDate: string;
    travelers: number;
    name: string;
    phone: string;
    email: string;
    notes: string;
    paymentMethod: string;
}

export default function TripsPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const { showToast } = useToast();
    const [trips, setTrips] = useState<Trip[]>([]);
    const [loading, setLoading] = useState(true);
    const [expandedTrip, setExpandedTrip] = useState<string | null>(null);
    const [editingTrip, setEditingTrip] = useState<Trip | null>(null);
    const [bookingTrip, setBookingTrip] = useState<Trip | null>(null);
    const [bookingForm, setBookingForm] = useState<BookingForm>({
        tripId: '',
        tripName: '',
        startDate: '',
        endDate: '',
        travelers: 1,
        name: '',
        phone: '',
        email: '',
        notes: '',
        paymentMethod: 'bank',
    });
    const [bookingStep, setBookingStep] = useState(1);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/auth/login');
        } else if (status === 'authenticated') {
            fetchTrips();
        }
    }, [status, router]);

    const fetchTrips = async () => {
        try {
            const res = await fetch('/api/trips');
            const data = await res.json();
            if (data.success) {
                setTrips(data.data);
                if (data.data.length > 0) {
                    setExpandedTrip(data.data[0]._id);
                }
            }
        } catch (error) {
            console.error('Error fetching trips:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('vi-VN').format(price);
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        });
    };

    const calculateTotalCost = (destinations: TripDestination[], travelers: number = 1) => {
        return destinations.reduce((total, d) => {
            const dest = d.destinationId;
            if (dest?.priceRange) {
                return total + (dest.priceRange.min + dest.priceRange.max) / 2;
            }
            return total;
        }, 0) * travelers;
    };

    const handleRemoveDestination = async (tripId: string, destinationId: string) => {
        try {
            const res = await fetch(`/api/trips/${tripId}?destinationId=${destinationId}`, {
                method: 'DELETE',
            });
            if (res.ok) {
                setTrips(trips.map(trip => {
                    if (trip._id === tripId) {
                        return {
                            ...trip,
                            destinations: trip.destinations.filter(
                                d => d.destinationId._id !== destinationId
                            ),
                        };
                    }
                    return trip;
                }));
                showToast('success', 'Đã xóa địa điểm khỏi lịch trình!');
            }
        } catch (error) {
            console.error('Error removing destination:', error);
            showToast('error', 'Có lỗi xảy ra!');
        }
    };

    const handleDeleteTrip = async (tripId: string) => {
        if (!confirm('Bạn có chắc chắn muốn xóa chuyến đi này?')) return;
        try {
            const res = await fetch(`/api/trips/${tripId}`, { method: 'DELETE' });
            if (res.ok) {
                setTrips(trips.filter(t => t._id !== tripId));
                showToast('success', 'Đã xóa chuyến đi!');
            }
        } catch (error) {
            console.error('Error deleting trip:', error);
            showToast('error', 'Có lỗi xảy ra!');
        }
    };

    const handleUpdateTrip = async (tripId: string, updates: Partial<Trip>) => {
        try {
            const res = await fetch(`/api/trips/${tripId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updates),
            });
            if (res.ok) {
                const data = await res.json();
                setTrips(trips.map(t => (t._id === tripId ? { ...t, ...data.data } : t)));
                setEditingTrip(null);
                showToast('success', 'Đã cập nhật chuyến đi!');
            }
        } catch (error) {
            console.error('Error updating trip:', error);
            showToast('error', 'Có lỗi xảy ra!');
        }
    };

    const handleCreateTrip = async () => {
        try {
            const res = await fetch('/api/trips', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name: 'Chuyến đi mới' }),
            });
            const data = await res.json();
            if (data.success) {
                setTrips([data.data, ...trips]);
                setExpandedTrip(data.data._id);
                showToast('success', 'Đã tạo chuyến đi mới!');
            }
        } catch (error) {
            console.error('Error creating trip:', error);
            showToast('error', 'Có lỗi xảy ra!');
        }
    };

    const openBookingModal = (trip: Trip) => {
        setBookingTrip(trip);
        setBookingForm({
            tripId: trip._id,
            tripName: trip.name,
            startDate: '',
            endDate: '',
            travelers: trip.travelers || 1,
            name: session?.user?.name || '',
            phone: '',
            email: session?.user?.email || '',
            notes: '',
            paymentMethod: 'bank',
        });
        setBookingStep(1);
    };

    const handleBookingSubmit = () => {
        // This would normally send to an API
        setBookingStep(3);
        showToast('success', 'Đặt lịch thành công!');

        // Update trip status
        handleUpdateTrip(bookingForm.tripId, {
            status: 'ongoing',
            startDate: bookingForm.startDate,
            endDate: bookingForm.endDate,
            travelers: bookingForm.travelers,
        });
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'planning':
                return 'bg-blue-100 text-blue-700';
            case 'ongoing':
                return 'bg-amber-100 text-amber-700';
            case 'completed':
                return 'bg-emerald-100 text-emerald-700';
            default:
                return 'bg-gray-100 text-gray-700';
        }
    };

    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'planning':
                return 'Đang lên kế hoạch';
            case 'ongoing':
                return 'Đang diễn ra';
            case 'completed':
                return 'Đã hoàn thành';
            default:
                return status;
        }
    };

    if (status === 'loading' || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-emerald-600 to-teal-600 py-12">
                <div className="max-w-6xl mx-auto px-4">
                    <div className="flex items-center gap-3 mb-4">
                        <Plane className="w-8 h-8 text-white" />
                        <h1 className="text-3xl font-bold text-white">Lịch trình của tôi</h1>
                    </div>
                    <p className="text-emerald-100">
                        Quản lý các chuyến đi và địa điểm bạn muốn khám phá
                    </p>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-8">
                {/* Create new trip button */}
                <div className="flex justify-between items-center mb-6">
                    <p className="text-gray-600">{trips.length} chuyến đi</p>
                    <button
                        onClick={handleCreateTrip}
                        className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                    >
                        <Plus className="w-5 h-5" />
                        Tạo chuyến đi mới
                    </button>
                </div>

                {trips.length === 0 ? (
                    <div className="bg-white rounded-3xl p-12 text-center shadow-lg">
                        <Plane className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                        <h2 className="text-xl font-semibold text-gray-800 mb-2">
                            Chưa có chuyến đi nào
                        </h2>
                        <p className="text-gray-500 mb-6">
                            Bắt đầu lập kế hoạch cho chuyến phiêu lưu tiếp theo của bạn!
                        </p>
                        <Link
                            href="/destinations"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors"
                        >
                            <MapPin className="w-5 h-5" />
                            Khám phá địa điểm
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {trips.map((trip) => (
                            <div
                                key={trip._id}
                                className="bg-white rounded-2xl shadow-lg overflow-hidden"
                            >
                                {/* Trip Header */}
                                <div
                                    className="p-6 cursor-pointer hover:bg-gray-50 transition-colors"
                                    onClick={() =>
                                        setExpandedTrip(expandedTrip === trip._id ? null : trip._id)
                                    }
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h2 className="text-xl font-bold text-gray-900">
                                                    {trip.name}
                                                </h2>
                                                <span
                                                    className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                                        trip.status
                                                    )}`}
                                                >
                                                    {getStatusLabel(trip.status)}
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="w-4 h-4" />
                                                    {trip.destinations.length} địa điểm
                                                </span>
                                                {trip.travelers && (
                                                    <span className="flex items-center gap-1">
                                                        <Users className="w-4 h-4" />
                                                        {trip.travelers} người
                                                    </span>
                                                )}
                                                <span className="flex items-center gap-1">
                                                    <Wallet className="w-4 h-4" />~
                                                    {formatPrice(calculateTotalCost(trip.destinations))}đ
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    Cập nhật {formatDate(trip.updatedAt)}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setEditingTrip(trip);
                                                }}
                                                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                                            >
                                                <Settings className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteTrip(trip._id);
                                                }}
                                                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                            >
                                                <Trash2 className="w-5 h-5" />
                                            </button>
                                            {expandedTrip === trip._id ? (
                                                <ChevronUp className="w-5 h-5 text-gray-400" />
                                            ) : (
                                                <ChevronDown className="w-5 h-5 text-gray-400" />
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Expanded Content */}
                                {expandedTrip === trip._id && (
                                    <div className="border-t border-gray-100 p-6 bg-gray-50">
                                        {trip.destinations.length === 0 ? (
                                            <div className="text-center py-8">
                                                <p className="text-gray-500 mb-4">
                                                    Chưa có địa điểm nào trong chuyến đi
                                                </p>
                                                <Link
                                                    href="/destinations"
                                                    className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700"
                                                >
                                                    <Plus className="w-4 h-4" />
                                                    Thêm địa điểm
                                                </Link>
                                            </div>
                                        ) : (
                                            <div className="space-y-4">
                                                {trip.destinations.map((item, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-4 bg-white p-4 rounded-xl"
                                                    >
                                                        <div className="flex items-center justify-center w-8 h-8 bg-emerald-100 rounded-full text-emerald-600 font-bold text-sm">
                                                            {index + 1}
                                                        </div>

                                                        <Link
                                                            href={`/destinations/${item.destinationId.slug}`}
                                                            className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0"
                                                        >
                                                            <Image
                                                                src={
                                                                    item.destinationId.images?.[0] ||
                                                                    'https://images.unsplash.com/photo-1528127269322-539801943592?w=400'
                                                                }
                                                                alt={item.destinationId.name}
                                                                fill
                                                                className="object-cover hover:scale-105 transition-transform"
                                                            />
                                                        </Link>

                                                        <div className="flex-1">
                                                            <Link
                                                                href={`/destinations/${item.destinationId.slug}`}
                                                                className="font-semibold text-gray-900 hover:text-emerald-600"
                                                            >
                                                                {item.destinationId.name}
                                                            </Link>
                                                            <div className="flex items-center gap-3 text-sm text-gray-500 mt-1">
                                                                {item.destinationId.provinceId && (
                                                                    <span className="flex items-center gap-1">
                                                                        <MapPin className="w-3 h-3" />
                                                                        {item.destinationId.provinceId.name}
                                                                    </span>
                                                                )}
                                                                <span className="flex items-center gap-1">
                                                                    <Star className="w-3 h-3 text-yellow-500" />
                                                                    {item.destinationId.rating}
                                                                </span>
                                                            </div>
                                                            {item.notes && (
                                                                <p className="text-sm text-gray-500 mt-1 italic">
                                                                    {item.notes}
                                                                </p>
                                                            )}
                                                        </div>

                                                        <div className="text-right">
                                                            <p className="font-semibold text-emerald-600">
                                                                ~
                                                                {formatPrice(
                                                                    (item.destinationId.priceRange?.min +
                                                                        item.destinationId.priceRange?.max) /
                                                                    2
                                                                )}
                                                                đ
                                                            </p>
                                                        </div>

                                                        <button
                                                            onClick={() =>
                                                                handleRemoveDestination(
                                                                    trip._id,
                                                                    item.destinationId._id
                                                                )
                                                            }
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                ))}

                                                <Link
                                                    href="/destinations"
                                                    className="flex items-center justify-center gap-2 p-4 bg-white rounded-xl border-2 border-dashed border-gray-200 text-gray-500 hover:border-emerald-300 hover:text-emerald-600 transition-colors"
                                                >
                                                    <Plus className="w-5 h-5" />
                                                    Thêm địa điểm khác
                                                </Link>
                                            </div>
                                        )}

                                        {/* Summary */}
                                        {trip.destinations.length > 0 && (
                                            <div className="mt-6 p-4 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-xl text-white">
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <p className="text-emerald-100">Tổng chi phí ước tính</p>
                                                        <p className="text-2xl font-bold">
                                                            {formatPrice(calculateTotalCost(trip.destinations))}đ
                                                        </p>
                                                    </div>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            openBookingModal(trip);
                                                        }}
                                                        className="flex items-center gap-2 px-5 py-3 bg-white text-emerald-600 rounded-xl font-semibold hover:bg-emerald-50 transition-colors"
                                                    >
                                                        <CalendarDays className="w-5 h-5" />
                                                        Đặt lịch ngay
                                                        <ArrowRight className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            {editingTrip && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">
                            Chỉnh sửa chuyến đi
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Tên chuyến đi
                                </label>
                                <input
                                    type="text"
                                    value={editingTrip.name}
                                    onChange={(e) =>
                                        setEditingTrip({ ...editingTrip, name: e.target.value })
                                    }
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Trạng thái
                                </label>
                                <select
                                    value={editingTrip.status}
                                    onChange={(e) =>
                                        setEditingTrip({
                                            ...editingTrip,
                                            status: e.target.value as Trip['status'],
                                        })
                                    }
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                >
                                    <option value="planning">Đang lên kế hoạch</option>
                                    <option value="ongoing">Đang diễn ra</option>
                                    <option value="completed">Đã hoàn thành</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Số người
                                </label>
                                <input
                                    type="number"
                                    value={editingTrip.travelers || 1}
                                    onChange={(e) =>
                                        setEditingTrip({
                                            ...editingTrip,
                                            travelers: Number(e.target.value),
                                        })
                                    }
                                    min={1}
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end gap-3 mt-6">
                            <button
                                onClick={() => setEditingTrip(null)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                            >
                                Hủy
                            </button>
                            <button
                                onClick={() =>
                                    handleUpdateTrip(editingTrip._id, {
                                        name: editingTrip.name,
                                        status: editingTrip.status,
                                        travelers: editingTrip.travelers,
                                    })
                                }
                                className="px-4 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700"
                            >
                                Lưu thay đổi
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Booking Modal */}
            {bookingTrip && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 overflow-y-auto">
                    <div className="bg-white rounded-3xl w-full max-w-2xl my-8 shadow-2xl">
                        {/* Modal Header */}
                        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 rounded-t-3xl">
                            <div className="flex items-center justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-white">Đặt lịch chuyến đi</h3>
                                    <p className="text-emerald-100 mt-1">{bookingTrip.name}</p>
                                </div>
                                <button
                                    onClick={() => setBookingTrip(null)}
                                    className="p-2 hover:bg-white/20 rounded-full transition-colors"
                                >
                                    <X className="w-6 h-6 text-white" />
                                </button>
                            </div>

                            {/* Steps */}
                            <div className="flex items-center gap-2 mt-6">
                                {[1, 2, 3].map((step) => (
                                    <div key={step} className="flex items-center flex-1">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${bookingStep >= step
                                                ? 'bg-white text-emerald-600'
                                                : 'bg-white/30 text-white'
                                            }`}>
                                            {bookingStep > step ? <Check className="w-4 h-4" /> : step}
                                        </div>
                                        {step < 3 && (
                                            <div className={`flex-1 h-1 mx-2 rounded ${bookingStep > step ? 'bg-white' : 'bg-white/30'
                                                }`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                            <div className="flex text-xs text-emerald-100 mt-2">
                                <span className="flex-1">Lịch trình</span>
                                <span className="flex-1 text-center">Thông tin</span>
                                <span className="flex-1 text-right">Xác nhận</span>
                            </div>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            {bookingStep === 1 && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Calendar className="w-4 h-4 inline mr-2" />
                                                Ngày bắt đầu
                                            </label>
                                            <input
                                                type="date"
                                                value={bookingForm.startDate}
                                                min={new Date().toISOString().split('T')[0]}
                                                onChange={(e) =>
                                                    setBookingForm({ ...bookingForm, startDate: e.target.value })
                                                }
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Calendar className="w-4 h-4 inline mr-2" />
                                                Ngày kết thúc
                                            </label>
                                            <input
                                                type="date"
                                                value={bookingForm.endDate}
                                                min={bookingForm.startDate || new Date().toISOString().split('T')[0]}
                                                onChange={(e) =>
                                                    setBookingForm({ ...bookingForm, endDate: e.target.value })
                                                }
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <Users className="w-4 h-4 inline mr-2" />
                                            Số người tham gia
                                        </label>
                                        <input
                                            type="number"
                                            value={bookingForm.travelers}
                                            onChange={(e) =>
                                                setBookingForm({ ...bookingForm, travelers: Number(e.target.value) })
                                            }
                                            min={1}
                                            max={50}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>

                                    {/* Trip Summary */}
                                    <div className="bg-gray-50 rounded-xl p-4">
                                        <h4 className="font-semibold text-gray-900 mb-3">Địa điểm trong chuyến đi</h4>
                                        <div className="space-y-2">
                                            {bookingTrip.destinations.map((item, index) => (
                                                <div key={index} className="flex items-center gap-3 text-sm">
                                                    <span className="w-6 h-6 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold">
                                                        {index + 1}
                                                    </span>
                                                    <span className="flex-1">{item.destinationId.name}</span>
                                                    <span className="text-gray-500">
                                                        ~{formatPrice((item.destinationId.priceRange?.min + item.destinationId.priceRange?.max) / 2)}đ
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between">
                                            <span className="font-medium text-gray-700">Tổng ước tính ({bookingForm.travelers} người)</span>
                                            <span className="font-bold text-emerald-600 text-lg">
                                                {formatPrice(calculateTotalCost(bookingTrip.destinations, bookingForm.travelers))}đ
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {bookingStep === 2 && (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            value={bookingForm.name}
                                            onChange={(e) =>
                                                setBookingForm({ ...bookingForm, name: e.target.value })
                                            }
                                            placeholder="Nhập họ và tên"
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Phone className="w-4 h-4 inline mr-2" />
                                                Số điện thoại
                                            </label>
                                            <input
                                                type="tel"
                                                value={bookingForm.phone}
                                                onChange={(e) =>
                                                    setBookingForm({ ...bookingForm, phone: e.target.value })
                                                }
                                                placeholder="0912 345 678"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                <Mail className="w-4 h-4 inline mr-2" />
                                                Email
                                            </label>
                                            <input
                                                type="email"
                                                value={bookingForm.email}
                                                onChange={(e) =>
                                                    setBookingForm({ ...bookingForm, email: e.target.value })
                                                }
                                                placeholder="email@example.com"
                                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            <CreditCard className="w-4 h-4 inline mr-2" />
                                            Phương thức thanh toán
                                        </label>
                                        <div className="grid grid-cols-3 gap-3">
                                            {[
                                                { value: 'bank', label: 'Chuyển khoản', icon: '🏦' },
                                                { value: 'cash', label: 'Tiền mặt', icon: '💵' },
                                                { value: 'card', label: 'Thẻ', icon: '💳' },
                                            ].map((method) => (
                                                <button
                                                    key={method.value}
                                                    onClick={() =>
                                                        setBookingForm({ ...bookingForm, paymentMethod: method.value })
                                                    }
                                                    className={`p-4 rounded-xl border-2 transition-all ${bookingForm.paymentMethod === method.value
                                                            ? 'border-emerald-500 bg-emerald-50'
                                                            : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="text-2xl mb-1">{method.icon}</div>
                                                    <div className="text-sm font-medium">{method.label}</div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Ghi chú (tùy chọn)
                                        </label>
                                        <textarea
                                            value={bookingForm.notes}
                                            onChange={(e) =>
                                                setBookingForm({ ...bookingForm, notes: e.target.value })
                                            }
                                            placeholder="Yêu cầu đặc biệt, dị ứng thực phẩm..."
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                        />
                                    </div>
                                </div>
                            )}

                            {bookingStep === 3 && (
                                <div className="text-center py-8">
                                    <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <Check className="w-10 h-10 text-emerald-600" />
                                    </div>
                                    <h4 className="text-2xl font-bold text-gray-900 mb-2">
                                        Đặt lịch thành công! 🎉
                                    </h4>
                                    <p className="text-gray-500 mb-6">
                                        Chúng tôi sẽ liên hệ với bạn qua email hoặc điện thoại để xác nhận chi tiết chuyến đi.
                                    </p>

                                    <div className="bg-gray-50 rounded-xl p-4 text-left mb-6">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-500">Chuyến đi</p>
                                                <p className="font-semibold">{bookingTrip.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Thời gian</p>
                                                <p className="font-semibold">
                                                    {bookingForm.startDate && formatDate(bookingForm.startDate)} - {bookingForm.endDate && formatDate(bookingForm.endDate)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Số người</p>
                                                <p className="font-semibold">{bookingForm.travelers} người</p>
                                            </div>
                                            <div>
                                                <p className="text-gray-500">Tổng chi phí</p>
                                                <p className="font-semibold text-emerald-600">
                                                    {formatPrice(calculateTotalCost(bookingTrip.destinations, bookingForm.travelers))}đ
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setBookingTrip(null)}
                                        className="px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700"
                                    >
                                        Hoàn tất
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        {bookingStep < 3 && (
                            <div className="border-t border-gray-100 p-6 flex justify-between">
                                {bookingStep > 1 ? (
                                    <button
                                        onClick={() => setBookingStep(bookingStep - 1)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                                    >
                                        Quay lại
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => setBookingTrip(null)}
                                        className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-xl"
                                    >
                                        Hủy
                                    </button>
                                )}

                                <button
                                    onClick={() => {
                                        if (bookingStep === 1) {
                                            if (!bookingForm.startDate || !bookingForm.endDate) {
                                                showToast('error', 'Vui lòng chọn ngày bắt đầu và kết thúc!');
                                                return;
                                            }
                                            setBookingStep(2);
                                        } else if (bookingStep === 2) {
                                            if (!bookingForm.name || !bookingForm.phone || !bookingForm.email) {
                                                showToast('error', 'Vui lòng điền đầy đủ thông tin!');
                                                return;
                                            }
                                            handleBookingSubmit();
                                        }
                                    }}
                                    className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700"
                                >
                                    {bookingStep === 1 ? 'Tiếp tục' : 'Xác nhận đặt lịch'}
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
