from __future__ import annotations

from typing import Any

from app import models
from app.core.security import TOKEN_TYPE
from app.schemas.serializers import user_out


def auth_envelope(data: dict[str, Any], message: str = "OK") -> dict[str, Any]:
    return {"success": True, "message": message, "data": data}


def auth_session_payload(user: models.User, access_token: str) -> dict[str, Any]:
    data = {
        "access_token": access_token,
        "token_type": TOKEN_TYPE,
        "user": user_out(user),
        "available_organizations": [],
        "current_organization_id": None,
        "roles": [],
        "permissions": [],
        "abilities": [],
    }
    # Compatibility for older Groks UI code and partner scripts.
    return auth_envelope(data, "Đăng nhập thành công.") | {"token": access_token, "user": data["user"]}


def message_envelope(message: str, data: dict[str, Any] | None = None) -> dict[str, Any]:
    return auth_envelope(data or {}, message)
