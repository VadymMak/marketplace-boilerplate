import { Suspense } from "react";
import { prisma } from "@/lib/db";
import { ProductGrid } from "@/components/catalog/ProductGrid";
import { FilterPanel } from "@/components/catalog/FilterPanel";
import { SearchBar } from "@/components/catalog/SearchBar";
import { Pagination } from "@/components/ui";
import styles from "./products.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Products",
  description: "Browse all products in our marketplace",
};

type PageProps = {
  searchParams: Promise<{
    page?: string;
    category?: string;
    search?: string;
    sort?: string;
    minPrice?: string;
    maxPrice?: string;
  }>;
};

const PER_PAGE = 12;

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const page = Number(params.page) || 1;
  const category = params.category || undefined;
  const search = params.search || undefined;
  const sort = params.sort || "newest";
  const minPrice = Number(params.minPrice) || undefined;
  const maxPrice = Number(params.maxPrice) || undefined;

  const where = {
    status: "ACTIVE" as const,
    ...(category && { category: { slug: category } }),
    ...(search && {
      title: { contains: search, mode: "insensitive" as const },
    }),
    ...(minPrice || maxPrice
      ? {
          price: {
            ...(minPrice && { gte: minPrice }),
            ...(maxPrice && { lte: maxPrice }),
          },
        }
      : {}),
  };

  const orderBy =
    sort === "price_asc"
      ? { price: "asc" as const }
      : sort === "price_desc"
        ? { price: "desc" as const }
        : { createdAt: "desc" as const };

  const [products, total, categories] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
      include: {
        category: { select: { name: true, slug: true } },
        vendor: { select: { name: true } },
      },
    }),
    prisma.product.count({ where }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.topBar}>
          <h1 className={styles.title}>Products</h1>
          <Suspense>
            <SearchBar />
          </Suspense>
        </div>

        <div className={styles.layout}>
          <Suspense>
            <FilterPanel categories={categories} />
          </Suspense>

          <div className={styles.main}>
            <p className={styles.count}>
              {total} product{total !== 1 ? "s" : ""} found
            </p>
            <ProductGrid products={products} />
            <div className={styles.pagination}>
              <Suspense>
                <Pagination
                  page={page}
                  total={total}
                  perPage={PER_PAGE}
                  onPageChange={() => {}}
                />
              </Suspense>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
