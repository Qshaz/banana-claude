import fitz
import re


def extract_chunks(pdf_bytes: bytes, chunk_size: int = 1800, overlap: int = 200):
    doc = fitz.open(stream=pdf_bytes, filetype="pdf")
    chunks = []

    for page_num in range(len(doc)):
        page = doc[page_num]
        text = page.get_text("text")
        text = _clean_text(text)
        if not text.strip():
            continue

        page_chunks = _split_text(text, chunk_size, overlap)
        for chunk in page_chunks:
            if len(chunk.strip()) > 50:
                chunks.append({
                    "text": chunk.strip(),
                    "page": page_num + 1,
                })

    doc.close()
    return chunks


def _clean_text(text: str) -> str:
    text = re.sub(r'\n{3,}', '\n\n', text)
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n ', '\n', text)
    return text.strip()


def _split_text(text: str, chunk_size: int, overlap: int) -> list[str]:
    if len(text) <= chunk_size:
        return [text]

    chunks = []
    start = 0
    while start < len(text):
        end = start + chunk_size
        if end < len(text):
            # break at sentence boundary
            break_at = text.rfind('. ', start, end)
            if break_at == -1:
                break_at = text.rfind('\n', start, end)
            if break_at != -1:
                end = break_at + 1
        chunks.append(text[start:end])
        start = end - overlap if end < len(text) else len(text)

    return chunks
