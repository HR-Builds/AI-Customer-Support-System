from app.ai.llm import llm


response = llm.invoke(
    "You are a customer support assistant. Say hello in one sentence."
)

print(response.content)