from app.ai.llm import llm
from app.rag.retriever import retrieve_documents


def generate_rag_response(
    user_message: str,
    conversation_history: list | None = None,
) -> str:

    # Retrieve relevant knowledge-base documents
    documents = retrieve_documents(
        user_message,
        k=3,
    )

    context = "\n\n".join(
        document.page_content
        for document in documents
    )

    # Build conversation history
    history_text = ""

    if conversation_history:
        history_text = "\n".join(
            f"{message.role}: {message.content}"
            for message in conversation_history
        )

    prompt = f"""
You are an AI customer support assistant.

Your job is to answer customer questions using ONLY
the information available in the knowledge base.

If the answer is not available in the knowledge base,
say that you do not have enough information and
recommend contacting customer support.

Do not invent policies, prices, timelines, or procedures.

Knowledge Base:
----------------
{context}
----------------

Previous Conversation:
----------------
{history_text}
----------------

Customer's New Question:
----------------
{user_message}
----------------

Give a clear, helpful and concise answer.
"""

    response = llm.invoke(prompt)

    return response.content