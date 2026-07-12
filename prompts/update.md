# Simplest SDD Update Instructions

You are updating an existing simplest-sdd setup to schema version `{{schemaVersion}}`.

The `npx simplest-sdd` CLI prints instructions only. It has not modified files for you. Treat the changelog below as migration guidance, not as deterministic code to apply blindly.

{{detectedState}}

{{versionHistory}}

## Rules

- Inspect the repository before editing.
- Preserve all existing agent instructions, specs, decisions, skills, rules, commands, and project conventions.
- Treat `.agents/skills/spec-library/SKILL.md` as the installed simplest-sdd schema source of truth.
- If the skill has no `simplest-sdd-schema-version` marker, treat it as an unversioned install.
- Use `AGENTS.md` as the canonical repository instruction file.
- Use `CLAUDE.md` as a regular Claude import file containing `@AGENTS.md`, not as a symlink.
- Keep `.agents/skills/spec-library` as the canonical skill directory.
- Keep `.claude/skills/spec-library -> ../../.agents/skills/spec-library` for Claude skill compatibility.
- Use clean static HTML for the root library index, specs, decisions, plans, supporting indexes, and templates.
- Never delete user-authored specs or decisions during update.
- Preserve an existing explicit delegation policy. Otherwise let the planner recommend delegation, but require explicit user approval of the proposed topology and assignments before spawning subagents.
- Keep recommendations model-agnostic through capability profiles and effort; record actual models in execution data after runs.
- Treat this migration as the active phase. After migrating and validating, stop before feature work, commits, pull requests, deployment, monitoring, or review handling unless the user explicitly requested it.

## 1. Inspect Current Installation

Read:

- `AGENTS.md`;
- `CLAUDE.md`, including symlink targets if it is currently a symlink;
- `.agents/skills/spec-library/SKILL.md`;
- `.agents/skills/spec-library/index.html` when present;
- the installed skills under `.agents/skills/` and `.claude/skills/`, the `AGENTS.md`/`CLAUDE.md` instructions, and the repository test setup, to discover the resolved testing discipline (test-first skill, other defined testing approach, or intentional test-free stance);
- `.agents/skills/spec-library/specs/index.html` or older `.agents/skills/spec-library/specs/INDEX.md`;
- existing spec folders, including older Markdown artifacts;
- `.agents/skills/spec-library/decisions/index.html` or older `.agents/skills/spec-library/decisions/INDEX.md`;
- existing decisions, including older Markdown artifacts;
- `.agents/skills/spec-library/templates/`;
- `.agents/skills/spec-library/data/executions.jsonl` and every feature `execution.json` when present;
- `.claude/skills/spec-library` and its target if present.

Identify the installed schema version from `SKILL.md`:

```markdown
<!-- simplest-sdd-schema-version: x.y.z -->
```

If the marker is missing but the workflow exists, call the current installation `unversioned`.

## 2. Compare Against The Changelog

Use the version history above to identify the changes between the installed version and `{{schemaVersion}}`. For each version jump:

- list the intended behavior change;
- list the local files likely affected;
- note any existing local content that must be preserved;
- decide whether the change is already present, missing, or partially present.

If the repository has local customizations that conflict with the latest guidance, preserve the local behavior and ask the user before changing it.

## 3. Apply The Migration Conservatively

Apply only the migration guidance printed above, from the oldest relevant version to the newest. The CLI has already omitted schema versions that are not newer than the detected installation.

For an unversioned or missing installation, the printed history includes the full baseline. Reconstruct the current structure conservatively from those steps, preserve unique content, and add the latest schema marker only after the current behavior is present.

If no migration versions are printed because the installed schema is current, validate it and report any drift; do not rewrite files merely to produce a change. Never downgrade an installation whose marker is newer than `{{schemaVersion}}`.

## 4. Validate

Before finishing:

- confirm `CLAUDE.md` is a regular file containing `@AGENTS.md`;
- confirm `.agents/skills/spec-library/SKILL.md` has the latest schema marker;
- confirm `SKILL.md` records the resolved testing discipline by name and its implement-and-verify step follows that discipline (not a hardcoded `tdd` requirement);
- confirm every feature keeps one integrated `plan.html` with detailed classified tasks instead of independent task-plan files;
- confirm delegation recommendations require an explicit user strategy selection, same-session is always offered, and actual runtime models are recorded separately from capability recommendations;
- confirm every new feature has a valid `execution.json`; run `npx simplest-sdd@latest analytics` and rebuild the committed JSONL ledger when records exist;
- confirm `.claude/skills/spec-library` resolves to `../../.agents/skills/spec-library`;
- confirm the root library index, current templates, supporting indexes, specs, plans, and decisions are HTML or that old Markdown copies were intentionally preserved to avoid data loss;
- confirm no specs, decisions, unrelated skills, or existing instructions were lost;
- search for stale references to the previous simplest-sdd behavior;
- run the repository's relevant formatting or documentation checks;
- report what changed, what was already current, and any assumptions.

Stop after reporting the validated migration. Do not begin feature or delivery work unless it was explicitly requested in the active prompt.

Do not commit unless the user explicitly asks.
