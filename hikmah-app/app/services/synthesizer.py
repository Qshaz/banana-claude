import anthropic
from app.config import settings

_client = anthropic.Anthropic(api_key=settings.ANTHROPIC_API_KEY)


def synthesize(question: str, chunks: list[dict]) -> str:
    if not chunks:
        return "I couldn't find relevant passages in your library for that question. Try rephrasing, or make sure the relevant books have been imported and indexed."

    context_parts = []
    for i, chunk in enumerate(chunks, 1):
        context_parts.append(
            f"[Source {i}: {chunk['book_title']}, page {chunk['page']}]\n{chunk['text']}"
        )
    context = "\n\n---\n\n".join(context_parts)

    prompt = f"""You are Hikmah, a wise and thoughtful reading companion helping someone explore their personal library of books.

The user has asked: "{question}"

Here are the most relevant passages found across their library:

{context}

Please provide a thoughtful, synthesized answer based on these passages.
- Draw connections between different books where relevant
- Be specific about which book/source supports each point (use the source labels like [Source 1], etc.)
- Write in a warm, conversational tone — like a knowledgeable friend sharing wisdom
- If the passages don't fully answer the question, say so honestly
- Keep your answer focused and practical"""

    response = _client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=2048,
        messages=[{"role": "user", "content": prompt}],
    )
    return response.content[0].text
