from pydantic import BaseModel
from decimal import Decimal
from typing import Optional
from datetime import datetime



class DeviceBase(BaseModel):
    name: str
    type: str
    verification: int = 0
    calibration: int = 0
    certification: int = 0
    department: Optional[str] = None
    sector: Optional[str] = None
    verifier: Optional[str] = None
    internal_number: Optional[str] = None
    business_trip: bool = False
    technical_possibility: bool = False
    combinability: bool = False
    parameter: Optional[str] = None
    additional_conditions: Optional[str] = None
    labels: Optional[str] = None
    technical_part_sum: Optional[int] = None
    uncertainty_calculation: Optional[Decimal] = None

class DeviceCreate(DeviceBase):
    pass

class Device(DeviceBase):
    id: int

    class Config:
        orm_mode = True


class DeviceProposalBase(DeviceBase):
    reviewer_id: int
    comment: Optional[str] = None

class DeviceProposalCreate(DeviceProposalBase):
    pass

class DeviceProposal(DeviceProposalBase):
    id: int
    created_by: int
    status: str
    created_at: datetime
    updated_at: datetime

    class Config:
        orm_mode = True