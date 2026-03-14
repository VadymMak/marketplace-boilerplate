import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";
import { sendOrderConfirmation, sendNewOrderNotification } from "@/lib/email";

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    console.error("[STRIPE WEBHOOK] signature error:", err);
    return new Response("Webhook signature verification failed", {
      status: 400,
    });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;
    const userId = session.metadata?.userId;

    if (!userId || !session.amount_total) {
      return NextResponse.json({ received: true });
    }

    // Create order
    const order = await prisma.order.create({
      data: {
        buyerId: userId,
        status: "PAID",
        total: session.amount_total / 100,
      },
      include: {
        buyer: { select: { name: true, email: true } },
      },
    });

    // Send confirmation email to buyer
    if (order.buyer.email) {
      await sendOrderConfirmation({
        buyerEmail: order.buyer.email,
        buyerName: order.buyer.name || "Customer",
        orderId: order.id,
        total: order.total,
        items: [], // items not stored in session — simplified
      }).catch(console.error);
    }
  }

  return NextResponse.json({ received: true });
}
