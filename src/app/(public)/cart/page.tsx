"use client";

import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/components/cart/CartItem";
import { CartSummary } from "@/components/cart/CartSummary";
import styles from "./cart.module.css";

export default function CartPage() {
  const { items } = useCart();

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Shopping Cart</h1>

        {items.length === 0 ? (
          <div className={styles.empty}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1"
            >
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <path d="M16 10a4 4 0 0 1-8 0" />
            </svg>
            <h2>Your cart is empty</h2>
            <p>Add some products to get started.</p>
            <a href="/products" className={styles.shopLink}>
              Browse Products →
            </a>
          </div>
        ) : (
          <div className={styles.layout}>
            <div className={styles.items}>
              {items.map((item) => (
                <CartItem key={item.id} item={item} />
              ))}
            </div>
            <CartSummary />
          </div>
        )}
      </div>
    </div>
  );
}
