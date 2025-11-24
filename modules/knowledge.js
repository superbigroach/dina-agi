/**
 * Knowledge Module
 *
 * This module is responsible for managing the agent's persistent
 * knowledge graph, stored in knowledge_graph.json.
 */
const fs = require('fs').promises;
const path = require('path');

const KNOWLEDGE_GRAPH_PATH = path.join(__dirname, '../knowledge_graph.json');

/**
 * Reads and parses the knowledge graph from the file system.
 * @returns {Promise<object>} The knowledge graph object.
 */
async function getKnowledgeGraph() {
  try {
    const data = await fs.readFile(KNOWLEDGE_GRAPH_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error("[Knowledge] Could not read knowledge graph:", error);
    // If the file doesn't exist or is invalid, return a default structure.
    return { nodes: [], edges: [] };
  }
}

/**
 * Writes the updated knowledge graph to the file system.
 * @param {object} graph - The knowledge graph object to save.
 * @returns {Promise<void>}
 */
async function updateKnowledgeGraph(graph) {
  try {
    const data = JSON.stringify(graph, null, 2);
    await fs.writeFile(KNOWLEDGE_GRAPH_PATH, data, 'utf8');
    console.log("[Knowledge] Knowledge graph updated successfully.");
  } catch (error) {
    console.error("[Knowledge] Could not update knowledge graph:", error);
  }
}

module.exports = {
  getKnowledgeGraph,
  updateKnowledgeGraph
};