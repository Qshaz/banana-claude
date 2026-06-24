from pydantic import BaseModel
from typing import Optional
from enum import Enum


class BookStatus(str, Enum):
    pending = "pending"
    processing = "processing"
    ready = "ready"
    error = "error"


class Book(BaseModel):
    id: str
    title: str
    author: Optional[str] = None
    category: str = "Uncategorized"
    drive_file_id: str
    drive_file_name: str
    status: BookStatus = BookStatus.pending
    chunk_count: int = 0
    error_message: Optional[str] = None
    color: str = "#B5976A"


class QueryRequest(BaseModel):
    question: str
    book_ids: Optional[list[str]] = None
    top_k: int = 8


class SourceChunk(BaseModel):
    book_id: str
    book_title: str
    page: int
    text: str


class QueryResponse(BaseModel):
    answer: str
    sources: list[SourceChunk]


class ImportRequest(BaseModel):
    files: list[dict]
    category: str = "Uncategorized"


class DriveFile(BaseModel):
    id: str
    name: str
    size: Optional[str] = None
    modified: Optional[str] = None
