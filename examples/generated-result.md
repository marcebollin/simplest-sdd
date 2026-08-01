# Read-later project: generated result

This is an abbreviated example of the system generated for a mature read-later application.

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
- Always offer same-session execution and show a concrete custom assignment example.
- Without an explicit stop point, stop after the selected strategy completes the approved implementation, verification, analytics, and close-out.
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

When the skill activates, it inspects relevant specs and decisions and shows their exact paths or anchors with the request-refinement questions. After the answers, an existing owning spec updates automatically without business-spec approval. Only when no existing spec owns the behavior does it present `Create a new spec` and `Continue without a new spec`, mark exactly one choice `(Recommended)`, and wait. Sensitive technical changes retain explicit approval in every branch.

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
├── data/
│   └── executions.jsonl
├── specs/
│   ├── index.html
│   └── content-discovery-export/
│       ├── business.html
│       ├── technical.html
│       ├── plan.html
│       └── execution.json
├── decisions/
│   ├── index.html
│   └── architecture.html
└── templates/
    ├── business-spec.html
    ├── technical-spec.html
    ├── plan.html
    ├── execution-template.json
    └── decision-category.html
.claude/skills/spec-library -> ../../.agents/skills/spec-library
```

The root library index is the read-first catalog. It links to all internal spec-library documents, keeps latest documents easy to reach, and exposes category, effort, confidence, strategy, actual models, tokens, and outcome for static filtering:

```html
<main>
  <header>
    <h1>Spec Library</h1>
    <p class="meta">Read-first catalog for internal product and technical specification documents.</p>
  </header>
  <section>
    <h2>Execution summary</h2>
    <p><a href="specs/content-discovery-export/execution.json">Content discovery export</a> · feature + performance · effort M · plan confidence high · delegation confidence high · hybrid · 184,200 measured tokens · complete</p>
  </section>
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

The business document describes the product contract without implementation instructions. Its violet accent identifies the artifact type, while visible labels and restrained highlights carry the meaning without depending on color:

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
        <li>Discovery clearly identifies result types.</li>
        <li>Export includes the complete active result set in visible order.</li>
      </ul>
    </section>
    <section>
      <h2>Document relationships</h2>
      <table>
        <thead><tr><th>Role</th><th>Document</th><th>Why it matters</th></tr></thead>
        <tbody>
          <tr><td>Technical design</td><td><a href="technical.html">Technical spec</a></td><td>Defines how the complete active set is loaded and serialized.</td></tr>
          <tr><td>Implementation plan</td><td><a href="plan.html">Implementation plan</a></td><td>Turns this product contract into ordered, verifiable work.</td></tr>
        </tbody>
      </table>
      <p>No additional decision or related-spec references.</p>
    </section>
  </main>
</body>
</html>
```

## Technical spec

The technical document records durable boundaries and may include a simple diagram when it helps:

```html
<section>
  <h2>Proposed approach</h2>
  <p>Use one discovery surface over existing entity queries. Complete the active paginated result set before serialization.</p>
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
  <p>This feature will create <a href="../../decisions/architecture.html#ARC-001">ARC-001 — Reuse the active result set for exports</a> because the rule will govern future export surfaces.</p>
</section>
<section>
  <h2>Document relationships</h2>
  <table>
    <thead><tr><th>Role</th><th>Document</th><th>Why it matters</th></tr></thead>
    <tbody>
      <tr><td>Product contract</td><td><a href="business.html">Business spec</a></td><td>Defines the complete-set behavior this design must preserve.</td></tr>
      <tr><td>Implementation plan</td><td><a href="plan.html">Implementation plan</a></td><td>Applies these boundaries in task order and verification.</td></tr>
      <tr><td>Decision constraint</td><td><a href="../../decisions/architecture.html#ARC-001">ARC-001</a></td><td>Makes active-result reuse binding for this and future export surfaces.</td></tr>
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
    <p>Make discovery and scoped reuse reliable as a saved library grows for heavy internet readers. <span class="keyword">Verification must cover the complete active set.</span></p>
  </section>
  <section>
    <h2>Execution boundary</h2>
    <p>Authorized phase: implement and verify the approved discovery/export spec. Stop after analytics and close-out evidence are recorded. Merge, pull request, deployment, monitoring, and review handling remain out of scope.</p>
  </section>
  <section>
    <h2>Execution recommendation and decision</h2>
    <p>Recommended: hybrid. Keep the shared discovery design in the current session; delegate bounded tests and browser verification to efficient workers. Selected by user: hybrid as recommended.</p>
  </section>
  <section>
    <h2>Integrated task plan</h2>
    <table>
      <thead><tr><th>ID</th><th>Task</th><th>Category</th><th>Effort</th><th>Plan / delegation confidence</th><th>Assignment</th></tr></thead>
      <tbody>
        <tr><td>T1</td><td>Normalize discovery and ordering inputs</td><td>design</td><td>M</td><td>high / medium</td><td>same-session, strong-worker, high</td></tr>
        <tr><td>T2</td><td>Add focused tests and browser verification</td><td>tests</td><td>S</td><td>high / high</td><td>delegated, efficient-worker, medium</td></tr>
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
        <tr><td>Execution record</td><td><a href="execution.json">Execution record</a></td><td>Records selected assignments, actual runs, usage, and outcomes.</td></tr>
        <tr><td>Decision constraint</td><td><a href="../../decisions/architecture.html#ARC-001">ARC-001</a></td><td>Constrains T1 to reuse the active result set.</td></tr>
      </tbody>
    </table>
  </section>
</main>
```

## Durable decision

Only a choice whose cross-feature intent is materially safer to preserve than infer is promoted. It becomes a section in a living category document, not an artifact owned by the feature:

```html
<main>
  <header>
    <h1>Architecture decisions</h1>
    <p class="meta">Only populated categories and durable cross-feature choices belong here.</p>
  </header>
  <section id="ARC-001">
    <h2>ARC-001 — Reuse the active result set for exports</h2>
    <p class="meta">Status: active. Last updated: 2026-07-22.</p>
    <h3>Decision</h3>
    <p>Complete and serialize the active paginated result set.</p>
    <h3>Applies to</h3>
    <p>Current and future exports derived from an interactive result set.</p>
    <h3>Why</h3>
    <p>It prevents visible results and exports from using different scopes while reusing already loaded data.</p>
    <h3>How to apply</h3>
    <p>Complete the active query scope before serialization rather than introducing an independent export query.</p>
    <h3>Exceptions</h3>
    <p>None currently.</p>
    <h3>Change history</h3>
    <ul><li>2026-07-22: Created by the content discovery and export spec.</li></ul>
  </section>
</main>
```

The business and technical specs remain useful after shipping. `plan.html` holds the single integrated implementation record, while `execution.json` and the derived JSONL ledger make routing, models, tokens, and outcomes queryable later. See the complete [execution record example](execution-record.json).
