import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Badge, statusVariant } from "@/components/ui";
import { formatPrice } from "@/lib/utils";
import { redirect } from "next/navigation";
import styles from "./account.module.css";
import type { Metadata } from "next";

export const metadata: Metadata = { title: "My Account" };

export default async function AccountPage() {
  const session = await auth();
  if (!session) redirect("/auth/login");

  const orders = await prisma.order.findMany({
    where: { buyerId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: {
          product: { select: { title: true, slug: true, images: true } },
        },
      },
    },
  });

  return (
    <div className={styles.page}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div>
            <h1 className={styles.title}>My Account</h1>
            <p className={styles.email}>{session.user.email}</p>
          </div>
          <span className={styles.role}>{session.user.role}</span>
        </div>

        <div className={styles.section}>
          <h2 className={styles.sectionTitle}>Order History</h2>

          {orders.length === 0 ? (
            <div className={styles.empty}>
              <svg
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p>No orders yet.</p>
              <a href="/products">Start shopping →</a>
            </div>
          ) : (
            <div className={styles.orders}>
              {orders.map((order) => (
                <div key={order.id} className={styles.order}>
                  <div className={styles.orderHeader}>
                    <div>
                      <p className={styles.orderId}>
                        Order #{order.id.slice(-8).toUpperCase()}
                      </p>
                      <p className={styles.orderDate}>
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div className={styles.orderMeta}>
                      <Badge variant={statusVariant(order.status)}>
                        {order.status}
                      </Badge>
                      <span className={styles.orderTotal}>
                        {formatPrice(order.total)}
                      </span>
                    </div>
                  </div>

                  <div className={styles.orderItems}>
                    {order.items.map((item) => (
                      <div key={item.id} className={styles.orderItem}>
                        <a
                          href={`/products/${item.product.slug}`}
                          className={styles.itemTitle}
                        >
                          {item.product.title}
                        </a>
                        <span className={styles.itemQty}>
                          × {item.quantity}
                        </span>
                        <span className={styles.itemPrice}>
                          {formatPrice(item.price)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
