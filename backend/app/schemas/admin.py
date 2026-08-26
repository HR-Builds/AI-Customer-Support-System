from datetime import datetime

from pydantic import BaseModel, EmailStr


class AdminUserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    role: str
    is_active: bool
    created_at: datetime
    conversation_count: int = 0
    ticket_count: int = 0

    model_config = {
        "from_attributes": True
    }


class AdminUserUpdate(BaseModel):
    is_active: bool | None = None
    role: str | None = None


class AdminStatsResponse(BaseModel):
    total_users: int
    active_users: int
    total_conversations: int
    total_messages: int
    total_tickets: int
    open_tickets: int
