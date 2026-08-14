import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";

import { getStudentApplicationById } from "@/services/application.service";
import ApplicationStatusBadge from "@/components/student-dashboard/ApplicationStatusBadge";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function ApplicationDetailsPage({
  params,
}: Props) {
  const { id } = await params;

  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  const application = await getStudentApplicationById(
    session.user.id,
    id
  );

  if (!application) {
    notFound();
  }

  return (
    <div className="space-y-8">

      <div className="flex items-center justify-between">

        <div>
          <h1 className="text-3xl font-bold">
            {application.title}
          </h1>

          <p className="text-muted-foreground mt-2">
            Application Details
          </p>
        </div>

        <ApplicationStatusBadge status={application.status} />

      </div>

      {/* Program Information */}

      <div className="rounded-xl border bg-card p-6">
        <h2 className="text-xl font-semibold mb-5">
          Program Information
        </h2>

        <div className="grid gap-5 md:grid-cols-2">

          <Info label="Program" value={application.title} />

          <Info label="Category" value={application.category} />

          <Info
            label="Duration"
            value={`${application.duration_weeks} Weeks`}
          />

          <Info
            label="Mode"
            value={application.batch_mode}
          />

          <Info
            label="Fee"
            value={`₹${(
              application.discounted_price / 100
            ).toLocaleString("en-IN")}`}
          />

          <Info
            label="Applied On"
            value={new Date(
              application.enrolled_at
            ).toLocaleDateString("en-IN")}
          />

        </div>
      </div>

      {/* Next Steps */}

      <div className="rounded-xl border bg-card p-6">

        <h2 className="text-xl font-semibold">
          Next Steps
        </h2>

        <div className="mt-5 rounded-lg bg-yellow-50 border border-yellow-200 p-5">

          <p className="font-medium">
            Your application is currently under review.
          </p>

          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
            <li>Admissions team will review your profile.</li>
            <li>You may receive a phone call or email.</li>
            <li>Status will update automatically once reviewed.</li>
          </ul>

        </div>

      </div>

      <div className="flex gap-4">

        <Link href="/student/dashboard/applications">
          <Button variant="outline">
            Back to Applications
          </Button>
        </Link>

        <Link href="/courses">
          <Button>
            Browse More Courses
          </Button>
        </Link>

      </div>

    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-sm text-muted-foreground">
        {label}
      </p>

      <p className="mt-1 font-medium">
        {value}
      </p>
    </div>
  );
}