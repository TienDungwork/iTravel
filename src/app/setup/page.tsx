'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Database, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

export default function SetupPage() {
    const [loading, setLoading] = useState(false);
    const [done, setDone] = useState<{ ok: boolean; message: string } | null>(null);

    const handleSeed = async () => {
        setLoading(true);
        setDone(null);
        try {
            const res = await fetch('/api/seed', { method: 'POST' });
            const data = await res.json();
            if (data.success) {
                setDone({
                    ok: true,
                    message: `Đã tạo ${data.data?.destinations ?? 0} địa điểm, ${data.data?.users ?? 0} tài khoản mẫu. Có thể đăng nhập admin@itravel.vn / 123456.`,
                });
            } else {
                setDone({ ok: false, message: data.error || 'Có lỗi xảy ra' });
            }
        } catch {
            setDone({ ok: false, message: 'Không thể kết nối server. Kiểm tra MongoDB và thử lại.' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-lg p-8 text-center">
                <div className="inline-flex p-3 rounded-full bg-blue-100 text-blue-600 mb-6">
                    <Database className="w-10 h-10" />
                </div>
                <h1 className="text-xl font-semibold text-gray-800 mb-2">Khởi tạo dữ liệu lần đầu</h1>
                <p className="text-gray-500 text-sm mb-6">
                    Chạy khi deploy máy mới để tạo địa điểm, danh mục và tài khoản mẫu (admin@itravel.vn / 123456).
                </p>

                {done && (
                    <div
                        className={`mb-6 p-4 rounded-lg flex items-start gap-3 text-left ${
                            done.ok ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
                        }`}
                    >
                        {done.ok ? (
                            <CheckCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        ) : (
                            <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                        )}
                        <span className="text-sm">{done.message}</span>
                    </div>
                )}

                <button
                    onClick={handleSeed}
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                    {loading ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Đang tạo dữ liệu...
                        </>
                    ) : (
                        'Khởi tạo dữ liệu mẫu'
                    )}
                </button>

                <p className="mt-6 text-xs text-gray-400">
                    Chỉ cần chạy một lần. Sau đó có thể xóa hoặc ẩn đường dẫn /setup.
                </p>

                <Link
                    href="/auth/login"
                    className="mt-4 inline-block text-sm text-blue-600 hover:underline"
                >
                    ← Về trang đăng nhập
                </Link>
            </div>
        </div>
    );
}
