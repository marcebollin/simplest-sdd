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

For an unversioned install moving to `{{schemaVersion}}`, migrate this way:

1. Preserve unique `CLAUDE.md` content by moving it into `AGENTS.md` under a clearly labeled Claude-imported section when needed.
2. Replace any `CLAUDE.md -> AGENTS.md` symlink with a regular `CLAUDE.md` file containing `@AGENTS.md`.
3. Add this marker immediately after the `SKILL.md` frontmatter:

   ```markdown
   <!-- simplest-sdd-schema-version: {{schemaVersion}} -->
   ```

4. Keep `.agents/skills/spec-library` as the canonical skill.
5. Keep or create `.claude/skills/spec-library -> ../../.agents/skills/spec-library`.
6. Convert generated spec-library templates from Markdown to clean static HTML:
   - `business-spec.md` to `business-spec.html`;
   - `technical-spec.md` to `technical-spec.html`;
   - `plan.md` to `plan.html`;
   - `decision-template.md` to `decision-template.html`.
7. Convert generated indexes from Markdown to static HTML:
   - `specs/INDEX.md` to `specs/index.html`;
   - `decisions/INDEX.md` to `decisions/index.html`.
8. Create `.agents/skills/spec-library/index.html` as the root library index if it is missing. Link to all internal spec-library documentation, keep an accessible latest-documents section ordered by last-updated date, and keep direct links internal.
9. For existing feature folders, migrate `business.md`, `technical.md`, and `plan.md` to `business.html`, `technical.html`, and `plan.html` only after preserving all content. Keep the old Markdown file if there is any uncertainty about conversion fidelity.
10. For existing decisions, migrate generated decision `.md` files to `.html` only after preserving all content. Keep the old Markdown file if ownership or conversion fidelity is unclear.
11. Add the HTML artifact style contract to `SKILL.md`: standalone semantic HTML, embedded readable CSS, visible `:focus-visible` outlines, no external assets, and optional inline SVG/tables/simple charts only when they clarify technical or decision content.
12. Add the root library index contract to `SKILL.md`: all internal docs represented, latest by last-updated date, static link-based catalog, optional small filtering/search, and close-out maintenance.
13. Update stale instructions that say `CLAUDE.md` should be a symlink, generated artifacts should be Markdown, or only focused spec and decision indexes need maintenance.

For a 0.4.0 install moving to `{{schemaVersion}}`, migrate this way:

1. Discover the repository's resolved testing discipline: an explicit testing instruction in `AGENTS.md`/`CLAUDE.md`/another rules file/existing skill, a `tdd` skill already installed under `.agents/skills/` or `.claude/skills/`, the repository's existing test setup, or none of the above. Do not reinstall a test-first skill if one is already present.
2. If a `tdd` skill was installed only because 0.4.0 asked for it and the repository has another explicit testing instruction, keep both but let the existing instruction take precedence; record the resolved discipline in `SKILL.md`.
3. Update `.agents/skills/spec-library/SKILL.md` so the implement-and-verify step references the resolved testing discipline by name (test-first skill, other defined testing approach, or intentional test-free stance) instead of always naming the `tdd` skill.
4. Update `AGENTS.md` so the spec-driven workflow note says approved implementations follow the resolved testing discipline, not just the `tdd` skill.
5. If the repo has no discoverable testing discipline, leave the skill test-discipline-agnostic and, when the user next runs the workflow, offer the same concise choice documented in `prompts/init.md` (install `tdd` via `npx skills add https://github.com/mattpocock/skills --skill tdd -y`, keep test-free, or use a named approach). Do not install a skill unprompted during update.

For future version jumps, follow the matching changelog migration steps and adapt them to the repository after inspection.

## 4. Validate

Before finishing:

- confirm `CLAUDE.md` is a regular file containing `@AGENTS.md`;
- confirm `.agents/skills/spec-library/SKILL.md` has the latest schema marker;
- confirm `SKILL.md` records the resolved testing discipline by name and its implement-and-verify step follows that discipline (not a hardcoded `tdd` requirement);
- confirm `.claude/skills/spec-library` resolves to `../../.agents/skills/spec-library`;
- confirm the root library index, current templates, supporting indexes, specs, plans, and decisions are HTML or that old Markdown copies were intentionally preserved to avoid data loss;
- confirm no specs, decisions, unrelated skills, or existing instructions were lost;
- search for stale references to the previous simplest-sdd behavior;
- run the repository's relevant formatting or documentation checks;
- report what changed, what was already current, and any assumptions.

Do not commit unless the user explicitly asks.
