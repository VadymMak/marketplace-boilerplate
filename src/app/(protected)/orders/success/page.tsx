import Link from "next/link";
import styles from "./success.module.css";

export default function OrderSuccessPage() {
  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="var(--success)"
            strokeWidth="1.5"
          >
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        </div>
        <h1>Order Confirmed!</h1>
        <p>
          Thank you for your purchase. You will receive a confirmation email
          shortly.
        </p>
        <div className={styles.actions}>
          <Link href="/account" className={styles.primary}>
            View My Orders
          </Link>
          <Link href="/products" className={styles.secondary}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
