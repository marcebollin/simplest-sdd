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
  assert.ok(versions.versions.some(({ version }) => version === versions.currentSchemaVersion));
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

test("prints the init template with the shared contract and current schema version", () => {
  const output = run(["init"]);

  assert.equal(output, rendered("init").trimEnd() + "\n");
  assert.ok(output.includes(renderedContract()));
  assert.doesNotMatch(output, /\{\{[a-zA-Z]+\}\}/);
  assert.doesNotMatch(output, /Detected Local State|Simplest SDD Schema Versions/);
});

test("update delivers the same contract as init, after the detected state and history", (t) => {
  const output = run(["update", "--cwd", project(t, versions.currentSchemaVersion)]);
  const rules = rendered("update");

  assert.ok(output.endsWith(rules.slice(rules.indexOf("## Rules")).trimEnd() + "\n"));
  assert.ok(output.includes(renderedContract()));
  assert.ok(output.indexOf("## Detected Local State") < output.indexOf("## Simplest SDD Schema Versions"));
  assert.ok(output.indexOf("## Simplest SDD Schema Versions") < output.indexOf("## Rules"));
  assert.doesNotMatch(output, /\{\{[a-zA-Z]+\}\}/);
});

test("the installed skill routes ordinary conversation to one decision file and its local practice", () => {
  const contract = renderedContract();
  const skill = contract.match(/```markdown\n(---\n[\s\S]*?)\n```/)[1];

  assert.match(skill, /^---\nname: spec-library\ndescription: [^\n]*conversation[^\n]*\n---/);
  assert.ok(skill.includes(`<!-- simplest-sdd-schema-version: ${versions.currentSchemaVersion} -->`));
  assert.match(skill, /DECISIONS\.md/);
  assert.match(skill, /^## Project practice$/m);
  assert.doesNotMatch(skill, /index\.html|decisions\/<area>|references\/(decisions|testing)\.md/);
  for (const status of ["proposed", "approved", "active", "superseded", "retired"]) {
    assert.ok(skill.includes(`\`${status}\``), status);
  }
});

test("init and the installed workflow allow clear requests to proceed without a question quota", () => {
  for (const output of [run(["init"]), renderedContract()]) {
    assert.match(output, /no minimum/i);
    assert.match(output, /clear request can proceed immediately/i);
    assert.doesNotMatch(output, /at least (?:five|eight|\d+) questions|five-question|eight-question/i);
  }
});

test("install and update both supply reuse guidance, TDD and the opt-in modes", (t) => {
  for (const command of ["init", "update"]) {
    const output = run([command, "--cwd", project(t)]);
    const guidance = output.slice(output.indexOf("## Product decisions and reuse"), output.indexOf("### Library Layout"));
    assert.match(guidance, /Extend before you build/);
    assert.match(guidance, /existing users/);
    assert.match(output, /failing behavioral test, make it pass, then refactor/);
    assert.match(output, /intentional test-free/);
    assert.match(output, /invocation policy/);
    for (const request of ["Grill me.", "Why does it work this way?", "Review reuse."]) {
      assert.ok(output.includes(`**"${request}"**`), request);
    }
  }
});

test("fresh init is read-only and prescribes no legacy artifacts", (t) => {
  const cwd = project(t);
  const output = run(["init", "--cwd", cwd]);

  assert.doesNotMatch(output, /execution\.json|executions\.jsonl|How would you rate|legacy/);
  assert.match(output, /run `npx simplest-sdd@latest update` instead/);
  assert.deepEqual(fs.readdirSync(cwd), []);
});

test("prints the detected state of a legacy library without modifying it", (t) => {
  const cwd = project(t, "0.18.0");
  const skillDir = path.join(cwd, ".agents", "skills", "spec-library");
  fs.writeFileSync(path.join(cwd, "AGENTS.md"), "# Agent guide\n");
  fs.writeFileSync(path.join(cwd, "CLAUDE.md"), "@AGENTS.md\n");
  writeFiles(skillDir, [
    ["index.html", "<!doctype html><title>Spec Library</title>\n"],
    ["specs/index.html", "<!doctype html>\n"],
    ["specs/checkout/business.html", "<!doctype html>\n"],
    ["specs/checkout/technical.html", "<!doctype html>\n"],
    ["specs/checkout/plan.html", "<!doctype html>\n"],
    ["specs/refunds/business.html", "<!doctype html>\n"],
    ["decisions/index.html", "<!doctype html>\n"],
    ["decisions/design.html", "<!doctype html>\n"],
    ["decisions/architecture.html", "<!doctype html>\n"],
    ["references/discovery.md", "# Discovery\n"],
    ["references/execution.md", "# Execution\n"],
    ["templates/plan.html", "<!doctype html>\n"]
  ]);
  const before = snapshot(cwd);

  const output = run(["update", `--cwd=${cwd}`]);

  assert.match(output, /regular file importing @AGENTS\.md/);
  assert.match(output, /found \(0\.18\.0\)/);
  assert.match(output, /decision map \(`index\.html`\): file/);
  assert.match(output, /documents in `decisions\/`: 2/);
  assert.match(output, /legacy feature documents in `specs\/`: 2 business, 1 technical, 1 plan/);
  assert.match(output, /legacy indexes: `specs\/index\.html`, `decisions\/index\.html`/);
  assert.match(output, /legacy references: `references\/discovery\.md`, `references\/execution\.md`/);
  assert.match(output, /legacy templates: directory/);
  assert.deepEqual(snapshot(cwd), before);
});

test("inventories a physical Claude-only installation with unversioned Markdown sources", (t) => {
  const cwd = project(t);
  const library = path.join(cwd, ".claude", "skills", "spec-library");
  writeFiles(library, [
    ["SKILL.md", "---\nname: spec-library\ndescription: Project rules.\n---\n"],
    ["specs/INDEX.md", "# Features\n"],
    ["decisions/INDEX.md", "# Decisions\n"],
    ["decisions/001-exports.md", "# Exports keep visible order\n"],
    ["specs/saved/business.md", "Every export includes all matching items.\n"],
    ["specs/saved/technical.md", "Use a buffered writer.\n"],
    ["specs/saved/plan.md", "Update the exporter.\n"],
    ["specs/discovery/business.html", "<article>Export every result type.</article>"],
    ["archive/specs/retired/plan.md", "Already retired.\n"]
  ]);
  const before = snapshot(cwd);
  const output = run(["update", "--cwd", cwd]);

  assert.match(output, /\.claude\/skills\/spec-library\/SKILL\.md`: found \(unversioned\)/);
  assert.match(output, /documents in `decisions\/`: 1/);
  assert.match(output, /legacy feature documents in `specs\/`: 2 business, 1 technical, 1 plan/);
  assert.match(output, /legacy indexes: `specs\/INDEX\.md`, `decisions\/INDEX\.md`/);
  assert.deepEqual(snapshot(cwd), before);
});

test("update sees both sides of a partial 0.19 conversion and skips recovery copies", (t) => {
  const cwd = project(t, "0.19.0");
  const library = path.join(cwd, ".agents", "skills", "spec-library");
  writeFiles(library, [
    ["DECISIONS.md", "# Product decisions\n\n### DES-001\nExisting record.\n"],
    ["index.html", '<a href="decisions/lists.html#DES-001">Shared card</a>'],
    ["decisions/lists.html", '<article id="DES-001" data-status="active">Shared card</article>'],
    ["references/decisions.md", "# Decision records\n"],
    ["references/testing.md", "Use TDD with npm test.\n"],
    ["archive/decisions/old.html", "Historical only.\n"]
  ]);
  writeFiles(cwd, [[".agents/archive/simplest-sdd/decisions/other.html", "Another original.\n"]]);
  const before = snapshot(cwd);
  const output = run(["update", "--cwd", cwd]);
  assert.match(output, /decision file `DECISIONS\.md`: file/);
  assert.match(output, /legacy decision map \(`index\.html`\): file/);
  assert.match(output, /documents in `decisions\/`: 1/);
  assert.match(output, /legacy references: `references\/decisions\.md`, `references\/testing\.md`/);
  assert.deepEqual(migrationVersions(output), [versions.currentSchemaVersion]);
  assert.deepEqual(snapshot(cwd), before);
});

test("every older installation receives only the self-contained baseline migration", (t) => {
  const baselineIndex = versions.versions.findIndex(entry => entry.version === versions.migrationBaseline);
  assert.ok(baselineIndex >= 0);
  const expectedVersions = versions.versions.slice(0, baselineIndex + 1).map(entry => entry.version);
  const previousVersions = versions.versions.slice(baselineIndex + 1);
  assert.ok(previousVersions.some(entry => entry.version === "0.18.0"));
  for (const installedVersion of [undefined, "unversioned", ...previousVersions.map(entry => entry.version)]) {
    const cwd = project(t, installedVersion);
    writeFiles(path.join(cwd, ".agents", "skills", "spec-library"), [
      ["specs/checkout/business.html", '<!doctype html><section id="scope">Keep this exact text.</section>\n'],
      ["decisions/design.html", '<!doctype html><article id="DES-001">Approved decision</article>\n'],
      ["references/local-policy.md", "# Custom policy\nPreserve these instructions.\n"]
    ]);
    const before = snapshot(cwd);
    const output = run(["update", "--cwd", cwd]);

    assert.deepEqual(migrationVersions(output), expectedVersions, installedVersion ?? "missing");
    assert.match(output, /self-contained baseline/);
    assert.deepEqual(snapshot(cwd), before, `${installedVersion ?? "missing"} installation was modified`);
  }
});

test("the migration covers the original formats and protects decisions and uncommitted work", (t) => {
  const output = run(["update", "--cwd", project(t, "0.18.0")]);
  for (const source of ["business.html", "business.md", "technical.html", "plan.html", "archive/"]) {
    assert.ok(output.includes(source), source);
  }
  assert.match(output, /open questions, suggestions and rejected alternatives out of the decision set/i);
  assert.match(output, /Preserve existing IDs, attribution, reasons and scope/);
  assert.match(output, /dirty, staged, untracked or non-Git original/);
  assert.match(output, /Keep the Git index intact/);
  assert.ok(output.includes("DECISIONS.md#"));
  assert.ok(output.includes(".agents/archive/simplest-sdd/"));
});

test("omits migration history for a current installation", (t) => {
  const output = run(["update", "--cwd", project(t, versions.currentSchemaVersion)]);

  assert.match(output, /installed schema is current; no migration history is needed/);
  assert.match(output, /Do not rewrite compliant files/);
  assert.doesNotMatch(output, /codex-usage|execution\.json|executions\.jsonl/);
  assert.deepEqual(migrationVersions(output), []);
});

test("update recognizes a previously archived report without an active skill", (t) => {
  const cwd = project(t);
  writeFiles(cwd, [[".agents/archive/simplest-sdd/staged/data/executions.jsonl", "original, unread\n"]]);
  const before = snapshot(cwd);
  const output = run(["update", "--cwd", cwd]);
  assert.ok(output.includes("data/executions.jsonl"));
  assert.match(output, /leave the skill inactive/);
  assert.doesNotMatch(output, /original, unread/);
  assert.deepEqual(snapshot(cwd), before);
});

test("does not recommend downgrading a newer installation", (t) => {
  const output = run(["update", "--cwd", project(t, "99.0.0")]);

  assert.match(output, /Do not downgrade it/);
  assert.match(output, /stop and report the version/);
  assert.deepEqual(migrationVersions(output), []);
});

test("updates identify retired files even at the current marker without reading run data", (t) => {
  const cwd = project(t, versions.currentSchemaVersion);
  const skillDir = path.join(cwd, ".agents", "skills", "spec-library");
  const specsDir = path.join(skillDir, "specs");
  writeFiles(skillDir, [
    ["specs/first/execution.json", "old or incomplete record\n"],
    ["specs/group/second/execution.json", "{not valid json"],
    ["specs/first/business.html", "<!doctype html><title>Keep this spec</title>\n"],
    ["data/executions.jsonl", '{"legacy":true}\ninvalid old line\n'],
    ["data/unrelated.json", '{"keep":true}\n']
  ]);
  fs.symlinkSync(specsDir, path.join(specsDir, "loop"));
  const before = snapshot(cwd);

  for (const command of ["init", "update", "remove"]) {
    const output = run([command, "--cwd", cwd]);
    if (command === "update") {
      for (const legacy of ["specs/**/execution.json", "data/executions.jsonl", "templates/execution-template.json", "schema/execution.schema.json", "examples/execution-record.json"]) {
        assert.ok(output.includes(legacy), legacy);
      }
      assert.match(output, /Delete .*generated run reports/);
      assert.match(output, /including .*framework recovery copies/);
      assert.match(output, /Remove .*rating requests.*usage collection/);
      assert.doesNotMatch(output, /historical `data\/executions\.jsonl`.*to that recovery location/);
    } else {
      assert.doesNotMatch(output, /execution\.json|executions\.jsonl|legacy execution ledger|feature execution records/);
    }
    if (command !== "init") {
      assert.match(output, /legacy feature documents in `specs\/`: 1 business, 0 technical, 0 plan/);
    }
    assert.doesNotMatch(output, /old or incomplete record|not valid json|invalid old line/);
    assert.deepEqual(snapshot(cwd), before);
  }
});

test("reports an absent library without creating any project files", (t) => {
  const cwd = project(t);
  for (const command of ["update", "remove"]) {
    const output = run([command, "--cwd", cwd]);
    assert.match(output, /decision map \(`index\.html`\): missing/);
    assert.doesNotMatch(output, /legacy execution ledger|feature execution records|execution\.json|executions\.jsonl/);
    assert.deepEqual(fs.readdirSync(cwd), []);
  }
  assert.match(run(["update", "--cwd", cwd]), /If neither .* contains a library or its documents, direct the user to `npx simplest-sdd@latest init`/);
});

test("prints conservative removal instructions", () => {
  const output = run(["remove"]);

  assert.match(output, /Removal Instructions/);
  assert.match(output, /It does not delete the project's recorded decisions/);
  assert.match(output, /Delete one only after showing the exact files and receiving explicit confirmation/);
  assert.ok(output.includes("Preserve `DECISIONS.md`"));
  assert.ok(output.includes("Project practice"));
  assert.match(output, /## Product decisions and reuse`, or the older `## Spec-driven workflow`/);
  assert.doesNotMatch(output, /\{\{[a-zA-Z]+\}\}/);
});

test("ships the shared contract and none of the retired helpers", () => {
  assert.ok(packageJson.files.includes("prompts"));
  assert.ok(fs.existsSync(path.join(root, "prompts", "contract.md")));
  for (const relative of [
    "lib/execution-data.mjs",
    "lib/codex-usage.mjs",
    "schema/execution.schema.json",
    "examples/execution-record.json"
  ]) {
    assert.equal(fs.existsSync(path.join(root, relative)), false, relative);
  }
});

test("published instructions and release notes omit the retired reporting workflow", () => {
  const sources = [
    "README.md", "PROMPT.md", "schema/CHANGELOG.md", "schema/versions.json",
    "src/pages/about.astro", "src/pages/how.astro", "prompts/contract.md",
    ...["init", "update", "remove"].map(command => `prompts/${command}.md`)
  ];
  const oldWorkflow = /simplest-sdd(?:@latest)? analytics\b|codex-usage|humanEvaluations|execution\.json|executions\.jsonl|execution (?:rating|analytics)|analytics record/i;
  for (const source of sources) {
    assert.doesNotMatch(fs.readFileSync(path.join(root, source), "utf8"), oldWorkflow, source);
  }
});

function rendered(command) {
  return fs.readFileSync(path.join(root, "prompts", `${command}.md`), "utf8")
    .replace("{{contract}}", () => fs.readFileSync(path.join(root, "prompts", "contract.md"), "utf8").trimEnd())
    .replaceAll("{{schemaVersion}}", versions.currentSchemaVersion)
    .replaceAll("{{packageVersion}}", packageJson.version);
}

function renderedContract() {
  return fs.readFileSync(path.join(root, "prompts", "contract.md"), "utf8").trimEnd()
    .replaceAll("{{schemaVersion}}", versions.currentSchemaVersion);
}

function writeFiles(directory, files) {
  for (const [relative, contents] of files) {
    const target = path.join(directory, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.writeFileSync(target, contents);
  }
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
