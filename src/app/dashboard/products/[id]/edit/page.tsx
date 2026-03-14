import { notFound } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { ProductForm } from "@/components/dashboard/ProductForm";
import styles from "./edit.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "Edit Product" };

type PageProps = { params: Promise<{ id: string }> };

export default async function EditProductPage({ params }: PageProps) {
  const { id } = await params;
  const session = await auth();
  if (!session) return null;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { id, vendorId: session.user.id },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Edit Product</h1>
      <ProductForm categories={categories} initial={product} />
    </div>
  );
}
