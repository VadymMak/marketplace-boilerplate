import Link from "next/link";
import Image from "next/image";
import { Badge, statusVariant } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import styles from "./ProductCard.module.css";

type ProductCardProps = {
  product: {
    id: string;
    title: string;
    slug: string;
    price: number;
    images: string[];
    status: string;
    category: { name: string; slug: string };
    vendor: { name: string | null };
  };
  index?: number;
};

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const image = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className={styles.card}
      style={{ "--i": index } as React.CSSProperties}
    >
      <div className={styles.imageWrap}>
        {image ? (
          <Image
            src={image}
            alt={product.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className={styles.image}
          />
        ) : (
          <div className={styles.placeholder}>
            <svg
              width="40"
              height="40"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="M21 15l-5-5L5 21" />
            </svg>
          </div>
        )}
        <div className={styles.badge}>
          <Badge variant={statusVariant(product.status)}>
            {product.status}
          </Badge>
        </div>
      </div>

      <div className={styles.body}>
        <p className={styles.category}>{product.category.name}</p>
        <h3 className={styles.title}>{product.title}</h3>
        <div className={styles.footer}>
          <span className={styles.price}>{formatPrice(product.price)}</span>
          <span className={styles.vendor}>{product.vendor.name}</span>
        </div>
      </div>
    </Link>
  );
}
