from sqlalchemy.orm import Session
from app import models
from app.schemas.proposal_items import ProposalItemCreate


def get_proposal_item(db: Session, proposal_item_id: int):
    return db.query(models.ProposalItem).filter(models.ProposalItem.id == proposal_item_id).first()

def get_proposal_items_by_proposal(db: Session, proposal_id: int):
    return db.query(models.ProposalItem).filter(models.ProposalItem.proposal_id == proposal_id).all()

def recalc_proposal_total(db: Session, proposal: models.Proposal):
    total = sum(item.total for item in proposal.items) if proposal.items else 0
    proposal.total_amount = total
    db.commit()
    db.refresh(proposal)
    return proposal

def create_proposal_item(db: Session, proposal_item: ProposalItemCreate):
    db_item = models.ProposalItem(**proposal_item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    recalc_proposal_total(db, db_item.proposal)
    return db_item

def update_proposal_item(db: Session, proposal_item_id: int, proposal_item: ProposalItemCreate):
    db_item = get_proposal_item(db, proposal_item_id)
    if not db_item:
        return None
    for field, value in proposal_item.dict().items():
        setattr(db_item, field, value)
    db.commit()
    db.refresh(db_item)
    recalc_proposal_total(db, db_item.proposal)
    return db_item

def delete_proposal_item(db: Session, proposal_item_id: int):
    db_item = get_proposal_item(db, proposal_item_id)
    if not db_item:
        return None
    proposal = db_item.proposal
    db.delete(db_item)
    db.commit()
    recalc_proposal_total(db, proposal)
    return db_item
