import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: user.userId },
          { receiverId: user.userId },
        ],
      },
      include: {
        sender: { select: { username: true } },
      },
      orderBy: { createdAt: "asc" },
    });

    return NextResponse.json({ messages });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { receiverId, content, type = "text", metadata } = await request.json();
    if (!receiverId || !content) {
      return NextResponse.json({ error: "Thiếu thông tin" }, { status: 400 });
    }

    const message = await prisma.message.create({
      data: {
        senderId: user.userId,
        receiverId,
        content,
        type,
        metadata: metadata ? JSON.stringify(metadata) : null,
      },
    });

    // Tạo notification cho người nhận
    await prisma.notification.create({
      data: {
        userId: receiverId,
        type: "chat_message",
        title: "Tin nhắn mới",
        content: `Bạn có tin nhắn mới`,
        data: JSON.stringify({ messageId: message.id, senderId: user.userId }),
      },
    });

    return NextResponse.json({ success: true, message });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
