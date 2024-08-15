import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { StatusCodes } from "http-status-codes";
import { stripe } from "@/configs/stripe";
import { getAuthSession } from "@/lib/auth";
import { clerk } from "@/configs/clerk-server";

export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json();

    const session = await getAuthSession();

    console.log("session from server", session);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Please login first" },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const foundUser = await clerk.users.getUser(session.user.id);

    if (!foundUser) {
      return NextResponse.json(
        { error: "User not found" },
        { status: StatusCodes.NOT_FOUND }
      );
    }

    const subscriptionId = foundUser.privateMetadata.stripe_subscription_id;

    if (typeof subscriptionId !== 'string') {
      throw new Error('Invalid subscription ID');
    }

    const sessions = await stripe.subscriptions.update(subscriptionId, {
      cancel_at_period_end: true,
      metadata: {
        payingUserEmail: session.user.email,
      },
    });

    return NextResponse.json({ session: sessions }, { status: StatusCodes.OK });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}