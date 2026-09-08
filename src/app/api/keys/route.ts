import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";

function detectProvider(key: string): string {
  if (key.startsWith("sk-ant-")) return "anthropic";
  if (key.startsWith("sk-")) return "openai";
  if (key.startsWith("AIza")) return "google";
  if (key.startsWith("mistral-")) return "mistral";
  if (key.startsWith("co-")) return "cohere";
  return "unknown";
}

function maskKey(key: string): string {
  if (key.length <= 10) return key;
  return `${key.slice(0, 5)}...${key.slice(-5)}`;
}

export async function POST(request: Request) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const { key } = await request.json();
    if (!key) {
      return NextResponse.json({ error: "Thiếu API key" }, { status: 400 });
    }

    const provider = detectProvider(key);
    const maskKey = maskKey(key);

    const apiKey = await prisma.aPIKey.create({
      data: {
        userId: user.userId,
        provider,
        key,
        maskKey,
        status: "active",
      },
    });

    return NextResponse.json({
      success: true,
      apiKey: {
        id: apiKey.id,
        provider: apiKey.provider,
        maskKey: apiKey.maskKey,
        status: apiKey.status,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}

export async function GET(request: Request) {
  try {
    const user = getCurrentUser(request as any);
    if (!user) {
      return NextResponse.json({ error: "Chưa đăng nhập" }, { status: 401 });
    }

    const apiKeys = await prisma.aPIKey.findMany({
      where: { userId: user.userId },
      select: {
        id: true,
        provider: true,
        maskKey: true,
        status: true,
        defaultModel: true,
        createdAt: true,
      },
    });

    return NextResponse.json({ apiKeys });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
