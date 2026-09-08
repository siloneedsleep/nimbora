import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const blogs = await prisma.blog.findMany({
      where: { isPublic: true },
      include: {
        user: {
          select: { id: true, username: true, role: true, isVerified: true },
        },
        comments: {
          include: {
            user: { select: { username: true, role: true } },
          },
          orderBy: { createdAt: "desc" },
        },
        reactions: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ blogs });
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

    // Chỉ Official hoặc Verified mới được đăng blog
    const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
    if (!dbUser || (dbUser.role !== "OWNER" && dbUser.role !== "OFFICIAL" && dbUser.role !== "VERIFIED")) {
      return NextResponse.json({ error: "Bạn không có quyền đăng blog" }, { status: 403 });
    }

    const { title, content, category, tags, isPublic = true } = await request.json();
    if (!title || !content) {
      return NextResponse.json({ error: "Thiếu tiêu đề hoặc nội dung" }, { status: 400 });
    }

    const blog = await prisma.blog.create({
      data: {
        title,
        content,
        category,
        tags,
        isPublic,
        userId: user.userId,
      },
    });

    return NextResponse.json({ success: true, blog });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
