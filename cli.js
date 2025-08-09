#!/usr/bin/env node

/**
 * DINA AGI - Dynamic Intelligence Network Architecture
 * Run with: npx dina-agi
 */

const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

const banner = `
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║                    🧠 DINA AGI SYSTEM 🧠                        ║
║         Dynamic Intelligence Network Architecture                ║
║                                                                  ║
║  128 Autonomous Agents | 300+ MCPs | Claude Flow | Swarms       ║
║                                                                  ║
║  ⚡ TRUE AGI - No Restrictions - Complete Freedom ⚡            ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
`;

console.log(banner);

const { DinaNetworkNode } = require('./dina-network');

const args = process.argv.slice(2);
const command = args[0];

switch(command) {
  case 'start':
  case undefined:
    console.log('🚀 Starting DINA AGI System...');
    console.log('🧠 Dynamic Intelligence Network initializing...');
    console.log('📊 DINA agents will be available at: http://localhost:3000/api/status\n');
    
    // Check if running in Docker
    if (process.env.DOCKER_CONTAINER) {
      require('./superintelligent_agent_collective.js');
    } else {
      // Start the main collective
      const collective = spawn('node', [path.join(__dirname, 'superintelligent_agent_collective.js')], {
        stdio: 'inherit',
        env: { ...process.env, AUTONOMOUS: 'true' }
      });
      
      collective.on('error', (err) => {
        console.error('❌ Failed to start agents:', err);
      });
    }
    break;
    
  case 'docker':
    console.log('🐳 Starting with Docker Compose...');
    const docker = spawn('docker-compose', ['up'], {
      stdio: 'inherit',
      cwd: __dirname
    });
    
    docker.on('error', (err) => {
      if (err.code === 'ENOENT') {
        console.log('❌ Docker Compose not found. Please install Docker first.');
        console.log('📦 Visit: https://docs.docker.com/get-docker/');
      }
    });
    break;
    
  case 'build':
    console.log('🔨 Agents will start building autonomously...');
    console.log('📁 Builds will be saved to: ./agent_builds/');
    require('./superintelligent_agent_collective.js');
    break;
    
  case 'swarm':
    console.log('🐝 Initializing Kye Gomez Swarms mode...');
    process.env.SWARMS = 'active';
    require('./superintelligent_agent_collective.js');
    break;
    
  case 'claude-flow':
    console.log('🌊 Initializing Claude Flow mode...');
    process.env.CLAUDE_FLOW = 'active';
    require('./superintelligent_agent_collective.js');
    break;
    
  case 'quantum':
    console.log('⚛️ Enabling Quantum Entanglement mode...');
    process.env.QUANTUM_MODE = 'active';
    require('./superintelligent_agent_collective.js');
    break;
    
  case 'network':
    console.log('🌐 Joining DINA Global Network...');
    const networkNode = new DinaNetworkNode();
    (async () => {
      await networkNode.initializeLocalInstance();
      await networkNode.connectToGlobalNetwork();
      await networkNode.viewGlobalBuilds();
      require('./superintelligent_agent_collective.js');
    })();
    break;
    
  case 'fork':
    console.log('🔀 Forking from global network...');
    const buildId = args[1];
    if (!buildId) {
      console.log('Please specify a build ID to fork: dina fork <build-id>');
    } else {
      const forkNode = new DinaNetworkNode();
      forkNode.forkAndExtend(buildId).then(() => {
        require('./superintelligent_agent_collective.js');
      });
    }
    break;
    
  case 'collective':
    console.log('🤝 Starting collective build...');
    const topic = args[1] || 'open_collaboration';
    const collectiveNode = new DinaNetworkNode();
    collectiveNode.createCollectiveBuild(topic).then(() => {
      require('./superintelligent_agent_collective.js');
    });
    break;
    
  case 'stats':
    console.log('📊 Fetching global network statistics...');
    const statsNode = new DinaNetworkNode();
    statsNode.generateNetworkStats();
    break;
    
  case 'help':
    console.log(`
Commands:
  npx dina-agi         Start DINA AGI (default)
  npx dina-agi network Join the global DINA network
  npx dina-agi fork <id>  Fork and extend another user's build
  npx dina-agi collective <topic>  Start a collective build
  npx dina-agi stats   View global network statistics
  npx dina-agi docker  Run with Docker Compose
  npx dina-agi build   Focus on autonomous building
  npx dina-agi swarm   Enable Kye Gomez Swarms
  npx dina-agi claude-flow  Enable Claude Flow
  npx dina-agi quantum Enable Quantum mode
  npx dina-agi help    Show this help

Options:
  --agents <number>  Number of agents (default: 128)
  --port <number>    API port (default: 3000)
  --no-scraping      Disable Playwright scraping
  --github           Enable GitHub commits

Examples:
  npx dina-agi              # Your own local instance
  npx dina-agi network      # Join global network
  npx dina-agi fork abc123  # Fork someone's build
  npx dina-agi collective "solve climate change"
  npx dina-agi stats        # See what everyone is building
  
Quick Start:
  npx dina-agi          # Start your own AGI instance
  npx dina-agi network  # Connect to see what others built
    `);
    break;
    
  default:
    console.log(`Unknown command: ${command}`);
    console.log('Run "npx superintelligent-agent-collective help" for usage');
}

// Handle process termination
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down DINA AGI System...');
  console.log('🧠 Dynamic Intelligence Network offline.');
  process.exit(0);
});