# Quy Trình Git

Tài liệu này mô tả cách chia nhánh và cách commit cho dự án Groks.

## Nhánh Chính

```text
main      code ổn định, dùng để release
develop   nhánh tích hợp chính cho dev
```

Không commit trực tiếp vào `main` nếu không phải hotfix khẩn cấp.

## Nhánh Làm Việc

Tạo nhánh từ `develop`:

```bash
git checkout develop
git pull origin develop
git checkout -b feature/<ten-ngan-gon>
```

Các prefix nhánh chuẩn:

```text
feature/<ten>  thêm chức năng mới
fix/<ten>      sửa bug trong giai đoạn dev
release/<ver>  chuẩn bị release
hotfix/<ten>   sửa lỗi khẩn cấp từ main
chore/<ten>    việc hạ tầng, docs, cleanup
```

CI hiện chạy cho:

```text
main
develop
feature/**
release/**
hotfix/**
pull_request -> main, develop
```

## Luồng Feature

```text
develop -> feature/* -> Pull Request -> develop
```

Ví dụ:

```bash
git checkout develop
git checkout -b feature/pool-manager
git add .
git commit -m "feat(pool): add credential pool table"
git push -u origin feature/pool-manager
```

## Luồng Release

```text
develop -> release/x.y.z -> Pull Request -> main
main -> tag -> merge ngược về develop
```

Ví dụ:

```bash
git checkout develop
git checkout -b release/1.0.0
git push -u origin release/1.0.0
```

Sau khi merge vào `main`, tạo tag:

```bash
git checkout main
git tag v1.0.0
git push origin v1.0.0
```

## Luồng Hotfix

```text
main -> hotfix/* -> Pull Request -> main
main -> merge ngược về develop
```

Ví dụ:

```bash
git checkout main
git checkout -b hotfix/auth-token
git commit -m "fix(auth): handle expired token"
git push -u origin hotfix/auth-token
```

## Quy Tắc Pull Request

- PR vào `develop` cho feature/fix thông thường.
- PR vào `main` cho release/hotfix.
- Tiêu đề PR phải theo Conventional Commits.
- PR phải pass CI trước khi merge.
- Mô tả PR cần ghi rõ đã test gì.

