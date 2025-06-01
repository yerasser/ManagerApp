from pydantic import BaseModel
from datetime import datetime

from app.schemas.clients import ClientBase

class ContractBase(BaseModel):
    client_id: int
    contract_type: str | None = None
    validity_period: datetime | None = None
    date_signed: datetime | None = None

class ContractCreate(ContractBase):
    pass

class Contract(ContractBase):
    id: int
    created_by: int | None = None
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ContractDetail(Contract):
    client: ClientBase