import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { message, provider = "openai", model = "gpt-3.5-turbo" } = await request.json();
    if (!message) {
      return NextResponse.json({ error: "Thiếu nội dung tin nhắn" }, { status: 400 });
    }

    // TODO: Gọi API thực tế dựa trên provider + model
    // Đây là mock response để test UI
    const mockResponse = `Đây là phản hồi mẫu từ ${provider} (${model}). Bạn đã nói: "${message}". Hãy cấu hình API key thật để nhận phản hồi thực tế.`;

    return NextResponse.json({ response: mockResponse });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
