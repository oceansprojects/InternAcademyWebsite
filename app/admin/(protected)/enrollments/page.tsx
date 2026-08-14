import { getAdminEnrollments } from "@/services/enrollment.service";

import EnrollmentTable from "@/components/admin/enrollments/EnrollmentTable";


export default async function EnrollmentsPage() {

  const enrollments = await getAdminEnrollments();


  return (
    <div className="space-y-8">


      <div>
        <h1 className="text-3xl font-bold">
          Enrollments
        </h1>

        <p className="text-muted-foreground mt-2">
          Manage student applications and enrollment status.
        </p>
      </div>


      <EnrollmentTable
        enrollments={enrollments}
      />


    </div>
  );
}