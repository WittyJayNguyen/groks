# Groks

Groks là SPA admin + FastAPI backend cho quản lý Grok credential pool thuần `userId + cookies`.

Không có VNC/profile/browser automation trong model hoặc luồng job. Worker chọn pool đang rảnh nhất và tự đảo pool khi pool hiện tại đã đủ `max_concurrent_jobs`.

## Các Dịch Vụ

```text
frontend/  React SPA được serve bằng nginx
backend/   FastAPI API và background worker
docs/      tài liệu kiến trúc, vận hành, core
```

## Chạy nhanh

```bash
cp .env.example .env
make build
make up
```

- Frontend: http://localhost:15181
- Backend: http://localhost:18081
- Swagger: http://localhost:18081/docs

Không dùng `make` cũng được:

```bash
docker compose up -d --build
```

## Chức năng

- Đăng nhập, đăng ký, quên mật khẩu
- Pool Manager: quản lý Grok credential pool bằng `grok_user_id + cookies`
- Job: T2I, I2I, T2V, I2V; yêu cầu có API key trước
- API Docs: 5 endpoint partner pure HTTP
- Quản lý log job
- API Key: tạo/revoke key cho partner API và unlock menu Job

## Partner API

```bash
curl http://localhost:18081/api/client/verify \
  -H "X-API-Key: uxpm_live_xxx"

curl -X POST http://localhost:18081/api/client/generate \
  -H "X-API-Key: uxpm_live_xxx" \
  -H "Content-Type: application/json" \
  -d '{"target":"image","prompt":"a cat in space","ratio":"1:1"}'
```

`GROKS_MOCK_PROVIDER=1` tạo file mock để kiểm thử flow. Khi nối provider Grok pure HTTP thật, đặt biến này thành `0` và triển khai phần gọi upstream trong `backend/app/provider.py`.

## Tài Liệu

- [Kiến trúc](docs/ARCHITECTURE.md)
- [Vận hành](docs/OPERATIONS.md)
- [Auth Core](docs/AUTH_CORE.md)
- [Quản lý project trên GitHub](docs/PROJECT_MANAGEMENT.md)
- [Quy trình Gitflow prod/staging/dev](docs/GIT_WORKFLOW.md)
- [Quy tắc Commit có issue id](docs/COMMIT_CONVENTION.md)
- [Quy tắc frontend](frontend/README.md)
- [Quy tắc backend](backend/README.md)
