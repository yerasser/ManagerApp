from pydantic import BaseModel
from decimal import Decimal

from app.schemas.contract_applications import ContractApplicationDetail
from app.schemas.device import Device
from app.schemas.statuses import Status


class ApplicationItemBase(BaseModel):
    application_id: int
    device_id: int | None = None
    status_id: int | None = None
    service: str | None = None
    quantity: int
    price: Decimal
    total: Decimal

class ApplicationItemCreate(ApplicationItemBase):
    pass

class ApplicationItem(ApplicationItemBase):
    id: int

    class Config:
        orm_mode = True

class ApplicationItemDetailed(ApplicationItem):
    application: ContractApplicationDetail
    device: Device | None
    services_list: list[dict]
    status: Status | None


