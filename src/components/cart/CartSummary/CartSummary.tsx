"use client";

import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui";
import styles from "./CartSummary.module.css";

export function CartSummary() {
  const { total, count, items } = useCart();

  if (items.length === 0) return null;

  return (
    <div className={styles.summary}>
      <h2 className={styles.title}>Order Summary</h2>

      <div className={styles.rows}>
        <div className={styles.row}>
          <span>Items ({count()})</span>
          <span>{formatPrice(total())}</span>
        </div>
        <div className={styles.row}>
          <span>Shipping</span>
          <span className={styles.free}>Free</span>
        </div>
      </div>

      <div className={styles.divider} />

      <div className={`${styles.row} ${styles.total}`}>
        <span>Total</span>
        <span>{formatPrice(total())}</span>
      </div>

      <Link href="/checkout" className={styles.link}>
        <Button size="lg" className={styles.btn}>
          Proceed to Checkout
        </Button>
      </Link>

      <Link href="/products" className={styles.continue}>
        ← Continue Shopping
      </Link>
    </div>
  );
}
