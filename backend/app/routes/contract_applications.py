from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.contract_applications import ContractApplication, ContractApplicationCreate, ContractApplicationDetail
from app.schemas.users import User
from app.crud import contract_applications as crud
from app.deps import get_db, get_current_user

router = APIRouter()

@router.get("/", response_model=list[ContractApplicationDetail])
def read_applications(
    contract_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.get_applications(db, contract_id)

@router.get("/{application_id}", response_model=ContractApplicationDetail)
def read_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_application = crud.get_application(db, application_id)
    if not db_application:
        raise HTTPException(status_code=404, detail="Приложение не найдено")
    return db_application
@router.post("/", response_model=ContractApplication, status_code=status.HTTP_201_CREATED)
def create_application(
    application: ContractApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud.create_application(db, application)


@router.put("/{application_id}", response_model=ContractApplication)
def update_application(
    application_id: int,
    application: ContractApplicationCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_application = crud.update_application(db, application_id, application)
    if not db_application:
        raise HTTPException(status_code=404, detail="Приложение не найдено")
    return db_application

@router.delete("/{application_id}", response_model=ContractApplication)
def delete_application(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_application = crud.delete_application(db, application_id)
    if not db_application:
        raise HTTPException(status_code=404, detail="Приложение не найдено")
    return db_application
