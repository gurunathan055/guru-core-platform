#!/bin/bash
set -e

echo "🚀 Starting Guru-Core Services"

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Start services
echo "📦 Starting Docker services..."
docker-compose up -d

# Wait for services to be healthy
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check Weaviate
echo "🔍 Checking Weaviate..."
until curl -f http://localhost:8080/v1/.well-known/ready > /dev/null 2>&1; do
    echo "   Waiting for Weaviate..."
    sleep 5
done
echo "✅ Weaviate is ready"

# Check Ollama
echo "🔍 Checking Ollama..."
until curl -f http://localhost:11434/ > /dev/null 2>&1; do
    echo "   Waiting for Ollama..."
    sleep 5
done
echo "✅ Ollama is ready"

# Check Redis
echo "🔍 Checking Redis..."
until docker exec guru-core-redis redis-cli ping > /dev/null 2>&1; do
    echo "   Waiting for Redis..."
    sleep 5
done
echo "✅ Redis is ready"

# Pull Ollama models
echo "📥 Pulling Ollama models..."
echo "   This may take a while on first run..."

docker exec guru-core-ollama ollama pull llama3.1:70b &
docker exec guru-core-ollama ollama pull mixtral:8x7b &
docker exec guru-core-ollama ollama pull nomic-embed-text &

wait

echo ""
echo "🎉 All services are ready!"
echo "================================"
echo "🔍 Weaviate: http://localhost:8080"
echo "🤖 Ollama: http://localhost:11434"
echo "💾 Redis: localhost:6379"
echo "================================"
echo ""
echo "Run 'docker-compose logs -f' to view logs"
echo "Run 'docker-compose down' to stop all services"
