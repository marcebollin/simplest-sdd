# Simplest SDD Init Instructions

You are adding simplest-sdd schema version `{{schemaVersion}}` to the repository opened in the current working directory.

The `npx simplest-sdd` CLI prints instructions only. It has not modified files for you. Follow these steps as the coding agent responsible for the repository.

## Rules

- Inspect the repository before asking questions.
- Preserve all existing agent instructions. Do not delete or silently rewrite current `AGENTS.md`, `CLAUDE.md`, skills, rules, commands, or project conventions.
- Use `AGENTS.md` as the canonical repository instruction file.
- Use `.agents/skills/` as the canonical repository skill directory.
- For Claude, make `CLAUDE.md` a regular file that imports the canonical instructions with `@AGENTS.md`.
- Keep the Claude skill compatibility path as a relative symlink: `.claude/skills/spec-library -> ../../.agents/skills/spec-library`.
- Store the library index, specs, decisions, plans, and supporting indexes as clean static HTML files with readable embedded CSS.
- Keep the resulting files concise and specific to this project.
- Do not copy implementation details that the agent can discover from the repository.
- Do not implement unrelated product code.
- Preserve an existing explicit delegation policy. Otherwise default to direct execution: do not spawn subagents unless the user explicitly asks for them.
- Treat this init as the active phase. After installing and validating simplest-sdd, stop; do not begin feature implementation, commit, open a pull request, deploy, monitor, or handle reviews unless the user explicitly included that work in this prompt.

## 1. Inspect And Discover The Testing Discipline

Read, when present:

- `AGENTS.md`, `CLAUDE.md`, and other repository instruction files;
- `.agents/skills/` and `.claude/skills/`, looking specifically for any installed testing or TDD skill (such as `mattpocock/skills` `tdd`) or any skill/rule that says testing should be avoided;
- README and package/workspace manifests;
- the main source tree, tests, CI, and deployment configuration;
- existing specs, ADRs, plans, or architecture documents.

Summarize what you learned internally. Do not make the user explain facts already visible in the repository.

While inspecting, determine the repository's testing discipline before writing the spec-library skill. Check, in order, and stop at the first match:

1. An explicit testing instruction in `AGENTS.md`, `CLAUDE.md`, another rules file, or an existing skill. This covers three cases:
   - a TDD or test-first discipline (red-green-refactor, agreed seams, vertical slices) — use it verbatim as the implementation discipline;
   - another defined testing approach (characterization tests, snapshot tests, integration-only, manual QA scripts, etc.) — use that approach as the implementation discipline;
   - an explicit statement that tests are not required or should be avoided (throwaway prototypes, benchmark-only repos, config-only projects) — record that testing is intentionally not part of the discipline.
2. An installed `tdd` skill under `.agents/skills/` or `.claude/skills/` (for example from `npx skills add`). Use it as the implementation discipline without reinstalling.
3. A working test setup in the repository (test runner in the manifest, `test/` or `tests/` directory, CI test steps, existing assertions). Treat the existing approach as the implementation discipline and name the runner and seam it already uses.
4. No discoverable testing instruction, testing skill, or test setup. Offer the user one concise choice, presented at once, in the discovery questions below:
   - install `mattpocock/skills` `tdd` skill with `npx skills add https://github.com/mattpocock/skills --skill tdd -y`;
   - keep the project test-free for now (the generated skill will not require tests);
   - use a different testing approach the user names.

Record the resolved testing discipline internally. The generated spec-library skill will reference it by name in its implement-and-verify step. Do not install any skill or write tests until the user answers, unless the discipline was already explicit in the repository.

## 2. Ask The Project Discovery Questions

Infer the project's goal, useful examples, and intended users from the repository before asking questions.

- Goal prerequisite: if the existing request and repository do not reveal the concrete result the project is trying to produce, ask a direct goal question. Do not count it toward the discovery minimum below.
- Clues and examples prerequisite: gather directional clues from current features, neighboring applications, the user's other projects when known, or relevant products in general. If none are available, ask which examples should influence the result and what property is useful about each. Do not count this toward the discovery minimum.
- Intended users: infer the primary users and their important needs from repository instructions, product behavior, docs, and the request. Do not ask the user to invent this from scratch. Present your inference for correction.

Ask the user one concise round of at least eight material product, business, and workflow questions and wait for every answer before editing files. Put any missing prerequisite questions first, but do not count them toward the eight. Adapt the wording to what you discovered, and cover:

1. Your inferred primary users, their context, and their most important need; ask what should be corrected.
2. The product or business outcome that should define success for those users.
3. The user problems or jobs that should take priority when features compete.
4. The product qualities that should guide tradeoffs, such as speed, calmness, reliability, privacy, flexibility, or low cost.
5. What the agent should avoid building or optimizing for.
6. Which technical boundaries are non-negotiable.
7. Which risks require explicit technical approval, such as auth, billing, migrations, security, infrastructure, or public APIs.
8. Which commands and user-visible checks prove work is complete.

Ask extra questions only when an answer could materially change the generated instructions or workflow. Prefer concrete examples over abstract questionnaires.

## 3. Make `AGENTS.md` Canonical Without Losing Content

Preserve every existing instruction while establishing one source of truth:

- If only `AGENTS.md` exists, keep it and add the new guidance around the existing content.
- If only a regular `CLAUDE.md` exists, create `AGENTS.md` containing its full content before adding anything new, then replace `CLAUDE.md` with a regular file containing `@AGENTS.md`.
- If both are regular files, keep all `AGENTS.md` content and append any unique `CLAUDE.md` content under a clearly labeled imported section. Verify nothing was lost, then replace `CLAUDE.md` with a regular file containing `@AGENTS.md`.
- If neither file exists, create a concise `AGENTS.md` from the repository inspection and user answers.
- If `CLAUDE.md` does not exist, create a regular `CLAUDE.md` file containing `@AGENTS.md` after `AGENTS.md` is ready.
- If `CLAUDE.md` is already a symlink to `AGENTS.md`, preserve the resolved target's unique instructions in `AGENTS.md` before replacing the symlink with the import file.
- If `CLAUDE.md` points elsewhere or contains unrelated Claude-specific guidance, preserve those instructions before changing it.

Add or update a concise project guidance section containing:

- what the project is and who it serves;
- the project goal and the inferred end users' context and needs;
- the product principles learned from the user;
- stable technical boundaries and essential commands;
- a short simplest-sdd maintenance note telling future agents to use `npx simplest-sdd@latest update` for migration instructions and `npx simplest-sdd@latest remove` for conservative removal instructions;
- a concise execution-boundaries note that preserves any existing explicit delegation policy and otherwise says:

```markdown
## Execution boundaries

- Work directly by default. Do not spawn subagents unless the user explicitly asks for delegation.
- Treat the user's current prompt as the authorized phase. Honor every stated stop point.
- When a prompt has no explicit stop point, stop after the requested artifact or approved implementation is complete, verified, and its simplest-sdd close-out is recorded.
- Do not continue into commits, pull requests, deployment, monitoring, or review handling unless the current prompt explicitly requests it.
```

- this resolver:

```markdown
## Spec-driven workflow

| When | Load |
| --- | --- |
| Output whose review would take more than ~5 minutes; meaningful product ambiguity; architectural/security risk; multi-session handoff; or behavior covered by an existing spec | `.agents/skills/spec-library/SKILL.md` |
| Question about past specs, plans, decisions, or internal specification documentation | `.agents/skills/spec-library/index.html` |
| Question specifically about a past technical, architectural, product, or style choice | `.agents/skills/spec-library/decisions/index.html` |
| Clear low-risk change whose output is reviewable within ~5 minutes and no existing spec is implicated | Implement and verify directly |

The spec workflow always starts with one concise request-refinement round with at least five material questions, then generates or updates the spec and waits for explicit approval before implementation. After approval, implementations follow the repository's resolved testing discipline (an installed test-first skill, another defined testing approach, or an intentional test-free stance) recorded in the spec-library skill. The library index, specs, plans, decisions, and supporting indexes are clean static HTML files. After implementation, run its close-out step so durable specs, decisions, and indexes match what shipped.
```

Do not duplicate existing commands or rules. Integrate additions where they are easiest to read.

## 4. Create The Canonical Spec Skill

Create or carefully update:

```text
.agents/skills/spec-library/
├── SKILL.md
├── index.html
├── specs/
│   └── index.html
├── decisions/
│   └── index.html
└── templates/
    ├── business-spec.html
    ├── technical-spec.html
    ├── plan.html
    └── decision-template.html
```

If a spec library already exists, preserve its useful content and history. Migrate it only as much as needed to establish this structure. Never erase existing specs or decisions.

Write `SKILL.md` for this specific project. Its YAML frontmatter must contain only `name` and `description`. Immediately after the frontmatter, add this marker:

```markdown
<!-- simplest-sdd-schema-version: {{schemaVersion}} -->
```

The skill must encode this workflow and this HTML artifact contract:

### Gate

Always use the workflow when reviewing the expected output would take more than about five minutes. Also use it for meaningful product ambiguity, expensive misunderstandings, architecture/data/auth/security/billing/public-contract risk, multi-session handoffs, or changes to behavior covered by an existing spec. The five-minute threshold concerns review effort, not implementation time or file count.

### Resolve Context

Read the root library index, spec index, and decision index, load only relevant artifacts, inspect code before proposing implementation details, and treat active decisions as constraints.

### Refine Request: Mandatory First Questions

Before the mandatory five questions:

- infer the concrete feature goal, asking a separate goal question only when it is missing; this does not count toward the five;
- gather clues and examples from the product, the user's other projects, or relevant external products, asking separately only when none are available; this does not count toward the five;
- infer intended users from `AGENTS.md`, the request, product behavior, and existing specs. Do not ask the user to restate users already supported by the evidence. Resolve conflicting evidence in one of the mandatory questions.

Then ask the user at least five material questions in one concise round and wait for answers. These first questions exist to refine the user's request into a concrete, approvable spec; they are not permission to begin implementation. Cover outcome for the inferred users, scope, behavior, constraints, and proof. Do not repeat facts already established by the request or repository; use them to ask sharper tradeoff and edge-case questions.

### HTML Artifacts

Create the library index, specs, plans, decisions, and supporting indexes as standalone HTML documents. Keep them readable in a browser and easy for agents to parse as text.

Every artifact should use:

- semantic HTML: `main`, `header`, `section`, `h1`-`h2`, lists, tables, and links;
- `<meta name="artifact-type">`, `<meta name="status">`, and only the additional metadata needed by that artifact;
- one small embedded `<style>` block;
- a comfortable reading column, calm colors, high contrast, visible `:focus-visible` outlines, and no external assets;
- optional inline SVG, tables, or simple HTML/CSS charts only when they explain a decision or technical tradeoff better than prose;
- no JavaScript unless the user explicitly asks and the project already permits it.

Use this baseline style, adapting colors lightly to the project while preserving readability:

```html
<style>
  :root { color-scheme: light dark; --bg: #f8f7f3; --ink: #202124; --muted: #5f6368; --line: #d9d4c7; --accent: #0b6bcb; --panel: #ffffff; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--ink); font: 16px/1.65 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif; }
  main { width: min(76ch, calc(100% - 32px)); margin: 0 auto; padding: 48px 0; }
  header { margin-bottom: 32px; }
  h1, h2 { line-height: 1.2; }
  h1 { font-size: 2rem; margin: 0 0 8px; }
  h2 { font-size: 1.2rem; margin-top: 32px; border-top: 1px solid var(--line); padding-top: 18px; }
  a { color: var(--accent); }
  a:focus-visible, button:focus-visible, [tabindex]:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
  .meta, .note { color: var(--muted); }
  .panel, table { background: var(--panel); border: 1px solid var(--line); border-radius: 8px; }
  .panel { padding: 16px; }
  table { width: 100%; border-collapse: collapse; overflow: hidden; }
  th, td { padding: 10px 12px; border-bottom: 1px solid var(--line); text-align: left; vertical-align: top; }
  th { font-weight: 650; }
  code { font-family: ui-monospace, SFMono-Regular, Consolas, monospace; font-size: 0.95em; }
  @media (prefers-color-scheme: dark) { :root { --bg: #171717; --ink: #f2f2f2; --muted: #b7b7b7; --line: #3f3f3f; --accent: #8ab4f8; --panel: #202020; } }
</style>
```

### Create One Feature Folder

```text
specs/<domain>-<feature>/
├── business.html
├── technical.html
└── plan.html
```

- `business.html`: durable product contract. Goal, intended users, problem, outcomes, primary flow, clues/examples, scope, acceptance criteria, and open product questions. No file paths or implementation checklist.
- `technical.html`: durable design. Current system, proposed approach, boundaries, failure/security/compatibility concerns, verification strategy, feature-local choices, and optional diagrams or charts for non-obvious tradeoffs.
- `plan.html`: implementation handoff. Goal and intended users, links to both specs and relevant decisions, ordered tasks, useful starting code surfaces, verification, discoveries, deviations, and completion summary.

Keep all three short. Let the implementing agent inspect ordinary code details.

### Generate Spec And Wait For Approval

After the request-refinement answers, create or update `business.html`, `technical.html`, and `plan.html` before implementing product code. Present the generated spec summary and stop. Require explicit business-spec approval before implementation. Also require explicit technical approval for migrations, auth, billing, security, public contracts, infrastructure boundaries, or changes to active decisions. For ordinary design, business approval and no unresolved technical objection are enough.

Do not begin implementation, edit product code, or run implementation tasks until the required spec approval has been given. If approval changes the requested behavior or approved design, update the generated spec and regain the required approval before continuing.

Before stopping, make `plan.html` name the next authorized phase, its exact stop condition, whether delegation is allowed, and follow-on actions that remain out of scope. Delegation defaults to disallowed unless the user or an existing repository instruction explicitly authorizes it.

### Implement And Verify

Use `plan.html` as the execution record. Update a durable spec and regain its required approval only when product behavior or approved design changes. Run the repository's real verification commands and user-visible checks.

The testing discipline recorded during discovery governs this phase. Write it into the skill by name so future agents reuse it without re-deriving:

- When the discipline is a TDD or test-first skill, drive the implementation through that skill (red-green-refactor loop, vertical slices, pre-agreed seams) after spec approval and before changing product code. Read `CONTEXT.md` when it exists so test names and interface vocabulary match the project's domain language. Let the testing skill govern how code is written; the spec-library skill governs what gets built and when it is approved.
- When the discipline is another defined testing approach (characterization tests, snapshot tests, integration-only, manual QA scripts, etc.), follow that approach as the implementation discipline and name the runner, seam, and commands it relies on.
- When the repository is intentionally test-free, do not require tests. Still run the repository's real verification commands and user-visible checks; record that testing is intentionally omitted so the agent does not add a test suite unprompted.

Never invent a new testing discipline during implementation. If the resolved discipline no longer fits the work, stop, raise it with the user, and update the generated skill before continuing.

Honor the execution boundary recorded in `plan.html`. Work directly unless delegation was explicitly authorized. Complete the approved implementation, verification, and close-out, then stop at the named condition. Do not commit, open a pull request, deploy, monitor, or handle review comments unless the user's current prompt explicitly includes those actions. If new work appears while implementing, record it as a follow-up instead of silently expanding the phase.

### Close Out And Self-Improve

- Make business and technical specs describe what shipped.
- Complete the plan with verification evidence.
- Create a durable decision only when a choice affects future features, is expensive to reverse, resolves recurring disagreement, or establishes a project-wide convention.
- Update the root library index, spec index, and decision index. Mark replaced artifacts as superseded instead of deleting history.
- Improve the skill only when repeated friction reveals a reusable guardrail. Do not add ceremony for a one-off mistake.

### Root Library Index

Maintain `.agents/skills/spec-library/index.html` as the easy entry point for humans and agents. It is a library catalog, not a router or application shell.

The root index must:

- link to all internal spec-library documentation, including feature specs, plans, decisions, and supporting indexes;
- keep an accessible "Latest documents" section ordered by each artifact's last-updated date;
- provide short descriptions that help readers decide what to open without loading every artifact;
- keep direct links internal to repository documentation. Internal documents may reference external URLs when useful;
- remain useful as static HTML if JavaScript is unavailable;
- include small client-side filtering or search only when it improves reading the library and does not replace normal links.

Prefer metadata from each artifact, such as `<meta name="last-updated" content="YYYY-MM-DD">`. When older artifacts lack metadata, use the best maintained date visible in the artifact or explain that the date is unknown.

## 5. Create Concise HTML Templates

Each template should be a complete HTML document with the baseline style from the skill.

The templates should provide these sections:

- Business: Goal, Intended users, Problem, Outcomes, User flow, Clues and examples, Scope in/out, Acceptance criteria, Open questions, Related. Include status and last-updated metadata.
- Technical: Current system, Proposed approach, Boundaries and contracts, Failure/security/compatibility, Verification strategy, Feature-local choices, Open questions, Related. Include status and last-updated metadata.
- Plan: Goal and intended users, Execution boundary (authorized phase, exact stop condition, delegation allowed or disallowed, and excluded follow-on actions), Read first, Tasks, Likely code surfaces, Verification, Discoveries and deviations, Completion summary. Include status and last-updated metadata.
- Decision: Decision, Over, Why, How to apply, Origin. Include importance, active/superseded status, and last-updated metadata.

Write HTML index instructions that make entries short descriptions used for progressive disclosure. Create a root library index with no fake project documents, an empty latest-documents state, links to the focused spec and decision indexes, and optional filtering/search scaffolding only if it stays small and readable. Do not pre-create fake project decisions.

## 6. Add Claude Compatibility

Create `CLAUDE.md` as a regular file that imports the canonical instructions:

```markdown
@AGENTS.md
```

Make `.claude/skills/spec-library` a relative symlink to `../../.agents/skills/spec-library`.

Preserve every other existing skill and compatibility link. If a physical Claude spec library already exists, move its contents to the canonical `.agents` location before creating the symlink. If both locations contain different files, merge without overwriting and report any unresolved conflict.

## 7. Validate

Before finishing:

- confirm `CLAUDE.md` is a regular file and contains `@AGENTS.md`;
- confirm the Claude skill link resolves to the canonical skill;
- confirm `.agents/skills/spec-library/SKILL.md` contains `<!-- simplest-sdd-schema-version: {{schemaVersion}} -->`;
- confirm the generated `SKILL.md` records the repository's resolved testing discipline by name (test-first skill, other defined testing approach, or intentional test-free stance) and its implement-and-verify step follows that discipline after spec approval;
- confirm the root library index, specs, plans, decisions, supporting indexes, and templates are HTML files with readable focus styles;
- confirm no existing instruction, spec, decision, or skill was lost;
- search for stale references saying `CLAUDE.md` should be a symlink or that generated artifacts should be Markdown;
- validate skill frontmatter if a validator is available;
- run the repository's relevant formatting or documentation checks;
- show a concise summary of files created or changed and any assumptions.

Stop after reporting the validated simplest-sdd installation. Do not begin a feature workflow or any delivery work unless it was explicitly requested in the active prompt.

Do not commit unless the user explicitly asks.
