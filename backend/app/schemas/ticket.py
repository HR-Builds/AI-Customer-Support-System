from datetime import datetime

from pydantic import BaseModel, Field


class TicketCreate(BaseModel):
    subject: str = Field(min_length=3, max_length=255)
    description: str = Field(min_length=5)
    priority: str = "medium"


class TicketResponse(BaseModel):
    id: int
    subject: str
    description: str
    status: str
    priority: str
    user_id: int

    model_config = {
        "from_attributes": True
    }