from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.proposals import Proposal, ProposalCreate, ProposalDetailed
from app.schemas.users import User
from app.crud import proposals as crud_proposals
from app.deps import get_db, get_current_user

router = APIRouter()

@router.get("/", response_model=list[ProposalDetailed])
def read_proposals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    items = crud_proposals.get_proposals(db)
    return items

@router.get("/filter", response_model=list[ProposalDetailed])
def read_proposals_by_filter(
    client_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    items = crud_proposals.get_proposals_by_clientid(db, client_id)
    return items

@router.get("/{proposal_id}", response_model=ProposalDetailed)
def read_proposal(
    proposal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    proposal = crud_proposals.get_proposal(db, proposal_id)
    if proposal is None:
        raise HTTPException(status_code=404, detail="КП не найдено")
    return proposal
@router.post("/", response_model=Proposal, status_code=status.HTTP_201_CREATED)
def create_proposal(
    proposal: ProposalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud_proposals.create_proposal(db, proposal, current_user.id)


@router.put("/{proposal_id}", response_model=Proposal)
def update_proposal(
    proposal_id: int,
    proposal: ProposalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_proposal = crud_proposals.update_proposal(db, proposal_id, proposal)
    if db_proposal is None:
        raise HTTPException(status_code=404, detail="КП не найдено")
    return db_proposal

@router.delete("/{proposal_id}", response_model=Proposal)
def delete_proposal(
    proposal_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_proposal = crud_proposals.delete_proposal(db, proposal_id)
    if db_proposal is None:
        raise HTTPException(status_code=404, detail="КП не найдено")
    return db_proposal
