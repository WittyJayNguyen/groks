"""Stable authentication core.

Do not edit this package for feature work. Add app-specific auth behavior in services
or adapters that call this core.
"""

from app.core.auth.dependencies import current_key, current_organization_id, current_user
from app.core.auth.responses import auth_envelope, auth_session_payload, message_envelope
from app.core.security import (
    TOKEN_TYPE,
    create_access_token,
    decode_access_token,
    hash_api_key,
    hash_password,
    make_api_key,
    parse_bearer_token,
    verify_password,
)

__all__ = [
    "TOKEN_TYPE",
    "auth_envelope",
    "auth_session_payload",
    "create_access_token",
    "current_key",
    "current_organization_id",
    "current_user",
    "decode_access_token",
    "hash_api_key",
    "hash_password",
    "make_api_key",
    "message_envelope",
    "parse_bearer_token",
    "verify_password",
]
