# Simplest SDD Bootstrap Prompt

The preferred entrypoint is the CLI:

```sh
npx simplest-sdd@latest init
```

Copy the printed instructions into a coding agent opened at the root of the project you want to configure.

The maintained init prompt lives at [prompts/init.md](prompts/init.md). It installs the current schema, keeps `AGENTS.md` canonical, creates `CLAUDE.md` as a regular file that imports `@AGENTS.md`, keeps the Claude skill compatibility symlink, and uses clean static HTML for the root library index, specs, plans, decisions, supporting indexes, and templates. It also installs approval-gated orchestration: one integrated classified task plan, model-agnostic execution recommendations, same-session/delegated/hybrid/custom selection, isolated delegated worktrees, and structured post-execution analytics.

For update and removal flows, use:

```sh
npx simplest-sdd@latest update
npx simplest-sdd@latest remove
```
