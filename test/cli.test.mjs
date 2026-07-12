import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "bin", "simplest-sdd.mjs");

test("ships a parseable execution schema and matching example", () => {
  const schema = JSON.parse(fs.readFileSync(path.join(root, "schema", "execution.schema.json"), "utf8"));
  const example = JSON.parse(fs.readFileSync(path.join(root, "examples", "execution-record.json"), "utf8"));

  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.equal(example.schemaVersion, "1.0.0");
  assert.ok(schema.$defs.category.enum.includes("design"));
  assert.ok(example.classification.tags.includes("design"));
});

test("prints help", () => {
  const output = run(["--help"]);

  assert.match(output, /npx simplest-sdd@latest init/);
  assert.match(output, /does not edit project files directly/);
});

test("prints init instructions", () => {
  const output = run(["init"]);

  assert.match(output, /Simplest SDD Init Instructions/);
  assert.match(output, /@AGENTS\.md/);
  assert.match(output, /simplest-sdd-schema-version: 0\.6\.0/);
  assert.match(output, /request-refinement round/);
  assert.match(output, /waits for explicit approval before implementation/);
  assert.match(output, /Inspect And Discover The Testing Discipline/);
  assert.match(output, /resolved testing discipline/);
  assert.match(output, /npx skills add https:\/\/github\.com\/mattpocock\/skills --skill tdd -y/);
  assert.match(output, /\.agents\/skills\/spec-library\/index\.html/);
  assert.match(output, /business\.html/);
  assert.match(output, /:focus-visible/);
  assert.match(output, /always offer same-session/i);
  assert.match(output, /delegation confidence/);
  assert.match(output, /explicit user selection/);
  assert.match(output, /execution\.json/);
  assert.match(output, /efficient-worker/);
  assert.match(output, /analytics --format jsonl/);
});

test("prints detected update state", () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "simplest-sdd-test-"));
  const skillDir = path.join(cwd, ".agents", "skills", "spec-library");
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(path.join(cwd, "AGENTS.md"), "# Agent guide\n");
  fs.writeFileSync(path.join(cwd, "CLAUDE.md"), "@AGENTS.md\n");
  fs.writeFileSync(path.join(skillDir, "index.html"), "<!doctype html><title>Spec Library</title>\n");
  fs.writeFileSync(
    path.join(skillDir, "SKILL.md"),
    "---\nname: spec-library\ndescription: Test skill.\n---\n\n<!-- simplest-sdd-schema-version: 0.2.0 -->\n"
  );

  const output = run(["update", "--cwd", cwd]);

  assert.match(output, /Detected Local State/);
  assert.match(output, /Latest schema version: `0\.6\.0`/);
  assert.match(output, /regular file importing @AGENTS\.md/);
  assert.match(output, /found \(0\.2\.0\)/);
  assert.match(output, /wait for explicit approval before implementation/);
  assert.match(output, /resolved testing discipline/);
  assert.match(output, /library index: HTML index found/);
  assert.match(output, /always offer same-session/i);
  assert.match(output, /### 0\.6\.0/);
  assert.match(output, /### 0\.3\.0/);
  assert.doesNotMatch(output, /### 0\.2\.0/);
});

test("omits migration history for a current installation", () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "simplest-sdd-test-"));
  const skillDir = path.join(cwd, ".agents", "skills", "spec-library");
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(
    path.join(skillDir, "SKILL.md"),
    "---\nname: spec-library\ndescription: Test skill.\n---\n\n<!-- simplest-sdd-schema-version: 0.6.0 -->\n"
  );

  const output = run(["update", "--cwd", cwd]);

  assert.match(output, /installed schema is current; no migration history is needed/);
  assert.doesNotMatch(output, /### 0\.6\.0/);
  assert.doesNotMatch(output, /### 0\.5\.0/);
});

test("prints conservative removal instructions", () => {
  const output = run(["remove"]);

  assert.match(output, /Removal Instructions/);
  assert.match(output, /Never delete user-authored specs or decisions by default/);
  assert.match(output, /Treat removal as the active phase/);
  assert.match(output, /execution\.json.*user-owned execution history/);
});

test("validates and exports execution analytics", () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "simplest-sdd-test-"));
  const featureDir = path.join(cwd, ".agents", "skills", "spec-library", "specs", "content-discovery-export");
  fs.mkdirSync(featureDir, { recursive: true });
  fs.copyFileSync(path.join(root, "examples", "execution-record.json"), path.join(featureDir, "execution.json"));

  const summary = run(["analytics", "--cwd", cwd]);
  const csv = run(["analytics", "--cwd", cwd, "--format", "csv"]);
  const jsonl = run(["analytics", "--cwd", cwd, "--format=jsonl"]);

  assert.match(summary, /content-discovery-export\s+feature\s+M\s+high\s+high\s+hybrid\s+2\s+184200\s+complete/);
  assert.match(csv, /actualModel/);
  assert.match(csv, /efficient-model-example/);
  assert.equal(jsonl.trim().split("\n").length, 2);
  assert.equal(JSON.parse(jsonl.trim().split("\n")[1]).totalTokens, 74200);
});

test("rejects invalid execution analytics", () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "simplest-sdd-test-"));
  const featureDir = path.join(cwd, ".agents", "skills", "spec-library", "specs", "broken");
  fs.mkdirSync(featureDir, { recursive: true });
  fs.writeFileSync(path.join(featureDir, "execution.json"), '{"schemaVersion":"1.0.0"}\n');

  const result = spawnSync(process.execPath, [cli, "analytics", "--cwd", cwd], { cwd: root, encoding: "utf8" });

  assert.equal(result.status, 1);
  assert.match(result.stderr, /Execution data validation failed/);
  assert.match(result.stderr, /specId must be a non-empty string/);
});

test("reads Codex usage without emitting conversation content", () => {
  const codexHome = fs.mkdtempSync(path.join(os.tmpdir(), "simplest-sdd-codex-"));
  const sessionDir = path.join(codexHome, "sessions", "2026", "07", "12");
  fs.mkdirSync(sessionDir, { recursive: true });
  const events = [
    { type: "session_meta", payload: { id: "session-123", model_provider: "openai" } },
    { type: "turn_context", payload: { model: "actual-model", effort: "medium" } },
    { type: "event_msg", timestamp: "2026-07-12T10:00:00Z", payload: { type: "task_started", started_at: "2026-07-12T10:00:00Z" } },
    { type: "event_msg", payload: { type: "token_count", info: { total_token_usage: { input_tokens: 100, cached_input_tokens: 40, output_tokens: 20, reasoning_output_tokens: 10, total_tokens: 130 } } } },
    { type: "response_item", payload: { type: "message", content: "private conversation text" } },
    { type: "event_msg", timestamp: "2026-07-12T10:01:00Z", payload: { type: "task_complete", completed_at: "2026-07-12T10:01:00Z", duration_ms: 60000 } }
  ];
  fs.writeFileSync(path.join(sessionDir, "rollout.jsonl"), `${events.map(JSON.stringify).join("\n")}\n`);

  const output = run(["codex-usage", "--session", "session-123"], { CODEX_HOME: codexHome });
  const usage = JSON.parse(output);

  assert.equal(usage.actualModel, "actual-model");
  assert.equal(usage.reasoningEffort, "medium");
  assert.equal(usage.tokenUsage.totalTokens, 130);
  assert.doesNotMatch(output, /private conversation text/);
});

function run(args, env = {}) {
  return execFileSync(process.execPath, [cli, ...args], {
    cwd: root,
    encoding: "utf8",
    env: { ...process.env, ...env }
  });
}
