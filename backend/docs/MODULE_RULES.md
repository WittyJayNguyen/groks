# Hướng Dẫn Module Backend

Tài liệu này dành cho người chưa quen backend. Mục tiêu là bạn có thể đọc code, tự thêm một module nhỏ, hoặc sửa bug mà không bị lạc.

## 1. Hiểu Backend Đang Chạy Như Thế Nào

Backend Groks dùng FastAPI. Khi frontend gọi API, request đi theo luồng:

```text
HTTP request
  -> app/api/<module>.py        Router nhận endpoint
  -> app/services/<module>.py   Service xử lý nghiệp vụ
  -> app/models.py              Database model nếu cần đọc/ghi DB
  -> app/schemas/serializers.py Định dạng response nếu cần
  -> HTTP response
```

Ví dụ khi frontend gọi `GET /api/pools`:

```text
app/api/pools.py
  -> pool_service.list_pools()
  -> models.PoolCredential
  -> serializers.pool_out()
```

## 2. Mỗi Layer Làm Gì

### Router: `app/api/*.py`

Router chỉ làm việc với HTTP:

- Định nghĩa đường dẫn: `GET /api/pools`
- Định nghĩa method: `GET`, `POST`, `PATCH`, `DELETE`
- Lấy dependency: user hiện tại, database session
- Gọi service

Router không nên chứa logic nghiệp vụ dài.

Ví dụ tốt:

```py
@router.get("")
def list_pools(user: models.User = Depends(current_user), db: Session = Depends(get_db)):
    return pool_service.list_pools(db, user)
```

Ví dụ không nên:

```py
@router.get("")
def list_pools(...):
    # Không viết query, validate nghiệp vụ, format response dài ở đây.
```

### Service: `app/services/*_service.py`

Service là nơi xử lý nghiệp vụ:

- Kiểm tra user có quyền với dữ liệu không
- Tạo, sửa, xóa dữ liệu
- Gọi serializer để trả response
- Ném lỗi `HTTPException` nếu dữ liệu không hợp lệ

Ví dụ:

```py
def delete_pool(db: Session, user: models.User, pool_id: str) -> None:
    pool = db.get(models.PoolCredential, pool_id)
    if not pool or pool.user_id != user.id:
        raise HTTPException(status_code=404, detail="pool_not_found")
    db.delete(pool)
    db.commit()
```

### Request Schema: `app/schemas/requests.py`

Schema dùng để định nghĩa body client gửi lên.

Ví dụ:

```py
class PoolIn(BaseModel):
    name: str
    grok_user_id: str
    cookies: dict[str, str] | list[dict[str, Any]]
```

FastAPI tự validate request. Nếu thiếu field hoặc sai kiểu dữ liệu, API tự trả lỗi `422`.

### Serializer: `app/schemas/serializers.py`

Serializer biến SQLAlchemy model thành JSON sạch cho frontend.

Ví dụ:

```py
def pool_out(pool: models.PoolCredential) -> dict[str, Any]:
    return {
        "id": pool.id,
        "name": pool.name,
        "active": pool.active,
    }
```

Không trả thẳng model nếu model có dữ liệu nhạy cảm như cookie, password hash, secret.

### Model: `app/models.py`

Model là cấu trúc bảng database.

Ví dụ:

```py
class ApiKey(Base):
    __tablename__ = "api_keys"
    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
```

Nếu thêm bảng mới thì thêm class mới vào `models.py`. Dự án hiện dùng SQLite và `Base.metadata.create_all`, chưa có migration tool.

### Core: `app/core/`

Core là nền ổn định, hạn chế sửa:

```text
app/core/config/    Settings/env
app/core/security/  Token, password, API key hash
app/core/auth/      current_user, current_key, auth response
```

Rule quan trọng:

- Không tự đọc `os.getenv()` trong service/router. Dùng `settings`.
- Không tự parse `Authorization`. Dùng `current_user` hoặc `current_key`.
- Không tự hash password/API key. Dùng `app.core.security`.

## 3. Cách Tạo Một Module Backend Mới

Ví dụ bạn muốn tạo module `notes` để user lưu ghi chú.

### Bước 1: Thêm model

Mở `app/models.py`, thêm:

```py
class Note(Base):
    __tablename__ = "notes"

    id: Mapped[str] = mapped_column(String(36), primary_key=True, default=uuid_str)
    user_id: Mapped[str] = mapped_column(String(36), ForeignKey("users.id"), index=True)
    title: Mapped[str] = mapped_column(String(255))
    content: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime] = mapped_column(DateTime, server_default=func.now())
```

Nếu dùng type hoặc column chưa import, thêm import ở đầu file.

### Bước 2: Thêm request schema

Mở `app/schemas/requests.py`, thêm:

```py
class NoteIn(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    content: str = ""
```

### Bước 3: Thêm serializer

Mở `app/schemas/serializers.py`, thêm:

```py
def note_out(note: models.Note) -> dict[str, Any]:
    return {
        "id": note.id,
        "title": note.title,
        "content": note.content,
        "created_at": note.created_at,
    }
```

### Bước 4: Tạo service

Tạo file `app/services/note_service.py`:

```py
from __future__ import annotations

from fastapi import HTTPException
from sqlalchemy.orm import Session

from app import models
from app.schemas.requests import NoteIn
from app.schemas.serializers import note_out


def list_notes(db: Session, user: models.User) -> list[dict]:
    notes = db.query(models.Note).filter_by(user_id=user.id).order_by(models.Note.created_at.desc()).all()
    return [note_out(note) for note in notes]


def create_note(db: Session, user: models.User, payload: NoteIn) -> dict:
    note = models.Note(user_id=user.id, title=payload.title, content=payload.content)
    db.add(note)
    db.commit()
    db.refresh(note)
    return note_out(note)


def update_note(db: Session, user: models.User, note_id: str, payload: NoteIn) -> dict:
    note = db.get(models.Note, note_id)
    if not note or note.user_id != user.id:
        raise HTTPException(status_code=404, detail="note_not_found")
    note.title = payload.title
    note.content = payload.content
    db.commit()
    db.refresh(note)
    return note_out(note)


def delete_note(db: Session, user: models.User, note_id: str) -> None:
    note = db.get(models.Note, note_id)
    if not note or note.user_id != user.id:
        raise HTTPException(status_code=404, detail="note_not_found")
    db.delete(note)
    db.commit()
```

### Bước 5: Tạo router

Tạo file `app/api/notes.py`:

```py
from __future__ import annotations

from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from app import models
from app.api.deps import current_user
from app.database import get_db
from app.schemas.requests import NoteIn
from app.services import note_service

router = APIRouter(prefix="/api/notes", tags=["notes"])


@router.get("")
def list_notes(user: models.User = Depends(current_user), db: Session = Depends(get_db)):
    return note_service.list_notes(db, user)


@router.post("", status_code=201)
def create_note(payload: NoteIn, user: models.User = Depends(current_user), db: Session = Depends(get_db)):
    return note_service.create_note(db, user, payload)


@router.patch("/{note_id}")
def update_note(note_id: str, payload: NoteIn, user: models.User = Depends(current_user), db: Session = Depends(get_db)):
    return note_service.update_note(db, user, note_id, payload)


@router.delete("/{note_id}", status_code=204)
def delete_note(note_id: str, user: models.User = Depends(current_user), db: Session = Depends(get_db)):
    note_service.delete_note(db, user, note_id)
    return Response(status_code=204)
```

### Bước 6: Đăng ký router

Mở `app/api/router.py`.

Thêm import:

```py
from app.api import notes
```

Thêm include:

```py
api_router.include_router(notes.router)
```

### Bước 7: Build lại backend

```bash
docker compose build backend
docker compose up -d --force-recreate backend
```

### Bước 8: Mở Swagger để test

Mở:

```text
http://localhost:18081/docs
```

Bạn sẽ thấy nhóm endpoint `notes`.

## 4. Cách Test Backend

### Cách 1: Test nhanh health

```bash
curl http://localhost:18081/health
```

Kết quả đúng:

```json
{"ok": true}
```

### Cách 2: Test bằng Swagger

1. Mở `http://localhost:18081/docs`
2. Chọn endpoint muốn test
3. Bấm `Try it out`
4. Nhập body
5. Bấm `Execute`

Với endpoint cần auth, bạn phải đăng nhập trước.

### Cách 3: Test login bằng curl

```bash
curl -X POST http://localhost:18081/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123"}'
```

Nếu chưa có user thì register:

```bash
curl -X POST http://localhost:18081/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password123","name":"Admin"}'
```

Response login/register có dạng:

```json
{
  "success": true,
  "message": "Đăng nhập thành công.",
  "data": {
    "access_token": "xxx",
    "token_type": "Bearer",
    "user": {}
  },
  "token": "xxx"
}
```

### Cách 4: Test endpoint cần auth

Lấy token từ response login/register, rồi gọi:

```bash
curl http://localhost:18081/api/pools \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Cách 5: Xem logs

```bash
docker compose logs -f backend
```

Nếu chỉ muốn xem vài dòng cuối:

```bash
docker compose logs --tail=120 backend
```

## 5. Cách Debug Khi Có Bug

### Bug 401 `invalid_credentials`

Nghĩa là token không hợp lệ hoặc thiếu header.

Kiểm tra:

```text
Authorization: Bearer YOUR_TOKEN
```

Đừng tự parse token trong router. Endpoint cần user thì dùng:

```py
user: models.User = Depends(current_user)
```

### Bug 401 `invalid_api_key`

Endpoint partner API cần `X-API-Key` hoặc bearer API key.

Kiểm tra:

```text
X-API-Key: uxpm_live_xxx
```

Endpoint dùng API key thì dùng:

```py
key: models.ApiKey = Depends(current_key)
```

### Bug 404 `*_not_found`

Thường do:

- ID sai
- Dữ liệu thuộc user khác
- Dữ liệu đã bị xóa

Trong service luôn kiểm tra ownership:

```py
if not item or item.user_id != user.id:
    raise HTTPException(status_code=404, detail="item_not_found")
```

### Bug 422 validation error

FastAPI báo body gửi lên sai schema.

Kiểm tra:

- Field có thiếu không
- Kiểu dữ liệu đúng không
- `Field(min_length=...)`, `Field(pattern=...)` có bị vi phạm không

### Bug 500 server error

Xem logs:

```bash
docker compose logs --tail=200 backend
```

Lần theo flow:

```text
Endpoint nào?
  -> Router nào?
  -> Service function nào?
  -> Query/model nào?
  -> Serializer nào?
```

## 6. Quy Tắc Viết Code Sạch

- Router mỏng, service xử lý chính.
- Service không trả SQLAlchemy model trực tiếp, dùng serializer.
- Không trả password hash, cookie raw, secret ra frontend.
- Không tự đọc env trong service/router, dùng `settings`.
- Không tự parse auth header, dùng `current_user` hoặc `current_key`.
- Khi thêm endpoint mới, cập nhật docs nếu frontend hoặc partner API cần biết.
- Khi sửa bug, ghi lại nguyên nhân và lệnh đã dùng để verify.

## 7. Checklist Trước Khi Báo Xong

Sau khi thêm/sửa backend:

```bash
docker compose build backend
docker compose up -d --force-recreate backend
docker compose ps
```

Nếu backend healthy là bước đầu ổn.

Test thêm endpoint vừa sửa bằng Swagger hoặc curl.

## 8. Nên Sửa File Nào Khi Gặp Việc Thường Gặp

| Bạn muốn làm gì | File thường cần sửa |
| --- | --- |
| Thêm endpoint mới | `app/api/<module>.py`, `app/services/<module>_service.py` |
| Thêm body request mới | `app/schemas/requests.py` |
| Đổi response trả về frontend | `app/schemas/serializers.py` |
| Thêm bảng database | `app/models.py` |
| Sửa auth/current user | `app/core/auth/` |
| Sửa token/password/API key hash | `app/core/security/` |
| Sửa env/config/path | `app/core/config/` |
| Sửa worker xử lý job | `app/services/worker.py`, `app/provider.py` |

## 9. Gợi Ý Cách Đọc Code

Nếu bạn không biết bắt đầu từ đâu:

1. Mở router trong `app/api/`.
2. Xem endpoint gọi service nào.
3. Mở service trong `app/services/`.
4. Xem service dùng model nào.
5. Xem response được build bằng serializer nào.

Ví dụ muốn hiểu Pool Manager:

```text
app/api/pools.py
app/services/pool_service.py
app/models.py -> PoolCredential
app/schemas/serializers.py -> pool_out
```
