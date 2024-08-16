import { db } from "@/lib/db";
import { $compadres } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import axios from "axios";

async function createDailyRoom(compadreName: string): Promise<string> {
  try {
    const response = await axios.post(
      "https://api.daily.co/v1/rooms",
      { name: `compadre-${compadreName}-${Date.now()}` },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DAILY_API_KEY}`,
        },
      }
    );
    return response.data.url;
  } catch (error) {
    console.error("Error creating Daily room:", error);
    throw new Error("Failed to create chatroom");
  }
}

export async function POST(req: Request) {
  const { userId } = auth();

  if (!userId) {
    return new NextResponse("unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { name, characteristics } = body;

  try {
    const roomUrl = await createDailyRoom(name);

    const compadre_ids = await db
      .insert($compadres)
      .values({
        name,
        userId,
        characteristics,
        roomUrl,
      })
      .returning({
        insertedId: $compadres.id,
      });

    return NextResponse.json({
      compadre_id: compadre_ids[0].insertedId,
      room_url: roomUrl,
    });
  } catch (error) {
    console.error("Error creating compadre and chatroom:", error);
    return new NextResponse("Failed to create compadre and chatroom", {
      status: 500,
    });
  }
}