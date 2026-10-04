import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { execFileSync, spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "bin", "simplest-sdd.mjs");
const packageJson = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
const versions = JSON.parse(fs.readFileSync(path.join(root, "schema", "versions.json"), "utf8"));

test("prints help and the package version", () => {
  const output = run(["--help"]);

  for (const command of ["init", "update", "remove"]) {
    assert.ok(output.includes(`npx simplest-sdd@latest ${command}`));
  }
  assert.match(output, /does not edit project files directly/);
  assert.doesNotMatch(output, /analytics|codex-usage|--format|--session/);
  assert.equal(run([]), output);
  assert.equal(run(["--version"]).trim(), packageJson.version);
  assert.equal(packageJson.version, versions.currentSchemaVersion);
});

test("rejects the removed telemetry commands and options", () => {
  for (const command of ["analytics", "codex-usage"]) {
    const result = invoke([command]);
    assert.equal(result.status, 1);
    assert.ok(result.stderr.startsWith(`Unknown command: ${command}\n`));
    assert.equal(result.stdout, "");
  }

  for (const option of ["--format", "--format=json", "--session", "--session=old-session"]) {
    const result = invoke(["update", option]);
    assert.equal(result.status, 1);
    assert.equal(result.stderr.trim(), `Unknown option: ${option}`);
    assert.equal(result.stdout, "");
  }
});

test("retains argument validation for the supported commands", () => {
  for (const [args, error] of [
    [["update", "--cwd"], "Missing value for --cwd"],
    [["init", "update"], "Unexpected argument: update"],
    [["init", "--unknown"], "Unknown option: --unknown"]
  ]) {
    const result = invoke(args);
    assert.equal(result.status, 1);
    assert.equal(result.stderr.trim(), error);
  }
});

test("prints the maintained init template with the current schema version", () => {
  const template = fs.readFileSync(path.join(root, "prompts", "init.md"), "utf8");
  const output = run(["init"]);

  assert.equal(output, template.replaceAll("{{schemaVersion}}", versions.currentSchemaVersion).trimEnd() + "\n");
  assert.doesNotMatch(output, /\{\{[a-zA-Z]+\}\}/);
});

test("delivers the complete current update contract even without migration history", (t) => {
  const template = fs.readFileSync(path.join(root, "prompts", "update.md"), "utf8");
  const output = run(["update", "--cwd", project(t, versions.currentSchemaVersion)]);
  const currentRules = template.slice(template.indexOf("## Rules"))
    .replaceAll("{{schemaVersion}}", versions.currentSchemaVersion)
    .replaceAll("{{packageVersion}}", packageJson.version);

  assert.ok(output.endsWith(currentRules.trimEnd() + "\n"));
  assert.doesNotMatch(output, /\{\{[a-zA-Z]+\}\}/);
  assert.deepEqual(migrationVersions(output), []);
});

test("fresh init provides content-led HTML authoring without format scaffolds", () => {
  const output = run(["init"]);

  assertAuthoringContract(output);
  assert.match(output, /Do not create a `templates\/` directory on fresh installs/);
  assert.doesNotMatch(output, /```html|Use this baseline style|business is violet|no JavaScript unless|templates\/(?:business-spec|technical-spec|plan|decision-category)\.html/);
});

test("authoring keeps reader guidance primary and excludes blanket skill mandates", (t) => {
  const outputs = [
    run(["init"]),
    run(["update", "--cwd", project(t, versions.currentSchemaVersion)])
  ];

  for (const output of outputs) {
    assert.match(output, /reader and the reading task/);
    assert.match(output, /clear hierarchy with readable typography/);
    assert.match(output, /Lead with the outcome or change[^\n]*current state/);
    assert.match(output, /natural, direct prose/);
    assert.match(output, /one bounded action or testable condition per item/i);
    assert.match(output, /never a completeness limit: retain every requirement, alternative, exception, and required discovery question/);
    assert.match(output, /without another user request/);
    assert.match(output, /Each control must perform a clear reading task and show its (?:current )?state/);
    assert.match(output, /Use motion only to explain a user-triggered change/);
    assert.match(output, /(?:Keep|keep) information still by default/);
    assert.match(output, /not installation or runtime dependencies/);
    assert.match(output, /No dictionary check or compliance report is required/);
    assert.doesNotMatch(output, /ASD-STE100 Simplified Technical English for (?:all )?new or revised artifact prose|descriptions to 25 words|Check the official specification and dictionary/);
    assert.doesNotMatch(output, /Cap lists to 5 items|Display them only when the user asks|\bMOTION_INTENSITY\b|\bDESIGN_VARIANCE\b|\*\*Framework:\*\*|\*\*Animation:\*\*/);
  }
});

test("fresh init does not prescribe execution artifacts or request ratings", (t) => {
  const cwd = project(t);
  const output = run(["init", "--cwd", cwd]);

  assert.doesNotMatch(output, /execution\.json|executions\.jsonl|humanEvaluations|execution\.schema\.json/);
  assert.doesNotMatch(output, /How would you rate|overall-execution-1-to-10-v1|analytics --format|codex-usage --session/);
  assert.doesNotMatch(output, /legacy execution ledger:|legacy feature execution records:/);
  assert.deepEqual(fs.readdirSync(cwd), []);
});

test("prints detected update state and applicable migration history", (t) => {
  const cwd = project(t, "0.2.0");
  const skillDir = path.join(cwd, ".agents", "skills", "spec-library");
  fs.writeFileSync(path.join(cwd, "AGENTS.md"), "# Agent guide\n");
  fs.writeFileSync(path.join(cwd, "CLAUDE.md"), "@AGENTS.md\n");
  fs.writeFileSync(path.join(skillDir, "index.html"), "<!doctype html><title>Spec Library</title>\n");
  const before = snapshot(cwd);

  const output = run(["update", `--cwd=${cwd}`]);

  assert.match(output, /Detected Local State/);
  assert.ok(output.includes(`Latest schema version: \`${versions.currentSchemaVersion}\``));
  assert.match(output, /regular file importing @AGENTS\.md/);
  assert.match(output, /found \(0\.2\.0\)/);
  assert.match(output, /library index: HTML index found/);
  const history = migrationVersions(output);
  assert.equal(history[0], versions.currentSchemaVersion);
  assert.ok(history.includes("0.3.0"));
  assert.ok(history.includes("0.14.0"));
  assert.ok(!history.includes("0.2.0"));
  assert.deepEqual(snapshot(cwd), before);
});

test("prints only applicable migrations for recent installations", (t) => {
  for (const [installedVersion, expectedMigrations] of [
    ["0.14.0", ["0.18.0", "0.17.2", "0.17.1", "0.17.0", "0.16.0", "0.15.0"]],
    ["0.15.0", ["0.18.0", "0.17.2", "0.17.1", "0.17.0", "0.16.0"]],
    ["0.16.0", ["0.18.0", "0.17.2", "0.17.1", "0.17.0"]],
    ["0.17.0", ["0.18.0", "0.17.2", "0.17.1"]],
    ["0.17.1", ["0.18.0", "0.17.2"]],
    ["0.17.2", ["0.18.0"]]
  ]) {
    const cwd = project(t, installedVersion);
    const before = snapshot(cwd);
    const output = run(["update", "--cwd", cwd]);

    assert.deepEqual(migrationVersions(output), expectedMigrations);
    assert.deepEqual(snapshot(cwd), before);
  }
});

test("every upgrade path preserves existing HTML, templates, and custom instructions", (t) => {
  const installedVersions = [undefined, "unversioned", ...versions.versions.map(({ version }) => version)];

  for (const installedVersion of installedVersions) {
    const cwd = project(t, installedVersion);
    const skillDir = path.join(cwd, ".agents", "skills", "spec-library");
    for (const [relative, contents] of [
      ["specs/checkout/business.html", '<!doctype html><title>Approved contract</title><section id="scope">Keep this exact text.</section>\n'],
      ["specs/checkout/technical.html", '<!doctype html><a href="business.html#scope">Existing scope</a>\n'],
      ["specs/checkout/plan.html", '<!doctype html><p>Implemented and verified.</p>\n'],
      ["decisions/design.html", '<!doctype html><article id="DES-001">Approved decision</article>\n'],
      ["templates/business-spec.html", '<!doctype html><style>body { color: purple; }</style><p>Legacy format</p>\n'],
      ["references/local-policy.md", "# Custom policy\nPreserve these instructions.\n"]
    ]) {
      const target = path.join(skillDir, relative);
      fs.mkdirSync(path.dirname(target), { recursive: true });
      fs.writeFileSync(target, contents);
    }
    const before = snapshot(cwd);
    const output = run(["update", "--cwd", cwd]);

    assert.deepEqual(snapshot(cwd), before, `${installedVersion ?? "missing"} installation was modified`);
    const currentRules = output.slice(output.indexOf("## Rules"));
    assertAuthoringContract(currentRules);
    assert.match(currentRules, /unchanged during (?:this )?(?:instruction )?migration/);
    assert.match(currentRules, /next intentional spec content update/);
    assert.match(currentRules, /Preserve customized, ambiguously owned, or still-linked files as inactive history/);
    assert.match(currentRules, /Delete only unmodified generated templates with no remaining document references/);
    assert.match(output, /The current rules below take precedence over historical migration steps/);
  }
});

test("update requires an explicit legacy cleanup choice and preserves data by default", (t) => {
  const output = run(["update", "--cwd", project(t, versions.currentSchemaVersion)]);

  assert.match(output, /Leave old records untouched \(Recommended\)/);
  assert.match(output, /Delete old records/);
  assert.match(output, /preserve every existing record and ledger byte-for-byte/);
  assert.match(output, /delete only the identified feature `execution\.json` files and `data\/executions\.jsonl` after the user explicitly selects deletion/);
  assert.match(output, /Silence or an unanswered question is not deletion approval/);
  assert.match(output, /If no legacy data exists, skip the question/);
  assert.match(output, /On a current-version installation, offer this choice when retained legacy data still exists/);
  assert.match(output, /Do not delete a whole feature folder/);
  assert.match(output, /Do not follow symlinks or delete targets outside the inventoried library paths/);
  assert.match(output, /remove dangling references to the deleted files/);
  assert.match(output, /Preserve historical prose and existing valid archival links.*on the leave path/);
});

test("current removal rules override historical tracking and evaluation migrations", (t) => {
  const output = run(["update", "--cwd", project(t)]);

  assert.ok(migrationVersions(output).includes("0.13.0"));
  const precedence = output.indexOf("The current rules below take precedence over historical migration steps");
  assert.ok(precedence >= 0 && precedence < output.indexOf("## Simplest SDD Schema Versions"));
  assert.match(output, /every older instruction to create, upgrade, record, validate, export, or rebuild execution data or to request human feedback/);
  assert.match(output, /Skip those older steps entirely, including for missing or unversioned installations/);
  assert.match(output, /never create intermediate records or ratings only to remove them later/);
  assert.match(output, /Do not create or maintain execution records.*or ask for execution ratings or qualification/);
});

test("omits migration history for a current installation", (t) => {
  const output = run(["update", "--cwd", project(t, versions.currentSchemaVersion)]);

  assert.match(output, /installed schema is current; no migration history is needed/);
  assert.deepEqual(migrationVersions(output), []);
});

test("does not recommend downgrading a newer installation", (t) => {
  const output = run(["update", "--cwd", project(t, "99.0.0")]);

  assert.match(output, /Do not downgrade it/);
  assert.match(output, /report it and stop without changing files or offering cleanup/);
  assert.deepEqual(migrationVersions(output), []);
});

test("legacy detection is read-only and does not parse records or follow directory symlinks", (t) => {
  const cwd = project(t, "0.14.0");
  const skillDir = path.join(cwd, ".agents", "skills", "spec-library");
  const specsDir = path.join(skillDir, "specs");
  for (const [relative, contents] of [
    ["specs/first/execution.json", "old or incomplete record\n"],
    ["specs/group/second/execution.json", "{not valid json"],
    ["specs/first/business.html", "<!doctype html><title>Keep this spec</title>\n"],
    ["data/executions.jsonl", '{"legacy":true}\ninvalid old line\n'],
    ["data/unrelated.json", '{"keep":true}\n']
  ]) {
    const target = path.join(skillDir, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, contents);
  }
  fs.symlinkSync(specsDir, path.join(specsDir, "loop"));
  const before = snapshot(cwd);

  for (const command of ["init", "update", "remove"]) {
    const output = run([command, "--cwd", cwd]);
    if (command !== "init") {
      assert.match(output, /legacy execution ledger: file/);
      assert.match(output, /legacy feature execution records: 2/);
    }
    assert.doesNotMatch(output, /old or incomplete record|not valid json|invalid old line/);
    assert.deepEqual(snapshot(cwd), before);
  }
});

test("reports absent legacy records without creating any project files", (t) => {
  const cwd = project(t);
  for (const command of ["update", "remove"]) {
    const output = run([command, "--cwd", cwd]);
    assert.match(output, /legacy execution ledger: missing/);
    assert.match(output, /legacy feature execution records: 0/);
    assert.deepEqual(fs.readdirSync(cwd), []);
  }
});

test("prints conservative removal instructions", () => {
  const output = run(["remove"]);

  assert.match(output, /Removal Instructions/);
  assert.match(output, /Never delete user-authored specs or decisions by default/);
  assert.match(output, /Treat removal as the active phase/);
  assert.match(output, /execution\.json.*user-owned execution history/);
});

test("does not ship the retired execution helpers, schema, or example", () => {
  for (const relative of [
    "lib/execution-data.mjs",
    "lib/codex-usage.mjs",
    "schema/execution.schema.json",
    "examples/execution-record.json"
  ]) {
    assert.equal(fs.existsSync(path.join(root, relative)), false, relative);
  }
});

function assertAuthoringContract(output) {
  assert.match(output, /(?:model (?:choose|design)|model-designed)/i);
  assert.match(output, /compact.*interactive|interactive[\s\S]*?compact/);
  assert.match(output, /Do not (?:copy an HTML template or )?prescribe a layout, palette, CSS class set/);
  assert.match(output, /suggestions[\s\S]*?separate from accepted requirements/);
  assert.match(output, /diagrams and images wherever they explain/);
  assert.match(output, /embedded (?:CSS and[^\n]*?embedded )?JavaScript|small embedded JavaScript/);
  assert.match(output, /complete reading path (?:when|with) JavaScript (?:is )?disabled/);
  assert.match(output, /keyboard access, visible focus/);
  assert.match(output, /design-taste-frontend/);
  assert.match(output, /i-have-adhd/);
  assert.match(output, /Use ASD-STE100 as a complement for structured content, not a document-wide controlled-language requirement/);
  assert.match(output, /structured lists, action steps, checklists, and acceptance criteria/);
  assert.match(output, /last approved and implemented content as the review baseline/);
  assert.match(output, /Show removals in a[^\n]*?(?:removal note|before\/after)/);
  assert.match(output, /Partial or failed implementation and incomplete verification/);
  assert.match(output, /Remove revision highlighting only when the same change is approved or already authorized under the workflow, implemented, and verified/);
  assert.match(output, /Existing-owner maintenance does not gain a new approval gate/);
  assert.match(output, /Keep other pending highlights intact/);
  assert.match(output, /(?:rejected|Rejected) or withdrawn/);
  assert.match(output, /(?:must leave|Leave) existing specs, plans, and decisions unchanged/);
  assert.match(output, /When a spec next needs an intentional content update/);
  assert.match(output, /`Document relationships` section[^\n]*?(?:`Role`|Role)[^\n]*?(?:`Document`|Document)[^\n]*?(?:`Why it matters`|Why it matters)/);
}

function project(t, installedVersion) {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "simplest-sdd-test-"));
  t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  if (installedVersion) {
    const skillDir = path.join(cwd, ".agents", "skills", "spec-library");
    fs.mkdirSync(skillDir, { recursive: true });
    const marker = installedVersion === "unversioned" ? "" : `<!-- simplest-sdd-schema-version: ${installedVersion} -->\n`;
    fs.writeFileSync(path.join(skillDir, "SKILL.md"),
      `---\nname: spec-library\ndescription: Test skill.\n---\n\n${marker}`);
  }
  return cwd;
}

function snapshot(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name)).map((entry) => {
    const target = path.join(directory, entry.name);
    if (entry.isSymbolicLink()) return [entry.name, "symlink", fs.readlinkSync(target)];
    if (entry.isDirectory()) return [entry.name, "directory", snapshot(target)];
    return [entry.name, "file", fs.readFileSync(target)];
  });
}

function migrationVersions(output) {
  return [...output.matchAll(/^### (\d+\.\d+\.\d+) - /gm)].map((match) => match[1]);
}

function run(args) {
  return execFileSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8" });
}

function invoke(args) {
  return spawnSync(process.execPath, [cli, ...args], { cwd: root, encoding: "utf8" });
}
