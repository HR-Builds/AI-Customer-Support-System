from pathlib import Path

from chromadb.utils.embedding_functions import DefaultEmbeddingFunction
from langchain_chroma import Chroma


BASE_DIR = Path(__file__).resolve().parents[2]
CHROMA_DIR = BASE_DIR / "chroma_db"

_embeddings = None
_vectorstore = None


class LightweightEmbeddings:
    def __init__(self):
        self._fn = DefaultEmbeddingFunction()

    def embed_documents(self, texts):
        return self._fn(texts)

    def embed_query(self, text):
        return self._fn([text])[0]


def _get_vectorstore():
    global _embeddings, _vectorstore
    if _vectorstore is None:
        _embeddings = LightweightEmbeddings()
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