import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    // TODO: Lưu skills trong DB sau
    // Tạm trả về mock data
    const skills = [
      { id: "1", name: "Code Review", type: "markdown", url: "", description: "Review code theo chuẩn" },
      { id: "2", name: "Slack Notification", type: "url", url: "https://hooks.slack.com/...", description: "Gửi thông báo đến Slack" },
      { id: "3", name: "Git Commit Helper", type: "markdown", url: "", description: "Tạo commit message tự động" },
    ];

    return NextResponse.json({ skills });
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

    const { name, type, url, content, description } = await request.json();
    if (!name || !type) {
      return NextResponse.json({ error: "Thiếu thông tin skill" }, { status: 400 });
    }

    // TODO: Lưu skill vào DB
    // Tạm trả về success
    return NextResponse.json({
      success: true,
      skill: { id: Date.now().toString(), name, type, url, description },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
