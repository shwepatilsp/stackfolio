#!/bin/bash

# Stackfolio Lightweight Runner
# Usage: ./run-lightweight.sh [minimal|lightweight|full]

set -e

COMPOSE_FILE=""
MODE=""

case "$1" in
    "minimal")
        COMPOSE_FILE="docker-compose-minimal.yml"
        MODE="Minimal"
        echo "🚀 Starting Stackfolio in MINIMAL mode (lowest memory usage)"
        ;;
    "lightweight")
        COMPOSE_FILE="docker-compose-lightweight.yml"
        MODE="Lightweight"
        echo "🚀 Starting Stackfolio in LIGHTWEIGHT mode (balanced)"
        ;;
    "full"|*)
        COMPOSE_FILE="docker-compose.yml"
        MODE="Full"
        echo "🚀 Starting Stackfolio in FULL mode (all services)"
        ;;
esac

# Stop any running containers first
echo "🛑 Stopping existing containers..."
docker-compose -f "$COMPOSE_FILE" down 2>/dev/null || true

# Clean up dangling images to save space
echo "🧹 Cleaning up dangling images..."
docker image prune -f

# Start the services
echo "🔧 Building and starting services with $MODE configuration..."
docker-compose -f "$COMPOSE_FILE" up -d --build

echo "⏳ Waiting for services to start..."
sleep 15

# Check service status
echo "📊 Service Status:"
docker-compose -f "$COMPOSE_FILE" ps

echo ""
echo "✅ Stackfolio started in $MODE mode!"
echo ""
echo "🌐 Access URLs:"
if [ "$MODE" = "Minimal" ]; then
    echo "   Frontend: http://localhost:3000"
    echo "   Profile API: http://localhost:8081"
elif [ "$MODE" = "Lightweight" ]; then
    echo "   Frontend: http://localhost:3000"
    echo "   API Gateway: http://localhost:8080"
    echo "   Profile API: http://localhost:8081"
else
    echo "   Frontend: http://localhost:3000"
    echo "   API Gateway: http://localhost:8080"
    echo "   Profile API: http://localhost:8081"
    echo "   Project API: http://localhost:8082"
    echo "   Contact API: http://localhost:8083"
fi

echo ""
echo "💾 Memory Usage:"
docker stats --no-stream --format "table {{.Container}}\t{{.MemUsage}}\t{{.MemPerc}}"
