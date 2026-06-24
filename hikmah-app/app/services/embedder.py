import google.generativeai as genai
from app.config import settings

genai.configure(api_key=settings.GEMINI_API_KEY)

_MODEL = "models/text-embedding-004"


def embed_document(text: str) -> list[float]:
    result = genai.embed_content(
        model=_MODEL,
        content=text,
        task_type="retrieval_document",
    )
    return result["embedding"]


def embed_query(text: str) -> list[float]:
    result = genai.embed_content(
        model=_MODEL,
        content=text,
        task_type="retrieval_query",
    )
    return result["embedding"]
