# simplest-sdd

An npx-ready CLI for installing, updating, operating, and analyzing a small, self-improving spec-driven development system in an existing project.

Project website: [sd2.marcebollin.com](https://sd2.marcebollin.com). Build locally with `pnpm dev`, create the static bundle with `pnpm build`, or deploy the generated `dist` directory with Cloudflare's static-assets runtime using `pnpm deploy`. The checked-in Cloudflare configuration contains only public project metadata; credentials stay in Wrangler's local login or Cloudflare's encrypted CI secrets.

It keeps the useful guardrails:

- one required request-refinement conversation before writing the spec;
- explicit approval of the generated spec before implementation;
- one integrated feature plan with detailed tasks classified by category, effort, risk, plan confidence, and delegation confidence;
- an approval-gated choice between same-session, delegated, hybrid, or custom execution when the plan supports it;
- model-agnostic capability recommendations with the actual models, tokens, duration, outcomes, and user overrides recorded after execution;
- implementations follow the repository's resolved testing discipline (an installed test-first skill, another defined testing approach, or an intentional test-free stance), recorded by name in the spec-library skill;
- inferred end users plus conditional goal and example questions;
- separate business, technical, and implementation documents;
- durable decisions without documenting every small choice;
- `AGENTS.md` and `.agents/skills` as the source of truth;
- Claude compatibility through `CLAUDE.md` importing `@AGENTS.md`;
- a root library index for all internal spec documentation, with latest documents easy to reach;
- clean static HTML specs, plans, decisions, indexes, and templates.

It avoids turning the workflow into a ceremony. The skill is required when reviewing the expected output would take more than about five minutes; smaller clear changes can still be implemented directly.

## Use It

Run one of these from the project you want your coding agent to modify:

```sh
npx simplest-sdd@latest init
npx simplest-sdd@latest update
npx simplest-sdd@latest remove
```

Then paste the printed instructions into your AI coding agent.

The CLI does not edit files directly. It inspects a few local paths so the printed instructions can include useful state, then the agent performs the repository-specific work.

## Planned Execution

After generating one integrated plan, Simplest SDD classifies its tasks and evaluates whether delegation is worthwhile. It does not automatically fan out:

- same-session execution is always available and may edit the current checkout after approval;
- delegated and hybrid options appear only when the planner recommends them, with the reason and proposed task assignments;
- every recommendation uses portable capability profiles such as `efficient-worker` or `strong-reviewer` plus a reasoning-effort level;
- the planner always shows a concrete custom assignment example;
- no subagent starts until the user explicitly selects or customizes the strategy.

Delegated writers use isolated worktrees. Their diffs are reviewed before changed code is executed, verification is repeated, and merging remains a separate user decision. Same-session mode stays intentionally simple: the current model executes the approved plan in the current checkout.

Simplest SDD does not pin provider-specific models. Available models change, and an unpinned custom subagent can inherit its parent settings. The durable record stores the recommended capability and effort, then captures the actual model used so execution quality and cost can be compared later. See the official [Codex subagent guide](https://developers.openai.com/codex/subagents).

## Execution Analytics

Each feature stores an `execution.json` record conforming to the shipped [execution schema](schema/execution.schema.json). It includes classification, the recommended and selected strategy, per-task assignments, actual models, token provenance, duration, verification, outcomes, revisions, and commit/worktree context. The spec-library index exposes the useful summary fields.

Validate and inspect the committed records:

```sh
npx simplest-sdd@latest analytics
npx simplest-sdd@latest analytics --format jsonl
npx simplest-sdd@latest analytics --format csv
```

JSONL is the committed aggregate history; CSV is generated on demand for charts or spreadsheet analysis. For a local Codex run, inspect model, effort, duration, and token totals without printing conversation content:

```sh
npx simplest-sdd@latest codex-usage --session <session-id>
```

## Commands

- `init`: prints agent instructions for adding simplest-sdd to a project, including discovering the repository's testing discipline and adapting the spec-library skill's implementation guidance to it (offering `npx skills add https://github.com/mattpocock/skills --skill tdd -y` only when no discipline is discoverable).
- `update`: prints agent instructions for comparing the installed skill schema version against the changelog and migrating conservatively.
- `remove`: prints agent instructions for deactivating simplest-sdd without deleting user-owned specs, decisions, or unrelated instructions.
- `analytics`: validates every feature `execution.json` and prints summary, JSON, JSONL, or CSV data without modifying the project.
- `codex-usage`: reads model, effort, duration, and token totals from a local Codex session without printing its conversation.

You can inspect another directory with:

```sh
npx simplest-sdd@latest update --cwd ../some-project
```

`init` also tells the agent to add a short maintenance note to `AGENTS.md` so future agents know to use `npx simplest-sdd@latest update` or `npx simplest-sdd@latest remove` for current instructions.

## Versioning

The npm package and the installed simplest-sdd schema each expose their own version.

- The npm package version in `package.json` is the release version.
- `schema/versions.json` contains the current installed schema version used in `.agents/skills/spec-library/SKILL.md`.
- Releases that change the installed workflow bump both versions; package-only maintenance releases can leave the schema version unchanged.
- `schema/CHANGELOG.md` records schema changes and migrations.
- Each package release is tagged as `v<version>` (e.g. `v0.4.0`), pushed with `git push origin v<version>`, and published as a GitHub Release with `gh release create v<version> --latest --notes "<changelog>"` so the "Releases" sidebar shows the latest version. A tag alone is not enough — the GitHub Release entry is what populates the sidebar.

## What Init Creates

```text
AGENTS.md
CLAUDE.md                         # regular file containing @AGENTS.md
.agents/skills/spec-library/
├── SKILL.md                      # includes simplest-sdd schema version
├── index.html                    # root library entry point
├── data/
│   └── executions.jsonl          # committed, derived execution history
├── specs/
│   └── index.html
├── decisions/
│   └── index.html
└── templates/
    ├── business-spec.html
    ├── technical-spec.html
    ├── plan.html
    ├── execution-template.json
    └── decision-template.html
.claude/skills/spec-library -> ../../.agents/skills/spec-library
```

Feature work creates:

```text
.agents/skills/spec-library/specs/<domain>-<feature>/
├── business.html
├── technical.html
├── plan.html                     # one integrated plan with detailed tasks
└── execution.json                # structured strategy and run telemetry
```

The HTML artifacts are plain, readable static documents with embedded focus styles and optional simple charts or diagrams when they clarify decisions or technical tradeoffs.

The root library index links to all internal spec-library documentation, keeps a latest-documents section ordered by last-updated date, and surfaces category, effort, confidence, selected strategy, actual models, tokens, and outcome for filtering. It is a static catalog, not a router; small client-side filtering/search is allowed when it keeps the library easier to read.

See [examples](examples/) for an anonymized read-later product case showing the discovery conversation and resulting document architecture.

## Why

Agents work best when they understand the product and can talk through unclear work. They work worse when every change requires a large process.

Simplest SDD keeps context and guardrails where they help, then gets out of the way.
