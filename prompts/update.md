# Simplest SDD Update Instructions

Migrate the installed workflow to schema `{{schemaVersion}}`. The active library has a local `SKILL.md` and, once there are product decisions, one sibling `DECISIONS.md`. The CLI prints these instructions. The agent applying them performs and verifies the migration.

{{detectedState}}

{{versionHistory}}

## Rules

- An update includes conversion and removal of obsolete framework files. Keep the result uncommitted for review. Preserve project-owned documents, local skill refinements, agent configuration, TDD and other testing policies.
- Check the schema marker in each installed copy before editing. A missing marker means unversioned. If any marker is newer than `{{schemaVersion}}`, stop and report the version. If neither the canonical nor the Claude location contains a library or its documents, direct the user to `npx simplest-sdd@latest init`. Clean up obsolete generated reports in any remaining framework recovery directory, then leave the skill inactive and stop.
- Use prior decisions and approvals. Ask only if an ownership issue or consequential conflict prevents safe conversion. Continue independent work.

## Inspect The Installation

Inspect `AGENTS.md`, `CLAUDE.md`, the canonical skill and any physical Claude copy. Count a compatibility symlink once. Read the local instructions, testing commands, custom references and invocation settings before rewriting an entrypoint.

Inventory the original files and their staged and unstaged Git state. Include any existing `DECISIONS.md`, the 0.19 `index.html` and `decisions/<area>.html` files, generated Markdown references, older feature specs, plans, indexes and templates. Check both the in-skill `archive/` and `.agents/archive/simplest-sdd/` for obsolete generated reports before treating a migration as complete. Do not follow symlinks when searching for files to delete.

At every supported version, check the communication guidance in the project instructions, Project practice and their linked policies. Look for equivalent guidance under any heading. Keep its wording and scope, and make sure it is reachable from `AGENTS.md`. Add the brief from Audience and Communication only where guidance is missing. A product description identifying end users alone still leaves open how the agent should address its reader.

For a partial conversion, match existing IDs and source history before appending or retiring anything. Once the audience guidance is in place, the installation is otherwise compliant and no generated inputs remain, validate and stop. Do not rewrite compliant files.

## Convert The Library

### Harvest The Business Decisions

1. Read the actual decisions, including 0.19 area articles, older category documents and single-decision files. Reconcile them with the old index. Carry forward meaningful definitions, scope, related IDs and shared consumers recorded only in the map.
2. Read each feature's `business.html` or `business.md` for enduring promises, exact limits, exceptions and approved reuse choices. Check `technical.html`, `plan.html` and their Markdown equivalents for a product constraint recorded nowhere else.
3. Merge these into `.agents/skills/spec-library/DECISIONS.md` using the format in the contract. Keep any existing records and user-authored text. Group by area with headings inside that file. Create it only when a real record or established product definition needs a home.

Preserve existing IDs, attribution, reasons and scope. Deduplicate rules repeated across a map, area page and spec. Allocate new IDs only for distinct rules without one. Preserve known dates, approval and shipping evidence, status, predecessors and successors. Keep open questions, suggestions and rejected alternatives out of the decision set. Report unresolved contradictions rather than inventing an answer. Preserve a concrete unapproved proposal as proposed.

Trace incoming links in active guidance and project documents. Redirect a decision link such as `decisions/exports.html#EXP-014` to the appropriate relative path ending in `DECISIONS.md#exp-014`. Point an old area link to the corresponding Markdown heading. Repair related links inside the consolidated file and resolve references to retired technical sources. Where IDs collide or ownership is uncertain, preserve the source and report the unresolved item.

### Drop The Technical Layer

Retire generated technical specs, plans, code tours, implementation notes and templates after extracting any lasting business constraint. Move local refinements and testing policy from `SKILL.md`, `references/testing.md` or older instructions into **Project practice**, or link their existing canonical source. Preserve custom guidance in mixed files before retiring generated boilerplate.

### Retire The Legacy Files

Delete obsolete framework-generated run reports and their dedicated files, including earlier framework recovery copies. These can include a combined ledger, guides, helper scripts, exports, templates, schemas and examples. Apply this before backing up other files, even on a current installation. Check ownership by original path and purpose. Discard confirmed generated output directly without copying it into recovery, parsing it or adding it to `DECISIONS.md`. Keep the Git index intact.

Strip the corresponding close-out steps, commands and links from the installed `SKILL.md`, `AGENTS.md`, `CLAUDE.md`, references and indexes before merging instructions. If a previous conversion recorded a generated reporting step as a decision, remove that entry and repair its links. Preserve business decisions about the product's own reporting, TDD, verification and the project-owned parts of mixed documents. Keep unrelated files even when their names match.

Retire generated inputs individually after accounting for their contents and verifying their replacements. Remove the old root HTML map, area and category HTML, feature documents, old indexes, templates and obsolete generated references, including `references/decisions.md` and `references/testing.md`. The new library has no generated HTML index, redirects or per-area files.

- A clean, tracked generated original is recoverable from Git and can be removed from the working tree.
- For the remaining files, before replacing or retiring a dirty, staged, untracked or non-Git original, preserve its contents under `.agents/archive/simplest-sdd/` outside skill discovery, retaining source-relative paths. Keep the Git index intact. If the index and working tree hold distinct uncommitted versions, save both. Reuse identical archived copies and choose an unused name for different bytes. Create this recovery directory only when needed.
- Relocate the remaining contents of a framework-managed in-skill `archive/` to that recovery location. Preserve their bytes, source-relative paths and existing recovery files. Honor project-owned archives. Exclude backups from harvesting and link rewrites.
- Prune empty generated directories from the bottom up, including empty framework recovery directories. Keep custom files and their assets in place, or honor their documented home. Never recursively delete a mixed directory.
- If a destination conflicts with unrelated project material, reconcile without losing either version. Report anything that must remain in place.

## Replace The Workflow Instructions

Apply the shared contract to the canonical skill and the generated `AGENTS.md` section. Preserve project practice learned in conversation, local policy, supported frontmatter and invocation settings. Replace old workflow routes, interview quotas and spec approval branches. Keep the old marker until validation succeeds.

{{contract}}

## Validate

- Account for each source decision ID and feature business spec. Confirm every surviving ID occurs exactly once as a heading in `DECISIONS.md` and every active decision link resolves. Check that a graph of related rules can still be followed by ID.
- Verify that the obsolete reports and their dedicated files are gone from the library and framework recovery directories, and that active instructions contain no links or steps to recreate them. Check for leftover framework-owned HTML, duplicated references and empty generated directories. Verify the retained originals and project-owned content.
- Verify Claude compatibility, project policies, TDD configuration and local refinements. A conversation can save a confirmed decision or refine Project practice without reinstalling the framework.
- Run relevant project checks, then set and verify the `{{schemaVersion}}` marker. Repeating the update on the same inputs should produce no diff.

Report where decisions and local practices landed, which generated files and directories were removed, which originals were archived, and any unresolved item.
