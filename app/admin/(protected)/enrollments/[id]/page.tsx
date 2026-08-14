import { notFound } from "next/navigation";

import { getEnrollmentById } from "@/services/enrollment.service";

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function EnrollmentDetailsPage({
  params,
}: Props) {

  const { id } = await params;

  const enrollment = await getEnrollmentById(id);

  if (!enrollment) {
    notFound();
  }


  return (
    <div className="space-y-8">

      <div>
        <h1 className="text-3xl font-bold">
          Enrollment Details
        </h1>

        <p className="text-muted-foreground mt-2">
          Review student application details.
        </p>
      </div>


      <div className="grid gap-6 md:grid-cols-2">


        {/* Student */}

        <div className="rounded-xl border bg-white p-6">

          <h2 className="text-xl font-semibold mb-5">
            Student Information
          </h2>


          <div className="space-y-3">

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Name
              </span>

              <span>
                {enrollment.student_name}
              </span>
            </div>


            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Email
              </span>

              <span>
                {enrollment.student_email}
              </span>
            </div>


          </div>

        </div>



        {/* Program */}

        <div className="rounded-xl border bg-white p-6">

          <h2 className="text-xl font-semibold mb-5">
            Program Information
          </h2>


          <div className="space-y-3">

            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Program
              </span>

              <span>
                {enrollment.program_title}
              </span>
            </div>


            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Status
              </span>

              <span className="capitalize">
                {enrollment.status}
              </span>
            </div>


            <div className="flex justify-between">
              <span className="text-muted-foreground">
                Payment
              </span>

              <span className="capitalize">
                {enrollment.payment_status}
              </span>
            </div>


          </div>

        </div>


      </div>


    </div>
  );
}