import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GEMINI_KEY,
});

export async function generateEmbedding(text: string) {
  const result = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  return result.embeddings?.[0]?.values ?? [];
}