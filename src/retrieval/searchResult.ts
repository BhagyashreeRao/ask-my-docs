import { CohereClient } from 'cohere-ai';

export const generateResponse = async (context: string, question: string) => {
    const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
    const response = await cohere.chat({
        model: "command-r7b-12-2024",
        message: `
      Use ONLY the context below to answer the question.
      Do not add any additional details. Stick to what ti present in the context.
      If not found, say "I don't know".
      
      Context:
      ${context}
      
      Question:
      ${question}
      
      Answer:
      `,
        maxTokens: 300,
        temperature: 0.3
      });
    return response.text;
}