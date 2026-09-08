import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { emoji } = await request.json();
    if (!emoji) {
      return NextResponse.json({ error: "Thiếu emoji" }, { status: 400 });
    }

    const reaction = await prisma.reaction.create({
      data: {
        emoji,
        blogId: params.id,
        userId: user.userId,
      },
    });

    return NextResponse.json({ success: true, reaction });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
