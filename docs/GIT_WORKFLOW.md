# Quy Trình Gitflow Của Groks

Tài liệu này là quy chuẩn làm việc Git cho dự án Groks. Mục tiêu là giữ code production ổn định, có môi trường staging để QA/demo, và mọi thay đổi đều đi qua review.

## Nhánh Chính

Repo dùng 3 nhánh chính:

```text
prod      code đang hoặc sẵn sàng chạy production
staging   code để QA, kiểm thử, demo trước khi release
dev       nhánh tích hợp chính cho team phát triển
```

Quy tắc:

- Không commit trực tiếp vào `prod`.
- Không commit trực tiếp vào `staging`.
- Feature/fix thông thường phải đi từ nhánh riêng và tạo Pull Request vào `dev`.
- Khi hotfix xong trên `prod`, phải merge ngược về `staging` và `dev` để đồng bộ.

## Nhánh Làm Việc

Tạo feature từ `dev`:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/login-page
```

Các prefix nhánh chuẩn:

```text
feat/<ten-chuc-nang>      thêm chức năng mới
fix/<ten-loi>             sửa lỗi trong giai đoạn dev
hotfix/<ten-loi-khan>     sửa lỗi khẩn cấp từ prod
chore/<ten-viec>          docs, config, cleanup, hạ tầng
refactor/<ten-viec>       refactor code không đổi hành vi
```

Ví dụ:

```text
feat/homepage
feat/pool-manager
fix/login-validation
hotfix/fix-login-error
chore/update-ci
```

## Luồng Feature

```text
dev -> feat/* -> Pull Request -> dev
```

Các bước:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/homepage

# sửa code
git add .
git commit -m "feat(frontend): thêm trang homepage #123"
git push -u origin feat/homepage
```

Sau đó tạo Pull Request từ `feat/homepage` vào `dev`.

## Luồng Staging

Khi `dev` đủ ổn định để QA/demo:

```text
dev -> Pull Request -> staging
```

Sau khi merge vào `staging`, CI/CD sẽ chạy để kiểm tra build backend, frontend và Docker Compose.

## Luồng Production

Khi `staging` đã được kiểm thử xong:

```text
staging -> Pull Request -> prod
```

Sau khi merge vào `prod`, có thể tạo tag release:

```bash
git checkout prod
git pull origin prod
git tag v1.0.0
git push origin v1.0.0
```

## Luồng Hotfix

Hotfix dùng cho lỗi khẩn cấp trên production.

```text
prod -> hotfix/* -> Pull Request -> prod
prod -> Pull Request -> staging
prod -> Pull Request -> dev
```

Các bước:

```bash
git checkout prod
git pull origin prod
git checkout -b hotfix/fix-login-error

# sửa lỗi
git add .
git commit -m "fix(auth): sửa lỗi đăng nhập production #456"
git push -u origin hotfix/fix-login-error
```

Sau khi PR hotfix vào `prod` được merge, phải đồng bộ:

```bash
git checkout staging
git pull origin staging
git merge origin/prod
git push origin staging

git checkout dev
git pull origin dev
git merge origin/prod
git push origin dev
```

Ưu tiên dùng Pull Request cho bước đồng bộ nếu repo đã bật branch protection.

## Quy Tắc Pull Request

- PR feature/fix thường: `feat/*` hoặc `fix/*` vào `dev`.
- PR kiểm thử: `dev` vào `staging`.
- PR production: `staging` vào `prod`.
- PR hotfix: `hotfix/*` vào `prod`, sau đó đồng bộ lại `staging` và `dev`.
- Tiêu đề PR phải theo Conventional Commits và kèm issue id.
- PR phải pass CI trước khi merge.
- Mô tả PR cần ghi rõ thay đổi, issue liên quan, cách test và rủi ro.

Ví dụ tiêu đề PR đúng:

```text
feat(pool): thêm modal tạo credential #123
fix(auth): sửa lỗi token hết hạn #456
docs(git): cập nhật quy trình branch #789
```

## Cấu Hình Branch Protection Trên GitHub

Trong GitHub, vào `Settings -> Branches -> Add branch protection rule`.

Nên bật rule cho `prod`:

```text
Branch name pattern: prod
Require a pull request before merging: bật
Require approvals: ít nhất 1
Require status checks to pass before merging: bật
Require branches to be up to date before merging: bật
Restrict who can push to matching branches: bật nếu có team cụ thể
Do not allow bypassing the above settings: bật nếu muốn nghiêm ngặt
```

Nên bật rule cho `staging`:

```text
Branch name pattern: staging
Require a pull request before merging: bật
Require approvals: ít nhất 1
Require status checks to pass before merging: bật
Require branches to be up to date before merging: bật
```

`dev` có thể cho phép team merge nhanh hơn, nhưng vẫn nên yêu cầu PR và CI pass để tránh lỗi lọt vào nhánh tích hợp.
