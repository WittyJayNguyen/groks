# Groks Backend

Backend Groks dùng FastAPI và được tổ chức theo kiểu modular monolith. Mỗi vùng nghiệp vụ được chia rõ để sau này có thể tách thành microservice mà không phải đổi hợp đồng HTTP.

## Nếu Bạn Mới Học Backend

Đọc theo thứ tự này:

1. `docs/MODULE_RULES.md`: hướng dẫn chi tiết cách tạo module, test, debug bug.
2. `app/api/pools.py`: ví dụ router dễ hiểu.
3. `app/services/pool_service.py`: ví dụ service xử lý nghiệp vụ.
4. `app/schemas/requests.py`: nơi định nghĩa request body.
5. `app/schemas/serializers.py`: nơi định nghĩa response trả về frontend.

## Sơ Đồ Thư Mục

- `app/main.py`: tạo app, gắn middleware, đăng ký router, chạy worker khi startup.
- `app/api/`: router FastAPI. Router nhận request rồi gọi service.
- `app/api/router.py`: nơi gom tất cả router.
- `app/api/deps.py`: dependency request như current user và API key auth.
- `app/services/`: xử lý nghiệp vụ và workflow.
- `app/schemas/requests.py`: định nghĩa body request bằng Pydantic.
- `app/schemas/serializers.py`: chuyển ORM model thành response JSON.
- `app/core/`: lõi ổn định của app.
  - `config/`: settings và đọc biến môi trường.
  - `security/`: hash password, bearer token, hash API key.
  - `auth/`: dependency request và response auth chuẩn.
- `app/models.py`: model database SQLAlchemy.
- `app/provider.py`: chọn pool, mock provider và nơi nối Grok provider thật.
- `app/database.py`: cấu hình database engine/session.

## Quy Tắc Theo Layer

- Router: khai báo HTTP path, status code, dependency.
- Service: xử lý nghiệp vụ, kiểm tra quyền sở hữu dữ liệu, ghi database.
- Serializer: định nghĩa response trả về.
- Model: chỉ mô tả bảng database.
- Provider: gọi Grok thật hoặc mock provider.

Không đặt workflow nghiệp vụ dài trong router. Không import FastAPI vào provider/model nếu không thật sự cần.

Xem `docs/MODULE_RULES.md` để biết checklist tạo module mới.

## Quy Tắc Config

Dùng `app.core.config.settings` cho mọi cấu hình môi trường và filesystem. Không đọc `os.getenv()` trực tiếp trong service, router, provider hoặc database module.

## Quy Tắc Auth Core

Dùng `app.core.auth` và `app.core.security` cho hash password, parse token, current user, current API key và auth response envelope. Không viết logic parse auth mới trong router/service.

## Các Vùng Nghiệp Vụ

- `auth`: đăng ký, đăng nhập, quên mật khẩu, current user.
- `pools`: quản lý Grok credential pool.
- `api_keys`: vòng đời API key partner.
- `jobs`: queue job và log trên dashboard.
- `client`: endpoint partner API bên ngoài.
- `files`: tải file kết quả.

## Quy Tắc Scrum/Microservice Nhẹ

- Một story nên ưu tiên nằm trong một bounded context.
- Nếu sửa endpoint, cập nhật API Docs frontend và README này khi hành vi thay đổi.
- Service nên đủ nhỏ để sau này có thể tách thành microservice.
- Tích hợp provider production nên nằm sau `provider.py` hoặc provider adapter.

## Luồng Job Chính

1. Dashboard hoặc partner API tạo job ở trạng thái queued.
2. `services.worker.worker_loop` đọc các job queued.
3. `provider.choose_pool` chọn pool phù hợp có tải thấp nhất.
4. `provider.process_job` đánh dấu processing, tạo kết quả, ghi log success/failure.
5. Endpoint status format job qua `schemas.serializers.job_status`.

## Lệnh Chạy Local

Chạy bằng Docker từ thư mục project root:

```bash
docker compose build backend
docker compose up -d --force-recreate backend
docker compose logs -f backend
```

Chạy trực tiếp khi đang ở thư mục `backend/`:

```bash
uvicorn app.main:app --reload
```

Docker compose serve backend tại `http://localhost:18081`.

Swagger docs:

```text
http://localhost:18081/docs
```
