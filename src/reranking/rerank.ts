import { CohereClient } from 'cohere-ai';

export const rerankResults = async (question: string, chunks: string[]) => {
    const cohere = new CohereClient({ token: process.env.COHERE_API_KEY });
    const reranked = await cohere.rerank({
        model: "rerank-english-v3.0",
        query: question,
        documents: chunks,
        topN: 3
    });
    const rerankedChunks = reranked.results.map(
        (r) => chunks[r.index]
      );
    return rerankedChunks;
}