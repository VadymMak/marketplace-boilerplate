import { prisma } from "@/lib/db";
import { Badge, statusVariant } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { ProductStatusSelect } from "./ProductStatusSelect";
import styles from "../admin.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Admin — Products" };

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      category: { select: { name: true } },
      vendor: { select: { name: true, email: true } },
    },
  });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Products</h1>
      <p style={{ color: "var(--text-secondary)", marginTop: "-16px" }}>
        {products.length} total products
      </p>

      <div className={styles.table}>
        <div className={styles.productsHead}>
          <span>Product</span>
          <span>Vendor</span>
          <span>Price</span>
          <span>Status</span>
        </div>
        {products.map((p) => (
          <div key={p.id} className={styles.productsRow}>
            <div className={styles.userInfo}>
              <span className={styles.userName}>{p.title}</span>
              <span className={styles.email}>{p.category.name}</span>
            </div>
            <span className={styles.email}>
              {p.vendor.name || p.vendor.email}
            </span>
            <span>{formatPrice(p.price)}</span>
            <ProductStatusSelect productId={p.id} currentStatus={p.status} />
          </div>
        ))}
      </div>
    </div>
  );
}
