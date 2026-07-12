# Simplest SDD Bootstrap Prompt

The preferred entrypoint is the CLI:

```sh
npx simplest-sdd@latest init
```

Copy the printed instructions into a coding agent opened at the root of the project you want to configure.

The maintained init prompt lives at [prompts/init.md](prompts/init.md). It installs the current schema, keeps `AGENTS.md` canonical, creates `CLAUDE.md` as a regular file that imports `@AGENTS.md`, keeps the Claude skill compatibility symlink, and uses clean static HTML for the root library index, specs, plans, decisions, supporting indexes, and templates. It also installs bounded-execution guidance: direct work by default, explicit authorization for subagents, a named stop condition in every plan, and no unrequested delivery follow-ons.

For update and removal flows, use:

```sh
npx simplest-sdd@latest update
npx simplest-sdd@latest remove
```
