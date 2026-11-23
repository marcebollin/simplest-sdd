#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { renderPrompt } from "../prompts/render.mjs";

const packageRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const packageJson = readJson(path.join(packageRoot, "package.json"));
const versions = readJson(path.join(packageRoot, "schema", "versions.json"));

const commands = new Set(["init", "update", "remove"]);
const retiredReportPaths = [
  "specs/**/execution.json", "data/executions.jsonl", "templates/execution-template.json",
  "schema/execution.schema.json", "examples/execution-record.json", "lib/execution-data.mjs", "lib/codex-usage.mjs"
];
const retiredReportNames = new Set(retiredReportPaths.map(file => path.posix.basename(file)));

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
  const contract = parsed.command === "remove" ? "" : readText(path.join(packageRoot, "prompts", "contract.md"));
  const values = {
    packageVersion: packageJson.version,
    schemaVersion: versions.currentSchemaVersion
  };
  if (parsed.command !== "init") {
    const state = detectState(cwd, parsed.command);
    values.detectedState = formatDetectedState(state);
    if (parsed.command === "update") values.versionHistory = formatVersionHistory(versions, state.skillVersion);
  }

  print(renderPrompt(template, contract, values).trimEnd());
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

function detectState(cwd, command) {
  const canonical = ".agents/skills/spec-library";
  const claudeSkill = ".claude/skills/spec-library";
  const claudeOnly = !safeLstat(path.join(cwd, canonical)) && safeLstat(path.join(cwd, claudeSkill))?.isDirectory();
  const source = claudeOnly ? claudeSkill : canonical;
  const library = path.join(cwd, source);
  const skillText = safeRead(path.join(library, "SKILL.md"));
  const skillVersion = skillText
    ? skillText.match(/simplest-sdd-schema-version:\s*([0-9]+\.[0-9]+\.[0-9]+)/)?.[1] || "unversioned"
    : null;
  return {
    cwd,
    agents: describePath(path.join(cwd, "AGENTS.md")),
    claude: describeClaude(path.join(cwd, "CLAUDE.md")),
    source,
    hasRetiredReports: command === "update" && (
      /codex-usage|simplest-sdd(?:@[\w.-]+)? analytics|humanEvaluations|executions?\.jsonl?\b/i.test(skillText ?? "") ||
      [canonical, claudeSkill, ".agents/archive/simplest-sdd"].some(relative => containsRetiredReport(path.join(cwd, relative)))
    ),
    skill: skillText ? `found (${skillVersion})` : describePath(path.join(library, "SKILL.md")),
    skillVersion,
    claudeSkill: describePath(path.join(cwd, claudeSkill)),
    library: {
      decisions: describePath(path.join(library, "DECISIONS.md")),
      legacy: {
        map: describePath(path.join(library, "index.html")),
        decisionDocuments: countDecisionDocuments(path.join(library, "decisions")),
        ...countFeatureDocuments(path.join(library, "specs")),
        indexes: existing(library, ["specs/index.html", "specs/INDEX.md", "decisions/index.html", "decisions/INDEX.md"]),
        references: existing(library, [
          "references/decisions.md", "references/testing.md",
          "references/discovery.md", "references/authoring.md", "references/execution.md"
        ]),
        templates: describePath(path.join(library, "templates"))
      }
    }
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

function formatDetectedState(state) {
  const { legacy } = state.library;
  const lines = [
    "## Detected Local State",
    "",
    "The CLI inspected this installation without changing files.",
    "",
    `- Working directory: \`${state.cwd}\``,
    `- \`AGENTS.md\`: ${state.agents}`,
    `- \`CLAUDE.md\`: ${state.claude}`,
    `- \`${state.source}/SKILL.md\`: ${state.skill}`,
    `- \`.claude/skills/spec-library\`: ${state.claudeSkill}`,
    `- decision file \`DECISIONS.md\`: ${state.library.decisions}`,
    `- legacy decision map (\`index.html\`): ${legacy.map}`,
    `- legacy documents in \`decisions/\`: ${legacy.decisionDocuments}`,
    `- legacy feature documents in \`specs/\`: ${legacy.business} business, ${legacy.technical} technical, ${legacy.plan} plan`,
    `- legacy indexes: ${listOrNone(legacy.indexes)}`,
    `- legacy references: ${listOrNone(legacy.references)}`,
    `- legacy templates: ${legacy.templates}`
  ];
  if (state.hasRetiredReports) {
    lines.push(
      "",
      `Old Simplest SDD reporting files used these library-relative paths: ${listOrNone(retiredReportPaths)}. Use the original paths to recognize framework recovery copies as well.`,
      "Remove framework rating requests, model or token usage collection and references to the retired `analytics` and `codex-usage` commands. Check generated guides, exports, index columns and links. Keep any project-owned product reporting and verification instructions."
    );
  }
  return lines.join("\n");
}

function containsRetiredReport(directory) {
  for (const name of fileNamesUnder(directory)) {
    // Recovery copies may have a numeric suffix before or after the extension.
    if (retiredReportNames.has(name.replace(/\.\d+(?=\.jsonl?$|$)/, ""))) return true;
  }
  return false;
}

function existing(root, relativePaths) {
  return relativePaths.filter((relative) => safeLstat(path.join(root, relative)));
}

function listOrNone(items) {
  return items.length ? items.map((item) => `\`${item}\``).join(", ") : "none";
}

function countDecisionDocuments(directory) {
  let count = 0;
  for (const name of fileNamesUnder(directory)) {
    if (/\.(html|md)$/i.test(name) && !/^index\.(html|md)$/i.test(name)) count += 1;
  }
  return count;
}

function countFeatureDocuments(directory) {
  const counts = { business: 0, technical: 0, plan: 0 };
  for (const name of fileNamesUnder(directory)) {
    const featureDocument = /^(business|technical|plan)\.(?:html|md)$/.exec(name);
    if (featureDocument) counts[featureDocument[1]] += 1;
  }
  return counts;
}

function formatVersionHistory(data, installedVersion) {
  const relevantVersions = data.versions.filter(({ version }) =>
    compareVersions(version, data.migrationBaseline) >= 0 &&
    (!installedVersion || installedVersion === "unversioned" || compareVersions(version, installedVersion) > 0)
  );
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

function* fileNamesUnder(root) {
  if (!safeLstat(root)?.isDirectory()) return;
  let entries;
  try {
    entries = fs.readdirSync(root, { withFileTypes: true });
  } catch (error) {
    if (["ENOENT", "ENOTDIR", "EACCES", "EPERM"].includes(error.code)) return;
    throw error;
  }
  for (const entry of entries) {
    if (entry.isDirectory()) yield* fileNamesUnder(path.join(root, entry.name));
    else if (entry.isFile()) yield entry.name;
  }
}

function helpText() {
  return `simplest-sdd ${packageJson.version}

Usage:
  npx simplest-sdd@latest init [--cwd <path>]
  npx simplest-sdd@latest update [--cwd <path>]
  npx simplest-sdd@latest remove [--cwd <path>]

Commands:
  init     Print agent instructions for installing the simplest-sdd decision library.
  update   Print agent instructions for migrating an existing simplest-sdd setup.
  remove   Print agent instructions for conservatively removing simplest-sdd configuration.

Options:
  --cwd <path>   Inspect a project directory before printing instructions. Defaults to the current directory.
  --version      Print the CLI package version.
  --help         Show this help.

Init, update, and remove print instructions for an AI coding agent. This CLI does not edit project files directly.`;
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
