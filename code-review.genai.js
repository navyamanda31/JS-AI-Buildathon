import { execSync } from 'child_process';

const token = process.env.GITHUB_TOKEN;

if (!token) {
  console.error("❌ GITHUB_TOKEN is not set.");
  process.exit(1);
}

// 1. Get staged changes
const changes = execSync('git diff --cached', { encoding: 'utf-8' });

// 2. Define diff for LLM
function defDiff(label, content) {
  global[label] = content;
}

// 3. Inject into global scope
defDiff("CODE_CHANGES", changes);

// 4. Prompt for LLM (template only — hook up your LLM agent)
const prompt = `
## Role
You are a senior developer. Your job is to review code changes and provide meaningful feedback.

## Input
<CODE_CHANGES>

## Instructions
- Identify bugs, anti-patterns, or issues
- Suggest improvements
- Use best practices (Clean Code, OWASP, etc.)
- Keep it concise and example-driven

## Format
📌 Issue: ...
❌ Why: ...
✅ Suggestion: ...
`;

console.log("Generated Prompt:\n", prompt.replace("<CODE_CHANGES>", global["CODE_CHANGES"]));

// You would send the prompt to your LLM here.