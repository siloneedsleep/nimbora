import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const groups = await prisma.group.findMany({
      where: {
        OR: [
          { ownerId: user.userId },
          { members: { some: { userId: user.userId } } },
        ],
      },
      include: {
        owner: { select: { username: true } },
        members: {
          include: {
            user: { select: { username: true, role: true } },
          },
        },
        messages: {
          include: {
            sender: { select: { username: true } },
          },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    });

    return NextResponse.json({ groups });
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

    const dbUser = await prisma.user.findUnique({ where: { id: user.userId } });
    if (!dbUser || (dbUser.role !== "OWNER" && dbUser.role !== "OFFICIAL")) {
      return NextResponse.json({ error: "Chỉ Official mới tạo group" }, { status: 403 });
    }

    const { name, memberIds = [] } = await request.json();
    if (!name) {
      return NextResponse.json({ error: "Thiếu tên group" }, { status: 400 });
    }

    const group = await prisma.group.create({
      data: {
        name,
        ownerId: user.userId,
      },
    });

    // Thêm owner vào group
    await prisma.chatMember.create({
      data: {
        userId: user.userId,
        groupId: group.id,
      },
    });

    // Thêm members
    for (const memberId of memberIds) {
      await prisma.chatMember.create({
        data: {
          userId: memberId,
          groupId: group.id,
        },
      });
    }

    return NextResponse.json({ success: true, group });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
