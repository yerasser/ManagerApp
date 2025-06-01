from sqlalchemy.orm import Session
from app import models
from app.schemas.contracts import ContractCreate

def get_contract(db: Session, contract_id: int):
    return db.query(models.Contract).filter(models.Contract.id == contract_id).first()

def get_contracts(db: Session):
    return db.query(models.Contract).all()

def create_contract(db: Session, contract: ContractCreate, created_by: int):
    db_contract = models.Contract(
        client_id=contract.client_id,
        contract_type=contract.contract_type,
        validity_period=contract.validity_period,
        date_signed=contract.date_signed,
        created_by=created_by
    )
    db.add(db_contract)
    db.commit()
    db.refresh(db_contract)
    return db_contract

def update_contract(db: Session, contract_id: int, contract: ContractCreate):
    db_contract = get_contract(db, contract_id)
    if not db_contract:
        return None
    db_contract.client_id = contract.client_id
    db_contract.contract_type = contract.contract_type
    db_contract.validity_period = contract.validity_period
    db_contract.date_signed = contract.date_signed
    db.commit()
    db.refresh(db_contract)
    return db_contract

def delete_contract(db: Session, contract_id: int):
    db_contract = get_contract(db, contract_id)
    if not db_contract:
        return None
    db.delete(db_contract)
    db.commit()
    return db_contract
