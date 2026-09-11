# Simplest SDD Bootstrap Prompt

The preferred entrypoint is the CLI:

```sh
npx simplest-sdd@latest init
```

Copy the printed instructions into a coding agent opened at the root of the project you want to configure.

The maintained init prompt lives at [prompts/init.md](prompts/init.md). It installs the current schema, keeps `AGENTS.md` canonical, creates `CLAUDE.md` as a regular file that imports `@AGENTS.md`, keeps the Claude skill compatibility symlink, and uses clean static HTML with semantic document colors, restrained keyword highlights, and explicit cross-document relationships. Activated requests always receive discovery with visible spec and decision impact, analysis of related implementations, and a recommended reuse, separate, or custom approach when candidates exist. Approved reuse-analysis choices are preserved in the specs and canonical decisions, including decision records when no new spec is created. An existing owning spec updates automatically; new-spec creation and applicable reuse choices require the user's selection. Spec-backed executions finish by asking for an anchored 1–10 human rating and optional comment, then record the response against the runs being evaluated.

For update and removal flows, use:

```sh
npx simplest-sdd@latest update
npx simplest-sdd@latest remove
```
