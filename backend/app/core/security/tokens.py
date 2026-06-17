from __future__ import annotations

from datetime import datetime, timedelta, timezone

from jose import JWTError, jwt

from app.core.config import settings

TOKEN_TYPE = "Bearer"


def create_access_token(user_id: str) -> str:
    payload = {
        "sub": user_id,
        "exp": datetime.now(timezone.utc) + timedelta(days=7),
    }
    return jwt.encode(payload, settings.secret_key, algorithm=settings.jwt_algorithm)


def decode_access_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, settings.secret_key, algorithms=[settings.jwt_algorithm])
        return str(payload.get("sub") or "")
    except JWTError:
        return None


def parse_bearer_token(authorization: str | None) -> str | None:
    if not authorization:
        return None
    parts = authorization.strip().split()
    if len(parts) >= 2 and parts[0].lower() == "bearer":
        # Accept "Bearer token" and the duplicated "Bearer Bearer token" style from some generated docs.
        return parts[-1]
    return None
