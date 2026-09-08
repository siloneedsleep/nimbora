import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const knowledge = await prisma.file.findMany({
      where: {
        userId: user.userId,
        OR: [
          { name: { contains: "readme" } },
          { name: { contains: "doc" } },
          { name: { contains: "note" } },
          { name: { contains: "wiki" } },
        ],
      },
      select: {
        id: true,
        name: true,
        path: true,
        content: true,
        updatedAt: true,
      },
      orderBy: { updatedAt: "desc" },
    });

    return NextResponse.json({ knowledge });
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

    const { query } = await request.json();
    if (!query) {
      return NextResponse.json({ error: "Thiếu query" }, { status: 400 });
    }

    // TODO: Tích hợp AI để tìm kiếm ngữ nghĩa
    // Tạm thời tìm kiếm đơn giản
    const results = await prisma.file.findMany({
      where: {
        userId: user.userId,
        OR: [
          { name: { contains: query } },
          { content: { contains: query } },
        ],
      },
      select: {
        id: true,
        name: true,
        path: true,
        content: true,
      },
      take: 10,
    });

    return NextResponse.json({ results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
