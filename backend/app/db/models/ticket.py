from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)

    subject = Column(String(255), nullable=False)
    description = Column(Text, nullable=False)

    status = Column(String(50), default="open", nullable=False)
    priority = Column(String(50), default="medium", nullable=False)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    user = relationship("User", back_populates="tickets")