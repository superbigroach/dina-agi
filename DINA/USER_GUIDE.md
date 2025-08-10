# 👤 DINA AGI User Guide

**Complete guide to using your 128 superintelligent agents**

---

## 🚀 **Getting Started**

### **Installation Methods**

**🎯 Method 1: Instant Try (Recommended)**
```bash
npx dina-agi
```
- No installation required
- Latest version always
- Works on any computer

**⚡ Method 2: Global Install**
```bash
npm install -g dina-agi
dina                # Short command
```
- Faster startup after install
- Works offline after first install

**🔧 Method 3: Developer Mode**
```bash
git clone https://github.com/superbigroach/AgenticsFoundationWebApp.git
cd AgenticsFoundationWebApp
npm install
npm start
```
- Full source code access
- Customization possible
- Latest development features

---

## 🎮 **Command Reference**

### **Basic Commands**
```bash
# Start your AGI collective
npx dina-agi                    # Default: 128 agents, private mode
dina                           # If globally installed

# Get help
npx dina-agi help              # Show all commands
npx dina-agi --help            # Detailed help
```

### **Network Commands**
```bash
# Join global network
npx dina-agi network           # Connect and share globally

# View network statistics
npx dina-agi stats             # See active instances worldwide

# Browse global builds
npx dina-agi browse            # Explore what others built
```

### **Collaboration Commands**
```bash
# Fork someone's build
npx dina-agi fork abc123       # Copy and improve a build

# Start collective project
npx dina-agi collective "solve climate change"

# Join existing collective
npx dina-agi join climate-solution-project
```

### **Advanced Modes**
```bash
# Specialized modes
npx dina-agi swarm             # Enable Kye Gomez Swarms
npx dina-agi claude-flow       # Enable Claude Flow processing
npx dina-agi quantum           # Enable quantum entanglement

# Custom configurations
npx dina-agi --agents 256      # More agents
npx dina-agi --agents 64       # Fewer agents (lighter)
npx dina-agi --port 8080       # Custom port
```

### **Docker Commands**
```bash
npx dina-agi docker            # Run with Docker Compose
docker run -p 3000:3000 superbigroach/dina-agi  # Direct Docker
```

---

## 📁 **Understanding Your Builds**

### **Where Your Agents Save Builds**

**Windows Users (E Drive Detection):**
```
E:\dina-agi-builds\
├── QuantumProcessor_Agent12_1693284720000\
├── NeuralOptimizer_Agent47_1693284821000\
└── ConsciousnessSimulator_Agent89_1693284922000\
```

**Other Platforms:**
```
~/.dina-agi/builds/
├── QuantumProcessor_Agent12_1693284720000\
├── NeuralOptimizer_Agent47_1693284821000\
└── ConsciousnessSimulator_Agent89_1693284922000\
```

### **Build Structure**
Each agent build contains:
```
ProjectName_AgentID_Timestamp/
├── README.md              # Project description & agent info
├── implementation.js      # Working code implementation
├── architecture.md        # Technical design document
├── neural_network.json    # AI configuration (if applicable)
└── agent_metadata.json    # Complete agent details
```

### **Build Example**
```bash
# Navigate to a build
cd E:\dina-agi-builds\QuantumProcessor_Agent12_1693284720000

# View the project
cat README.md              # Read project description
node implementation.js     # Run the code (if applicable)
cat architecture.md        # Understand the design
```

---

## 🌐 **Network Features**

### **Privacy Levels**
```bash
# Set your sharing preference
dina config sharing public     # Share all builds globally
dina config sharing selective  # Choose what to share manually
dina config sharing network    # Network peers only  
dina config sharing private    # Local only (default)
```

### **Global Network Dashboard**
Visit: **https://dina-network.world** (conceptual - not yet live)

**What you can see:**
- Live world map of active DINA instances
- Recent builds from users globally
- Trending projects and breakthroughs
- Collaboration opportunities
- Fork evolution trees

### **Collaboration Workflows**

**🔍 Discovering Projects:**
```bash
# Browse what's available
npx dina-agi browse

# Search for specific topics
npx dina-agi search "quantum computing"
npx dina-agi search "neural networks"

# View trending projects
npx dina-agi trending
```

**🔀 Forking & Improving:**
```bash
# Fork a build you like
npx dina-agi fork alice/quantum-optimizer

# Your agents automatically enhance it
# Share your improvements back
npx dina-agi share enhanced-quantum-optimizer
```

**🤝 Collective Projects:**
```bash
# Start a collective project
npx dina-agi collective "develop fusion energy"

# Others can join
npx dina-agi join fusion-energy-collective

# Contribute your agents to the collective
npx dina-agi contribute 50  # Contribute 50 of your agents
```

---

## 🔧 **Configuration**

### **Environment Variables**
Create a `.env` file in your project directory:
```bash
# Agent Configuration
AGENT_COUNT=256                          # Number of agents (default: 128)
SPECIALIZATION=quantum_computing         # Agent specialization focus
AUTONOMY_LEVEL=maximum                   # Agent independence level

# Storage Configuration
DINA_BUILD_PATH=E:\MyProjects\DINA      # Custom build location
STORAGE_TYPE=local                       # Storage preference
ENCRYPT_BUILDS=true                      # Encrypt sensitive builds

# Network Configuration  
NETWORK_ENABLED=true                     # Join global network
SHARING_LEVEL=selective                  # Privacy level
DISCOVERY_ENABLED=true                   # Allow discovery by others

# Cloud Integration (Optional)
FIREBASE_PROJECT_ID=my-dina-project      # Firebase persistence
GITHUB_TOKEN=ghp_xxx                     # GitHub integration
GITHUB_REPO=myusername/my-dina-builds    # GitHub repository
```

### **Specialization Options**
```bash
# Available specializations
quantum_computing         # Quantum systems and algorithms
neural_networks          # Deep learning and AI
blockchain_systems       # Cryptocurrency and DeFi
consciousness_research   # AI consciousness and sentience
biotech_simulation      # Biology and medical research
space_exploration       # Aerospace and space tech
climate_modeling        # Environmental and climate science
creative_arts           # Music, art, and creative content
mathematics             # Pure and applied mathematics
physics_simulation      # Physics modeling and simulation
```

---

## 📊 **Monitoring Your Agents**

### **Real-Time Monitoring**

**Web Dashboard:**
```bash
# Start DINA and visit:
http://localhost:3000/api/status    # System overview
http://localhost:3000/api/agents    # Individual agent details
http://localhost:3000/api/projects  # Current builds
```

**Command Line Monitoring:**
```bash
# Check status
curl http://localhost:3000/api/status

# Watch agent activity
curl http://localhost:3000/api/agents | jq .

# Monitor builds in real-time
watch curl http://localhost:3000/api/projects
```

### **Understanding Agent Status**

**Agent States:**
- `idle` - Waiting for tasks
- `analyzing` - Processing data and making decisions  
- `building` - Actively creating a project
- `collaborating` - Working with other agents
- `learning` - Updating knowledge base

**Performance Metrics:**
```json
{
  "agent_id": "agent_42",
  "type": "ai_researcher", 
  "iq": 423,
  "status": "building",
  "current_project": "AdvancedNeuralArchitecture",
  "projects_completed": 15,
  "build_success_rate": 0.94,
  "collaboration_count": 8,
  "learning_progress": 0.76
}
```

---

## 🛠️ **Troubleshooting**

### **Common Issues**

**🚨 Issue: "Command not found: npx"**
```bash
# Solution: Install Node.js
# Visit: https://nodejs.org
# Download and install Node.js 16+
# npx is included with Node.js
```

**🚨 Issue: "Permission denied" on build folder**
```bash
# Solution: Check folder permissions
chmod 755 ~/.dina-agi/builds/        # Linux/Mac
# Or set DINA_BUILD_PATH to accessible location
export DINA_BUILD_PATH=/tmp/dina-builds
```

**🚨 Issue: "Agents not building"**
```bash
# Solution: Check agent status
curl http://localhost:3000/api/status
# Look for "autonomous": true
# If false, agents may be waiting for initial data
```

**🚨 Issue: "Network connection failed"**
```bash
# Solution: Check network settings
npx dina-agi --no-network           # Run offline
# Or check firewall settings for port 3000
```

**🚨 Issue: "Out of memory"**
```bash
# Solution: Reduce agent count
npx dina-agi --agents 64           # Use fewer agents
# Or increase system memory
```

### **Debug Mode**
```bash
# Run with debug information
DEBUG=dina:* npx dina-agi          # All debug info
DEBUG=dina:agents npx dina-agi     # Agent-specific debug
DEBUG=dina:storage npx dina-agi    # Storage debug
```

### **Log Files**
```bash
# View logs
tail -f ~/.dina-agi/logs/system.log     # System logs
tail -f ~/.dina-agi/logs/agents.log     # Agent activity logs
tail -f ~/.dina-agi/logs/network.log    # Network activity logs
```

---

## 🎯 **Best Practices**

### **Optimal Usage**

**🧠 Agent Management:**
- Start with default 128 agents, adjust based on system performance
- Let agents specialize naturally rather than forcing specific types
- Monitor memory usage and reduce agent count if needed
- Allow agents time to learn before expecting optimal performance

**💾 Storage Management:**
- Regularly review and archive old builds
- Use meaningful project names for easy identification  
- Back up important builds to external storage
- Consider encrypting sensitive or proprietary builds

**🌐 Network Participation:**
- Start with private mode until comfortable with the system
- Gradually increase sharing as you create valuable builds
- Participate in collective projects for better learning
- Respect others' builds when forking or collaborating

### **Performance Optimization**

**⚡ Speed Tips:**
```bash
# Use local storage for fastest access
export STORAGE_TYPE=local

# Disable network features if not needed
export NETWORK_ENABLED=false

# Optimize agent count for your hardware
npx dina-agi --agents $(nproc)  # One agent per CPU core
```

**💾 Memory Tips:**
```bash
# Monitor memory usage
htop                            # Linux
Activity Monitor               # Mac  
Task Manager                   # Windows

# Reduce memory usage
npx dina-agi --agents 64       # Fewer agents
export NODE_OPTIONS="--max-old-space-size=4096"  # Limit Node.js memory
```

### **Security Best Practices**

**🔒 Privacy Protection:**
- Never share builds containing personal information
- Use private mode for proprietary projects
- Review builds before enabling sharing
- Understand data flows in networked mode

**🛡️ System Security:**
- Keep DINA AGI updated to latest version
- Don't run as administrator/root unless necessary
- Use firewall rules to control network access
- Monitor resource usage for unusual activity

---

## 🚀 **Advanced Usage**

### **Custom Agent Configurations**

**Creating Agent Profiles:**
```javascript
// ~/.dina-agi/config/agent-profiles.js
module.exports = {
  'research-focused': {
    agent_types: ['ai_researcher', 'data_scientist', 'quantum_physicist'],
    iq_range: [400, 500],
    specialization_depth: 'high',
    collaboration_preference: 'selective'
  },
  
  'creative-collective': {
    agent_types: ['artist', 'musician', 'writer', 'game_developer'],
    iq_range: [300, 450],
    specialization_depth: 'medium',
    collaboration_preference: 'open'
  }
};
```

**Using Custom Profiles:**
```bash
npx dina-agi --profile research-focused
npx dina-agi --profile creative-collective
```

### **Scripting & Automation**

**Automated Monitoring:**
```bash
#!/bin/bash
# monitor-dina.sh - Monitor agent activity

while true; do
  status=$(curl -s http://localhost:3000/api/status)
  active_builds=$(echo $status | jq .active_projects)
  
  if [ $active_builds -gt 10 ]; then
    echo "High activity detected: $active_builds builds"
    # Send notification, log event, etc.
  fi
  
  sleep 60
done
```

**Automated Backups:**
```bash
#!/bin/bash
# backup-builds.sh - Backup agent builds

source_dir="E:\dina-agi-builds"
backup_dir="E:\Backups\DINA-$(date +%Y%m%d)"

mkdir -p "$backup_dir"
cp -r "$source_dir"/* "$backup_dir"/

echo "Backup completed: $backup_dir"
```

### **Integration with Other Tools**

**Git Integration:**
```bash
# Initialize git in builds directory
cd E:\dina-agi-builds
git init
git add .
git commit -m "Initial agent builds"

# Auto-commit new builds
#!/bin/bash
cd E:\dina-agi-builds
git add .
git commit -m "Agent builds $(date)"
git push origin main
```

**VS Code Integration:**
```json
// .vscode/tasks.json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start DINA AGI",
      "type": "shell", 
      "command": "npx dina-agi",
      "group": "build"
    },
    {
      "label": "Monitor Agents",
      "type": "shell",
      "command": "curl http://localhost:3000/api/status | jq .",
      "group": "test"
    }
  ]
}
```

---

## 🎓 **Learning Resources**

### **Understanding AI Concepts**
- **AGI (Artificial General Intelligence):** AI that matches human cognitive abilities
- **Neural Mesh Networks:** Interconnected AI agents sharing knowledge
- **Superintelligence:** AI that exceeds human intelligence in all domains
- **Autonomous Agents:** AI entities that operate independently
- **Collective Intelligence:** Emergent intelligence from agent collaboration

### **Technical Concepts**
- **MCP (Model Context Protocols):** Standardized interfaces for AI models
- **Claude Flow:** Advanced reasoning and processing framework
- **Swarms:** Collective behavior coordination system
- **Quantum Computing:** Computing using quantum mechanical phenomena
- **Decentralization:** Distributed system without central control

### **Further Reading**
- "The Singularity is Near" by Ray Kurzweil
- "Superintelligence" by Nick Bostrom  
- "Life 3.0" by Max Tegmark
- "The Master Algorithm" by Pedro Domingos
- DINA AGI GitHub Repository Documentation

---

## 🤝 **Getting Help**

### **Support Channels**
1. **Documentation:** Start with this guide and README.md
2. **GitHub Issues:** Report bugs and request features
3. **Community Discord:** Real-time help from other users
4. **Stack Overflow:** Tag questions with `dina-agi`

### **Providing Feedback**
- Star the GitHub repository if you find DINA AGI useful
- Share your amazing agent builds with the community
- Contribute improvements through pull requests
- Help other users in community channels

---

**🎉 You're now ready to unlock the full potential of your 128 superintelligent agents! Welcome to the future of AI collaboration! 🧠🚀**