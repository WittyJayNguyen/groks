from __future__ import annotations

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app import models
from app.provider import derive_mode
from app.schemas.requests import GenerateIn
from app.schemas.serializers import job_status, log_out


def create_dashboard_job(db: Session, user: models.User, payload: GenerateIn) -> dict:
    key = db.query(models.ApiKey).filter_by(user_id=user.id, active=True).first()
    if not key:
        raise HTTPException(status_code=403, detail="api_key_required")
    return create_job(db, user.id, key.id, payload, "Job queued (pool_manager)")


def create_client_job(db: Session, key: models.ApiKey, payload: GenerateIn) -> dict:
    job = _build_job(key.user_id, key.id, payload)
    db.add(job)
    db.flush()
    db.add(models.JobLog(job_id=job.id, message="Job queued (api_key_pool)"))
    db.commit()
    return {"task_id": job.id, "status": job.status, "target": job.target}


def create_job(db: Session, user_id: str, api_key_id: str, payload: GenerateIn, log_message: str) -> dict:
    job = _build_job(user_id, api_key_id, payload)
    db.add(job)
    db.flush()
    db.add(models.JobLog(job_id=job.id, message=log_message))
    db.commit()
    return job_status(job)


def _build_job(user_id: str, api_key_id: str, payload: GenerateIn) -> models.Job:
    return models.Job(
        user_id=user_id,
        api_key_id=api_key_id,
        target=payload.target,
        mode=derive_mode(payload.target, payload.reference_images),
        prompt=payload.prompt,
        payload_json=payload.model_dump_json(),
        status="queued",
    )


def list_jobs(db: Session, user: models.User) -> list[dict]:
    jobs = db.query(models.Job).filter_by(user_id=user.id).order_by(models.Job.created_at.desc()).limit(100).all()
    return [job_status(job) | {"created_at": job.created_at, "pool_id": job.pool_id} for job in jobs]


def get_job_status(db: Session, key: models.ApiKey, task_id: str) -> dict:
    job = db.get(models.Job, task_id)
    if not job or job.user_id != key.user_id:
        raise HTTPException(status_code=404, detail="job_not_found")
    return job_status(job)


def list_job_logs(db: Session, user: models.User, job_id: str) -> list[dict]:
    job = db.get(models.Job, job_id)
    if not job or job.user_id != user.id:
        raise HTTPException(status_code=404, detail="job_not_found")
    return [{"created_at": log.created_at, "level": log.level, "message": log.message} for log in job.logs]


def list_logs(db: Session, user: models.User) -> list[dict]:
    logs = (
        db.query(models.JobLog)
        .join(models.Job, models.Job.id == models.JobLog.job_id)
        .filter(models.Job.user_id == user.id)
        .order_by(models.JobLog.created_at.desc())
        .limit(300)
        .all()
    )
    return [log_out(log) for log in logs]
