from __future__ import annotations

from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app import models
from app.api.deps import current_user
from app.database import get_db
from app.schemas.requests import PoolIn
from app.services import pool_service

router = APIRouter(prefix="/api/pools", tags=["pools"])


@router.get("")
def list_pools(user: models.User = Depends(current_user), db: Session = Depends(get_db)):
    return pool_service.list_pools(db, user)


@router.post("", status_code=201)
def create_pool(payload: PoolIn, user: models.User = Depends(current_user), db: Session = Depends(get_db)):
    return pool_service.create_pool(db, user, payload)


@router.patch("/{pool_id}")
def update_pool(pool_id: str, payload: PoolIn, user: models.User = Depends(current_user), db: Session = Depends(get_db)):
    return pool_service.update_pool(db, user, pool_id, payload)


@router.delete("/{pool_id}", status_code=204)
def delete_pool(pool_id: str, user: models.User = Depends(current_user), db: Session = Depends(get_db)):
    pool_service.delete_pool(db, user, pool_id)
    return Response(status_code=204)
