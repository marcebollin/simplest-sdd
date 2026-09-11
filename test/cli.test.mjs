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

test("prints init instructions with the existing discovery and approval workflow", () => {
  const output = run(["init"]);

  assert.match(output, /Simplest SDD Init Instructions/);
  assert.match(output, /@AGENTS\.md/);
  assert.ok(output.includes(`simplest-sdd-schema-version: ${versions.currentSchemaVersion}`));
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
  assert.match(output, /No independent technical approval required/);
  assert.match(output, /Creating no new spec does not imply technical approval/);
  assert.match(output, /Every discovery message.*final result must expose.*exact path or anchor/s);
  assert.match(output, /Inspect And Discover The Testing Discipline/);
  assert.match(output, /resolved testing discipline/);
  assert.match(output, /npx skills add https:\/\/github\.com\/mattpocock\/skills --skill tdd -y/);
  assert.match(output, /always offer same-session/i);
  assert.match(output, /delegation confidence/);
  assert.match(output, /explicit user selection/);
  assert.match(output, /efficient-worker/);
});

test("retains HTML documents, durable decisions, and relationship guidance", () => {
  const output = run(["init"]);

  assert.match(output, /\.agents\/skills\/spec-library\/index\.html/);
  assert.match(output, /business\.html/);
  assert.match(output, /:focus-visible/);
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
  assert.match(output, /wait for explicit approval before implementation/);
  assert.match(output, /resolved testing discipline/);
  assert.match(output, /always offer same-session/i);
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
  const history = migrationVersions(output);
  assert.equal(history[0], versions.currentSchemaVersion);
  assert.ok(history.includes("0.3.0"));
  assert.ok(history.includes("0.14.0"));
  assert.ok(!history.includes("0.2.0"));
  assert.deepEqual(snapshot(cwd), before);
});

test("prints only applicable migrations for recent installations", (t) => {
  for (const [installedVersion, expectedMigrations] of [
    ["0.14.0", ["0.16.0", "0.15.0"]],
    ["0.15.0", ["0.16.0"]]
  ]) {
    const cwd = project(t, installedVersion);
    const before = snapshot(cwd);
    const output = run(["update", "--cwd", cwd]);

    assert.deepEqual(migrationVersions(output), expectedMigrations);
    assert.deepEqual(snapshot(cwd), before);
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
  assert.match(output, /overrides every older instruction to create, upgrade, record, validate, export, or rebuild execution data or to request human feedback/);
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

function project(t, installedVersion) {
  const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "simplest-sdd-test-"));
  t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));
  if (installedVersion) {
    const skillDir = path.join(cwd, ".agents", "skills", "spec-library");
    fs.mkdirSync(skillDir, { recursive: true });
    fs.writeFileSync(path.join(skillDir, "SKILL.md"),
      `---\nname: spec-library\ndescription: Test skill.\n---\n\n<!-- simplest-sdd-schema-version: ${installedVersion} -->\n`);
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
