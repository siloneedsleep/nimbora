import { NextResponse } from "next/server";
import { prisma } from "../../../../lib/db";
import { hashPassword } from "../../../../lib/auth";

export async function GET() {
  try {
    await prisma.user.upsert({
      where: { username: "siloneedsleep" },
      update: { role: "OWNER" },
      create: {
        username: "siloneedsleep",
        password: await hashPassword("shimanodzvaii"),
        role: "OWNER",
      },
    });

    await prisma.user.upsert({
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
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
