#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = readJson(path.join(packageRoot, "package.json"));
const versions = readJson(path.join(packageRoot, "schema", "versions.json"));

const commands = new Set(["init", "update", "remove"]);

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
  const template = readText(path.join(packageRoot, "prompts", `${parsed.command}.md`));
  const output = render(template, {
    packageVersion: packageJson.version,
    schemaVersion: versions.currentSchemaVersion,
    detectedState: formatDetectedState(detectState(cwd)),
    versionHistory: formatVersionHistory(versions)
  });

  print(output.trimEnd());
}

function parseArgs(args) {
  const parsed = {
    command: null,
    cwd: null,
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

  const skillText = safeRead(skillPath);
  const skillVersion = skillText
    ? skillText.match(/simplest-sdd-schema-version:\s*([0-9]+\.[0-9]+\.[0-9]+)/)?.[1] || "unversioned"
    : null;

  return {
    cwd,
    agents: describePath(agentsPath),
    claude: describeClaude(claudePath),
    skill: skillText ? `found (${skillVersion})` : describePath(skillPath),
    claudeSkill: describePath(claudeSkillPath),
    libraryIndex: describeArtifactIndex(libraryHtmlIndex, null),
    specsIndex: describeArtifactIndex(specsHtmlIndex, specsMarkdownIndex),
    decisionsIndex: describeArtifactIndex(decisionsHtmlIndex, decisionsMarkdownIndex)
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
    `- decision index: ${state.decisionsIndex}`
  ].join("\n");
}

function formatVersionHistory(data) {
  const lines = [
    "## Simplest SDD Schema Versions",
    "",
    `Latest schema version: \`${data.currentSchemaVersion}\``
  ];

  for (const version of data.versions) {
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

function render(template, values) {
  return template.replace(/\{\{(\w+)\}\}/g, (_match, key) => values[key] ?? "");
}

function helpText() {
  return `simplest-sdd ${packageJson.version}

Usage:
  npx simplest-sdd@latest init [--cwd <path>]
  npx simplest-sdd@latest update [--cwd <path>]
  npx simplest-sdd@latest remove [--cwd <path>]

Commands:
  init     Print agent instructions for installing simplest-sdd.
  update   Print agent instructions for migrating an existing simplest-sdd setup.
  remove   Print agent instructions for conservatively removing simplest-sdd configuration.

Options:
  --cwd <path>   Inspect a project directory before printing instructions. Defaults to the current directory.
  --version      Print the CLI package version.
  --help         Show this help.

This CLI prints instructions for an AI coding agent. It does not edit files directly.`;
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
