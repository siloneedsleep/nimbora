import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q") || "";

    if (!query) {
      return NextResponse.json({ results: [] });
    }

    const [files, projects, blogs] = await Promise.all([
      prisma.file.findMany({
        where: {
          userId: user.userId,
          OR: [
            { name: { contains: query } },
            { content: { contains: query } },
          ],
        },
        select: { id: true, name: true, path: true },
        take: 5,
      }),
      prisma.project.findMany({
        where: {
          userId: user.userId,
          OR: [
            { name: { contains: query } },
            { description: { contains: query } },
          ],
        },
        select: { id: true, name: true, description: true },
        take: 5,
      }),
      prisma.blog.findMany({
        where: {
          userId: user.userId,
          OR: [
            { title: { contains: query } },
            { content: { contains: query } },
          ],
        },
        select: { id: true, title: true },
        take: 5,
      }),
    ]);

    return NextResponse.json({
      results: {
        files,
        projects,
        blogs,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
