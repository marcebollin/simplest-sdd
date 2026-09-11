import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { formatAnalytics, validateExecutionRecord } from "../lib/execution-data.mjs";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "bin", "simplest-sdd.mjs");

test("ships a parseable execution schema and matching example", () => {
  const schema = JSON.parse(fs.readFileSync(path.join(root, "schema", "execution.schema.json"), "utf8"));
  const example = JSON.parse(fs.readFileSync(path.join(root, "examples", "execution-record.json"), "utf8"));

  assert.equal(schema.$schema, "https://json-schema.org/draft/2020-12/schema");
  assert.deepEqual(schema.properties.schemaVersion.enum, ["1.0.0", "1.1.0"]);
  assert.equal(example.schemaVersion, "1.1.0");
  assert.ok(schema.$defs.category.enum.includes("design"));
  assert.ok(schema.$defs.effort.enum.includes("XL"));
  assert.ok(example.classification.tags.includes("design"));
  assert.equal(example.humanEvaluations[0].scale, "overall-execution-1-to-10-v1");
  assert.equal(example.humanEvaluations[0].rating, 9);
  assert.deepEqual(validateExecutionRecord(example), []);
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
  assert.match(output, /simplest-sdd-schema-version: 0\.14\.0/);
  assert.match(output, /purely presentational design, styling, spacing, or layout change/i);
  assert.match(output, /must not activate the workflow solely because reviewing/i);
  assert.match(output, /mandatory discovery/i);
  assert.match(output, /Documentation impact/);
  assert.match(output, /Existing spec likely to update automatically/);
  assert.match(output, /Automatically update the existing owning business and technical spec files/);
  assert.match(output, /without requiring business-spec approval/);
  assert.match(output, /Any existing spec classified `changed` is maintained automatically/);
  assert.match(output, /Create a new spec/);
  assert.match(output, /Continue without a new spec/);
  assert.match(output, /Mark exactly one option with `\(Recommended\)`/);
  assert.match(output, /Discovery answers never imply consent to create a new spec/);
  assert.match(output, /do not create `business\.html`.*`execution\.json`/s);
  assert.match(output, /No independent technical approval required/);
  assert.match(output, /Creating no new spec does not imply technical approval/);
  assert.match(output, /Every discovery message.*final result must expose.*exact path or anchor/s);
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
  assert.match(output, /Decision impact/);
  assert.match(output, /No durable decision impact/);
  assert.match(output, /load only those category documents/);
  assert.match(output, /default is not to create a decision/i);
  assert.match(output, /decision-category\.html/);
  assert.match(output, /data-artifact="business-spec"/);
  assert.match(output, /body\[data-artifact="technical-spec"\]/);
  assert.match(output, /\.keyword, mark/);
  assert.match(output, /Document relationships/);
  assert.match(output, /\| Role \| Document \| Why it matters \|/);
  assert.match(output, /direct behavior dependency, owns a shared contract, overlaps scope.*or is superseded/i);
  assert.match(output, /Do not add a direct link because two documents share keywords/i);
  assert.match(output, /plan also links to `execution\.json`/i);
  assert.match(output, /execution schema version `1\.1\.0`/i);
  assert.match(output, /empty `humanEvaluations` array/i);
  assert.match(output, /How would you rate this execution overall from 1 to 10\?/);
  assert.match(output, /`1` means it failed.*`5` means mixed or partially successful.*`10` means excellent/s);
  assert.match(output, /status: "pending".*overall-execution-1-to-10-v1/s);
  assert.match(output, /status: "rated"|change the pending entry to `rated`/);
  assert.match(output, /change it to `declined`/);
  assert.match(output, /Do not infer a rating or comment/);
  assert.match(output, /Do not run it on the no-new-spec path/);
  assert.match(output, /same message also contains an explicit new request.*record the feedback first.*route the remaining request normally/s);
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
  assert.match(output, /Latest schema version: `0\.14\.0`/);
  assert.match(output, /regular file importing @AGENTS\.md/);
  assert.match(output, /found \(0\.2\.0\)/);
  assert.match(output, /wait for explicit approval before implementation/);
  assert.match(output, /resolved testing discipline/);
  assert.match(output, /library index: HTML index found/);
  assert.match(output, /always offer same-session/i);
  assert.match(output, /### 0\.8\.0/);
  assert.match(output, /### 0\.9\.0/);
  assert.match(output, /### 0\.10\.0/);
  assert.match(output, /### 0\.11\.0/);
  assert.match(output, /### 0\.12\.0/);
  assert.match(output, /### 0\.13\.0/);
  assert.match(output, /### 0\.14\.0/);
  assert.match(output, /Create a new spec.*Continue without a new spec/s);
  assert.match(output, /automatically (?:refresh|update) an existing spec/i);
  assert.match(output, /provisional documentation-impact/i);
  assert.match(output, /Preserve explicit technical approvals in every branch/i);
  assert.match(output, /semantic artifact accents/i);
  assert.match(output, /Document relationships table/i);
  assert.match(output, /topic similarity/i);
  assert.match(output, /no business requirement or behavior change/i);
  assert.match(output, /Decision impact/);
  assert.match(output, /create no empty categories/i);
  assert.match(output, /reliably inferred/i);
  assert.match(output, /schema 1\.1\.0 evaluations.*legacy 1\.0\.0 records/i);
  assert.match(output, /pending evaluation entry before asking/i);
  assert.match(output, /anchored 1(?:–10|-to-10).*(?:rating|question).*optional comment/i);
  assert.match(output, /skips the no-new-spec path/i);
  assert.match(output, /### 0\.6\.0/);
  assert.match(output, /### 0\.3\.0/);
  assert.doesNotMatch(output, /### 0\.2\.0/);
});

test("prints only the reuse migration for a 0.13.0 installation without modifying it", (t) => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "simplest-sdd-test-"));
  t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  const skillDir = path.join(cwd, ".agents", "skills", "spec-library");
  const skillPath = path.join(skillDir, "SKILL.md");
  const installed = "---\nname: spec-library\ndescription: Test skill.\n---\n\n<!-- simplest-sdd-schema-version: 0.13.0 -->\n";
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(skillPath, installed);

  const output = run(["update", "--cwd", cwd]);

  assert.deepEqual([...output.matchAll(/^### (\d+\.\d+\.\d+) - /gm)].map((match) => match[1]), ["0.14.0"]);
  assert.equal(fs.readFileSync(skillPath, "utf8"), installed);
  assert.deepEqual(fs.readdirSync(skillDir), ["SKILL.md"]);
});

test("omits migration history for a current installation", () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "simplest-sdd-test-"));
  const skillDir = path.join(cwd, ".agents", "skills", "spec-library");
  fs.mkdirSync(skillDir, { recursive: true });
  fs.writeFileSync(
    path.join(skillDir, "SKILL.md"),
    "---\nname: spec-library\ndescription: Test skill.\n---\n\n<!-- simplest-sdd-schema-version: 0.14.0 -->\n"
  );

  const output = run(["update", "--cwd", cwd]);

  assert.match(output, /installed schema is current; no migration history is needed/);
  assert.doesNotMatch(output, /### 0\.8\.0/);
  assert.doesNotMatch(output, /### 0\.10\.0/);
  assert.doesNotMatch(output, /### 0\.11\.0/);
  assert.doesNotMatch(output, /### 0\.12\.0/);
  assert.doesNotMatch(output, /### 0\.13\.0/);
  assert.doesNotMatch(output, /### 0\.14\.0/);
  assert.doesNotMatch(output, /### 0\.9\.0/);
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
  const longFeatureDir = path.join(cwd, ".agents", "skills", "spec-library", "specs", "user-surface-brand-alignment");
  fs.mkdirSync(featureDir, { recursive: true });
  fs.copyFileSync(path.join(root, "examples", "execution-record.json"), path.join(featureDir, "execution.json"));
  const longRecord = JSON.parse(fs.readFileSync(path.join(root, "examples", "execution-record.json"), "utf8"));
  longRecord.specId = "user-surface-brand-alignment";
  longRecord.title = "User Surface Brand Alignment";
  longRecord.classification.primaryCategory = "design";
  longRecord.classification.overallEffort = "XL";
  longRecord.tasks[0].effort = "XL";
  fs.mkdirSync(longFeatureDir, { recursive: true });
  fs.writeFileSync(path.join(longFeatureDir, "execution.json"), `${JSON.stringify(longRecord, null, 2)}\n`);

  const summary = run(["analytics", "--cwd", cwd]);
  const csv = run(["analytics", "--cwd", cwd, "--format", "csv"]);
  const jsonl = run(["analytics", "--cwd", cwd, "--format=jsonl"]);

  assert.match(summary, /content-discovery-export\s+feature\s+M\s+high\s+high\s+hybrid\s+2\s+184200\s+complete\s+1\s+9\/10/);
  const tableRows = summary.split("\n").slice(2);
  const columnStarts = ["SPEC", "CATEGORY", "EFFORT", "PLAN CONF", "DELEG CONF", "STRATEGY", "RUNS", "TOKENS", "OUTCOME", "EVALS", "RATING"]
    .map((header) => tableRows[0].indexOf(header));
  const expectedRows = [
    ["content-discovery-export", "feature", "M", "high", "high", "hybrid", "2", "184200", "complete", "1", "9/10"],
    ["user-surface-brand-alignment", "design", "XL", "high", "high", "hybrid", "2", "184200", "complete", "1", "9/10"]
  ];
  for (const [rowIndex, expected] of expectedRows.entries()) {
    const actual = columnStarts.map((start, columnIndex) => {
      const end = columnStarts[columnIndex + 1] ?? tableRows[rowIndex + 1].length;
      return tableRows[rowIndex + 1].slice(start, end).trim();
    });
    assert.deepEqual(actual, expected);
  }
  assert.doesNotMatch(summary, /\t/);
  assert.match(csv, /actualModel/);
  assert.match(csv, /efficient-model-example/);
  assert.match(csv, /evaluationId/);
  assert.match(csv, /humanRating/);
  assert.equal(jsonl.trim().split("\n").length, 4);
  const secondRow = JSON.parse(jsonl.trim().split("\n")[1]);
  assert.equal(secondRow.totalTokens, 74200);
  assert.equal(secondRow.evaluationId, "evaluation-001");
  assert.equal(secondRow.evaluationStatus, "rated");
  assert.equal(secondRow.humanRatingScale, "overall-execution-1-to-10-v1");
  assert.equal(secondRow.humanRating, 9);
  assert.match(secondRow.humanComment, /approved scope/);
  assert.equal(secondRow.evaluationRequestedAt, "2026-07-12T15:30:00Z");
  assert.equal(secondRow.evaluationRecordedAt, "2026-07-12T15:32:00Z");
});

test("accepts XL overall and task effort", () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "simplest-sdd-test-"));
  const featureDir = path.join(cwd, ".agents", "skills", "spec-library", "specs", "large-feature");
  const record = JSON.parse(fs.readFileSync(path.join(root, "examples", "execution-record.json"), "utf8"));
  record.classification.overallEffort = "XL";
  record.tasks[0].effort = "XL";
  fs.mkdirSync(featureDir, { recursive: true });
  fs.writeFileSync(path.join(featureDir, "execution.json"), `${JSON.stringify(record, null, 2)}\n`);

  const output = run(["analytics", "--cwd", cwd]);

  assert.match(output, /content-discovery-export\s+feature\s+XL\s+high\s+high\s+hybrid/);
});

test("accepts legacy 1.0 execution records without human evaluations", () => {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "simplest-sdd-test-"));
  const featureDir = path.join(cwd, ".agents", "skills", "spec-library", "specs", "legacy-feature");
  const record = executionExample();
  record.schemaVersion = "1.0.0";
  delete record.humanEvaluations;

  assert.deepEqual(validateExecutionRecord(record), []);

  fs.mkdirSync(featureDir, { recursive: true });
  fs.writeFileSync(path.join(featureDir, "execution.json"), `${JSON.stringify(record, null, 2)}\n`);

  const summary = run(["analytics", "--cwd", cwd]);
  const [row] = JSON.parse(run(["analytics", "--cwd", cwd, "--format=json"]));

  assert.match(summary, /complete\s+0\s+—/);
  assert.equal(row.evaluationId, null);
  assert.equal(row.evaluationStatus, null);
  assert.equal(row.humanRatingScale, null);
  assert.equal(row.humanRating, null);
  assert.equal(row.humanComment, null);
  assert.equal(row.evaluationRequestedAt, null);
  assert.equal(row.evaluationRecordedAt, null);
});

test("validates human rating bounds and integer values", () => {
  for (const rating of [1, 10]) {
    const record = executionExample();
    record.humanEvaluations[0].rating = rating;
    assert.deepEqual(validateExecutionRecord(record), []);
  }

  for (const rating of [0, 11, 7.5]) {
    const record = executionExample();
    record.humanEvaluations[0].rating = rating;
    assert.match(validateExecutionRecord(record).join("\n"), /rating must be .*integer from 1 to 10/);
  }
});

test("validates human evaluation run coverage and unique identifiers", () => {
  const unknownRun = executionExample();
  unknownRun.humanEvaluations[0].runIds = ["run-missing"];
  assert.match(validateExecutionRecord(unknownRun).join("\n"), /references unknown run run-missing/);

  const repeatedRun = executionExample();
  repeatedRun.humanEvaluations[0].runIds = ["run-001", "run-001"];
  assert.match(validateExecutionRecord(repeatedRun).join("\n"), /contains duplicate run run-001/);

  const emptyCoverage = executionExample();
  emptyCoverage.humanEvaluations[0].runIds = [];
  assert.match(validateExecutionRecord(emptyCoverage).join("\n"), /runIds must be a non-empty array/);

  const duplicateEvaluationId = executionExample();
  duplicateEvaluationId.humanEvaluations[0].runIds = ["run-001"];
  duplicateEvaluationId.humanEvaluations.push({
    ...duplicateEvaluationId.humanEvaluations[0],
    runIds: ["run-002"],
    requestedAt: "2026-07-12T15:33:00Z",
    recordedAt: "2026-07-12T15:34:00Z"
  });
  assert.match(validateExecutionRecord(duplicateEvaluationId).join("\n"), /humanEvaluations\[1\]\.id is duplicated/);

  const overlappingEvaluations = executionExample();
  overlappingEvaluations.humanEvaluations[0].runIds = ["run-001"];
  overlappingEvaluations.humanEvaluations.push({
    ...overlappingEvaluations.humanEvaluations[0],
    id: "evaluation-002",
    runIds: ["run-001"],
    requestedAt: "2026-07-12T15:33:00Z",
    recordedAt: "2026-07-12T15:34:00Z"
  });
  assert.match(validateExecutionRecord(overlappingEvaluations).join("\n"), /reuses run run-001 from evaluation evaluation-001/);
});

test("validates human evaluation lifecycle fields", () => {
  const pending = executionExample();
  pending.humanEvaluations[0] = {
    ...pending.humanEvaluations[0],
    status: "pending",
    rating: null,
    comment: null,
    recordedAt: null
  };
  assert.deepEqual(validateExecutionRecord(pending), []);
  const [pendingRow] = JSON.parse(formatAnalytics([{ record: pending }], "json"));
  assert.equal(pendingRow.evaluationStatus, "pending");
  assert.equal(pendingRow.humanRating, null);
  assert.equal(pendingRow.evaluationRecordedAt, null);

  const declined = executionExample();
  declined.humanEvaluations[0] = {
    ...declined.humanEvaluations[0],
    status: "declined",
    rating: null,
    comment: null
  };
  assert.deepEqual(validateExecutionRecord(declined), []);
  const [declinedRow] = JSON.parse(formatAnalytics([{ record: declined }], "json"));
  assert.equal(declinedRow.evaluationStatus, "declined");
  assert.equal(declinedRow.humanRating, null);
  assert.equal(declinedRow.evaluationRecordedAt, "2026-07-12T15:32:00Z");

  const pendingWithResult = executionExample();
  pendingWithResult.humanEvaluations[0].status = "pending";
  assert.match(validateExecutionRecord(pendingWithResult).join("\n"), /rating must be null when status is pending/);
  assert.match(validateExecutionRecord(pendingWithResult).join("\n"), /recordedAt must be null when status is pending/);

  const ratedWithoutTimestamp = executionExample();
  ratedWithoutTimestamp.humanEvaluations[0].recordedAt = null;
  assert.match(validateExecutionRecord(ratedWithoutTimestamp).join("\n"), /recordedAt must be a date-time string when status is rated/);

  const declinedWithRating = executionExample();
  declinedWithRating.humanEvaluations[0].status = "declined";
  assert.match(validateExecutionRecord(declinedWithRating).join("\n"), /rating must be null when status is declined/);

  const invalidTimestamp = executionExample();
  invalidTimestamp.humanEvaluations[0].requestedAt = "yesterday";
  assert.match(validateExecutionRecord(invalidTimestamp).join("\n"), /requestedAt must be a date-time string/);

  const impossibleTimestamp = executionExample();
  impossibleTimestamp.humanEvaluations[0].requestedAt = "2026-02-31T12:00:00Z";
  assert.match(validateExecutionRecord(impossibleTimestamp).join("\n"), /requestedAt must be a date-time string/);

  const unexpectedProperty = executionExample();
  unexpectedProperty.humanEvaluations[0].agentScore = 10;
  assert.match(validateExecutionRecord(unexpectedProperty).join("\n"), /agentScore is not allowed/);

  const invalidScale = executionExample();
  invalidScale.humanEvaluations[0].scale = "custom-scale";
  assert.match(validateExecutionRecord(invalidScale).join("\n"), /scale must be overall-execution-1-to-10-v1/);
});

test("summarizes the latest human evaluation status", () => {
  const record = executionExample();
  record.humanEvaluations[0].runIds = ["run-001"];
  record.humanEvaluations.push({
    id: "evaluation-002",
    status: "pending",
    scale: "overall-execution-1-to-10-v1",
    runIds: ["run-002"],
    rating: null,
    comment: null,
    requestedAt: "2026-07-12T15:40:00Z",
    recordedAt: null
  });

  assert.match(formatAnalytics([{ record }], "summary"), /complete\s+2\s+pending/);

  record.humanEvaluations[1].status = "declined";
  record.humanEvaluations[1].recordedAt = "2026-07-12T15:41:00Z";
  assert.match(formatAnalytics([{ record }], "summary"), /complete\s+2\s+declined/);
});

test("requires human evaluations for execution schema 1.1", () => {
  const record = executionExample();
  delete record.humanEvaluations;

  assert.match(validateExecutionRecord(record).join("\n"), /humanEvaluations must be an array for schemaVersion 1\.1\.0/);
});

test("requires schema 1.1 for human evaluations", () => {
  const record = executionExample();
  record.schemaVersion = "1.0.0";

  assert.match(validateExecutionRecord(record).join("\n"), /humanEvaluations requires schemaVersion 1\.1\.0/);
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

function executionExample() {
  return JSON.parse(fs.readFileSync(path.join(root, "examples", "execution-record.json"), "utf8"));
}
