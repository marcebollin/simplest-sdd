# Simplest SDD Schema Changelog

This changelog tracks the installed simplest-sdd schema. Workflow releases advance the schema version; CLI-only releases may leave it unchanged.

## 0.8.0 - 2026-07-22

- Replaces feature-associated decision artifacts with a small project-wide registry organized into living category documents.
- Keeps `decisions/index.html` as the lightweight entry point, with stable IDs, one-line summaries, statuses, dates, and direct links to decision sections.
- Requires one concise `Decision impact` section in each technical spec: used, proposed, or modified decisions, or the standard “No durable decision impact” statement.
- Makes agents read the decision index during context resolution and load only categories relevant to the current request.
- Promotes a choice only when it has likely cross-feature value, inconsistent interpretations would matter, and the intent cannot be reliably inferred from code, conventions, or an active spec.
- Creates category documents only on demand, extends existing decisions when possible, and avoids records for routine implementation details.
- Amends compatible changes in place with compact history and spec links; reserves supersession for fundamental reversals.
- Preserves explicit technical approval for active-decision changes. Clearly listed new decisions are approved with the applicable business or technical spec.

### Migration from 0.6.0

1. Preserve every existing decision and stable link. Do not delete or blindly combine older one-decision artifacts.
2. Update `SKILL.md` so context resolution reads `decisions/index.html` and only the populated categories relevant to the request.
3. Turn `decisions/index.html` into a concise registry with stable decision IDs, title, status, summary, last-updated date, and direct section link.
4. Store new decisions in living category documents such as `design.html` or `architecture.html`; create no empty categories. Consolidate older files only when ownership and anchors are unambiguous.
5. Add `Decision impact` to the technical template and new technical specs. List used, proposed, and modified decisions, or use the standard no-impact statement.
6. Apply the strict promotion threshold: cross-feature value, meaningful inconsistency risk, and intent that cannot be reliably inferred.
7. Amend compatible decisions in place with compact history and a link to the changing spec. Supersede only fundamental reversals.
8. Preserve the existing approval gate for changes to active decisions and all stricter local rules.

## 0.6.0 - 2026-07-12

- Keeps one integrated `plan.html` per feature while dividing it into detailed tasks classified by category, effort, risk, plan confidence, delegation confidence, dependencies, scope, verification, and STOP conditions.
- Makes the planner evaluate same-session, delegated, and hybrid execution. Same-session is always offered; delegated/hybrid modes appear only when recommended with rationale; a custom assignment example is always shown.
- Requires explicit user approval of the execution topology and per-task assignments before any subagent starts. The recommendation and user override are both retained.
- Uses model-agnostic capability profiles and low/medium/high effort for durable routing recommendations, while recording actual planner, executor, verifier, and reviewer model names after execution.
- Adds `design` to the feature classification taxonomy alongside feature, bug, security, performance, tests, tech-debt, migration, DX, docs, and research.
- Adds per-feature `execution.json` records and a committed `data/executions.jsonl` ledger covering actual models, token usage and provenance, duration, outcomes, revisions, verification, commits, and execution strategy.
- Adds read-only `analytics` output in summary, JSON, JSONL, and CSV formats plus `codex-usage` inspection for local session model, effort, duration, and token totals without conversation content.
- Uses isolated worktrees for delegated writers, requires diff review before running changed code, stops before merge, and keeps delivery follow-ons outside the active phase unless explicitly requested.
- Reduces update-prompt context by including only schema history newer than the detected installed version; unversioned installations still receive the full migration history.

### Migration from 0.5.0

1. Preserve any explicit repository delegation policy. Otherwise allow the planner to recommend delegation while requiring explicit user strategy approval before spawning subagents.
2. Keep one integrated `plan.html`; add detailed task classification, dependencies, scope, verification, STOP conditions, capability recommendations, and selected assignments.
3. Add `templates/execution-template.json`, a per-feature `execution.json`, and `data/executions.jsonl` using execution schema `1.0.0`. Do not invent telemetry for old executions.
4. Always offer same-session execution. Offer delegated and hybrid modes only with a rationale, and show a concrete custom assignment example.
5. Record capability profiles in recommendations and actual model names, effort, tokens, duration, outcome, revisions, and verification after execution.
6. Run `npx simplest-sdd@latest analytics`, then rebuild the committed JSONL ledger. Generate CSV only when needed.
7. Use isolated worktrees for delegated writers, inspect their diffs before running changed code, and stop before merge.
8. Preserve the existing business-spec and technical-approval gates plus stricter local rules. Keep delivery follow-ons out of scope unless explicitly requested.

## 0.5.0 - 2026-07-09

- Stops unconditionally installing the `tdd` skill during init.
- Discovers the repository's resolved testing discipline during inspection: an explicit testing instruction in `AGENTS.md`/`CLAUDE.md`/a rules file/existing skill, an installed test-first skill, the repository's existing test setup, or none of the above.
- Writes the resolved testing discipline by name into the generated spec-library `SKILL.md` implement-and-verify step (test-first skill, other defined testing approach, or intentional test-free stance).
- Keeps the `tdd` skill as one offered option when no discipline is discoverable; update no longer installs any skill unprompted.
- Preserves the explicit spec-approval gate; the testing discipline governs only the implementation phase.

### Migration from 0.4.0

1. Discover the resolved testing discipline from `AGENTS.md`/`CLAUDE.md`/existing skills/repo test setup; do not reinstall a test-first skill if one is present.
2. Update `.agents/skills/spec-library/SKILL.md` so the implement-and-verify step references the resolved discipline by name instead of always naming the `tdd` skill.
3. Update `AGENTS.md` so the spec-driven workflow note says approved implementations follow the resolved testing discipline.
4. If a `tdd` skill was installed only because 0.4.0 asked for it and the repo has another explicit testing instruction, keep both but let the existing instruction take precedence.
5. If no discipline is discoverable, leave the skill test-discipline-agnostic and offer the `init.md` choice when the workflow next runs; do not install a skill unprompted during update.

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
