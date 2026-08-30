from fastapi import FastAPI
from sqlalchemy import text

from app.db.database import engine

from app.api.v1.auth import router as auth_router

from app.api.v1.ticket import router as tickets_router

from app.api.v1.conversation import router as conversations_router

from app.api.v1.message import router as messages_router

from app.api.v1.admin import router as admin_router


app = FastAPI(
    
    title="AI Customer Support System",
    version="1.0.0",
    description="AI-powered customer support platform",
)

from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "https://novaai-hassan-8c87.vercel.app",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(
    auth_router,
    prefix="/api/v1",
)

app.include_router(
    tickets_router,
    prefix="/api/v1",
)

app.include_router(
    conversations_router,
    prefix="/api/v1",
)

app.include_router(
    messages_router,
    prefix="/api/v1",
)

app.include_router(
    admin_router,
    prefix="/api/v1",
)

@app.get("/")
def root():
    return {
        "success": True,
        "message": "AI Customer Support System API is running",
    }


@app.get("/api/v1/health")
def health_check():
    return {
        "success": True,
        "message": "API is healthy",
    }


@app.get("/api/v1/health/database")
def database_health_check():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "success": True,
        "message": "Database connection is working",
    }

@app.on_event("startup")
def ingest_knowledge_base_if_empty():
    from pathlib import Path
    from app.rag.retriever import _get_vectorstore
    from app.rag.ingest import ingest_document

    try:
        vectorstore = _get_vectorstore()
        existing = vectorstore.get()
        if not existing["ids"]:
            guide_path = Path(__file__).resolve().parent.parent / "test_data" / "support_guide.txt"
            if guide_path.exists():
                ingest_document(str(guide_path))
    except Exception as e:
        print(f"Knowledge base auto-ingest skipped: {e}")