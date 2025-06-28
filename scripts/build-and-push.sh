#!/bin/bash

IMAGE_NAME="f5pi-frontend"
REGISTRY_URL="delgadomatias"
TAG="${1:-latest}"

echo "Building Docker image: $IMAGE_NAME:$TAG"

# Build the Docker image
docker build -t $IMAGE_NAME:$TAG .

# Tag the image for registry
docker tag $IMAGE_NAME:$TAG $REGISTRY_URL/$IMAGE_NAME:$TAG

# Push the image to the Docker Registry
echo "Pushing image to registry..."
docker push $REGISTRY_URL/$IMAGE_NAME:$TAG

echo "✅ Docker image $IMAGE_NAME:$TAG has been built and pushed to $REGISTRY_URL"
echo "🚀 Ready to deploy on the VPS!"