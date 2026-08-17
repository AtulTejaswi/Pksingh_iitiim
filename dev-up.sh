#!/usr/bin/env bash
# dev-up.sh — bring up the full local stack in one command:
#   Postgres (Docker) -> backend (:4000) -> frontend (:3000)
#
# Why this exists: the stack dies silently when the machine restarts,
# Docker Desktop stops, or the shell environment forces PORT=0 (which makes
# naive `npm run dev` bind a random port). Run this, wait ~30s, done.
#
# Usage:  bash dev-up.sh
set -uo pipefail
cd "$(dirname "$0")"

log()  { printf '\033[1;32m[dev-up]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[dev-up]\033[0m %s\n' "$*"; }

# ---------------------------------------------------------------- Docker engine
if ! docker info >/dev/null 2>&1; then
  log "Docker engine is not running — starting Docker Desktop..."
  if [ -f "/c/Program Files/Docker/Docker/Docker Desktop.exe" ]; then
    (cd "/c/Program Files/Docker/Docker" && cmd //c start "" "Docker Desktop.exe" >/dev/null 2>&1) || true
  else
    warn "Docker Desktop not found at the default path — please start it manually."
  fi
  for _ in $(seq 1 60); do
    docker info >/dev/null 2>&1 && break
    sleep 2
  done
  docker info >/dev/null 2>&1 || { echo "[dev-up] Docker engine did not come up — aborting."; exit 1; }
fi
log "Docker engine ready."

# ------------------------------------------------------------------- Postgres
if ! docker ps --format '{{.Names}}' | grep -qx 'pksingh-postgres'; then
  log "Starting Postgres container (pksingh-postgres)..."
  docker start pksingh-postgres >/dev/null 2>&1 || docker compose up -d >/dev/null || {
    echo "[dev-up] Could not start Postgres — aborting."; exit 1; }
fi
for _ in $(seq 1 30); do
  docker exec pksingh-postgres pg_isready -U postgres >/dev/null 2>&1 && break
  sleep 1
done
docker exec pksingh-postgres pg_isready -U postgres >/dev/null 2>&1 || {
  echo "[dev-up] Postgres is not accepting connections — aborting."; exit 1; }
log "Postgres ready on :5432."

# ------------------------------------------------------------------- Backend
if ! curl -s --max-time 2 http://localhost:4000/api/health >/dev/null 2>&1; then
  log "Starting backend on :4000 (logs: /tmp/backend.log)..."
  (PORT=4000 npm run dev > /tmp/backend.log 2>&1 &)
  for _ in $(seq 1 40); do
    curl -s --max-time 2 http://localhost:4000/api/health >/dev/null 2>&1 && break
    sleep 1
  done
fi
curl -s --max-time 3 http://localhost:4000/api/health >/dev/null 2>&1 || {
  echo "[dev-up] Backend failed to start — check /tmp/backend.log."; exit 1; }
log "Backend ready: http://localhost:4000/api/health"

# ------------------------------------------------------------------ Frontend
if ! curl -s --max-time 2 -o /dev/null http://localhost:3000/ >/dev/null 2>&1; then
  log "Starting frontend on :3000 (logs: /tmp/frontend.log)..."
  (cd tutoring-platform && PORT=3000 npm run dev > /tmp/frontend.log 2>&1 &)
  for _ in $(seq 1 90); do
    curl -s --max-time 2 -o /dev/null http://localhost:3000/ >/dev/null 2>&1 && break
    sleep 1
  done
fi
curl -s --max-time 3 -o /dev/null http://localhost:3000/ >/dev/null 2>&1 || {
  echo "[dev-up] Frontend failed to start — check /tmp/frontend.log."; exit 1; }
log "Frontend ready: http://localhost:3000"

echo
log "Full local stack is up:"
log "   Postgres  :5432   Backend  :4000   Frontend  :3000"
log "   Open http://localhost:3000 in your browser."
log "   Logs: /tmp/backend.log  /tmp/frontend.log"
