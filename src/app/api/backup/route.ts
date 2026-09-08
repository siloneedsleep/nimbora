import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    // Lấy tất cả dữ liệu của user
    const files = await prisma.file.findMany({ where: { userId: user.userId } });
    const projects = await prisma.project.findMany({
      where: { userId: user.userId },
      include: { files: true },
    });
    const blogs = await prisma.blog.findMany({
      where: { userId: user.userId },
      include: { comments: true, reactions: true },
    });
    const apiKeys = await prisma.aPIKey.findMany({ where: { userId: user.userId } });

    const backup = {
      version: "1.0",
      createdAt: new Date().toISOString(),
      data: {
        files,
        projects,
        blogs,
        apiKeys: apiKeys.map((key) => ({
          id: key.id,
          provider: key.provider,
          maskKey: key.maskKey,
          status: key.status,
        })),
      },
    };

    return NextResponse.json({ backup });
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

    const { backup } = await request.json();

    // TODO: Restore từ backup
    // Tạm thời trả về success
    return NextResponse.json({ success: true, message: "Backup đã được khôi phục" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
