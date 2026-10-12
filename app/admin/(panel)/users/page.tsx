import { getDb } from "@/lib/db";
import { requirePage } from "@/lib/admin/auth";
import { Badge, Card, PageHeader, Table, formatWhen } from "@/components/admin/ui";
import { AddUserForm, UserRowActions } from "@/components/admin/UserForms";

export const metadata = { title: "Users" };

type Row = { id: number; email: string; name: string; role: string; disabled: number; last_login_at: string | null };

export default async function UsersPage() {
  const me = await requirePage("users");
  const users = getDb()
    .prepare("SELECT id, email, name, role, disabled, last_login_at FROM admin_users ORDER BY disabled, name")
    .all() as Row[];
  return (
    <>
      <PageHeader
        title="Users"
        description="Admins can do everything. Recruiters see Job Listings and Applications only. Vertis accounts are separate from ACI and ArqAI."
      />
      <Card className="mb-8 p-5">
        <h2 className="mb-4 text-base font-semibold">Add a user</h2>
        <AddUserForm />
      </Card>
      <Table head={["Name", "Role", "Last sign-in", "Actions"]}>
        {users.map((u) => (
          <tr key={u.id} className="align-top">
            <td className="px-4 py-4">
              <p className="font-semibold">{u.name}{u.id === me.id ? " (you)" : ""}</p>
              <p className="text-sm text-n-500">{u.email}</p>
            </td>
            <td className="px-4 py-4">
              <span className="flex flex-wrap gap-1.5">
                <Badge tone={u.role}>{u.role === "hr" ? "Recruiter" : "Admin"}</Badge>
                {u.disabled ? <Badge tone="disabled">Disabled</Badge> : null}
              </span>
            </td>
            <td className="px-4 py-4 text-sm text-n-500">{u.last_login_at ? formatWhen(u.last_login_at) : "Never"}</td>
            <td className="px-4 py-4">
              <UserRowActions id={u.id} disabled={Boolean(u.disabled)} role={u.role} self={u.id === me.id} />
            </td>
          </tr>
        ))}
      </Table>
    </>
  );
}
