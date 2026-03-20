import { Request, Response } from 'express';
import { ingestDoc } from '../../ingestion/ingestDoc';
import { generateEmbeddings } from '../../generation/generateEmbeddings';
import { storeEmbeddings } from '../../vector-db/storeEmbeddings';
import { search } from '../../retrieval/search';
import { generateResponse } from '../../retrieval/searchResult';
import { rerankResults } from '../../reranking/rerank';

const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => (req: Request, res: Response) => {
    fn(req, res).catch((err) => {
        console.error('[ask] Error:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
        }
    });
};

export const apiController = {
    injestAndEmbed: asyncHandler(async (req: Request, res: Response) => {
        console.log('[injestAndEmbed] Request received');
        const { question } = req.body;
        if (!question?.trim()) {
            console.log('[injestAndEmbed] Validation failed: empty question');
            res.status(400).json({ error: 'Question is required' });
            return;
        }
        console.log('[injestAndEmbed] Starting ingestDoc...');
        await ingestDoc();
        await generateEmbeddings();
        await storeEmbeddings();
        //console.log('[ask] generateEmbeddings done. Sending response.');
        res.status(200).json({ message: 'Chunks and embeddings generated and stored in Weaviate successfully' });
    }),
    askQuestion: asyncHandler(async (req: Request, res: Response) => {
        console.log('[askQuestion] Request received');
        const { question } = req.body;
        if (!question?.trim()) {
            console.log('[askQuestion] Validation failed: empty question');
            res.status(400).json({ error: 'Question is required' });
            return;
        }
        const searchResponse = await search(question);
        const objects = searchResponse.objects ?? [];
        const chunks = objects.map((o) => (o.properties as { text: string }).text);
        const rerankResultsList = await rerankResults(question, chunks);
        const rerankedChunks = rerankResultsList.join('\n');
        const response = await generateResponse(rerankedChunks, question);
        res.status(200).json({ response });
    }),
};