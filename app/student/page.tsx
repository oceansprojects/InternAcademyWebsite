import { auth } from "@/auth";
import { redirect } from "next/navigation";
import LogoutButton from "./_components/logout-button";

export default async function StudentDashboard() {
  const session = await auth();

  if (!session) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-xl rounded-2xl bg-white shadow-lg border border-gray-200 p-8">

        <h1 className="text-3xl font-bold text-gray-900">
          Student Dashboard
        </h1>

        <p className="mt-2 text-gray-600">
          Welcome back,
        </p>

        <h2 className="mt-1 text-2xl font-semibold text-[#004aad]">
          {session.user.name}
        </h2>

        <div className="mt-8 border-t pt-6">

          <p className="text-gray-600">
            Email
          </p>

          <p className="font-medium">
            {session.user.email}
          </p>

          <p className="mt-6 text-gray-600">
            Role
          </p>

          <p className="font-medium capitalize">
            {session.user.role}
          </p>

        </div>

        <div className="mt-10">
          <LogoutButton />
        </div>

      </div>
    </main>
  );
}