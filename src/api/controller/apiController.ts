import { Request, Response } from 'express';
import { ingestDoc } from '../../ingestion/ingestDoc';
import { generateEmbeddings } from '../../generation/generateEmbeddings';
import { storeEmbeddings } from '../../vector-db/storeEmbeddings';

const asyncHandler = (fn: (req: Request, res: Response) => Promise<void>) => (req: Request, res: Response) => {
    fn(req, res).catch((err) => {
        console.error('[ask] Error:', err);
        if (!res.headersSent) {
            res.status(500).json({ error: err instanceof Error ? err.message : 'Internal server error' });
        }
    });
};

export const apiController = {
    askQuestion: asyncHandler(async (req: Request, res: Response) => {
        console.log('[ask] Request received');
        const { question } = req.body;
        if (!question?.trim()) {
            console.log('[ask] Validation failed: empty question');
            res.status(400).json({ error: 'Question is required' });
            return;
        }
        console.log('[ask] Starting ingestDoc...');
        await ingestDoc();
        await generateEmbeddings();
        await storeEmbeddings();
        //console.log('[ask] generateEmbeddings done. Sending response.');
        res.status(200).json({ message: 'Chunks and embeddings generated and stored in Weaviate successfully' });
    }),
};