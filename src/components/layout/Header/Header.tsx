import Link from "next/link";
import { auth } from "@/lib/auth";
import { ThemeToggle } from "@/components/ui";
import { HeaderNav } from "./HeaderNav";
import styles from "./Header.module.css";

export async function Header() {
  const session = await auth();

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect width="24" height="24" rx="6" fill="var(--accent)" />
            <path
              d="M7 8h10M7 12h7M7 16h10"
              stroke="#fff"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
          <span>Marketplace</span>
        </Link>

        <nav className={styles.nav}>
          <Link href="/products" className={styles.navLink}>
            Products
          </Link>
          <Link href="/cart" className={styles.navLink}>
            Cart
          </Link>
        </nav>

        <div className={styles.actions}>
          <ThemeToggle />
          <HeaderNav session={session} />
        </div>
      </div>
    </header>
  );
}
