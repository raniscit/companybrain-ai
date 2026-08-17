import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(
    process.env.GOOGLE_GEMINI_KEY!
);

const model = genAI.getGenerativeModel({
  model: "gemini-3.6-flash",
});

export async function generateAnswer(
    query: string,
    context: string
) {
    const prompt = `
You are a company knowledge assistant.

Answer the user's question using ONLY the provided context.

If the answer cannot be found in the context, say:
"I could not find this information in the provided documents."

Do not make up information.

User Question:
${query}

Context:
${context}
`;

    const result = await model.generateContent(prompt);

    return result.response.text();
}