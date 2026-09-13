# Read-later project: request-refinement conversation

This example abstracts a real read-later application without exposing its codebase or private implementation details.

Code paths and observations below are illustrative stand-ins, not files in this repository. In a real discovery, the agent inspects the actual implementation, callers, and tests before offering a reuse recommendation.

The user requests an additional discovery/export flow over the active filtered results, including every page in visible order and all discovery result types. They ask to preserve the existing filters, cards, organization rules, and permission boundaries, and identify complete results, ordering, and failed-page handling as acceptance criteria.

From the repository, the agent infers:

- **Goal:** help people capture, organize, rediscover, and read useful material from across the internet.
- **Intended users:** people who read heavily online and want to preserve attention instead of managing a complicated knowledge system.
- **Existing clues:** saving links is already fast, content is organized through several entity types, and the interface favors calm, compact workflows.

The request and repository already establish the goal, users, scope, and most acceptance criteria. The agent uses that context to ask sharper questions in the mandatory discovery round rather than asking the user to restate known facts. No additional prerequisite questions are needed here; if the concrete goal or clues/examples were missing, those questions would be separate from the five-question minimum. Discovery checks the relevant implementation and documentation, beginning with:

```text
Documentation impact (provisional)
- Existing spec likely to update automatically: None found — this may require a new spec
- Other specs consulted: .agents/skills/spec-library/specs/saved-library/business.html
- Decisions consulted: .agents/skills/spec-library/decisions/design.html#DES-002
- Decisions that may change: None
- New decision proposed if approved: .agents/skills/spec-library/decisions/architecture.html#ARC-001
```

The agent also reports a `Reuse analysis` with the implementation evidence it inspected:

| Existing surface | Related logic and fit | Constraint |
| --- | --- | --- |
| `src/features/saved-library/export.ts` — `exportSavedLibrary()` | The saved-library exporter completes the active paginated result set and preserves its visible ordering before serialization. | It directly imports saved-library query construction and assumes saved-item records. |
| `src/features/saved-library/ExportButton.tsx` — `ExportButton.handleExport()` | Calls `exportSavedLibrary()` with the reader's active filter and ordering scope. | Moving page completion must preserve this caller's inputs and error handling. |
| `src/features/saved-library/results.ts` — `buildSavedLibraryQuery()` | Owns the saved-library filters, ordering, and permission-scoped query. | Discovery needs its own query and supports additional result types. |
| `src/features/saved-library/export.test.ts` | Covers multiple pages, preserved order, and export failure when a later page fails. | The same guarantees should hold for discovery; its additional record types need coverage. |

Both saved-library export and the requested discovery export need the same page-completion guarantees. This supports considering a small shared helper; it does not establish a need for a general export framework.

The proposed extraction, if selected, is `completeActiveResults()` in `src/shared/export/complete-active-results.ts`. The existing `exportSavedLibrary()` and the new `exportDiscoveryResults()` in `src/features/discovery/export.ts` would call it. These are proposed changes, not claims that the helper or discovery exporter already exists.

The agent asks five material request-refinement questions in one round and waits for every answer before resolving the documentation branch or implementing:

1. If a later result page fails, should the flow produce no file and offer a retry of the complete export?
2. If the reader changes filters or ordering during export, should the running export keep the scope captured when they started it?
3. When the captured scope returns no results, should the reader receive an empty file or an explanation without a download?
4. For a large result set, should the interface show progress, prevent a second simultaneous export, and let the reader cancel without downloading partial results?
5. The existing saved-library exporter already completes and orders results, but its query and record assumptions do not fit discovery. Which approach should we use?

   - **Reuse as-is:** call the existing exporter. This is the smallest change, but its saved-item contract would require narrowing the requested discovery export to saved items; it cannot satisfy the current full-scope requirement unchanged.
   - **Create a separate implementation:** keep discovery export independent. This preserves isolation and supports all discovery result types, but duplicates the page-completion behavior and its future fixes.
   - **Custom: adapt by extracting shared logic (Recommended):** extract only page completion into a helper used by saved-library and discovery exports, with each feature keeping its own permission-scoped query and record conversion. The two concrete consumers need the same ordering and failure guarantees, while their query contracts differ. This adds a shared dependency and requires checking both flows. The user may specify another custom boundary instead.

Exactly one implementation option is recommended, based on inspected behavior and compatibility. This choice matters because it introduces a shared dependency and affects two consumers, and it counts as one of the five material questions. Routine use of an already compatible utility would not need a separate options menu or a decision record unless the user explicitly made a reuse choice. If inspection found no useful candidate, the agent would briefly state the finding without inventing an extraction and ask another material refinement question to meet the minimum.

The user answers the first four questions:

1. A failed page must produce no file. Explain the failure and offer a retry of the complete export.
2. Keep the filters and ordering captured when export starts, even if the reader changes the view while it runs.
3. Explain that the captured scope contains no results and produce no download.
4. Show progress, disable a second export while one is running, and provide cancellation that discards the unfinished export.

For the fifth question, the user explicitly selects:

> Extract the shared page-completion helper for both export flows. Keep queries, permissions, and record conversion in each feature, and keep existing saved-library export behavior unchanged.

The agent records this approved reuse/abstraction choice, its alternatives, rationale, scope, and the explicit approval in the canonical decision `.agents/skills/spec-library/decisions/architecture.html#ARC-001`, with a matching entry in `decisions/index.html` and the library index. The entry distinguishes the approved design from implementation still to be verified. An unselected recommendation would remain proposed and would not authorize code changes.

All five answers are now complete. No existing spec owns the new discovery/export behavior. The saved-library product contract remains unchanged, so its spec remains consulted context. Because the user has not yet chosen a documentation branch, the agent shows the resolved documentation impact, including the approved `ARC-001` decision, and presents a separate documentation question:

1. Create a new spec (Recommended)
2. Continue without a new spec

Only the recommended documentation choice is labeled. If the user had already requested a new spec or explicitly chosen to skip one, the agent would follow that choice without asking again. If the user chooses the first option, the business spec records the selected shared behavior, rejected alternatives, rationale, product consequences, and approval, linking to `ARC-001`. The technical spec records the source paths, extraction boundary, consumers, compatibility constraints, and verification. Both record the saved-library spec and `DES-002` as consulted context, then the agent waits for approval of the newly generated business spec.

If the user chooses the second, the agent creates no `business.html`, `technical.html`, `plan.html`, or feature entry in the spec indexes. It implements the refined request directly in the same session. The approved reuse/abstraction choice still persists in `decisions/architecture.html#ARC-001` and the necessary decision/library index entries; these narrow decision writes do not create a new feature spec. Concrete sensitive changes still require explicit authorization in either branch, and any authorization already given remains valid within its scope. Here, preserving existing permissions does not itself introduce a new auth approval. A newly discovered migration or changed permission boundary would need approval before dependent implementation.

If `specs/content-discovery-export/business.html` and `technical.html` already owned this behavior, the same five-question discovery minimum and wait for all answers would apply, but the agent would not show the two documentation choices. After discovery it would update those files automatically and notify:

```text
Updated automatically
- .agents/skills/spec-library/specs/content-discovery-export/business.html
- .agents/skills/spec-library/specs/content-discovery-export/technical.html
- .agents/skills/spec-library/specs/content-discovery-export/plan.html
- .agents/skills/spec-library/specs/index.html

Consulted unchanged
- .agents/skills/spec-library/specs/saved-library/business.html
- .agents/skills/spec-library/decisions/design.html#DES-002

Pending decision update
- None

Decision recorded after explicit reuse approval
- .agents/skills/spec-library/decisions/architecture.html#ARC-001
- .agents/skills/spec-library/decisions/index.html
- .agents/skills/spec-library/index.html
```

No business-spec approval is required for that automatic refresh. The consequential sharing choice still needs explicit selection, which the user already supplied above. If any discovery answer were unresolved, documentation-branch decisions and implementation would wait while read-only investigation could continue. Once applicable approvals are resolved, the agent completes implementation, relevant verification, and documentation close-out without adding a strategy-selection pause. Resuming this unchanged request after its completed qualifying discovery round preserves those answers and approvals without replaying the questions.
