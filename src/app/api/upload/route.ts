export const runtime = "nodejs";

import { NextResponse } from "next/server";

import { getCurrentEmployee } from "@/lib/auth/get-current-user";
import { hasPermission, canAssignDocumentAccess } from "@/lib/auth/authorize";
import { PERMISSIONS } from "@/lib/auth/permissions";

import { PDFParse } from "pdf-parse";
import { createChunks } from "../../../lib/chunks";
import { generateEmbedding } from "@/lib/embedding";

import { db } from "@/db";
import { documents, chunks } from "@/db/schema";

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


    //authorisation
    const allowed = hasPermission(
      user.accessGroup,
      PERMISSIONS.UPLOAD_DOCUMENT
    );

    if (!allowed) {
      return NextResponse.json(
        {
          error: "You do not have permission to upload documents",
        },
        { status: 403 }
      );
    }



    const formData = await request.formData();

    const file = formData.get("file") as File | null;

    const requestedAccessGroup = formData.get("accessGroup");

    if (!file) {
      return Response.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    if (
      typeof requestedAccessGroup !== "string" ||
      !requestedAccessGroup
    ) {
      return NextResponse.json(
        {
          error: "Document access group is required",
        },
        {
          status: 400,
        }
      );
    }


    const documentAccessGroup = requestedAccessGroup.toUpperCase();

    // 7. CHECK WHETHER USER CAN ASSIGN THIS GROUP
    if (
      !canAssignDocumentAccess(
        user.accessGroup,
        documentAccessGroup
      )
    ) {
      return NextResponse.json(
        {
          error:
            `You are not authorized to create a ${documentAccessGroup} level document`,
        },
        {
          status: 403,
        }
      );
    }

    if (file.type !== "application/pdf") {
      return Response.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }


    const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          error: "File size must be less than 10 MB",
        },
        { status: 400 }
      );
    }


    // Create document
    const [document] = await db
      .insert(documents)
      .values({
        filename: file.name,
        accessGroup: documentAccessGroup,
        uploadedBy: user.id,
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

    return NextResponse.json(
      {
        success: true,
        message: "Document uploaded successfully",
        documentId: document.id,
        filename: file.name,
        accessGroup: documentAccessGroup,
        uploadedBy: user.id,
        totalPages: totalPages,
        numberOfChunks: totalChunks,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Document upload error:", error);

    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process document",
      },
      { status: 500 }
    );
  }
}