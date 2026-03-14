import Link from "next/link";
import styles from "./Footer.module.css";

export function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            Marketplace
          </Link>
          <p>A modern marketplace built with Next.js</p>
        </div>

        <div className={styles.links}>
          <div className={styles.col}>
            <h4>Shop</h4>
            <Link href="/products">All Products</Link>
            <Link href="/cart">Cart</Link>
          </div>
          <div className={styles.col}>
            <h4>Account</h4>
            <Link href="/account">My Orders</Link>
            <Link href="/auth/login">Sign In</Link>
            <Link href="/auth/register">Register</Link>
          </div>
          <div className={styles.col}>
            <h4>Sell</h4>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/auth/register">Become a Vendor</Link>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <p>© {new Date().getFullYear()} Marketplace. All rights reserved.</p>
      </div>
    </footer>
  );
}
