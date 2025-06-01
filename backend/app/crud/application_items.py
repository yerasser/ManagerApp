from sqlalchemy.orm import Session
from app import models
from app.schemas.application_items import ApplicationItemCreate

def get_all_application_items(db: Session):
    return db.query(models.ApplicationItem).all()

def get_application_item(db: Session, application_item_id: int):
    return db.query(models.ApplicationItem).filter(models.ApplicationItem.id == application_item_id).first()

def get_application_items(db: Session, application_id: int):
    return db.query(models.ApplicationItem)\
             .filter(models.ApplicationItem.application_id == application_id).all()

def create_application_item(db: Session, item: ApplicationItemCreate):
    db_item = models.ApplicationItem(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

def update_application_item(db: Session, application_item_id: int, item: ApplicationItemCreate):
    db_item = get_application_item(db, application_item_id)
    if not db_item:
        return None
    for field, value in item.dict().items():
        setattr(db_item, field, value)
    db.commit()
    db.refresh(db_item)
    return db_item

def delete_application_item(db: Session, application_item_id: int):
    db_item = get_application_item(db, application_item_id)
    if not db_item:
        return None
    db.delete(db_item)
    db.commit()
    return db_item
