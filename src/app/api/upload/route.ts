export const runtime = "nodejs";

import { PDFParse } from "pdf-parse";
import { createChunks } from "../../../lib/chunks";
import { generateEmbedding } from "@/lib/embedding";
import { db } from "@/db";
import { documents, chunks } from "@/db/schema";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const file = formData.get("file") as File | null;

    if (!file) {
      return Response.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return Response.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    // Create document
    const [document] = await db
      .insert(documents)
      .values({
        filename: file.name,
      })
      .returning({
        id: documents.id,
      });

    // Read PDF
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const parser = new PDFParse({
      data: buffer,
    });

    const result = await parser.getText();

    await parser.destroy();

    const text = result.text;

    // Create chunks
    const textChunks = createChunks(text);

    console.log("Text length:", text.length);
    console.log("Number of chunks:", textChunks.length);
    console.log("Document ID:", document.id);

    // Generate embeddings and insert chunks
    for (const chunk of textChunks) {
      const embedding = await generateEmbedding(chunk);

      await db.insert(chunks).values({
        documentId: document.id,
        content: chunk,
        embedding,
      });
    }

    return Response.json({
      success: true,
      documentId: document.id,
      filename: file.name,
      textLength: text.length,
      numberOfChunks: textChunks.length,
    });
  } catch (error) {
    console.error("Upload error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process PDF",
      },
      { status: 500 }
    );
  }
}