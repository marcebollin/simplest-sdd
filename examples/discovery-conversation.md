# Read-later project: request-refinement conversation

This example abstracts a real read-later application without exposing its codebase or private implementation details.

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
```

It then asks:

1. I infer this feature is for heavy internet readers who need to find previously saved material without remembering how they organized it. What should I correct?
2. Should success mean faster discovery, more complete results, easier export, or a particular combination?
3. Should the new flow supplement the existing filters or replace them?
4. Which behavior is explicitly out of scope, such as changing saved-item cards or organization semantics?
5. Which product and technical constraints matter most when choosing the approach?
6. What user-visible flow and automated checks would make the result acceptable?

The answers confirm that no existing spec owns the new discovery/export behavior. The agent repeats the resolved documentation impact and presents exactly two choices:

1. Create a new spec (Recommended)
2. Continue without a new spec

Only the recommended choice is labeled. If the user chooses the first option, the generated spec records the saved-library spec and `DES-002` as consulted context, then waits for business-spec approval. If the user chooses the second, it creates no feature-spec artifacts and implements the refined request directly in the same session. Either choice still requires explicit approval if the implementation introduces a migration, changes data or auth boundaries, affects security or public contracts, or modifies an active decision.

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
```

No business-spec approval is required for that automatic refresh. Independent technical approvals still apply.
