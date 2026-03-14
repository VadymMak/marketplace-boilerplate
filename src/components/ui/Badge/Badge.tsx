import styles from "./Badge.module.css";

type BadgeVariant = "default" | "success" | "warning" | "error" | "info";

type BadgeProps = {
  children: React.ReactNode;
  variant?: BadgeVariant;
};

export function Badge({ children, variant = "default" }: BadgeProps) {
  return (
    <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>
  );
}

// Helper: map order/product status to badge variant
export function statusVariant(status: string): BadgeVariant {
  const map: Record<string, BadgeVariant> = {
    ACTIVE: "success",
    PAID: "success",
    COMPLETED: "success",
    DRAFT: "default",
    PENDING: "warning",
    SHIPPED: "info",
    BANNED: "error",
    CANCELLED: "error",
  };
  return map[status] ?? "default";
}
