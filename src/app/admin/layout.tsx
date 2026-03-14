import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import styles from "../dashboard/dashboard.module.css";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/auth/login");
  if (session.user.role !== "ADMIN") redirect("/");

  return (
    <div className={styles.layout}>
      <Sidebar role="ADMIN" />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
