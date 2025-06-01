from pydantic import BaseModel
from datetime import datetime
from decimal import Decimal

from app.schemas.clients import Client
from app.schemas.users import User


class ProposalBase(BaseModel):
    client_id: int
    total_amount: Decimal | None = None

class ProposalCreate(ProposalBase):
    pass

class Proposal(ProposalBase):
    id: int
    created_by: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ProposalDetailed(Proposal):
    client: Client
