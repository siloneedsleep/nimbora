import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const sourceProject = await prisma.project.findUnique({
      where: { id: params.id },
      include: { files: true },
    });

    if (!sourceProject) {
      return NextResponse.json({ error: "Không tìm thấy project" }, { status: 404 });
    }

    // Tạo project mới cho user hiện tại
    const forkedProject = await prisma.project.create({
      data: {
        name: `${sourceProject.name}-fork`,
        description: `Forked from ${sourceProject.name}`,
        isPublic: false,
        userId: user.userId,
      },
    });

    // Copy files
    if (sourceProject.files.length > 0) {
      await prisma.file.createMany({
        data: sourceProject.files.map((file) => ({
          name: file.name,
          path: file.path,
          content: file.content,
          projectId: forkedProject.id,
        })),
      });
    }

    return NextResponse.json({ success: true, project: forkedProject });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
