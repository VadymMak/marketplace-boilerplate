"use client";

import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui";
import styles from "./checkout.module.css";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleCheckout() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ items }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Checkout failed");
        return;
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (items.length === 0) {
    return (
      <div className={styles.empty}>
        <h1>Your cart is empty</h1>
        <a href="/products">Browse Products →</a>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <h1 className={styles.title}>Checkout</h1>

        <div className={styles.layout}>
          <div className={styles.items}>
            <h2 className={styles.subtitle}>Order Items</h2>
            {items.map((item) => (
              <div key={item.id} className={styles.item}>
                <span className={styles.itemName}>{item.title}</span>
                <span className={styles.itemQty}>× {item.quantity}</span>
                <span className={styles.itemPrice}>
                  {formatPrice(item.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className={styles.summary}>
            <h2 className={styles.subtitle}>Summary</h2>
            <div className={styles.totalRow}>
              <span>Total</span>
              <span className={styles.totalAmount}>{formatPrice(total())}</span>
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <Button
              size="lg"
              loading={loading}
              onClick={handleCheckout}
              style={{ width: "100%" }}
            >
              Pay with Stripe
            </Button>

            <p className={styles.note}>
              You will be redirected to Stripe secure payment page.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
