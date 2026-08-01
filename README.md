# Simplest SDD

**A small spec-driven development framework for building software with AI coding agents.**

Simplest SDD refines a feature request with you, keeps an existing durable agreement current when one already owns the behavior, and asks before creating a new one.

It adds structure when a change is large, ambiguous, or risky—and stays out of the way when a change is small and obvious.

## Why Simplest SDD?

AI agents can write code quickly. The harder problem is confidence: did the agent understand the request, respect the project, make the right tradeoffs, and verify the result?

Long prompts do not solve that problem. They disappear into conversation history, mix product intent with implementation details, and are difficult for the next session to reuse. Heavy specification systems solve part of the problem, but can turn every change into a ceremony.

Simplest SDD keeps the smallest useful loop:

> Understand → reuse or choose a spec → execute → verify → learn

The result is less guessing, clearer human control, and project knowledge that improves instead of resetting with every agent session.

## What It Does

For work that activates its discovery workflow, Simplest SDD:

1. **Understands the project.** The agent inspects the repository, existing instructions, intended users, product goals, and testing approach before proposing changes.
2. **Refines the request visibly.** It asks one focused round of questions and names the specs and decisions it expects to consult or change.
3. **Reuses an existing contract automatically.** If an existing spec owns the behavior, it updates that spec after discovery, preserves its history, and reports the exact files changed.
4. **Asks only before creating a new spec.** When no existing spec owns the behavior, it recommends creating a new spec or continuing without one, labels only the recommended choice, and waits.
5. **Preserves sensitive approvals.** Migrations, data, auth, billing, security, public contracts, infrastructure boundaries, and active-decision changes still require explicit approval in every branch.
6. **Implements and verifies.** It follows the new spec, refreshed existing spec, or refined no-new-spec request using the repository's testing discipline.
7. **Reports durable impact.** Generated artifacts and user-facing updates name every spec and decision consulted, unchanged, pending, or changed.

The HTML documents use a small semantic color system—violet for business, blue for technical design, green for plans, and amber for decisions—plus restrained highlights for important contract terms. Each feature document also identifies its relationship to the product contract, technical design, implementation plan, execution record, applicable decisions, and only genuinely dependent specs.

## Why It Is Useful

- **Fewer expensive misunderstandings.** You review the intended outcome before reviewing a large code change.
- **Better continuity.** Future agents can find the product intent, technical boundaries, and important decisions without replaying old conversations.
- **Human control at the right moments.** Existing contracts stay current automatically, new contracts require your choice, and sensitive technical changes keep their explicit approval gate.
- **Focused context.** Agents load the relevant spec and decisions instead of carrying the entire project history into every task.
- **Safer delegation.** Parallel work is recommended only when tasks have clear boundaries and independent verification.
- **Provider independence.** The framework recommends capabilities and reasoning effort, not hard-coded model names.
- **A feedback loop.** Execution records make it possible to compare plans, routing choices, cost, verification, and outcomes over time.

## When It Activates

Run discovery when:

- a business requirement or product behavior is changing and reviewing the expected result would take more than about five minutes;
- product behavior is meaningfully ambiguous;
- a misunderstanding would be expensive;
- architecture, data, authentication, billing, security, or public contracts are involved;
- work will cross sessions or be delegated; or
- the behavior is already covered by an existing spec.

Purely presentational design, styling, spacing, or layout changes with no business requirement or behavior change should be implemented directly, even when visual review may take more than five minutes, unless another trigger above applies. Other clear, low-risk changes that are easy to review can also be implemented directly. When discovery runs, an existing owning spec updates automatically; the agent asks about a new spec only when no existing spec owns the behavior.

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

The library uses plain, static files that remain readable by people and agents. Cross-document links name both the target's role and why it matters, so readers can follow the feature without guessing what a generic “related” link means. `AGENTS.md` and `.agents/skills` are the source of truth, with a compatibility link for Claude skills.

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
