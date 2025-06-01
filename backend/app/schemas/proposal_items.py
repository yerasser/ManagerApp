from pydantic import BaseModel
from decimal import Decimal

from app.schemas.device import Device


class ProposalItemBase(BaseModel):
    proposal_id: int
    device_id: int | None = None
    service: str
    quantity: int
    price: Decimal
    total: Decimal

class ProposalItemCreate(ProposalItemBase):
    pass

class ProposalItem(ProposalItemBase):
    id: int

    class Config:
        orm_mode = True

class ProposalItemDetailed(ProposalItem):
    device: Device | None
    services_list: list[dict]

