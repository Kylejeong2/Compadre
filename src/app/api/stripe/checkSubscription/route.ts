import { clerk } from "@/configs/clerk-server";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await clerk.users.getUser(userId);
    
    // Check the user's metadata or make a call to your Stripe API to verify subscription
    const hasSubscription = user.publicMetadata.hasSubscription === true;

    return NextResponse.json({ hasSubscription });
  } catch (error) {
    console.error("Error checking subscription:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}