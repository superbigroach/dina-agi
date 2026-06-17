/**
 * Build Module (V2)
 *
 * This module takes synthesized research and the current knowledge graph to generate
 * a "State of Knowledge" report for a given topic.
 */

/**
 * Generates a Mermaid.js diagram string for the portion of the knowledge graph
 * relevant to the current topic.
 * @param {object} knowledgeGraph - The agent's knowledge graph.
 * @param {string} topic - The current research topic.
 * @returns {string} A string representing the Mermaid.js diagram.
 */
function generateMermaidDiagram(knowledgeGraph, topic) {
    let mermaidString = 'graph TD;\n';
    const relevantNodes = new Set([topic]);

    // Find all edges connected to the current topic
    const relevantEdges = knowledgeGraph.edges.filter(edge => {
        const isRelated = edge.source === topic || edge.target === topic;
        if (isRelated) {
            relevantNodes.add(edge.source);
            relevantNodes.add(edge.target);
        }
        return isRelated;
    });

    // Define nodes
    relevantNodes.forEach(nodeId => {
        mermaidString += `    ${nodeId}["${nodeId}"];\n`;
    });

    // Define edges
    relevantEdges.forEach(edge => {
        const edgeLabel = edge.validated ? `-- validated -->` : `-. potential .->`;
        mermaidString += `    ${edge.source}${edgeLabel}${edge.target};\n`;
    });

    return mermaidString;
}

/**
 * Creates a build package based on the synthesized data and knowledge graph.
 * @param {object} synthesizedData - The output from the synthesis module.
 * @param {object} knowledgeGraph - The agent's current knowledge graph.
 * @param {string} topic - The current research topic.
 * @returns {object|null} A build object or null if data is invalid.
 */
function createBuild(synthesizedData, knowledgeGraph, topic) {
  console.log(`[Build-V2] Creating State of Knowledge report for: "${topic}"`);

  const { summary, allConcepts } = synthesizedData;

  if (!summary || !allConcepts || allConcepts.length === 0) {
    console.error("[Build-V2] Invalid synthesized data provided.");
    return null;
  }

  const projectName = topic.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

  // Generate the diagram for the knowledge graph.
  const mermaidDiagram = generateMermaidDiagram(knowledgeGraph, topic);

  const readmeContent = `
# State of Knowledge: ${topic}

## Research Summary
This report was generated based on research into **${topic}**.

### Summary of Latest Research:
> ${summary.replace(/\n/g, '\n> ')}

### Key Concepts Identified in this Cycle:
- ${allConcepts.join('\n- ')}

## Knowledge Graph Visualization
This diagram shows the current understanding of how **${topic}** relates to other concepts. A solid line indicates a validated relationship.

\`\`\`mermaid
${mermaidDiagram}
\`\`\`
`.trim();

  const build = {
    name: projectName,
    files: {
      'README.md': readmeContent,
      'knowledge_graph_snapshot.json': JSON.stringify(knowledgeGraph, null, 2)
    }
  };

  console.log(`[Build-V2] State of Knowledge report for "${projectName}" created.`);
  return build;
}

module.exports = { createBuild };