#!/bin/bash
set -a
source .env
set +a

echo "🔨 Building image..."
docker login
docker rm -f $(docker ps -aq)
sleep 10
docker system prune -af
docker network prune -f
docker compose -f docker-compose.yml build --no-cache
echo "📦 Pushing image..."
docker compose -f  docker-compose.yml push
echo "✅ Building completed! and push completed"
docker compose -f docker-compose.yml up -d
echo "✅ Container started successfully....."
