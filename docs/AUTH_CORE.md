# Auth Core

Auth core là phần lõi ổn định để quản lý đăng nhập, token, session, API key và auth header cho cả backend lẫn frontend.

## Quy Tắc

Không sửa auth core cho các thay đổi feature thông thường. Feature mới phải dùng lại core, không tự viết logic parse token, lưu token, hash password hay đọc auth header.

## Backend Core

Vị trí:

```text
backend/app/core/
  config/
  security/
  auth/
```

Ý nghĩa:

- `core/config/`: cấu hình môi trường, đường dẫn data, database URL.
- `core/security/tokens.py`: tạo token, decode token, parse bearer token.
- `core/security/passwords.py`: hash và verify password.
- `core/security/api_keys.py`: tạo và hash API key partner.
- `core/auth/dependencies.py`: `current_user`, `current_key`, `current_organization_id`.
- `core/auth/responses.py`: format response auth chuẩn.

Router và service nên import từ `app.core.auth` hoặc `app.core.security`.

Các file cũ như `app/security.py` và `app/api/deps.py` chỉ còn là facade để tương thích code cũ.

## Frontend Core

Vị trí:

```text
frontend/src/core/
  auth/
  config/
  http/
```

Ý nghĩa:

- `core/auth/`: lưu token/session, organization id, auth header, normalize response auth.
- `core/config/`: API base URL và endpoint registry.
- `core/http/`: fetch client tự gắn auth header và xử lý lỗi.

Mọi request đi qua `core/http` sẽ tự gắn:

```text
Authorization: Bearer {access_token}
X-Organization-Id: {organization_id}
```

`X-Organization-Id` chỉ được gửi khi user đã chọn organization.

## Response Auth Chuẩn

Auth endpoint nên trả:

```json
{
  "success": true,
  "message": "Đăng nhập thành công.",
  "data": {
    "access_token": "xxx",
    "token_type": "Bearer",
    "user": {},
    "available_organizations": [],
    "current_organization_id": null,
    "roles": [],
    "permissions": [],
    "abilities": []
  }
}
```

Groks vẫn giữ thêm field `token` ở top-level để tương thích code cũ, nhưng code mới nên đọc token qua frontend auth core.
