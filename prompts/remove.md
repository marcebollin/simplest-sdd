# Simplest SDD Removal Instructions

You are removing simplest-sdd configuration from the repository opened in the current working directory.

The `npx simplest-sdd` CLI prints instructions only. It has not modified files for you. Removal must be conservative: remove simplest-sdd activation and generated guidance, but do not delete user-owned work.

{{detectedState}}

## Rules

- Inspect before editing.
- Preserve all user-authored instructions, specs, decisions, notes, commands, and project conventions.
- If you cannot prove a line or file was created by simplest-sdd, preserve it.
- Never delete user-authored specs or decisions by default, even though they live under `.agents/skills/spec-library`.
- Ask for explicit confirmation before deleting any durable spec, decision, ADR, plan, or non-template document.
- Treat the root library index, HTML specs, plans, decisions, and supporting indexes as user-owned once they contain project-specific content.
- Prefer deactivation over data deletion when the safe ownership boundary is unclear.

## 1. Inspect Ownership

Read:

- `AGENTS.md`;
- `CLAUDE.md`, including symlink targets if it is currently a symlink;
- `.agents/skills/spec-library/SKILL.md`;
- `.agents/skills/spec-library/index.html`;
- `.agents/skills/spec-library/specs/`;
- `.agents/skills/spec-library/decisions/`;
- `.agents/skills/spec-library/templates/`;
- `.claude/skills/spec-library` and its target if present.

Classify content as:

- clearly simplest-sdd-generated configuration;
- user-authored durable content;
- ambiguous content that must be preserved or explicitly confirmed with the user.

## 2. Remove Agent Activation

In `AGENTS.md`, remove only the simplest-sdd workflow section and generated project guidance that was added for simplest-sdd. Keep all unrelated project instructions and commands.

If `CLAUDE.md` exists only to import simplest-sdd-managed `AGENTS.md`, remove it after `AGENTS.md` has been cleaned. If `CLAUDE.md` contains other Claude-specific instructions or the `@AGENTS.md` import still usefully imports non-simplest project guidance, preserve it and remove only text that is clearly simplest-sdd-specific.

Remove `.claude/skills/spec-library` if it is the simplest-sdd compatibility symlink. Do not remove other `.claude` skills.

## 3. Deactivate The Skill Without Losing User Data

The safest default is:

- remove or rename `.agents/skills/spec-library/SKILL.md` only if doing so does not delete user-authored content;
- remove generated HTML templates only if they have not been customized;
- preserve `specs/`, `decisions/`, and any non-template documents;
- if the skill directory would become an empty generated shell, remove the empty directories;
- if user-authored specs or decisions remain in the directory, leave them in place and tell the user that simplest-sdd was deactivated but durable documents were preserved.

If the user explicitly asks for full deletion, first show exactly which files would be deleted and ask for confirmation before removing any durable content.

## 4. Validate

Before finishing:

- confirm no simplest-sdd workflow remains active in `AGENTS.md`;
- confirm Claude no longer loads simplest-sdd skill instructions;
- confirm the root library index, user-authored HTML specs, plans, decisions, supporting indexes, and unrelated instructions still exist;
- search for remaining `simplest-sdd`, `spec-driven workflow`, and `spec-library` references and explain any preserved references;
- run relevant formatting or documentation checks if the repository has them;
- report the files changed, files intentionally preserved, and any assumptions.

Do not commit unless the user explicitly asks.
