DOCKER_PROFILE ?= backend

user := $(shell id -u)
group := $(shell id -g)

# Get candidate name from current directory
CANDIDATE_NAME := $(shell basename $(PWD))

dc := USER_ID=$(user) GROUP_ID=$(group) docker compose

.DEFAULT_GOAL := help
.PHONY: help
help: ## Display this help screen
	@grep -E '^[a-z.A-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}'

.PHONY: setup
setup: ## Complete setup: env + install + docker + frontend + backend in tmux
	@echo "Starting complete setup for candidate: $(CANDIDATE_NAME)"
	@bash setup.sh

.PHONY: cleanup
cleanup: ## Stop everything and cleanup
	@echo "Cleaning up $(CANDIDATE_NAME) development environment..."
	$(dc) --profile $(DOCKER_PROFILE) down --volumes --remove-orphans
	@tmux kill-session -t "$(CANDIDATE_NAME)-dev" 2>/dev/null || true
	@echo "Cleanup complete!"

.PHONY: env-init
env-init: ## Init env
	cp .env.example .env

.PHONY: du
du: ## Up profile via docker compose
	$(dc) --profile $(DOCKER_PROFILE) up

.PHONY: dd
dd: ## Down profile via docker compose
	$(dc) --profile $(DOCKER_PROFILE) down --volumes

.PHONY: backend
backend: ## Start backend
	pnpm run dev:backend

.PHONY: frontend
frontend: ## Start frontend
	pnpm run dev:frontend

.PHONY: install
install: ## Install packages
	pnpm install