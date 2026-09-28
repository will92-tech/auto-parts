"""create initial schema

Revision ID: 0001_initial
"""
from alembic import op
import sqlalchemy as sa

revision = '0001_initial'
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # The application currently creates tables on startup. This revision is intentionally
    # empty so existing installations can adopt Alembic without destructive recreation.
    pass


def downgrade():
    pass
