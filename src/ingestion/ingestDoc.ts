import { PDFParse } from 'pdf-parse';
import fs from 'fs';
import path from 'path';

// extract text from doc
async function extractText(filePath: string): Promise<string> {
    console.log('[ingest] Reading PDF file...');
    const buffer = fs.readFileSync(filePath);
    console.log('[ingest] Parsing PDF...');
    const parser = new PDFParse({ data: buffer });
    const result = await parser.getText();
    await parser.destroy();
    console.log('[ingest] PDF parsed, text length:', result.text.length);
    return result.text;
}
  

// divide doc into chunks of 500 with overlap of 100
export const divideDocIntoChunks = async (doc: string) => {
    const chunks = [];
    const chunkSize = 500;
    const overlap = 50;
    const step = chunkSize - overlap; // 400
    for (let i = 0; i < doc.length; i += step) {
        chunks.push(doc.slice(i, i + chunkSize));
    }
    return chunks;
};

// store chunks in data/chunks
export const storeChunksInDataChunks = async (rawChunks: string[], source: string) => {
    console.log('[ingest] Storing', rawChunks.length, 'chunks...');
    const chunks = rawChunks.map((chunk, index) => ({
        id: index,
        text: chunk,
        source,
    }));
    const outputPath = path.join(__dirname, '../data/chunks.json');
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, JSON.stringify(chunks, null, 2));
    console.log('[ingest] Chunks saved to', outputPath);
};

export const ingestDoc = async () => {
    console.log('[ingest] Starting ingestDoc');
    const filePath = path.join(__dirname, '../data/Consumer_Handbook.pdf');
    const doc = await extractText(filePath);
    console.log('[ingest] Dividing into chunks...');
    const rawChunks = await divideDocIntoChunks(doc);
    const source = path.basename(filePath);
    await storeChunksInDataChunks(rawChunks, source);
    console.log('[ingest] ingestDoc complete');
};