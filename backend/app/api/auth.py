from __future__ import annotations

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models
from app.api.deps import current_user
from app.database import get_db
from app.schemas.requests import ForgotIn, LoginIn, RegisterIn, ResetPasswordIn, SwitchOrganizationIn
from app.services.auth_service import forgot_password_out, login_user, logout_out, me_out, register_user, reset_password_out, switch_organization_out

router = APIRouter(prefix="/api", tags=["auth"])


@router.post("/auth/register")
def register(payload: RegisterIn, db: Session = Depends(get_db)):
    return register_user(db, payload)


@router.post("/auth/login")
def login(payload: LoginIn, db: Session = Depends(get_db)):
    return login_user(db, payload)


@router.post("/auth/forgot-password")
def forgot_password(payload: ForgotIn):
    return forgot_password_out()


@router.post("/auth/reset-password")
def reset_password(payload: ResetPasswordIn):
    return reset_password_out(payload)


@router.post("/auth/logout")
def logout(user: models.User = Depends(current_user)):
    return logout_out()


@router.post("/auth/switch-organization")
def switch_organization(payload: SwitchOrganizationIn, user: models.User = Depends(current_user)):
    return switch_organization_out(payload)


@router.get("/me")
def me(user: models.User = Depends(current_user), db: Session = Depends(get_db)):
    return me_out(db, user)
