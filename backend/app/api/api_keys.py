from __future__ import annotations

from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app import models
from app.api.deps import current_user
from app.database import get_db
from app.schemas.requests import ApiKeyIn
from app.services import api_key_service

router = APIRouter(prefix="/api/api-keys", tags=["api-keys"])


@router.get("")
def list_api_keys(user: models.User = Depends(current_user), db: Session = Depends(get_db)):
    return api_key_service.list_api_keys(db, user)


@router.post("", status_code=201)
def create_api_key(payload: ApiKeyIn, user: models.User = Depends(current_user), db: Session = Depends(get_db)):
    return api_key_service.create_api_key(db, user, payload)


@router.delete("/{key_id}", status_code=204)
def revoke_api_key(key_id: str, user: models.User = Depends(current_user), db: Session = Depends(get_db)):
    api_key_service.revoke_api_key(db, user, key_id)
    return Response(status_code=204)
