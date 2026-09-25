import { NextResponse } from "next/server";
import { prisma } from "../../../lib/db";
import { getCurrentUser } from "../../../lib/auth";

export async function GET(request: Request) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    // Lấy activity trong 30 ngày
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [files, projects, blogs, messages] = await Promise.all([
      prisma.file.findMany({
        where: { userId: user.userId, createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
      prisma.project.findMany({
        where: { userId: user.userId, createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
      prisma.blog.findMany({
        where: { userId: user.userId, createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
      prisma.message.findMany({
        where: { senderId: user.userId, createdAt: { gte: thirtyDaysAgo } },
        select: { createdAt: true },
      }),
    ]);

    // Tạo heatmap data
    const activityMap = new Map<string, number>();

    const addActivity = (date: Date) => {
      const key = date.toISOString().split("T")[0];
      activityMap.set(key, (activityMap.get(key) || 0) + 1);
    };

    files.forEach((f) => addActivity(f.createdAt));
    projects.forEach((p) => addActivity(p.createdAt));
    blogs.forEach((b) => addActivity(b.createdAt));
    messages.forEach((m) => addActivity(m.createdAt));

    const activities = Array.from(activityMap.entries()).map(([date, count]) => ({
      date,
      count,
    }));

    return NextResponse.json({ activities });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
