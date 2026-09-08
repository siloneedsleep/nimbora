import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const file = await prisma.file.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        name: true,
        path: true,
        content: true,
        updatedAt: true,
      },
    });

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file" }, { status: 404 });
    }

    return NextResponse.json({ file });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { name, content, path } = await request.json();

    const file = await prisma.file.findUnique({
      where: { id: params.id },
    });

    if (!file || file.userId !== user.userId) {
      return NextResponse.json({ error: "Không tìm thấy file" }, { status: 404 });
    }

    const updated = await prisma.file.update({
      where: { id: params.id },
      data: {
        name: name || file.name,
        content: content !== undefined ? content : file.content,
        path: path || file.path,
      },
    });

    return NextResponse.json({ success: true, file: updated });
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

    const file = await prisma.file.findUnique({
      where: { id: params.id },
    });

    if (!file || file.userId !== user.userId) {
      return NextResponse.json({ error: "Không tìm thấy file" }, { status: 404 });
    }

    await prisma.file.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
