# Simplest SDD bootstrap prompt

Copy everything below into a coding agent opened at the root of the project you want to configure.

---

You are adding a small, project-specific, self-improving spec-driven development system to this repository.

Your goal is not to impose a large process. Your goal is to make important work begin with a useful conversation, preserve durable product and technical context, and let clear low-risk work remain simple.

## Rules

- Inspect the repository before asking questions.
- Preserve all existing agent instructions. Do not delete or silently rewrite current `AGENTS.md`, `CLAUDE.md`, skills, rules, commands, or project conventions.
- Use `AGENTS.md` as the canonical repository instruction file.
- Use `.agents/skills/` as the canonical repository skill directory.
- Keep compatibility paths as relative symlinks:
  - `CLAUDE.md -> AGENTS.md`
  - `.claude/skills/spec-library -> ../../.agents/skills/spec-library`
- Keep the resulting files concise and specific to this project.
- Do not copy implementation details that the agent can discover from the repository.
- Do not implement unrelated product code.

## 1. Inspect

Read, when present:

- `AGENTS.md`, `CLAUDE.md`, and other repository instruction files;
- `.agents/skills/` and `.claude/skills/`;
- README and package/workspace manifests;
- the main source tree, tests, CI, and deployment configuration;
- existing specs, ADRs, plans, or architecture documents.

Summarize what you learned internally. Do not make the user explain facts already visible in the repository.

## 2. Ask the project discovery questions

Ask the user one concise round of at least eight material questions and wait for every answer before editing files. Adapt the wording to what you discovered, but cover:

1. What is the project trying to make possible, in one or two sentences?
2. Who are its primary users, and what do they care about most?
3. What product qualities should guide tradeoffs, such as speed, calmness, reliability, privacy, flexibility, or low cost?
4. What should the agent avoid building or optimizing for?
5. Which technical boundaries are non-negotiable?
6. Which kinds of changes deserve a written spec, and which should stay direct and lightweight?
7. Which risks require explicit technical approval, such as auth, billing, migrations, security, infrastructure, or public APIs?
8. What commands and user-visible checks prove work is complete?

Ask extra questions only when an answer could materially change the generated instructions or workflow. Prefer concrete examples over abstract questionnaires.

## 3. Make `AGENTS.md` canonical without losing content

Preserve every existing instruction while establishing one source of truth:

- If only `AGENTS.md` exists, keep it and add the new guidance around the existing content.
- If only a regular `CLAUDE.md` exists, create `AGENTS.md` containing its full content before adding anything new, then replace `CLAUDE.md` with the relative symlink.
- If both are regular files, keep all `AGENTS.md` content and append any unique `CLAUDE.md` content under a clearly labeled imported section. Verify nothing was lost, then replace `CLAUDE.md` with the symlink.
- If neither file exists, create a concise `AGENTS.md` from the repository inspection and user answers.
- If `CLAUDE.md` does not exist, create the relative symlink after `AGENTS.md` is ready.
- If `CLAUDE.md` is already a symlink to `AGENTS.md`, preserve it. If it points elsewhere, preserve the target's unique instructions in `AGENTS.md` before correcting the link.

Add or update a concise project guidance section containing:

- what the project is and who it serves;
- the product principles learned from the user;
- stable technical boundaries and essential commands;
- this resolver:

```markdown
## Spec-driven workflow

| When | Load |
| --- | --- |
| Meaningful product ambiguity, architectural/security risk, multi-session handoff, or behavior covered by an existing spec | `.agents/skills/spec-library/SKILL.md` |
| Question about a past technical, architectural, product, or style choice | `.agents/skills/spec-library/decisions/INDEX.md` |
| Clear low-risk change with no existing spec implicated | Implement and verify directly |

The spec workflow always includes one concise user clarification round with at least five material questions. After implementation, run its close-out step so durable specs and decisions match what shipped.
```

Do not duplicate existing commands or rules. Integrate additions where they are easiest to read.

## 4. Create the canonical spec skill

Create or carefully update:

```text
.agents/skills/spec-library/
├── SKILL.md
├── specs/
│   └── INDEX.md
├── decisions/
│   └── INDEX.md
└── templates/
    ├── business-spec.md
    ├── technical-spec.md
    ├── plan.md
    └── decision-template.md
```

If a spec library already exists, preserve its useful content and history. Migrate it only as much as needed to establish this structure. Never erase existing specs or decisions.

Write `SKILL.md` for this specific project. Its YAML frontmatter must contain only `name` and `description`.

The skill must encode this workflow:

### Gate

Use the workflow for meaningful product ambiguity, expensive misunderstandings, architecture/data/auth/security/billing/public-contract risk, multi-session handoffs, or changes to behavior covered by an existing spec. Do not trigger it from time or file count alone.

### Resolve context

Read the spec and decision indexes, load only relevant artifacts, inspect code before proposing implementation details, and treat active decisions as constraints.

### Clarify: mandatory guardrail

Before drafting, ask the user at least five material questions in one concise round and wait for answers. Cover outcome, scope, behavior, constraints, and proof. Do not repeat facts already established by the request or repository; use them to ask sharper tradeoff and edge-case questions.

### Create one feature folder

```text
specs/<domain>-<feature>/
├── business.md
├── technical.md
└── plan.md
```

- `business.md`: durable product contract. Problem, users, outcomes, primary flow, scope, acceptance criteria, open product questions. No file paths or implementation checklist.
- `technical.md`: durable design. Current system, proposed approach, boundaries, failure/security/compatibility concerns, verification strategy, and feature-local choices.
- `plan.md`: implementation handoff. Links to both specs and relevant decisions, ordered tasks, useful starting code surfaces, verification, discoveries, deviations, and completion summary.

Keep all three short. Let the implementing agent inspect ordinary code details.

### Approval

Require explicit business-spec approval before implementation. Also require explicit technical approval for migrations, auth, billing, security, public contracts, infrastructure boundaries, or changes to active decisions. For ordinary design, business approval and no unresolved technical objection are enough.

### Implement and verify

Use `plan.md` as the execution record. Update a durable spec and regain its required approval only when product behavior or approved design changes. Run the repository's real verification commands and user-visible checks.

### Close out and self-improve

- Make business and technical specs describe what shipped.
- Complete the plan with verification evidence.
- Create a durable decision only when a choice affects future features, is expensive to reverse, resolves recurring disagreement, or establishes a project-wide convention.
- Update indexes and mark replaced artifacts as superseded instead of deleting history.
- Improve the skill only when repeated friction reveals a reusable guardrail. Do not add ceremony for a one-off mistake.

## 5. Create concise templates

Use YAML frontmatter with `name`, `description`, `status`, and only the metadata needed by that artifact.

The templates should provide these headings:

**Business:** Problem, Outcomes, User flow, Scope in/out, Acceptance criteria, Open questions, Related.

**Technical:** Current system, Proposed approach, Boundaries and contracts, Failure/security/compatibility, Verification strategy, Feature-local choices, Open questions, Related.

**Plan:** Read first, Tasks, Likely code surfaces, Verification, Discoveries and deviations, Completion summary.

**Decision:** Decision, Over, Why, How to apply, Origin. Include importance and active/superseded status.

Write index instructions that make entries short descriptions used for progressive disclosure. Do not pre-create fake project decisions.

## 6. Add Claude compatibility

Make `.claude/skills/spec-library` a relative symlink to `../../.agents/skills/spec-library`.

Preserve every other existing skill and compatibility link. If a physical Claude spec library already exists, move its contents to the canonical `.agents` location before creating the symlink. If both locations contain different files, merge without overwriting and report any unresolved conflict.

## 7. Validate

Before finishing:

- confirm `CLAUDE.md` resolves to `AGENTS.md`;
- confirm the Claude skill link resolves to the canonical skill;
- confirm no existing instruction, spec, decision, or skill was lost;
- search for stale references to the old canonical paths;
- validate skill frontmatter if a validator is available;
- run the repository's relevant formatting or documentation checks;
- show a concise summary of files created or changed and any assumptions.

Do not commit unless the user explicitly asks.
