import { redirect } from "next/navigation";
import { Sidebar } from "@/components/admin/Sidebar";
import { canAccess, currentUser } from "@/lib/admin/auth";

/* Every page in the admin panel. Signed-out visitors are sent to the
   login page; each page then checks its own section (requirePage). */
const SECTIONS = ["", "case-studies", "blog", "whitepapers", "webinars", "news", "jobs", "job-applications", "users", "account"];

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const user = await currentUser();
  if (!user) redirect("/admin/login");
  const allowed = SECTIONS.filter((s) => canAccess(user.role, s));
  return (
    <div className="min-h-screen lg:pl-64">
      <Sidebar user={{ name: user.name, email: user.email, role: user.role }} allowed={allowed} />
      <main id="main" className="mx-auto max-w-[1200px] px-4 py-8 sm:px-6 lg:px-10 lg:py-10">
        {children}
      </main>
    </div>
  );
}
