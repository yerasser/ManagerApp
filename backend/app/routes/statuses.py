from fastapi import APIRouter, Depends, HTTPException, status as http_status
from sqlalchemy.orm import Session
from app.schemas.statuses import Status, StatusCreate
from app.schemas.users import User
from app.crud import statuses as crud_statuses
from app.deps import get_db, get_current_user

router = APIRouter()


@router.get("/", response_model=list[Status])
def read_statuses(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud_statuses.get_statuses(db)

@router.get("/{status_id}", response_model=Status)
def read_status(
    status_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_status = crud_statuses.get_status(db, status_id)
    if not db_status:
        raise HTTPException(status_code=404, detail="Статус не найден")
    return db_status
@router.post("/", response_model=Status, status_code=http_status.HTTP_201_CREATED)
def create_status(
    status_in: StatusCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud_statuses.create_status(db, status_in)

@router.put("/{status_id}", response_model=Status)
def update_status(
    status_id: int,
    status_in: StatusCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_status = crud_statuses.update_status(db, status_id, status_in)
    if not db_status:
        raise HTTPException(status_code=404, detail="Статус не найден")
    return db_status

@router.delete("/{status_id}", response_model=Status)
def delete_status(
    status_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_status = crud_statuses.delete_status(db, status_id)
    if not db_status:
        raise HTTPException(status_code=404, detail="Статус не найден")
    return db_status
