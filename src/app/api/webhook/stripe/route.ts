import { stripe } from "@/configs/stripe";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { clerk } from "@/configs/clerk-server";

const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(request: NextRequest) {
  const buf = await request.text();
  const sig = request.headers.get("stripe-signature");

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(buf, sig!, endpointSecret);
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : "Unknown error";
    console.log(`❌ Error message: ${errorMessage}`);
    return NextResponse.json(
      { error: { message: `Webhook Error: ${errorMessage}` } },
      { status: 400 }
    );
  }

  console.log("✅ Success:", event.id);

  try {
    const subscription = event.data.object as Stripe.Subscription;
    const subscriptionId = subscription.id;
    const customerEmail = subscription.metadata.payingUserEmail;

    const user = await clerk.users.getUserList({ emailAddress: [customerEmail] });

    if (user.totalCount === 0) {
      throw new Error("User not found");
    }

    const userId = user.data[0].id;

    switch (event.type) {
      case "customer.subscription.created":
      case "invoice.payment_succeeded":
        await clerk.users.updateUser(userId, {
          privateMetadata: {
            stripeSubscriptionId: subscriptionId,
            stripeCustomerId: subscription.customer as string,
            stripePriceId: subscription.items.data[0].price.id,
            stripeCurrentPeriodEnd: new Date(subscription.current_period_end * 1000).toISOString(),
          },
        });
        break;
      case "customer.subscription.deleted":
        await clerk.users.updateUser(userId, {
          privateMetadata: {
            stripeSubscriptionId: null,
            stripePriceId: null,
            stripeCurrentPeriodEnd: null,
          },
        });
        break;
      default:
        console.warn(`🤷‍♀️ Unhandled event type: ${event.type}`);
        break;
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json(
      { error: { message: "Internal Server Error" } },
      { status: 500 }
    );
  }
}