import weaviate from "weaviate-client";

export const getClient = async () => {
  return await weaviate.connectToLocal();
};

export const ensureDocumentChunkCollection = async () => {
  const client = await getClient();
  const exists = await client.collections.exists("DocumentChunk");
  if (!exists) {
    await client.collections.create({
      name: "DocumentChunk",
      vectorizers: weaviate.configure.vectorizer.none(),
      properties: [
        { name: "text", dataType: "text" },
        { name: "source", dataType: "text" }
      ]
    });
    console.log("[weaviate] Created DocumentChunk collection");
  }
};