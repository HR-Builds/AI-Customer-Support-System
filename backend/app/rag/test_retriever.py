from app.rag.retriever import retrieve_documents


query = "What should I do if my payment is completed but my order is still unpaid?"

documents = retrieve_documents(query)

for document in documents:
    print("\n--- DOCUMENT ---")
    print(document.page_content)