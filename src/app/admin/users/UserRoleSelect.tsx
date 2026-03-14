"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./users.module.css";

type Props = {
  userId: string;
  currentRole: string;
};

export function UserRoleSelect({ userId, currentRole }: Props) {
  const router = useRouter();
  const [role, setRole] = useState(currentRole);
  const [loading, setLoading] = useState(false);

  async function handleChange(newRole: string) {
    setLoading(true);
    setRole(newRole);

    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });

    setLoading(false);
    router.refresh();
  }

  return (
    <select
      className={styles.roleSelect}
      value={role}
      disabled={loading}
      onChange={(e) => handleChange(e.target.value)}
    >
      <option value="BUYER">BUYER</option>
      <option value="VENDOR">VENDOR</option>
      <option value="ADMIN">ADMIN</option>
    </select>
  );
}
