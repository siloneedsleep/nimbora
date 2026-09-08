import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { getCurrentUser } from "../../../lib/auth";

export async function POST(request: Request) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { taskId, action } = await request.json();

    // TODO: Thực thi agent thực tế
    // Tạm mock kết quả
    const result = `Agent đã thực hiện action "${action}" cho task ${taskId}. Đây là kết quả mẫu.`;

    if (taskId) {
      await prisma.agentTask.update({
        where: { id: taskId },
        data: {
          status: "completed",
          result,
        },
      });

      await prisma.notification.create({
        data: {
          userId: user.userId,
          type: "agent_update",
          title: "Task hoàn thành",
          content: result,
          data: JSON.stringify({ taskId }),
        },
      });
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
