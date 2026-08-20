from langchain_groq import ChatGroq

from app.core.config import settings


llm = ChatGroq(
    model=settings.GROQ_MODEL,
    groq_api_key=settings.GROQ_API_KEY,
    temperature=0.2,
)