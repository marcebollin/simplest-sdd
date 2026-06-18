import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cli = path.join(root, "bin", "simplest-sdd.mjs");

test("prints help", () => {
  const output = run(["--help"]);

  assert.match(output, /npx simplest-sdd@latest init/);
  assert.match(output, /does not edit files directly/);
});

test("prints init instructions", () => {
  const output = run(["init"]);

  assert.match(output, /Simplest SDD Init Instructions/);
  assert.match(output, /@AGENTS\.md/);
  assert.match(output, /simplest-sdd-schema-version: 0\.2\.0/);
  assert.match(output, /\.agents\/skills\/spec-library\/index\.html/);
  assert.match(output, /business\.html/);
  assert.match(output, /:focus-visible/);
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
  assert.match(output, /regular file importing @AGENTS\.md/);
  assert.match(output, /found \(0\.2\.0\)/);
  assert.match(output, /library index: HTML index found/);
});

test("prints conservative removal instructions", () => {
  const output = run(["remove"]);

  assert.match(output, /Removal Instructions/);
  assert.match(output, /Never delete user-authored specs or decisions by default/);
});

function run(args) {
  return execFileSync(process.execPath, [cli, ...args], {
    cwd: root,
    encoding: "utf8"
  });
}
