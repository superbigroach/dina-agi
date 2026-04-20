/**
 * Topic Selector Module
 *
 * This module is responsible for intelligently selecting the next research topic
 * for the agent based on the current state of its knowledge graph.
 */

/**
 * Selects the next topic for the agent to research.
 * @param {object} knowledgeGraph - The agent's current knowledge graph.
 * @param {string} lastTopic - The topic that was just researched.
 * @returns {string} The next topic to research.
 */
function selectNextTopic(knowledgeGraph, lastTopic) {
  console.log("[TopicSelector] Selecting next topic...");

  // Find all concepts connected to the last topic.
  const relatedConcepts = knowledgeGraph.edges
    .filter(edge => edge.source === lastTopic || edge.target === lastTopic)
    .map(edge => (edge.source === lastTopic ? edge.target : edge.source));

  // Find which of these related concepts have not been "validated" yet.
  // We'll treat visiting a node as a form of validation for this purpose.
  const unvisitedConcepts = relatedConcepts.filter(concept => {
    const node = knowledgeGraph.nodes.find(n => n.id === concept);
    // A simple heuristic: a node is "unvisited" if its description is still the default.
    return node && node.description.includes("A concept related to");
  });

  if (unvisitedConcepts.length > 0) {
    // Prioritize exploring a new, related concept.
    const nextTopic = unvisitedConcepts[0];
    console.log(`[TopicSelector] Chose to delve deeper into related concept: "${nextTopic}"`);
    return nextTopic;
  }

  // If all related concepts are explored, pick a random, less-connected node to broaden knowledge.
  if (knowledgeGraph.nodes.length > 0) {
      const nodesByConnectivity = knowledgeGraph.nodes.map(node => {
          const degree = knowledgeGraph.edges.filter(e => e.source === node.id || e.target === node.id).length;
          return { id: node.id, degree: degree };
      }).sort((a,b) => a.degree - b.degree);

      const nextTopic = nodesByConnectivity[0].id;
      console.log(`[TopicSelector] No unvisited neighbors. Broadening knowledge with less-connected node: "${nextTopic}"`);
      return nextTopic;
  }

  // Fallback if the graph is empty or something went wrong.
  console.log("[TopicSelector] No suitable topic found. Falling back to default.");
  return "Artificial Intelligence";
}

module.exports = { selectNextTopic };