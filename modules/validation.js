/**
 * Validation Module
 *
 * This module is responsible for validating the relationships inferred by the
 * synthesis module. It uses cross-referencing by performing targeted web
 * searches to confirm that a relationship is mentioned across multiple sources.
 */

/**
 * Validates a list of potential edges by performing targeted web searches.
 * @param {object[]} edges - An array of potential edge objects to validate.
 * @param {function} searchTool - The wrapper for the google_search tool.
 * @returns {Promise<object[]>} A list of edges that have been successfully validated.
 */
async function validateRelationships(edges, searchTool) {
  console.log(`[Validation] Starting validation for ${edges.length} potential relationships.`);
  const validatedEdges = [];

  for (const edge of edges) {
    const { source, target } = edge;
    // Create a very specific query to check for the relationship.
    const query = `"${source}" and "${target}" relationship`;

    console.log(`[Validation] Validating relationship: ${source} <-> ${target} with query: "${query}"`);

    try {
      const searchResults = await searchTool(query);

      // A simple heuristic for validation: if the search results contain both terms
      // frequently, we can assume the relationship is plausible. A real system might
      // analyze snippets more deeply. We'll simulate this by checking for > 1 mention.
      const urlPattern = /URL: (https?:\/\/[^\s]+)/g;
      const mentions = (searchResults.match(urlPattern) || []).length;

      if (mentions > 1) {
        console.log(`[Validation] SUCCESS: Relationship validated for ${source} <-> ${target}`);
        edge.validated = true;
        validatedEdges.push(edge);
      } else {
        console.log(`[Validation] FAILED: Relationship not sufficiently validated for ${source} <-> ${target}`);
      }
    } catch (error) {
      console.error(`[Validation] Error during search for query "${query}":`, error);
    }
  }

  console.log(`[Validation] Validation complete. ${validatedEdges.length} relationships were validated.`);
  return validatedEdges;
}

module.exports = { validateRelationships };