.PHONY: build run dev test clean docker-build docker-run help

# Variables
BACKEND_NAME=hb-finance-backend
BACKEND_BIN=backend
GO=go

## help: Display this help message
help:
	@echo "Available commands:"
	@echo "  make build          - Build the backend binary"
	@echo "  make run            - Run the backend"
	@echo "  make dev            - Run in development mode with hot reload"
	@echo "  make test           - Run tests"
	@echo "  make clean          - Clean build artifacts"
	@echo "  make docker-build   - Build Docker image"
	@echo "  make docker-run     - Run with Docker Compose"
	@echo "  make docker-stop    - Stop Docker containers"
	@echo "  make docker-logs    - View Docker logs"
	@echo "  make lint           - Run linter"
	@echo "  make fmt            - Format code"

## build: Build the backend binary
build:
	$(GO) build -o $(BACKEND_BIN) main.go

## run: Run the backend
run: build
	./$(BACKEND_BIN)

## dev: Run in development mode with air (hot reload)
dev:
	go install github.com/cosmtrek/air@latest
	air

## test: Run tests
test:
	$(GO) test -v -cover ./...

## clean: Clean build artifacts
clean:
	$(GO) clean
	rm -f $(BACKEND_BIN)

## docker-build: Build Docker image
docker-build:
	docker build -t $(BACKEND_NAME) .

## docker-run: Run with Docker Compose
docker-run:
	docker-compose up -d

## docker-stop: Stop Docker containers
docker-stop:
	docker-compose down

## docker-logs: View Docker logs
docker-logs:
	docker-compose logs -f backend

## lint: Run linter
lint:
	golangci-lint run

## fmt: Format code
fmt:
	$(GO) fmt ./...

## all: Build and run locally
all: clean build run
