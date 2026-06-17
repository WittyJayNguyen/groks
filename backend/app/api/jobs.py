from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models
from app.api.deps import current_user
from app.database import get_db
from app.schemas.requests import GenerateIn
from app.services import job_service

router = APIRouter(prefix="/api", tags=["jobs"])


@router.post("/jobs", status_code=201)
def create_ui_job(payload: GenerateIn, user: models.User = Depends(current_user), db: Session = Depends(get_db)):
    return job_service.create_dashboard_job(db, user, payload)


@router.get("/jobs")
def list_jobs(user: models.User = Depends(current_user), db: Session = Depends(get_db)):
    return job_service.list_jobs(db, user)


@router.get("/jobs/{job_id}/logs")
def job_logs(job_id: str, user: models.User = Depends(current_user), db: Session = Depends(get_db)):
    return job_service.list_job_logs(db, user, job_id)


@router.get("/logs")
def all_logs(user: models.User = Depends(current_user), db: Session = Depends(get_db)):
    return job_service.list_logs(db, user)
