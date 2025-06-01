from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.contracts import Contract, ContractCreate, ContractDetail
from app.schemas.users import User
from app.crud import contracts as crud_contracts
from app.deps import get_db, get_current_user

router = APIRouter()

@router.get("/", response_model=list[ContractDetail])
def read_contracts(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    items = crud_contracts.get_contracts(db)
    return items

@router.get("/{contract_id}", response_model=ContractDetail)
def read_contract(
    contract_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_contract = crud_contracts.get_contract(db, contract_id)
    if not db_contract:
        raise HTTPException(status_code=404, detail="Договор не найден")
    return db_contract
@router.post("/", response_model=Contract, status_code=status.HTTP_201_CREATED)
def create_contract(
    contract: ContractCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud_contracts.create_contract(db, contract, created_by=current_user.id)

@router.put("/{contract_id}", response_model=Contract)
def update_contract(
    contract_id: int,
    contract: ContractCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_contract = crud_contracts.update_contract(db, contract_id, contract)
    if not db_contract:
        raise HTTPException(status_code=404, detail="Договор не найден")
    return db_contract

@router.delete("/{contract_id}", response_model=Contract)
def delete_contract(
    contract_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_contract = crud_contracts.delete_contract(db, contract_id)
    if not db_contract:
        raise HTTPException(status_code=404, detail="Договор не найден")
    return db_contract
