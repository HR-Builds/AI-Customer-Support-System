from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.core.dependencies import get_current_admin_user
from app.db.database import get_db
from app.db.models.conversation import Conversation
from app.db.models.message import Message
from app.db.models.ticket import Ticket
from app.db.models.user import User
from app.schemas.admin import AdminStatsResponse, AdminUserResponse, AdminUserUpdate
from app.schemas.conversation import ConversationResponse

router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(get_current_admin_user)],
)


@router.get("/stats", response_model=AdminStatsResponse)
def get_stats(db: Session = Depends(get_db)):
    total_users = db.scalar(select(func.count(User.id)))
    active_users = db.scalar(
        select(func.count(User.id)).where(User.is_active.is_(True))
    )
    total_conversations = db.scalar(select(func.count(Conversation.id)))
    total_messages = db.scalar(select(func.count(Message.id)))
    total_tickets = db.scalar(select(func.count(Ticket.id)))
    open_tickets = db.scalar(
        select(func.count(Ticket.id)).where(Ticket.status == "open")
    )

    return {
        "total_users": total_users or 0,
        "active_users": active_users or 0,
        "total_conversations": total_conversations or 0,
        "total_messages": total_messages or 0,
        "total_tickets": total_tickets or 0,
        "open_tickets": open_tickets or 0,
    }


@router.get("/users", response_model=list[AdminUserResponse])
def list_users(db: Session = Depends(get_db)):
    users = db.scalars(select(User).order_by(User.id.desc())).all()

    result = []
    for user in users:
        conversation_count = db.scalar(
            select(func.count(Conversation.id)).where(
                Conversation.user_id == user.id
            )
        )
        ticket_count = db.scalar(
            select(func.count(Ticket.id)).where(Ticket.user_id == user.id)
        )

        result.append(
            AdminUserResponse(
                id=user.id,
                name=user.name,
                email=user.email,
                role=user.role,
                is_active=user.is_active,
                created_at=user.created_at,
                conversation_count=conversation_count or 0,
                ticket_count=ticket_count or 0,
            )
        )

    return result


@router.get("/users/{user_id}", response_model=AdminUserResponse)
def get_user(user_id: int, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.id == user_id))

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    conversation_count = db.scalar(
        select(func.count(Conversation.id)).where(Conversation.user_id == user.id)
    )
    ticket_count = db.scalar(
        select(func.count(Ticket.id)).where(Ticket.user_id == user.id)
    )

    return AdminUserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        is_active=user.is_active,
        created_at=user.created_at,
        conversation_count=conversation_count or 0,
        ticket_count=ticket_count or 0,
    )


@router.get(
    "/users/{user_id}/conversations",
    response_model=list[ConversationResponse],
)
def get_user_conversations(user_id: int, db: Session = Depends(get_db)):
    user = db.scalar(select(User).where(User.id == user_id))

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    conversations = db.scalars(
        select(Conversation)
        .where(Conversation.user_id == user_id)
        .order_by(Conversation.id.desc())
    ).all()

    return conversations


@router.patch("/users/{user_id}", response_model=AdminUserResponse)
def update_user(
    user_id: int,
    update_data: AdminUserUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    if user_id == current_admin.id and update_data.is_active is False:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot deactivate your own account",
        )

    user = db.scalar(select(User).where(User.id == user_id))

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    if update_data.is_active is not None:
        user.is_active = update_data.is_active

    if update_data.role is not None:
        if update_data.role not in ("customer", "admin"):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Role must be 'customer' or 'admin'",
            )
        user.role = update_data.role

    db.commit()
    db.refresh(user)

    conversation_count = db.scalar(
        select(func.count(Conversation.id)).where(Conversation.user_id == user.id)
    )
    ticket_count = db.scalar(
        select(func.count(Ticket.id)).where(Ticket.user_id == user.id)
    )

    return AdminUserResponse(
        id=user.id,
        name=user.name,
        email=user.email,
        role=user.role,
        is_active=user.is_active,
        created_at=user.created_at,
        conversation_count=conversation_count or 0,
        ticket_count=ticket_count or 0,
    )


@router.delete("/users/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_user(
    user_id: int,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin_user),
):
    if user_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="You cannot delete your own account",
        )

    user = db.scalar(select(User).where(User.id == user_id))

    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    db.delete(user)
    db.commit()
