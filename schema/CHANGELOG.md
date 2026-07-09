# Simplest SDD Schema Changelog

This changelog tracks the installed simplest-sdd schema. Schema versions are kept in sync with the npm package version.

## 0.4.0 - 2026-07-09

- Installs `mattpocock/skills` `tdd` skill with the skills CLI using preselected options (`npx skills add https://github.com/mattpocock/skills --skill tdd -y`).
- Makes the generated spec-library skill drive implementations through the `tdd` skill discipline (red-green-refactor at pre-agreed seams) after the required spec approval and before product code changes.
- Preserves the explicit spec-approval gate; the `tdd` skill governs only the implementation phase.

### Migration from 0.3.0

1. Run `npx skills add https://github.com/mattpocock/skills --skill tdd -y` in the repository root to install the tdd skill.
2. Update `.agents/skills/spec-library/SKILL.md` so the implement-and-verify step tells the agent to use the tdd skill after required spec approval and before changing product code.
3. Update `AGENTS.md` so the spec-driven workflow note mentions that approved implementations follow the tdd skill discipline.
4. Preserve the explicit spec-approval gate; the tdd skill only governs the implementation phase.

## 0.3.0 - 2026-06-18

- Reframed the first feature workflow questions as request refinement, not generic clarification.
- Made the request-refinement round explicitly produce or update the generated feature spec.
- Required the agent to stop after generating or updating the spec and wait for explicit approval before implementation.
- Preserved the additional technical approval gate for migrations, auth, billing, security, public contracts, infrastructure boundaries, and active decision changes.

### Migration from 0.2.0

1. Update `AGENTS.md` spec-driven workflow wording so the mandatory question round is described as request refinement.
2. Update `.agents/skills/spec-library/SKILL.md` so the first questions explicitly refine the request into a generated spec.
3. Ensure the skill requires the agent to stop after generating or updating the spec and wait for explicit approval before implementation.
4. Preserve the existing technical approval gate for high-risk technical areas and active decision changes.
5. Update templates or local examples only where they imply that implementation can begin immediately after clarification answers.

## 0.2.0 - 2026-06-18

- Added `.agents/skills/spec-library/index.html` as the root library index and preferred entry point for humans and agents.
- Kept `specs/index.html` and `decisions/index.html` as focused supporting indexes.
- Required the root library index to represent all internal spec-library documentation while making the latest documents easy to access by last-updated date.
- Allowed small client-side filtering or search in the root index while keeping it static, readable, and link-based rather than router-like.
- Limited root index links to internal documentation; linked internal documents can reference external URLs when relevant.
- Made root index maintenance part of the close-out step.

### Migration from 0.1.0

1. Inspect existing spec-library artifacts and focused indexes before editing.
2. Create `.agents/skills/spec-library/index.html` if missing, preserving any local landing page if one already exists.
3. Link all internal spec-library documentation from the root index, including specs, plans, decisions, and supporting indexes.
4. Add a latest-documents section ordered by `last-updated` metadata, or the best available maintained date when older artifacts lack metadata.
5. Keep root index links internal to repository documentation; external references belong inside linked internal documents.
6. Update `SKILL.md` so context resolution and close-out require maintaining the root index.
7. Add or preserve small client-side filtering/search only when it improves readability and does not turn the index into a router.

## 0.1.0 - 2026-06-17

- Added a skill-local schema marker in `.agents/skills/spec-library/SKILL.md`.
- Made `AGENTS.md` the canonical instruction source for all agents.
- Switched Claude compatibility from a `CLAUDE.md -> AGENTS.md` symlink to a regular `CLAUDE.md` file that imports `@AGENTS.md`.
- Kept `.agents/skills/spec-library` as the canonical skill and `.claude/skills/spec-library` as the Claude compatibility symlink.
- Switched generated specs, plans, decisions, indexes, and templates to clean static HTML.
- Documented readable embedded CSS, visible focus styles, and optional simple chart guidance in the generated skill.
- Added npx-ready `init`, `update`, and `remove` agent-instruction prompts.

### Migration from unversioned installs

1. Inspect existing `AGENTS.md`, `CLAUDE.md`, `.agents/skills/spec-library`, and `.claude/skills/spec-library`.
2. Preserve unique `CLAUDE.md` instructions by merging them into `AGENTS.md`.
3. Replace any `CLAUDE.md -> AGENTS.md` symlink with a regular `CLAUDE.md` file containing `@AGENTS.md`.
4. Add `<!-- simplest-sdd-schema-version: 0.1.0 -->` to `.agents/skills/spec-library/SKILL.md` immediately after the frontmatter.
5. Keep the skill symlink at `.claude/skills/spec-library -> ../../.agents/skills/spec-library`.
6. Convert generated Markdown templates, indexes, specs, plans, and decisions to clean static HTML when conversion is safe.
7. Preserve old Markdown artifacts whenever ownership or conversion fidelity is unclear.
