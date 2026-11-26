# Simplest SDD

Simplest SDD keeps a project's **business decisions in one Markdown file**. Code shows how an export works today. A decision tells the next maintainer that partner spreadsheets rely on the column order. That knowledge gives a coding agent a reason to preserve a behavior, reuse a shared component or ask before changing a promise.

## How it works

Before a feature or fix, the agent searches `DECISIONS.md` by product term, affected surface or stable ID. It follows related rules and checks the actual consumers in code. A second site that needs a compact item card can extend the existing card when both sites share the same rule.

The agent follows the project's testing discipline. In a TDD project, it starts with a failing behavioral test and checks the existing consumers as well as the new use. A fix that restores a rule can cite the existing ID. A lasting change to product intent updates its record.

## Decisions and improvements through conversation

| What you say | What the agent carries forward |
| --- | --- |
| “The partner list will use our compact card next quarter.” | Records the approved extension under the existing card decision. The entry still shows which lists use the card today. |
| “Going forward, check both sizes whenever you change an item card.” | Updates **Project practice** in the local skill, or the existing project policy that owns that instruction. The next card change uses it. |
| “Could we try an extra-small card?” | Explores the idea. A suggestion or a one-off request stays in the conversation. |
| “Why do both sites share a card?” | Returns the recorded reason and its ID. |

The agent records a settled choice in the same turn and tells you where it went. It amends existing guidance first. If an answer would materially change the outcome, it asks. There is no fixed number of questions. You can request a deeper interview with **“Grill me”** or ask **“Review reuse”** to examine consumers that appear to implement the same rule.

## What gets installed

```text
AGENTS.md                         # project instructions and routing
CLAUDE.md                         # imports AGENTS.md
.agents/skills/spec-library/
  SKILL.md                        # workflow, testing and project practice
  DECISIONS.md                    # created with the first lasting decision
.claude/skills/spec-library       # relative link to the canonical skill
```

Each decision has an ID-only heading, status and short rule. Add its reason, scope, shared consumers, related IDs and history where they matter. New product areas get headings in the same file. Search or follow a Markdown link directly to an ID. [Read a decision file](examples/DECISIONS.md) · [Follow a feature conversation](examples/README.md).

## Use it

Give one instruction to a coding agent working in your project.

| Action | Instruction |
| --- | --- |
| Install | `Run npx simplest-sdd@latest init and follow the instructions` |
| Update | `Run npx simplest-sdd@latest update and follow the instructions` |
| Remove | `Run npx simplest-sdd@latest remove and follow the instructions` |

The CLI prints the instructions and the agent applies them. On install, it records who the agent works with and how they prefer to communicate in `AGENTS.md`, or links to the project's existing guidance. For example, a client might ask to hear what changed for their customers, while a maintainer wants the failure case and test results. If the reader's preferences are unknown, the agent leads with the outcome in plain language. You can set a standing preference later in conversation.

Installation also discovers the testing discipline and preserves project configuration. Removal deactivates the skill, preserves the decisions and returns unique working practices to the project's instructions.

### Updating an older installation

Schema **0.21.0** checks for communication guidance even on an installation marked current. It fills gaps and keeps existing instructions for each audience in their own words.

Updates convert older Markdown specs and HTML libraries directly. The agent consolidates the business rules into `DECISIONS.md`, keeps their IDs, statuses and history, and fixes active links. Project-specific testing commands and workflow refinements carry forward.

The update deletes obsolete generated run reports and their support files, including copies kept by an earlier migration. It also removes obsolete HTML, references and empty framework folders. Git retains clean, tracked originals. The agent saves uncommitted source documents and project guidance under `.agents/archive/simplest-sdd/` when they need a recovery copy. It leaves the migration uncommitted and reports which files it removed. Repeating the update with the same inputs produces no diff.

## Inspiration

- Matt Pocock’s interview skills informed how the agent explores choices and saves decisions as they are settled. [Grill Me](https://github.com/mattpocock/skills/blob/main/docs/productivity/grill-me.md) · [Grill With Docs](https://github.com/mattpocock/skills/blob/main/docs/engineering/grill-with-docs.md).
- Lauren Tan’s poteto-mode informed checking for a simpler existing solution, making reversible calls and verifying the behavior of affected consumers. [poteto-mode](https://github.com/cursor/plugins/blob/main/pstack/skills/poteto-mode/SKILL.md).
- Theo Browne’s Lakebed instructions explain who is building the product, who uses it and what the team means by “we.” Simplest SDD uses that distinction when adapting replies to the reader. [Theo’s video](https://www.youtube.com/watch?v=xJaMTo2YgO8) · [Lakebed agent instructions](https://gist.github.com/t3dotgg/cbe978269b4c7258c4d20164aece7087).

These practices are included in Simplest SDD. Earlier versions also drew on [Augment Code](https://www.augmentcode.com/blog), [shadcn/improve](https://github.com/shadcn/improve), [design-taste-frontend](https://github.com/Leonxlnx/taste-skill/blob/main/skills/taste-skill/SKILL.md), [i-have-adhd](https://github.com/ayghri/i-have-adhd/blob/main/skills/i-have-adhd/SKILL.md), and [OpenAI's guidance on skill entrypoints](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra).

[Project website](https://sd2.marcebollin.com)
