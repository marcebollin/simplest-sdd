# Simplest SDD Update Instructions

You are updating an existing simplest-sdd setup to schema version `{{schemaVersion}}`.

The `npx simplest-sdd` CLI prints instructions only. It has not modified files for you. Treat the changelog below as migration guidance, not as deterministic code to apply blindly.

{{detectedState}}

The current rules below take precedence over historical migration steps. Read the complete instructions before applying any history: execution records, telemetry, and human ratings were removed in 0.15.0 and must not be recreated while upgrading through older versions.

{{versionHistory}}

## Rules

- Inspect the repository before editing.
- Preserve unrelated agent instructions, specs, decisions, skills, rules, commands, and project conventions. Remove obsolete simplest-sdd tracking and rating guidance as described below.
- Treat `.agents/skills/spec-library/SKILL.md` as the installed simplest-sdd schema source of truth.
- If the skill has no `simplest-sdd-schema-version` marker, treat it as an unversioned install.
- Use `AGENTS.md` as the canonical repository instruction file.
- Use `CLAUDE.md` as a regular Claude import file containing `@AGENTS.md`, not as a symlink.
- Keep `.agents/skills/spec-library` as the canonical skill directory.
- Keep `.claude/skills/spec-library -> ../../.agents/skills/spec-library` for Claude skill compatibility.
- Use clean static HTML with semantic artifact colors and explicit document relationships for the root library index, specs, living decision category documents, plans, supporting indexes, and templates.
- Make paragraph and list readability an explicit authoring responsibility in the skill, using content-aware editorial judgment rather than deterministic keyword rules or formatting quotas.
- Never delete user-authored specs or decisions during update.
- Keep decision documentation sparse outside explicitly approved reuse-analysis choices: do not create empty categories or promote other choices that remain reliably inferable from code, conventions, or an active specification.
- Preserve mandatory discovery for every request that activates the skill. Automatically refresh an existing owning spec after discovery; ask the documentation-branch question only when no existing spec owns the behavior.
- During discovery, inspect related implementations and potential shared logic, compare reuse as-is, a separate implementation, and a custom adaptation or abstraction with one evidence-backed recommendation, and obtain the user's choice before implementing it. Preserve the analysis and approved approach in the business/technical specs and canonical decisions. An explicit choice already supplied by the user counts; documentation choices do not imply reuse approval.
- Persist every approved reuse-analysis choice, including keeping implementations separate, in canonical decision documents and indexes even on the no-new-spec branch. Keep approved intent and implementation state distinct; do not infer historical approvals or turn unselected suggestions into active decisions.
- Preserve an existing explicit delegation policy. Otherwise let the planner recommend delegation, but require explicit user approval of the proposed topology and assignments before spawning subagents.
- Keep recommendations model-agnostic through capability profiles and effort. Store the recommended and user-selected strategy, per-task assignments, progress, and verification evidence in the integrated `plan.html`.
- Do not create or maintain execution records, collect model/token/duration telemetry, rebuild analytics ledgers, or ask for execution ratings or qualification. Close-out reports the result, verification, and exact spec and decision impact.
- Existing execution data belongs to the user. Ask whether to leave old records untouched or delete the identified files, as described below; never delete them without an explicit choice.
- Treat this migration as the active phase. After migrating and validating, stop before feature work, commits, pull requests, deployment, monitoring, or review handling unless the user explicitly requested it.

## 1. Inspect Current Installation

Read:

- `AGENTS.md`;
- `CLAUDE.md`, including symlink targets if it is currently a symlink;
- `.agents/skills/spec-library/SKILL.md`;
- `.agents/skills/spec-library/index.html` when present;
- the installed skills under `.agents/skills/` and `.claude/skills/`, the `AGENTS.md`/`CLAUDE.md` instructions, and the repository test setup, to discover the resolved testing discipline (test-first skill, other defined testing approach, or intentional test-free stance);
- `.agents/skills/spec-library/specs/index.html` or older `.agents/skills/spec-library/specs/INDEX.md`;
- existing spec folders, including older Markdown artifacts;
- `.agents/skills/spec-library/decisions/index.html` or older `.agents/skills/spec-library/decisions/INDEX.md`;
- existing decisions and category documents, including older Markdown artifacts;
- `.agents/skills/spec-library/templates/`;
- `.claude/skills/spec-library` and its target if present.

Inventory the exact paths of legacy feature `execution.json` files under `.agents/skills/spec-library/specs/` and `.agents/skills/spec-library/data/executions.jsonl` when present. Inspect filenames and file types without parsing, validating, or rewriting record contents; invalid or older data must not block an update. Do not follow symlinks outside the canonical library or include unrelated JSON, JSONL, CSV, or session-log files.

Identify the installed schema version from `SKILL.md`:

```markdown
<!-- simplest-sdd-schema-version: x.y.z -->
```

If the marker is missing but the workflow exists, call the current installation `unversioned`.

If the installed marker is newer than `{{schemaVersion}}`, report it and stop without changing files or offering cleanup.

## 2. Compare Against The Changelog

Use the version history above to identify the changes between the installed version and `{{schemaVersion}}`. For each version jump:

- list the intended behavior change;
- list the local files likely affected;
- note any existing local content that must be preserved;
- decide whether the change is already present, missing, or partially present.

If the repository has local customizations that conflict with the latest guidance, preserve the local behavior and ask the user before changing it.

## 3. Choose What To Do With Old Execution Records

When legacy records or the ledger exist, show the exact candidate paths and ask one question: **Would you like to leave old execution records untouched or delete them?** Offer:

1. `Leave old records untouched (Recommended)` — the default; preserve every existing record and ledger byte-for-byte as inactive history. Do not upgrade schemas, append runs, add evaluations, validate, export, or rebuild this data.
2. `Delete old records` — delete only the identified feature `execution.json` files and `data/executions.jsonl` after the user explicitly selects deletion for those paths. This also removes any ratings stored inside them.

Wait for the user's choice before handling those files. Silence or an unanswered question is not deletion approval: leave the data untouched while continuing independent instruction and template updates. If the user already explicitly chose for the identified files in the active request, honor that choice without asking again. If no legacy data exists, skip the question and report that none was found. On a current-version installation, offer this choice when retained legacy data still exists; never infer deletion from a previous update.

Do not delete a whole feature folder, `specs/`, `data/`, the library, plans, business/technical specs, decisions, or unrelated files. Do not follow symlinks or delete targets outside the inventoried library paths. If ownership is ambiguous, preserve the file and report it. After an approved deletion, remove dangling references to the deleted files while preserving document content and decision history. Report the selected choice and exact files preserved or deleted; if unanswered, report that cleanup remains pending and the files were preserved.

## 4. Apply The Migration Conservatively

Apply the relevant migration guidance printed above from the oldest relevant version to the newest, except where superseded by the current rules. The CLI has already omitted schema versions that are not newer than the detected installation. The removal of execution tracking and ratings in 0.15.0 overrides every older instruction to create, upgrade, record, validate, export, or rebuild execution data or to request human feedback. Skip those older steps entirely, including for missing or unversioned installations; never create intermediate records or ratings only to remove them later.

For an unversioned or missing installation, the printed history includes the full baseline. Reconstruct the current structure conservatively from those steps, preserve unique content, and add the latest schema marker only after the current behavior is present.

Remove obsolete simplest-sdd execution tracking, analytics, telemetry collection, and rating/qualification instructions from `SKILL.md`, generated `AGENTS.md` guidance, templates, and active indexes. Stop using the removed `analytics` and `codex-usage` CLI commands. Remove an uncustomized generated `templates/execution-template.json`; preserve customized or ambiguously owned templates as inactive files. Do not let retained files reactivate the removed workflow.

Keep the integrated `plan.html` as the home for strategy recommendation and selection, task assignments, progress, completion summary, and verification. If a current plan's selected strategy or task assignments exist only in legacy data, leave that data untouched and resolve the plan from the approved conversation and existing documents when next resuming work; do not fabricate an approval or parse the archived records during migration. Update business, technical, and plan relationship templates to link sibling HTML documents and applicable decisions without requiring an execution-record link. Remove telemetry/rating columns and active record links from library indexes; show document titles, descriptions, statuses, and last-updated dates instead. Preserve historical prose and existing valid archival links in user-authored documents on the leave path. Remove links to deleted files on the delete path.

When migrating decisions, preserve stable links and history. Consolidate old one-decision documents into living category documents only when ownership, category, and anchors are unambiguous; otherwise keep and index the original artifacts. Never create placeholder category files merely to match an example taxonomy.

Add the reuse-analysis workflow and template sections for future or actively revised specs. Do not invent past analysis, recommendations, or user approvals to fill historical documents. Remove blanket no-new-spec decision-write prohibitions and inference-only decision rules where they would discard an explicitly approved reuse-analysis choice; preserve the ban on new feature artifacts in that branch and the technical approval gate for active-decision changes.

Refresh the generated skill's HTML guidance and the business, technical, plan, and decision-category templates for body readability. Preserve customized styles, the existing section hierarchy, semantic colors, document links, and factual contracts. Apply the guidance to new or intentionally revised documents; do not bulk-reformat historical specs or decisions.

In `SKILL.md`, instruct the author to make paragraphs and lists as readable as possible for both scanning and careful reading. Lead with the main idea, separate dense commitments from rationale or exceptions where useful, and keep connected prose together. Choose `<strong>` for consequential clauses or descriptive list lead-ins, `<em>` for meaningful emphasis, `<code>` for literals, and sparse `mark` or `.keyword` for a short critical phrase. Leave plain text when it is already clear. Use lists for comparable items, ordered lists for meaningful sequences or priorities, and supporting paragraphs inside longer items. Choose emphasis from the content, never a keyword matcher, fixed quota, or mandatory treatment for every item. Review the body text for visible commitments, distinctions, exceptions, and next actions without changing requirements or losing qualifiers; meaning must remain clear without color.

Give each template concise, filled paragraph and list examples appropriate to its purpose: product commitments and acceptance criteria in business specs, boundaries and identifiers in technical specs, sequential actions and verification in plans, scope and tradeoffs in decisions. Label example content visibly as illustrative, with instructions to replace it with actual project facts and remove the sample label when generating a real document. These are adaptable examples, not approved requirements or a fixed formatting recipe:

```html
<p class="note">Illustrative content — replace with this document's actual requirements.</p>
<p><strong>Export the complete active result set.</strong> Readers can reuse saved material without collecting pages by hand.</p>
<p>The current filters and visible ordering define the scope of the download.</p>
<ul>
  <li><strong>Complete results.</strong> Include <em>all</em> matching items across pages.</li>
  <li><strong>Failed page.</strong><p>Explain the failure and offer a retry. Produce <mark>no partial download</mark>.</p></li>
</ul>
```

```html
<p class="note">Illustrative plan content — replace with approved tasks and actual identifiers.</p>
<p><strong>Preserve existing export behavior.</strong> The proposed <code>completeActiveResults()</code> helper shares only page completion.</p>
<ol>
  <li><strong>Establish the baseline.</strong> Run existing export checks and record the result.</li>
  <li><strong>Extract the approved helper.</strong> Keep queries and permission checks in each feature.</li>
  <li><strong>Verify both consumers.</strong> Check complete results, ordering, and later-page failure.</li>
</ol>
```

Support the examples with comfortable paragraph and list-item spacing, visually distinct semantic bold/italic text, and legible inline code that wraps long identifiers. Reuse the existing light/dark palette and readable body size; avoid making essential supporting details faint or relying on color to indicate importance. Review a representative paragraph and list in the rendered templates, not just their headings.

If no migration versions are printed because the installed schema is current, validate it and report any drift; do not rewrite files merely to produce a change. Never downgrade an installation whose marker is newer than `{{schemaVersion}}`.

## 5. Validate

Before finishing:

- confirm `CLAUDE.md` is a regular file containing `@AGENTS.md`;
- confirm `.agents/skills/spec-library/SKILL.md` has the latest schema marker;
- confirm `SKILL.md` records the resolved testing discipline by name and its implement-and-verify step follows that discipline (not a hardcoded `tdd` requirement);
- confirm `SKILL.md` always runs mandatory discovery when activated and includes a provisional list of owning, consulted, and potentially changed specs and decisions by exact path or anchor;
- confirm discovery inspects actual related code, callers, tests, and reusable lower-level logic, offers reuse/separate/custom choices with exactly one justified recommendation when candidates exist, and records evidence rather than forcing options when none fit;
- confirm reuse and abstraction require an explicit user choice distinct from documentation selection, existing authorization is retained, and material scope changes return for approval;
- confirm business templates record reuse alternatives, recommendation/rationale, selected approach/custom conditions, approval status, and product consequences; technical templates add source paths/symbols, consumers, boundaries, compatibility checks, and decision anchors; plans carry the approved scope;
- confirm approved reuse-analysis choices are recorded in canonical decisions and indexes even without a new feature spec or when inferable from code, with alternatives, rationale, scope, approval/date, and implementation state reconciled at close-out;
- confirm `SKILL.md` automatically updates an existing owning spec after discovery without business-spec approval, preserves prior history, and reports every consulted or changed spec and decision;
- confirm `SKILL.md` asks `Create a new spec` versus `Continue without a new spec` only when no existing spec owns the behavior, labels exactly one choice `(Recommended)`, and creates no new feature spec unless the user selects it;
- confirm every branch preserves explicit technical approval for migrations, data, auth, billing, security, public contracts, infrastructure boundaries, and active-decision changes;
- confirm every feature keeps one integrated `plan.html` with detailed classified tasks instead of independent task-plan files;
- confirm delegation recommendations require an explicit user strategy selection, same-session is always offered, and strategy recommendations and selected assignments live in `plan.html`;
- confirm active instructions, templates, and indexes no longer create or maintain execution records, collect telemetry, request human ratings or qualification, or invoke the removed analytics commands;
- confirm close-out finishes with implementation, verification, and exact spec/decision impact without waiting for a rating;
- confirm legacy records and ledgers were preserved byte-for-byte by default, or only the inventoried files were deleted after the explicit choice; verify that no dangling links remain after deletion;
- confirm older migration steps did not recreate tracking artifacts, export history, or invent feedback;
- confirm `.claude/skills/spec-library` resolves to `../../.agents/skills/spec-library`;
- confirm the root library index, current templates, supporting indexes, specs, plans, and decisions are HTML or that old Markdown copies were intentionally preserved to avoid data loss;
- confirm uncustomized current templates and active generated artifacts use accessible artifact-specific accents, visible text labels and status badges, and restrained highlights for consequential keywords;
- confirm the skill guides content-aware paragraph/list readability without deterministic emphasis rules; review each template's illustrative body examples for useful grouping, spacing, and semantic emphasis, and confirm sample facts and labels are replaced in real documents;
- confirm business, technical, and plan templates use `Document relationships` tables with role, exact document link, and a useful reason instead of a vague `Related` list;
- confirm feature siblings link directly to one another, applicable decisions use exact stable anchors, and related-spec links meet the dependency/shared-contract/scope-interaction/supersession criteria;
- confirm `decisions/index.html` routes agents to populated category documents, technical specs have a concise Decision impact section, and active-decision changes require explicit approval;
- confirm decision documents preserve explicitly approved reuse-analysis choices and otherwise contain only choices whose intent is materially safer to preserve than infer, with no empty categories, routine implementation details, or invented historical approvals;
- confirm no specs, plans, decisions, unrelated skills, or unrelated instructions were lost;
- search for stale references to the previous simplest-sdd behavior;
- run the repository's relevant formatting or documentation checks;
- report what changed, what was already current, and any assumptions.

Stop after reporting the validated migration. Do not begin feature or delivery work unless it was explicitly requested in the active prompt.

Do not commit unless the user explicitly asks.
