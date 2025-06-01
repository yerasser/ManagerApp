import datetime
from sqlalchemy import (
    Column, Integer, String, DateTime, Numeric, Boolean, ForeignKey
)
from sqlalchemy.orm import relationship
from app.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(50))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow
    )
from app.schemas.device import DeviceProposal, DeviceProposalCreate


class DeviceProposal(Base):
    __tablename__ = "device_proposals"

    id = Column(Integer, primary_key=True, index=True)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    reviewer_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    status = Column(String(50), default="pending")  # pending, approved, rejected
    name = Column(String(255), nullable=False)
    type = Column(String(255), nullable=False)
    verification = Column(Integer, default=0)
    calibration = Column(Integer, default=0)
    certification = Column(Integer, default=0)
    department = Column(String(255))
    sector = Column(String(255))
    verifier = Column(String(255))
    internal_number = Column(String(255))
    business_trip = Column(Boolean, default=False)
    technical_possibility = Column(Boolean, default=False)
    combinability = Column(Boolean, default=False)
    parameter = Column(String(255))
    additional_conditions = Column(String(255))
    labels = Column(String(255))
    technical_part_sum = Column(Integer)
    uncertainty_calculation = Column(Numeric(10, 2))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.datetime.utcnow, onupdate=datetime.datetime.utcnow)
    comment = Column(String(500))

    creator = relationship("User", foreign_keys=[created_by], backref="created_proposals")
    reviewer = relationship("User", foreign_keys=[reviewer_id], backref="reviewing_proposals")


class Client(Base):
    __tablename__ = "clients"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    bin = Column(String(255), unique=True, nullable=False)
    legal_address = Column(String(255))
    phone = Column(String(255))
    signatory = Column(String(255))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow
    )

    proposals = relationship("Proposal", back_populates="client")
    contracts = relationship("Contract", back_populates="client")


class Contract(Base):
    __tablename__ = "contracts"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    contract_type = Column(String(50))
    validity_period = Column(DateTime)
    date_signed = Column(DateTime)
    created_by = Column(Integer, ForeignKey("users.id"))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow
    )

    client = relationship("Client", back_populates="contracts")
    creator = relationship("User", backref="contracts")
    applications = relationship("ContractApplication", back_populates="contract")

class ContractApplication(Base):
    __tablename__ = "contract_applications"

    id = Column(Integer, primary_key=True, index=True)
    contract_id = Column(Integer, ForeignKey("contracts.id"), nullable=False)
    application_number = Column(String(50))
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow
    )

    contract = relationship("Contract", back_populates="applications")
    items = relationship("ApplicationItem", back_populates="application", cascade="all, delete-orphan")


class Proposal(Base):
    __tablename__ = "proposals"

    id = Column(Integer, primary_key=True, index=True)
    client_id = Column(Integer, ForeignKey("clients.id"), nullable=False)
    created_by = Column(Integer, ForeignKey("users.id"), nullable=False)
    total_amount = Column(Numeric(10, 2), nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
    updated_at = Column(
        DateTime, default=datetime.datetime.utcnow,
        onupdate=datetime.datetime.utcnow
    )

    client = relationship("Client", back_populates="proposals")
    creator = relationship("User", backref="proposals")
    items = relationship("ProposalItem", back_populates="proposal")

class ProposalItem(Base):
    __tablename__ = "proposal_items"

    id = Column(Integer, primary_key=True, index=True)
    proposal_id = Column(Integer, ForeignKey("proposals.id"), nullable=False)
    device_id = Column(Integer, ForeignKey("devices.id"), nullable=True)
    service = Column(String(255))
    quantity = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    total = Column(Numeric(10, 2), nullable=False)

    proposal = relationship("Proposal", back_populates="items")
    device = relationship("Device", back_populates="proposal_items")


class ApplicationItem(Base):
    __tablename__ = "application_items"

    id = Column(Integer, primary_key=True, index=True)
    application_id = Column(Integer, ForeignKey("contract_applications.id"), nullable=False)
    device_id = Column(Integer, ForeignKey("devices.id"), nullable=True)
    status_id = Column(Integer, ForeignKey("statuses.id"), nullable=True)
    service = Column(String(255))
    quantity = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)
    total = Column(Numeric(10, 2), nullable=False)

    application = relationship("ContractApplication", back_populates="items")
    device = relationship("Device", back_populates="application_items")
    status = relationship("Status", back_populates="application_items")

class Device(Base):
    __tablename__ = "devices"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    type = Column(String(255), nullable=False)

    verification = Column(Integer, default=0)
    calibration = Column(Integer, default=0)
    certification = Column(Integer, default=0)

    department = Column(String(255))
    sector = Column(String(255))
    verifier = Column(String(255))
    internal_number = Column(String(255))
    business_trip = Column(Boolean, default=False)
    technical_possibility = Column(Boolean, default=False)
    combinability = Column(Boolean, default=False)
    parameter = Column(String(255))
    additional_conditions = Column(String(255))
    labels = Column(String(255))
    technical_part_sum = Column(Integer)
    uncertainty_calculation = Column(Numeric(10, 2))

    proposal_items = relationship("ProposalItem", back_populates="device")
    application_items = relationship("ApplicationItem", back_populates="device")


class Status(Base):
    __tablename__ = "statuses"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), nullable=False)

    application_items = relationship("ApplicationItem", back_populates="status")
