import { ProductCard } from "@/components/catalog/ProductCard";
import { SkeletonCard } from "@/components/ui";
import styles from "./ProductGrid.module.css";

type Product = {
  id: string;
  title: string;
  slug: string;
  price: number;
  images: string[];
  status: string;
  category: { name: string; slug: string };
  vendor: { name: string | null };
};

type ProductGridProps = {
  products: Product[];
  loading?: boolean;
};

export function ProductGrid({ products, loading = false }: ProductGridProps) {
  if (loading) {
    return (
      <div className={styles.grid}>
        {Array.from({ length: 8 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className={styles.empty}>
        <svg
          width="48"
          height="48"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <h3>No products found</h3>
        <p>Try adjusting your filters or search query.</p>
      </div>
    );
  }

  return (
    <div className={styles.grid}>
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} index={i} />
      ))}
    </div>
  );
}
