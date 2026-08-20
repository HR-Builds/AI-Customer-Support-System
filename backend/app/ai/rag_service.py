from app.ai.llm import llm
from app.rag.retriever import retrieve_documents


def generate_rag_response(
    user_message: str,
    conversation_history: list | None = None,
) -> str:
    # 1. Retrieve relevant knowledge-base documents
    documents = retrieve_documents(
        user_message,
        k=3,
    )

    # 2. Build knowledge-base context
    context = "\n\n".join(
        document.page_content
        for document in documents
    )

    # 3. Build conversation history
    history_text = ""

    if conversation_history:
        history_text = "\n".join(
            f"{message['role']}: {message['content']}"
            for message in conversation_history
        )

    # 4. Build prompt
    prompt = f"""
You are an AI customer support assistant.

Your job is to answer the customer's question using
the provided knowledge base and conversation history.

IMPORTANT RULES:
- Use ONLY information available in the knowledge base.
- Do not invent policies, prices, guarantees, or procedures.
- If the knowledge base does not contain the answer,
  clearly say that you do not have enough information
  and recommend contacting customer support.
- Keep the response clear, professional, and concise.

Conversation History:
----------------
{history_text}
----------------

Knowledge Base:
----------------
{context}
----------------

Current Customer Question:
----------------
{user_message}
----------------

Answer the customer:
"""

    # 5. Generate AI response
    response = llm.invoke(prompt)

    # 6. Return clean text
    return response.content