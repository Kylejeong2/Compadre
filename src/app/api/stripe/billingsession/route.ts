import { NextRequest, NextResponse } from "next/server";
import { StatusCodes } from "http-status-codes";
import { stripe } from "@/configs/stripe";
import { getAuthSession } from "@/lib/auth";
import { clerk } from "@/configs/clerk-server";

export async function GET(request: NextRequest) {
  try {
    // const { planId } = await request.json();

    const session = await getAuthSession();

    console.log("session from server", session);

    if (!session?.user) {
      return NextResponse.json(
        { error: "Please login first" },
        { status: StatusCodes.UNAUTHORIZED }
      );
    }

    const foundUser = await clerk.users.getUser(session.user.id);

    const stripeCustomerId = foundUser.privateMetadata.stripe_customer_id as string;

    const sessions = await stripe.billingPortal.sessions.create({
      customer: stripeCustomerId,
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/subscription`,
    });

    if (!sessions)
      return NextResponse.json(
        { error: "Could not create billing session" },
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