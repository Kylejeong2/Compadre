import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { $compadres } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import useSubscriptions from "@/hooks/useSubscriptions";

export async function GET() {
    const { userId } = auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const subscriptionPlan = await useSubscriptions();
    const compadres = await db.select().from($compadres).where(eq($compadres.userId, userId));

    return NextResponse.json({
        isSubscribed: subscriptionPlan.isSubscribed,
        compadreCount: compadres.length
    });
}