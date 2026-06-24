import chromadb
from app.config import settings
import os

os.makedirs(settings.CHROMA_DIR, exist_ok=True)

_client = chromadb.PersistentClient(path=settings.CHROMA_DIR)
_collection = _client.get_or_create_collection(
    name="hikmah_library",
    metadata={"hnsw:space": "cosine"},
)


def add_chunks(book_id: str, book_title: str, chunks: list[dict], embeddings: list[list[float]]):
    ids = [f"{book_id}_{i}" for i in range(len(chunks))]
    documents = [c["text"] for c in chunks]
    metadatas = [
        {"book_id": book_id, "book_title": book_title, "page": c["page"]}
        for c in chunks
    ]
    _collection.add(
        ids=ids,
        documents=documents,
        embeddings=embeddings,
        metadatas=metadatas,
    )


def search(query_embedding: list[float], book_ids: list[str] = None, top_k: int = 8):
    where = {"book_id": {"$in": book_ids}} if book_ids else None
    results = _collection.query(
        query_embeddings=[query_embedding],
        n_results=top_k,
        where=where,
        include=["documents", "metadatas", "distances"],
    )

    chunks = []
    if results["documents"] and results["documents"][0]:
        for doc, meta, dist in zip(
            results["documents"][0],
            results["metadatas"][0],
            results["distances"][0],
        ):
            chunks.append({
                "text": doc,
                "book_id": meta["book_id"],
                "book_title": meta["book_title"],
                "page": meta["page"],
                "score": 1 - dist,
            })
    return chunks


def delete_book(book_id: str):
    existing = _collection.get(where={"book_id": {"$eq": book_id}})
    if existing["ids"]:
        _collection.delete(ids=existing["ids"])


def count_chunks(book_id: str) -> int:
    result = _collection.get(where={"book_id": {"$eq": book_id}})
    return len(result["ids"])
