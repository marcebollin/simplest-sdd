# Simplest SDD Bootstrap Prompt

The preferred entrypoint is the CLI:

```sh
npx simplest-sdd@latest init
```

Copy the printed instructions into a coding agent opened at the root of the project you want to configure.

The maintained init prompt lives at [prompts/init.md](prompts/init.md). It installs the current schema with concise canonical `AGENTS.md` guidance, a short `SKILL.md` entrypoint, and separate discovery, authoring, and execution references loaded as needed. `CLAUDE.md` remains a regular file importing `@AGENTS.md`, with a compatibility symlink for the canonical skill. Clean static HTML templates supply readable specs, plans, decisions, and document relationships.

Installation asks at least eight material project, product, and workflow questions in one round and waits for every answer before editing. Each newly activated feature discovery asks at least five material request-refinement questions in one round and waits for all answers before documentation-branch decisions or implementation, including clear existing-spec and no-new-spec work. Questions needed to establish a missing concrete goal or clues/examples are additional to these minimums. Known facts inform sharper questions; an already completed qualifying round need not be replayed for an unchanged request on resume.

Discovery analyzes relevant context and shows spec and decision impact while preserving existing authorizations. Consequential reuse tradeoffs need an explicit choice, which can count as a material discovery question; routine compatible reuse needs no separate choice. Every explicitly approved reuse choice persists in canonical decisions, even without a new feature spec. An owning spec updates automatically after discovery; when none exists, the agent asks whether to create a new one only if you have not already chosen. A newly generated business spec and concrete sensitive changes retain their applicable approvals.

The agent completes authorized implementation, proportional verification under the repository's testing discipline, and documentation close-out. Same-session work is the default, with useful bounded parallel work when available and consistent with local delegation, model, cost, and stop constraints.

For update and removal flows, use:

```sh
npx simplest-sdd@latest update
npx simplest-sdd@latest remove
```

The 0.17.0 update focuses on improving the generated skill and `AGENTS.md`: extract detailed guidance into phase references, remove repeated workflow rules and mandatory strategy selection, and preserve local customizations, project facts, specs, plans, and decisions. It retains or restores the eight-question installation and five-question feature discovery minimums without rerunning bootstrap discovery merely to migrate instruction files. If old execution records exist, it asks whether to leave them untouched (the default) or delete them. Deletion requires your explicit choice. New work no longer creates execution records or asks for a rating.
