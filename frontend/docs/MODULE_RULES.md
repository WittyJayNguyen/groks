# Hướng Dẫn Module Frontend

Tài liệu này dành cho người chưa quen frontend React. Mục tiêu là bạn có thể đọc code, tự thêm một màn hình/module mới, hoặc sửa bug UI/API mà không bị lạc.

## 1. Frontend Đang Chạy Như Thế Nào

Groks frontend là React SPA chạy bằng Vite. Khi user thao tác trên màn hình, luồng thường là:

```text
User click / nhập form
  -> Screen của feature             src/features/<feature>/<Screen>.jsx
  -> Store của feature              src/features/<feature>/store/use<Feature>.js
  -> Service của feature            src/features/<feature>/services/<feature>Service.js
  -> Core HTTP + Core config        src/core/http + src/core/config
  -> Backend API
  -> Composer format data cho UI    src/features/<feature>/composers/
  -> Shared component render table/modal/badge
```

Ví dụ Pool Manager:

```text
PoolManager.jsx
  -> usePools()
  -> poolService.listPools()
  -> core/http.api()
  -> composePoolRows()
  -> DataTable
```

## 2. Mỗi Thư Mục Làm Gì

### `src/App.jsx`

File khởi động app. Chỉ quyết định:

- Có token thì vào `Shell`
- Chưa có token thì vào `AuthPage`

Không viết business logic trong đây.

### `src/app/`

Chứa layout chính:

- `Shell.jsx`: sidebar, topbar, page banner, chọn tab.
- `navigation.js`: danh sách menu.

Nếu muốn thêm menu mới, sửa `navigation.js` và map screen trong `Shell.jsx`.

### `src/core/`

Core là nền ổn định, hạn chế sửa tùy tiện.

```text
src/core/auth/    token/session/header/normalize auth response
src/core/config/  API base URL + endpoint registry
src/core/http/    fetch client, JSON header, error handling
```

Rule quan trọng:

- Không tự đọc/ghi `localStorage` token trong feature. Dùng `core/auth`.
- Không tự viết `fetch()` trong feature. Dùng `core/http`.
- Không hardcode endpoint rải rác. Thêm vào `core/config/apiConfig.js`.

### `src/features/<feature>/`

Mỗi feature là một module nhỏ. Cấu trúc bắt buộc:

```text
features/<feature>/
  <Screen>.jsx
  index.js
  services/
  store/
  helpers/
  composers/
```

Ý nghĩa:

- `<Screen>.jsx`: màn hình React, chỉ render và bắt event.
- `services/`: gọi API backend.
- `store/`: hook quản lý state, load data, polling, form state.
- `helpers/`: hàm nhỏ thuần logic.
- `composers/`: build payload, metric, row table, detail modal.
- `index.js`: export public của feature.

### `src/shared/`

Shared chỉ chứa thứ dùng chung, không dính nghiệp vụ riêng.

```text
shared/components/  Modal, DataTable, Badge, Metric...
shared/helpers/     format date/time, split lines...
shared/store/       hook dùng chung như useAsyncResource
```

Không đưa logic `pool`, `job`, `api key` vào shared.

## 3. Cách Đọc Một Feature

Ví dụ muốn hiểu `api-keys`:

```text
features/api-keys/ApiKeys.jsx
features/api-keys/store/useApiKeys.js
features/api-keys/services/apiKeyService.js
features/api-keys/composers/apiKeyComposer.jsx
features/api-keys/helpers/apiKeyHelpers.js
```

Đọc theo thứ tự:

1. Screen render gì?
2. Store giữ state gì?
3. Service gọi API nào?
4. Composer format dữ liệu ra table/modal thế nào?
5. Helper có rule nhỏ nào?

## 4. Cách Tạo Một Feature Mới

Ví dụ tạo feature `notes`.

### Bước 1: Tạo thư mục

```text
src/features/notes/
  Notes.jsx
  index.js
  services/noteService.js
  store/useNotes.js
  helpers/noteHelpers.js
  composers/noteComposer.jsx
```

### Bước 2: Thêm endpoint vào core config

Mở `src/core/config/apiConfig.js`, thêm:

```js
notes: {
  list: "/api/notes",
  create: "/api/notes",
  update: (noteId) => `/api/notes/${noteId}`,
  delete: (noteId) => `/api/notes/${noteId}`,
},
```

### Bước 3: Viết service

Tạo `features/notes/services/noteService.js`:

```js
import { API_ENDPOINTS } from "../../../core/config";
import { api } from "../../../core/http";

export function listNotes() {
  return api(API_ENDPOINTS.notes.list);
}

export function createNote(payload) {
  return api(API_ENDPOINTS.notes.create, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export function updateNote(noteId, payload) {
  return api(API_ENDPOINTS.notes.update(noteId), {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
}

export function deleteNote(noteId) {
  return api(API_ENDPOINTS.notes.delete(noteId), { method: "DELETE" });
}
```

Rule: service chỉ gọi API, không render JSX.

### Bước 4: Viết helper

Tạo `features/notes/helpers/noteHelpers.js`:

```js
export const defaultNoteForm = {
  title: "",
  content: "",
};

export function noteStatusTone(note) {
  return note.archived ? "muted" : "ok";
}
```

Helper là hàm nhỏ, dễ test, không gọi API.

### Bước 5: Viết composer

Tạo `features/notes/composers/noteComposer.jsx`:

```jsx
import { Badge } from "../../../shared/components";
import { formatDateTime } from "../../../shared/helpers/formatters";
import { noteStatusTone } from "../helpers/noteHelpers";

export function composeNotePayload(form) {
  return {
    title: form.title.trim(),
    content: form.content,
  };
}

export function composeNoteRows(notes, onSelect) {
  return notes.map((note) => ({
    key: note.id,
    onClick: () => onSelect(note),
    cells: [
      <b>{note.title}</b>,
      <span className="truncate">{note.content || "-"}</span>,
      <Badge tone={noteStatusTone(note)}>{note.archived ? "archived" : "active"}</Badge>,
    ],
  }));
}

export function composeNoteDetailRows(note) {
  return [
    ["ID", note.id],
    ["Title", note.title],
    ["Content", note.content || "-"],
    ["Created", formatDateTime(note.created_at)],
  ];
}
```

File composer có JSX thì dùng đuôi `.jsx`.

### Bước 6: Viết store hook

Tạo `features/notes/store/useNotes.js`:

```js
import { useState } from "react";
import { useAsyncResource } from "../../../shared/store/useAsyncResource";
import { defaultNoteForm } from "../helpers/noteHelpers";
import { listNotes } from "../services/noteService";

export function useNotes() {
  const resource = useAsyncResource(listNotes);
  const [form, setForm] = useState(defaultNoteForm);
  const [createOpen, setCreateOpen] = useState(false);
  const [selected, setSelected] = useState(null);

  return {
    ...resource,
    form,
    setForm,
    createOpen,
    setCreateOpen,
    selected,
    setSelected,
  };
}
```

Store là nơi giữ state của feature.

### Bước 7: Viết screen

Tạo `features/notes/Notes.jsx`:

```jsx
import { Plus } from "lucide-react";
import { DataTable, DetailGrid, Modal, TableHeader } from "../../shared/components";
import { composeNoteDetailRows, composeNotePayload, composeNoteRows } from "./composers/noteComposer";
import { defaultNoteForm } from "./helpers/noteHelpers";
import { createNote } from "./services/noteService";
import { useNotes } from "./store/useNotes";

export function Notes() {
  const { data: notes, reload, form, setForm, createOpen, setCreateOpen, selected, setSelected } = useNotes();

  async function create(event) {
    event.preventDefault();
    await createNote(composeNotePayload(form));
    setForm(defaultNoteForm);
    setCreateOpen(false);
    reload();
  }

  return (
    <div className="stack">
      <div className="panel">
        <TableHeader title="Notes" action={<button className="primary" onClick={() => setCreateOpen(true)}><Plus size={16} /> Add note</button>} />
        <DataTable
          columns={["Title", "Content", "Status"]}
          empty="No notes."
          rows={composeNoteRows(notes, setSelected)}
        />
      </div>

      <Modal title="Add note" open={createOpen} onClose={() => setCreateOpen(false)}>
        <form className="modalForm" onSubmit={create}>
          <input value={form.title} onChange={(event) => setForm({ ...form, title: event.target.value })} placeholder="Title" />
          <textarea value={form.content} onChange={(event) => setForm({ ...form, content: event.target.value })} placeholder="Content" />
          <button className="primary">Save</button>
        </form>
      </Modal>

      <Modal title="Note detail" open={Boolean(selected)} onClose={() => setSelected(null)}>
        {selected && <DetailGrid rows={composeNoteDetailRows(selected)} />}
      </Modal>
    </div>
  );
}
```

Screen chỉ nối các mảnh lại với nhau, không viết logic dài.

### Bước 8: Export feature

Tạo `features/notes/index.js`:

```js
export { Notes } from "./Notes";
```

### Bước 9: Thêm menu

Mở `src/app/navigation.js`, thêm item:

```js
["notes", "Notes", StickyNote],
```

Nhớ import icon:

```js
import { StickyNote } from "lucide-react";
```

Mở `src/app/Shell.jsx`, import screen:

```js
import { Notes } from "../features/notes";
```

Thêm vào map:

```js
const screens = { pool: PoolManager, jobs: Jobs, docs: ApiDocs, logs: Logs, keys: ApiKeys, notes: Notes };
```

## 5. Cách Gọi API Đúng Chuẩn

Không gọi API trực tiếp trong component:

```jsx
// Không nên
api("/api/notes")
```

Gọi qua service:

```js
// noteService.js
export function listNotes() {
  return api(API_ENDPOINTS.notes.list);
}
```

Trong screen/store:

```js
const { data } = useAsyncResource(listNotes);
```

## 6. Cách Dùng Shared Component

Shared component đang có:

```text
Badge
DataTable
DetailGrid
LoadBar
Metric
Modal
TableHeader
```

Import:

```js
import { DataTable, Modal, Badge } from "../../shared/components";
```

Khi tạo component mới:

1. Tạo file trong `src/shared/components/`.
2. Export trong `src/shared/components/index.js`.
3. Chỉ đưa vào shared nếu dùng được cho nhiều feature.

## 7. Cách Chạy Và Build FE

Chạy bằng Docker từ project root:

```bash
docker compose build frontend
docker compose up -d --force-recreate frontend
```

Chạy trực tiếp trong thư mục `frontend/`:

```bash
npm install
npm run dev
```

Build kiểm tra lỗi:

```bash
npm run build
```

Docker compose serve frontend ở:

```text
http://localhost:15181
```

## 8. Cách Debug Bug Frontend

### Màn hình trắng

Kiểm tra build:

```bash
docker compose build frontend
```

Nếu lỗi import, Vite sẽ chỉ file và dòng bị sai.

### Click không gọi API

Lần theo:

```text
Screen event
  -> function trong Screen
  -> feature service
  -> core/http
  -> backend endpoint
```

Kiểm tra service có gọi đúng endpoint trong `API_ENDPOINTS` không.

### API trả 401

Thường là mất token.

Kiểm tra:

- Login có gọi `saveAuthSession(out)` không
- `core/http` có tự gắn `Authorization` không
- Backend endpoint có cần `current_user` không

Không tự sửa localStorage trong feature. Sửa ở `src/core/auth` nếu thật sự cần.

### API trả 422

Body gửi lên sai schema backend.

Kiểm tra composer payload:

```text
features/<feature>/composers/<feature>Composer.jsx
```

Ví dụ `composeJobCreatePayload`, `composePoolCreatePayload`.

### Table không hiện dữ liệu

Kiểm tra:

1. Store có load data không?
2. Service trả data đúng không?
3. Composer rows có map đúng field không?
4. `DataTable` nhận đúng `rows` không?

### Modal không đóng/mở

Kiểm tra state trong store:

```js
const [createOpen, setCreateOpen] = useState(false);
const [selected, setSelected] = useState(null);
```

## 9. Quy Tắc Code Sạch

- Screen mỏng, không viết logic dài.
- API call chỉ nằm trong `services/`.
- State feature nằm trong `store/`.
- Build rows/detail/payload trong `composers/`.
- Logic nhỏ, không gọi API, để trong `helpers/`.
- Auth/token/header để trong `core/auth` và `core/http`.
- Endpoint để trong `core/config`.
- Component dùng chung để trong `shared/components`.
- Nếu file composer có JSX, đặt đuôi `.jsx`.
- Không import sâu qua module khác, dùng `features/<name>/index.js`.

## 10. Checklist Trước Khi Báo Xong

Sau khi sửa frontend:

```bash
docker compose build frontend
docker compose up -d --force-recreate frontend
docker compose ps
```

Nếu sửa endpoint/API:

1. Build backend nếu backend cũng thay đổi.
2. Mở browser kiểm tra flow.
3. Xem DevTools Network nếu API lỗi.
4. Xem backend logs nếu server lỗi.

## 11. Nên Sửa File Nào Khi Gặp Việc Thường Gặp

| Bạn muốn làm gì | File thường cần sửa |
| --- | --- |
| Thêm menu | `src/app/navigation.js`, `src/app/Shell.jsx` |
| Thêm màn hình mới | `src/features/<feature>/<Screen>.jsx` |
| Gọi API mới | `src/core/config/apiConfig.js`, `features/<feature>/services/` |
| Thêm state/form | `features/<feature>/store/` |
| Đổi table rows/modal detail | `features/<feature>/composers/` |
| Đổi rule nhỏ | `features/<feature>/helpers/` |
| Đổi token/auth header | `src/core/auth/`, `src/core/http/` |
| Thêm component dùng chung | `src/shared/components/` |
| Sửa style global | `src/styles.css` |

## 12. Gợi Ý Cách Đọc Code

Nếu bạn không biết bắt đầu từ đâu, đọc theo flow:

```text
src/app/Shell.jsx
  -> feature screen
  -> feature store
  -> feature service
  -> feature composer
  -> shared component
```

Ví dụ muốn hiểu Pool Manager:

```text
features/pools/PoolManager.jsx
features/pools/store/usePools.js
features/pools/services/poolService.js
features/pools/composers/poolComposer.jsx
features/pools/helpers/poolHelpers.js
shared/components/DataTable.jsx
```
