import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Award } from "lucide-react";
import { getCompletedEnrollmentsWithCerts } from "@/services/certificate.service";
import CertificateTable from "@/components/admin/certificates/CertificateTable";

export const dynamic = "force-dynamic";

export default async function AdminCertificatesPage() {
  const session = await auth();
  if (!session?.user || (session.user as any).role !== "admin") {
    redirect("/admin/login");
  }

  let data: any[] = [];
  let error: string | null = null;

  try {
    data = await getCompletedEnrollmentsWithCerts();
  } catch (err) {
    console.error("[AdminCertificatesPage] fetch error:", err);
    error = "Failed to load certificate data. Please try refreshing the page.";
  }

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="size-10 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center shadow-md shadow-amber-200">
              <Award className="size-5 text-white" />
            </div>
            <div>
              <h1 className="font-montserrat text-2xl font-extrabold text-slate-900 leading-tight">
                Certificates
              </h1>
              <p className="text-xs text-slate-500 font-medium">
                Manage completion certificates for enrolled students
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info banner */}
      <div className="rounded-2xl border border-[#004aad]/20 bg-[#004aad]/5 px-5 py-4 flex gap-3 items-start">
        <Award className="size-4 text-[#004aad] mt-0.5 flex-shrink-0" />
        <div className="text-xs text-[#004aad] font-medium leading-relaxed">
          <span className="font-bold">How it works:</span> Only enrollments marked{" "}
          <span className="font-bold">Completed</span> appear here. Add or update a certificate download
          URL (Google Drive, Dropbox, S3, etc.) for each student. Once a URL is saved, the student will
          see a <span className="font-bold">Download Certificate</span> button on their dashboard.
        </div>
      </div>

      {/* Error state */}
      {error ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-5 py-6 text-center">
          <p className="text-sm font-semibold text-red-700">{error}</p>
        </div>
      ) : (
        <CertificateTable initialData={data} />
      )}
    </div>
  );
}
