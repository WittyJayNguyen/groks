from __future__ import annotations

from typing import Any

from pydantic import BaseModel, EmailStr, Field


class RegisterIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    name: str = ""


class LoginIn(BaseModel):
    email: EmailStr
    password: str


class ForgotIn(BaseModel):
    email: EmailStr


class ResetPasswordIn(BaseModel):
    email: EmailStr
    password: str = Field(min_length=6)
    password_confirmation: str
    token: str


class SwitchOrganizationIn(BaseModel):
    organization_id: int | str


class PoolIn(BaseModel):
    name: str
    grok_user_id: str
    cookies: dict[str, str] | list[dict[str, Any]]
    max_concurrent_jobs: int = 2
    supports_image: bool = True
    supports_video: bool = True
    active: bool = True


class ApiKeyIn(BaseModel):
    name: str
    rate_limit_per_minute: int = 60


class GenerateIn(BaseModel):
    target: str = Field(pattern="^(image|video)$")
    prompt: str = Field(min_length=1, max_length=16000)
    ratio: str = "1:1"
    count: int = Field(1, ge=1, le=10)
    quality: str = "standard"
    duration: int | None = None
    reference_images: list[str] = []


class ChatIn(BaseModel):
    prompt: str = Field(min_length=1, max_length=16000)
    model: str | None = None
    project_id: str | None = None
