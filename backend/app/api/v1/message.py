from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.ai.rag_service import generate_rag_response
from app.core.dependencies import get_current_user
from app.db.database import get_db
from app.db.models.conversation import Conversation
from app.db.models.message import Message
from app.db.models.user import User
from app.schemas.message import MessageCreate, MessageResponse


router = APIRouter(
    prefix="/conversations",
    tags=["Messages"],
)


@router.post(
    "/{conversation_id}/messages",
    response_model=MessageResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_message(
    conversation_id: int,
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # 1. Verify that the conversation belongs to the current user
    conversation = db.scalar(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
        )
    )

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )

    # 2. Save the user's message
    user_message = Message(
        conversation_id=conversation.id,
        role="user",
        content=message_data.content,
    )

    db.add(user_message)
    db.commit()
    db.refresh(user_message)

    # 3. Get previous conversation history
    previous_messages = db.scalars(
        select(Message)
        .where(
            Message.conversation_id == conversation.id,
            Message.id != user_message.id,
        )
        .order_by(Message.id.desc())
        .limit(10)
    ).all()

    # Reverse so the oldest message comes first
    previous_messages.reverse()

    conversation_history = [
        {
            "role": message.role,
            "content": message.content,
        }
        for message in previous_messages
    ]

    # 4. Generate RAG-powered AI response
    try:
        ai_response = generate_rag_response(
            message_data.content,
            conversation_history=conversation_history,
        )

    except Exception as e:
        # Roll back any unfinished database transaction
        db.rollback()

        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="AI support service is temporarily unavailable. Please try again.",
        ) from e

    # 5. Save AI response
    assistant_message = Message(
        conversation_id=conversation.id,
        role="assistant",
        content=ai_response,
    )

    db.add(assistant_message)
    db.commit()
    db.refresh(assistant_message)

    # 6. Return AI response
    return assistant_message


@router.get(
    "/{conversation_id}/messages",
    response_model=list[MessageResponse],
)
def get_messages(
    conversation_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # 1. Verify that the conversation belongs to the current user
    conversation = db.scalar(
        select(Conversation).where(
            Conversation.id == conversation_id,
            Conversation.user_id == current_user.id,
        )
    )

    if not conversation:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Conversation not found",
        )

    # 2. Get conversation messages
    messages = db.scalars(
        select(Message)
        .where(
            Message.conversation_id == conversation_id
        )
        .order_by(Message.id.asc())
    ).all()

    return messages