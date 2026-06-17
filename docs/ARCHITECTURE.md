# Kiến Trúc Groks

Groks dùng kiểu modular monolith sẵn sàng tách microservice. Frontend và backend build độc lập, còn từng feature/bounded context tự sở hữu state, service, helper và rule của nó.

## Frontend

Frontend chia theo nghiệp vụ người dùng:

- Auth
- Pool Manager
- Jobs
- API Keys
- Logs
- API Docs

Mỗi feature có cấu trúc:

```text
Feature.jsx
services/
store/
helpers/
composers/
index.js
```

`shared/` chỉ chứa thứ dùng chung thật sự. Nếu helper có nhắc tên nghiệp vụ như pool/job/api key thì helper đó thuộc feature, không đưa vào shared.

## Backend

Backend chia theo bounded context:

- Router: nhận request và trả response.
- Service: xử lý nghiệp vụ.
- Schema/serializer: định nghĩa request/response.
- Provider: xử lý gọi Grok provider hoặc mock provider.

`app/main.py` chỉ khởi tạo app, middleware, router registry và startup task. Business logic nằm trong service.

## Core

Core là phần nền ổn định:

- Backend: `backend/app/core/{config,security,auth}/`
- Frontend: `frontend/src/core/{auth,config,http}/`

Mọi module phải dùng core cho:

- settings/env
- token/session
- auth header
- current user
- API key auth
- endpoint config
- HTTP transport
- organization context

Xem thêm `AUTH_CORE.md`.

## Checklist Khi Thay Đổi Code

1. Xác định feature hoặc bounded context cần sửa.
2. Giữ thay đổi trong module đó nếu có thể.
3. Nếu đổi endpoint hoặc convention, cập nhật docs.
4. Build frontend/backend liên quan trước khi báo xong.
