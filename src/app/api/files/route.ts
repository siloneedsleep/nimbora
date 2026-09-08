import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const files = await prisma.file.findMany({
      where: { userId: user.userId },
      select: {
        id: true,
        name: true,
        path: true,
        content: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ files });
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

    const { name, path = "/", content = "" } = await request.json();
    if (!name) {
      return NextResponse.json({ error: "Thiếu tên file" }, { status: 400 });
    }

    const file = await prisma.file.create({
      data: {
        name,
        path,
        content,
        userId: user.userId,
      },
    });

    return NextResponse.json({ success: true, file });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
