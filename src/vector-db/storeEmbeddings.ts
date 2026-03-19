import { getClient, ensureDocumentChunkCollection } from "./weviate-client";
import fs from "fs";
import path from "path";

export const storeEmbeddings = async () => {
  const client = await getClient();
  if (await client.collections.exists("DocumentChunk")) {
    await client.collections.delete("DocumentChunk");
    console.log("[weaviate] Deleted existing DocumentChunk (replacing with fresh data)");
  }
  await ensureDocumentChunkCollection();

  const collection = client.collections.use("DocumentChunk");

  const chunksPath = path.join(__dirname, "../data/chunks-with-embeddings.json");
  const chunks = JSON.parse(fs.readFileSync(chunksPath, "utf-8"));

  const objects = chunks.map((chunk: { text: string; source: string; embedding: number[] }) => ({
    properties: { text: chunk.text, source: chunk.source },
    vectors: chunk.embedding
  }));

  await collection.data.insertMany(objects);
  console.log("✅ Stored all vectors in Weaviate");
};