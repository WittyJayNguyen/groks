from __future__ import annotations

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app import models
from app.schemas.requests import ApiKeyIn
from app.schemas.serializers import api_key_out
from app.security import make_api_key


def list_api_keys(db: Session, user: models.User) -> list[dict]:
    keys = db.query(models.ApiKey).filter_by(user_id=user.id).all()
    return [api_key_out(key) for key in keys]


def create_api_key(db: Session, user: models.User, payload: ApiKeyIn) -> dict:
    raw, prefix, digest = make_api_key()
    key = models.ApiKey(
        user_id=user.id,
        name=payload.name,
        key_prefix=prefix,
        key_hash=digest,
        rate_limit_per_minute=payload.rate_limit_per_minute,
    )
    db.add(key)
    db.commit()
    return {"api_key": raw, "id": key.id, "name": key.name, "key_prefix": key.key_prefix, "active": key.active}


def revoke_api_key(db: Session, user: models.User, key_id: str) -> None:
    key = db.get(models.ApiKey, key_id)
    if not key or key.user_id != user.id:
        raise HTTPException(status_code=404, detail="key_not_found")
    key.active = False
    db.commit()
