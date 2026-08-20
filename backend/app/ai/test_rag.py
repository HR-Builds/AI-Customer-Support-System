from app.ai.rag_service import generate_rag_response


question = (
    "My payment was completed but my order "
    "still shows as unpaid. What should I do?"
)

answer = generate_rag_response(question)

print("\n--- AI RESPONSE ---")
print(answer)