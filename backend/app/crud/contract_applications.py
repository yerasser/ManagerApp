from sqlalchemy.orm import Session
from app import models
from app.schemas.contract_applications import ContractApplicationCreate

def get_application(db: Session, application_id: int):
    return db.query(models.ContractApplication).filter(models.ContractApplication.id == application_id).first()

def get_applications(db: Session, contract_id: int):
    return db.query(models.ContractApplication).filter(models.ContractApplication.contract_id == contract_id).all()

def create_application(db: Session, application: ContractApplicationCreate):
    db_application = models.ContractApplication(**application.dict())
    db.add(db_application)
    db.commit()
    db.refresh(db_application)
    return db_application

def update_application(db: Session, application_id: int, application: ContractApplicationCreate):
    db_application = get_application(db, application_id)
    if not db_application:
        return None
    for field, value in application.dict().items():
        setattr(db_application, field, value)
    db.commit()
    db.refresh(db_application)
    return db_application

def delete_application(db: Session, application_id: int):
    db_application = get_application(db, application_id)
    if not db_application:
        return None
    db.delete(db_application)
    db.commit()
    return db_application
