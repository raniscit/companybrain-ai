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

    // Get total number of pages
    const info = await parser.getInfo();

    const totalPages = info.total;


    let totalChunks = 0;
    let idx = 0;

    // Process PDF page by page
    for (let pageNumber = 1; pageNumber <= totalPages; pageNumber++) {

      // Extract only this page
      const result = await parser.getText({
        partial: [pageNumber],
      });

      const pageText = result.text.trim();


      // Skip empty pages
      if (!pageText) {
        continue;
      }

      // Create chunks for this page
      const textChunks = createChunks(pageText);


      // Create embedding for each chunk
      for (let i = 0; i < textChunks.length; i++) {
        const chunk = textChunks[i];

        const embedding = await generateEmbedding(chunk);

        await db.insert(chunks).values({
          documentId: document.id,
          content: chunk,
          pageNumber: pageNumber,
          chunkIndex: idx,
          embedding,
        });
        
        idx++;

        totalChunks++;
      }
    }

    await parser.destroy();

    return Response.json({
      success: true,
      documentId: document.id,
      filename: file.name,
      totalPages,
      numberOfChunks: totalChunks,
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