# Quy Tắc Commit

Dự án Groks dùng Conventional Commits để lịch sử Git dễ đọc, dễ review và dễ tự động hóa CI/CD.

## Format Chuẩn

```text
<type>(<scope>): <description> #<issue_id>

[body nếu cần]

[footer nếu cần]
```

Trong đó:

```text
type         bắt buộc, mô tả loại thay đổi
scope        nên có, mô tả module bị ảnh hưởng
description  bắt buộc, mô tả ngắn gọn mục đích commit
issue_id     phần lớn commit phải có, ví dụ #123 hoặc #GROKS-123
```

Ví dụ:

```text
feat(pool): thêm modal tạo credential #123
fix(auth): sửa lỗi token hết hạn #456
docs(frontend): cập nhật hướng dẫn tạo module #789
refactor(core): tách auth session khỏi http client #GROKS-12
vendor(docker): cập nhật phiên bản Redis #321
```

## Type Hợp Lệ

```text
feat      thêm chức năng mới
fix       sửa bug, vá lỗi trong codebase
refactor  sửa code nhưng không thêm feature và không đổi hành vi mong muốn
docs      thêm hoặc sửa tài liệu
chore     thay đổi nhỏ không liên quan trực tiếp tới logic sản phẩm
style     thay đổi format, CSS/UI, không đổi logic xử lý
perf      cải thiện hiệu năng
vendor    cập nhật dependency, package, image hoặc phiên bản thư viện
test      thêm hoặc sửa test
build     thay đổi build system
ci        thay đổi CI/CD
revert    revert commit trước đó
```

## Scope Gợi Ý

Scope nên là module hoặc vùng code bị ảnh hưởng:

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

## Description

Quy tắc viết description:

- Tối đa khoảng 50 ký tự nếu có thể.
- Không thêm dấu chấm cuối câu.
- Viết cùng một ngôn ngữ trong một commit.
- Mô tả rõ mục đích thay đổi, không viết chung chung.
- Nghĩ cho người đọc history sau này: nhìn một dòng phải hiểu commit làm gì.

Đúng:

```text
feat(jobs): thêm polling trạng thái job #102
fix(pool): validate cookies trước khi lưu #103
docs(backend): thêm hướng dẫn tạo module #104
```

Không nên:

```text
update code
fix bug
done
hihi
WIP
feat(logout): Fix bug ở chỗ đăng xuất
```

## Issue Id

Phần lớn commit phải gắn issue id ở cuối subject:

```text
#123
#GROKS-123
#POOL-456
```

Ví dụ:

```text
feat(auth): thêm màn hình quên mật khẩu #88
fix(jobs): sửa lỗi đảo pool khi quá tải #GROKS-91
```

Các commit có thể không cần issue id:

```text
docs: sửa lỗi chính tả trong README
chore: cập nhật ignore file local
```

Tuy nhiên, nếu thay đổi liên quan tới feature, bug, hotfix hoặc task sprint thì phải có issue id.

## Commit Khi Nào

Nên commit khi:

- Hoàn thành một feature nhỏ.
- Sửa xong một bug cụ thể.
- Thêm hoặc sửa docs độc lập.
- Refactor một vùng code rõ ràng.
- Cập nhật hạ tầng/CI có phạm vi rõ.

Không nên gom quá nhiều thay đổi không liên quan vào một commit.
