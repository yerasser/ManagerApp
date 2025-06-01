from pydantic import BaseModel
from datetime import datetime

from app.schemas.contracts import ContractDetail


class ContractApplicationBase(BaseModel):
    contract_id: int
    application_number: str

class ContractApplicationCreate(ContractApplicationBase):
    pass

class ContractApplication(ContractApplicationBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

class ContractApplicationDetail(ContractApplication):
    contract: ContractDetail