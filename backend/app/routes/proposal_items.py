from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.proposal_items import ProposalItem, ProposalItemCreate, ProposalItemDetailed
from app.schemas.users import User
from app.crud import proposal_items as crud_proposal_items
from app.deps import get_db, get_current_user
from app import schemas
from app.utils import get_services_list

router = APIRouter()


@router.get("/", response_model=list[ProposalItemDetailed])
def read_proposal_items(
    proposal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    items = crud_proposal_items.get_proposal_items_by_proposal(db, proposal_id)

    result = []
    for db_item in items:
        db_item.services_list = get_services_list(db_item.device)
        result.append(db_item)

    return result


@router.get("/{proposal_item_id}", response_model=ProposalItemDetailed)
def get_proposal_item_detail(
        proposal_item_id: int,
        db: Session = Depends(get_db),
        current_user: User = Depends(get_current_user)
):
    db_item = crud_proposal_items.get_proposal_item(db, proposal_item_id)
    if not db_item:
        raise HTTPException(status_code=404, detail="Позиция КП не найдена")
    db_item.services_list = get_services_list(db_item.device)
    return db_item
@router.post("/", response_model=ProposalItem, status_code=status.HTTP_201_CREATED)
def create_proposal_item(
    item: ProposalItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud_proposal_items.create_proposal_item(db, item)

@router.put("/{proposal_item_id}", response_model=ProposalItem)
def update_proposal_item(
    proposal_item_id: int,
    item: ProposalItemCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_item = crud_proposal_items.update_proposal_item(db, proposal_item_id, item)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Позиция КП не найдена")
    return db_item

@router.delete("/{proposal_item_id}", response_model=ProposalItem)
def delete_proposal_item(
    proposal_item_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_item = crud_proposal_items.delete_proposal_item(db, proposal_item_id)
    if db_item is None:
        raise HTTPException(status_code=404, detail="Позиция КП не найдена")
    return db_item
