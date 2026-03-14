import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { Sidebar } from "@/components/layout/Sidebar";
import styles from "./dashboard.module.css";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session) redirect("/auth/login");
  if (session.user.role !== "VENDOR" && session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className={styles.layout}>
      <Sidebar role={session.user.role as "VENDOR" | "ADMIN"} />
      <main className={styles.main}>{children}</main>
    </div>
  );
}
