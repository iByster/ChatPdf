// /api/create-chat

import { loadS3ToPinecone } from "@/lib/pinecone";
import { NextResponse } from "next/server";

export async function POST(req: Request, res: Response) {
    try {
        const body = await req.json();
        const { fileKey, fileName } = body;
        const pages = await loadS3ToPinecone(fileKey);
        console.log(pages);
        return NextResponse.json({})
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { error: 'internal server error' },
            { status: 500 },
        )
    }
}