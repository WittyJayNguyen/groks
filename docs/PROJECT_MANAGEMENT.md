# Quản Lý Project Trên GitHub

Tài liệu này mô tả cách quản lý phase, REQ, issue id, branch, commit và Pull Request cho Groks.

## Nguyên Tắc Chính

- Mọi feature, bug, task lớn phải bắt đầu bằng GitHub Issue.
- GitHub tự sinh issue id dạng `#123`. Đây là id chuẩn để gắn vào branch, commit và PR.
- Commit phần lớn phải kèm issue id ở cuối subject.
- PR phải link issue bằng `Closes #123`, `Fixes #123` hoặc `Refs #123`.
- Không làm trực tiếp trên `prod`, `staging`, `dev`; luôn tạo nhánh riêng rồi mở PR.

## Phase Chuẩn

```text
P0 - Discovery   BM/BA gom yêu cầu, vấn đề, mục tiêu
P1 - Planning    BA tách REQ thành task, scope, acceptance criteria
P2 - UI/UX       UI/UX thiết kế flow, wireframe, component, trạng thái màn hình
P3 - Backend     BE thiết kế API, schema, service, auth, log, test
P4 - Frontend    FE dựng UI, store, service, composer, validate, state
P5 - QA/UAT      QA test acceptance criteria, bug, regression
P6 - Release     Merge staging/prod, tag version, kiểm tra sau deploy
```

## Role Và Trách Nhiệm

```text
BM      xác nhận mục tiêu kinh doanh, độ ưu tiên, deadline
BA      viết REQ, acceptance criteria, chia task, xác nhận scope
UI/UX   thiết kế flow, layout, component, interaction, responsive
BE      API, database, service, auth, logs, provider integration
FE      SPA, module UI, store, service, helper, composer
QA      test case, bug report, regression, UAT
DevOps  CI/CD, Docker, env, branch protection, deploy
```

## Issue Type

```text
type:req      yêu cầu nghiệp vụ hoặc kỹ thuật cấp cao
type:task     công việc triển khai cụ thể
type:bug      lỗi cần sửa
type:release  checklist release staging/prod
```

## Label Chuẩn

```text
phase:discovery
phase:planning
phase:ui-ux
phase:backend
phase:frontend
phase:qa
phase:release

role:bm
role:ba
role:ui-ux
role:be
role:fe
role:qa
role:devops

status:backlog
status:ready
status:in-progress
status:review
status:blocked
status:done

priority:p0
priority:p1
priority:p2
priority:p3
```

## Quy Trình Tạo Việc

1. Tạo `REQ - Yêu cầu nghiệp vụ`.
2. GitHub tự sinh issue id, ví dụ `#25`.
3. BA/BM điền mục tiêu, phase, module, acceptance criteria.
4. Tách REQ thành các `TASK` nhỏ, mỗi task ghi `REQ liên quan: #25`.
5. Dev tạo branch từ `dev`.
6. Commit kèm issue id.
7. Push branch và tạo PR vào `dev`.
8. PR body ghi `Closes #id` nếu task hoàn tất, hoặc `Refs #id` nếu chỉ liên quan.

## Quy Tắc Branch Theo Issue

Branch nên ngắn, rõ và có thể kèm issue id:

```text
feat/25-pool-create-modal
fix/31-job-pool-rotation
hotfix/45-auth-expired-token
chore/52-update-ci
```

Tạo branch:

```bash
git checkout dev
git pull origin dev
git checkout -b feat/25-pool-create-modal
```

## Quy Tắc Commit Theo Issue

Format:

```text
<type>(<scope>): <description> #<issue_id>
```

Ví dụ:

```text
feat(pool): thêm modal tạo credential #25
fix(jobs): sửa lỗi đảo pool khi quá tải #31
docs(project): bổ sung quy trình phase #52
```

## Quy Tắc Pull Request

Tiêu đề PR:

```text
feat(pool): thêm modal tạo credential #25
```

Body PR phải có issue id:

```text
Closes #25
```

Hoặc:

```text
Refs #25
```

PR phải đi đúng target:

```text
feat/*   -> dev
fix/*    -> dev
dev      -> staging
staging  -> prod
hotfix/* -> prod
```

## Timeline Gợi Ý Cho Một REQ

```text
Ngày 1
BM/BA: tạo REQ, xác nhận mục tiêu, acceptance criteria
UI/UX: phân tích flow, xác định màn hình/trạng thái

Ngày 2
UI/UX: hoàn tất layout/component
BE: thiết kế API/schema/service

Ngày 3-4
BE: triển khai API, log, auth, test
FE: dựng module, service, store, composer, UI state

Ngày 5
QA/UAT: test acceptance criteria, tạo bug nếu có
Dev: fix bug, review PR, merge dev

Ngày 6
Merge dev -> staging, demo/QA lại

Ngày 7
Merge staging -> prod, tag version, kiểm tra log sau deploy
```

Timeline có thể ngắn/dài hơn tùy độ lớn REQ. Quan trọng là issue phải thể hiện rõ phase, owner, acceptance criteria và link PR/commit.

## Ví Dụ Một Luồng Chuẩn

Issue REQ:

```text
#25 req(pool): quản lý credential pool
```

Task:

```text
#26 task(pool): dựng API tạo pool
#27 task(pool): dựng UI table và modal pool
#28 task(pool): thêm QA test case pool
```

Branch:

```text
feat/26-pool-create-api
feat/27-pool-table-modal
```

Commit:

```text
feat(pool): thêm API tạo credential pool #26
feat(pool): thêm table và modal quản lý pool #27
```

PR:

```text
feat(pool): thêm API tạo credential pool #26
Closes #26
Refs #25
```
