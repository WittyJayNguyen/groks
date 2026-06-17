from __future__ import annotations

import asyncio

from app import models
from app.database import SessionLocal
from app.provider import choose_pool, process_job


async def worker_loop() -> None:
    while True:
        await asyncio.sleep(1)
        db = SessionLocal()
        try:
            job = db.query(models.Job).filter_by(status="queued").order_by(models.Job.created_at.asc()).first()
            if not job:
                continue
            pool = choose_pool(db, job.user_id, job.target)
            if not pool:
                db.add(models.JobLog(job_id=job.id, level="warning", message="Pool busy or empty, waiting"))
                db.commit()
                continue
            await process_job(db, job, pool)
        finally:
            db.close()
