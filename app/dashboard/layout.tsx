import Sidebar from "@/app/ui/dashboard/sidebar";
import { auth } from "@/app/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { neon } from "@neondatabase/serverless";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is missing");
}

const sql = neon(databaseUrl);

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/login");
  }

  const profiles = await sql`
    SELECT name, role
    FROM users
    WHERE auth_user_id = ${session.user.id}
    LIMIT 1
  `;

  const profile = profiles[0];

  const role: "teacher" | "student" | null =
  profile?.role === "teacher" || profile?.role === "student"
    ? profile.role
    : null;

  const name =
    profile?.name?.trim() ||
    session.user.name?.trim() ||
    "User";

  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <Sidebar name={name} role={role} />

      <main className="h-full min-w-0 flex-1 overflow-hidden px-5 pb-6 pt-8 sm:px-8 sm:pt-10 lg:px-12 lg:pb-10 lg:pt-14">
        {children}
      </main>
    </div>
  );
}