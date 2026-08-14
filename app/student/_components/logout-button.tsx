"use client";

import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <button
      onClick={() =>
        signOut({
          callbackUrl: "/",
        })
      }
      className="rounded-lg bg-red-600 px-5 py-3 text-white font-medium hover:bg-red-700 transition-colors"
    >
      Logout
    </button>
  );
}