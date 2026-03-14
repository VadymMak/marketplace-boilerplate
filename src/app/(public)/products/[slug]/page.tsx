import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/db";
import { Badge, statusVariant } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import type { Metadata } from "next";
import styles from "./product.module.css";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug },
    include: { vendor: { select: { name: true } } },
  });
  if (!product) return { title: "Product not found" };

  return {
    title: product.title,
    description: product.description.slice(0, 160),
    openGraph: {
      title: product.title,
      description: product.description.slice(0, 160),
      images: product.images[0] ? [product.images[0]] : [],
    },
  };
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params;
  const product = await prisma.product.findUnique({
    where: { slug, status: "ACTIVE" },
    include: {
      category: { select: { name: true, slug: true } },
      vendor: { select: { name: true } },
    },
  });

  if (!product) notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images[0] || "",
    offers: {
      "@type": "Offer",
      price: product.price,
      priceCurrency: "EUR",
      availability: "https://schema.org/InStock",
      seller: { "@type": "Person", name: product.vendor.name },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />

      <div className={styles.page}>
        <div className={styles.container}>
          <div className={styles.grid}>
            {/* Image */}
            <div className={styles.imageWrap}>
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.title}
                  fill
                  priority
                  className={styles.image}
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              ) : (
                <div className={styles.placeholder}>
                  <svg
                    width="64"
                    height="64"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <path d="M21 15l-5-5L5 21" />
                  </svg>
                </div>
              )}
            </div>

            {/* Info */}
            <div className={styles.info}>
              <div className={styles.meta}>
                <span className={styles.category}>{product.category.name}</span>
                <Badge variant={statusVariant(product.status)}>
                  {product.status}
                </Badge>
              </div>

              <h1 className={styles.title}>{product.title}</h1>
              <p className={styles.price}>{formatPrice(product.price)}</p>
              <p className={styles.vendor}>by {product.vendor.name}</p>

              <hr className={styles.divider} />

              <p className={styles.description}>{product.description}</p>

              <button className={styles.addToCart}>Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
