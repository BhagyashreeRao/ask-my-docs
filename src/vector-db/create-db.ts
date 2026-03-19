import { ensureDocumentChunkCollection } from "./weviate-client";

async function main() {
  await ensureDocumentChunkCollection();
  console.log("DocumentChunk collection ready");
}

main().catch(console.error);