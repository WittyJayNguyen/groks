from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models
from app.api.deps import current_key
from app.database import get_db
from app.services.file_service import download_file

router = APIRouter(prefix="/api/files", tags=["files"])


@router.get("/{file_id}")
def get_file(file_id: str, key: models.ApiKey = Depends(current_key), db: Session = Depends(get_db)):
    return download_file(db, key, file_id)
