from __future__ import annotations

from fastapi import APIRouter

from app.api import api_keys, auth, client, files, health, jobs, pools

api_router = APIRouter()
api_router.include_router(auth.router)
api_router.include_router(pools.router)
api_router.include_router(api_keys.router)
api_router.include_router(jobs.router)
api_router.include_router(client.router)
api_router.include_router(files.router)
api_router.include_router(health.router)
