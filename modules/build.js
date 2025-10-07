/**
 * Build Module
 *
 * This module takes synthesized research and generates the file
 * structure and content for a new build.
 */

function createBuild(synthesizedData, topic) {
  console.log(`[Build] Starting build for topic: "${topic}"`);

  const { summary, key_concepts } = synthesizedData;

  if (!summary || !key_concepts || key_concepts.length === 0) {
    console.error("[Build] Invalid synthesized data provided.");
    return null;
  }

  const projectName = topic.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '');

  const readmeContent = `# Research Project: ${topic}\n\n## Summary\n${summary}\n\n## Key Concepts\n- ${key_concepts.join('\n- ')}\n`;
  const sourceContent = `// Research topic: ${topic}\n// Key Concepts Identified:\n// ${key_concepts.join('\n// ')}\n\nconsole.log("This file was generated based on research about ${topic}.");\n`;

  const build = {
    name: projectName,
    files: {
      'README.md': readmeContent,
      'source.js': sourceContent,
      'research_summary.txt': summary,
    }
  };

  console.log(`[Build] Build structure for "${projectName}" created.`);
  return build;
}

module.exports = { createBuild };