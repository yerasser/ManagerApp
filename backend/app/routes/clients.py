# app/routes/clients.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.clients import Client, ClientCreate
from app.schemas.users import User
from app.crud import clients as crud_clients
from app.deps import get_db, get_current_user

router = APIRouter()


@router.get("/", response_model=list[Client])
def read_clients(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    clients = crud_clients.get_clients(db)
    return clients

@router.get("/{client_id}", response_model=Client)
def read_client(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_client = crud_clients.get_client(db, client_id=client_id)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Клиент не найден")
    return db_client

@router.post("/", response_model=Client, status_code=status.HTTP_201_CREATED)
def create_client(
    client: ClientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_client = crud_clients.get_client_by_bin(db, client.bin)
    if db_client:
        raise HTTPException(status_code=400, detail="Клиент с таким BIN уже существует")
    return crud_clients.create_client(db=db, client=client)

@router.put("/{client_id}", response_model=Client)
def update_client(
    client_id: int,
    client: ClientCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_client = crud_clients.update_client(db, client_id=client_id, client=client)
    if db_client is None:
        raise HTTPException(status_code=404, detail="Клиент не найден")
    return db_client


