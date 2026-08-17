import { generateEmbedding } from "@/lib/embedding";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { vectorToSql } from "@/lib/vector";
import { generateAnswer } from "@/lib/gemini";

export async function POST(request: Request) {
    try {
        const body = await request.json();

        const query = body.query;

        if (!query || typeof query !== "string") {
            return Response.json(
                { error: "Query is required" },
                { status: 400 }
            );
        }


        const queryEmbedding = await generateEmbedding(query);

        const vector = vectorToSql(queryEmbedding);
        const results = await db.execute(sql`
                SELECT
                    id,
                    content,
                    "document_id",
                    "page_number",
                    1 - (embedding <=> ${vector}::vector) AS similarity
                FROM chunks
                ORDER BY embedding <=> ${vector}::vector
                LIMIT 5
                `);


        const context = results.rows
            .map((row, index) => {
                return `
        Source ${index + 1}:

        ${row.content}
        `;
            })
            .join("\n");

        const answer = await generateAnswer(
            query,
            context
        );

        return Response.json({
            success: true,
            query,
            answer,
            sources: results.rows,
        });
    } catch (error) {
        console.error(error);

        return Response.json(
            { error: "Query failed" },
            { status: 500 }
        );
    }
}