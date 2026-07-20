import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { PLAN_LIMITS, PLAN_NAMES, PLAN_PRICES } from "@/lib/plans";

export async function GET() {
  const session = await auth();

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      plan: true,
      subscription: {
        select: {
          status: true,
          startedAt: true,
          expiresAt: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const plan = user.plan as keyof typeof PLAN_LIMITS;

  return NextResponse.json({
    plan,
    planName: PLAN_NAMES[plan],
    price: PLAN_PRICES[plan],
    features: PLAN_LIMITS[plan],
    subscription: user.subscription,
  });
}
