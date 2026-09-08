import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { status, result } = await request.json();

    const task = await prisma.agentTask.findUnique({
      where: { id: params.id },
    });

    if (!task || task.userId !== user.userId) {
      return NextResponse.json({ error: "Không tìm thấy task" }, { status: 404 });
    }

    const updated = await prisma.agentTask.update({
      where: { id: params.id },
      data: {
        status: status || task.status,
        result: result !== undefined ? result : task.result,
      },
    });

    return NextResponse.json({ success: true, task: updated });
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

    const task = await prisma.agentTask.findUnique({
      where: { id: params.id },
    });

    if (!task || task.userId !== user.userId) {
      return NextResponse.json({ error: "Không tìm thấy task" }, { status: 404 });
    }

    await prisma.agentTask.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
