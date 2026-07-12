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
- For spec-driven work, recommend same-session, delegated, or hybrid execution from the classified tasks, but do not spawn a subagent before the user selects the strategy.
- Always offer same-session execution and show a concrete custom assignment example.
- Without an explicit stop point, stop after the selected strategy completes the approved implementation, verification, analytics, and close-out.
- Do not continue into commits, pull requests, deployment, monitoring, or review handling unless the current prompt explicitly requests it.

## Spec-driven workflow

| When | Load |
| --- | --- |
| Output review takes more than ~5 minutes, or work carries meaningful ambiguity or risk | `.agents/skills/spec-library/SKILL.md` |
| Question about past specs, plans, decisions, or internal spec documentation | `.agents/skills/spec-library/index.html` |
| Question about a past decision | `.agents/skills/spec-library/decisions/index.html` |
| Clear low-risk output reviewable within ~5 minutes | Implement and verify directly |
```

The spec workflow starts by refining the request into generated `business.html`, `technical.html`, and one integrated `plan.html`. It creates `execution.json`, recommends an execution strategy, and waits for explicit spec and strategy approval before implementation.

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
│   └── export-reuses-active-result-set.html
└── templates/
    ├── business-spec.html
    ├── technical-spec.html
    ├── plan.html
    ├── execution-template.json
    └── decision-template.html
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

The business document describes the product contract without implementation instructions:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="artifact-type" content="business-spec">
  <meta name="status" content="approved">
  <title>Content discovery and export</title>
  <style>
    body { margin: 0; font: 16px/1.65 system-ui, sans-serif; color: #202124; background: #f8f7f3; }
    main { width: min(76ch, calc(100% - 32px)); margin: 0 auto; padding: 48px 0; }
    a:focus-visible { outline: 3px solid #0b6bcb; outline-offset: 3px; }
  </style>
</head>
<body>
  <main>
    <header>
      <h1>Content discovery and export</h1>
      <p class="meta">Product contract for unified discovery and scoped export.</p>
    </header>
    <section>
      <h2>Goal</h2>
      <p>Help readers find and reuse the complete set of saved material relevant to their current context.</p>
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
    <p>Make discovery and scoped reuse reliable as a saved library grows for heavy internet readers.</p>
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
</main>
```

## Durable decision

Only a choice that affects future features is promoted from the technical spec:

```html
<main>
  <header>
    <h1>Reuse the active result set for exports</h1>
    <p class="meta">Importance: medium. Status: active.</p>
  </header>
  <section>
    <h2>Decision</h2>
    <p>Complete and serialize the active paginated result set.</p>
  </section>
  <section>
    <h2>Over</h2>
    <p>Maintaining a separate all-record export query.</p>
  </section>
  <section>
    <h2>Why</h2>
    <p>It prevents visible results and exports from using different scopes while reusing already loaded data.</p>
  </section>
</main>
```

The business and technical specs remain useful after shipping. `plan.html` holds the single integrated implementation record, while `execution.json` and the derived JSONL ledger make routing, models, tokens, and outcomes queryable later. See the complete [execution record example](execution-record.json).
