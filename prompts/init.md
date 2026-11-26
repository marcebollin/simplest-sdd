# Simplest SDD Init Instructions

Install Simplest SDD schema `{{schemaVersion}}` in the current project. The CLI prints instructions. The agent applying them creates the guidance, decision library and Claude compatibility link.

## Rules

Preserve the project's instructions, testing policy, configuration, skills and documents. Keep `AGENTS.md` and `.agents/skills/` canonical. If either the canonical or the Claude location already holds a Simplest SDD skill, a preserved `DECISIONS.md` or an older decision library, run `npx simplest-sdd@latest update` instead. A preserved library can be reactivated this way.

## Inspect The Project And Its Testing Discipline

Start with the repository instructions, README and manifests. Inspect source, CI, tests and relevant skills as needed to establish the product's purpose, users and testing practice.

Resolve the testing discipline from explicit project instructions first, then a relevant installed testing skill, then the working test setup. Preserve TDD, another defined approach, or an intentional test-free stance. Verify commands and their prerequisites. If a configured command cannot run here, keep the policy and report the gap. When no discipline is established, identify the available build, lint, type or manual checks. Offer testing setup if it would help. Installation can finish without a test runner.

## Ask Only What You Need

Use the request and repository to identify purpose, users and priorities. Ask only about an unresolved decision whose answer would change the installed guidance. For example, if a product serves two audiences and their priorities conflict, describe the trade-off. Group independent questions and recommend an answer where the evidence supports one. A clear installation needs no questions.

Record durable business decisions the user states or confirms, including decisions supplied directly in the request. A repository convention or an implementation detail alone does not establish a business decision. With no lasting decisions yet, install only the skill entrypoint and agent configuration. Create `DECISIONS.md` beside the entrypoint when there is something to record.

## Make `AGENTS.md` Canonical Without Losing Content

Keep the existing instructions and incorporate unique Claude content as described in Claude Compatibility. If no instructions exist, create a concise `AGENTS.md` using the project facts you found. Include the audience and communication brief below, reusing any guidance the project already has. Add the workflow, adapted to this project.

{{contract}}

## Validate

- Verify the schema marker, skill frontmatter, canonical instructions, regular `CLAUDE.md` import, relative Claude skill link and reference links. Check that a new conversation can find the audience brief from `AGENTS.md`.
- Confirm the installed skill contains local project practice and verified testing commands or their canonical link. If decisions were recorded, check their IDs and Markdown links. A fresh install creates no HTML or empty directories.
- Check that a plain-language product decision and a recurring workflow correction reach their respective files, and a one-off request creates no standing policy. Check that a clear bug fix can honor an existing rule without an interview or new record, and that a request affecting a shared capability leads the agent to its other consumers.
- Run applicable documentation or build checks. Report the installed files, testing discipline, inferred project facts and any missing verification.
