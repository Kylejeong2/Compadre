import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { StatusCodes } from "http-status-codes";
import { stripe } from "@/configs/stripe";
import connectDB from "@/configs/dbConfig/dbConfig";
import Users from "@/models/user";

connectDB();

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

    const foundUser = await Users.findOne({ clerkId: userId });

    const sessions = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: planId,
          quantity: 1,
        },
      ],
      payment_method_types: ["card"],
      billing_address_collection: "auto",
      customer_email: foundUser.email,
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/profile?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription`,
      subscription_data: {
        metadata: {
          payingUserEmail: foundUser.email,
        },
        trial_period_days: 14,
      },
    });

    if (!sessions.url)
      return NextResponse.json(
        { error: "Could not create checkout session" },
        { status: StatusCodes.INTERNAL_SERVER_ERROR }
      );

    return NextResponse.json({ session: sessions }, { status: StatusCodes.OK });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: StatusCodes.INTERNAL_SERVER_ERROR }
    );
  }
}