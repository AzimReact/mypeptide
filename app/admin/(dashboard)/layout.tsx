import { redirect } from "next/navigation";
import { getAdminSession } from "@/lib/auth";
import { AdminShell } from "@/components/admin/admin-shell";

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return <AdminShell adminName={session.name}>{children}</AdminShell>;
}
