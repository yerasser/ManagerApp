from sqlalchemy.orm import Session
from app import models
from app.schemas.proposals import ProposalCreate

def get_proposal(db: Session, proposal_id: int):
    return db.query(models.Proposal).filter(models.Proposal.id == proposal_id).first()

def get_proposals(db: Session):
    return db.query(models.Proposal).all()

def get_proposals_by_clientid(db: Session, clientid: int):
    return db.query(models.Proposal).filter(models.Proposal.client_id == clientid).all()

def create_proposal(db: Session, proposal: ProposalCreate, current_user_id: int):
    db_proposal = models.Proposal(
        client_id=proposal.client_id,
        created_by=current_user_id,
        total_amount=0
    )
    db.add(db_proposal)
    db.commit()
    db.refresh(db_proposal)
    return db_proposal

def update_proposal(db: Session, proposal_id: int, proposal: ProposalCreate):
    db_proposal = get_proposal(db, proposal_id)
    if not db_proposal:
        return None
    db_proposal.client_id = proposal.client_id
    db_proposal.total_amount = proposal.total_amount
    db.commit()
    db.refresh(db_proposal)
    return db_proposal

def delete_proposal(db: Session, proposal_id: int):
    db_proposal = get_proposal(db, proposal_id)
    if not db_proposal:
        return None
    db.delete(db_proposal)
    db.commit()
    return db_proposal
