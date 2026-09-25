import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/auth";

// Route setup 2 tài khoản cố định (Owner + Official) lần đầu deploy.
//
// KHÔNG còn hardcode username/password trong code — đọc từ env:
//   SETUP_TOKEN        — bắt buộc, phải khớp header "x-setup-token"
//   OWNER_USERNAME      (mặc định "siloneedsleep" — không phải bí mật)
//   OWNER_PASSWORD     — bắt buộc, không có default
//   OFFICIAL_USERNAME   (mặc định "mioo")
//   OFFICIAL_PASSWORD  — bắt buộc, không có default
//
// Chỉ tạo user nếu CHƯA tồn tại — không ghi đè password user đã có, tránh
// vô tình reset password đang dùng khi gọi lại route.
//
// Khuyến nghị: sau khi setup xong, unset SETUP_TOKEN trên Render để khoá
// route này lại.

export async function POST(request: Request) {
  try {
    const setupToken = process.env.SETUP_TOKEN;
    if (!setupToken) {
      return NextResponse.json(
        { error: "Setup đã bị khoá (SETUP_TOKEN chưa được set trên server)." },
        { status: 404 }
      );
    }

    const providedToken = request.headers.get("x-setup-token");
    if (providedToken !== setupToken) {
      return NextResponse.json({ error: "Token không hợp lệ" }, { status: 401 });
    }

    const ownerPassword = process.env.OWNER_PASSWORD;
    const officialPassword = process.env.OFFICIAL_PASSWORD;
    if (!ownerPassword || !officialPassword) {
      return NextResponse.json(
        { error: "Thiếu OWNER_PASSWORD hoặc OFFICIAL_PASSWORD trong env." },
        { status: 500 }
      );
    }

    const ownerUsername = process.env.OWNER_USERNAME || "siloneedsleep";
    const officialUsername = process.env.OFFICIAL_USERNAME || "mioo";

    const results: string[] = [];

    const existingOwner = await prisma.user.findUnique({ where: { username: ownerUsername } });
    if (!existingOwner) {
      await prisma.user.create({
        data: {
          username: ownerUsername,
          password: await hashPassword(ownerPassword),
          role: "OWNER",
        },
      });
      results.push(`Đã tạo Owner: ${ownerUsername}`);
    } else {
      results.push(`Owner đã tồn tại, bỏ qua: ${ownerUsername}`);
    }

    const existingOfficial = await prisma.user.findUnique({ where: { username: officialUsername } });
    if (!existingOfficial) {
      await prisma.user.create({
        data: {
          username: officialUsername,
          password: await hashPassword(officialPassword),
          role: "OFFICIAL",
        },
      });
      results.push(`Đã tạo Official: ${officialUsername}`);
    } else {
      results.push(`Official đã tồn tại, bỏ qua: ${officialUsername}`);
    }

    return NextResponse.json({ success: true, results });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Lỗi server" }, { status: 500 });
  }
}
