# simplest-sdd

An npx-ready prompt CLI that gives an AI coding agent the instructions to install, update, or remove a small, self-improving spec-driven development system in an existing project.

It keeps the useful guardrails:

- one required clarification conversation before substantial work;
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

## Commands

- `init`: prints agent instructions for adding simplest-sdd to a project.
- `update`: prints agent instructions for comparing the installed skill schema version against the changelog and migrating conservatively.
- `remove`: prints agent instructions for deactivating simplest-sdd without deleting user-owned specs, decisions, or unrelated instructions.

You can inspect another directory with:

```sh
npx simplest-sdd@latest update --cwd ../some-project
```

`init` also tells the agent to add a short maintenance note to `AGENTS.md` so future agents know to use `npx simplest-sdd@latest update` or `npx simplest-sdd@latest remove` for current instructions.

## Versioning

The npm package version and the simplest-sdd schema version are kept in sync.

- The npm package version in `package.json` is the release version.
- The same version is used as the installed schema marker in `.agents/skills/spec-library/SKILL.md`.
- `schema/CHANGELOG.md` records what changed for that shared release version.

## What Init Creates

```text
AGENTS.md
CLAUDE.md                         # regular file containing @AGENTS.md
.agents/skills/spec-library/
├── SKILL.md                      # includes simplest-sdd schema version
├── index.html                    # root library entry point
├── specs/
│   └── index.html
├── decisions/
│   └── index.html
└── templates/
    ├── business-spec.html
    ├── technical-spec.html
    ├── plan.html
    └── decision-template.html
.claude/skills/spec-library -> ../../.agents/skills/spec-library
```

Feature work creates:

```text
.agents/skills/spec-library/specs/<domain>-<feature>/
├── business.html
├── technical.html
└── plan.html
```

The HTML artifacts are plain, readable static documents with embedded focus styles and optional simple charts or diagrams when they clarify decisions or technical tradeoffs.

The root library index links to all internal spec-library documentation and keeps a latest-documents section ordered by last-updated date. It is a static catalog, not a router; small client-side filtering/search is allowed when it keeps the library easier to read.

See [examples](examples/) for an anonymized read-later product case showing the discovery conversation and resulting document architecture.

## Why

Agents work best when they understand the product and can talk through unclear work. They work worse when every change requires a large process.

Simplest SDD keeps context and guardrails where they help, then gets out of the way.
