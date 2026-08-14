import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";

import { getStudentApplications } from "@/services/application.service";

import ApplicationStatusBadge from "@/components/student-dashboard/ApplicationStatusBadge";

export default async function ApplicationsPage() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const applications = await getStudentApplications(
    session.user.id
  );

  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          My Applications
        </h1>

        <p className="text-muted-foreground">
          Track every program you've applied for.
        </p>
      </div>

      {applications.length === 0 ? (
        <div className="rounded-xl border bg-card p-10 text-center">
          <h2 className="text-xl font-semibold">
            No Applications Yet
          </h2>

          <p className="mt-2 text-muted-foreground">
            Explore our programs and apply to get started.
          </p>

          <Link
            href="/courses"
            className="mt-6 inline-block rounded-lg bg-primary px-5 py-3 text-primary-foreground"
          >
            Browse Courses
          </Link>
        </div>
      ) : (
        <div className="space-y-4">

          {applications.map((application: any) => (
            <Link
              key={application.id}
              href={`/student/dashboard/applications/${application.id}`}
            >
              <div className="rounded-xl border bg-card p-6 transition hover:shadow-md">

                <div className="flex items-center justify-between">

                  <div>

                    <h2 className="text-xl font-semibold">
                      {application.title}
                    </h2>

                    <p className="mt-1 text-muted-foreground">
                      {application.category}
                    </p>

                    <p className="mt-2 text-sm text-muted-foreground">
                      Applied on{" "}
                      {new Date(
                        application.enrolled_at
                      ).toLocaleDateString("en-IN")}
                    </p>

                  </div>

                  <ApplicationStatusBadge
                    status={application.status}
                  />

                </div>

              </div>
            </Link>
          ))}

        </div>
      )}

    </div>
  );
}