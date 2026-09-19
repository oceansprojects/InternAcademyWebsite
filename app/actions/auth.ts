"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"

export async function adminSignIn(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  try {
    await signIn("credentials", {
      email: formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",   // relative path  Auth.js resolves via AUTH_URL
    })
    return null
  } catch (error) {
    // Auth.js throws a NEXT_REDIRECT (not an AuthError) on success  re-throw it
    // so Next.js performs the redirect.
    if (error instanceof AuthError) {
      // Only swallow credential/auth errors; show a user-friendly message.
      return "Invalid email or password."
    }
    // Re-throw everything else (including NEXT_REDIRECT)
    throw error
  }
}

export async function adminSignOut() {
  // Relative path  Auth.js resolves via AUTH_URL in production
  await signOut({ redirectTo: "/admin/login" })
}

