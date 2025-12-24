'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';

interface Toast {
    id: string;
    type: 'success' | 'error' | 'info';
    message: string;
    duration?: number;
}

interface ToastContextType {
    showToast: (type: Toast['type'], message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
    const context = useContext(ToastContext);
    if (!context) {
        throw new Error('useToast must be used within ToastProvider');
    }
    return context;
}

export function ToastProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([]);

    const showToast = (type: Toast['type'], message: string, duration = 3000) => {
        const id = Math.random().toString(36).slice(2);
        setToasts((prev) => [...prev, { id, type, message, duration }]);

        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, duration);
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    const getIcon = (type: Toast['type']) => {
        switch (type) {
            case 'success':
                return <CheckCircle className="w-5 h-5 text-white" />;
            case 'error':
                return <AlertCircle className="w-5 h-5 text-white" />;
            case 'info':
                return <Info className="w-5 h-5 text-white" />;
        }
    };

    const getColors = (type: Toast['type']) => {
        switch (type) {
            case 'success':
                return 'bg-gradient-to-r from-emerald-500 to-teal-500';
            case 'error':
                return 'bg-gradient-to-r from-red-500 to-rose-500';
            case 'info':
                return 'bg-gradient-to-r from-blue-500 to-indigo-500';
        }
    };

    return (
        <ToastContext.Provider value={{ showToast }}>
            {children}

            {/* Toast Container */}
            <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-3">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`flex items-center gap-3 px-5 py-4 rounded-2xl shadow-2xl text-white transform transition-all duration-300 animate-slide-up ${getColors(
                            toast.type
                        )}`}
                    >
                        {getIcon(toast.type)}
                        <span className="font-medium">{toast.message}</span>
                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-2 p-1 hover:bg-white/20 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>

            <style jsx global>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
        </ToastContext.Provider>
    );
}
