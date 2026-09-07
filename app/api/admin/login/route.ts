import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { createSession, verifyPassword, checkLoginRateLimit, resetLoginRateLimit } from "@/lib/auth";

const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(1).max(200),
});

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";

  const rateLimit = checkLoginRateLimit(ip);
  if (!rateLimit.allowed) {
    return NextResponse.json({ error: "Too many attempts. Please try again later." }, { status: 429 });
  }

  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid input." }, { status: 400 });
  }

  const email = parsed.data.email.toLowerCase();
  const user = await db.adminUser.findUnique({ where: { email } });

  // Always run a bcrypt compare, even for a nonexistent user, so response
  // timing doesn't leak whether an email is registered.
  const DUMMY_HASH = "$2b$12$C6UzMDM.H6dfI/f/IKcEeOgOJoAmzE0X0GhV.qKKZ.6oUuIm5Xk8O";
  const passwordMatches = await verifyPassword(parsed.data.password, user?.passwordHash ?? DUMMY_HASH);

  if (!user || !passwordMatches) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }

  resetLoginRateLimit(ip);
  await createSession(user.id);

  return NextResponse.json({ ok: true });
}
