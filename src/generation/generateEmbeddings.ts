// generate embeddings for the chunks
import { CohereClient } from 'cohere-ai';
import fs from 'fs';
import path from 'path';


function randomEmbedding(): number[] {
    return Array.from({ length: 1024 }, () => Math.random() * 2 - 1);
}

export const generateEmbeddings = async () => {
    console.log('[embed] Starting generateEmbeddings');
    const cohere = new CohereClient({
        token: process.env.COHERE_API_KEY
    });
    const chunkFilePath = path.join(__dirname, '../data/chunks.json');
    console.log('[embed] Loading chunks from', chunkFilePath);
    const chunks = JSON.parse(fs.readFileSync(chunkFilePath, 'utf-8'));
    const texts = chunks.map((chunk: { text: string }) => chunk.text);

    const BATCH_SIZE = 96;
    const coherePromises = [];
    for (let i = 0; i < texts.length; i += BATCH_SIZE) {
        const batch = texts.slice(i, i + BATCH_SIZE);
        coherePromises.push(cohere.embed({
            model: "embed-english-v3.0",
            texts: batch,
            inputType: "search_document"
        }));    
    }
    try {
        const responses = await Promise.all(coherePromises);
        const allEmbeddings = responses.flatMap((response) => response.embeddings as number[][]);

        const chunksWithEmbeddings = chunks.map((chunk: { id: number; text: string; source: string }, i: number) => ({
            ...chunk,
            embedding: allEmbeddings[i],
        }));

        const outputPath = path.join(__dirname, '../data/chunks-with-embeddings.json');
        fs.mkdirSync(path.dirname(outputPath), { recursive: true });
        fs.writeFileSync(outputPath, JSON.stringify(chunksWithEmbeddings, null, 2));
        console.log('[embed] Saved to', outputPath, '- generateEmbeddings complete');

    } catch (error) {
        console.error("Embedding error:", error);
    }
};