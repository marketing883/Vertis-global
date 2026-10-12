import { redirect } from "next/navigation";
import { Logo } from "@/components/brand/Logo";
import { LoginForm } from "@/components/admin/LoginForm";
import { currentUser } from "@/lib/admin/auth";

export const metadata = { title: "Sign in" };

type Search = Promise<{ next?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: Search }) {
  const { next } = await searchParams;
  const safeNext = next && /^\/admin(\/|$)/.test(next) && !next.startsWith("//") ? next : "/admin";
  if (await currentUser()) redirect(safeNext);

  return (
    <div className="grid min-h-screen place-items-center bg-ink px-4 py-16">
      <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-xl sm:p-10">
        <Logo variant="dark" className="h-8 w-auto" />
        <h1 className="mt-8 font-display text-2xl font-bold text-ink">Admin sign in</h1>
        <p className="mt-2 text-sm text-n-500">For Vertis Global staff. Ask an administrator for an account.</p>
        <LoginForm next={safeNext} />
      </div>
    </div>
  );
}
