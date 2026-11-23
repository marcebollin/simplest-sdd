# Simplest SDD bootstrap prompt

Give this instruction to a coding agent in the target project.

```text
Run npx simplest-sdd@latest init and follow the instructions
```

The agent installs the local skill and the project's testing guidance. A settled product rule creates or updates `DECISIONS.md`. A recurring workflow correction updates Project practice. For an existing library, use `update` in place of `init`. To deactivate the skill while preserving the documents, use `remove`.

The CLI assembles the workflow from [the shared contract](prompts/contract.md) and the [init](prompts/init.md), [update](prompts/update.md) or [remove](prompts/remove.md) instructions. See the [migration overview](README.md#updating-an-older-installation) for how previous schemas convert to business decisions.
