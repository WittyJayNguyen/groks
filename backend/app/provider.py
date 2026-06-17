from __future__ import annotations

import asyncio
import base64
import json

from sqlalchemy.orm import Session

from app import models
from app.core.config import settings

settings.storage_dir.mkdir(parents=True, exist_ok=True)

ONE_PIXEL_PNG = base64.b64decode(
    "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMB/ax"
    "YpWQAAAAASUVORK5CYII="
)


def derive_mode(target: str, reference_images: list[str] | None) -> str:
    has_refs = bool(reference_images)
    if target == "video":
        return "i2v" if has_refs else "t2v"
    return "i2i" if has_refs else "t2i"


def create_result_file(db: Session, job: models.Job) -> models.File:
    ext = "mp4" if job.target == "video" else "png"
    mime = "video/mp4" if job.target == "video" else "image/png"
    content = (
        b"MOCK VIDEO RESULT\n" + json.dumps(json.loads(job.payload_json), ensure_ascii=False).encode()
        if job.target == "video"
        else ONE_PIXEL_PNG
    )
    path = settings.storage_dir / f"{job.id}.{ext}"
    path.write_bytes(content)
    file = models.File(
        user_id=job.user_id,
        job_id=job.id,
        file_name=f"groks_{job.mode}_{job.id}.{ext}",
        mime_type=mime,
        storage_path=str(path),
        file_size=len(content),
    )
    db.add(file)
    db.flush()
    return file


def choose_pool(db: Session, user_id: str, target: str) -> models.PoolCredential | None:
    q = db.query(models.PoolCredential).filter(
        models.PoolCredential.user_id == user_id,
        models.PoolCredential.active.is_(True),
        models.PoolCredential.running_jobs < models.PoolCredential.max_concurrent_jobs,
    )
    if target == "video":
        q = q.filter(models.PoolCredential.supports_video.is_(True))
    else:
        q = q.filter(models.PoolCredential.supports_image.is_(True))
    pools = q.order_by(models.PoolCredential.running_jobs.asc(), models.PoolCredential.created_at.asc()).all()
    return pools[0] if pools else None


async def process_job(db: Session, job: models.Job, pool: models.PoolCredential) -> None:
    job.status = "processing_provider"
    job.pool_id = pool.id
    pool.running_jobs += 1
    db.add(models.JobLog(job_id=job.id, message=f"Using pool {pool.name} ({pool.grok_user_id})"))
    db.commit()

    try:
        await asyncio.sleep(2 if job.target == "image" else 5)
        if settings.mock_provider:
            file = create_result_file(db, job)
        else:
            raise RuntimeError("Pure HTTP Grok provider is not configured. Set GROKS_MOCK_PROVIDER=1 or implement provider call.")
        job.status = "success"
        job.result_file_id = file.id
        db.add(models.JobLog(job_id=job.id, message=f"Job success: {file.file_size} bytes"))
    except Exception as exc:  # noqa: BLE001
        job.status = "failed"
        job.error_message = f"[provider_error] {exc}"
        pool.last_error = str(exc)
        db.add(models.JobLog(job_id=job.id, level="error", message=job.error_message))
    finally:
        pool.running_jobs = max(0, pool.running_jobs - 1)
        db.commit()
