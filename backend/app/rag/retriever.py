from pathlib import Path

from langchain_huggingface import HuggingFaceEmbeddings
from langchain_chroma import Chroma


BASE_DIR = Path(__file__).resolve().parents[2]
CHROMA_DIR = BASE_DIR / "chroma_db"


embeddings = HuggingFaceEmbeddings(
    model_name="sentence-transformers/all-MiniLM-L6-v2"
)


vectorstore = Chroma(
    collection_name="customer_support_knowledge",
    embedding_function=embeddings,
    persist_directory=str(CHROMA_DIR),
)


def retrieve_documents(query: str, k: int = 3):
    return vectorstore.similarity_search(
        query,
        k=k,
    )