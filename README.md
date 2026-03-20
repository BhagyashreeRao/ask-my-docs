# Ask My Docs

A RAG (Retrieval-Augmented Generation) application that lets you query your documents using natural language. Built with Cohere for embeddings and generation, and Weaviate for vector search.

## Features

- **PDF ingestion** — Extract text from PDFs and chunk for retrieval
- **Vector search** — Semantic search using Cohere embeddings and Weaviate
- **Reranking** — Cohere rerank for improved relevance
- **Answer generation** — Cohere Chat for grounded, context-aware answers

## Prerequisites

- **Node.js** (v20+)
- **Weaviate** — Run locally via Docker (see [Weaviate docs](https://weaviate.io/developers/weaviate/installation/docker-compose))
- **Cohere API key** — Get one at [cohere.com](https://cohere.com)

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Create a `.env` file in the project root:

```env
COHERE_API_KEY=your_cohere_api_key
PORT=3000
```

### 3. Start Weaviate

Ensure Weaviate is running locally (e.g. via Docker Compose). The app connects to `connectToLocal()` by default.

### 4. Add your documents

Place your PDF(s) in `src/data/`. The default ingest looks for `Consumer_Handbook.pdf`. To use a different file, update the path in `src/ingestion/ingestDoc.ts`.

## Usage

### Start the server

```bash
npm run dev
```

### Ingest and embed documents

Run once (or when you add/update documents) to parse PDFs, generate embeddings, and store in Weaviate:

```bash
curl -X POST http://localhost:3000/api/injestAndEmbed \
  -H "Content-Type: application/json" \
  -d '{"question": "placeholder"}'
```

### Ask questions

```bash
curl -X POST http://localhost:3000/api/ask \
  -H "Content-Type: application/json" \
  -d '{"question": "What are consumer rights?"}'
```

### Check API key

```bash
curl http://localhost:3000/api/check-token
```

## API Endpoints

| Method | Endpoint           | Description                          |
|--------|--------------------|--------------------------------------|
| GET    | `/api/check-token` | Verify Cohere API key is valid       |
| POST   | `/api/injestAndEmbed` | Ingest PDFs, generate embeddings, store in Weaviate |
| POST   | `/api/ask`        | Ask a question and get an answer      |

## Project Structure

```
src/
├── api/
│   ├── controller/   # Request handlers
│   └── routes/       # API routes
├── generation/       # Cohere embedding generation
├── ingestion/        # PDF parsing and chunking
├── retrieval/        # Search and answer generation
├── reranking/        # Cohere rerank
├── vector-db/        # Weaviate client and storage
└── data/             # PDFs, chunks, embeddings (generated)
```

## Tech Stack

- **Cohere** — Embeddings (`embed-english-v3.0`), Rerank (`rerank-english-v3.0`), Chat (`command-r7b-12-2024`)
- **Weaviate** — Vector database for semantic search
- **Express** — REST API
- **TypeScript** — Type-safe Node.js

## License

ISC
