import { db } from "@/db";
import { documents } from "@/db/schema";

export async function GET() {
  const result = await db.select().from(documents);

  return Response.json({
    success: true,
    documents: result,
  });
}

