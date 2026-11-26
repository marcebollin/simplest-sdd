## The Workflow Contract

Install the skill in the project's vocabulary. Keep its instructions short enough to read before a change. Store each lasting business decision once.

### `AGENTS.md` Section

Preserve the project's instructions and add this route.

```markdown
## Product decisions and reuse

Use `.agents/skills/spec-library/SKILL.md` for features and fixes, questions about product intent, and conversations that settle a lasting product rule or change how we work.

**Extend before you build.** Look for a component, flow or rule that already does the job. Inspect its callers and preserve the behavior its existing users rely on.

A clear request can proceed immediately. Ask about an open choice when its answer changes the outcome.
```

### Audience and Communication

Keep a short brief alongside the project's own instructions in `AGENTS.md`, or link from there to its existing home. Use the request and project vocabulary to distinguish who builds the product, who uses it and who will read the agent's reply. Explain terms such as “we” or “client” when their meaning could change a decision.

Write the brief as instructions for questions, updates and handoffs. Follow the audience named in the current request and match the reader's vocabulary, tone and preferred level of detail. For example, a shop owner may want to know what shoppers will see after a failed payment, while the engineer reviewing the fix may want the failure case and its test. Use only roles and preferences supported by the project or conversation. Where preferences are unknown, have the agent lead with the outcome in plain language. Ask about the reader only when the answer would materially change the response.

### Library Layout

```text
.agents/skills/spec-library/
  SKILL.md       workflow, testing and local project practice
  DECISIONS.md   business rules, created with the first lasting decision
```

A fresh installation can consist of the skill entrypoint alone. Use Markdown headings to group decisions as the product grows. The framework needs no generated HTML, separate index, area files, templates or references directory. Keep existing project-owned resources that still serve a purpose.

### `SKILL.md`

Use the following as the installed entrypoint. Fill in Project practice with the repository's actual testing discipline, verified commands or links to its existing instructions, and any established local workflow. Preserve supported frontmatter fields and invocation policy on update.

```markdown
---
name: spec-library
description: Find and maintain business decisions and shared capabilities for features and fixes. Use in ordinary conversation when the user settles a product rule, corrects a recurring project practice, or asks why the product works this way.
---
<!-- simplest-sdd-schema-version: {{schemaVersion}} -->

# Product decisions

The product's rules live in `DECISIONS.md` beside this skill. Create it when there is a first lasting decision to save. Search by product term, affected surface, shared capability or decision ID. Read the matching records and follow related IDs in either direction.

## Learn from conversation

- When the user states or corrects a lasting product promise, update its record in the same turn, even during a discussion with no coding task. Find an existing rule first. Amend it, supersede it or add a new ID as appropriate. An explicit instruction needs no second confirmation.
- When the user establishes a recurring way of working on this project, update the smallest relevant instruction under **Project practice**. If an existing project policy or testing skill already owns it, maintain that source and link to it here. Keep standing communication preferences with the audience guidance in or linked from `AGENTS.md`, scoped to the reader the user named. Preserve these local refinements across framework updates.
- Keep ideas, unanswered questions and one-off directions in the conversation. A question about the current rule is a lookup. If it is genuinely unclear whether a correction should apply next time and that distinction matters, ask. Honor requests to brainstorm or read without editing.
- A repeated correction can reveal an improvement. Check the saved rule and the evidence, suggest a lasting change if the intended policy is uncertain, then apply the user's decision. Keep one current instruction for each practice. A conversational edit applies to this project and keeps the installed schema marker intact.
- Say what you saved and where. When the same guidance is already present, cite it. Recording an agreement does not itself authorize a product change or establish that it shipped.

## Features and fixes

1. Locate the affected decisions, related rules and actual callers. If a request conflicts with a settled rule, cite its ID and ask which outcome should hold unless the user has already settled the conflict.
2. Reuse what fits. Extend one capability for real variations such as a size or a second site. Keep flows separate when their business rules differ. Check both the new use and the existing consumers.
3. Follow Project practice to implement and verify the requested behavior. A fix that restores a rule can cite its existing ID. Record a lasting change to product intent or a deliberate sharing boundary.
4. Report the outcome, checks and affected IDs. Link the decision that explains the change.

## Writing a decision

Use a `##` heading for a product area and an ID-only heading such as `### EXP-014` for each rule. Its stable Markdown link is `#exp-014`. Lead with the status and a short sentence stating the rule. Include who it applies to, the known reason and any exact limit or exception. Name shared consumers and allowed variation when relevant. Link decisions that depend on one another. Preserve confirmation and change history. Omit empty fields.

Use `proposed` for an explicit proposal, `approved` for a confirmed rule awaiting delivery and `active` for confirmed, shipped behavior. Amend compatible changes under the same ID. If an approved extension is still pending, identify its scope and keep the shipped rule visible until delivery. A reversal gets a new ID. When the replacement takes effect, mark the old rule `superseded` and link its successor. Use `retired` for a rule that ended. Keep IDs unique and never renumber them. As the file grows, add area headings and search for matching sections. Keep a short vocabulary entry only when competing names conceal a real relationship.

## Questions

Use the request, prior answers, decisions and code first. There is no minimum number of questions. Ask only about an open choice that materially changes the result, including a difficult technical choice with lasting consequences. Group independent questions, explain the trade-off, and continue work that can proceed.

## On request

- **"Grill me."** Explore open choices in rounds and record confirmed lasting decisions.
- **"Why does it work this way?"** Cite the decision and distinguish its recorded reason from inference.
- **"Review reuse."** Find concrete consumers of the same rule and assess whether they can share a capability.

## Project practice

Use this section for the project's testing discipline and the recurring workflow refinements its maintainers establish.
```

### Project Practice

Replace the generic sentence under Project practice with what you found. When the project uses TDD, start with a failing behavioral test, make it pass, then refactor with the tests green. Keep command flags, prerequisites and existing testing skills. Preserve another defined approach or an intentional test-free policy. If no testing policy exists, identify the available checks. Keep a project rule in one canonical place.

### Claude Compatibility

Before replacing either instruction file, merge unique project instructions from `CLAUDE.md` and any existing target into canonical `AGENTS.md`. Skip the import directive itself. Replace a Claude symlink at the link, without writing through it. Make `CLAUDE.md` a regular file containing `@AGENTS.md`.

Use `.claude/skills/spec-library -> ../../.agents/skills/spec-library` as the relative compatibility link. Reconcile a physical Claude copy into the canonical library before replacing it. Preserve unique contents and resolve conflicting files without overwriting either original. Keep other skills, settings and links intact.
