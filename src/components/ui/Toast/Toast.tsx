"use client";

import { useEffect, useState } from "react";
import styles from "./Toast.module.css";

type ToastType = "success" | "error" | "info";

type ToastProps = {
  message: string;
  type?: ToastType;
  duration?: number;
  onClose: () => void;
};

export function Toast({
  message,
  type = "info",
  duration = 3500,
  onClose,
}: ToastProps) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onClose, 300);
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const icons: Record<ToastType, string> = {
    success: "✓",
    error: "✕",
    info: "i",
  };

  return (
    <div
      className={`${styles.toast} ${styles[type]} ${!visible ? styles.hide : ""}`}
      role="alert"
    >
      <span className={styles.icon}>{icons[type]}</span>
      <span className={styles.message}>{message}</span>
      <button className={styles.close} onClick={onClose} aria-label="Close">
        ✕
      </button>
    </div>
  );
}

// Toast container — place in layout
export function ToastContainer({ children }: { children: React.ReactNode }) {
  return <div className={styles.container}>{children}</div>;
}
