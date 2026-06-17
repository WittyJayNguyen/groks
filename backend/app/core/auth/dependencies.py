from __future__ import annotations

from fastapi import Depends, Header, HTTPException
from sqlalchemy.orm import Session

from app import models
from app.core.security import decode_access_token, hash_api_key, parse_bearer_token
from app.database import get_db


def current_user(authorization: str | None = Header(default=None), db: Session = Depends(get_db)) -> models.User:
    token = parse_bearer_token(authorization)
    if not token:
        raise HTTPException(status_code=401, detail="invalid_credentials")
    user_id = decode_access_token(token)
    user = db.get(models.User, user_id) if user_id else None
    if not user:
        raise HTTPException(status_code=401, detail="invalid_credentials")
    return user


def current_key(
    x_api_key: str | None = Header(default=None),
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db),
) -> models.ApiKey:
    raw = x_api_key or parse_bearer_token(authorization)
    if not raw:
        raise HTTPException(status_code=401, detail="invalid_api_key")
    key = db.query(models.ApiKey).filter_by(key_hash=hash_api_key(raw), active=True).first()
    if not key:
        raise HTTPException(status_code=401, detail="invalid_api_key")
    return key


def current_organization_id(x_organization_id: str | None = Header(default=None)) -> str | None:
    return x_organization_id
