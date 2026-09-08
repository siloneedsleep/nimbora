import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const tasks = await prisma.agentTask.findMany({
      where: { userId: user.userId },
      orderBy: { createdAt: "desc" },
      take: 50,
    });

    return NextResponse.json({ tasks });
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

    const { name, steps } = await request.json();
    if (!name) {
      return NextResponse.json({ error: "Thiếu tên task" }, { status: 400 });
    }

    const task = await prisma.agentTask.create({
      data: {
        name,
        steps: steps ? JSON.stringify(steps) : null,
        userId: user.userId,
        status: "pending",
      },
    });

    // Tạo notification
    await prisma.notification.create({
      data: {
        userId: user.userId,
        type: "agent_update",
        title: "Agent task mới",
        content: `Task "${name}" đã được tạo và đang chờ xử lý`,
        data: JSON.stringify({ taskId: task.id }),
      },
    });

    return NextResponse.json({ success: true, task });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
