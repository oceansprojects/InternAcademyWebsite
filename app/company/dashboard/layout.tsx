import SiteHeader from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";

export default function CompanyDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteHeader />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-26 sm:pt-28 pb-12">
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
