from pydantic import BaseModel
from datetime import datetime

class ClientBase(BaseModel):
    name: str
    bin: str
    legal_address: str | None = None
    phone: str | None = None
    signatory: str | None = None

class ClientCreate(ClientBase):
    pass

class Client(ClientBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True

