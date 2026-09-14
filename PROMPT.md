# Simplest SDD Bootstrap Prompt

The preferred entrypoint is the CLI:

```sh
npx simplest-sdd@latest init
```

Copy the printed instructions into a coding agent opened at the root of the project you want to configure.

The maintained init prompt lives at [prompts/init.md](prompts/init.md). It installs the current schema with concise canonical `AGENTS.md` guidance, a short `SKILL.md` entrypoint, and separate discovery, authoring, and execution references loaded as needed. `CLAUDE.md` remains a regular file importing `@AGENTS.md`, with a compatibility symlink for the canonical skill. Clean static HTML templates supply readable specs, plans, decisions, and document relationships.

Installation explicitly presents at least eight material project, product, and workflow questions in one round, requests your answers, and waits for your answer to every question before editing. Each newly activated feature discovery explicitly presents at least five material request-refinement questions in one round, requests your answers, and waits for your answer to every question before documentation-branch decisions or implementation, including clear existing-spec and no-new-spec work. Questions must reach you in the agent’s response or visible question UI before it waits; private reasoning, internal plans, and tool logs alone do not count. Questions needed to establish a missing concrete goal or clues/examples are additional to these minimums. Repository facts, inferred answers, the agent’s recommendations, and silence do not count as your answers. You may answer directly or explicitly confirm answers presented for your confirmation. Resume without replaying questions only when the required questions were actually asked and answered by you for the same unchanged scope.

Discovery analyzes relevant context and includes a visible `Documentation impact` summary with exact links or paths for consulted unchanged specs and decisions and proposed creations or updates, while preserving existing authorizations. Consequential reuse tradeoffs need an explicit choice, which can count as a material discovery question; routine compatible reuse needs no separate choice. Every explicitly approved reuse choice persists in canonical decisions, even without a new feature spec. An owning spec updates automatically after discovery; when none exists, the agent asks whether to create a new one only if you have not already chosen. A newly generated business spec and concrete sensitive changes retain their applicable approvals.

The agent completes authorized implementation, proportional verification under the repository's testing discipline, and documentation close-out. After writing documents it reports the exact created or updated files, what changed, and why. Its final answer includes a complete concise summary of specs and decisions consulted unchanged, created, updated, or pending, even if reported earlier. Proposed changes remain labeled as proposed. A read-only lookup names consulted specs in the answer without activating discovery questions. Same-session work is the default, with useful bounded parallel work when available and consistent with local delegation, model, cost, and stop constraints.

For update and removal flows, use:

```sh
npx simplest-sdd@latest update
npx simplest-sdd@latest remove
```

The 0.17.1 update puts a brief, explicit ask-and-wait gate in generated `AGENTS.md` and `SKILL.md`, with a visible-reporting reminder in both entrypoints and detailed answer and reporting requirements in the phase references. It retains the eight-question installation and five-question feature discovery minimums, focused phase references, local customizations, project facts, specs, plans, and decisions. Updating instruction files does not rerun bootstrap discovery. If old execution records exist, it asks whether to leave them untouched (the default) or delete them. Deletion requires your explicit choice. New work no longer creates execution records or asks for a rating.
