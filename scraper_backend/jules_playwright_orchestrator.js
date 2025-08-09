#!/usr/bin/env node

/**
 * JULES-ENHANCED PLAYWRIGHT ORCHESTRATOR
 * VM-based browser automation with 60x parallelization
 * Intelligent error recovery and adaptive scraping
 */

const { chromium } = require('playwright');
const admin = require('firebase-admin');
const express = require('express');
const cors = require('cors');

class JulesPlaywrightOrchestrator {
  constructor() {
    this.agents = new Map();
    this.vmEnvironments = new Map();
    this.snapshots = new Map();
    this.maxConcurrent = 60; // Jules-style concurrency
    this.app = express();
    this.port = process.env.PORT || 3003;
    
    // Initialize Firebase
    if (!admin.apps.length) {
      const serviceAccount = require('./scraper-service-account-key.json');
      admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
      });
    }
    this.db = admin.firestore();
    
    this.setupServer();
  }
  
  setupServer() {
    this.app.use(cors());
    this.app.use(express.json({ limit: '50mb' }));
    
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        agents: this.agents.size,
        maxConcurrent: this.maxConcurrent,
        timestamp: new Date().toISOString()
      });
    });
    
    // Initialize agent fleet
    this.app.post('/initialize', async (req, res) => {
      try {
        await this.initializeAgentFleet();
        res.json({ success: true, agents: this.agents.size });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    // Orchestrate research
    this.app.post('/orchestrate', async (req, res) => {
      try {
        const { objective, planId } = req.body;
        const results = await this.orchestrateResearch(objective, planId);
        res.json(results);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
    
    // Create snapshot
    this.app.post('/snapshot', async (req, res) => {
      try {
        const snapshot = await this.createEnvironmentSnapshot();
        res.json(snapshot);
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }
  
  async initializeAgentFleet() {
    console.log('🚀 Initializing Jules-enhanced Playwright fleet...');
    
    const agentConfigs = [
      {
        id: 'arxiv_specialist',
        domains: ['cs.AI', 'cs.LG', 'cs.CL', 'cs.RO'],
        targets: [
          'https://arxiv.org/list/cs.AI/recent',
          'https://arxiv.org/list/cs.LG/recent',
          'https://arxiv.org/list/cs.CL/recent'
        ],
        browserConfig: {
          headless: true,
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
          viewport: { width: 1920, height: 1080 }
        },
        scrapeStrategy: 'adaptive',
        errorRecovery: true
      },
      {
        id: 'github_specialist',
        domains: ['repositories', 'trending', 'releases'],
        targets: [
          'https://github.com/trending',
          'https://github.com/topics/artificial-intelligence',
          'https://github.com/topics/machine-learning'
        ],
        browserConfig: {
          headless: true,
          args: ['--disable-blink-features=AutomationControlled']
        },
        scrapeStrategy: 'stealth',
        respectRateLimit: true
      },
      {
        id: 'paperswithcode_specialist',
        domains: ['papers', 'datasets', 'methods'],
        targets: [
          'https://paperswithcode.com/latest',
          'https://paperswithcode.com/sota'
        ],
        browserConfig: {
          headless: true,
          timeout: 60000
        },
        scrapeStrategy: 'structured',
        maxRequestsPerMinute: 20
      },
      {
        id: 'nature_specialist',
        domains: ['biotechnology', 'medical', 'quantum'],
        targets: [
          'https://www.nature.com/subjects/biotechnology',
          'https://www.nature.com/subjects/quantum-physics'
        ],
        browserConfig: {
          headless: true,
          slowMo: 500
        },
        scrapeStrategy: 'respectful',
        maxRequestsPerMinute: 10
      },
      {
        id: 'openai_specialist',
        domains: ['ai_research', 'llm', 'safety'],
        targets: [
          'https://openai.com/research',
          'https://openai.com/blog'
        ],
        browserConfig: {
          headless: true
        },
        scrapeStrategy: 'company_research'
      },
      {
        id: 'deepmind_specialist',
        domains: ['ai_research', 'reinforcement_learning'],
        targets: [
          'https://deepmind.google/research/publications/',
          'https://deepmind.google/discover/blog/'
        ],
        browserConfig: {
          headless: true
        },
        scrapeStrategy: 'company_research'
      }
    ];
    
    // Create agents with VM isolation
    for (const config of agentConfigs) {
      const agent = await this.createAgent(config);
      this.agents.set(config.id, agent);
      
      // Create environment snapshot
      const snapshot = await this.createSnapshot(config);
      this.snapshots.set(config.id, snapshot);
    }
    
    console.log(`✅ Initialized ${this.agents.size} specialized agents with VM isolation`);
  }
  
  async createAgent(config) {
    const browser = await chromium.launch(config.browserConfig);
    const context = await browser.newContext({
      ...config.browserConfig,
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36 JulesResearchBot/2.0'
    });
    
    return {
      id: config.id,
      config,
      browser,
      context,
      pages: new Map(),
      metrics: {
        requestCount: 0,
        successCount: 0,
        errorCount: 0,
        lastError: null,
        startTime: Date.now()
      }
    };
  }
  
  async createSnapshot(config) {
    return {
      id: `snapshot_${config.id}_${Date.now()}`,
      agentId: config.id,
      config: JSON.parse(JSON.stringify(config)),
      timestamp: new Date().toISOString(),
      environment: {
        nodeVersion: process.version,
        platform: process.platform,
        memory: process.memoryUsage()
      }
    };
  }
  
  async createEnvironmentSnapshot() {
    const snapshots = {};
    for (const [id, snapshot] of this.snapshots) {
      snapshots[id] = snapshot;
    }
    
    const fullSnapshot = {
      id: `env_snapshot_${Date.now()}`,
      timestamp: new Date().toISOString(),
      agents: Array.from(this.agents.keys()),
      snapshots,
      metrics: this.getGlobalMetrics()
    };
    
    // Store in Firestore
    await this.db.collection('environment_snapshots').doc(fullSnapshot.id).set(fullSnapshot);
    
    return fullSnapshot;
  }
  
  getGlobalMetrics() {
    const metrics = {
      totalRequests: 0,
      totalSuccess: 0,
      totalErrors: 0,
      uptime: Date.now() - Math.min(...Array.from(this.agents.values()).map(a => a.metrics.startTime))
    };
    
    for (const agent of this.agents.values()) {
      metrics.totalRequests += agent.metrics.requestCount;
      metrics.totalSuccess += agent.metrics.successCount;
      metrics.totalErrors += agent.metrics.errorCount;
    }
    
    return metrics;
  }
  
  async orchestrateResearch(objective, planId) {
    console.log(`📋 Orchestrating research for plan: ${planId}`);
    console.log(`🎯 Objective: ${objective}`);
    
    // Select agents based on objective
    const selectedAgents = this.selectAgentsForObjective(objective);
    console.log(`🤖 Selected ${selectedAgents.length} agents for this objective`);
    
    // Create scraping tasks
    const tasks = this.createScrapingTasks(selectedAgents, objective);
    console.log(`📝 Created ${tasks.length} scraping tasks`);
    
    // Execute in parallel with Jules-style concurrency
    const results = await this.executeParallel(tasks);
    
    // Aggregate and validate
    const aggregated = this.aggregateResults(results);
    
    // Store in Firebase
    await this.storeResults(aggregated, planId);
    
    // Check for breakthroughs
    if (aggregated.breakthroughs.length > 0) {
      await this.triggerBreakthroughNotification(aggregated, planId);
    }
    
    return aggregated;
  }
  
  selectAgentsForObjective(objective) {
    const keywords = objective.toLowerCase().split(' ');
    const selectedAgents = [];
    
    for (const [id, agent] of this.agents) {
      const domainMatch = agent.config.domains.some(domain => 
        keywords.some(keyword => domain.toLowerCase().includes(keyword))
      );
      
      if (domainMatch || keywords.includes('all')) {
        selectedAgents.push(agent);
      }
    }
    
    // If no specific match, use all agents
    return selectedAgents.length > 0 ? selectedAgents : Array.from(this.agents.values());
  }
  
  createScrapingTasks(agents, objective) {
    const tasks = [];
    
    for (const agent of agents) {
      for (const target of agent.config.targets) {
        tasks.push({
          agentId: agent.id,
          url: target,
          objective,
          strategy: agent.config.scrapeStrategy,
          selectors: this.getSelectorsForUrl(target),
          timeout: 30000,
          retryCount: 0,
          maxRetries: 3
        });
      }
    }
    
    return tasks;
  }
  
  async executeParallel(tasks) {
    const chunks = [];
    for (let i = 0; i < tasks.length; i += this.maxConcurrent) {
      chunks.push(tasks.slice(i, i + this.maxConcurrent));
    }
    
    const allResults = [];
    for (const [index, chunk] of chunks.entries()) {
      console.log(`🔄 Processing chunk ${index + 1}/${chunks.length} (${chunk.length} tasks)`);
      
      const chunkPromises = chunk.map(task => 
        this.executeTask(task).catch(error => ({
          success: false,
          agentId: task.agentId,
          url: task.url,
          error: error.message,
          timestamp: new Date().toISOString()
        }))
      );
      
      const chunkResults = await Promise.all(chunkPromises);
      allResults.push(...chunkResults);
    }
    
    return allResults;
  }
  
  async executeTask(task) {
    const agent = this.agents.get(task.agentId);
    if (!agent) throw new Error(`Agent ${task.agentId} not found`);
    
    try {
      // Get or create page with VM isolation simulation
      let page = agent.pages.get(task.url);
      if (!page) {
        page = await agent.context.newPage();
        agent.pages.set(task.url, page);
        
        // Set up request interception for stealth mode
        if (task.strategy === 'stealth') {
          await page.route('**/*', route => {
            const headers = route.request().headers();
            delete headers['sec-ch-ua'];
            delete headers['sec-ch-ua-mobile'];
            delete headers['sec-ch-ua-platform'];
            route.continue({ headers });
          });
        }
      }
      
      // Navigate with error handling
      console.log(`🌐 ${agent.id} navigating to ${task.url}`);
      await page.goto(task.url, { 
        waitUntil: 'networkidle',
        timeout: task.timeout 
      });
      
      // Wait based on strategy
      if (task.strategy === 'respectful') {
        await page.waitForTimeout(2000);
      }
      
      // Scrape based on strategy
      let data;
      switch (task.strategy) {
        case 'adaptive':
          data = await this.adaptiveScrape(page, task);
          break;
        case 'stealth':
          data = await this.stealthScrape(page, task);
          break;
        case 'structured':
          data = await this.structuredScrape(page, task);
          break;
        case 'company_research':
          data = await this.companyResearchScrape(page, task);
          break;
        default:
          data = await this.defaultScrape(page, task);
      }
      
      // Update metrics
      agent.metrics.requestCount++;
      agent.metrics.successCount++;
      
      console.log(`✅ ${agent.id} scraped ${data.length} items from ${task.url}`);
      
      return {
        success: true,
        agentId: task.agentId,
        url: task.url,
        data,
        timestamp: new Date().toISOString()
      };
      
    } catch (error) {
      // Error recovery
      agent.metrics.errorCount++;
      agent.metrics.lastError = error.message;
      
      console.error(`❌ Error in ${agent.id} for ${task.url}: ${error.message}`);
      
      // Retry logic
      if (task.retryCount < task.maxRetries) {
        task.retryCount++;
        console.log(`🔄 Retrying (${task.retryCount}/${task.maxRetries})...`);
        await new Promise(resolve => setTimeout(resolve, 2000 * task.retryCount));
        return await this.executeTask(task);
      }
      
      return {
        success: false,
        agentId: task.agentId,
        url: task.url,
        error: error.message,
        timestamp: new Date().toISOString()
      };
    }
  }
  
  async adaptiveScrape(page, task) {
    const results = [];
    
    // Try multiple strategies
    const strategies = [
      () => this.scrapeWithSelectors(page, task.selectors),
      () => this.scrapeWithPatterns(page),
      () => this.scrapeWithTextContent(page)
    ];
    
    for (const strategy of strategies) {
      try {
        const data = await strategy();
        if (data && data.length > 0) {
          results.push(...data);
          break;
        }
      } catch (e) {
        continue;
      }
    }
    
    return results;
  }
  
  async scrapeWithSelectors(page, selectors) {
    const results = [];
    
    // Scrape titles
    if (selectors.title) {
      for (const selector of selectors.title) {
        try {
          const elements = await page.$$(selector);
          for (const element of elements) {
            const text = await element.textContent();
            if (text && text.trim()) {
              results.push({
                type: 'title',
                content: text.trim(),
                selector
              });
            }
          }
        } catch (e) {
          continue;
        }
      }
    }
    
    // Scrape content
    if (selectors.content) {
      for (const selector of selectors.content) {
        try {
          const elements = await page.$$(selector);
          for (const element of elements) {
            const text = await element.textContent();
            if (text && text.trim()) {
              results.push({
                type: 'content',
                content: text.trim(),
                selector
              });
            }
          }
        } catch (e) {
          continue;
        }
      }
    }
    
    return results;
  }
  
  async scrapeWithPatterns(page) {
    // Extract all text and look for patterns
    const text = await page.textContent('body');
    const results = [];
    
    // Look for paper titles (usually in specific formats)
    const titlePatterns = [
      /^[A-Z][\w\s:]+$/gm,
      /\b(?:Paper|Article|Research):\s*(.+)/gi
    ];
    
    for (const pattern of titlePatterns) {
      const matches = text.match(pattern);
      if (matches) {
        results.push(...matches.map(m => ({
          type: 'pattern_match',
          content: m.trim(),
          pattern: pattern.source
        })));
      }
    }
    
    return results;
  }
  
  async scrapeWithTextContent(page) {
    // Fallback: get all meaningful text
    const results = [];
    
    const paragraphs = await page.$$('p, div, article, section');
    for (const element of paragraphs) {
      const text = await element.textContent();
      if (text && text.trim().length > 100) {
        results.push({
          type: 'text_content',
          content: text.trim().substring(0, 500)
        });
      }
    }
    
    return results.slice(0, 20); // Limit results
  }
  
  async structuredScrape(page, task) {
    // For sites with known structure like Papers with Code
    const results = [];
    
    try {
      const papers = await page.$$eval('.paper-card, .item, article', elements => 
        elements.map(el => ({
          title: el.querySelector('h3, h2, .title')?.textContent?.trim(),
          abstract: el.querySelector('.abstract, .description, p')?.textContent?.trim(),
          link: el.querySelector('a')?.href,
          date: el.querySelector('.date, time')?.textContent?.trim()
        })).filter(p => p.title)
      );
      
      results.push(...papers.map(p => ({
        type: 'structured_paper',
        ...p
      })));
    } catch (e) {
      // Fallback to basic scraping
      return await this.defaultScrape(page, task);
    }
    
    return results;
  }
  
  async companyResearchScrape(page, task) {
    // Special handling for company research pages
    const results = [];
    
    try {
      // Look for research papers/blog posts
      const articles = await page.$$eval('article, .post, .blog-post, .research-item', elements =>
        elements.map(el => ({
          title: el.querySelector('h1, h2, h3, .title')?.textContent?.trim(),
          summary: el.querySelector('.summary, .excerpt, .description, p')?.textContent?.trim(),
          link: el.querySelector('a')?.href || el.closest('a')?.href,
          date: el.querySelector('.date, time, .published')?.textContent?.trim(),
          authors: el.querySelector('.authors, .author, .by')?.textContent?.trim()
        })).filter(a => a.title)
      );
      
      results.push(...articles.map(a => ({
        type: 'company_research',
        ...a
      })));
    } catch (e) {
      return await this.defaultScrape(page, task);
    }
    
    return results;
  }
  
  async stealthScrape(page, task) {
    // Stealth mode scraping with anti-detection
    await page.waitForTimeout(1000 + Math.random() * 2000);
    
    // Simulate human behavior
    await page.mouse.move(100, 100);
    await page.mouse.move(200, 300);
    
    return await this.defaultScrape(page, task);
  }
  
  async defaultScrape(page, task) {
    const results = [];
    
    // Get all links with research-related text
    const links = await page.$$eval('a', links => 
      links.map(link => ({
        text: link.textContent?.trim(),
        href: link.href
      })).filter(l => l.text && l.text.length > 10)
    );
    
    results.push(...links.slice(0, 50).map(l => ({
      type: 'link',
      content: l.text,
      url: l.href
    })));
    
    return results;
  }
  
  getSelectorsForUrl(url) {
    // Return URL-specific selectors
    if (url.includes('arxiv.org')) {
      return {
        title: ['.list-title', '.title', 'h3', '.list-title a'],
        content: ['.abstract', '.mathjax', '.list-abstract'],
        authors: ['.list-authors', '.authors'],
        date: ['.list-dateline', '.dateline']
      };
    } else if (url.includes('github.com')) {
      return {
        title: ['h1.h3', '.repo-name', '[itemprop="name"]', 'article h2 a'],
        content: ['.f4', '[itemprop="description"]', '.color-fg-muted'],
        stars: ['.octicon-star + span', '.Counter', '[aria-label*="star"]'],
        language: ['.ml-0', '[itemprop="programmingLanguage"]']
      };
    } else if (url.includes('paperswithcode.com')) {
      return {
        title: ['.paper-title', 'h1', 'h2 a'],
        content: ['.paper-abstract', '.item-content', '.description'],
        stats: ['.paper-stats', '.metric'],
        code: ['.code-link', '.github-link']
      };
    } else if (url.includes('nature.com')) {
      return {
        title: ['.c-article-title', 'h1', '.c-card__title'],
        content: ['.c-article-body', '.c-card__summary', '.article-item__teaser'],
        authors: ['.c-article-author-list', '.c-author-list'],
        date: ['.c-article-info-details', 'time']
      };
    } else if (url.includes('openai.com') || url.includes('deepmind')) {
      return {
        title: ['h1', 'h2', '.post-title', '.article-title'],
        content: ['.post-content', '.article-content', 'article p'],
        date: ['.post-date', '.publish-date', 'time'],
        tags: ['.tags', '.categories', '.topics']
      };
    }
    
    // Default selectors
    return {
      title: ['h1', 'h2', 'h3', '.title', '.heading'],
      content: ['p', '.content', '.abstract', '.summary'],
      date: ['.date', 'time', '.published'],
      authors: ['.author', '.authors', '.by']
    };
  }
  
  aggregateResults(results) {
    const successful = results.filter(r => r.success);
    const papers = [];
    const breakthroughs = [];
    const allData = [];
    
    for (const result of successful) {
      if (result.data && result.data.length > 0) {
        for (const item of result.data) {
          const qualityScore = this.assessQuality(item, result.url);
          
          const enrichedItem = {
            ...item,
            qualityScore,
            source: result.url,
            discoveredBy: result.agentId,
            timestamp: result.timestamp
          };
          
          allData.push(enrichedItem);
          
          if (qualityScore >= 9.5) {
            breakthroughs.push(enrichedItem);
          } else if (qualityScore >= 8.5) {
            papers.push(enrichedItem);
          }
        }
      }
    }
    
    // Calculate metrics
    const qualityScores = [...papers, ...breakthroughs].map(p => p.qualityScore);
    const averageQuality = qualityScores.length > 0 
      ? qualityScores.reduce((a, b) => a + b, 0) / qualityScores.length 
      : 0;
    
    return {
      totalResults: results.length,
      successfulScrapes: successful.length,
      failedScrapes: results.length - successful.length,
      papers: papers.length,
      breakthroughs: breakthroughs.length,
      qualityAverage: averageQuality.toFixed(2),
      topDiscoveries: breakthroughs.slice(0, 5),
      allData: allData.slice(0, 100), // Limit stored data
      timestamp: new Date().toISOString(),
      metrics: this.getGlobalMetrics()
    };
  }
  
  assessQuality(item, sourceUrl) {
    let score = 7.0;
    
    // Content quality indicators
    if (item.content && item.content.length > 200) score += 0.5;
    if (item.content && item.content.length > 500) score += 0.5;
    
    // Title quality
    if (item.title && item.title.length > 20) score += 0.3;
    
    // Source reputation
    if (sourceUrl.includes('arxiv.org')) score += 0.8;
    if (sourceUrl.includes('nature.com')) score += 1.0;
    if (sourceUrl.includes('openai.com')) score += 0.7;
    if (sourceUrl.includes('deepmind')) score += 0.7;
    if (sourceUrl.includes('paperswithcode.com')) score += 0.6;
    
    // Keywords that indicate importance
    const importantKeywords = [
      'breakthrough', 'novel', 'state-of-the-art', 'sota',
      'revolutionary', 'significant', 'advance', 'discovery'
    ];
    
    const content = (item.content || '') + (item.title || '');
    for (const keyword of importantKeywords) {
      if (content.toLowerCase().includes(keyword)) {
        score += 0.3;
      }
    }
    
    // Technical indicators
    if (content.match(/\b(neural|quantum|transformer|gpt|llm)\b/i)) score += 0.4;
    if (content.match(/\b(cancer|drug|therapy|treatment)\b/i)) score += 0.3;
    if (content.match(/\b(climate|sustainability|energy)\b/i)) score += 0.3;
    
    // Structured data bonus
    if (item.type === 'structured_paper' || item.type === 'company_research') score += 0.5;
    
    // Random variation for simulation (remove in production)
    score += Math.random() * 0.5;
    
    return Math.min(10, Math.max(0, score));
  }
  
  async storeResults(aggregated, planId) {
    const batch = this.db.batch();
    
    // Store main orchestration result
    const resultRef = this.db.collection('jules_orchestration_results').doc();
    batch.set(resultRef, {
      planId,
      ...aggregated,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    // Store breakthrough discoveries separately
    if (aggregated.breakthroughs > 0) {
      for (const discovery of aggregated.topDiscoveries) {
        const breakthroughRef = this.db.collection('breakthrough_discoveries').doc();
        batch.set(breakthroughRef, {
          ...discovery,
          planId,
          orchestrationId: resultRef.id,
          createdAt: admin.firestore.FieldValue.serverTimestamp()
        });
      }
    }
    
    await batch.commit();
    console.log(`💾 Stored orchestration results: ${aggregated.papers} papers, ${aggregated.breakthroughs} breakthroughs`);
  }
  
  async triggerBreakthroughNotification(aggregated, planId) {
    console.log(`🎉 ${aggregated.breakthroughs} breakthrough discoveries found!`);
    
    // Store notification
    await this.db.collection('breakthrough_notifications').add({
      planId,
      breakthroughCount: aggregated.breakthroughs,
      topDiscoveries: aggregated.topDiscoveries,
      qualityAverage: aggregated.qualityAverage,
      triggerGitHubAction: true,
      notificationSent: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp()
    });
    
    console.log('📬 Breakthrough notification created for GitHub Actions trigger');
  }
  
  async start() {
    await this.initializeAgentFleet();
    
    this.app.listen(this.port, () => {
      console.log(`🚀 Jules Playwright Orchestrator running on port ${this.port}`);
      console.log(`📊 Max concurrent tasks: ${this.maxConcurrent}`);
      console.log(`🤖 Active agents: ${this.agents.size}`);
      console.log(`🌐 Health check: http://localhost:${this.port}/health`);
    });
  }
}

// Start the orchestrator
const orchestrator = new JulesPlaywrightOrchestrator();
orchestrator.start().catch(console.error);

module.exports = JulesPlaywrightOrchestrator;