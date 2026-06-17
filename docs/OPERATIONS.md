# Vận Hành Groks

Groks chạy bằng hai service độc lập:

- `backend`: FastAPI API và background worker.
- `frontend`: React SPA được serve bằng nginx.

## Biến Môi Trường

Copy `.env.example` thành `.env` nếu muốn override cấu hình local.

| Biến | Mặc định | Ý nghĩa |
| --- | --- | --- |
| `GROKS_SECRET_KEY` | `change-me-local` | Khóa ký JWT. Nên đổi khi chạy ngoài local. |
| `GROKS_MOCK_PROVIDER` | `1` | Dùng mock provider để test flow. |
| `GROKS_CORS_ORIGINS` | `*` | Danh sách CORS origin, cách nhau bằng dấu phẩy. |
| `GROKS_BACKEND_PORT` | `18081` | Port backend trên máy host. |
| `GROKS_FRONTEND_PORT` | `15181` | Port frontend trên máy host. |
| `VITE_API_BASE` | `http://localhost:18081` | API base được build vào SPA. |

## Lệnh Thường Dùng

```bash
make build
make up
make ps
make logs
make restart
make down
```

Hoặc dùng trực tiếp Docker Compose:

```bash
docker compose build
docker compose up -d
docker compose ps
docker compose logs -f
```

## Kiểm Tra Sức Khỏe

- Backend: `GET /health`
- Frontend: `GET /health`

Docker Compose sẽ đợi backend healthy rồi mới start frontend.
