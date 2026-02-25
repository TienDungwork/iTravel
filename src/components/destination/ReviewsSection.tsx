'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Star, User, Send, AlertCircle } from 'lucide-react';

interface Review {
    _id: string;
    userId: { _id: string; name: string; avatar?: string };
    rating: number;
    title: string;
    comment: string;
    createdAt: string;
}

interface ReviewsSectionProps {
    destinationId: string;
    destinationName: string;
}

export function ReviewsSection({ destinationId, destinationName }: ReviewsSectionProps) {
    const { data: session } = useSession();
    const [reviews, setReviews] = useState<Review[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [showForm, setShowForm] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // Form state
    const [rating, setRating] = useState(5);
    const [title, setTitle] = useState('');
    const [comment, setComment] = useState('');

    useEffect(() => {
        fetchReviews();
    }, [destinationId]);

    const fetchReviews = async () => {
        try {
            const res = await fetch(`/api/reviews?destinationId=${destinationId}`);
            const data = await res.json();
            if (data.success) {
                setReviews(data.data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        try {
            const res = await fetch('/api/reviews', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ destinationId, rating, title, comment }),
            });
            const data = await res.json();

            if (data.success) {
                setSuccess('Đánh giá thành công!');
                setTitle('');
                setComment('');
                setRating(5);
                setShowForm(false);
                fetchReviews();
            } else {
                setError(data.error);
            }
        } catch {
            setError('Có lỗi xảy ra');
        } finally {
            setSubmitting(false);
        }
    };

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    return (
        <div className="bg-white rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                    Đánh giá ({reviews.length})
                </h2>
                {session?.user ? (
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors"
                    >
                        Viết đánh giá
                    </button>
                ) : (
                    <Link
                        href="/auth/login"
                        className="px-4 py-2 border border-emerald-600 text-emerald-600 rounded-xl font-medium hover:bg-emerald-50 transition-colors"
                    >
                        Đăng nhập để đánh giá
                    </Link>
                )}
            </div>

            {/* Success/Error Messages */}
            {success && (
                <div className="mb-4 p-4 bg-emerald-50 text-emerald-700 rounded-xl">
                    {success}
                </div>
            )}
            {error && (
                <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-5 h-5" />
                    {error}
                </div>
            )}

            {/* Review Form */}
            {showForm && session?.user && (
                <form onSubmit={handleSubmit} className="mb-8 p-4 bg-gray-50 rounded-2xl">
                    <h3 className="font-semibold text-gray-900 mb-4">
                        Đánh giá {destinationName}
                    </h3>

                    {/* Rating */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Điểm đánh giá
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setRating(star)}
                                    className="p-1"
                                >
                                    <Star
                                        className={`w-8 h-8 ${star <= rating
                                                ? 'text-yellow-500 fill-yellow-500'
                                                : 'text-gray-300'
                                            }`}
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Title */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Tiêu đề
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="Tóm tắt trải nghiệm của bạn"
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                            required
                        />
                    </div>

                    {/* Comment */}
                    <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Nội dung đánh giá
                        </label>
                        <textarea
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Chia sẻ trải nghiệm chi tiết của bạn..."
                            rows={4}
                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none resize-none"
                            required
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="px-4 py-2 text-gray-600 hover:text-gray-900"
                        >
                            Hủy
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex items-center gap-2 px-6 py-2 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
                        >
                            {submitting ? (
                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            ) : (
                                <>
                                    <Send className="w-4 h-4" />
                                    <span>Gửi đánh giá</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            )}

            {/* Reviews List */}
            {loading ? (
                <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="animate-pulse">
                            <div className="flex gap-4">
                                <div className="w-12 h-12 bg-gray-200 rounded-full" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                                    <div className="h-3 bg-gray-200 rounded w-full" />
                                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : reviews.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    <Star className="w-12 h-12 mx-auto text-gray-300 mb-2" />
                    <p>Chưa có đánh giá nào. Hãy là người đầu tiên!</p>
                </div>
            ) : (
                <div className="space-y-6">
                    {reviews.map((review) => (
                        <div key={review._id} className="border-b border-gray-100 pb-6 last:border-0">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                                    {review.userId?.avatar ? (
                                        <img src={review.userId.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                                    ) : (
                                        <User className="w-6 h-6 text-emerald-600" />
                                    )}
                                </div>
                                <div className="flex-1">
                                    <div className="flex items-center gap-3 mb-1">
                                        <span className="font-semibold text-gray-900">{review.userId?.name || 'Người dùng ẩn danh'}</span>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`w-4 h-4 ${i < review.rating
                                                            ? 'text-yellow-500 fill-yellow-500'
                                                            : 'text-gray-300'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-500 mb-2">{formatDate(review.createdAt)}</p>
                                    <h4 className="font-medium text-gray-900 mb-1">{review.title}</h4>
                                    <p className="text-gray-600">{review.comment}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
