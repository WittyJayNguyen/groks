.PHONY: build up down restart logs ps frontend-build backend-build

build:
	docker compose build

up:
	docker compose up -d

down:
	docker compose down

restart:
	docker compose up -d --force-recreate backend frontend

logs:
	docker compose logs -f --tail=120

ps:
	docker compose ps

frontend-build:
	docker compose build frontend

backend-build:
	docker compose build backend
