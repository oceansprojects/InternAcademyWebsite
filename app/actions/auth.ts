"use server"

import { signIn, signOut } from "@/auth"
import { AuthError } from "next-auth"

export async function adminSignIn(
  _prevState: string | null,
  formData: FormData
): Promise<string | null> {
  try {
    await signIn("credentials", {
      email:    formData.get("email"),
      password: formData.get("password"),
      redirectTo: "/admin",
    })
    return null
  } catch (error) {
    // NextAuth throws a NEXT_REDIRECT — let it propagate
    if (error instanceof AuthError) {
      return "Invalid email or password."
    }
    throw error
  }
}

export async function adminSignOut() {
  await signOut({ redirectTo: "/admin/login" })
}
