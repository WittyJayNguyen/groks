from __future__ import annotations

from typing import Any

from app import models


def user_out(user: models.User, has_api_key: bool | None = None) -> dict[str, Any]:
    out = {"id": user.id, "email": user.email, "name": user.name}
    if has_api_key is not None:
        out["has_api_key"] = has_api_key
    return out


def pool_out(pool: models.PoolCredential) -> dict[str, Any]:
    return {
        "id": pool.id,
        "name": pool.name,
        "grok_user_id": pool.grok_user_id,
        "active": pool.active,
        "max_concurrent_jobs": pool.max_concurrent_jobs,
        "running_jobs": pool.running_jobs,
        "supports_image": pool.supports_image,
        "supports_video": pool.supports_video,
        "last_error": pool.last_error,
        "created_at": pool.created_at,
    }


def api_key_out(key: models.ApiKey) -> dict[str, Any]:
    return {
        "id": key.id,
        "name": key.name,
        "key_prefix": key.key_prefix,
        "active": key.active,
        "rate_limit_per_minute": key.rate_limit_per_minute,
        "created_at": key.created_at,
    }


def job_status(job: models.Job, base: str = "") -> dict[str, Any]:
    image_urls: list[str] = []
    video_urls: list[str] = []
    if job.result_file_id:
        url = f"{base}/api/files/{job.result_file_id}"
        if job.target == "video":
            video_urls.append(url)
        else:
            image_urls.append(url)
    return {
        "task_id": job.id,
        "status": job.status,
        "target": job.target,
        "mode": job.mode,
        "image_urls": image_urls,
        "video_urls": video_urls,
        "result": {"image_urls": image_urls, "video_urls": video_urls} if job.status == "success" else None,
        "error_message": job.error_message,
    }


def log_out(log: models.JobLog) -> dict[str, Any]:
    return {"job_id": log.job_id, "created_at": log.created_at, "level": log.level, "message": log.message}
