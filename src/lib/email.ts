import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = process.env.FROM_EMAIL || "noreply@marketplace.com";
const OWNER = process.env.OWNER_EMAIL || "";
const SITE = process.env.NEXT_PUBLIC_SITE_NAME || "Marketplace";
const BASE = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";

// ── Order confirmation to buyer ──────────────────────────────────────────────
export async function sendOrderConfirmation({
  buyerEmail,
  buyerName,
  orderId,
  total,
  items,
}: {
  buyerEmail: string;
  buyerName: string;
  orderId: string;
  total: number;
  items: { title: string; quantity: number; price: number }[];
}) {
  const itemRows = items
    .map(
      (i) => `<tr>
      <td style="padding:8px 0;border-bottom:1px solid #333">${i.title}</td>
      <td style="padding:8px 0;border-bottom:1px solid #333;text-align:center">×${i.quantity}</td>
      <td style="padding:8px 0;border-bottom:1px solid #333;text-align:right">€${(i.price * i.quantity).toFixed(2)}</td>
    </tr>`,
    )
    .join("");

  await resend.emails.send({
    from: FROM,
    to: buyerEmail,
    subject: `Order confirmed — ${SITE}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#f0ebe1;background:#0c0c0e;padding:32px;border-radius:12px">
        <h1 style="color:#3b82f6;margin:0 0 8px">Order Confirmed!</h1>
        <p style="color:#a0998e">Hi ${buyerName}, thank you for your purchase.</p>

        <table style="width:100%;margin:24px 0;border-collapse:collapse">
          <thead>
            <tr style="color:#a0998e;font-size:12px;text-transform:uppercase">
              <th style="text-align:left;padding-bottom:8px">Product</th>
              <th style="text-align:center;padding-bottom:8px">Qty</th>
              <th style="text-align:right;padding-bottom:8px">Price</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
        </table>

        <div style="text-align:right;font-size:18px;font-weight:700;margin-bottom:24px">
          Total: €${total.toFixed(2)}
        </div>

        <a href="${BASE}/account"
           style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          View My Orders
        </a>
      </div>
    `,
  });
}

// ── New order notification to vendor ────────────────────────────────────────
export async function sendNewOrderNotification({
  vendorEmail,
  vendorName,
  orderId,
  buyerName,
  total,
  items,
}: {
  vendorEmail: string;
  vendorName: string;
  orderId: string;
  buyerName: string;
  total: number;
  items: { title: string; quantity: number; price: number }[];
}) {
  const itemList = items
    .map(
      (i) =>
        `• ${i.title} × ${i.quantity} — €${(i.price * i.quantity).toFixed(2)}`,
    )
    .join("<br>");

  await resend.emails.send({
    from: FROM,
    to: vendorEmail,
    subject: `New order received — ${SITE}`,
    html: `
      <div style="font-family:sans-serif;max-width:560px;margin:0 auto;color:#f0ebe1;background:#0c0c0e;padding:32px;border-radius:12px">
        <h1 style="color:#3b82f6;margin:0 0 8px">New Order!</h1>
        <p style="color:#a0998e">Hi ${vendorName}, you have a new order from <strong>${buyerName}</strong>.</p>

        <div style="background:#1a1a1e;border-radius:8px;padding:16px;margin:24px 0;line-height:2">
          ${itemList}
        </div>

        <div style="font-size:18px;font-weight:700;margin-bottom:24px">
          Total: €${total.toFixed(2)}
        </div>

        <a href="${BASE}/dashboard"
           style="display:inline-block;background:#3b82f6;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          View Dashboard
        </a>
      </div>
    `,
  });
}
