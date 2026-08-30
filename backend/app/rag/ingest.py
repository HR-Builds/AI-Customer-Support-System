from pathlib import Path

from langchain_community.document_loaders import (
    PyPDFLoader,
    TextLoader,
)
from chromadb.utils.embedding_functions import DefaultEmbeddingFunction
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma


BASE_DIR = Path(__file__).resolve().parents[2]
CHROMA_DIR = BASE_DIR / "chroma_db"


class LightweightEmbeddings:
    def __init__(self):
        self._fn = DefaultEmbeddingFunction()

    def embed_documents(self, texts):
        return self._fn(texts)

    def embed_query(self, text):
        return self._fn([text])[0]


def load_document(file_path: str):
    path = Path(file_path)

    if not path.exists():
        raise FileNotFoundError(f"File not found: {file_path}")

    if path.suffix.lower() == ".pdf":
        loader = PyPDFLoader(str(path))
    elif path.suffix.lower() == ".txt":
        loader = TextLoader(
            str(path),
            encoding="utf-8",
        )
    else:
        raise ValueError("Unsupported file type. Use PDF or TXT.")

    return loader.load()


def ingest_document(file_path: str) -> int:
    documents = load_document(file_path)

    splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )

    chunks = splitter.split_documents(documents)

    embeddings = LightweightEmbeddings()

    vectorstore = Chroma(
        collection_name="customer_support_knowledge",
        embedding_function=embeddings,
        persist_directory=str(CHROMA_DIR),
    )

    vectorstore.add_documents(chunks)

    return len(chunks)