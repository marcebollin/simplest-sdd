# simplest-sdd

A copy-paste prompt that adds a small, self-improving spec-driven development system to an existing project.

It keeps the useful guardrails:

- one required clarification conversation before substantial work;
- inferred end users plus conditional goal and example questions;
- separate business, technical, and implementation documents;
- durable decisions without documenting every small choice;
- `AGENTS.md` and `.agents/skills` as the source of truth;
- Claude compatibility through symlinks.

It avoids turning the workflow into a ceremony. The skill is required when reviewing the expected output would take more than about five minutes; smaller clear changes can still be implemented directly.

## Use it

1. Open [PROMPT.md](PROMPT.md).
2. Copy the entire prompt into your coding agent while it is opened in the project you want to configure.
3. Answer its project questions.
4. Review the generated changes before committing them.

The prompt preserves existing agent instructions. It adds the project context and workflow around them instead of replacing them.

## What it creates

```text
AGENTS.md
CLAUDE.md -> AGENTS.md
.agents/skills/spec-library/
├── SKILL.md
├── specs/INDEX.md
├── decisions/INDEX.md
└── templates/
    ├── business-spec.md
    ├── technical-spec.md
    ├── plan.md
    └── decision-template.md
.claude/skills/spec-library -> ../../.agents/skills/spec-library
```

See [examples](examples/) for a sample conversation and result.

## Why

Agents work best when they understand the product and can talk through unclear work. They work worse when every change requires a large process.

Simplest SDD keeps context and guardrails where they help, then gets out of the way.
