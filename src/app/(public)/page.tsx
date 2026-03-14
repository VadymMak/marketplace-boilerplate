import Link from "next/link";
import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { Button } from "@/components/ui";
import styles from "./home.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home",
  description: "Discover unique products from independent vendors.",
};

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: {
        category: { select: { name: true, slug: true } },
        vendor: { select: { name: true } },
      },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className={styles.page}>
      {/* Hero */}
      <section className={styles.hero}>
        <div className={styles.heroInner}>
          <h1 className={styles.heroTitle}>
            Discover unique products
            <br />
            from independent vendors
          </h1>
          <p className={styles.heroSub}>
            Browse thousands of handmade, vintage and creative items.
          </p>
          <div className={styles.heroActions}>
            <Link href="/products">
              <Button size="lg">Browse Products</Button>
            </Link>
            <Link href="/auth/register">
              <Button variant="secondary" size="lg">
                Start Selling
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className={styles.section}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Shop by Category</h2>
          <div className={styles.categories}>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/products?category=${cat.slug}`}
                className={styles.catCard}
              >
                {cat.name}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className={styles.section}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2 className={styles.sectionTitle}>Featured Products</h2>
            <Link href="/products" className={styles.seeAll}>
              See all →
            </Link>
          </div>
          <ProductGrid products={featuredProducts} />
        </div>
      </section>
    </div>
  );
}
