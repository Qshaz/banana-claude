from fastapi import APIRouter, Request, HTTPException
from fastapi.responses import JSONResponse
from app.routers.auth import get_session
from app.services import embedder, vector_store, synthesizer
from app.models import QueryRequest, QueryResponse, SourceChunk

router = APIRouter(prefix="/api", tags=["query"])


@router.post("/query")
def query(request: Request, payload: QueryRequest):
    session = get_session(request)
    if not session:
        raise HTTPException(401, "Not authenticated")

    query_embedding = embedder.embed_query(payload.question)
    chunks = vector_store.search(query_embedding, payload.book_ids, payload.top_k)
    answer = synthesizer.synthesize(payload.question, chunks)

    sources = [
        SourceChunk(
            book_id=c["book_id"],
            book_title=c["book_title"],
            page=c["page"],
            text=c["text"][:300] + "..." if len(c["text"]) > 300 else c["text"],
        )
        for c in chunks
    ]

    return JSONResponse(QueryResponse(answer=answer, sources=sources).model_dump())
