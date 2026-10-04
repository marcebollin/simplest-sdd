# Simplest SDD Bootstrap Prompt

The preferred entrypoint is the CLI:

```sh
npx simplest-sdd@latest init
```

Copy the printed instructions into a coding agent opened at the root of the project you want to configure.

The maintained init prompt lives at [prompts/init.md](prompts/init.md). It installs the current schema with concise canonical `AGENTS.md` guidance, a short `SKILL.md` entrypoint, and separate discovery, authoring, and execution references loaded as needed. `CLAUDE.md` remains a regular file importing `@AGENTS.md`, with a compatibility symlink for the canonical skill.

The model creates compact standalone HTML for specs, plans, decisions, and indexes. The reader's goal, audience, and content guide the design, with coherent typography, spacing, and colors instead of a fixed page template. Make the purpose, current state, and any pending next action easy to find. Use small, meaningful groups and optional detail without omitting the contract. Diagrams, images, and calm reading controls should make the content easier to understand. Preserve the existing content divisions and document relationships. Core content must stay available without scripts.

Use natural, concise prose for explanations and rationale. Apply ASD-STE100 principles to structured action lists, acceptance criteria, and checklists: consistent terms, short steps with one action each, and explicit checks. Do not enforce sentence limits or dictionary compliance across all prose.

Keep visible change labels and emphasis until each change has approval and its implementation is complete and verified. Existing authorization for a change to an owning spec counts. The marks do not add an approval gate. Then show the accepted content as normal spec text.

Installation explicitly presents at least eight material project, product, and workflow questions in one round, requests your answers, and waits for your answer to every question before editing. Each newly activated feature discovery explicitly presents at least five material request-refinement questions in one round, requests your answers, and waits for your answer to every question before documentation-branch decisions or implementation, including clear existing-spec and no-new-spec work. Questions must reach you as a numbered Discovery questions section in the agent’s response before it waits. Question tools supplement the written list; when ending a turn with answers pending, the final response includes every unanswered question even if already shown in progress or a tool. Private reasoning, internal plans, and tool logs alone do not count. Questions needed to establish a missing concrete goal or clues/examples are additional to these minimums. Repository facts, inferred answers, the agent’s recommendations, and silence do not count as your answers. You may answer directly or explicitly confirm answers presented for your confirmation. Resume without replaying questions only when the required questions were actually asked and answered by you for the same unchanged scope.

Discovery analyzes relevant context and includes a visible `Documentation impact` summary with exact links or paths for consulted unchanged specs and decisions and proposed creations or updates, while preserving existing authorizations. Consequential reuse tradeoffs need an explicit choice, which can count as a material discovery question; routine compatible reuse needs no separate choice. Every explicitly approved reuse choice persists in canonical decisions, even without a new feature spec. An owning spec updates automatically after discovery; when none exists, the agent asks whether to create a new one only if you have not already chosen. A newly generated business spec and concrete sensitive changes retain their applicable approvals.

The agent completes authorized implementation, proportional verification under the repository's testing discipline, and documentation close-out. After writing documents it reports the exact created or updated files, what changed, and why. Its final answer includes a complete concise summary of specs and decisions consulted unchanged, created, updated, or pending, even if reported earlier. Proposed changes remain labeled as proposed. A read-only lookup names consulted specs in the answer without activating discovery questions. Same-session work is the default, with useful bounded parallel work when available and consistent with local delegation, model, cost, and stop constraints.

For update and removal flows, use:

```sh
npx simplest-sdd@latest update
npx simplest-sdd@latest remove
```

The 0.18.0 update removes active use of fixed HTML presentation templates. It leaves existing specs, plans, and decisions unchanged. When a later task revises an old spec, update its presentation while preserving its content, links, and history. Preserve custom or ambiguously owned template files as inactive history.

Keep the numbered `Discovery questions` section and repeat unanswered questions in the final response when waiting for the user. The update preserves the eight-question installation minimum and five-question feature discovery minimum. It also preserves focused phase references, local customizations, project facts, existing approvals, and visible spec reporting. Updating instruction files does not rerun bootstrap discovery. If old execution records exist, ask whether to leave them untouched (the default) or delete them. Deletion requires your explicit choice. New work does not create execution records or ask for a rating.
