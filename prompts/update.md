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
- Use clean static HTML for specs, decisions, plans, indexes, and templates.
- Never delete user-authored specs or decisions during update.

## 1. Inspect Current Installation

Read:

- `AGENTS.md`;
- `CLAUDE.md`, including symlink targets if it is currently a symlink;
- `.agents/skills/spec-library/SKILL.md`;
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
8. For existing feature folders, migrate `business.md`, `technical.md`, and `plan.md` to `business.html`, `technical.html`, and `plan.html` only after preserving all content. Keep the old Markdown file if there is any uncertainty about conversion fidelity.
9. For existing decisions, migrate generated decision `.md` files to `.html` only after preserving all content. Keep the old Markdown file if ownership or conversion fidelity is unclear.
10. Add the HTML artifact style contract to `SKILL.md`: standalone semantic HTML, embedded readable CSS, visible `:focus-visible` outlines, no external assets, and optional inline SVG/tables/simple charts only when they clarify technical or decision content.
11. Update stale instructions that say `CLAUDE.md` should be a symlink or that generated artifacts should be Markdown.

For future version jumps, follow the matching changelog migration steps and adapt them to the repository after inspection.

## 4. Validate

Before finishing:

- confirm `CLAUDE.md` is a regular file containing `@AGENTS.md`;
- confirm `.agents/skills/spec-library/SKILL.md` has the latest schema marker;
- confirm `.claude/skills/spec-library` resolves to `../../.agents/skills/spec-library`;
- confirm current templates, indexes, specs, plans, and decisions are HTML or that old Markdown copies were intentionally preserved to avoid data loss;
- confirm no specs, decisions, unrelated skills, or existing instructions were lost;
- search for stale references to the previous simplest-sdd behavior;
- run the repository's relevant formatting or documentation checks;
- report what changed, what was already current, and any assumptions.

Do not commit unless the user explicitly asks.
