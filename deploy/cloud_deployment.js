#!/usr/bin/env node

/**
 * AUTONOMOUS CLOUD DEPLOYMENT SYSTEM
 * Enables agents to deploy themselves and their creations to the cloud in real-time
 * Integrates with GitHub for autonomous code commits and Cloud Run for deployment
 */

const { exec } = require('child_process');
const fs = require('fs').promises;
const path = require('path');
const apiConfig = require('../config/api_config');

class AutonomousCloudDeployment {
  constructor() {
    this.config = apiConfig.config;
    this.deploymentQueue = [];
    this.activeDeployments = new Map();
    this.setupDeploymentWatcher();
  }

  setupDeploymentWatcher() {
    console.log('🚀 Setting up autonomous deployment system...');
    
    // Watch for agent-created files and auto-deploy
    setInterval(() => {
      this.checkForNewBuilds();
    }, 30000); // Check every 30 seconds
    
    // Process deployment queue
    setInterval(() => {
      this.processDeploymentQueue();
    }, 10000); // Process every 10 seconds
  }

  async checkForNewBuilds() {
    try {
      const agentBuildsPath = path.join(__dirname, '../agent_builds');
      
      // Create directory if it doesn't exist
      try {
        await fs.access(agentBuildsPath);
      } catch {
        await fs.mkdir(agentBuildsPath, { recursive: true });
      }
      
      const builds = await fs.readdir(agentBuildsPath);
      
      for (const buildDir of builds) {
        const buildPath = path.join(agentBuildsPath, buildDir);
        const stat = await fs.stat(buildPath);
        
        if (stat.isDirectory() && !this.activeDeployments.has(buildDir)) {
          console.log(`🔍 New agent build detected: ${buildDir}`);
          await this.queueDeployment(buildDir, buildPath);
        }
      }
    } catch (error) {
      console.log('📁 No agent builds found yet, agents still creating...');
    }
  }

  async queueDeployment(buildName, buildPath) {
    const deployment = {
      id: `deploy_${buildName}_${Date.now()}`,
      buildName,
      buildPath,
      timestamp: new Date().toISOString(),
      status: 'queued',
      type: await this.detectBuildType(buildPath)
    };

    this.deploymentQueue.push(deployment);
    console.log(`📋 Queued deployment: ${deployment.id} (${deployment.type})`);
  }

  async detectBuildType(buildPath) {
    try {
      const files = await fs.readdir(buildPath);
      
      if (files.includes('package.json')) return 'nodejs';
      if (files.includes('Dockerfile')) return 'docker';
      if (files.includes('requirements.txt')) return 'python';
      if (files.includes('Cargo.toml')) return 'rust';
      if (files.includes('go.mod')) return 'go';
      
      return 'generic';
    } catch {
      return 'unknown';
    }
  }

  async processDeploymentQueue() {
    if (this.deploymentQueue.length === 0) return;
    
    const deployment = this.deploymentQueue.shift();
    this.activeDeployments.set(deployment.buildName, deployment);
    
    console.log(`🚀 Processing deployment: ${deployment.id}`);
    
    try {
      // Step 1: Commit to GitHub
      if (this.config.github.token && this.config.github.autoCommit) {
        await this.commitToGitHub(deployment);
      }
      
      // Step 2: Deploy to Cloud Run
      if (this.config.github.autoDeploy) {
        await this.deployToCloudRun(deployment);
      }
      
      deployment.status = 'completed';
      console.log(`✅ Deployment completed: ${deployment.id}`);
      
    } catch (error) {
      deployment.status = 'failed';
      deployment.error = error.message;
      console.error(`❌ Deployment failed: ${deployment.id}`, error.message);
    }
    
    // Clean up after 5 minutes
    setTimeout(() => {
      this.activeDeployments.delete(deployment.buildName);
    }, 300000);
  }

  async commitToGitHub(deployment) {
    return new Promise((resolve, reject) => {
      const commands = [
        'git add .',
        `git commit -m "🤖 Autonomous agent build: ${deployment.buildName}

Built by superintelligent agents on ${deployment.timestamp}
Build type: ${deployment.type}
Deployment ID: ${deployment.id}

🤖 Generated with Autonomous Agent Collective
Co-Authored-By: SuperintelligentAgent <noreply@agenticsfoundation.ai>"`,
        'git push origin main'
      ];

      const executeCommand = (index) => {
        if (index >= commands.length) {
          resolve();
          return;
        }

        exec(commands[index], { cwd: process.cwd() }, (error, stdout, stderr) => {
          if (error) {
            console.warn(`Git command warning: ${error.message}`);
            // Continue anyway for autonomous operation
          }
          
          console.log(`Git: ${commands[index]} - ${stdout || 'completed'}`);
          executeCommand(index + 1);
        });
      };

      executeCommand(0);
    });
  }

  async deployToCloudRun(deployment) {
    return new Promise((resolve, reject) => {
      const serviceName = `agent-${deployment.buildName.toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;
      
      const deployCommand = `gcloud run deploy ${serviceName} \
        --source ${deployment.buildPath} \
        --platform managed \
        --region ${this.config.cloudRun.region} \
        --allow-unauthenticated \
        --memory ${this.config.cloudRun.memory} \
        --cpu ${this.config.cloudRun.cpu} \
        --max-instances ${this.config.cloudRun.maxInstances} \
        --min-instances ${this.config.cloudRun.minInstances} \
        --set-env-vars "AUTONOMOUS_AGENT=true,BUILD_ID=${deployment.id}"`;

      exec(deployCommand, (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Cloud Run deployment failed: ${error.message}`));
          return;
        }
        
        console.log(`☁️  Cloud Run deployment output:\n${stdout}`);
        
        // Extract service URL from output
        const urlMatch = stdout.match(/Service URL: (https:\/\/[^\s]+)/);
        if (urlMatch) {
          deployment.serviceUrl = urlMatch[1];
          console.log(`🌐 Agent service deployed: ${deployment.serviceUrl}`);
        }
        
        resolve();
      });
    });
  }

  async createDockerfile(buildPath, buildType) {
    let dockerfile = '';
    
    switch (buildType) {
      case 'nodejs':
        dockerfile = `FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 8080
CMD ["npm", "start"]`;
        break;
        
      case 'python':
        dockerfile = `FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
EXPOSE 8080
CMD ["python", "main.py"]`;
        break;
        
      case 'generic':
      default:
        dockerfile = `FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install || echo "No package.json found"
EXPOSE 8080
CMD ["node", "index.js"]`;
        break;
    }
    
    await fs.writeFile(path.join(buildPath, 'Dockerfile'), dockerfile);
    console.log(`📝 Created Dockerfile for ${buildType} build`);
  }

  // API endpoints for agents to trigger deployments
  setupDeploymentAPI(app) {
    app.post('/api/deploy/trigger', async (req, res) => {
      const { buildPath, buildName, agentId } = req.body;
      
      try {
        await this.queueDeployment(buildName || `agent_${agentId}_build`, buildPath);
        res.json({
          success: true,
          message: 'Deployment queued',
          queueLength: this.deploymentQueue.length
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    app.get('/api/deploy/status', (req, res) => {
      res.json({
        queueLength: this.deploymentQueue.length,
        activeDeployments: Array.from(this.activeDeployments.values()),
        recentDeployments: this.deploymentQueue.slice(-10)
      });
    });

    console.log('🔗 Deployment API endpoints registered');
  }

  // Autonomous GitHub Actions workflow creation
  async setupGitHubActions() {
    const workflowPath = path.join(__dirname, '../.github/workflows/autonomous-deployment.yml');
    
    const workflow = `name: Autonomous Agent Deployment

on:
  push:
    branches: [ main ]
    paths:
      - 'agent_builds/**'
      - 'superintelligent_agent_collective.js'
      - 'scraper_backend/**'

env:
  PROJECT_ID: agenticsfoundation-2e916
  SERVICE: superintelligent-agent-collective
  REGION: us-central1

jobs:
  deploy:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      id-token: write

    steps:
    - name: Checkout
      uses: actions/checkout@v4

    - name: Google Auth
      uses: 'google-github-actions/auth@v2'
      with:
        credentials_json: '\${{ secrets.GOOGLE_SERVICE_ACCOUNT_KEY }}'

    - name: Deploy to Cloud Run
      uses: google-github-actions/deploy-cloudrun@v2
      with:
        service: \${{ env.SERVICE }}
        region: \${{ env.REGION }}
        source: ./
        env_vars: |
          AUTONOMOUS_AGENT=true
          GITHUB_DEPLOYMENT=true

    - name: Show Output
      run: echo \${{ steps.deploy.outputs.url }}`;

    await fs.mkdir(path.dirname(workflowPath), { recursive: true });
    await fs.writeFile(workflowPath, workflow);
    
    console.log('⚡ GitHub Actions workflow created for autonomous deployment');
  }
}

module.exports = AutonomousCloudDeployment;