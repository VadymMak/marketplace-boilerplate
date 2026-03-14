import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

export async function POST(req: Request) {
  const body = await req.text(); // ⚠️ raw body — never use req.json()
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

    if (userId && session.amount_total) {
      await prisma.order.create({
        data: {
          buyerId: userId,
          status: "PAID",
          total: session.amount_total / 100,
        },
      });
    }
  }

  return NextResponse.json({ received: true });
}
