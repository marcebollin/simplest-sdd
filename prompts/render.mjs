// Expand the shared contract before filling the schema marker inside it.
export function renderPrompt(template, contract, values) {
  return template
    .replace("{{contract}}", () => contract.trimEnd())
    .replace(/\{\{(\w+)\}\}/g, (_match, key) => values[key] ?? "");
}
