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

    const { name, path = "/", content = "", projectId } = await request.json();
    if (!name) {
      return NextResponse.json({ error: "Thiếu tên file" }, { status: 400 });
    }

    // Nếu export vào 1 project cụ thể, verify project đó thuộc user này
    // trước khi gán projectId — tránh gắn file vào project của người khác.
    if (projectId) {
      const project = await prisma.project.findUnique({ where: { id: projectId } });
      if (!project || project.userId !== user.userId) {
        return NextResponse.json({ error: "Không tìm thấy project" }, { status: 404 });
      }
    }

    const file = await prisma.file.create({
      data: {
        name,
        path,
        content,
        userId: user.userId,
        projectId: projectId || undefined,
      },
    });

    return NextResponse.json({ success: true, file });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
