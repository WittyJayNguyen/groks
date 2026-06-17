# Quy Tắc Commit

Dự án dùng Conventional Commits để lịch sử git dễ đọc và tự động hóa CI/CD về sau.

## Format

```text
<type>(<scope>): <message>
```

Ví dụ:

```text
feat(pool): add credential pool create modal
fix(auth): clear invalid token on 401
docs(frontend): add feature module guide
refactor(core): split auth and http core
ci(github): add branch workflow
```

## Type Hợp Lệ

```text
feat      thêm chức năng
fix       sửa lỗi
docs      sửa tài liệu
style     sửa format, không đổi logic
refactor  refactor code, không đổi hành vi
perf      tối ưu hiệu năng
test      thêm/sửa test
build     thay đổi build/dependency
ci        thay đổi CI/CD
chore     việc phụ trợ
revert    revert commit
```

## Scope

Scope nên là module bị ảnh hưởng:

```text
auth
pool
jobs
api-keys
logs
api-docs
core
backend
frontend
docker
github
docs
```

## Message

Quy tắc message:

- Viết ngắn gọn, rõ hành động.
- Dùng tiếng Anh ngắn cho commit để dễ tích hợp tool.
- Không viết hoa chữ đầu nếu không cần.
- Không thêm dấu chấm cuối câu.
- Một commit nên thể hiện một nhóm thay đổi có liên quan.

Đúng:

```text
feat(jobs): add polling for job status
fix(pool): validate cookies json before submit
docs(backend): add module creation guide
```

Không nên:

```text
update code
fix bug
done
WIP
```

## Commit Khi Nào

Nên commit khi:

- Hoàn thành một feature nhỏ.
- Sửa xong một bug cụ thể.
- Thêm docs độc lập.
- Refactor một vùng code rõ ràng.

Không nên gom quá nhiều thứ không liên quan vào một commit.

