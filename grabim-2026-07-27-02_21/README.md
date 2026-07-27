# Grabim session — start here

This archive contains implementation feedback for **What is Simplest SDD?**. Inspect the files locally; no external service or upload is required.

## How to inspect and use this session

1. Read `session.md` for Style modifications, General changes, and image-linked feedback.
2. Open each numbered PNG in the same order as its section in `session.md`.
3. Match the numbered markers in each PNG with the numbered notes in that image's section.
4. Use `session.json` when exact style intent, DOM movement, coordinates, status, page metadata, or React context are useful.
5. Implement every open style intent, movement, and note in React source, preserve unrelated UI, and use resolved items only as background context.

## Style implementation guidance

Confirmed style values describe the intended visual result and scope; the temporary element-level overrides used for preview are not a literal source-code patch.

- Keep each change scoped to the named component or element. Do not redefine shared utility classes, design-system primitives, or broad selectors just to reproduce one local preview.
- Use the project’s existing styling conventions and the narrowest durable source: an existing utility or token, a component variant or prop, a CSS Module/local selector, or another component-scoped rule.
- Do not preserve an inline preview mechanically when the codebase has a better native representation. For example, if the preview sets `padding-top: 0.75rem` and this project’s Tailwind configuration maps that value to `pt-3`, use the appropriate `pt-3` class on this component instead of adding `style={{ paddingTop: "0.75rem" }}`.
- Treat inherited edits as intent for the named ancestor only. Avoid changing a global typography or alignment rule unless the surrounding React context proves that the change is meant to be global.
- Preserve responsive breakpoints, interaction states, theme variants, and design tokens. Use responsive or state utilities such as `md:` or `hover:` when the intended change belongs to those conditions.
- Match the confirmed computed result, then verify nearby instances remain unchanged.

## Contents

- `session.md` — human-readable instructions and notes.
- `session.json` — machine-readable metadata; its `entrypoint` points back to this file.
- `image-01.png` — annotated capture.
- `image-02.png` — annotated capture.
- `image-03.png` — annotated capture.
