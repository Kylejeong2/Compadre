import { db } from "@/lib/db";
import { $compadres } from "@/lib/db/schema";
// import { generateImage, generateImagePrompt } from "@/lib/openai";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const { userId } = auth();

    if (!userId) {
        return new NextResponse('unauthorized', {status: 401})
    }
    const body = await req.json()
    const { name } = body;
    // const image_description = await generateImagePrompt(name);

    // if(!image_description){
    //     return new NextResponse("Failed to generate image description",{
    //         status: 500,
    //     })
    // }

    // const image_url = await generateImage(image_description);

    // if (!image_url){
    //     return new NextResponse(
    //         "Failed to generate image", {
    //             status: 500,
    //         }
    //     );
    // }

    const compadre_ids = await db.insert($compadres).values({
        name,
        userId,
        // imageUrl: image_url,
    }).returning({
        insertedId: $compadres.id
    })

    return NextResponse.json({
        compadre_id: compadre_ids[0].insertedId,
    });
}