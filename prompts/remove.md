# Simplest SDD Removal Instructions

Remove simplest-sdd configuration from the repository opened in the current working directory. Removal deactivates the workflow. It does not delete the project's recorded decisions.

The `npx simplest-sdd` CLI prints instructions only. It has not modified files for you.

{{detectedState}}

## Rules

- Inspect before editing.
- Preserve all user-authored instructions, decisions, notes, commands, and project conventions. If you cannot prove simplest-sdd created a line or file, preserve it.
- The Markdown decision file, older decision maps and documents, and any legacy specs or plans belong to the user once they hold project content. Delete one only after showing the exact files and receiving explicit confirmation.
- Prefer deactivation over deletion when ownership is unclear.
- Stop after the validated removal. Feature work, commits, pull requests, and deployment need their own authorization.

## Inspect Ownership

Inspect the instruction files, the canonical library and the Claude compatibility path. Inventory the decision file, Project practice in the entrypoint, inactive archives, and any older map, area documents or feature folders. Read the skill and affected references to distinguish generated instructions from local policies.

Classify each item as generated simplest-sdd configuration, user-authored content, or ambiguous. Discard the framework's obsolete generated run reports and dedicated support files, including their copies in framework recovery directories. Strip retired reporting steps and links before carrying project-owned guidance forward. Preserve unrelated files and the project-owned parts of mixed documents.

## Remove Agent Activation

In `AGENTS.md`, remove only the simplest-sdd section (`## Product decisions and reuse`, or the older `## Spec-driven workflow`) and guidance generated for it. Keep the project's facts, commands, and unrelated instructions. Before removing the skill, carry local refinements from Project practice and any unique testing commands into `AGENTS.md` or their existing canonical project policy. Keep the wording and scope the maintainer established. Older installations may keep it in the skill itself or in `references/execution.md`.

Remove `CLAUDE.md` only when it exists solely to import an `AGENTS.md` that is now empty of project guidance. Otherwise keep it.

Remove `.claude/skills/spec-library` when it is the simplest-sdd compatibility symlink. If it is a physical Simplest SDD installation, deactivate that copy under the same ownership rules. Leave other `.claude` skills alone.

## Deactivate The Skill Without Losing User Data

- Remove purely generated instructions. If `SKILL.md` also contains user-authored guidance, preserve that content in a document outside skill discovery before deactivating it. Preserve customized references.
- Preserve `DECISIONS.md`, any older HTML or Markdown project records, and the remaining recovery files under `.agents/archive/simplest-sdd/`.
- Remove unmodified generated templates. Preserve customized ones.
- Remove the skill directory only when it is left empty. When decisions remain, leave them in place and tell the user the workflow is deactivated and the documents are preserved.

If the user asks for full deletion, show exactly which files would be deleted and wait for confirmation before removing any decision or legacy document.

## Validate

- Confirm no simplest-sdd workflow remains active in `AGENTS.md` and that Claude no longer loads the skill.
- Confirm the decision file and any older project documents, local refinements, and unrelated instructions survive deactivation.
- Search for remaining `simplest-sdd` and `spec-library` references and explain each one you preserved.
- Run the relevant formatting or documentation checks.

Report the files changed, the files preserved, and any assumption.
