import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { connectDB } from '@/lib/db';
import { Destination } from '@/models';

interface ChatRequest {
    message: string;
    history: Array<{ role: 'user' | 'assistant'; content: string }>;
}

// Sử dụng Gemini API qua OpenAI-compatible endpoint
function getAIClient() {
    if (!process.env.GEMINI_API_KEY) {
        throw new Error(
            '❌ GEMINI_API_KEY chưa được cấu hình!\n' +
            '   → Lấy key tại: https://aistudio.google.com/apikey\n' +
            '   → Thêm vào .env.local: GEMINI_API_KEY=AIzaSy...'
        );
    }
    return new OpenAI({
        apiKey: process.env.GEMINI_API_KEY,
        baseURL: 'https://generativelanguage.googleapis.com/v1beta/openai/',
    });
}

export async function POST(request: NextRequest) {
    try {
        await connectDB();
        const body: ChatRequest = await request.json();
        const { message, history } = body;

        // Get destinations for context
        const destinations = await Destination.find({ isActive: true })
            .populate('categoryId', 'name')
            .populate('provinceId', 'name')
            .select('name slug shortDescription priceRange rating provinceId categoryId')
            .lean();

        const destinationsContext = destinations.map(d => ({
            name: d.name,
            slug: d.slug,
            description: d.shortDescription,
            priceMin: d.priceRange?.min || 500000,
            priceMax: d.priceRange?.max || 2000000,
            rating: d.rating || 4.0,
            province: (d.provinceId as any)?.name || 'Việt Nam',
            category: (d.categoryId as any)?.name || 'Du lịch',
        }));

        const systemPrompt = `Bạn là trợ lý du lịch AI của iTravel - nền tảng du lịch Việt Nam. 
Bạn giúp người dùng:
- Tìm điểm đến phù hợp
- Gợi ý lịch trình du lịch
- Trả lời câu hỏi về du lịch Việt Nam
- Đưa ra mẹo và kinh nghiệm du lịch

Dữ liệu địa điểm hiện có:
${JSON.stringify(destinationsContext, null, 2)}

Quy tắc:
- Trả lời ngắn gọn, thân thiện bằng tiếng Việt
- Gợi ý địa điểm cụ thể từ danh sách khi phù hợp
- Nếu hỏi về giá, trả lời theo VNĐ
- Khuyến khích người dùng sử dụng tính năng "AI Lịch trình" để lên kế hoạch chi tiết`;

        const ai = getAIClient();

        // Build conversation history
        const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
            { role: 'system', content: systemPrompt },
            ...history.slice(-10).map(msg => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content,
            })),
            { role: 'user', content: message },
        ];

        const completion = await ai.chat.completions.create({
            model: 'gemini-2.5-flash',
            messages,
            temperature: 0.8,
            max_tokens: 500,
        });

        const reply = completion.choices[0]?.message?.content || 'Xin lỗi, tôi không thể trả lời lúc này.';

        return NextResponse.json({
            success: true,
            data: { reply },
        });
    } catch (error: unknown) {
        console.error('Chat API error:', error);

        if (error instanceof OpenAI.APIError) {
            if (error.status === 429) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'API Gemini đang bị giới hạn (rate limit). Tài khoản có thể hết quota. Kiểm tra tại https://aistudio.google.com/apikey',
                    },
                    { status: 429 }
                );
            }
            if (error.status === 401) {
                return NextResponse.json(
                    { success: false, error: 'API key Gemini không hợp lệ. Kiểm tra GEMINI_API_KEY trong .env.local' },
                    { status: 401 }
                );
            }
            return NextResponse.json(
                { success: false, error: `Lỗi Gemini: ${error.message}` },
                { status: error.status || 500 }
            );
        }

        return NextResponse.json(
            { success: false, error: 'Không thể xử lý tin nhắn' },
            { status: 500 }
        );
    }
}
