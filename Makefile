.PHONY: help up stop-api enter down clean rebuild test test-report test-integration wait-db up-api up-db setup-db restart-api

help: ## Show this help message
	@echo Commands available:
	@echo.
	@echo   make up               - Start all containers with full database setup (detached mode)
	@echo   make stop-api         - Stop API
	@echo   make enter            - Enter API container
	@echo   make down             - Stop and remove all containers
	@echo   make setup-db         - Setup database with migrations and seeds
	@echo   make test             - Run unit tests
	@echo   make test-report      - Run unit tests and generate coverage report
	@echo   make test-integration - Run integration tests in isolated environment
	@echo   make clean            - Clean up (remove containers, volumes, node_modules and dist)
	@echo   make rebuild          - Rebuild containers from scratch
	@echo   make restart-api      - Restart API container
	@echo.

wait-db: ## Wait for database to be ready
	@echo Waiting for database to be ready...
	@docker-compose exec -T mysql sh -c 'while ! mysqladmin ping -h"localhost" -P"3306" --silent; do sleep 1; done'

up-api: ## Start API
	@echo Starting API...
	docker-compose up -d --build api
	@echo Waiting for API to be ready...
	@timeout /t 5 /nobreak >nul

up-db: ## Start and setup database
	@echo Starting database...
	docker-compose up -d mysql
	$(MAKE) wait-db
	@echo Running database setup...
	docker-compose up -d --build api
	@timeout /t 5 /nobreak >nul
	docker-compose exec -T api npm run prisma:generate
	docker-compose exec -T api npm run prisma:migrate:deploy

setup-db: ## Setup database with migrations and seeds
	@echo Running database setup...
	$(MAKE) up-db
	docker-compose exec -T api npm run seed

up: ## Start all containers with full database setup
	@echo Starting services...
	$(MAKE) up-db
	$(MAKE) up-api
	@echo All services are ready in detached mode!
	@echo Use 'docker-compose logs -f' to follow logs

stop-api: ## Stop API
	docker-compose stop api

enter: ## Enter API container logs
	docker-compose logs -f api

down: ## Stop and remove all containers
	docker-compose down -v

test: ## Run unit tests
	npm run test

test-report: ## Run unit tests and generate coverage report
	npm run test:cov

test-integration: ## Run integration tests
	docker-compose -f docker-compose.test.yml up -d mysql_test
	@docker-compose exec -T mysql_test sh -c 'while ! mysqladmin ping -h"localhost" -P"3306" --silent; do sleep 1; done'
	docker-compose -f docker-compose.test.yml up --build test_api
	docker-compose -f docker-compose.test.yml down

clean: ## Clean up environment
	docker-compose down -v
	docker-compose -f docker-compose.test.yml down -v
	rd /s /q node_modules 2>nul || echo.
	rd /s /q dist 2>nul || echo.
	docker system prune -af --volumes
	docker builder prune -af

rebuild: clean ## Rebuild containers from scratch
	docker-compose build --no-cache --pull
	docker-compose up -d

restart-api: ## Restart API container
	@echo Restarting API...
	docker-compose restart api
