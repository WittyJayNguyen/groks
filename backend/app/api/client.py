from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models
from app.api.deps import current_key
from app.database import get_db
from app.schemas.requests import ChatIn, GenerateIn
from app.services import job_service

router = APIRouter(prefix="/api/client", tags=["client-api"])


@router.get("/verify")
def client_verify(key: models.ApiKey = Depends(current_key)):
    return {"status": "ok", "name": key.name, "key_prefix": key.key_prefix}


@router.post("/chat")
async def client_chat(payload: ChatIn, key: models.ApiKey = Depends(current_key)):
    return {
        "message": f"[mock] {payload.prompt}",
        "conversation_id": "mock-conversation",
        "model": payload.model or "grok-3",
        "latency_ms": 25,
    }


@router.post("/generate", status_code=201)
def client_generate(payload: GenerateIn, key: models.ApiKey = Depends(current_key), db: Session = Depends(get_db)):
    return job_service.create_client_job(db, key, payload)


@router.get("/tasks/{task_id}/status")
def client_task_status(task_id: str, key: models.ApiKey = Depends(current_key), db: Session = Depends(get_db)):
    return job_service.get_job_status(db, key, task_id)
