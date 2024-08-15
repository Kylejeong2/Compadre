import { db } from "@/lib/db"
import { $compadres } from "@/lib/db/schema"
import { eq } from "drizzle-orm"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
    const {compadreId} = await req.json()
    await db.delete($compadres).where(
        eq($compadres.id, compadreId)
    )
    return new NextResponse('ok', {status:200})
}