from __future__ import annotations

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app import models
from app.core.auth import auth_session_payload, create_access_token, hash_password, message_envelope, verify_password
from app.schemas.requests import LoginIn, RegisterIn, ResetPasswordIn, SwitchOrganizationIn
from app.schemas.serializers import user_out


def register_user(db: Session, payload: RegisterIn) -> dict:
    if db.query(models.User).filter_by(email=payload.email).first():
        raise HTTPException(status_code=409, detail="email_exists")
    user = models.User(email=payload.email, name=payload.name, password_hash=hash_password(payload.password))
    db.add(user)
    db.commit()
    return auth_session_payload(user, create_access_token(user.id))


def login_user(db: Session, payload: LoginIn) -> dict:
    user = db.query(models.User).filter_by(email=payload.email).first()
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=401, detail="invalid_credentials")
    return auth_session_payload(user, create_access_token(user.id))


def forgot_password_out() -> dict:
    return message_envelope("Nếu email tồn tại, hệ thống sẽ gửi hướng dẫn đặt lại mật khẩu.")


def reset_password_out(payload: ResetPasswordIn) -> dict:
    if payload.password != payload.password_confirmation:
        raise HTTPException(status_code=422, detail="password_confirmation_mismatch")
    return message_envelope("Mật khẩu đã được đặt lại")


def logout_out() -> dict:
    return message_envelope("Đã đăng xuất")


def switch_organization_out(payload: SwitchOrganizationIn) -> dict:
    organization_id = payload.organization_id
    return message_envelope(
        "Đã chuyển tổ chức làm việc.",
        {
            "current_organization_id": organization_id,
            "current_organization": {"id": organization_id, "name": "Default"},
            "roles": [],
            "permissions": [],
            "abilities": [],
        },
    )


def me_out(db: Session, user: models.User) -> dict:
    api_key_count = db.query(models.ApiKey).filter_by(user_id=user.id, active=True).count()
    return user_out(user, has_api_key=api_key_count > 0)
