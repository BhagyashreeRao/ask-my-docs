import { CohereClient } from 'cohere-ai';
import { getClient } from '../vector-db/weviate-client';

export const search = async (query: string) => {
    const embeddedQuery = await embedQuery(query);
    const results = await searchDocuments(embeddedQuery);
    return results;
};

const searchDocuments = async (embeddedQuery: number[]) => {
// search weaviate for documents similar to the embedded query  
    const client = await getClient();
    const collection = client.collections.use("DocumentChunk");
    const results = await collection.query.nearVector(embeddedQuery, {
      limit: 5
    });
    return results;
}

const embedQuery = async (query: string) => {
    const cohere = new CohereClient({
        token: process.env.COHERE_API_KEY
    });
    const response = await cohere.embed({
        model: "embed-english-v3.0",
        texts: [query],
        inputType: "search_query"
    });
    return (response.embeddings as number[][])[0];
};

