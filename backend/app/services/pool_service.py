from __future__ import annotations

import json
from typing import Any

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app import models
from app.schemas.requests import PoolIn
from app.schemas.serializers import pool_out


def normalize_cookies(cookies: dict[str, str] | list[dict[str, Any]]) -> dict[str, str]:
    if isinstance(cookies, list):
        return {str(c["name"]): str(c["value"]) for c in cookies if isinstance(c, dict) and c.get("name")}
    return cookies


def list_pools(db: Session, user: models.User) -> list[dict]:
    pools = db.query(models.PoolCredential).filter_by(user_id=user.id).all()
    return [pool_out(pool) for pool in pools]


def create_pool(db: Session, user: models.User, payload: PoolIn) -> dict:
    cookies = normalize_cookies(payload.cookies)
    pool = models.PoolCredential(
        user_id=user.id,
        name=payload.name,
        grok_user_id=payload.grok_user_id,
        cookies_json=json.dumps(cookies, separators=(",", ":")),
        active=payload.active,
        max_concurrent_jobs=payload.max_concurrent_jobs,
        supports_image=payload.supports_image,
        supports_video=payload.supports_video,
    )
    db.add(pool)
    db.commit()
    db.refresh(pool)
    return pool_out(pool)


def update_pool(db: Session, user: models.User, pool_id: str, payload: PoolIn) -> dict:
    pool = db.get(models.PoolCredential, pool_id)
    if not pool or pool.user_id != user.id:
        raise HTTPException(status_code=404, detail="pool_not_found")
    pool.name = payload.name
    pool.grok_user_id = payload.grok_user_id
    pool.cookies_json = json.dumps(normalize_cookies(payload.cookies), separators=(",", ":"))
    pool.active = payload.active
    pool.max_concurrent_jobs = payload.max_concurrent_jobs
    pool.supports_image = payload.supports_image
    pool.supports_video = payload.supports_video
    db.commit()
    return pool_out(pool)


def delete_pool(db: Session, user: models.User, pool_id: str) -> None:
    pool = db.get(models.PoolCredential, pool_id)
    if not pool or pool.user_id != user.id:
        raise HTTPException(status_code=404, detail="pool_not_found")
    db.delete(pool)
    db.commit()
