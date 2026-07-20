import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const ADMIN_EMAILS = [
  "burakakyol535@gmail.com",
  "byildiz.codes@gmail.com",
];

export async function GET() {
  const session = await auth();

  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      plan: true,
      createdAt: true,
      subscription: {
        select: { status: true, startedAt: true, expiresAt: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json({ users });
}

export async function PATCH(req: Request) {
  const session = await auth();

  if (!session?.user?.email || !ADMIN_EMAILS.includes(session.user.email)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { userId, plan } = await req.json();

  if (!userId || !["FREE", "STARTER", "PRO"].includes(plan)) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
  }

  // Kullanıcı planını güncelle
  await prisma.user.update({
    where: { id: userId },
    data: { plan },
  });

  // Subscription kaydı yoksa oluştur, varsa güncelle
  await prisma.subscription.upsert({
    where: { userId },
    update: {
      plan,
      status: plan === "FREE" ? "cancelled" : "active",
    },
    create: {
      userId,
      plan,
      status: plan === "FREE" ? "cancelled" : "active",
    },
  });

  return NextResponse.json({ success: true });
}
