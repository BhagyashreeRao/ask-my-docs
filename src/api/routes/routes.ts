import express from 'express';
import { CohereClient } from 'cohere-ai';
import { apiController } from '../controller/apiController';
const router = express.Router();

router.get('/check-token', async (req, res) => {
    const token = process.env.COHERE_API_KEY;
    if (!token?.trim()) {
        return res.status(500).json({ valid: false, error: 'COHERE_API_KEY not set in .env' });
    }
    try {
        const cohere = new CohereClient({ token });
        await cohere.checkApiKey();
        res.json({ valid: true, message: 'Token is valid' });
    } catch (err: unknown) {
        const errMsg = err instanceof Error ? err.message : String(err);
        res.status(401).json({ valid: false, error: errMsg });
    }
});

router.post('/injestAndEmbed', (req, res) => {
    console.log('[routes] POST /injestAndEmbed - entering handler');
    apiController.injestAndEmbed(req, res);
});

router.post('/ask', (req, res) => {
    console.log('[routes] POST /ask - entering handler');
    apiController.askQuestion(req, res);
});

export default router;