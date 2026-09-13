# Simplest SDD Update Instructions

Update the installed simplest-sdd workflow to schema version `{{schemaVersion}}`. This release focuses on improving the generated spec-library skill and `AGENTS.md`: precise activation, conditional references, and completion with fewer redundant approval stops. Preserve the fixed discovery question minimums, the project's contracts, and explicit policies.

The `npx simplest-sdd` CLI prints instructions only. It has not modified files for you.

{{detectedState}}

The current rules below take precedence over historical migration steps. Apply the current contract directly, not every intermediate workflow. Preserve at least eight project-discovery questions during init and at least five request-refinement questions when the feature workflow activates, waiting for every answer. Do not restore compulsory strategy selection, repeated approvals for the same scope, unconditional context loading/testing, or arbitrary retry stops. Execution records, telemetry, and human ratings were removed in 0.15.0 and must not be recreated. Historical entries explain differences; they are not additional active instructions.

{{versionHistory}}

## Rules

- Preserve unrelated and user-authored instructions, skills, project conventions, specs, plans, decisions, approvals, and history. Replace inherited simplest-sdd defaults that conflict with the current contract; preserve genuine explicit local policy.
- Honor user instructions and authorization already established in the conversation, subject to higher-priority host instructions and permissions. Do not require confirmation for routine authorized instruction edits. Resolve only material uncertainty about local ownership or policy, continuing independent work while an answer is pending.
- Use `.agents/skills/spec-library/SKILL.md` and its `simplest-sdd-schema-version` marker to identify the installed schema. A workflow with no marker is unversioned.
- Keep `AGENTS.md` canonical, `CLAUDE.md` a regular file containing `@AGENTS.md`, `.agents/skills/spec-library` canonical, and `.claude/skills/spec-library -> ../../.agents/skills/spec-library` the relative compatibility symlink. Preserve unique instructions before consolidating compatibility files.
- Keep durable library artifacts and templates as clean static HTML, preserving readable body formatting, semantic artifact accents, document relationships, stable anchors, and custom styling. Markdown is appropriate for conditional workflow references.
- Never delete user-authored specs or decisions during update. Do not bulk-rewrite historical contracts or infer missing historical approvals.
- Do not create or maintain execution records, collect telemetry, or ask for execution ratings or qualification. Preserve legacy files unless the user explicitly selects the identified files for deletion below.
- Complete the migration and relevant validation. Feature work, commits, pull requests, deployment, monitoring, and review handling require authorization covering those actions; an update request alone does not grant it.

## 1. Inspect Current Installation

Read applicable agent instructions, `AGENTS.md`, `CLAUDE.md` and its resolved target when needed, `SKILL.md`, its linked workflow references, and current template structure. Check the Claude compatibility link. Use manifests, CI, and relevant testing instructions to verify the resolved testing discipline; do not load every installed skill or inspect the whole product source tree.

Inspect library indexes and filenames to identify formats, links, and ownership. Open representative or affected specs and decisions only when needed to preserve a customization or validate migration fidelity. Inventorying the library does not require reading every historical document.

Inventory the exact paths of legacy feature `execution.json` files under `.agents/skills/spec-library/specs/` and `.agents/skills/spec-library/data/executions.jsonl` when present. Inspect filenames and file types without parsing, validating, or rewriting record contents. Do not follow symlinks outside the canonical library or count the Claude link as another installation. Invalid old data must not block the instruction update.

If the installed marker is newer than `{{schemaVersion}}`, report it and stop without changing files or offering cleanup. Do not downgrade it.

## 2. Audit The Skill And Agent Guidance

Compare the current contract with the installed skill and generated `AGENTS.md` sections. Use relevant version history to identify gaps, not as a requirement to narrate or execute every version jump. Note what is inherited framework text, genuine project customization, already current, or missing. Older generated text saying “preserve all approval gates” does not turn obsolete simplest-sdd defaults into user policy. If ownership is unclear, preserve that text and resolve the specific uncertainty; do not block unrelated updates.

Apply these changes to the actual installed instructions:

- **Discovery and skill selection:** give the skill a short description of maintaining feature specs and decisions for specified behavior or product work needing a durable contract. Keep clear low-risk edits and presentation-only work out of feature discovery unless they change a specified contract or have an independent trigger. Historical documentation questions use lookup only. Substantial product review, material ambiguity, architectural/data/security risk, or a multi-session handoff can justify the workflow; topic mentions or ordinary delegation alone cannot.
- **Entrypoint:** keep `SKILL.md` to purpose, activation, conditional reference routes, core documentation/authorization boundaries, and completion. Preserve supported optional frontmatter and invocation policy. Do not paste the installer or a full workflow into the root.
- **Conditional detail:** create or reuse focused references corresponding to `references/discovery.md`, `references/authoring.md`, and `references/execution.md`. Explain when each is read; link any retained custom paths accurately. Move content to its relevant reference instead of duplicating it. Keep embedded CSS and output examples in the HTML templates and authoring reference, not in the skill entrypoint.
- **Agent guidance:** keep the generated `AGENTS.md` portion to project purpose/users, stable principles and boundaries, essential verified commands, and a short router. Route workflow work to `SKILL.md`, library questions to the known document or `index.html`, and decision questions to the known record or `decisions/index.html`. Link supporting docs with task-specific reasons to read them. Retain the update/remove maintenance commands. Preserve unrelated instructions rather than replacing the whole file.

In `references/discovery.md`, retain relevant-code inspection, ownership classification, consequential reuse analysis, documentation branches, and approval semantics:

- Use a known owning spec or decision directly, otherwise the relevant index. Inspect only related behavior, actual consumers, constraints, and verification. Do not require all indexes or a full repository map before every change.
- Preserve or restore the fixed discovery minimums: init asks at least eight material product, business, and workflow questions and waits for every answer before installation edits; each new request activating the feature workflow asks at least five material request-refinement questions and waits for every answer before documentation-branch decisions or implementation. Clear requests, existing-owner changes, and a prior no-new-spec choice do not skip the round. Missing goal or clues/examples questions are additional and do not count toward either minimum. A consequential reuse choice can count toward the five. Use existing facts to ask sharper questions rather than repeat them. Resume an already completed qualifying round for unchanged scope without replaying it; otherwise obtain any missing answers. Keep these rules in the discovery reference and route to the mandatory round from SKILL.md. Do not rerun bootstrap discovery merely to migrate instruction files.
- Show provisional documentation impact with exact owning/consulted/changed spec paths and decision anchors, then update it when scope changes and at close-out. Do not repeat unchanged inventories at every message.
- For a consequential reuse boundary, compare reuse as-is, a separate implementation, and a custom adaptation or shared extraction; recommend one with evidence and obtain the outstanding choice. An explicit choice already supplied for the same scope counts. Routine compatible helper reuse needs no separate question. When no candidate fits, state the inspected evidence without forcing alternatives.
- Automatically refresh an existing spec that owns the changed behavior and other existing changed contracts without business-spec approval, preserving history and reporting exact paths. Do not ask to create another spec merely because the current task is new.
- When no spec owns the behavior and the user has not already chosen, offer `Create a new spec` versus `Continue without a new spec`, with exactly one `(Recommended)` label. New feature artifacts require that selection, then business-spec approval of the generated contract before implementation. Creating the spec does not itself approve its contents. Preserve prior explicit approval of unchanged scope; do not replay selection gates on resume.
- The no-new-spec branch creates no new business/technical spec, plan, or feature index entry. Maintain existing changed contracts and record approved reuse decisions in canonical category documents and decision/root indexes as the narrow exception.
- Preserve explicit technical approvals in every branch for concrete changes to migrations, data boundaries, auth, billing, security, public contracts, infrastructure boundaries, or active decisions. First check what the user already authorized. A topic mention or file touch is not a fresh approval event. Spec selection, automatic maintenance, or silence does not approve an unrelated technical change. Prepare the concrete proposal and wait only before the unauthorized action. If a local rule blocks work, cite its exact file and instruction and explain the unresolved decision.

In `references/authoring.md`, retain the library's durable artifact contract:

- Use `business.html`, `technical.html`, and one integrated `plan.html` per feature when a spec is selected or already owns the behavior. Keep product intent, technical design, and execution progress distinct. The business spec uses product language; code paths and symbols belong in technical context or task handoffs.
- Preserve semantic artifact colors, visible labels/status, accessible focus styles, light/dark readability, concise paragraphs, meaningful list grouping, and selective semantic emphasis. Keep content-aware editorial judgment, not fixed keyword/highlight quotas. Templates demonstrate formatting with clearly illustrative content that is replaced in real artifacts.
- Preserve each `Document relationships` table with Role, Document, and Why it matters. Link siblings and applicable decision anchors directly; related-spec links require a behavior dependency, shared contract, conflicting scope, or supersession, not topic similarity. Preserve stable relative paths and anchors.
- Keep the technical spec's `Decision impact` section or `No durable decision impact` statement. Persist every explicitly approved reuse choice, including isolation and no-new-spec work, with alternatives, rationale, scope, consumers, approval/date, and implementation state. Extend a compatible existing decision rather than duplicating it. Do not change an active rule before required approval; do not invent past approvals.
- Keep other decisions sparse: create no empty categories or routine inferable records. Preserve stable category anchors and history. Reconcile approved intent as pending, shipped, partially implemented, or not implemented according to evidence; unselected ideas stay proposals.
- Maintain the root/spec/decision indexes and their relevant internal links, status, descriptions, and dates when documents change. Keep history and valid archival links.

In `references/execution.md`, retain project-specific mechanics and useful completion criteria:

- Record the resolved testing discipline by name and relevant path/commands. Link existing TDD or other policy rather than duplicating it. Preserve an intentional test-free stance. If none exists, record that fact and use appropriate existing verification; do not install a testing skill or block the update to choose one.
- Keep one integrated plan; include task outcomes, scope, dependencies, verification, and progress. Add classification, effort/risk/confidence, capability profiles, assignments, planning commits, and detailed executor packets only when they help an actual handoff or fragile task. Replace unconditional “Read first” lists with context linked to the task that needs it.
- Honor explicit local delegation, model, cost, and stop policies. Otherwise use same-session for small/coupled work and bounded independent delegation when available and useful, without a compulsory strategy menu. Where a selection is needed, always offer same-session. Keep recommendations model-agnostic and respect available runtime capabilities.
- Verify changed behavior and complete required checks; avoid irrelevant or repeated broad suites after passing results. Repair introduced failures and rerun affected checks. Retain justified risk-specific validation. Do not invent claims that tests are disposable or production-free.
- Continue authorized implementation through relevant inspection, verification, fixes, and document close-out. Remove current-prompt-only authorization, automatic stops for routine plan drift, and arbitrary two-revision caps. Real blockers, changed contracts, and explicit stop points still require attention. Do not grant permission for delivery actions merely by selecting delegation.
- Close out with the outcome, verification evidence, remaining limitations, and exact spec/decision impact, without ratings or execution telemetry. Improve the relevant instruction only for an observed reusable reason, rather than growing new universal checklists.

## 3. Choose What To Do With Old Execution Records

When legacy records or the ledger exist, show the exact candidate paths and ask one question: **Would you like to leave old execution records untouched or delete them?** Offer:

1. `Leave old records untouched (Recommended)` — the default; preserve every existing record and ledger byte-for-byte as inactive history. Do not upgrade schemas, append runs, add evaluations, validate, export, or rebuild this data.
2. `Delete old records` — delete only the identified feature `execution.json` files and `data/executions.jsonl` after the user explicitly selects deletion for those paths. This also removes any ratings stored inside them.

Wait for the user's choice before handling those files. Silence or an unanswered question is not deletion approval: leave the data untouched while continuing independent instruction and template updates. If the user already explicitly chose for the identified files in the active request, honor that choice without asking again. If no legacy data exists, skip the question and report that none was found. On a current-version installation, offer this choice when retained legacy data still exists; never infer deletion from a previous update.

Do not delete a whole feature folder, `specs/`, `data/`, the library, plans, business/technical specs, decisions, or unrelated files. Do not follow symlinks or delete targets outside the inventoried library paths. If ownership is ambiguous, preserve the file and report it. After an approved deletion, remove dangling references to the deleted files while preserving document content and decision history. Report the selected choice and exact files preserved or deleted; if unanswered, report that cleanup remains pending and the files were preserved.

## 4. Apply The Migration Conservatively

Implement the missing changes identified above directly. For missing structures, templates, or ambiguous baseline details, consult `prompts/init.md` from the same simplest-sdd package, or print it with `npx simplest-sdd@{{packageVersion}} init`. Use it as the target contract, not as an instruction to rerun bootstrap discovery or overwrite this repository. On an unversioned or missing installation, establish the current structure while preserving unique content; no intermediate version is required.

These current rules supersede conflicting historical ceremonies and override every older instruction to create, upgrade, record, validate, export, or rebuild execution data or to request human feedback. Skip those older steps entirely, including for missing or unversioned installations; never create intermediate records or ratings only to remove them later.

Remove obsolete simplest-sdd tracking, analytics, telemetry collection, and rating/qualification instructions from active skill/reference files, generated `AGENTS.md` guidance, templates, and indexes. Stop invoking the removed `analytics` and `codex-usage` commands. Retire an uncustomized generated `templates/execution-template.json`; preserve customized or ambiguously owned support files as inactive history. Remove active execution-record links and telemetry columns. Preserve historical prose and existing valid archival links in user-authored documents on the leave path; remove links to deleted files on the delete path.

Do not parse legacy records to reconstruct task assignments or approvals. Use the approved conversation and durable documents when resuming a plan. Keep old one-decision files when safe consolidation into a category is unclear. Preserve factual contracts, approval evidence, stable IDs, anchors, and valid relationships.

Update templates only where needed to match the new authoring and proportional planning guidance; keep compatible styling and historical documents intact. Fix links when moving workflow content to references. Do not perform unrelated product refactors or audit every project skill.

If the installed schema is already current, validate relevant instruction routing and report drift. Repair a demonstrated mismatch within the update's scope, but do not rewrite compliant files merely to produce a diff. Advance the marker to `{{schemaVersion}}` only after the current workflow and valid reference links are present.

## 5. Validate

- Verify the current marker, valid frontmatter and preserved metadata, concise skill entrypoint, conditional reference links, canonical `AGENTS.md`, regular Claude import, and relative skill symlink.
- Verify the eight-question setup minimum and five-question activated request-refinement minimum, with all-answer waits and additional goal/clues prerequisites, are preserved. Remove conflicting instructions that skip required discovery, compulsory strategy menus, repeated approval of unchanged scope, blanket documentation loads, arbitrary retry limits, or obsolete telemetry lifecycle. Genuine local policies remain intact and are distinguished from generated defaults.
- Walk through a clear existing-spec correction, an ambiguous new feature, a request that already chooses no new spec and its reuse approach, a resume after approval, a presentation-only edit, and a historical decision question. Confirm routing, required decisions, and stopping conditions fit the request.
- Confirm existing-owner maintenance is automatic; new feature specs retain selection and business-spec approval; consequential reuse choices persist in decisions even without a new spec; and concrete sensitive changes wait only for missing authorization. Do not infer historic approval or mark unshipped intent as applied.
- Verify moved references and affected template/index links and anchors. If HTML changed, check representative body readability, semantic labels/colors, focus styles, and a rendered sample. Do not bulk-render unchanged historical documents.
- Confirm user-authored instructions, specs, plans, decisions, skills, and legacy records survived, or only the inventoried legacy files were deleted after explicit selection. Verify no dangling links remain after deletion.
- Run relevant documentation or build checks once, fix introduced failures, and rerun affected checks. Report what changed in `SKILL.md`, its references, and `AGENTS.md`, why each change helps, what was already current, validation, and any unresolved customization or cleanup choice.

Finish the authorized migration and report the result. Do not start feature or delivery work unless included in the user's authorized scope.
