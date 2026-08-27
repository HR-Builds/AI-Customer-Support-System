from pathlib import Path

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma


BASE_DIR = Path(__file__).resolve().parents[2]
CHROMA_DIR = BASE_DIR / "chroma_db"

_embeddings = None
_vectorstore = None


def _get_vectorstore():
    global _embeddings, _vectorstore
    if _vectorstore is None:
        _embeddings = HuggingFaceEmbeddings(
            model_name="sentence-transformers/all-MiniLM-L6-v2"
        )
        _vectorstore = Chroma(
            collection_name="customer_support_knowledge",
            embedding_function=_embeddings,
            persist_directory=str(CHROMA_DIR),
        )
    return _vectorstore


def retrieve_documents(query: str, k: int = 3):
    return _get_vectorstore().similarity_search(
        query,
        k=k,
    )