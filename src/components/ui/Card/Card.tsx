import styles from "./Card.module.css";

type CardProps = {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  padding?: "sm" | "md" | "lg";
};

export function Card({
  children,
  className = "",
  hover = false,
  padding = "md",
}: CardProps) {
  return (
    <div
      className={`${styles.card} ${hover ? styles.hover : ""} ${styles[padding]} ${className}`}
    >
      {children}
    </div>
  );
}
