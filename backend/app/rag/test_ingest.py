from app.rag.ingest import ingest_document


FILE_PATH = "test_data/support_guide.txt"


chunks = ingest_document(FILE_PATH)

print(f"Successfully ingested {chunks} chunks.")