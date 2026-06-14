# Read-later project: generated result

This is an abbreviated example of the system generated for a mature read-later application.

## Repository instructions

The bootstrap preserves existing commands and technical rules, then adds concise product context:

```markdown
# Project agent guide

This product helps people save, organize, rediscover, and read material from across the internet.

The primary users are heavy internet readers who value low-friction capture, understandable organization, and a calm reading experience.

Prefer obvious workflows over configurable machinery. Push back when complexity does not meaningfully improve saving, finding, organizing, or reading.

## Spec-driven workflow

| When | Load |
| --- | --- |
| Output review takes more than ~5 minutes, or work carries meaningful ambiguity or risk | `.agents/skills/spec-library/SKILL.md` |
| Clear low-risk output reviewable within ~5 minutes | Implement and verify directly |
```

## Library architecture

```text
AGENTS.md
CLAUDE.md -> AGENTS.md
.agents/skills/spec-library/
├── SKILL.md
├── specs/
│   ├── INDEX.md
│   └── content-discovery-export/
│       ├── business.md
│       ├── technical.md
│       └── plan.md
├── decisions/
│   ├── INDEX.md
│   └── export-reuses-active-result-set.md
└── templates/
    ├── business-spec.md
    ├── technical-spec.md
    ├── plan.md
    └── decision-template.md
.claude/skills/spec-library -> ../../.agents/skills/spec-library
```

The indexes expose only enough metadata for an agent to decide what to load:

```markdown
# Specs Index
- [content-discovery-export](content-discovery-export/business.md) — (implemented) Unified discovery, ordering, and export for the active saved-content scope.

# Decisions Index
- [export-reuses-active-result-set](../decisions/export-reuses-active-result-set.md) — (medium) Export completes and serializes the active result set.
```

## Business spec

The business document describes the product contract without implementation instructions:

```markdown
---
name: content-discovery-export-business
description: Product contract for unified discovery and scoped export.
domain: content
status: approved
created: YYYY-MM-DD
---

# Content discovery and export

## Goal
Help readers find and reuse the complete set of saved material relevant to their current context.

## Intended users
People who save many items from across the internet and may not remember their original organization choices.

## Problem
Browsing works for familiar collections, but discovery and reuse become slower as the library grows.

## Outcomes
- Readers can search across organizational dimensions from one place.
- Export reflects the same scope and ordering the reader is viewing.

## Clues and examples
- Preserve the existing browsable filters.
- Use a command-style finder only as an accelerator.

## Scope
**In:** unified discovery, explicit ordering, scoped export.
**Out:** redesigning saved-item cards or changing organization semantics.

## Acceptance criteria
- Discovery clearly identifies result types.
- Export includes the complete active result set in visible order.
```

## Technical spec

The technical document records durable system boundaries and why the approach fits:

```markdown
---
name: content-discovery-export-technical
description: Engineering design for unified discovery and scoped export.
domain: content
status: approved
created: YYYY-MM-DD
---

# Content discovery and export: technical design

## Current system
Saved content is loaded through server-owned query boundaries and displayed from a paginated client cache.

## Proposed approach
Use one discovery surface over existing entity queries. Complete the active paginated result set before serialization instead of creating a second export data path.

## Boundaries and contracts
- Server remains authoritative for user-owned data.
- The active query key defines search, filters, and ordering.
- Export serializers consume the completed result set.

## Failure, security, and compatibility
- Never trust client-supplied content as the export source.
- Keep export and visible results from drifting into different scopes.

## Verification strategy
- Focused query and serializer tests.
- Type and lint checks.
- Desktop and narrow-screen discovery/export flow.
```

## Implementation plan

The plan carries execution details and explicitly keeps the users visible:

```markdown
---
name: content-discovery-export-plan
description: Implementation handoff for unified discovery and scoped export.
status: ready
created: YYYY-MM-DD
---

# Content discovery and export: implementation plan

## Goal and intended users
- **Goal:** make discovery and scoped reuse reliable as a saved library grows.
- **Intended users:** heavy internet readers managing many saved items.

## Read first
- Business spec
- Technical spec
- Relevant active decisions

## Tasks
- [ ] Normalize discovery and ordering inputs.
- [ ] Build the shared discovery surface.
- [ ] Complete the active result set before export.
- [ ] Add focused tests and browser verification.

## Verification
- [ ] Project tests, type checks, and lint pass.
- [ ] Discovery and export match the active user-visible scope.
```

## Durable decision

Only a choice that affects future features is promoted from the technical spec:

```markdown
---
name: export-reuses-active-result-set
description: Exports complete and serialize the active result set.
type: architecture
importance: medium
status: active
created: YYYY-MM-DD
---

# Reuse the active result set for exports

**Decision:** Complete and serialize the active paginated result set.

**Over:** Maintaining a separate all-record export query.

**Why:** It prevents visible results and exports from using different scopes while reusing already loaded data.

**How to apply:** Future export formats consume the same completed result set instead of querying storage directly.
```

The business and technical specs remain useful after shipping. `plan.md` holds temporary progress, discoveries, and verification evidence.
