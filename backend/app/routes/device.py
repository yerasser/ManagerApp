from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.schemas.device import Device, DeviceCreate
from app.schemas.users import User
from app.crud import device as crud_devices
from app.deps import get_db, get_current_user
from app.schemas.device import DeviceProposal, DeviceProposalCreate

router = APIRouter()


@router.get("/", response_model=list[Device])
def read_devices(
    name: str = "",
    type: str = "",
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud_devices.get_devices(db, name, type)

@router.get("/{device_id}", response_model=Device)
def read_device(
    device_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_device = crud_devices.get_device(db, device_id)
    if not db_device:
        raise HTTPException(status_code=404, detail="Устройство не найдено")
    return db_device
@router.post("/", response_model=Device, status_code=status.HTTP_201_CREATED)
def create_device(
    device: DeviceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return crud_devices.create_device(db, device)

@router.put("/{device_id}", response_model=Device)
def update_device(
    device_id: int,
    device: DeviceCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_device = crud_devices.update_device(db, device_id, device)
    if not db_device:
        raise HTTPException(status_code=404, detail="Устройство не найдено")
    return db_device

@router.delete("/{device_id}", response_model=Device)
def delete_device(
    device_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_device = crud_devices.delete_device(db, device_id)
    if not db_device:
        raise HTTPException(status_code=404, detail="Устройство не найдено")
    return db_device

@router.post("/proposals/", response_model=DeviceProposal)
def create_device_proposal(
    proposal: DeviceProposalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "member":
        raise HTTPException(
            status_code=403,
            detail="Only members can create device proposals"
        )
    return crud_devices.create_device_proposal(db, proposal, current_user.id)

@router.get("/proposals/", response_model=list[DeviceProposal])
def get_device_proposals(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    is_reviewer = current_user.role == "admin"
    return crud_devices.get_device_proposals(db, current_user.id, is_reviewer)

@router.put("/proposals/{proposal_id}/status", response_model=DeviceProposal)
def update_proposal_status(
    proposal_id: int,
    status: str,
    comment: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Only admins can update proposal status"
        )
    if status not in ["approved", "rejected"]:
        raise HTTPException(
            status_code=400,
            detail="Invalid status"
        )
    
    result = crud_devices.update_proposal_status(db, proposal_id, status, comment)
    if not result:
        raise HTTPException(
            status_code=404,
            detail="Proposal not found"
        )
    return result

@router.get("/proposals/filter/", response_model=list[DeviceProposal])
def filter_proposals(
    status: str = None,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role == "admin":
        return crud_devices.get_proposals_by_status(
            db,
            status=status,
            reviewer_id=current_user.id
        )
    return crud_devices.get_proposals_by_status(
        db,
        status=status,
        creator_id=current_user.id
    )

@router.put("/proposals/{proposal_id}", response_model=DeviceProposal)
def update_device_proposal(
    proposal_id: int,
    proposal: DeviceProposalCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_proposal = crud_devices.get_device_proposal(db, proposal_id)
    if not db_proposal:
        raise HTTPException(
            status_code=404,
            detail="Proposal not found"
        )
    
    if (db_proposal.created_by != current_user.id and 
        current_user.role != "admin"):
        raise HTTPException(
            status_code=403,
            detail="Not authorized to update this proposal"
        )
    
    if db_proposal.status != "pending":
        raise HTTPException(
            status_code=400,
            detail="Can only update pending proposals"
        )
    
    updated_proposal = crud_devices.update_device_proposal(
        db,
        proposal_id,
        proposal
    )
    
    if not updated_proposal:
        raise HTTPException(
            status_code=400,
            detail="Failed to update proposal"
        )
    
    return updated_proposal
