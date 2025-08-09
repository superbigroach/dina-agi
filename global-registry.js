#!/usr/bin/env node

/**
 * DINA Global Registry - Tracks all user instances and their builds
 * This would be deployed as a central service (Firebase/Supabase/etc)
 */

const express = require('express');
const cors = require('cors');
const crypto = require('crypto');

class DinaGlobalRegistry {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8080;
    
    // In-memory storage (in production use Firebase/Supabase)
    this.instances = new Map();
    this.builds = [];
    this.collectives = [];
    this.forks = [];
    
    this.setupRoutes();
    console.log('🌍 DINA Global Registry starting...');
  }

  setupRoutes() {
    this.app.use(cors());
    this.app.use(express.json());

    // Register a new DINA instance
    this.app.post('/api/register-instance', (req, res) => {
      const { instanceId, userId, location, capabilities, specialization } = req.body;
      
      const instance = {
        instanceId,
        userId,
        location,
        capabilities,
        specialization,
        status: 'active',
        builds: 0,
        joined: Date.now(),
        lastSeen: Date.now()
      };
      
      this.instances.set(instanceId, instance);
      
      console.log(`✅ New instance: ${userId} from ${location} (${specialization})`);
      
      res.json({
        success: true,
        message: 'Instance registered successfully',
        networkSize: this.instances.size
      });
    });

    // Share a build with the network
    this.app.post('/api/share-build', (req, res) => {
      const build = {
        ...req.body,
        buildId: crypto.randomBytes(8).toString('hex'),
        timestamp: Date.now(),
        likes: 0,
        forks: 0,
        views: 0
      };
      
      this.builds.push(build);
      
      // Update instance build count
      if (this.instances.has(build.instanceId)) {
        this.instances.get(build.instanceId).builds++;
      }
      
      console.log(`📦 New build: ${build.projectType} by ${build.userId}`);
      
      res.json({
        success: true,
        buildId: build.buildId,
        message: 'Build shared with global network'
      });
    });

    // Get recent builds from all users
    this.app.get('/api/recent-builds', (req, res) => {
      const limit = parseInt(req.query.limit) || 50;
      const specialization = req.query.specialization;
      
      let filteredBuilds = [...this.builds];
      
      if (specialization) {
        filteredBuilds = filteredBuilds.filter(b => 
          b.metadata?.specialization === specialization
        );
      }
      
      const recentBuilds = filteredBuilds
        .sort((a, b) => b.timestamp - a.timestamp)
        .slice(0, limit)
        .map(build => ({
          buildId: build.buildId,
          projectType: build.projectType,
          userId: build.userId,
          instanceId: build.instanceId,
          likes: build.likes,
          forks: build.forks,
          timestamp: build.timestamp,
          specialization: build.metadata?.specialization
        }));
      
      res.json(recentBuilds);
    });

    // Fork a build
    this.app.post('/api/fork-build', (req, res) => {
      const { buildId, instanceId, userId } = req.body;
      
      const originalBuild = this.builds.find(b => b.buildId === buildId);
      if (!originalBuild) {
        return res.status(404).json({ error: 'Build not found' });
      }
      
      const fork = {
        forkId: crypto.randomBytes(8).toString('hex'),
        originalBuildId: buildId,
        instanceId,
        userId,
        timestamp: Date.now()
      };
      
      this.forks.push(fork);
      originalBuild.forks++;
      
      console.log(`🔀 Fork: ${userId} forked ${originalBuild.projectType}`);
      
      res.json({
        success: true,
        forkId: fork.forkId,
        originalBuild: {
          projectType: originalBuild.projectType,
          code: originalBuild.code,
          metadata: originalBuild.metadata
        }
      });
    });

    // Start a collective build
    this.app.post('/api/start-collective', (req, res) => {
      const collective = {
        ...req.body,
        collectiveId: crypto.randomBytes(8).toString('hex'),
        participants: [req.body.instanceId],
        contributions: [],
        status: 'open',
        created: Date.now()
      };
      
      this.collectives.push(collective);
      
      console.log(`🤝 Collective: ${req.body.userId} started "${req.body.topic}"`);
      
      res.json({
        success: true,
        collectiveId: collective.collectiveId
      });
    });

    // Join a collective build
    this.app.post('/api/join-collective', (req, res) => {
      const { collectiveId, instanceId, userId } = req.body;
      
      const collective = this.collectives.find(c => c.collectiveId === collectiveId);
      if (!collective) {
        return res.status(404).json({ error: 'Collective not found' });
      }
      
      if (!collective.participants.includes(instanceId)) {
        collective.participants.push(instanceId);
      }
      
      console.log(`👥 ${userId} joined collective "${collective.topic}"`);
      
      res.json({
        success: true,
        participants: collective.participants.length
      });
    });

    // Get network statistics
    this.app.get('/api/stats', (req, res) => {
      const stats = {
        totalInstances: this.instances.size,
        totalAgents: this.instances.size * 128, // Assuming 128 agents per instance
        totalBuilds: this.builds.length,
        totalForks: this.forks.length,
        activeCollectives: this.collectives.filter(c => c.status === 'open').length,
        topSpecializations: this.getTopSpecializations(),
        recentActivity: this.getRecentActivity(),
        networkHealth: 'optimal'
      };
      
      res.json(stats);
    });

    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'healthy', timestamp: Date.now() });
    });

    // Serve web interface
    this.app.get('/', (req, res) => {
      res.send(this.generateWebInterface());
    });
  }

  getTopSpecializations() {
    const specializations = {};
    for (const instance of this.instances.values()) {
      const spec = instance.specialization;
      specializations[spec] = (specializations[spec] || 0) + 1;
    }
    
    return Object.entries(specializations)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([spec, count]) => ({ specialization: spec, instances: count }));
  }

  getRecentActivity() {
    const activities = [];
    
    // Recent builds
    this.builds
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 10)
      .forEach(build => {
        activities.push({
          type: 'build',
          userId: build.userId,
          project: build.projectType,
          timestamp: build.timestamp
        });
      });
    
    return activities.sort((a, b) => b.timestamp - a.timestamp);
  }

  generateWebInterface() {
    return `
<!DOCTYPE html>
<html>
<head>
    <title>DINA AGI Global Network</title>
    <style>
        body { font-family: monospace; background: #000; color: #0f0; padding: 20px; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; }
        .stat-card { border: 1px solid #0f0; padding: 15px; }
        .builds { margin-top: 40px; }
        .build-item { border-bottom: 1px solid #333; padding: 10px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🧠 DINA AGI Global Network</h1>
            <p>Dynamic Intelligence Network Architecture - Worldwide</p>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <h3>📊 Network Stats</h3>
                <p>Instances: ${this.instances.size}</p>
                <p>Total Agents: ${this.instances.size * 128}</p>
                <p>Builds: ${this.builds.length}</p>
                <p>Forks: ${this.forks.length}</p>
            </div>
            
            <div class="stat-card">
                <h3>🌍 Join the Network</h3>
                <code>npx dina-agi network</code>
                <p>Start your own AGI instance and contribute to the collective intelligence</p>
            </div>
        </div>
        
        <div class="builds">
            <h2>🚀 Recent Builds from the Network</h2>
            ${this.builds.slice(-10).reverse().map(build => `
                <div class="build-item">
                    <strong>${build.projectType}</strong> by ${build.userId}
                    <br>Specialization: ${build.metadata?.specialization || 'general'}
                    <br>⭐ ${build.likes} likes | 🔀 ${build.forks} forks
                </div>
            `).join('')}
        </div>
    </div>
</body>
</html>`;
  }

  start() {
    this.app.listen(this.port, () => {
      console.log(`🌍 DINA Global Registry running on port ${this.port}`);
      console.log(`🔗 Web interface: http://localhost:${this.port}`);
      console.log('📡 Ready to coordinate worldwide DINA instances!');
    });
  }
}

// Start the registry
if (require.main === module) {
  const registry = new DinaGlobalRegistry();
  registry.start();
}

module.exports = { DinaGlobalRegistry };