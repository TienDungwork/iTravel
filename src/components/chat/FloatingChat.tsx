'use client';

import { useState } from 'react';
import { MessageCircle, Bot, X, Send, ExternalLink, Sparkles, Loader2 } from 'lucide-react';
import Link from 'next/link';

interface Message {
    role: 'user' | 'assistant';
    content: string;
}

export function FloatingChat() {
    const [isOpen, setIsOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<Message[]>([
        { role: 'assistant', content: 'Xin chào! Tôi là AI du lịch của iTravel. Tôi có thể giúp bạn tìm điểm đến, gợi ý lịch trình, hoặc trả lời các câu hỏi về du lịch Việt Nam. Bạn muốn hỏi gì?' }
    ]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);

    const FACEBOOK_URL = 'https://www.facebook.com/itravel.vn';

    const handleSendMessage = async () => {
        if (!input.trim() || loading) return;

        const userMessage = input.trim();
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMessage }]);
        setLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMessage, history: messages }),
            });
            const data = await res.json();

            if (data.success) {
                setMessages(prev => [...prev, { role: 'assistant', content: data.data.reply }]);
            } else {
                setMessages(prev => [...prev, { role: 'assistant', content: 'Xin lỗi, tôi không thể xử lý yêu cầu này. Vui lòng thử lại sau!' }]);
            }
        } catch (error) {
            setMessages(prev => [...prev, { role: 'assistant', content: 'Đã xảy ra lỗi kết nối. Vui lòng thử lại!' }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            {/* Floating Buttons */}
            <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
                {isOpen && (
                    <>
                        {/* Facebook Chat Button */}
                        <Link
                            href={FACEBOOK_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-all hover:scale-105 animate-fade-in"
                        >
                            <MessageCircle className="w-5 h-5" />
                            <span className="font-medium text-sm">Chat Facebook</span>
                            <ExternalLink className="w-4 h-4" />
                        </Link>

                        {/* AI Chat Button */}
                        <button
                            onClick={() => {
                                setIsChatOpen(true);
                                setIsOpen(false);
                            }}
                            className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-full shadow-lg hover:from-emerald-600 hover:to-teal-600 transition-all hover:scale-105 animate-fade-in"
                        >
                            <Bot className="w-5 h-5" />
                            <span className="font-medium text-sm">Chat AI</span>
                            <Sparkles className="w-4 h-4" />
                        </button>
                    </>
                )}

                {/* Main Toggle Button */}
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className={`p-4 rounded-full shadow-xl transition-all hover:scale-110 ${isOpen
                            ? 'bg-gray-800 text-white'
                            : 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white animate-pulse'
                        }`}
                >
                    {isOpen ? <X className="w-6 h-6" /> : <MessageCircle className="w-6 h-6" />}
                </button>
            </div>

            {/* AI Chat Window */}
            {isChatOpen && (
                <div className="fixed bottom-6 right-6 z-50 w-96 h-[500px] bg-white rounded-3xl shadow-2xl border border-gray-200 flex flex-col overflow-hidden animate-scale-in">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-xl">
                                <Bot className="w-6 h-6" />
                            </div>
                            <div>
                                <h3 className="font-bold">AI Du lịch</h3>
                                <p className="text-xs text-emerald-100">Trợ lý thông minh của iTravel</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsChatOpen(false)}
                            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[80%] p-3 rounded-2xl ${msg.role === 'user'
                                            ? 'bg-emerald-500 text-white rounded-br-none'
                                            : 'bg-white text-gray-800 shadow-sm rounded-bl-none border border-gray-100'
                                        }`}
                                >
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                </div>
                            </div>
                        ))}
                        {loading && (
                            <div className="flex justify-start">
                                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-sm border border-gray-100">
                                    <Loader2 className="w-5 h-5 animate-spin text-emerald-500" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Input */}
                    <div className="p-4 bg-white border-t border-gray-100">
                        <div className="flex items-center gap-2">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                                placeholder="Hỏi về du lịch Việt Nam..."
                                className="flex-1 px-4 py-3 bg-gray-100 rounded-xl outline-none focus:ring-2 focus:ring-emerald-500 text-sm"
                                disabled={loading}
                            />
                            <button
                                onClick={handleSendMessage}
                                disabled={loading || !input.trim()}
                                className="p-3 bg-gradient-to-r from-emerald-500 to-teal-500 text-white rounded-xl hover:from-emerald-600 hover:to-teal-600 transition-colors disabled:opacity-50"
                            >
                                <Send className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
