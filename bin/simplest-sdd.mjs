#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { formatAnalytics, loadExecutionRecords } from "../lib/execution-data.mjs";
import { readCodexUsage } from "../lib/codex-usage.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = readJson(path.join(packageRoot, "package.json"));
const versions = readJson(path.join(packageRoot, "schema", "versions.json"));

const commands = new Set(["init", "update", "remove", "analytics", "codex-usage"]);

main();

function main() {
  const parsed = parseArgs(process.argv.slice(2));

  if (parsed.help) {
    print(helpText());
    return;
  }

  if (parsed.version) {
    print(packageJson.version);
    return;
  }

  if (!parsed.command) {
    print(helpText());
    return;
  }

  if (!commands.has(parsed.command)) {
    fail(`Unknown command: ${parsed.command}\n\n${helpText()}`);
  }

  const cwd = path.resolve(parsed.cwd || process.cwd());

  if (parsed.command === "analytics") {
    runAnalytics(cwd, parsed.format);
    return;
  }

  if (parsed.command === "codex-usage") {
    runCodexUsage(parsed.session);
    return;
  }

  const detectedState = detectState(cwd);
  const template = readText(path.join(packageRoot, "prompts", `${parsed.command}.md`));
  const output = render(template, {
    packageVersion: packageJson.version,
    schemaVersion: versions.currentSchemaVersion,
    detectedState: formatDetectedState(detectedState),
    versionHistory: formatVersionHistory(versions, detectedState.skillVersion)
  });

  print(output.trimEnd());
}

function parseArgs(args) {
  const parsed = {
    command: null,
    cwd: null,
    format: "summary",
    session: null,
    help: false,
    version: false
  };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (arg === "--help" || arg === "-h") {
      parsed.help = true;
      continue;
    }

    if (arg === "--version" || arg === "-v") {
      parsed.version = true;
      continue;
    }

    if (arg === "--cwd") {
      const next = args[index + 1];
      if (!next) {
        fail("Missing value for --cwd");
      }
      parsed.cwd = next;
      index += 1;
      continue;
    }

    if (arg.startsWith("--cwd=")) {
      parsed.cwd = arg.slice("--cwd=".length);
      continue;
    }

    if (arg === "--format") {
      const next = args[index + 1];
      if (!next) fail("Missing value for --format");
      parsed.format = next;
      index += 1;
      continue;
    }

    if (arg.startsWith("--format=")) {
      parsed.format = arg.slice("--format=".length);
      continue;
    }

    if (arg === "--session") {
      const next = args[index + 1];
      if (!next) fail("Missing value for --session");
      parsed.session = next;
      index += 1;
      continue;
    }

    if (arg.startsWith("--session=")) {
      parsed.session = arg.slice("--session=".length);
      continue;
    }

    if (arg.startsWith("-")) {
      fail(`Unknown option: ${arg}`);
    }

    if (parsed.command) {
      fail(`Unexpected argument: ${arg}`);
    }

    parsed.command = arg;
  }

  return parsed;
}

function runAnalytics(cwd, format) {
  const formats = new Set(["summary", "json", "jsonl", "csv"]);
  if (!formats.has(format)) fail(`Unknown analytics format: ${format}. Use summary, json, jsonl, or csv.`);

  const result = loadExecutionRecords(cwd);
  if (result.errors.length > 0) {
    fail(["Execution data validation failed:", ...result.errors.map((error) => `- ${error}`)].join("\n"));
  }

  print(formatAnalytics(result.records, format));
}

function runCodexUsage(sessionId) {
  if (!sessionId) fail("codex-usage requires --session <id>");
  const usage = readCodexUsage(sessionId);
  if (!usage) fail(`Codex session not found: ${sessionId}`);
  print(JSON.stringify(usage, null, 2));
}

function detectState(cwd) {
  const agentsPath = path.join(cwd, "AGENTS.md");
  const claudePath = path.join(cwd, "CLAUDE.md");
  const skillPath = path.join(cwd, ".agents", "skills", "spec-library", "SKILL.md");
  const claudeSkillPath = path.join(cwd, ".claude", "skills", "spec-library");
  const libraryHtmlIndex = path.join(cwd, ".agents", "skills", "spec-library", "index.html");
  const specsHtmlIndex = path.join(cwd, ".agents", "skills", "spec-library", "specs", "index.html");
  const specsMarkdownIndex = path.join(cwd, ".agents", "skills", "spec-library", "specs", "INDEX.md");
  const decisionsHtmlIndex = path.join(cwd, ".agents", "skills", "spec-library", "decisions", "index.html");
  const decisionsMarkdownIndex = path.join(cwd, ".agents", "skills", "spec-library", "decisions", "INDEX.md");
  const executionLedger = path.join(cwd, ".agents", "skills", "spec-library", "data", "executions.jsonl");

  const skillText = safeRead(skillPath);
  const skillVersion = skillText
    ? skillText.match(/simplest-sdd-schema-version:\s*([0-9]+\.[0-9]+\.[0-9]+)/)?.[1] || "unversioned"
    : null;

  return {
    cwd,
    agents: describePath(agentsPath),
    claude: describeClaude(claudePath),
    skill: skillText ? `found (${skillVersion})` : describePath(skillPath),
    skillVersion,
    claudeSkill: describePath(claudeSkillPath),
    libraryIndex: describeArtifactIndex(libraryHtmlIndex, null),
    specsIndex: describeArtifactIndex(specsHtmlIndex, specsMarkdownIndex),
    decisionsIndex: describeArtifactIndex(decisionsHtmlIndex, decisionsMarkdownIndex),
    executionLedger: describePath(executionLedger),
    executionRecords: countNamedFiles(path.join(cwd, ".agents", "skills", "spec-library", "specs"), "execution.json")
  };
}

function describeClaude(filePath) {
  const stat = safeLstat(filePath);

  if (!stat) {
    return "missing";
  }

  if (stat.isSymbolicLink()) {
    return `symlink -> ${safeReadlink(filePath)}`;
  }

  if (stat.isFile()) {
    const text = safeRead(filePath) || "";
    return text.includes("@AGENTS.md") ? "regular file importing @AGENTS.md" : "regular file without @AGENTS.md import";
  }

  return "exists but is not a regular file";
}

function describePath(filePath) {
  const stat = safeLstat(filePath);

  if (!stat) {
    return "missing";
  }

  if (stat.isSymbolicLink()) {
    return `symlink -> ${safeReadlink(filePath)}`;
  }

  if (stat.isDirectory()) {
    return "directory";
  }

  if (stat.isFile()) {
    return "file";
  }

  return "exists";
}

function describeArtifactIndex(htmlPath, markdownPath) {
  const hasHtml = Boolean(safeLstat(htmlPath));
  const hasMarkdown = markdownPath ? Boolean(safeLstat(markdownPath)) : false;

  if (hasHtml && hasMarkdown) {
    return "HTML index found; older Markdown index also present";
  }

  if (hasHtml) {
    return "HTML index found";
  }

  if (hasMarkdown) {
    return "older Markdown index found";
  }

  return "missing";
}

function formatDetectedState(state) {
  return [
    "## Detected Local State",
    "",
    "The CLI only inspected paths and did not modify files.",
    "",
    `- Working directory: \`${state.cwd}\``,
    `- \`AGENTS.md\`: ${state.agents}`,
    `- \`CLAUDE.md\`: ${state.claude}`,
    `- \`.agents/skills/spec-library/SKILL.md\`: ${state.skill}`,
    `- \`.claude/skills/spec-library\`: ${state.claudeSkill}`,
    `- library index: ${state.libraryIndex}`,
    `- spec index: ${state.specsIndex}`,
    `- decision index: ${state.decisionsIndex}`,
    `- execution ledger: ${state.executionLedger}`,
    `- feature execution records: ${state.executionRecords}`
  ].join("\n");
}

function formatVersionHistory(data, installedVersion) {
  const relevantVersions = relevantVersionHistory(data.versions, installedVersion);
  const lines = [
    "## Simplest SDD Schema Versions",
    "",
    `Latest schema version: \`${data.currentSchemaVersion}\``
  ];

  if (relevantVersions.length === 0) {
    lines.push(
      "",
      installedVersion === data.currentSchemaVersion
        ? "The installed schema is current; no migration history is needed."
        : `The installed schema \`${installedVersion}\` is newer than or equal to the packaged migration history. Do not downgrade it.`
    );
  }

  for (const version of relevantVersions) {
    lines.push("", `### ${version.version} - ${version.date}`, "", version.summary, "", "Changes:");
    for (const change of version.changes) {
      lines.push(`- ${change}`);
    }

    if (version.migrations?.length) {
      lines.push("", "Migration guidance:");
      for (const migration of version.migrations) {
        lines.push(`- From \`${migration.from}\`:`);
        for (const step of migration.steps) {
          lines.push(`  - ${step}`);
        }
      }
    }
  }

  return lines.join("\n");
}

function relevantVersionHistory(history, installedVersion) {
  if (!installedVersion || installedVersion === "unversioned") {
    return history;
  }

  return history.filter((entry) => compareVersions(entry.version, installedVersion) > 0);
}

function compareVersions(left, right) {
  const leftParts = parseVersion(left);
  const rightParts = parseVersion(right);

  if (!leftParts || !rightParts) {
    return left.localeCompare(right, undefined, { numeric: true });
  }

  for (let index = 0; index < 3; index += 1) {
    if (leftParts[index] !== rightParts[index]) {
      return leftParts[index] - rightParts[index];
    }
  }

  return 0;
}

function parseVersion(version) {
  const match = version.match(/^(\d+)\.(\d+)\.(\d+)$/);
  return match ? match.slice(1).map(Number) : null;
}

function countNamedFiles(root, name) {
  if (!safeLstat(root)?.isDirectory()) return 0;
  let count = 0;
  for (const entry of fs.readdirSync(root, { withFileTypes: true })) {
    const entryPath = path.join(root, entry.name);
    if (entry.isDirectory()) count += countNamedFiles(entryPath, name);
    else if (entry.isFile() && entry.name === name) count += 1;
  }
  return count;
}

function render(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key) => values[key] ?? "");
}

function helpText() {
  return `simplest-sdd ${packageJson.version}

Usage:
  npx simplest-sdd@latest init [--cwd <path>]
  npx simplest-sdd@latest update [--cwd <path>]
  npx simplest-sdd@latest remove [--cwd <path>]
  npx simplest-sdd@latest analytics [--cwd <path>] [--format summary|json|jsonl|csv]
  npx simplest-sdd@latest codex-usage --session <id>

Commands:
  init     Print agent instructions for installing simplest-sdd.
  update   Print agent instructions for migrating an existing simplest-sdd setup.
  remove   Print agent instructions for conservatively removing simplest-sdd configuration.
  analytics    Validate execution.json records and print analysis-ready data.
  codex-usage  Read model, effort, duration, and token totals from a local Codex session.

Options:
  --cwd <path>   Inspect a project directory before printing instructions. Defaults to the current directory.
  --format <type> Analytics output: summary, json, jsonl, or csv.
  --session <id>  Local Codex session id to inspect without printing conversation content.
  --version      Print the CLI package version.
  --help         Show this help.

Init, update, and remove print instructions for an AI coding agent. Analytics and codex-usage are read-only. This CLI does not edit project files directly.`;
}

function readJson(filePath) {
  return JSON.parse(readText(filePath));
}

function readText(filePath) {
  return fs.readFileSync(filePath, "utf8");
}

function safeRead(filePath) {
  try {
    return fs.readFileSync(filePath, "utf8");
  } catch {
    return null;
  }
}

function safeLstat(filePath) {
  try {
    return fs.lstatSync(filePath);
  } catch {
    return null;
  }
}

function safeReadlink(filePath) {
  try {
    return fs.readlinkSync(filePath);
  } catch {
    return "unreadable";
  }
}

function print(message) {
  process.stdout.write(`${message}\n`);
}

function fail(message) {
  process.stderr.write(`${message}\n`);
  process.exit(1);
}
