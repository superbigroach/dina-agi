/**
 * Research Module
 *
 * This module is responsible for conducting research on a given topic.
 * It will be orchestrated by the main agent script, which will provide
 * the necessary tools for web searching and content extraction.
 */

async function conductResearch(topic, searchTool, viewTool) {
  console.log(`[Research] Starting research on: "${topic}"`);

  // In a real scenario, the main agent loop would call the provided tools.
  // For now, this is a placeholder.
  const searchResults = await searchTool(topic);
  const urls = parseUrls(searchResults);

  if (!urls.length) {
    console.log("[Research] No relevant URLs found.");
    return "";
  }

  let combinedContent = "";
  for (const url of urls.slice(0, 3)) { // Limit to top 3 for now
    console.log(`[Research] Reading content from: ${url}`);
    try {
      const content = await viewTool(url);
      combinedContent += `\n\n--- Start of content from ${url} ---\n\n${content}\n\n--- End of content from ${url} ---\n\n`;
    } catch (error) {
      console.error(`[Research] Failed to fetch content from ${url}:`, error);
    }
  }

  console.log("[Research] Research phase complete.");
  return combinedContent;
}

function parseUrls(searchResults) {
    // This is a simplified parser. It assumes the search tool
    // returns results with "URL:" prefixes.
    const urlPattern = /URL: (https?:\/\/[^\s]+)/g;
    const urls = [];
    let match;
    while ((match = urlPattern.exec(searchResults)) !== null) {
        urls.push(match[1]);
    }
    return urls;
}

module.exports = { conductResearch };