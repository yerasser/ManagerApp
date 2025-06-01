from sqlalchemy.orm import Session
from app import models
from app.schemas.statuses import StatusCreate

def get_status(db: Session, status_id: int):
    return db.query(models.Status).filter(models.Status.id == status_id).first()

def get_statuses(db: Session):
    return db.query(models.Status).all()

def create_status(db: Session, status: StatusCreate):
    db_status = models.Status(**status.dict())
    db.add(db_status)
    db.commit()
    db.refresh(db_status)
    return db_status

def update_status(db: Session, status_id: int, status: StatusCreate):
    db_status = get_status(db, status_id)
    if not db_status:
        return None
    for field, value in status.dict().items():
        setattr(db_status, field, value)
    db.commit()
    db.refresh(db_status)
    return db_status

def delete_status(db: Session, status_id: int):
    db_status = get_status(db, status_id)
    if not db_status:
        return None
    db.delete(db_status)
    db.commit()
    return db_status
