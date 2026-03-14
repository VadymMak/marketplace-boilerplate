"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart, CartItem as CartItemType } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import styles from "./CartItem.module.css";

export function CartItem({ item }: { item: CartItemType }) {
  const { removeItem, updateQuantity } = useCart();

  return (
    <div className={styles.item}>
      <div className={styles.image}>
        {item.image ? (
          <Image
            src={item.image}
            alt={item.title}
            fill
            sizes="80px"
            className={styles.img}
          />
        ) : (
          <div className={styles.placeholder}>
            <svg
              width="24"
              height="24"
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
      </div>

      <div className={styles.info}>
        <Link href={`/products/${item.slug}`} className={styles.title}>
          {item.title}
        </Link>
        <p className={styles.vendor}>{item.vendorName}</p>
        <p className={styles.price}>{formatPrice(item.price)}</p>
      </div>

      <div className={styles.controls}>
        <div className={styles.qty}>
          <button
            className={styles.qtyBtn}
            onClick={() => updateQuantity(item.id, item.quantity - 1)}
            aria-label="Decrease"
          >
            −
          </button>
          <span className={styles.qtyValue}>{item.quantity}</span>
          <button
            className={styles.qtyBtn}
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            aria-label="Increase"
          >
            +
          </button>
        </div>
        <p className={styles.subtotal}>
          {formatPrice(item.price * item.quantity)}
        </p>
        <button
          className={styles.remove}
          onClick={() => removeItem(item.id)}
          aria-label="Remove item"
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
