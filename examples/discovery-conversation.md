# Read-later project: request-refinement conversation

This example abstracts a real read-later application without exposing its codebase or private implementation details.

Code paths and observations below are illustrative stand-ins, not files in this repository. In a real discovery, the agent inspects the actual implementation, callers, and tests before offering a reuse recommendation.

From the repository, the agent infers:

- **Goal:** help people capture, organize, rediscover, and read useful material from across the internet.
- **Intended users:** people who read heavily online and want to preserve attention instead of managing a complicated knowledge system.
- **Existing clues:** saving links is already fast, content is organized through several entity types, and the interface favors calm, compact workflows.

Because the goal and clues are already visible, the agent does not ask the two optional prerequisite questions. Before the mandatory request-refinement questions, it shows:

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

It then asks:

1. I infer this feature is for heavy internet readers who need to find previously saved material without remembering how they organized it. What should I correct?
2. Should success mean faster discovery, more complete results, easier export, or a particular combination?
3. Should the new flow supplement the existing filters or replace them?
4. Which behavior is explicitly out of scope, such as changing saved-item cards or organization semantics?
5. Which product and technical constraints matter most when choosing the approach?
6. What user-visible flow and automated checks would make the result acceptable?
7. The existing saved-library exporter already completes and orders results, but its query and record assumptions do not fit discovery. Which approach should we use?

   - **Reuse as-is:** call the existing exporter. This is the smallest change, but its saved-item contract would require narrowing the requested discovery export to saved items; it cannot satisfy the current full-scope requirement unchanged.
   - **Create a separate implementation:** keep discovery export independent. This preserves isolation and supports all discovery result types, but duplicates the page-completion behavior and its future fixes.
   - **Custom: adapt by extracting shared logic (Recommended):** extract only page completion into a helper used by saved-library and discovery exports, with each feature keeping its own permission-scoped query and record conversion. The two concrete consumers need the same ordering and failure guarantees, while their query contracts differ. This adds a shared dependency and requires checking both flows. The user may specify another custom boundary instead.

Exactly one implementation option is recommended, based on inspected behavior and compatibility. The recommendation is not approval. If inspection found no useful reusable logic or justified abstraction, the agent would state what it searched and why, without inventing an extraction.

The user answers the product questions and explicitly selects:

> Extract the shared page-completion helper for both export flows. Keep queries, permissions, and record conversion in each feature, and keep existing saved-library export behavior unchanged.

The agent records this approved reuse/abstraction choice, its alternatives, rationale, scope, and the explicit approval in the canonical decision `.agents/skills/spec-library/decisions/architecture.html#ARC-001`, with a matching entry in `decisions/index.html` and the library index. The entry distinguishes the approved design from implementation still to be verified. An unselected recommendation would remain proposed and would not authorize code changes.

The answers confirm that no existing spec owns the new discovery/export behavior. The saved-library product contract remains unchanged, so its spec remains consulted context. The agent repeats the resolved documentation impact, including the approved `ARC-001` decision, and then presents a separate documentation question with exactly two choices:

1. Create a new spec (Recommended)
2. Continue without a new spec

Only the recommended documentation choice is labeled. If the user chooses the first option, the business spec records the selected shared behavior, rejected alternatives, rationale, product consequences, and approval, linking to `ARC-001`. The technical spec records the source paths, extraction boundary, consumers, compatibility constraints, and verification. Both record the saved-library spec and `DES-002` as consulted context, then the agent waits for business-spec approval.

If the user chooses the second, the agent creates no `business.html`, `technical.html`, `plan.html`, `execution.json`, or feature entry in the spec indexes. It implements the refined request directly in the same session. The approved reuse/abstraction choice still persists in `decisions/architecture.html#ARC-001` and the necessary decision/library index entries; these narrow decision writes do not create a new feature spec. Either documentation choice still requires explicit approval if the implementation introduces a migration, changes data or auth boundaries, affects security or public contracts, or modifies an active decision. The reuse choice itself never waives those approvals.

If `specs/content-discovery-export/business.html` and `technical.html` already owned this behavior, the agent would not show the two choices. After discovery it would update those files automatically and notify:

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

No business-spec approval is required for that automatic refresh. It does not approve reuse or abstraction: the agent still needs the explicit implementation selection illustrated above. If that choice is unresolved, discovery remains pending and dependent implementation waits. Independent technical approvals still apply.
