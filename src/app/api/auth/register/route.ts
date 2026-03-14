import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const { name, email, password, role } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 },
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 },
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json(
        { error: "Email already registered" },
        { status: 409 },
      );
    }

    // NOTE: Plain password for now — bcrypt added in Phase 9
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password,
        role: role === "VENDOR" ? "VENDOR" : "BUYER",
      },
    });

    return NextResponse.json({ id: user.id }, { status: 201 });
  } catch (err) {
    console.error("[REGISTER]", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
