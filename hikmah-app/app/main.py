from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from app.routers import auth, library, query
import os

app = FastAPI(title="Hikmah", docs_url=None, redoc_url=None)

app.include_router(auth.router)
app.include_router(library.router)
app.include_router(query.router)

static_dir = os.path.join(os.path.dirname(__file__), "static")
app.mount("/static", StaticFiles(directory=static_dir), name="static")


@app.get("/")
@app.get("/{full_path:path}")
def serve_spa(full_path: str = ""):
    if full_path.startswith("api/"):
        return {"detail": "Not found"}
    return FileResponse(os.path.join(static_dir, "index.html"))
