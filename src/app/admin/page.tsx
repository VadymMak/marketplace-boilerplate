import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import styles from "./admin.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin" };

export default async function AdminPage() {
  const [usersCount, productsCount, ordersCount, revenue] = await Promise.all([
    prisma.user.count(),
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.aggregate({
      where: { status: { in: ["PAID", "COMPLETED"] } },
      _sum: { total: true },
    }),
  ]);

  const stats = [
    { label: "Total Users", value: usersCount },
    { label: "Total Products", value: productsCount },
    { label: "Total Orders", value: ordersCount },
    { label: "Total Revenue", value: formatPrice(revenue._sum.total || 0) },
  ];

  const recentUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Admin Panel</h1>

      <div className={styles.stats}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <p className={styles.statLabel}>{s.label}</p>
            <p className={styles.statValue}>{s.value}</p>
          </div>
        ))}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Recent Users</h2>
          <a href="/admin/users" className={styles.link}>
            View all →
          </a>
        </div>
        <div className={styles.table}>
          <div className={styles.tableHead}>
            <span>Name</span>
            <span>Email</span>
            <span>Role</span>
          </div>
          {recentUsers.map((u) => (
            <div key={u.id} className={styles.tableRow}>
              <span>{u.name || "—"}</span>
              <span className={styles.email}>{u.email}</span>
              <span
                className={`${styles.role} ${styles[u.role.toLowerCase()]}`}
              >
                {u.role}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
