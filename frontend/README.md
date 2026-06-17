# Groks Frontend

Frontend Groks là ứng dụng React/Vite dạng SPA dùng để quản lý Pool, API Key, Job, Log và tài liệu API. Code được chia theo từng feature để dễ đọc, dễ sửa và sau này có thể tách nhỏ như micro-frontend nếu cần.

## Nếu Bạn Mới Học Frontend

Đọc theo thứ tự này:

1. `docs/MODULE_RULES.md`: hướng dẫn chi tiết cách tạo feature, gọi API, debug bug.
2. `src/app/Shell.jsx`: layout chính, menu và map màn hình.
3. `src/features/pools/PoolManager.jsx`: ví dụ screen dễ hiểu.
4. `src/features/pools/store/usePools.js`: ví dụ store quản lý state.
5. `src/features/pools/services/poolService.js`: ví dụ gọi API.
6. `src/features/pools/composers/poolComposer.jsx`: ví dụ build table rows/detail.
7. `src/shared/components/DataTable.jsx`: ví dụ component dùng chung.

## Cây Thư Mục Chính

- `src/App.jsx`: file khởi động app.
- `src/app/`: layout chính, navigation, shell.
- `src/features/<feature>/`: mỗi nghiệp vụ là một thư mục riêng.
  - `services/`: các hàm gọi API của feature đó.
  - `store/`: hook quản lý state, form, polling, load data.
  - `helpers/`: hàm nhỏ xử lý logic thuần.
  - `composers/`: build payload, table rows, metrics, detail rows.
- `src/core/`: lõi ổn định của app.
  - `auth/`: token, session, auth header, normalize response auth.
  - `config/`: API base URL và danh sách endpoint.
  - `http/`: HTTP client, gắn auth header, xử lý lỗi request.
- `src/shared/components/`: component dùng chung như `Modal`, `DataTable`, `Badge`.
- `src/shared/store/`: hook dùng chung.
- `src/shared/helpers/`: helper dùng chung.
- `src/styles.css`: style global.
- `nginx.conf`: cấu hình nginx để serve SPA.

## Quy Tắc Feature

Mỗi feature tự sở hữu state màn hình, API call, table row, modal form và detail view của nó.

Luồng chuẩn:

```text
Screen.jsx -> store/useFeature -> services/featureService
           -> composers/featureComposer
           -> helpers/featureHelpers
```

Khi thêm feature mới:

1. Tạo `src/features/<name>/<Name>.jsx`.
2. Tạo đủ `services/`, `store/`, `helpers/`, `composers/`.
3. Gọi API trong `services/<name>Service.js`.
4. Quản lý state/form trong `store/use<Name>.js`.
5. Build rows, metrics, detail rows, payload trong `composers/<name>Composer.jsx`.
6. Đặt rule nhỏ trong `helpers/<name>Helpers.js`.
7. Thêm endpoint vào `src/core/config/apiConfig.js`.
8. Đăng ký menu ở `src/app/navigation.js` và `src/app/Shell.jsx`.
9. Nếu đổi endpoint thì cập nhật docs backend/frontend liên quan.
10. Chạy build để kiểm tra.

Đọc hướng dẫn chi tiết ở `docs/MODULE_RULES.md`.

## Quy Tắc Import

Import screen qua file `index.js` của feature:

```js
import { Jobs } from "../features/jobs";
```

Không import sâu vào `store/`, `helpers/`, `composers/` của feature khác.

## Quy Tắc Auth/Core

- Dùng `src/core/auth` để quản lý token/session/auth header.
- Dùng `src/core/http` để gọi request.
- Dùng `src/core/config` để lấy endpoint.
- Component và feature service không được tự đọc/ghi token trong `localStorage`.

## Luồng Người Dùng Chính

1. User đăng nhập hoặc đăng ký.
2. User tạo API Key.
3. User tạo Grok credential pool bằng `grok_user_id` và cookies.
4. User tạo job image/video.
5. Worker backend tự chọn pool rảnh nhất.
6. User xem trạng thái job và system log.

## Lệnh Chạy

Chạy trong Docker từ thư mục project root:

```bash
docker compose build frontend
docker compose up -d --force-recreate frontend
```

Chạy trực tiếp trong thư mục `frontend/`:

```bash
npm install
npm run dev
npm run build
```

Frontend chạy ở:

```text
http://localhost:15181
```
