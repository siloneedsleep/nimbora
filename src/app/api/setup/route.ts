import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

export async function GET() {
  try {
    const user1 = await prisma.user.upsert({
      where: { username: "siloneedsleep" },
      update: { role: "OWNER" },
      create: {
        username: "siloneedsleep",
        password: await hashPassword("shimanodzvaii"),
        role: "OWNER",
      },
    });

    const user2 = await prisma.user.upsert({
      where: { username: "mioo" },
      update: { role: "OFFICIAL" },
      create: {
        username: "mioo",
        password: await hashPassword("mioo1234"),
        role: "OFFICIAL",
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
