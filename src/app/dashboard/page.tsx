import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { formatPrice } from "@/lib/utils";
import { Badge, statusVariant } from "@/components/ui";
import styles from "./page.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const session = await auth();
  if (!session) return null;

  const [products, orders] = await Promise.all([
    prisma.product.findMany({
      where: { vendorId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { category: { select: { name: true } } },
    }),
    prisma.order.findMany({
      where: { items: { some: { product: { vendorId: session.user.id } } } },
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { buyer: { select: { name: true, email: true } } },
    }),
  ]);

  const totalRevenue = orders
    .filter((o) => o.status === "PAID" || o.status === "COMPLETED")
    .reduce((sum, o) => sum + o.total, 0);

  const stats = [
    { label: "Products", value: products.length },
    { label: "Orders", value: orders.length },
    { label: "Revenue", value: formatPrice(totalRevenue) },
  ];

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>
      <p className={styles.welcome}>Welcome back, {session.user.name}</p>

      {/* Stats */}
      <div className={styles.stats}>
        {stats.map((s) => (
          <div key={s.label} className={styles.statCard}>
            <p className={styles.statLabel}>{s.label}</p>
            <p className={styles.statValue}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Products */}
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>Recent Products</h2>
          <a href="/dashboard/products/new" className={styles.addLink}>
            + Add Product
          </a>
        </div>
        {products.length === 0 ? (
          <p className={styles.empty}>
            No products yet.{" "}
            <a href="/dashboard/products/new">Create your first one →</a>
          </p>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHead}>
              <span>Product</span>
              <span>Category</span>
              <span>Status</span>
            </div>
            {products.map((p) => (
              <div key={p.id} className={styles.tableRow}>
                <span className={styles.productName}>{p.title}</span>
                <span>{p.category.name}</span>
                <Badge variant={statusVariant(p.status)}>{p.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Orders */}
      <div className={styles.section}>
        <h2>Recent Orders</h2>
        {orders.length === 0 ? (
          <p className={styles.empty}>No orders yet.</p>
        ) : (
          <div className={styles.table}>
            <div className={styles.tableHead}>
              <span>Buyer</span>
              <span>Total</span>
              <span>Status</span>
            </div>
            {orders.map((o) => (
              <div key={o.id} className={styles.tableRow}>
                <span>{o.buyer.name || o.buyer.email}</span>
                <span>{formatPrice(o.total)}</span>
                <Badge variant={statusVariant(o.status)}>{o.status}</Badge>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
