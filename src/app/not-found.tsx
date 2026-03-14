import Link from "next/link";
import styles from "./not-found.module.css";

export default function NotFound() {
  return (
    <div className={styles.page}>
      <div className={styles.content}>
        <h1 className={styles.code}>404</h1>
        <h2 className={styles.title}>Page not found</h2>
        <p className={styles.desc}>
          The page you are looking for does not exist or has been moved.
        </p>
        <div className={styles.actions}>
          <Link href="/" className={styles.primary}>
            Go Home
          </Link>
          <Link href="/products" className={styles.secondary}>
            Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
}
