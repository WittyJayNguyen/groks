from __future__ import annotations

from pathlib import Path

from fastapi import HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app import models


def download_file(db: Session, key: models.ApiKey, file_id: str) -> FileResponse:
    file = db.get(models.File, file_id)
    if not file or file.user_id != key.user_id:
        raise HTTPException(status_code=404, detail="file_not_found")
    return FileResponse(Path(file.storage_path), media_type=file.mime_type, filename=file.file_name)
