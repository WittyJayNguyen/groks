# Module Gọi API Frontend

Tất cả API call phải đi qua service của feature. Không gọi `api("/api/...")` trực tiếp trong component.

Đọc hướng dẫn đầy đủ cách tạo feature ở `MODULE_RULES.md`.

## Luồng Gọi API

```text
Component -> service của feature -> core/config + core/http -> Backend
```

## Các File Liên Quan

- `src/core/config/apiConfig.js`: khai báo API base URL và danh sách endpoint.
- `src/core/http/httpClient.js`: HTTP client, tự gắn auth header, JSON header và xử lý lỗi.
- `src/core/auth/authSession.js`: lưu token/session và organization id.
- `src/features/<feature>/services/<feature>Service.js`: hàm gọi API riêng của feature.
- `src/features/<feature>/store/use<Feature>.js`: hook quản lý state và load data.
- `src/features/<feature>/helpers/<feature>Helpers.js`: rule nhỏ, không gọi API.
- `src/features/<feature>/composers/<feature>Composer.jsx`: build payload, table rows, detail rows.

## Quy Tắc

- Component không gọi API trực tiếp.
- Component nên gọi qua `store/` hoặc function từ `services/`.
- Endpoint string đặt trong `API_ENDPOINTS`.
- Logic transport dùng chung đặt trong `core/http`.
- Body request riêng của feature nên build trong `composers/` hoặc `services/`.
- Nếu hai feature cùng dùng một API, chỉ tách thành service dùng chung sau khi có nhu cầu thật.

## Ví Dụ

Trong component hoặc store:

```js
const { data } = useAsyncResource(listPools);
```

Trong feature service:

```js
export function listPools() {
  return api(API_ENDPOINTS.pools.list);
}
```
