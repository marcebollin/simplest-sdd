# Read-later project: generated result

This is an abbreviated example of the system generated for a mature read-later application.

The code paths and inspection findings in this example are illustrative stand-ins. A real generated spec must reference actual inspected implementation, callers, and tests from the target repository.

The paragraph and list formatting below illustrates editorial judgment, not a fixed recipe. Adapt emphasis, lead-ins, spacing, and grouping to make each document as readable as possible; leave simple prose plain when formatting would add noise.

## Repository instructions

The bootstrap preserves existing commands and technical rules, then adds concise product context:

```markdown
# Project agent guide

This product helps people save, organize, rediscover, and read material from across the internet.

The primary users are heavy internet readers who value low-friction capture, understandable organization, and a calm reading experience.

Prefer obvious workflows over configurable machinery. Push back when complexity does not meaningfully improve saving, finding, organizing, or reading.

For simplest-sdd maintenance instructions, run `npx simplest-sdd@latest update` or `npx simplest-sdd@latest remove` and follow the printed agent prompt.

## Execution boundaries

- Treat the user's current prompt as the authorized phase and honor every stated stop point.
- During mandatory discovery, name the existing owning, consulted, and potentially changed specs and decisions. Refresh an existing owning spec automatically; ask whether to create a new spec only when no spec owns the behavior.
- Inspect related implementation and ask the user to select reuse as-is, a separate implementation, or a custom adaptation/shared abstraction when a meaningful opportunity exists; recommend exactly one option with evidence. Record approved reuse/abstraction choices in canonical decisions, including when the user chooses no new spec.
- Always offer same-session execution and show a concrete custom assignment example.
- Without an explicit stop point, stop after the selected strategy completes the approved implementation, verification, and close-out.
- Do not continue into commits, pull requests, deployment, monitoring, or review handling unless the current prompt explicitly requests it.

## Spec-driven workflow

| When | Load |
| --- | --- |
| Business or product behavior change whose output review takes more than ~5 minutes, or work carries meaningful ambiguity or risk | `.agents/skills/spec-library/SKILL.md` |
| Question about past specs, plans, decisions, or internal spec documentation | `.agents/skills/spec-library/index.html` |
| Question about a past decision | `.agents/skills/spec-library/decisions/index.html` |
| Purely presentational design, styling, spacing, or layout change with no business requirement or behavior change, regardless of review time | Implement and verify directly |
| Other clear low-risk output reviewable within ~5 minutes | Implement and verify directly |
```

When the skill activates, it inspects relevant specs, decisions, related code, callers, and tests and shows their exact paths or anchors with the request-refinement questions. It compares relevant reuse, separate-implementation, and custom adaptation or extraction options, recommends exactly one with concrete evidence, and waits for the user's selection. It does not infer approval from its own recommendation or create speculative abstractions.

After the answers, an existing owning spec updates automatically without business-spec approval; that refresh does not approve a pending reuse/abstraction choice. Only when no existing spec owns the behavior does it separately present `Create a new spec` and `Continue without a new spec`, mark exactly one documentation choice `(Recommended)`, and wait. The no-new-spec branch creates no feature artifacts or feature entries in the spec indexes, but still records approved reuse/abstraction choices in canonical decisions and the necessary decision/library indexes. Sensitive technical changes retain explicit approval in every branch.

`CLAUDE.md` is a regular file:

```markdown
@AGENTS.md
```

## Library architecture

```text
AGENTS.md
CLAUDE.md
.agents/skills/spec-library/
├── SKILL.md
├── index.html
├── specs/
│   ├── index.html
│   ├── saved-library/
│   │   └── business.html
│   └── content-discovery-export/
│       ├── business.html
│       ├── technical.html
│       └── plan.html
├── decisions/
│   ├── index.html
│   ├── architecture.html
│   └── design.html
└── templates/
    ├── business-spec.html
    ├── technical-spec.html
    ├── plan.html
    └── decision-category.html
.claude/skills/spec-library -> ../../.agents/skills/spec-library
```

The root library index is the read-first catalog. It links to all internal spec-library documents, keeps latest documents easy to reach, and summarizes each document's purpose, status, and update date:

```html
<main>
  <header>
    <h1>Spec Library</h1>
    <p class="meta">Read-first catalog for internal product and technical specification documents.</p>
  </header>
  <section>
    <h2>Latest documents</h2>
    <ul>
      <li>
        <a href="specs/content-discovery-export/plan.html">Content discovery export plan</a>
        <span class="meta">Last updated 2026-06-18. Implementation handoff and verification record.</span>
      </li>
    </ul>
  </section>
  <section>
    <h2>All documents</h2>
    <ul>
      <li><a href="specs/index.html">Specs index</a></li>
      <li><a href="decisions/index.html">Decisions index</a></li>
    </ul>
  </section>
</main>
```

The focused indexes expose only enough metadata for an agent to decide what to load:

```html
<main>
  <header>
    <h1>Specs Index</h1>
    <p class="meta">Short entries for progressive disclosure.</p>
  </header>
  <section>
    <h2>Implemented</h2>
    <ul>
      <li>
        <a href="content-discovery-export/business.html">Content discovery export</a>
        <span class="meta">Unified discovery, ordering, and export for the active saved-content scope.</span>
      </li>
    </ul>
  </section>
</main>
```

## Business spec

The business document describes the product contract and the user's reuse choice in product terms. Code paths and extraction mechanics belong in the technical spec. Its violet accent identifies the artifact type, while visible labels and restrained highlights carry the meaning without depending on color:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="artifact-type" content="business-spec">
  <meta name="status" content="approved">
  <title>Content discovery and export</title>
  <style>
    :root { color-scheme: light dark; --bg: #f8f7f3; --ink: #202124; --line: #d9d4c7; --accent: #7c3aed; --accent-soft: #ede9fe; --accent-ink: #4c1d95; --mark: #fff0a6; --mark-ink: #4b3500; }
    body { margin: 0; font: 16px/1.65 system-ui, sans-serif; color: var(--ink); background: var(--bg); }
    main { width: min(76ch, calc(100% - 32px)); margin: 0 auto; padding: 48px 0; }
    p { margin: .8em 0; }
    ul, ol { padding-left: 1.5em; }
    li + li { margin-top: .55em; }
    li > p { margin: .35em 0; }
    strong { font-weight: 700; }
    em { font-style: italic; }
    header { padding: 24px; background: var(--accent-soft); border-left: 6px solid var(--accent); border-radius: 8px; }
    .kicker { color: var(--accent-ink); font-weight: 750; text-transform: uppercase; }
    .badge { padding: 2px 8px; color: var(--accent-ink); border: 1px solid var(--accent); border-radius: 999px; font-weight: 700; }
    .keyword, mark { padding: .05em .24em; color: var(--mark-ink); background: var(--mark); border-radius: 3px; font-weight: 700; }
    table { width: 100%; border-collapse: collapse; }
    th, td { padding: 10px 12px; border: 1px solid var(--line); text-align: left; vertical-align: top; }
    th { color: var(--accent-ink); background: var(--accent-soft); }
    a { color: var(--accent); }
    a:focus-visible { outline: 3px solid var(--accent); outline-offset: 3px; }
    @media (prefers-color-scheme: dark) {
      :root { --bg: #171717; --ink: #f2f2f2; --line: #3f3f3f; --accent: #c4b5fd; --accent-soft: #302652; --accent-ink: #f1edff; --mark: #5c4600; --mark-ink: #fff1a8; }
    }
  </style>
</head>
<body data-artifact="business-spec">
  <main>
    <header>
      <p class="kicker">Business spec</p>
      <h1>Content discovery and export</h1>
      <p><span class="badge">Approved</span> Product contract for unified discovery and scoped export.</p>
    </header>
    <section>
      <h2>Goal</h2>
      <p>Help readers find and reuse the <mark>complete active set</mark> of saved material relevant to their current context.</p>
    </section>
    <section>
      <h2>Intended users</h2>
      <p>People who save many items from across the internet and may not remember their original organization choices.</p>
    </section>
    <section>
      <h2>Acceptance criteria</h2>
      <ul>
        <li><strong>Recognizable results.</strong> Discovery clearly identifies result types.</li>
        <li><strong>Complete export.</strong> Export includes the complete active result set in visible order.</li>
        <li>
          <p><strong>Existing behavior preserved.</strong> Saved-library export retains its current scope, ordering, permissions, and failure behavior.</p>
          <p>These guarantees continue to hold after the shared logic is introduced.</p>
        </li>
      </ul>
    </section>
    <section>
      <h2>Reuse analysis and approved approach</h2>
      <p><strong>Both exports need complete results in visible order.</strong> Saved-library export already completes every page; discovery needs those same guarantees but supports additional result types.</p>
      <p><strong>Selected and approved:</strong> adapt the existing behavior by sharing page completion between the two exports, while each feature retains control of its own scope and result types.</p>
      <p>This was the agent's recommended option because the two concrete flows share completion requirements but differ in query and record contracts.</p>
      <ul>
        <li><strong>Reuse as-is:</strong> would require narrowing discovery export to saved items.</li>
        <li><strong>Separate implementation:</strong> would preserve isolation but duplicate completion behavior and fixes.</li>
      </ul>
      <p>The user could also propose another custom boundary.</p>
      <p><strong>Product consequences:</strong> both exports deliver their complete active set in visible order, and <mark>a failed page prevents a partial download</mark>.</p>
      <p>Shared changes require verification of both flows; saved-library behavior must remain unchanged.</p>
      <p><strong>Approval:</strong> during discovery, the user explicitly selected the shared page-completion helper for both exports while retaining per-feature queries, permissions, and record conversion. Canonical record: <a href="../../decisions/architecture.html#ARC-001">ARC-001</a>.</p>
    </section>
    <section>
      <h2>Document relationships</h2>
      <table>
        <thead><tr><th>Role</th><th>Document</th><th>Why it matters</th></tr></thead>
        <tbody>
          <tr><td>Technical design</td><td><a href="technical.html">Technical spec</a></td><td>Defines how the complete active set is loaded and serialized.</td></tr>
          <tr><td>Implementation plan</td><td><a href="plan.html">Implementation plan</a></td><td>Turns this product contract into ordered, verifiable work.</td></tr>
          <tr><td>Related spec</td><td><a href="../saved-library/business.html">Saved library</a></td><td>Consulted unchanged: owns the existing export contract that the shared extraction must preserve.</td></tr>
          <tr><td>Decision constraint</td><td><a href="../../decisions/design.html#DES-002">DES-002</a></td><td>Consulted unchanged: preserves the established calm, compact interaction constraints.</td></tr>
          <tr><td>Decision constraint</td><td><a href="../../decisions/architecture.html#ARC-001">ARC-001</a></td><td>Newly approved reuse/abstraction choice: records the user's selected sharing boundary and rejected alternatives.</td></tr>
        </tbody>
      </table>
      <p>Other existing specs or active decisions changed: None.</p>
    </section>
  </main>
</body>
</html>
```

## Technical spec

The technical document records durable boundaries and may include a simple diagram when it helps. This excerpt shows the approved design before implementation; close-out updates its decision-impact status to applied and verified:

```html
<section>
  <h2>Proposed approach</h2>
  <p>Use one discovery surface over existing entity queries. <strong>Complete the active paginated result set before serialization.</strong></p>
  <h3>Reuse analysis and approved approach</h3>
  <p><strong>The existing exporter already implements page completion and ordering.</strong> Inspection found these guarantees in <code>exportSavedLibrary()</code> in <code>src/features/saved-library/export.ts</code>.</p>
  <ul>
    <li><strong>Active scope:</strong> the caller <code>ExportButton.handleExport()</code> in <code>src/features/saved-library/ExportButton.tsx</code> supplies the current scope.</li>
    <li><strong>Feature-specific contract:</strong> <code>buildSavedLibraryQuery()</code> in <code>src/features/saved-library/results.ts</code> constructs the query; the exporter also assumes saved-item conversion.</li>
    <li><strong>Existing evidence:</strong> <code>src/features/saved-library/export.test.ts</code> covers multi-page completion, order, and later-page failure.</li>
  </ul>
  <p>Reuse as-is is incompatible with discovery's additional result types. A separate implementation would repeat the tested pagination behavior.</p>
  <p>The approved custom option extracts <em>only page completion</em> into the proposed <code>completeActiveResults()</code> helper in <code>src/shared/export/complete-active-results.ts</code>. Its consumers will be the existing <code>exportSavedLibrary()</code> and the new <code>exportDiscoveryResults()</code> in <code>src/features/discovery/export.ts</code>.</p>
  <p>Both consumers have concrete requirements; the helper and discovery exporter are <strong>proposed additions</strong>, and no general export framework is justified.</p>
  <h3>Approved boundary and verification</h3>
  <p>The helper accepts a feature-provided page loader for a captured active scope and completes results in that scope's existing order.</p>
  <p><strong>Each feature owns query construction, permission enforcement, and record conversion.</strong> The helper introduces no shared cache, new access rights, or schema change.</p>
  <p>Keep consumers' error handling and output contracts explicit: <mark>do not serialize a partial set</mark> when any page fails.</p>
  <ul>
    <li><strong>Both consumers:</strong> verify empty, single-page, and multi-page results, ordering and filtering, permissions, and later-page failures.</li>
    <li><strong>Feature coverage:</strong> retain existing saved-library expectations and add discovery coverage for its additional result types.</li>
  </ul>
  <p>If inspection or verification changes the approved sharing boundary, <strong>return to the user before implementing the changed choice</strong>.</p>
  <figure class="panel">
    <figcaption>Export path</figcaption>
    <svg role="img" aria-labelledby="export-title" viewBox="0 0 560 120">
      <title id="export-title">Visible results are completed before export serialization.</title>
      <rect x="10" y="35" width="130" height="50" rx="6"></rect>
      <text x="75" y="65" text-anchor="middle">Active scope</text>
      <path d="M150 60 H250"></path>
      <rect x="260" y="35" width="130" height="50" rx="6"></rect>
      <text x="325" y="65" text-anchor="middle">Complete set</text>
      <path d="M400 60 H500"></path>
      <rect x="510" y="35" width="40" height="50" rx="6"></rect>
    </svg>
  </figure>
</section>
<section>
  <h2>Decision impact</h2>
  <p><a href="../../decisions/architecture.html#ARC-001">ARC-001 — Share active-result completion between saved-library and discovery exports</a> records the reuse/abstraction boundary explicitly approved during discovery.</p>
  <p>Implementation status remains <strong>pending until verified</strong>; the implementation plan applies the approved choice. <a href="../../decisions/design.html#DES-002">DES-002</a> was consulted unchanged. Existing active decisions modified: None.</p>
</section>
<section>
  <h2>Document relationships</h2>
  <table>
    <thead><tr><th>Role</th><th>Document</th><th>Why it matters</th></tr></thead>
    <tbody>
      <tr><td>Product contract</td><td><a href="business.html">Business spec</a></td><td>Defines the complete-set behavior this design must preserve.</td></tr>
      <tr><td>Implementation plan</td><td><a href="plan.html">Implementation plan</a></td><td>Applies these boundaries in task order and verification.</td></tr>
      <tr><td>Related spec</td><td><a href="../saved-library/business.html">Saved library</a></td><td>Consulted unchanged: defines the existing consumer's preserved product contract.</td></tr>
      <tr><td>Decision constraint</td><td><a href="../../decisions/design.html#DES-002">DES-002</a></td><td>Consulted unchanged: constrains the export interaction without changing its design rule.</td></tr>
      <tr><td>Decision constraint</td><td><a href="../../decisions/architecture.html#ARC-001">ARC-001</a></td><td>Newly approved reuse/abstraction choice: limits shared completion to the two known consumers.</td></tr>
    </tbody>
  </table>
</section>
```

## Implementation plan

The plan carries execution details and explicitly keeps the users visible:

```html
<main>
  <header>
    <h1>Content discovery and export: implementation plan</h1>
    <p class="meta">Status: ready</p>
  </header>
  <section>
    <h2>Goal and intended users</h2>
    <p>Make discovery and scoped reuse reliable as a saved library grows for heavy internet readers. Verification must cover the <span class="keyword">complete active set</span>.</p>
  </section>
  <section>
    <h2>Execution boundary</h2>
    <p><strong>Authorized phase:</strong> implement and verify the approved discovery/export spec.</p>
    <p><strong>Stop after reporting</strong> the outcome, verification, remaining limitations, and documentation impact. Merge, pull request, deployment, monitoring, and review handling remain out of scope.</p>
  </section>
  <section>
    <h2>Execution recommendation and decision</h2>
    <p><strong>Selected by user:</strong> hybrid, as recommended.</p>
    <p>Keep the shared discovery design in the current session; delegate bounded tests and browser verification to efficient workers.</p>
  </section>
  <section>
    <h2>Integrated task plan</h2>
    <table>
      <thead><tr><th>ID</th><th>Task</th><th>Category</th><th>Effort</th><th>Plan / delegation confidence</th><th>Assignment</th></tr></thead>
      <tbody>
        <tr><td>T1</td><td>Normalize discovery inputs and extract approved page completion for both export consumers</td><td>design</td><td>M</td><td>high / medium</td><td>same-session, strong-worker, high</td></tr>
        <tr><td>T2</td><td>Verify complete-set, ordering, permission, and failure behavior in both export flows</td><td>tests</td><td>S</td><td>high / high</td><td>delegated, efficient-worker, medium</td></tr>
      </tbody>
    </table>
  </section>
  <section>
    <h2>Document relationships</h2>
    <table>
      <thead><tr><th>Role</th><th>Document</th><th>Why it matters</th></tr></thead>
      <tbody>
        <tr><td>Product contract</td><td><a href="business.html">Business spec</a></td><td>Supplies the outcomes and acceptance criteria each task must satisfy.</td></tr>
        <tr><td>Technical design</td><td><a href="technical.html">Technical spec</a></td><td>Supplies the approved boundaries and verification strategy.</td></tr>
        <tr><td>Related spec</td><td><a href="../saved-library/business.html">Saved library</a></td><td>Consulted unchanged: supplies regression expectations for the existing consumer.</td></tr>
        <tr><td>Decision constraint</td><td><a href="../../decisions/design.html#DES-002">DES-002</a></td><td>Consulted unchanged: preserves established interaction constraints during verification.</td></tr>
        <tr><td>Decision constraint</td><td><a href="../../decisions/architecture.html#ARC-001">ARC-001</a></td><td>Newly approved reuse/abstraction choice: constrains T1 to the selected sharing boundary and T2 to both consumers.</td></tr>
      </tbody>
    </table>
  </section>
</main>
```

## Close-out

After implementation and verification, the agent reports what changed, the verification performed, any remaining limitations, and the exact specs and decisions consulted or changed:

> Both export flows now share active-result completion while preserving their own queries, permissions, and record conversion. Verification covered complete results, visible ordering, permissions, and later-page failure in both consumers. The content-discovery-export business spec, technical spec, and plan were updated. `ARC-001` is applied and verified; the saved-library business spec and `DES-002` were consulted unchanged. No remaining limitations were identified in the approved scope.

## Durable decision

Approved reuse and abstraction choices are recorded in the canonical decision registry, including their approval and alternatives. Other choices still follow the sparse-registry durability criteria. This choice becomes a section in a living category document, not an artifact owned by the feature. The following excerpt shows its state after implementation and verification:

```html
<main>
  <header>
    <h1>Architecture decisions</h1>
    <p class="meta">Only populated categories, durable project choices, and explicitly approved reuse/abstraction choices belong here.</p>
  </header>
  <section id="ARC-001">
    <h2>ARC-001 — Share active-result completion between saved-library and discovery exports</h2>
    <p class="meta">Status: active. Implementation: applied and verified. Last updated: 2026-07-22.</p>
    <h3>Decision</h3>
    <p><strong>Share page completion between saved-library and discovery exports.</strong> Each consumer retains its own active query, permission enforcement, and record conversion.</p>
    <h3>Applies to</h3>
    <p>The two approved consumers: saved-library export and discovery export. Evaluate compatibility before proposing reuse for another consumer; this approval does not authorize a general export framework.</p>
    <h3>Why</h3>
    <p>Both flows need complete results in visible order and must fail rather than download a partial set. Inspected saved-library export code and tests already implement those guarantees, while discovery needs different query and record contracts.</p>
    <p>Sharing <em>only completion</em> avoids duplicate fixes without coupling those contracts.</p>
    <h3>Alternatives considered</h3>
    <ul>
      <li><strong>Reuse as-is — rejected.</strong> The existing exporter assumes saved-item records and would narrow discovery export's required scope.</li>
      <li><strong>Separate implementation — rejected.</strong> It duplicates completion behavior, though it would isolate future changes.</li>
      <li>
        <p><strong>Custom adaptation/extraction — selected as recommended.</strong> Limited to page completion for the two known consumers.</p>
        <p>No broader abstraction was approved.</p>
      </li>
    </ul>
    <h3>Approval</h3>
    <p>Explicitly approved by the user during discovery: “Extract the shared page-completion helper for both export flows. Keep queries, permissions, and record conversion in each feature, and keep existing saved-library export behavior unchanged.” The agent recommendation and documentation branch selection were not treated as approval.</p>
    <h3>How to apply</h3>
    <ol>
      <li><strong>Capture the active scope.</strong> Supply a feature-owned page loader to <code>completeActiveResults()</code> in <code>src/shared/export/complete-active-results.ts</code>.</li>
      <li><strong>Complete results before serialization.</strong> Preserve scope, order, and failure semantics.</li>
      <li><strong>Verify both callers.</strong> Changes to shared completion require regression checks for both export flows.</li>
    </ol>
    <p>The <a href="../specs/content-discovery-export/technical.html">technical spec</a> records inspected source paths and verification details.</p>
    <h3>Tradeoffs and consequences</h3>
    <p>The shared helper couples completion changes across both consumers, so both require regression checks. Queries, permissions, and serialization remain outside the helper. Revisit approval if evidence requires a broader extraction or changes those boundaries.</p>
    <h3>Exceptions</h3>
    <p>None currently.</p>
    <h3>Change history</h3>
    <ul>
      <li>2026-07-22: Recorded the user's explicit discovery approval; implementation pending. Linked to the <a href="../specs/content-discovery-export/business.html">content discovery and export spec</a> after the user chose to create it.</li>
      <li>2026-07-22: Applied and verified for both consumers; the approved boundary remained unchanged.</li>
    </ul>
  </section>
</main>
```

The decision index links directly to `architecture.html#ARC-001` with its title, active status, scope, and update date; the root index exposes the populated category and decision index. If the user instead chose `Continue without a new spec`, the same approved choice and approval evidence would remain in the canonical decision and necessary index entries, with no links to nonexistent feature artifacts and no feature entry in the spec indexes. An unapproved recommendation would not become an active decision or authorize extraction.

The business and technical specs remain useful after shipping. `plan.html` holds the integrated task plan, selected execution strategy, and verification results, while the decision registry preserves approved choices and their history.
