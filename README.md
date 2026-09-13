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
2. **Refines the request visibly.** It inspects relevant implementations and names the specs and decisions it expects to consult or change. Each newly activated request receives at least five material questions in one round, with all answers required before documentation-branch decisions or implementation. Known facts inform sharper questions. Consequential reuse tradeoffs receive alternatives and a recommendation for your choice; routine compatible reuse needs no separate choice.
3. **Reuses an existing contract automatically.** If an existing spec owns the behavior, it updates that spec after discovery, preserves its history, and reports the exact files changed.
4. **Resolves new-spec creation.** When no existing spec owns the behavior and you have not already chosen, it recommends creating a new spec or continuing without one and waits. A newly generated business spec still needs your approval before implementation.
5. **Preserves sensitive approvals.** Concrete changes to migrations, data, auth, billing, security, public contracts, infrastructure boundaries, and active decisions require explicit approval. Authorization you already gave counts; mentioning one of these topics alone does not add an approval step.
6. **Implements and verifies.** It completes the authorized work using the repository's testing discipline and checks proportional to the change. Same-session work is the default; useful bounded work may run in parallel when local instructions and your constraints permit it.
7. **Closes out clearly.** It reports the outcome, verification, remaining limitations, and every spec and decision consulted, unchanged, pending, or changed.

The HTML documents use a small semantic color system—violet for business, blue for technical design, green for plans, and amber for decisions—plus restrained highlights for important contract terms. Each feature document also identifies its relationship to the product contract, technical design, implementation plan, applicable decisions, and only genuinely dependent specs.

For example, a payment report request may reveal reporting logic in another section. The agent checks whether the rules actually match and whether extracting a shared calculation would help both sections. The business spec records the alternatives, recommendation, your approved choice, and its product consequences; the technical spec records the code boundaries and verification. Approved reuse, adaptation, abstraction, or isolation choices are also stored in the decision registry, even when you continue without a new spec. Automatic spec updates do not approve a reuse proposal.

## Why It Is Useful

- **Fewer expensive misunderstandings.** You review the intended outcome before reviewing a large code change.
- **Better continuity.** Future agents can find the product intent, technical boundaries, and important decisions without replaying old conversations.
- **Human control at the right moments.** Existing contracts stay current automatically, new contracts require your choice, and sensitive technical changes keep their explicit approval gate.
- **Focused context.** Agents load the relevant spec and decisions instead of carrying the entire project history into every task.
- **Useful delegation.** Bounded, independent work can run in parallel without a mandatory strategy menu, while respecting your delegation, model, cost, and stop constraints.
- **Provider independence.** The framework recommends capabilities and reasoning effort, not hard-coded model names.
- **Clear close-out.** The result, verification, and durable documentation changes are visible when the work is complete.

## When It Activates

Run discovery when:

- a business requirement or product behavior is changing and reviewing the expected result would take more than about five minutes;
- product behavior is meaningfully ambiguous;
- a misunderstanding would be expensive;
- the change carries architectural, data, authentication, billing, security, or public-contract risk;
- work needs a handoff across sessions; or
- the behavior is already covered by an existing spec.

Purely presentational design, styling, spacing, or layout changes with no business requirement or behavior change should be implemented directly, even when visual review may take more than five minutes, unless another trigger above applies. Other clear, low-risk changes that are easy to review can also be implemented directly. Topic mentions, historical documentation questions, and delegating a bounded subtask do not activate feature discovery by themselves.

Once discovery activates, the five-question minimum applies even to clear existing-spec changes or work that will create no new spec. Missing concrete goals or clues/examples require additional questions outside that minimum. A completed qualifying discovery round need not be repeated when resuming the unchanged request, and existing approvals remain valid. After discovery, an owning spec updates automatically; the agent asks about a new spec only when none owns the behavior and you have not already selected a branch.

## How To Use It

Copy the instruction you need and give it to your coding agent.

### Install

```text
Run npx simplest-sdd@latest init and follow the instructions
```

Installation asks at least eight material project, product, and workflow questions in one round and waits for all answers before editing files. Questions needed to establish a missing concrete goal or clues/examples are additional and do not count toward the eight.

### Update

```text
Run npx simplest-sdd@latest update and follow the instructions
```

Schema 0.17.0 updates the generated skill and `AGENTS.md` to reduce repeated instructions and unnecessary pauses. It moves detailed workflow guidance into references, preserves project facts and local constraints, and removes mandatory strategy menus. Updates retain or restore the eight-question installation and five-question feature discovery minimums without rerunning bootstrap discovery merely to migrate instruction files. Existing specifications, plans, and decisions are preserved.

If old execution records exist, the update instruction asks whether to leave them untouched (the default) or delete them. Deletion requires your explicit choice. New work no longer creates execution records or asks for a rating.

### Remove

```text
Run npx simplest-sdd@latest remove and follow the instructions
```

## What It Adds To A Project

```text
AGENTS.md                         # project facts, constraints, and routing
CLAUDE.md                         # imports AGENTS.md for Claude
.agents/skills/spec-library/
├── SKILL.md                      # short workflow entrypoint
├── references/
│   ├── discovery.md              # context, reuse, and spec choice
│   ├── authoring.md              # contracts, decisions, and HTML guidance
│   └── execution.md              # implementation, validation, and close-out
├── index.html                    # browsable specification library
├── specs/<feature>/
│   ├── business.html             # why and what
│   ├── technical.html            # how and boundaries
│   └── plan.html                 # tasks and verification
├── decisions/                    # durable decisions only
└── templates/                    # HTML output assets
```

The library uses plain, static files that remain readable by people and agents. A concise `AGENTS.md` routes to the skill; the short `SKILL.md` loads only the references needed for the current phase. HTML templates provide output structure instead of adding instructions to every task. Cross-document links name both the target's role and why it matters. `AGENTS.md` and `.agents/skills` are the source of truth, with a compatibility link for Claude skills.

See the [examples](examples/) for an anonymized request-refinement conversation and generated specs, plans, and decisions.

## Inspiration

Simplest SDD combines a few ideas into a deliberately small framework.

### Concepts

- **Spec-driven development:** treat the spec as a living contract that guides implementation and verification, rather than documentation written once and forgotten.
- **Skill graphs:** prefer small, reusable instructions and connected, relevant context over one giant prompt.

### Sources

- [Augment Code](https://www.augmentcode.com/blog)
- [Theo's videos](https://www.youtube.com/@t3dotgg)
- [shadcn/improve](https://github.com/shadcn/improve)
- [OpenAI: Rethinking skills and prompts for GPT-6 Astra](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) — informed smaller instruction entrypoints, selective context loading, and removing workflow steps that repeat settled decisions.
- Small refinements shaped by my own experience working with coding agents.

> **A friendly disclaimer:** I have not read up on loop engineering yet, so it has not shaped this framework. Give me a chance—I will get there.

## The Short Version

Simplest SDD helps an AI agent understand before it builds, resolve consequential decisions with you, complete authorized work, and leave verified results and useful project knowledge for the next session.

Project website: [sd2.marcebollin.com](https://sd2.marcebollin.com)
