"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { adminLoginSchema } from "@/lib/validation/auth";
import { createAdminSession } from "@/lib/auth";

export interface LoginResult {
  ok: false;
  error: string;
}

export async function loginAction(input: {
  email: string;
  password: string;
}): Promise<LoginResult> {
  const parsed = adminLoginSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: "Enter a valid email and password." };
  }

  const user = await prisma.user.findUnique({
    where: { email: parsed.data.email.trim().toLowerCase() },
  });

  const passwordMatches = user
    ? await bcrypt.compare(parsed.data.password, user.passwordHash)
    : false;

  if (!user || !passwordMatches) {
    return { ok: false, error: "Invalid email or password." };
  }

  await createAdminSession(user.id);
  redirect("/admin");
}
