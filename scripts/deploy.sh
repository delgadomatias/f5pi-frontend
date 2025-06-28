#!/bin/bash

IMAGE_NAME="f5pi-frontend"
REGISTRY_URL="delgadomatias"
TAG="${1:-latest}"

echo "🔄 Pulling latest image from registry..."
docker pull $REGISTRY_URL/$IMAGE_NAME:$TAG

echo "🚀 Starting application..."
docker-compose -f docker-compose.prod.yml up -d

echo "✅ Deployment complete!"
echo "📊 Check status with: docker-compose -f docker-compose.prod.yml ps"