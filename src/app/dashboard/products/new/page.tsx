import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/dashboard/ProductForm";
import styles from "./new.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Add Product" };

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Add Product</h1>
      <ProductForm categories={categories} />
    </div>
  );
}
