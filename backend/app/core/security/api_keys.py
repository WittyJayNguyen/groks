from __future__ import annotations

import hashlib
import secrets


def make_api_key() -> tuple[str, str, str]:
    raw = "uxpm_live_" + secrets.token_urlsafe(30)
    prefix = raw[:18]
    digest = hash_api_key(raw)
    return raw, prefix, digest


def hash_api_key(raw: str) -> str:
    return hashlib.sha256(raw.encode()).hexdigest()
