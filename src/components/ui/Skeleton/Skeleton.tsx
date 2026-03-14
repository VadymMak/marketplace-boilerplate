import styles from "./Skeleton.module.css";

type SkeletonProps = {
  width?: string;
  height?: string;
  borderRadius?: string;
  className?: string;
};

export function Skeleton({
  width = "100%",
  height = "16px",
  borderRadius,
  className = "",
}: SkeletonProps) {
  return (
    <span
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius }}
      aria-hidden="true"
    />
  );
}

export function SkeletonCard() {
  return (
    <div className={styles.card}>
      <Skeleton height="200px" borderRadius="8px 8px 0 0" />
      <div className={styles.body}>
        <Skeleton height="20px" width="70%" />
        <Skeleton height="14px" width="50%" />
        <Skeleton height="24px" width="40%" />
      </div>
    </div>
  );
}
