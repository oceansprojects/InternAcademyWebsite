import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAuth() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();

  if (
    session.user.role !== "admin" &&
    session.user.role !== "super_admin"
  ) {
    redirect("/");
  }

  return session;
}

export async function requireStudent() {
  const session = await requireAuth();

  if (session.user.role !== "student") {
    redirect("/");
  }

  return session;
}