import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { stripe } from "@/configs/stripe";
import { clerk } from "@/configs/clerk-server";

export async function POST(request: NextRequest) {
  try {
    const { planId } = await request.json();
    const { userId } = auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Please login first" },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const user = await clerk.users.getUser(userId);

    if (!user.emailAddresses || user.emailAddresses.length === 0) {
      return NextResponse.json(
        { error: "User does not have a valid email address" },
        { status: StatusCodes.BAD_REQUEST }
      );
    }

    const emailAddress = user.emailAddresses[0].emailAddress;

    const sessions = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: planId,
          quantity: 1,
        },
      ],
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      customer_email: emailAddress,
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription`,
      subscription_data: {
        metadata: {
          payingUserEmail: emailAddress,
        },
        trial_period_days: 14,
      },
    });

    if (!sessions.url) {
      return NextResponse.json(
        { error: "Could not create checkout session" },
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
      );
    }

    return NextResponse.json({ session: sessions }, { status: StatusCodes.OK });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}