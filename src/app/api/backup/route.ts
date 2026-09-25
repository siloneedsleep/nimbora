import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    // Lấy tất cả dữ liệu của user
    const files = await prisma.file.findMany({ where: { userId: user.userId } });
    const projects = await prisma.project.findMany({
      where: { userId: user.userId },
      include: { files: true },
    });
    const blogs = await prisma.blog.findMany({
      where: { userId: user.userId },
      include: { comments: true, reactions: true },
    });
    const apiKeys = await prisma.aPIKey.findMany({ where: { userId: user.userId } });

    const backup = {
      version: "1.0",
      createdAt: new Date().toISOString(),
      data: {
        files,
        projects,
        blogs,
        apiKeys: apiKeys.map((key) => ({
          id: key.id,
          provider: key.provider,
          maskKey: key.maskKey,
          status: key.status,
        })),
      },
    };

    return NextResponse.json({ backup });
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

    const { backup } = await request.json();
    const data = backup?.data;
    if (!data || typeof data !== "object") {
      return NextResponse.json({ error: "File backup không hợp lệ" }, { status: 400 });
    }

    const projects = Array.isArray(data.projects) ? data.projects : [];
    const files = Array.isArray(data.files) ? data.files : [];
    const blogs = Array.isArray(data.blogs) ? data.blogs : [];

    let restoredProjects = 0;
    let restoredFiles = 0;
    let restoredBlogs = 0;

    // Luôn gán userId = user hiện tại, bỏ qua mọi userId có trong file
    // backup — tránh trường hợp 1 backup bị sửa tay cố ghi đè dữ liệu vào
    // tài khoản người khác.
    for (const project of projects) {
      if (!project?.name) continue;
      const newProject = await prisma.project.create({
        data: {
          name: project.name,
          description: project.description ?? null,
          isPublic: false, // restore về private, user tự bật public lại nếu muốn
          userId: user.userId,
        },
      });
      restoredProjects++;

      const projectFiles = Array.isArray(project.files) ? project.files : [];
      if (projectFiles.length > 0) {
        await prisma.file.createMany({
          data: projectFiles
            .filter((f: any) => f?.name)
            .map((f: any) => ({
              name: f.name,
              path: f.path || "/",
              content: f.content ?? "",
              projectId: newProject.id,
              userId: user.userId,
            })),
        });
        restoredFiles += projectFiles.length;
      }
    }

    // File đứng riêng (không thuộc project nào) — tránh restore trùng file
    // đã restore ở trên qua project.files
    const standaloneFiles = files.filter((f: any) => f?.name && !f.projectId);
    if (standaloneFiles.length > 0) {
      await prisma.file.createMany({
        data: standaloneFiles.map((f: any) => ({
          name: f.name,
          path: f.path || "/",
          content: f.content ?? "",
          userId: user.userId,
        })),
      });
      restoredFiles += standaloneFiles.length;
    }

    for (const blog of blogs) {
      if (!blog?.title || !blog?.content) continue;
      await prisma.blog.create({
        data: {
          title: blog.title,
          content: blog.content,
          category: blog.category ?? null,
          tags: blog.tags ?? null,
          isPublic: Boolean(blog.isPublic),
          userId: user.userId,
        },
      });
      restoredBlogs++;
    }

    return NextResponse.json({
      success: true,
      message: `Đã khôi phục ${restoredProjects} project, ${restoredFiles} file, ${restoredBlogs} blog.`,
      note: "API key không khôi phục được (backup chỉ lưu bản che, không lưu key thật). Comment/reaction cũ cũng không khôi phục vì thuộc về tài khoản khác.",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
