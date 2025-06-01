from sqlalchemy.orm import Session
from app import models
from app.schemas.clients import ClientCreate

def get_client(db: Session, client_id: int):
    return db.query(models.Client).filter(models.Client.id == client_id).first()

def get_client_by_bin(db: Session, bin: str):
    return db.query(models.Client).filter(models.Client.bin == bin).first()

def get_clients(db: Session):
    return db.query(models.Client).all()

def create_client(db: Session, client: ClientCreate):
    db_client = models.Client(**client.dict())
    db.add(db_client)
    db.commit()
    db.refresh(db_client)
    return db_client

def update_client(db: Session, client_id: int, client: ClientCreate):
    db_client = get_client(db, client_id)
    if not db_client:
        return None
    for field, value in client.dict().items():
        setattr(db_client, field, value)
    db.commit()
    db.refresh(db_client)
    return db_client

def delete_client(db: Session, client_id: int):
    db_client = get_client(db, client_id)
    if not db_client:
        return None
    db.delete(db_client)
    db.commit()
    return db_client
