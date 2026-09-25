import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const apiKey = await prisma.aPIKey.findUnique({
      where: { id: params.id },
    });

    if (!apiKey || apiKey.userId !== user.userId) {
      return NextResponse.json({ error: "Không tìm thấy key" }, { status: 404 });
    }

    await prisma.aPIKey.delete({ where: { id: params.id } });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { defaultModel } = await request.json();

    const apiKey = await prisma.aPIKey.findUnique({
      where: { id: params.id },
    });

    if (!apiKey || apiKey.userId !== user.userId) {
      return NextResponse.json({ error: "Không tìm thấy key" }, { status: 404 });
    }

    const updated = await prisma.aPIKey.update({
      where: { id: params.id },
      data: { defaultModel },
    });

    return NextResponse.json({ success: true, defaultModel: updated.defaultModel });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
