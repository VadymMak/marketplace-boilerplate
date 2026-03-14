"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui";
import styles from "./Header.module.css";

type Session = {
  user: { name?: string | null; email?: string | null; role?: string };
} | null;

export function HeaderNav({ session }: { session: Session }) {
  if (!session) {
    return (
      <div className={styles.authLinks}>
        <Link href="/auth/login">
          <Button variant="ghost" size="sm">
            Sign in
          </Button>
        </Link>
        <Link href="/auth/register">
          <Button variant="primary" size="sm">
            Sign up
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.authLinks}>
      {session.user.role === "VENDOR" || session.user.role === "ADMIN" ? (
        <Link href="/dashboard">
          <Button variant="ghost" size="sm">
            Dashboard
          </Button>
        </Link>
      ) : null}
      {session.user.role === "ADMIN" ? (
        <Link href="/admin">
          <Button variant="ghost" size="sm">
            Admin
          </Button>
        </Link>
      ) : null}
      <Link href="/account">
        <Button variant="ghost" size="sm">
          Account
        </Button>
      </Link>
      <Button
        variant="secondary"
        size="sm"
        onClick={() => signOut({ callbackUrl: "/" })}
      >
        Sign out
      </Button>
    </div>
  );
}
