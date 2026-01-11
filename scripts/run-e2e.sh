#!/bin/bash

# E2E Test Runner Script
# This script sets up the database, runs tests, and cleans up

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_DIR"

cleanup() {
  echo "[E2E] Cleaning up..."
  docker compose -f docker-compose.test.yml down -v --remove-orphans 2>/dev/null || true
  echo "[E2E] Cleanup complete!"
}

# Always cleanup on exit
trap cleanup EXIT

echo "[E2E] Starting e2e test suite..."

# Check if Docker is running, start it if not
if ! docker info > /dev/null 2>&1; then
  echo "[E2E] Docker is not running. Attempting to start..."
  
  # macOS - start Docker Desktop
  if [[ "$OSTYPE" == "darwin"* ]]; then
    open -a Docker
    echo "[E2E] Waiting for Docker to start..."
    max_docker_attempts=30
    docker_attempt=0
    until docker info > /dev/null 2>&1; do
      docker_attempt=$((docker_attempt + 1))
      if [ $docker_attempt -ge $max_docker_attempts ]; then
        echo "[E2E] Error: Docker failed to start after $max_docker_attempts attempts"
        exit 1
      fi
      sleep 2
    done
    echo "[E2E] Docker started successfully!"
  # Linux - try to start docker service
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    sudo systemctl start docker 2>/dev/null || sudo service docker start 2>/dev/null || {
      echo "[E2E] Error: Could not start Docker. Please start it manually."
      exit 1
    }
    sleep 3
  else
    echo "[E2E] Error: Docker is not running. Please start Docker first."
    exit 1
  fi
fi

# Create .env.test if it doesn't exist
if [ ! -f .env.test ]; then
  echo "[E2E] Creating .env.test file..."
  cat > .env.test << 'EOF'
# E2E Test Environment Variables

# Database - Docker PostgreSQL test instance
DATABASE_URL="postgresql://test_user:test_password@localhost:5433/test_db"

# Auth
AUTH_SECRET="e2e-test-secret-key-minimum-32-chars"
ADMIN_PASS="e2e-admin-password"

# Stripe - Use test mode keys
STRIPE_SECRET_KEY="sk_test_placeholder"
STRIPE_WEBHOOK_SECRET="whsec_test_placeholder"

# App
NODE_ENV="test"
SKIP_ENV_VALIDATION="true"

# Playwright
PLAYWRIGHT_BASE_URL="http://localhost:3000"

# Next Auth
NEXTAUTH_URL="http://localhost:3000"
EOF
fi

# Load environment variables
export $(cat .env.test | grep -v '^#' | xargs)

# Start the test database
echo "[E2E] Starting PostgreSQL test database..."
docker compose -f docker-compose.test.yml up -d

# Wait for database to be ready
echo "[E2E] Waiting for database to be ready..."
max_attempts=30
attempt=0
until docker exec 200x-dev-test-db pg_isready -U test_user -d test_db > /dev/null 2>&1; do
  attempt=$((attempt + 1))
  if [ $attempt -ge $max_attempts ]; then
    echo "[E2E] Error: Database failed to start after $max_attempts attempts"
    exit 1
  fi
  echo "[E2E] Waiting for database... (attempt $attempt/$max_attempts)"
  sleep 2
done

echo "[E2E] Database is ready!"

# Push schema to test database
echo "[E2E] Pushing Prisma schema to test database..."
npx dotenv -e .env.test -- npx prisma db push --skip-generate

# Generate Prisma client
echo "[E2E] Generating Prisma client..."
npx prisma generate

# Run the tests
echo "[E2E] Running Playwright tests..."
npx dotenv -e .env.test -- npx playwright test "$@"

echo "[E2E] Tests completed!"
