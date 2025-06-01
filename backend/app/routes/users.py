from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from typing import List, Optional
from app import auth
from app.schemas.users import User, UserCreate, Token
from app.crud import users as crud_users
from app.deps import get_db

router = APIRouter()


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/users/token")

@router.get("/", response_model=List[User])
def get_users(
    role: Optional[str] = None, 
    token: str = Depends(oauth2_scheme), 
    db: Session = Depends(get_db)
):
    payload = auth.decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Неверный или просроченный токен")
  
    users = crud_users.get_users(db, role=role)
    return users

@router.post("/register", response_model=User)
def register(user: UserCreate, db: Session = Depends(get_db)):
    db_user = crud_users.get_user_by_username(db, username=user.username)
    if db_user:
        raise HTTPException(status_code=400, detail="Пользователь с таким именем уже существует")
    return crud_users.create_user(db=db, user=user)

@router.post("/token", response_model=Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = crud_users.get_user_by_username(db, username=form_data.username)
    if not user or not auth.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Неверное имя пользователя или пароль",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth.create_access_token(data={"sub": user.username})
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me", response_model=User)
def read_users_me(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    payload = auth.decode_access_token(token)
    if payload is None:
        raise HTTPException(status_code=401, detail="Неверный или просроченный токен")
    username: str = payload.get("sub")
    if username is None:
        raise HTTPException(status_code=401, detail="Неверный токен")
    user = crud_users.get_user_by_username(db, username=username)
    if user is None:
        raise HTTPException(status_code=404, detail="Пользователь не найден")
    return user
