# Simplest SDD

**A small spec-driven development framework for building software with AI coding agents.**

Simplest SDD turns a feature request into a clear agreement between you and your agent: what to build, why it matters, how it should work, and how you will know it is done.

It adds structure when a change is large, ambiguous, or risky—and stays out of the way when a change is small and obvious.

## Why Simplest SDD?

AI agents can write code quickly. The harder problem is confidence: did the agent understand the request, respect the project, make the right tradeoffs, and verify the result?

Long prompts do not solve that problem. They disappear into conversation history, mix product intent with implementation details, and are difficult for the next session to reuse. Heavy specification systems solve part of the problem, but can turn every change into a ceremony.

Simplest SDD keeps the smallest useful loop:

> Understand → specify → approve → plan → execute → verify → learn

The result is less guessing, clearer human control, and project knowledge that improves instead of resetting with every agent session.

## What It Does

For work that deserves a spec, Simplest SDD:

1. **Understands the project.** The agent inspects the repository, existing instructions, intended users, product goals, and testing approach before proposing changes.
2. **Refines the request.** It asks one focused round of questions to resolve outcomes, scope, behavior, constraints, and proof.
3. **Creates a shared contract.** It writes a concise business spec, technical spec, and integrated implementation plan.
4. **Waits for approval.** No implementation starts until you approve the spec. Sensitive technical changes receive an additional approval gate.
5. **Chooses an execution approach with you.** It can recommend working in the current session, delegating bounded tasks, using a hybrid approach, or following a custom assignment. No subagent starts without your approval.
6. **Implements and verifies.** The approved plan follows the repository's existing testing discipline and records what actually happened.
7. **Keeps useful memory.** Specs, important decisions, verification results, execution strategy, models, tokens, and outcomes remain in a browsable project library for future work.

## Why It Is Useful

- **Fewer expensive misunderstandings.** You review the intended outcome before reviewing a large code change.
- **Better continuity.** Future agents can find the product intent, technical boundaries, and important decisions without replaying old conversations.
- **Human control at the right moments.** You approve both what will be built and how the work will be executed.
- **Focused context.** Agents load the relevant spec and decisions instead of carrying the entire project history into every task.
- **Safer delegation.** Parallel work is recommended only when tasks have clear boundaries and independent verification.
- **Provider independence.** The framework recommends capabilities and reasoning effort, not hard-coded model names.
- **A feedback loop.** Execution records make it possible to compare plans, routing choices, cost, verification, and outcomes over time.

## When It Activates

Use the full workflow when:

- reviewing the expected result would take more than about five minutes;
- product behavior is meaningfully ambiguous;
- a misunderstanding would be expensive;
- architecture, data, authentication, billing, security, or public contracts are involved;
- work will cross sessions or be delegated; or
- the behavior is already covered by an existing spec.

Clear, low-risk changes that are easy to review can still be implemented directly. Simplest SDD is a guardrail, not a requirement to write a document for every edit.

## How To Use It

Copy the instruction you need and give it to your coding agent.

### Install

```text
Run npx simplest-sdd@latest init and follow the instructions
```

### Update

```text
Run npx simplest-sdd@latest update and follow the instructions
```

### Remove

```text
Run npx simplest-sdd@latest remove and follow the instructions
```

## What It Adds To A Project

```text
AGENTS.md                         # canonical project instructions
CLAUDE.md                         # imports AGENTS.md for Claude
.agents/skills/spec-library/
├── SKILL.md                      # the project-specific SDD workflow
├── index.html                    # browsable specification library
├── specs/<feature>/
│   ├── business.html             # why and what
│   ├── technical.html            # how and boundaries
│   ├── plan.html                 # tasks and verification
│   └── execution.json            # execution facts and outcomes
├── decisions/                    # durable decisions only
└── templates/                    # reusable document structure
```

The library uses plain, static files that remain readable by people and agents. `AGENTS.md` and `.agents/skills` are the source of truth, with a compatibility link for Claude skills.

See the [examples](examples/) for an anonymized request-refinement conversation, generated specs, and an execution record.

## Execution Analytics

Simplest SDD can validate and summarize the execution records stored with each feature:

```sh
npx simplest-sdd@latest analytics
npx simplest-sdd@latest analytics --format jsonl
npx simplest-sdd@latest analytics --format csv
```

For a local Codex session, it can also read model, effort, duration, and token totals without printing the conversation:

```sh
npx simplest-sdd@latest codex-usage --session <session-id>
```

Analytics are there to help the workflow learn from real results—not to add reporting work for its own sake.

## Inspiration

Simplest SDD combines a few ideas into a deliberately small framework.

### Concepts

- **Spec-driven development:** treat the spec as a living contract that guides implementation and verification, rather than documentation written once and forgotten.
- **Skill graphs:** prefer small, reusable instructions and connected, relevant context over one giant prompt.

### Sources

- [Augment Code](https://www.augmentcode.com/blog)
- [Theo's videos](https://www.youtube.com/@t3dotgg)
- [shadcn/improve](https://github.com/shadcn/improve)
- Small refinements shaped by my own experience working with coding agents.

> **A friendly disclaimer:** I have not read up on loop engineering yet, so it has not shaped this framework. Give me a chance—I will get there.

## The Short Version

Simplest SDD helps an AI agent understand before it builds, asks you to approve before it acts, verifies before it declares success, and leaves the project smarter for the next session.

Project website: [sd2.marcebollin.com](https://sd2.marcebollin.com)
