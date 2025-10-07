/**
 * Synthesis Module
 *
 * This module takes raw research data and synthesizes it into a
 * structured format, including key concepts and a summary.
 */

// A simple list of common English stop words.
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
  'end', 'content', 'from'
]);

function synthesizeResearch(researchData) {
  console.log("[Synthesis] Starting synthesis of research data.");

  if (!researchData || typeof researchData !== 'string') {
    console.error("[Synthesis] Invalid research data provided.");
    return {
      summary: "No research data provided.",
      key_concepts: []
    };
  }

  // 1. Generate a simple summary (e.g., first 5 non-empty lines)
  const summary = researchData.split('\n').filter(line => line.trim() !== '').slice(0, 5).join('\n');

  // 2. Extract key concepts (e.g., most frequent words, excluding stop words)
  const words = researchData.toLowerCase().match(/\b\w+\b/g) || [];
  const wordFrequencies = {};

  for (const word of words) {
    if (!STOP_WORDS.has(word) && isNaN(word)) {
      wordFrequencies[word] = (wordFrequencies[word] || 0) + 1;
    }
  }

  const sortedConcepts = Object.entries(wordFrequencies).sort((a, b) => b[1] - a[1]);
  const key_concepts = sortedConcepts.slice(0, 10).map(entry => entry[0]); // Top 10 concepts

  console.log("[Synthesis] Synthesis complete.");

  return {
    summary,
    key_concepts
  };
}

module.exports = { synthesizeResearch };