import { CohereClient } from "cohere-ai";
import dotenv from "dotenv";
dotenv.config();

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY
});

async function test() {
  const res = await cohere.embed({
    model: "embed-english-v3.0",
    texts: ["hello world"],
    inputType: "search_document"
  });

  console.log(res.embeddings.length);
}

test();