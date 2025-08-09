#!/bin/bash

# Deploy Superintelligent Agent Collective to Cloud Run

echo "🚀 Deploying Superintelligent Agent Collective to Cloud Run..."

# Set variables
PROJECT_ID="agenticsfoundation-2e916"
SERVICE_NAME="superintelligent-agent-collective"
REGION="us-central1"

# Build and push Docker image
echo "📦 Building Docker image..."
gcloud builds submit --tag gcr.io/$PROJECT_ID/$SERVICE_NAME

# Deploy to Cloud Run
echo "☁️ Deploying to Cloud Run..."
gcloud run deploy $SERVICE_NAME \
  --image gcr.io/$PROJECT_ID/$SERVICE_NAME \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 3600 \
  --max-instances 10 \
  --set-env-vars="NODE_ENV=production,AUTONOMOUS=true"

# Deploy backend scraper
echo "🌐 Deploying Playwright scraper backend..."
cd scraper_backend
gcloud builds submit --tag gcr.io/$PROJECT_ID/scraper-backend
gcloud run deploy scraper-backend \
  --image gcr.io/$PROJECT_ID/scraper-backend \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --memory 4Gi \
  --cpu 2 \
  --timeout 3600

echo "✅ Deployment complete!"
echo "🤖 Agents are now running autonomously in the cloud!"
echo "📊 Monitor at: https://console.cloud.google.com/run"