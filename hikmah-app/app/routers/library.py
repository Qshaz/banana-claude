from fastapi import APIRouter, Request, HTTPException, BackgroundTasks
from fastapi.responses import JSONResponse
from app.routers.auth import get_session
from app.services import drive, pdf_processor, embedder, vector_store
from app.models import Book, BookStatus, ImportRequest
from app.config import settings
import json, os, uuid

router = APIRouter(prefix="/api/library", tags=["library"])

os.makedirs(settings.DATA_DIR, exist_ok=True)


def _load_books() -> dict[str, Book]:
    if not os.path.exists(settings.BOOKS_FILE):
        return {}
    with open(settings.BOOKS_FILE) as f:
        data = json.load(f)
    return {bid: Book(**b) for bid, b in data.items()}


def _save_books(books: dict[str, Book]):
    with open(settings.BOOKS_FILE, "w") as f:
        json.dump({bid: b.model_dump() for bid, b in books.items()}, f, indent=2)


CATEGORY_COLORS = {
    "Personal Development": "#E8A87C",
    "Business": "#85C1AE",
    "Fiction": "#9B7FA6",
    "Relationships": "#C4858A",
    "Spirituality": "#B5976A",
    "Health": "#7FB3A6",
    "Biography": "#8A9BB5",
    "Uncategorized": "#A0A0B0",
}


def _color_for_category(category: str) -> str:
    return CATEGORY_COLORS.get(category, "#A0A0B0")


def _process_book(book_id: str, token_data: dict):
    books = _load_books()
    book = books.get(book_id)
    if not book:
        return

    try:
        book.status = BookStatus.processing
        _save_books(books)

        pdf_bytes = drive.download_pdf(token_data, book.drive_file_id)
        chunks = pdf_processor.extract_chunks(pdf_bytes)

        if not chunks:
            raise ValueError("No text could be extracted from this PDF.")

        embeddings = [embedder.embed_document(c["text"]) for c in chunks]
        vector_store.add_chunks(book_id, book.title, chunks, embeddings)

        book.status = BookStatus.ready
        book.chunk_count = len(chunks)
    except Exception as e:
        book.status = BookStatus.error
        book.error_message = str(e)

    books = _load_books()
    books[book_id] = book
    _save_books(books)


@router.get("/books")
def list_books(request: Request):
    session = get_session(request)
    if not session:
        raise HTTPException(401, "Not authenticated")
    books = _load_books()
    return JSONResponse([b.model_dump() for b in books.values()])


@router.post("/import")
def import_books(request: Request, payload: ImportRequest, background_tasks: BackgroundTasks):
    session = get_session(request)
    if not session:
        raise HTTPException(401, "Not authenticated")

    books = _load_books()
    added = []

    for f in payload.files:
        book_id = str(uuid.uuid4())
        title = f.get("name", "Untitled").replace(".pdf", "")
        book = Book(
            id=book_id,
            title=title,
            category=payload.category,
            drive_file_id=f["id"],
            drive_file_name=f.get("name", ""),
            status=BookStatus.pending,
            color=_color_for_category(payload.category),
        )
        books[book_id] = book
        added.append(book_id)

    _save_books(books)

    for book_id in added:
        background_tasks.add_task(_process_book, book_id, session)

    return JSONResponse({"imported": len(added), "book_ids": added})


@router.patch("/books/{book_id}")
def update_book(request: Request, book_id: str, payload: dict):
    session = get_session(request)
    if not session:
        raise HTTPException(401, "Not authenticated")

    books = _load_books()
    if book_id not in books:
        raise HTTPException(404, "Book not found")

    book = books[book_id]
    if "title" in payload:
        book.title = payload["title"]
    if "author" in payload:
        book.author = payload["author"]
    if "category" in payload:
        book.category = payload["category"]
        book.color = _color_for_category(payload["category"])

    books[book_id] = book
    _save_books(books)
    return JSONResponse(book.model_dump())


@router.delete("/books/{book_id}")
def delete_book(request: Request, book_id: str):
    session = get_session(request)
    if not session:
        raise HTTPException(401, "Not authenticated")

    books = _load_books()
    if book_id not in books:
        raise HTTPException(404, "Book not found")

    vector_store.delete_book(book_id)
    del books[book_id]
    _save_books(books)
    return JSONResponse({"deleted": book_id})


@router.get("/drive/files")
def browse_drive(request: Request, folder_id: str = None, page_token: str = None):
    session = get_session(request)
    if not session:
        raise HTTPException(401, "Not authenticated")

    files, next_token = drive.list_pdf_files(session, folder_id, page_token)
    folders = drive.list_folders(session, folder_id or "root")

    return JSONResponse({
        "folders": folders,
        "files": files,
        "next_page_token": next_token,
    })
