# ☁️ DINA AGI Cloud Deployment Guide

**Deploy your 24/7 superintelligent agent collective to the cloud**

---

## 🎯 **Your Current Cloud Status**

### **✅ LIVE DEPLOYMENT**
- **URL:** https://dina-agi-604785804458.us-central1.run.app
- **Status:** 24/7 Operational
- **Agents:** 75+ Active
- **Region:** US Central (us-central1)
- **Resources:** 2GB RAM, 2 CPU cores

### **🔍 Monitoring Endpoints**
```bash
# Check system status
curl https://dina-agi-604785804458.us-central1.run.app/api/status

# View active agents
curl https://dina-agi-604785804458.us-central1.run.app/api/agents

# Monitor builds
curl https://dina-agi-604785804458.us-central1.run.app/api/projects
```

---

## 🛠️ **Deployment Architecture**

### **Google Cloud Run Configuration**
```yaml
Service: dina-agi
Project: agenticsfoundation-2e916
Region: us-central1
CPU: 2 vCPU
Memory: 2 GiB
Concurrency: 80
Timeout: 3600s (1 hour)
Port: 3000
```

### **Environment Variables**
```bash
FIREBASE_PROJECT_ID=agenticsfoundation-2e916
GITHUB_REPO=superbigroach/AgenticsFoundationWebApp
DOCKER_CONTAINER=true
```

### **Auto-Scaling**
- **Minimum Instances:** 1 (always running)
- **Maximum Instances:** 10 (scales with traffic)
- **CPU Threshold:** 60%
- **Memory Threshold:** 80%

---

## 🔄 **Redeployment Process**

### **Method 1: Direct Deployment**
```bash
# From your project directory
cd E:\AgenticsFoundationWebApp

# Deploy latest code
gcloud run deploy dina-agi \
  --source . \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2 \
  --timeout 3600
```

### **Method 2: Docker Build & Deploy**
```bash
# Build Docker image
docker build -t gcr.io/agenticsfoundation-2e916/dina-agi .

# Push to Google Container Registry
docker push gcr.io/agenticsfoundation-2e916/dina-agi

# Deploy from image
gcloud run deploy dina-agi \
  --image gcr.io/agenticsfoundation-2e916/dina-agi \
  --region us-central1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2
```

### **Method 3: Automated CI/CD**
Set up GitHub Actions for automatic deployment on code changes.

---

## 📊 **Resource Management**

### **Current Resource Usage**
```bash
# Check resource usage
gcloud run services describe dina-agi --region us-central1 --format="table(
  spec.template.spec.containers[0].resources.limits.memory,
  spec.template.spec.containers[0].resources.limits.cpu,
  status.conditions[0].status
)"
```

### **Scaling Options**

**Vertical Scaling (More Power):**
```bash
# Increase memory to 4GB
gcloud run services update dina-agi \
  --memory 4Gi \
  --region us-central1

# Increase CPU to 4 cores  
gcloud run services update dina-agi \
  --cpu 4 \
  --region us-central1
```

**Horizontal Scaling (More Instances):**
```bash
# Set min/max instances
gcloud run services update dina-agi \
  --min-instances 2 \
  --max-instances 20 \
  --region us-central1
```

### **Cost Optimization**
```bash
# Reduce resources for cost savings
gcloud run services update dina-agi \
  --memory 1Gi \
  --cpu 1 \
  --region us-central1

# Set to scale to zero when idle (saves cost)
gcloud run services update dina-agi \
  --min-instances 0 \
  --region us-central1
```

---

## 🔐 **Security Configuration**

### **IAM & Permissions**
```bash
# Make service publicly accessible
gcloud run services add-iam-policy-binding dina-agi \
  --region us-central1 \
  --member="allUsers" \
  --role="roles/run.invoker"

# Or restrict to authenticated users only
gcloud run services remove-iam-policy-binding dina-agi \
  --region us-central1 \
  --member="allUsers" \
  --role="roles/run.invoker"
```

### **Secret Management**
```bash
# Create secrets in Secret Manager
gcloud secrets create github-token --data-file=token.txt
gcloud secrets create firebase-key --data-file=firebase-key.json

# Use secrets in Cloud Run
gcloud run services update dina-agi \
  --set-secrets GITHUB_TOKEN=github-token:latest \
  --set-secrets FIREBASE_KEY=firebase-key:latest \
  --region us-central1
```

### **Network Security**
```bash
# Restrict ingress (if needed)
gcloud run services update dina-agi \
  --ingress internal \
  --region us-central1

# Allow all traffic (current setting)
gcloud run services update dina-agi \
  --ingress all \
  --region us-central1
```

---

## 📈 **Monitoring & Logging**

### **Google Cloud Monitoring**

**View Logs:**
```bash
# Stream real-time logs
gcloud logs tail "resource.type=cloud_run_revision" --filter="resource.labels.service_name=dina-agi"

# View recent logs
gcloud logs read "resource.type=cloud_run_revision" --filter="resource.labels.service_name=dina-agi" --limit=50
```

**Performance Metrics:**
- Visit: https://console.cloud.google.com/run/detail/us-central1/dina-agi/metrics
- Monitor: Request count, latency, memory usage, CPU utilization

### **Custom Monitoring**
```javascript
// Add to your agent collective code
const monitoring = require('@google-cloud/monitoring');

class CloudMonitoring {
  constructor() {
    this.client = new monitoring.MetricServiceClient();
    this.projectId = 'agenticsfoundation-2e916';
  }
  
  async recordAgentMetric(agentId, metricValue) {
    // Custom metric recording
  }
  
  async recordBuildMetric(buildCount) {
    // Build success tracking
  }
}
```

### **Alerting**
```bash
# Create alert for high memory usage
gcloud alpha monitoring policies create --policy-from-file=alert-policy.yaml
```

---

## 🔄 **Auto-GitHub Integration**

### **Current Setup**
Your cloud agents automatically:
1. Build projects every 10-40 seconds
2. Accumulate builds in memory
3. Commit to GitHub every hour
4. Push to: https://github.com/superbigroach/AgenticsFoundationWebApp/tree/main/agent_builds

### **GitHub Commit Configuration**
```javascript
// In superintelligent_agent_collective.js
async commitBuildsToGitHub() {
  const commands = [
    'git add agent_builds/',
    `git commit -m "🤖 Autonomous agent builds - ${new Date().toISOString()}"`,
    'git push origin main'
  ];
  // Execution logic...
}
```

### **Monitoring GitHub Activity**
```bash
# Check recent commits
git log --oneline -n 10

# View agent builds folder
ls -la agent_builds/

# Check commit frequency
git log --pretty=format:"%h %ad %s" --date=short --grep="Autonomous agent builds"
```

---

## 🌍 **Multi-Region Deployment**

### **Deploy to Multiple Regions**
```bash
# Deploy to Europe
gcloud run deploy dina-agi-eu \
  --source . \
  --region europe-west1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2

# Deploy to Asia  
gcloud run deploy dina-agi-asia \
  --source . \
  --region asia-east1 \
  --allow-unauthenticated \
  --memory 2Gi \
  --cpu 2
```

### **Load Balancing**
```bash
# Create global load balancer
gcloud compute backend-services create dina-agi-backend \
  --global

# Add regions to backend
gcloud compute backend-services add-backend dina-agi-backend \
  --global \
  --network-endpoint-group=dina-agi-neg \
  --network-endpoint-group-region=us-central1
```

---

## 🐳 **Docker Configuration**

### **Current Dockerfile**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Expose port
EXPOSE 3000

# Set environment
ENV NODE_ENV=production
ENV DOCKER_CONTAINER=true

# Start the application
CMD ["node", "superintelligent_agent_collective.js"]
```

### **Docker Compose (Local Testing)**
```yaml
version: '3.8'
services:
  dina-agi:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DOCKER_CONTAINER=true
      - FIREBASE_PROJECT_ID=agenticsfoundation-2e916
    volumes:
      - ./agent_builds:/app/agent_builds
    restart: unless-stopped
```

---

## 🔧 **Troubleshooting**

### **Common Deployment Issues**

**🚨 Build Failures:**
```bash
# Check build logs
gcloud builds list --limit=5

# View specific build
gcloud builds log [BUILD_ID]

# Common fixes
rm -rf node_modules package-lock.json
npm install
```

**🚨 Memory Issues:**
```bash
# Increase memory
gcloud run services update dina-agi \
  --memory 4Gi \
  --region us-central1

# Reduce agent count
gcloud run services update dina-agi \
  --set-env-vars AGENT_COUNT=64 \
  --region us-central1
```

**🚨 Permission Errors:**
```bash
# Check service account permissions
gcloud projects get-iam-policy agenticsfoundation-2e916

# Grant necessary roles
gcloud projects add-iam-policy-binding agenticsfoundation-2e916 \
  --member="serviceAccount:your-service-account@agenticsfoundation-2e916.iam.gserviceaccount.com" \
  --role="roles/secretmanager.secretAccessor"
```

### **Performance Optimization**

**Cold Start Reduction:**
```bash
# Keep minimum 1 instance warm
gcloud run services update dina-agi \
  --min-instances 1 \
  --region us-central1
```

**Resource Allocation:**
```bash
# Optimize for your workload
gcloud run services update dina-agi \
  --memory 3Gi \
  --cpu 2 \
  --concurrency 50 \
  --region us-central1
```

---

## 📊 **Cost Management**

### **Current Costs**
```bash
# View billing
gcloud billing accounts list
gcloud billing projects describe agenticsfoundation-2e916

# Estimate costs
echo "Estimated monthly cost for current configuration:"
echo "- 2GB RAM, 2 CPU, 1 min instance: ~$15-30/month"
echo "- Depends on actual usage and requests"
```

### **Cost Optimization Strategies**

**1. Scale to Zero (Maximum Savings):**
```bash
gcloud run services update dina-agi \
  --min-instances 0 \
  --region us-central1
# Agents stop when no requests, restart when accessed
```

**2. Reduce Resources:**
```bash
gcloud run services update dina-agi \
  --memory 1Gi \
  --cpu 1 \
  --region us-central1
# Lower resources = lower costs
```

**3. Regional Pricing:**
```bash
# Some regions are cheaper
gcloud run services update dina-agi \
  --region us-central1  # Generally cheapest US region
```

---

## 🚀 **Advanced Deployment Options**

### **Multi-Service Architecture**
```bash
# Deploy separate services
gcloud run deploy dina-agents --source ./agents --region us-central1
gcloud run deploy dina-storage --source ./storage --region us-central1  
gcloud run deploy dina-network --source ./network --region us-central1

# Use Cloud Run service-to-service communication
```

### **Cloud Functions Integration**
```bash
# Deploy companion functions
gcloud functions deploy processBuilds \
  --runtime nodejs18 \
  --trigger-http \
  --allow-unauthenticated
```

### **Scheduled Tasks**
```bash
# Create Cloud Scheduler job
gcloud scheduler jobs create http github-commit-job \
  --schedule="0 * * * *" \
  --uri=https://dina-agi-604785804458.us-central1.run.app/api/commit \
  --http-method=POST
```

---

## ✅ **Deployment Checklist**

### **Pre-Deployment:**
- [ ] Test locally with `npm start`
- [ ] Update version in package.json
- [ ] Commit all changes to GitHub
- [ ] Verify environment variables
- [ ] Check resource requirements

### **Deployment:**
- [ ] Run deployment command
- [ ] Verify service is running
- [ ] Test all endpoints
- [ ] Check logs for errors
- [ ] Monitor resource usage

### **Post-Deployment:**
- [ ] Verify agents are building
- [ ] Check GitHub commits
- [ ] Test API endpoints
- [ ] Set up monitoring alerts
- [ ] Document any issues

---

**🎉 Your DINA AGI cloud deployment is production-ready and building the future 24/7! 🌍🧠✨**