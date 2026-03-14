import { prisma } from "@/lib/db";
import { UserRoleSelect } from "./UserRoleSelect";
import styles from "../admin.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Users" };

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      createdAt: true,
      _count: { select: { products: true, orders: true } },
    },
  });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Users</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: "-16px" }}>
        {users.length} total users
      </p>

      <div className={styles.table}>
        <div className={styles.usersHead}>
          <span>User</span>
          <span>Products</span>
          <span>Orders</span>
          <span>Role</span>
        </div>
        {users.map((u) => (
          <div key={u.id} className={styles.usersRow}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{u.name || "No name"}</span>
              <span className={styles.email}>{u.email}</span>
            </div>
            <span>{u._count.products}</span>
            <span>{u._count.orders}</span>
            <UserRoleSelect userId={u.id} currentRole={u.role} />
          </div>
        ))}
      </div>
    </div>
  );
}
