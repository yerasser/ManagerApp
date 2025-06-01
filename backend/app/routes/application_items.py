from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.application_items import ApplicationItem, ApplicationItemCreate, ApplicationItemDetailed
from app.schemas.users import User
from app.crud import application_items as crud_app_items
from app.deps import get_db, get_current_user
from app.utils import get_services_list

router = APIRouter()

@router.get("/", response_model=list[ApplicationItemDetailed])
def read_application_items(
    application_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    items = crud_app_items.get_application_items(db, application_id)

    result = []
    for db_item in items:
        db_item.services_list = get_services_list(db_item.device)
        result.append(db_item)

    return result

@router.get("/all", response_model=list[ApplicationItemDetailed])
def read_all_application_items(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    items = crud_app_items.get_all_application_items(db)

    result = []
    for db_item in items:
        db_item.services_list = get_services_list(db_item.device)
        result.append(db_item)

    return result

@router.get("/{application_item_id}", response_model=ApplicationItemDetailed)
def get_application_item_detail(
        application_item_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    db_item = crud_app_items.get_application_item(db, application_item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Элемент приложения не найден")

    db_item.services_list = get_services_list(db_item.device)
    return db_item

@router.post("/", response_model=ApplicationItem, status_code=status.HTTP_201_CREATED)
def create_application_item(
    item: ApplicationItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud_app_items.create_application_item(db, item)

@router.put("/{application_item_id}", response_model=ApplicationItem)
def update_application_item(
    application_item_id: int,
    item: ApplicationItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_item = crud_app_items.update_application_item(db, application_item_id, item)
    if not db_item:
        raise HTTPException(status_code=404, detail="Элемент приложения не найден")
    return db_item

@router.delete("/{application_item_id}", response_model=ApplicationItem)
def delete_application_item(
    application_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_item = crud_app_items.delete_application_item(db, application_item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Элемент приложения не найден")
    return db_item


