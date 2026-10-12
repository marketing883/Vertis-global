import { requirePage } from "@/lib/admin/auth";
import { Card, PageHeader } from "@/components/admin/ui";
import { ChangePasswordForm } from "@/components/admin/UserForms";

export const metadata = { title: "My account" };

export default async function AccountPage() {
  const user = await requirePage("account");
  return (
    <>
      <PageHeader title="My account" description={`${user.name} · ${user.email} · ${user.role === "hr" ? "Recruiter" : "Admin"}`} />
      <Card className="p-6">
        <h2 className="mb-4 text-base font-semibold">Change password</h2>
        <ChangePasswordForm />
      </Card>
    </>
  );
}
