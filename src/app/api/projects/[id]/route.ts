import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const project = await prisma.project.findUnique({
      where: { id: params.id },
      include: {
        files: {
          select: { id: true, name: true, path: true, content: true },
        },
        user: {
          select: { username: true },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Không tìm thấy project" }, { status: 404 });
    }

    // Nếu project private, kiểm tra quyền
    if (!project.isPublic) {
      const user = getCurrentUser(request as any);
      if (!user || user.userId !== project.userId) {
        return NextResponse.json({ error: "Không có quyền truy cập" }, { status: 403 });
      }
    }

    return NextResponse.json({ project });
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

    const { name, description, isPublic } = await request.json();

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project || project.userId !== user.userId) {
      return NextResponse.json({ error: "Không tìm thấy project" }, { status: 404 });
    }

    const updated = await prisma.project.update({
      where: { id: params.id },
      data: {
        name: name || project.name,
        description: description !== undefined ? description : project.description,
        isPublic: isPublic !== undefined ? isPublic : project.isPublic,
      },
    });

    return NextResponse.json({ success: true, project: updated });
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

    const project = await prisma.project.findUnique({
      where: { id: params.id },
    });

    if (!project || project.userId !== user.userId) {
      return NextResponse.json({ error: "Không tìm thấy project" }, { status: 404 });
    }

    await prisma.project.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
