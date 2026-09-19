import SiteHeader from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import StudentProfileForm from "@/components/student/StudentProfileForm";

export default function StudentProfilePage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="flex-1 pt-28 sm:pt-32 md:pt-36 pb-12">
        <div className="w-[95%] sm:w-[92%] md:w-[88%] lg:w-[80%] max-w-7xl mx-auto px-2 sm:px-4">
          <StudentProfileForm />
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}