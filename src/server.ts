import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import routes from './api/routes/routes';

const app = express();


app.use(express.json({ limit: '10mb' }));


app.use('/api', routes);

process.on('unhandledRejection', (err) => {
    console.error('Unhandled rejection:', err);
});

process.on('uncaughtException', (err) => {
    console.error('Uncaught exception:', err);
});

const server = app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});
server.timeout = 600000; // 10 min - ingest + embeddings take several minutes
