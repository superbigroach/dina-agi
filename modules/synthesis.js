/**
 * Synthesis Module (V2)
 *
 * This module takes raw research data, compares it against the existing
 * knowledge graph, and synthesizes it into a structured format. It identifies
 * new concepts (nodes) and infers potential relationships (edges).
 */

const STOP_WORDS = new Set([
    'i', 'me', 'my', 'myself', 'we', 'our', 'ours', 'ourselves', 'you', 'your', 'yours',
    'he', 'him', 'his', 'himself', 'she', 'her', 'hers', 'herself', 'it', 'its', 'itself',
    'they', 'them', 'their', 'theirs', 'themselves', 'what', 'which', 'who', 'whom',
    'this', 'that', 'these', 'those', 'am', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'having', 'do', 'does', 'did', 'doing', 'a', 'an',
    'the', 'and', 'but', 'if', 'or', 'because', 'as', 'until', 'while', 'of', 'at',
    'by', 'for', 'with', 'about', 'against', 'between', 'into', 'through', 'during',
    'before', 'after', 'above', 'below', 'to', 'from', 'up', 'down', 'in', 'out',
    'on', 'off', 'over', 'under', 'again', 'further', 'then', 'once', 'here', 'there',
    'when', 'where', 'why', 'how', 'all', 'any', 'both', 'each', 'few', 'more', 'most',
    'other', 'some', 'such', 'no', 'nor', 'not', 'only', 'own', 'same', 'so', 'than',
    'too', 'very', 's', 't', 'can', 'will', 'just', 'don', 'should', 'now', 'start',
    'end', 'content', 'from', 'also', 'however', 'could', 'might', 'may'
]);

/**
 * Infers relationships between concepts based on their co-occurrence in sentences.
 * @param {string[]} concepts - The list of key concepts.
 * @param {string} text - The research text.
 * @returns {object[]} A list of potential edge objects.
 */
function inferRelationships(concepts, text) {
    const sentences = text.split(/[.!?]/g);
    const potentialEdges = [];
    const addedEdges = new Set();

    for (const sentence of sentences) {
        const conceptsInSentence = concepts.filter(c => sentence.toLowerCase().includes(c));

        if (conceptsInSentence.length > 1) {
            for (let i = 0; i < conceptsInSentence.length; i++) {
                for (let j = i + 1; j < conceptsInSentence.length; j++) {
                    const source = conceptsInSentence[i];
                    const target = conceptsInSentence[j];
                    const edgeKey = [source, target].sort().join('-');

                    if (!addedEdges.has(edgeKey)) {
                        potentialEdges.push({
                            source: source,
                            target: target,
                            label: 'is related to',
                            context: sentence.trim(),
                            validated: false
                        });
                        addedEdges.add(edgeKey);
                    }
                }
            }
        }
    }
    return potentialEdges;
}

/**
 * Synthesizes research data, identifies new concepts, and infers relationships.
 * @param {string} researchData - The raw text from the research module.
 * @param {object} knowledgeGraph - The current state of the agent's knowledge.
 * @returns {object} An object containing the summary, new nodes, and potential new edges.
 */
function synthesizeResearch(researchData, knowledgeGraph) {
  console.log("[Synthesis-V2] Starting synthesis of research data.");

  if (!researchData || typeof researchData !== 'string') {
    return { summary: "No research data.", newNodes: [], newEdges: [] };
  }

  // 1. Generate summary
  const summary = researchData.split('\n').filter(line => line.trim() !== '').slice(0, 5).join('\n');

  // 2. Extract key concepts
  const words = researchData.toLowerCase().match(/\b\w+\b/g) || [];
  const wordFrequencies = {};
  for (const word of words) {
    if (!STOP_WORDS.has(word) && isNaN(word)) {
      wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
    }
  }
  const sortedConcepts = Object.entries(wordFrequencies).sort((a, b) => b[1] - a[1]);
  const keyConcepts = sortedConcepts.slice(0, 10).map(entry => entry[0]);

  // 3. Identify which concepts are new
  const existingNodeIds = new Set(knowledgeGraph.nodes.map(node => node.id));
  const newNodes = keyConcepts
    .filter(concept => !existingNodeIds.has(concept))
    .map(concept => ({ id: concept, description: `A concept related to ${summary.substring(0, 50)}...`, validated: false }));

  // 4. Infer potential relationships (edges) between concepts
  const newEdges = inferRelationships(keyConcepts, researchData);

  console.log(`[Synthesis-V2] Complete. Found ${newNodes.length} new concepts and ${newEdges.length} potential relationships.`);

  return {
    summary,
    newNodes,
    newEdges,
    allConcepts: keyConcepts
  };
}

module.exports = { synthesizeResearch };