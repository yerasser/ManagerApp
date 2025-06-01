from sqlalchemy.orm import Session
from app import models
from app.schemas.device import DeviceCreate
from app.schemas.device import DeviceProposalCreate

def get_device(db: Session, device_id: int):
    return db.query(models.Device).filter(models.Device.id == device_id).first()


def get_devices(db: Session, name: str = "", type: str = ""):
    query = db.query(models.Device)

    if name:
        query = query.filter(models.Device.name.ilike(f"%{name}%"))
    if type:
        query = query.filter(models.Device.type.ilike(f"%{type}%"))

    return query.all()
def create_device(db: Session, device: DeviceCreate):
    db_device = models.Device(**device.dict())
    db.add(db_device)
    db.commit()
    db.refresh(db_device)
    return db_device

def update_device(db: Session, device_id: int, device: DeviceCreate):
    db_device = get_device(db, device_id)
    if not db_device:
        return None
    for field, value in device.dict().items():
        setattr(db_device, field, value)
    db.commit()
    db.refresh(db_device)
    return db_device

def delete_device(db: Session, device_id: int):
    db_device = get_device(db, device_id)
    if not db_device:
        return None
    db.delete(db_device)
    db.commit()
    return db_device


def create_device_proposal(db: Session, proposal: DeviceProposalCreate, user_id: int):
    db_proposal = models.DeviceProposal(
        **proposal.dict(),
        created_by=user_id
    )
    db.add(db_proposal)
    db.commit()
    db.refresh(db_proposal)
    return db_proposal

def get_device_proposals(db: Session, user_id: int, is_reviewer: bool = False):
    if is_reviewer:
        return db.query(models.DeviceProposal).filter(
            models.DeviceProposal.reviewer_id == user_id
        ).all()
    return db.query(models.DeviceProposal).filter(
        models.DeviceProposal.created_by == user_id
    ).all()

def update_proposal_status(
    db: Session, 
    proposal_id: int, 
    status: str, 
    comment: str = None
):
    db_proposal = db.query(models.DeviceProposal).filter(
        models.DeviceProposal.id == proposal_id
    ).first()
    
    if not db_proposal:
        return None
        
    db_proposal.status = status
    if comment:
        db_proposal.comment = comment
        
    if status == "approved":
        # Create new device
        device_data = {
            key: getattr(db_proposal, key)
            for key in DeviceCreate.__fields__.keys()
        }
        new_device = models.Device(**device_data)
        db.add(new_device)
        
    db.commit()
    db.refresh(db_proposal)
    return db_proposal

def update_device_proposal(
    db: Session,
    proposal_id: int,
    proposal_data: DeviceProposalCreate
):
    db_proposal = get_device_proposal(db, proposal_id)
    if not db_proposal or db_proposal.status != "pending":
        return None

    for field, value in proposal_data.dict().items():
        setattr(db_proposal, field, value)
    
    db.commit()
    db.refresh(db_proposal)
    return db_proposal

def get_proposals_by_status(
    db: Session,
    status: str = None,
    reviewer_id: int = None,
    creator_id: int = None
):
    query = db.query(models.DeviceProposal)
    
    if status:
        query = query.filter(models.DeviceProposal.status == status)
    if reviewer_id:
        query = query.filter(models.DeviceProposal.reviewer_id == reviewer_id)
    if creator_id:
        query = query.filter(models.DeviceProposal.created_by == creator_id)
        
    return query.all()
