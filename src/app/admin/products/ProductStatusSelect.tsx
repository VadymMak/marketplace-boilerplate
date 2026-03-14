"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "../users/users.module.css";

type Props = {
  productId: string;
  currentStatus: string;
};

export function ProductStatusSelect({ productId, currentStatus }: Props) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [loading, setLoading] = useState(false);

  async function handleChange(newStatus: string) {
    setLoading(true);
    setStatus(newStatus);

    await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });

    setLoading(false);
    router.refresh();
  }

  return (
    <select
      className={styles.roleSelect}
      value={status}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="ACTIVE">ACTIVE</option>
      <option value="DRAFT">DRAFT</option>
      <option value="BANNED">BANNED</option>
    </select>
  );
}
