import { auth } from "@/auth";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await auth();

  if (!session || !session.user || !session.user.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const userId = session.user.id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, plan: true, name: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const secret = process.env.AUTH_SECRET || "fallback_zcore_secret_key_123";

    const desktopToken = jwt.sign(
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        plan: user.plan,
        isDesktop: true,
      },
      secret,
      { expiresIn: "30d" }
    );

    return NextResponse.json({ token: desktopToken });
  } catch (error) {
    console.error("Error generating desktop token:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
