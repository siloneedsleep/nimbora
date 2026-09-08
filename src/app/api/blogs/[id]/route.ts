import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: params.id },
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
    });

    if (!blog) {
      return NextResponse.json({ error: "Không tìm thấy blog" }, { status: 404 });
    }

    return NextResponse.json({ blog });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const blog = await prisma.blog.findUnique({ where: { id: params.id } });
    if (!blog || blog.userId !== user.userId) {
      return NextResponse.json({ error: "Không tìm thấy blog" }, { status: 404 });
    }

    await prisma.blog.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
