from __future__ import annotations

import base64
import hashlib
import hmac
import secrets


def hash_password(password: str) -> str:
    salt = secrets.token_bytes(16)
    digest = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 200_000)
    return base64.b64encode(salt + digest).decode()


def verify_password(password: str, stored: str) -> bool:
    raw = base64.b64decode(stored.encode())
    salt, digest = raw[:16], raw[16:]
    actual = hashlib.pbkdf2_hmac("sha256", password.encode(), salt, 200_000)
    return hmac.compare_digest(actual, digest)
