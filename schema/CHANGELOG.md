# Simplest SDD Schema Changelog

This changelog tracks the installed simplest-sdd schema. Workflow releases advance the schema version; CLI-only releases may leave it unchanged.

## 0.17.1 - 2026-09-14

- Requires the agent to explicitly present the discovery questions to the user, request their answers, and wait for every answer. The fixed minimums remain eight material init questions before installation edits and five material feature-refinement questions before documentation-branch decisions or implementation.
- Makes the short question gate visible in generated `AGENTS.md` and `SKILL.md`, with the full procedure in `references/discovery.md`.
- Prevents repository facts, inferred answers, agent recommendations, or silence from counting as user answers. An approved plan alone does not bypass an incomplete round.
- Reuses discovery only when the required questions were actually asked of and answered by the user for unchanged scope. Partial rounds obtain missing answers and any questions still needed to reach the minimum; existing approvals and activation boundaries remain intact.
- Requires questions and spec interactions in user-visible responses. The final answer summarizes every consulted, created, or updated spec with exact links or paths and a brief explanation, even when already reported in progress. Private reasoning, internal plans, tool logs, and file edits alone do not count; pending proposals remain distinct from completed edits.

### Migration from 0.17.0

1. Add the explicit five-question ask-and-wait gate to generated `AGENTS.md` and the `SKILL.md` discovery route. Route execution back to discovery if the required user question-and-answer round is missing or incomplete.
2. Update `references/discovery.md` and any existing setup guidance to require presenting the questions in the conversation or an available question tool and requesting the user's answers. Preserve the eight/five minimums and additional goal/clues prerequisites. Only user answers or explicit confirmation of presented answers satisfy discovery.
3. Require actual prior user questions and answers before reusing a round for unchanged scope. Obtain missing answers and questions for partial rounds, retain established approvals, and do not rerun bootstrap discovery solely to migrate instructions.
4. Add the visible interaction requirement to `AGENTS.md` and `SKILL.md`, with discovery-response details in `references/discovery.md` and final reporting in `references/execution.md`. Require actual questions and spec activity in assistant responses, including exact links or paths, statuses, and explanations. Read-only documentation answers name consulted sources without starting feature discovery.
5. Validate clear existing-owner work, partial answers, an approved plan without discovery, and a completed same-scope round. Check actual user-facing questions, consulted-source reporting, and a complete final spec summary that distinguishes pending proposals from completed edits. Preserve project policies, artifacts, and history; set the marker to `0.17.1` after validation.

## 0.17.0 - 2026-09-12

- Applies [OpenAI's GPT-6 Astra skill and prompt guidance](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra) while keeping model recommendations provider-independent.
- Gives the skill a short description with precise activation and exclusion cases. Keeps generated `AGENTS.md` focused on durable project context, essential commands and boundaries, and a lightweight context router.
- Keeps `SKILL.md` as the workflow entry point and loads conditional instructions from `references/discovery.md`, `references/authoring.md`, and `references/execution.md` only when relevant.
- Retains inspection, reuse analysis, and visible documentation impact with at least eight material init questions and at least five material questions for each activated request-refinement round, waiting for every answer. Goal and clues/examples prerequisites are additional. Completed discovery and explicit approvals persist for unchanged scope.
- Preserves explicit choices for consequential reuse or abstraction and their canonical decisions; routine compatible reuse within authorized scope needs no separate reuse-selection question.
- Preserves new-spec selection and business-spec approval, automatic existing-owner updates, and concrete technical approval boundaries without requesting the same authorization again.
- Scales reading, planning, delegation, and testing to the task. Useful independent delegation follows runtime capabilities and explicit local policy without a compulsory strategy menu.
- Completes authorized implementation, relevant verification, and document close-out without arbitrary retry limits or repeated checks that add no evidence. Explicit stop points and real blockers still govern execution.
- Focuses migration on the skill, its references, and generated `AGENTS.md` guidance while preserving genuine customizations, factual contracts, history, compatibility paths, and inactive legacy data.

### Migration from 0.16.0 and earlier

1. Apply the current rules directly from any older or unversioned installation. They preserve the eight-question init and five-question request-refinement minimums while superseding repeated approval gates, compulsory strategy menus, rigid context/testing requirements, and retired tracking. Do not recreate intermediate workflows or rewrite historical release notes.
2. Audit `SKILL.md` and generated `AGENTS.md` guidance for duplication and obsolete simplest-sdd constraints. Preserve genuine user-authored policies and customizations; distinguish them from inherited framework defaults before retaining conflicting rules.
3. Rewrite frontmatter with a concise activation description. Reduce `AGENTS.md` to durable project context, essential commands and boundaries, and a precise router for workflow work, read-only documentation questions, and direct low-risk changes.
4. Keep activation, branch decisions, authorization boundaries, and close-out in `SKILL.md`. Move conditional detail into directly linked `references/discovery.md`, `references/authoring.md`, and `references/execution.md`, preserving HTML contracts and customized content.
5. Preserve or restore at least eight material init questions before installation edits and at least five material request-refinement questions before documentation-branch decisions or implementation, waiting for every answer. Goal and clues/examples prerequisites are additional; a consequential reuse choice can count toward the five. Use known facts to sharpen questions and resume completed discovery without replaying it. Do not rerun bootstrap discovery during instruction migration. Keep consequential reuse approval while allowing routine compatible reuse within authorized scope.
6. Preserve `Create a new spec` versus `Continue without a new spec` when no owning spec exists, approval of newly generated business specs, automatic existing-owner maintenance, and concrete technical approval boundaries. Existing explicit authorization counts for unchanged scope. Preserve approved reuse decisions in every branch without inventing historical approvals.
7. Replace compulsory strategy selection with task-appropriate execution under the user's authorized scope and explicit local policies. Allow useful bounded delegation when supported, scale plan and executor detail to dependencies and risk, and retain one integrated plan.
8. Keep the resolved testing discipline and select checks relevant to changed behavior. Remove blanket context loading, irrelevant test requirements, repeated verification without new evidence, current-prompt-only authorization, and arbitrary retry stops from inherited guidance. Complete authorized implementation, verification, and close-out while honoring explicit stop points.
9. Validate routing examples, linked references, preserved approvals, relevant verification, and removal of superseded framework rules from active instructions. Avoid bulk changes to historical artifacts; preserve compatibility and legacy cleanup behavior. Set the schema marker to `0.17.0` after validation, then report changed files and rationale.

## 0.16.0 - 2026-09-11

- Improves HTML body readability through editorial judgment: lead with the main idea, keep paragraphs focused, and use meaningful list labels when they help readers scan.
- Uses semantic `strong`, `em`, and `code` where appropriate, with sparse `mark` or `.keyword` highlights for consequential phrases. Plain prose remains appropriate; there are no deterministic keyword rules or formatting quotas.
- Adds clearly labeled illustrative paragraphs and lists to the business, technical, plan, and decision templates, with instructions to replace example facts with actual document content.
- Adds light paragraph and list spacing and semantic inline styling while preserving artifact colors and accessibility.

### Migration from 0.15.0

1. Update `SKILL.md` with content-aware paragraph and list readability guidance, semantic inline emphasis, focused prose, and meaningful list labels without deterministic formatting rules or quotas.
2. Refresh business, technical, plan, and decision templates with labeled illustrative paragraphs and lists and instructions to replace their example facts. Add light body and inline styles while preserving compatible custom styling, artifact colors, and accessibility.
3. Apply the guidance to new or intentionally revised documents. Do not bulk-rewrite historical specs or decisions; preserve factual contracts, history, approvals, anchors, and valid links.
4. Set the installed workflow marker to `0.16.0`. Preserve existing discovery, approval, execution, and legacy-record cleanup behavior; this release changes presentation guidance only.

## 0.15.0 - 2026-09-11

- Removes execution records, human evaluation and qualification prompts, rating-response waits, and the execution analytics ledger. Work ends after implementation, verification, and required spec and decision maintenance.
- Removes the execution schema and template, `analytics` and `codex-usage` commands, and active telemetry instructions, examples, links, and index columns.
- Keeps task classifications, estimates, capability recommendations, approved execution strategy, progress, and verification in `plan.html` without per-run model, token, timing, rating, or analytics records.
- During update, lists existing legacy record paths and offers one explicit choice: `Leave old records untouched (Recommended, default)` or `Delete the identified old records`. Deletion requires an explicit selection; silence preserves every old record.
- Leaves preserved records byte-for-byte unchanged as inactive history. Deletes only explicitly selected record and ledger files, then removes dangling links without deleting spec folders, decisions, unrelated data, or other history.
- Overrides obsolete telemetry migrations on upgrades from every older release, without creating intermediate records, evaluations, or analytics artifacts. Historical release notes remain available as history.
- Preserves discovery, documentation-branch choices, approved reuse decisions, independent technical approvals, and the resolved testing discipline.

### Migration from 0.14.0 and earlier

1. Apply the current workflow directly from any older or unversioned installation. These removal instructions override every older migration step that would create, migrate, validate, export, rebuild, or maintain execution records, human ratings, analytics, or `codex-usage` telemetry. Never recreate intermediate telemetry artifacts or run obsolete commands before removing them.
2. Remove execution tracking, human evaluation and qualification prompts, rating-response waits, telemetry collection, analytics rebuilds, and `codex-usage` instructions from active `SKILL.md`, `AGENTS.md` workflow notes, templates, examples, and close-out instructions. Preserve implementation and verification reporting, spec and decision maintenance, discovery, approved reuse choices, and independent technical approvals.
3. Retire generated execution templates and schema references, analytics documentation and command examples, execution-record relationship requirements, and execution or rating index columns. Remove active links to retired support files and execution records while preserving business, technical, plan, and decision content and valid relationships.
4. Keep task classifications, estimates, capability recommendations, the approved execution strategy, progress, and verification in `plan.html`. Do not transfer old per-run records, model or token usage, duration, ratings, or analytics into plans or a replacement telemetry store.
5. Inventory the exact legacy `specs/**/execution.json` and `data/executions.jsonl` paths in the canonical spec library without parsing their contents or following the Claude compatibility symlink as a second library. If any exist, show every affected path and ask one question offering `Leave old records untouched (Recommended, default)` or `Delete the identified old records`.
6. Wait for an explicit deletion selection before deleting any old record. Neither the update request, the recommended default, nor silence authorizes deletion. Continue independent update work with the records preserved while the choice is pending. An existing explicit selection covering the identified files counts; do not ask again. Skip the cleanup question when no old records exist.
7. For `Leave old records untouched`, preserve every record and ledger byte-for-byte as inactive history. Do not parse, validate, upgrade, normalize, append to, rewrite, rename, relocate, or export them, or resume recording or rating them later. No response also preserves every record and must not be reported as an explicit user choice.
8. For `Delete the identified old records`, delete only the exact record and ledger files covered by the explicit selection, then remove dangling links from library documents and indexes. Never blanket-delete directories, spec folders, `business.html`, `technical.html`, `plan.html`, decisions, unrelated data, or other history. Resolve unclear ownership without broadening deletion.
9. Refresh active templates and indexes without reading archived records. Verify that current instructions have no recording or rating lifecycle, telemetry-dependent links or columns, or command that parses or regenerates old records. Treat earlier release entries below as historical context wherever these removal instructions supersede them.
10. Set the installed workflow marker to `0.15.0`. Report changed files, the user's cleanup choice or pending/no-records status, and exact legacy files preserved or deleted. There is no replacement execution schema or record-format migration.

## 0.14.0 - 2026-09-11

- Inspects related implementations, actual callers, tests, and reusable lower-level logic during discovery. Recommendations compare shared business rules, compatibility, coupling, and preservation of existing behavior.
- Offers reuse as-is, a separate new implementation, and a custom adaptation or shared extraction when viable related logic exists, with exactly one reasoned `(Recommended)` option. If no suitable candidate exists, records the inspected evidence without forcing artificial reuse choices.
- Requires an explicit implementation choice before applying the approach. An already explicit instruction counts; unchanged approved scope needs no repeat approval. Choosing a documentation branch never selects an implementation approach.
- Records analysis, alternatives, the model's recommendation and reason, approved user choice and custom conditions, approval status, and consequences in product language in the business spec. The technical spec names exact source paths, symbols, callers, abstraction boundaries, verification, and decision links; the plan includes only approved scope.
- Stores every explicitly approved reuse-analysis choice, including keeping a separate implementation, in a canonical category decision and the decision and root indexes, regardless of ordinary decision-promotion heuristics or the no-new-spec branch.
- Keeps unselected alternatives and unapproved ideas out of active decisions. Records approved intent with implementation pending, then reconciles the decision with what shipped, including partial or unimplemented scope, at close-out.
- Allows approved decision and necessary index writes as a narrow no-new-spec exception alongside existing-contract maintenance. That branch still creates no new feature spec, plan, execution record, or analytics record.
- Preserves independent technical approvals, including active-decision changes, stricter explicit local policies, historical artifacts and approvals, and execution schema `1.1.0`.

### Migration from 0.13.0

1. Update discovery in `SKILL.md` to inspect related implementations, their actual callers and tests, and reusable lower-level logic. Compare shared business rules, compatibility, coupling, and behavior-preservation risks before proposing reuse, adaptation, extraction, or a separate implementation.
2. When viable related logic exists, present reuse as-is, a separate new implementation, and a custom adaptation or shared extraction with exactly one `(Recommended)` option and its reason. Document inspected evidence and limitations when no suitable candidate exists instead of inventing candidates or forced options.
3. Wait for the user's explicit implementation choice before implementing the proposed approach. Count an already explicit instruction as approval and avoid asking again unless scope changes. Keep this choice distinct from `Create a new spec` versus `Continue without a new spec`, and preserve independent technical approvals.
4. Extend the business template and newly created or intentionally updated business specs with product-level existing-logic analysis, alternatives, model recommendation and reason, approved user choice and custom conditions, approval status, and consequences. Do not infer historical approvals or broadly rewrite old specs.
5. Extend the technical template with exact candidate source paths and symbols, actual callers and consumers, the approved reuse or abstraction boundary, preservation checks, and a direct canonical decision link. Constrain plan tasks and acceptance checks to the approved implementation scope.
6. Make every explicitly approved choice from reuse analysis, including choosing isolation over reuse, a required canonical category decision with a stable ID and anchor, rationale, alternatives, approved scope and consumers, exceptions and custom conditions, approval evidence, and separate implementation state. This requirement overrides the routine inferability and cross-feature decision-promotion heuristic.
7. Keep unselected alternatives and unapproved ideas as analysis, never active decisions. Preserve explicit technical approval before changing an existing active decision, amend compatible decisions with history, and supersede only when the approved meaning fundamentally changes.
8. Record an approved choice promptly as approved intent with implementation pending, refresh `decisions/index.html` and the root library index, and link applicable business and technical specs to the canonical decision. Approval of an approach does not certify that it has been implemented.
9. Permit these approved decision and necessary index writes on `Continue without a new spec` as a narrow exception to its artifact restrictions. Preserve required maintenance of existing contracts, but create no new feature spec, plan, execution record, or analytics record and add no spec-only approval or human-evaluation steps to that branch.
10. At close-out in every branch, reconcile the decision and relevant indexes with the actual implementation and verification, including partial, changed, or unimplemented scope. Seek approval for changed implementation scope instead of silently broadening the approved abstraction or consumers.
11. Update examples and validation checks for reuse, separate implementation, custom adaptation or extraction, missing candidates, prior explicit approval, and the no-new-spec decision exception. Preserve stricter explicit local policies and untouched historical artifacts without invented approvals or implementation facts.
12. Advance the installed workflow marker to `0.14.0` while retaining execution schema `1.1.0` and its existing evaluation lifecycle. This release requires no execution-record or analytics-format migration.

## 0.13.0 - 2026-08-08

- After implementation and verification, asks for one neutrally worded overall execution rating from 1 to 10, anchored at 1 for failed, 5 for mixed or partially successful, and 10 for excellent, plus an optional comment whenever the request has an execution record.
- Preserves multiple human evaluations in one execution record, with each evaluation linked to the run IDs it covers and tracked through `pending`, `rated`, or `declined` status without overwriting earlier feedback.
- Advances new execution records to execution schema `1.1.0` while keeping analytics compatible with legacy `1.0.0` records and representing missing historical feedback as unavailable rather than inventing it.
- Persists the user's rating, optional comment, or decline before rebuilding execution analytics and refreshing the root library index so evaluation status remains inspectable with the rest of the execution facts.
- Skips the evaluation prompt on the no-new-spec branch and never infers a rating, comment, decline, or historical evaluation on the user's behalf.

### Migration from 0.12.0

1. Update `SKILL.md` so a terminal spec-backed implementation with `execution.json` presents its implementation and verification result, asks the anchored 1-to-10 overall execution question with an optional comment, and waits for the user's response; keep the no-new-spec branch unchanged and skip the question there.
2. Upgrade the execution template, newly created execution records, and legacy records touched by a new execution to schema `1.1.0` with a `humanEvaluations` array that can preserve multiple human evaluations, the run IDs each one covers, optional comments, timestamps, and `pending`, `rated`, or `declined` status. Leave untouched historical `1.0.0` records readable without rewriting or invented feedback.
3. Create the pending evaluation entry before asking, then update that same entry from the user's reply to `rated` or `declined` without guessing a score or comment; treat the reply as close-out continuation rather than a new request.
4. After recording the reply, rebuild the JSONL analytics ledger and refresh the root library index so the latest evaluation status and rating are visible alongside execution details, then finish that execution's close-out. If the same reply contains separate explicit work, route it as a new phase instead of absorbing it into the rated execution.
5. Update analytics validation and exports to accept execution schema `1.1.0` evaluations while continuing to read legacy `1.0.0` records; leave absent historical evaluations unavailable and never backfill inferred feedback.
6. Update the generated execution template, examples, validation checks, and human-facing analytics documentation to explain the anchored scale, optional comment, lifecycle, run linkage, and legacy behavior.

## 0.12.0 - 2026-07-30

- Inspects relevant specs and decisions before discovery and shows their exact paths or anchors with the discovery questions.
- Automatically refreshes an existing spec that owns the changed behavior after discovery, without business-spec approval.
- Automatically maintains other existing specs whose durable contracts must change, even when the user declines a new feature spec.
- Asks `Create a new spec` versus `Continue without a new spec` only when no existing spec owns the behavior, labeling exactly one option `(Recommended)`.
- Preserves explicit technical approval for migrations, data, auth, billing, security, public contracts, infrastructure boundaries, and active-decision changes in every branch.
- Requires discovery, approval, generated-spec, automatic-update, and final messages to name every spec and decision consulted, unchanged, pending, or changed.

### Migration from 0.11.0

1. Classify an existing owning spec separately from merely related or consulted specs and decisions.
2. Add a provisional `Documentation impact` block with exact spec paths and decision anchors to the mandatory discovery message.
3. Automatically update an existing owning spec after discovery, preserve its history, notify exact files changed, and skip business-spec approval.
4. Maintain every other existing spec classified `changed` when the selected branch becomes authoritative; this maintenance does not require permission to create a new spec.
5. Ask whether to create a new spec only when no existing spec owns the behavior; continue to label exactly one choice `(Recommended)`.
6. Preserve all independent technical approval gates in the new-spec, no-new-spec, and automatic existing-spec branches.
7. Show exact consulted and changed spec or decision references at every user-facing checkpoint and in every generated or updated spec.

## 0.11.0 - 2026-07-30

- Always runs the mandatory request-refinement discovery round whenever the spec-library skill activates.
- After discovery, asks the user to choose `Create or update a spec` or `Continue without a spec`, labels exactly one option `(Recommended)`, and waits for the selection.
- Generates or updates specs, plans, execution records, decisions, and indexes only when the user explicitly chooses the spec path.
- Makes the no-spec path a direct same-session implementation and verification flow without spec approval, execution-strategy selection, analytics recording, or artifact close-out.

### Migration from 0.10.0

1. Update the `AGENTS.md` workflow note so activated requests always run discovery before any spec decision.
2. Update `SKILL.md` to present the two spec choices after discovery, label exactly one `(Recommended)`, and wait.
3. Move every spec-library artifact write behind the user's explicit spec choice; discovery answers alone never authorize generation.
4. Define the no-spec choice as direct same-session implementation and verification with no spec-library artifact writes or spec-only approval and close-out steps.
5. Preserve the current five-minute and presentation-only activation rules, independent risk and handoff triggers, resolved testing discipline, and stricter local gates.

## 0.10.0 - 2026-07-29

- Gives business specs, technical specs, plans, and decision documents stable artifact-specific accent colors, with accessible light and dark variants.
- Adds labeled status badges, restrained keyword highlights, callouts, and relationship tables so important contract language is easier to scan without relying on color alone.
- Replaces vague `Related` sections with `Document relationships` tables whose rows identify the linked artifact's role and explain why it matters here.
- Requires direct sibling links among each feature's business, technical, and plan documents, plus the machine-readable execution record from the plan.
- Defines explicit-link criteria for decisions, related specs, exact anchors, indexes, and external evidence. Topic similarity alone is not enough to create a relationship.

### Migration from 0.9.0

1. Preserve a project-customized palette. Otherwise add semantic artifact accents, status badges, keyword highlights, callouts, and accessible light/dark colors to the generated HTML templates.
2. Add `data-artifact` to template `body` elements so the artifact type controls a stable visual accent while a visible text label carries the same meaning.
3. Replace each template's generic `Related` section with a `Document relationships` table containing `Role`, `Document`, and `Why it matters` columns.
4. Link sibling `business.html`, `technical.html`, and `plan.html` files directly; link `execution.json` from the plan; link applicable decisions to their exact stable anchors.
5. Add a related spec only for a direct behavior dependency, shared contract, scope interaction, or supersession, and state that reason. Do not link documents merely because their topics are similar.
6. Apply the new style and relationship contract to existing active generated artifacts only when ownership and targets are clear. Preserve customized or historical documents rather than rewriting them blindly.

## 0.9.0 - 2026-07-29

- Limits the five-minute review threshold to requests that introduce or change a business requirement, product behavior, business logic, rule, workflow, or externally observable functional outcome.
- Routes purely presentational design, styling, spacing, and layout changes directly to implementation when they contain no business requirement or behavior change, even if visual review takes more than five minutes.
- Preserves independent activation triggers for meaningful product ambiguity, expensive misunderstandings, architectural or security risk, multi-session handoffs, and behavior governed by an existing spec.

### Migration from 0.8.0

1. Update the `AGENTS.md` workflow resolver so the five-minute row applies only to business requirements and product behavior changes.
2. Add a direct-execution row for purely presentational design, styling, spacing, or layout changes with no business requirement or behavior change, regardless of review time.
3. Update the `SKILL.md` gate to say that review time alone never activates the workflow for those presentation-only changes.
4. Preserve all independent risk, ambiguity, handoff, existing-spec, active-decision, and stricter local gates.

## 0.8.0 - 2026-07-22

- Replaces feature-associated decision artifacts with a small project-wide registry organized into living category documents.
- Keeps `decisions/index.html` as the lightweight entry point, with stable IDs, one-line summaries, statuses, dates, and direct links to decision sections.
- Requires one concise `Decision impact` section in each technical spec: used, proposed, or modified decisions, or the standard “No durable decision impact” statement.
- Makes agents read the decision index during context resolution and load only categories relevant to the current request.
- Promotes a choice only when it has likely cross-feature value, inconsistent interpretations would matter, and the intent cannot be reliably inferred from code, conventions, or an active spec.
- Creates category documents only on demand, extends existing decisions when possible, and avoids records for routine implementation details.
- Amends compatible changes in place with compact history and spec links; reserves supersession for fundamental reversals.
- Preserves explicit technical approval for active-decision changes. Clearly listed new decisions are approved with the applicable business or technical spec.

### Migration from 0.6.0

1. Preserve every existing decision and stable link. Do not delete or blindly combine older one-decision artifacts.
2. Update `SKILL.md` so context resolution reads `decisions/index.html` and only the populated categories relevant to the request.
3. Turn `decisions/index.html` into a concise registry with stable decision IDs, title, status, summary, last-updated date, and direct section link.
4. Store new decisions in living category documents such as `design.html` or `architecture.html`; create no empty categories. Consolidate older files only when ownership and anchors are unambiguous.
5. Add `Decision impact` to the technical template and new technical specs. List used, proposed, and modified decisions, or use the standard no-impact statement.
6. Apply the strict promotion threshold: cross-feature value, meaningful inconsistency risk, and intent that cannot be reliably inferred.
7. Amend compatible decisions in place with compact history and a link to the changing spec. Supersede only fundamental reversals.
8. Preserve the existing approval gate for changes to active decisions and all stricter local rules.

## 0.6.0 - 2026-07-12

- Keeps one integrated `plan.html` per feature while dividing it into detailed tasks classified by category, effort, risk, plan confidence, delegation confidence, dependencies, scope, verification, and STOP conditions.
- Makes the planner evaluate same-session, delegated, and hybrid execution. Same-session is always offered; delegated/hybrid modes appear only when recommended with rationale; a custom assignment example is always shown.
- Requires explicit user approval of the execution topology and per-task assignments before any subagent starts. The recommendation and user override are both retained.
- Uses model-agnostic capability profiles and low/medium/high effort for durable routing recommendations, while recording actual planner, executor, verifier, and reviewer model names after execution.
- Adds `design` to the feature classification taxonomy alongside feature, bug, security, performance, tests, tech-debt, migration, DX, docs, and research.
- Adds per-feature `execution.json` records and a committed `data/executions.jsonl` ledger covering actual models, token usage and provenance, duration, outcomes, revisions, verification, commits, and execution strategy.
- Adds read-only `analytics` output in summary, JSON, JSONL, and CSV formats plus `codex-usage` inspection for local session model, effort, duration, and token totals without conversation content.
- Uses isolated worktrees for delegated writers, requires diff review before running changed code, stops before merge, and keeps delivery follow-ons outside the active phase unless explicitly requested.
- Reduces update-prompt context by including only schema history newer than the detected installed version; unversioned installations still receive the full migration history.

### Migration from 0.5.0

1. Preserve any explicit repository delegation policy. Otherwise allow the planner to recommend delegation while requiring explicit user strategy approval before spawning subagents.
2. Keep one integrated `plan.html`; add detailed task classification, dependencies, scope, verification, STOP conditions, capability recommendations, and selected assignments.
3. Add `templates/execution-template.json`, a per-feature `execution.json`, and `data/executions.jsonl` using execution schema `1.0.0`. Do not invent telemetry for old executions.
4. Always offer same-session execution. Offer delegated and hybrid modes only with a rationale, and show a concrete custom assignment example.
5. Record capability profiles in recommendations and actual model names, effort, tokens, duration, outcome, revisions, and verification after execution.
6. Run `npx simplest-sdd@latest analytics`, then rebuild the committed JSONL ledger. Generate CSV only when needed.
7. Use isolated worktrees for delegated writers, inspect their diffs before running changed code, and stop before merge.
8. Preserve the existing business-spec and technical-approval gates plus stricter local rules. Keep delivery follow-ons out of scope unless explicitly requested.

## 0.5.0 - 2026-07-09

- Stops unconditionally installing the `tdd` skill during init.
- Discovers the repository's resolved testing discipline during inspection: an explicit testing instruction in `AGENTS.md`/`CLAUDE.md`/a rules file/existing skill, an installed test-first skill, the repository's existing test setup, or none of the above.
- Writes the resolved testing discipline by name into the generated spec-library `SKILL.md` implement-and-verify step (test-first skill, other defined testing approach, or intentional test-free stance).
- Keeps the `tdd` skill as one offered option when no discipline is discoverable; update no longer installs any skill unprompted.
- Preserves the explicit spec-approval gate; the testing discipline governs only the implementation phase.

### Migration from 0.4.0

1. Discover the resolved testing discipline from `AGENTS.md`/`CLAUDE.md`/existing skills/repo test setup; do not reinstall a test-first skill if one is present.
2. Update `.agents/skills/spec-library/SKILL.md` so the implement-and-verify step references the resolved discipline by name instead of always naming the `tdd` skill.
3. Update `AGENTS.md` so the spec-driven workflow note says approved implementations follow the resolved testing discipline.
4. If a `tdd` skill was installed only because 0.4.0 asked for it and the repo has another explicit testing instruction, keep both but let the existing instruction take precedence.
5. If no discipline is discoverable, leave the skill test-discipline-agnostic and offer the `init.md` choice when the workflow next runs; do not install a skill unprompted during update.

## 0.4.0 - 2026-07-09

- Installs `mattpocock/skills` `tdd` skill with the skills CLI using preselected options (`npx skills add https://github.com/mattpocock/skills --skill tdd -y`).
- Makes the generated spec-library skill drive implementations through the `tdd` skill discipline (red-green-refactor at pre-agreed seams) after the required spec approval and before product code changes.
- Preserves the explicit spec-approval gate; the `tdd` skill governs only the implementation phase.

### Migration from 0.3.0

1. Run `npx skills add https://github.com/mattpocock/skills --skill tdd -y` in the repository root to install the tdd skill.
2. Update `.agents/skills/spec-library/SKILL.md` so the implement-and-verify step tells the agent to use the tdd skill after required spec approval and before changing product code.
3. Update `AGENTS.md` so the spec-driven workflow note mentions that approved implementations follow the tdd skill discipline.
4. Preserve the explicit spec-approval gate; the tdd skill only governs the implementation phase.

## 0.3.0 - 2026-06-18

- Reframed the first feature workflow questions as request refinement, not generic clarification.
- Made the request-refinement round explicitly produce or update the generated feature spec.
- Required the agent to stop after generating or updating the spec and wait for explicit approval before implementation.
- Preserved the additional technical approval gate for migrations, auth, billing, security, public contracts, infrastructure boundaries, and active decision changes.

### Migration from 0.2.0

1. Update `AGENTS.md` spec-driven workflow wording so the mandatory question round is described as request refinement.
2. Update `.agents/skills/spec-library/SKILL.md` so the first questions explicitly refine the request into a generated spec.
3. Ensure the skill requires the agent to stop after generating or updating the spec and wait for explicit approval before implementation.
4. Preserve the existing technical approval gate for high-risk technical areas and active decision changes.
5. Update templates or local examples only where they imply that implementation can begin immediately after clarification answers.

## 0.2.0 - 2026-06-18

- Added `.agents/skills/spec-library/index.html` as the root library index and preferred entry point for humans and agents.
- Kept `specs/index.html` and `decisions/index.html` as focused supporting indexes.
- Required the root library index to represent all internal spec-library documentation while making the latest documents easy to access by last-updated date.
- Allowed small client-side filtering or search in the root index while keeping it static, readable, and link-based rather than router-like.
- Limited root index links to internal documentation; linked internal documents can reference external URLs when relevant.
- Made root index maintenance part of the close-out step.

### Migration from 0.1.0

1. Inspect existing spec-library artifacts and focused indexes before editing.
2. Create `.agents/skills/spec-library/index.html` if missing, preserving any local landing page if one already exists.
3. Link all internal spec-library documentation from the root index, including specs, plans, decisions, and supporting indexes.
4. Add a latest-documents section ordered by `last-updated` metadata, or the best available maintained date when older artifacts lack metadata.
5. Keep root index links internal to repository documentation; external references belong inside linked internal documents.
6. Update `SKILL.md` so context resolution and close-out require maintaining the root index.
7. Add or preserve small client-side filtering/search only when it improves readability and does not turn the index into a router.

## 0.1.0 - 2026-06-17

- Added a skill-local schema marker in `.agents/skills/spec-library/SKILL.md`.
- Made `AGENTS.md` the canonical instruction source for all agents.
- Switched Claude compatibility from a `CLAUDE.md -> AGENTS.md` symlink to a regular `CLAUDE.md` file that imports `@AGENTS.md`.
- Kept `.agents/skills/spec-library` as the canonical skill and `.claude/skills/spec-library` as the Claude compatibility symlink.
- Switched generated specs, plans, decisions, indexes, and templates to clean static HTML.
- Documented readable embedded CSS, visible focus styles, and optional simple chart guidance in the generated skill.
- Added npx-ready `init`, `update`, and `remove` agent-instruction prompts.

### Migration from unversioned installs

1. Inspect existing `AGENTS.md`, `CLAUDE.md`, `.agents/skills/spec-library`, and `.claude/skills/spec-library`.
2. Preserve unique `CLAUDE.md` instructions by merging them into `AGENTS.md`.
3. Replace any `CLAUDE.md -> AGENTS.md` symlink with a regular `CLAUDE.md` file containing `@AGENTS.md`.
4. Add `<!-- simplest-sdd-schema-version: 0.1.0 -->` to `.agents/skills/spec-library/SKILL.md` immediately after the frontmatter.
5. Keep the skill symlink at `.claude/skills/spec-library -> ../../.agents/skills/spec-library`.
6. Convert generated Markdown templates, indexes, specs, plans, and decisions to clean static HTML when conversion is safe.
7. Preserve old Markdown artifacts whenever ownership or conversion fidelity is unclear.
