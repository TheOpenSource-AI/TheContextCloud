import { NextResponse } from "next/server";
import { getContextPayload } from "@/lib/api/client";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;
        const payload = await getContextPayload(id);

        if (!payload) {
            return NextResponse.json(
                { error: "Entity not found or could not generate context." },
                { status: 404 }
            );
        }

        // Agent-optimized Response
        return NextResponse.json(payload, {
            headers: {
                'Cache-Control': 'no-store, max-age=0',
                'X-Context-Cloud-Version': '1.0.0-MVP',
                'X-Agent-Optimized': 'true'
            }
        });

    } catch (error) {
        console.error("Context Generation Failed:", error);
        return NextResponse.json(
            { error: "Internal Server Error during Context Generation" },
            { status: 500 }
        );
    }
}
