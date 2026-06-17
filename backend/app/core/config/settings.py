from __future__ import annotations

from dataclasses import dataclass
import os
from pathlib import Path


def csv_env(name: str, default: str) -> tuple[str, ...]:
    raw = os.getenv(name, default)
    return tuple(item.strip() for item in raw.split(",") if item.strip())


def bool_env(name: str, default: bool) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "on"}


@dataclass(frozen=True)
class Settings:
    app_name: str = "Groks API"
    app_version: str = "0.1.0"
    data_dir: Path = Path(os.getenv("GROKS_DATA_DIR", Path(__file__).resolve().parents[3] / "data"))
    cors_origins: tuple[str, ...] = csv_env("GROKS_CORS_ORIGINS", "*")
    secret_key: str = os.getenv("GROKS_SECRET_KEY", "dev-change-me")
    jwt_algorithm: str = "HS256"
    mock_provider: bool = bool_env("GROKS_MOCK_PROVIDER", True)

    @property
    def database_url(self) -> str:
        return os.getenv("GROKS_DATABASE_URL", f"sqlite:///{self.data_dir / 'groks.db'}")

    @property
    def storage_dir(self) -> Path:
        return Path(os.getenv("GROKS_STORAGE_DIR", self.data_dir / "files"))


settings = Settings()
