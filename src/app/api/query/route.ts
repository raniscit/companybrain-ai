import { generateEmbedding } from "@/lib/embedding";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import { vectorToSql } from "@/lib/vector";
import { generateAnswer } from "@/lib/gemini";
import { getCurrentEmployee } from "@/lib/auth/get-current-user";
import { NextResponse } from "next/server";
import { DOCUMENT_ACCESS_RULES } from "@/lib/auth/authorize";

export async function POST(request: Request) {
    try {

        //authentication
        const user = await getCurrentEmployee();

        if (!user) {
            return NextResponse.json(
                {
                    error: "Unauthorized",
                },
                { status: 401 }
            );
        }


        const userAccessGroup =
            user.accessGroup?.toUpperCase();

        if (!userAccessGroup) {
            return NextResponse.json(
                {
                    error: "User access group not found",
                },
                { status: 403 }
            );
        }

        const allowedDocumentGroups =
            DOCUMENT_ACCESS_RULES[
            userAccessGroup as keyof typeof DOCUMENT_ACCESS_RULES
            ];

        if (!allowedDocumentGroups) {
            return NextResponse.json(
                {
                    error: "Invalid access group",
                },
                { status: 403 }
            );
        }


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
        chunks.id,
        chunks.content,
        chunks.document_id,
        chunks.page_number,
        chunks.chunk_index,

        documents.filename,
        documents.access_group,

        1 - (
          chunks.embedding <=> ${vector}::vector
        ) AS similarity

      FROM chunks

      INNER JOIN documents
        ON chunks.document_id = documents.id

      WHERE documents.access_group IN (
        ${sql.join(
            allowedDocumentGroups.map(
                (group) => sql`${group}`
            ),
            sql`, `
        )}
      )

      ORDER BY chunks.embedding <=> ${vector}::vector

      LIMIT 5
    `);

        if (results.rows.length === 0) {
            return NextResponse.json({
                success: true,
                query,
                answer:
                    "I couldn't find any relevant information in the documents you are authorized to access.",
                sources: [],
            });
        }


        const context = results.rows
            .map((row, index) => {
                return `
                    Source ${index + 1}
                    Document: ${row.filename}
                    Page: ${row.page_number ?? "Unknown"}

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