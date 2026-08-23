import SiteHeader from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import StudentProfileForm from "@/components/student/StudentProfileForm";

export default function StudentProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-28 sm:pt-32 md:pt-36 pb-12">
        <div className="container max-w-4xl mx-auto px-4 sm:px-6">
          <StudentProfileForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}