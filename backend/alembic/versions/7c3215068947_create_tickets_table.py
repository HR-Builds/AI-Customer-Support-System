"""Create tickets table

Revision ID: 7c3215068947
Revises: 8f6a7fbe47de
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


revision: str = "7c3215068947"
down_revision: Union[str, Sequence[str], None] = "8f6a7fbe47de"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "tickets",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("subject", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("status", sa.String(length=50), nullable=False),
        sa.Column("priority", sa.String(length=50), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),

        sa.ForeignKeyConstraint(
            ["user_id"],
            ["users.id"],
        ),

        sa.PrimaryKeyConstraint("id"),
    )


def downgrade() -> None:
    op.drop_table("tickets")