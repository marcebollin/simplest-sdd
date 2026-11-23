import contractRaw from "../../prompts/contract.md?raw";
import initRaw from "../../prompts/init.md?raw";
import removeRaw from "../../prompts/remove.md?raw";
import updateRaw from "../../prompts/update.md?raw";
import { renderPrompt } from "../../prompts/render.mjs";
import schema from "../../schema/versions.json";

// The static site has no target repository from which to gather an inventory.
const values = {
  schemaVersion: schema.currentSchemaVersion,
  detectedState: "Inspect the installed files in the target repository.",
  versionHistory: "Earlier and unversioned installations can migrate directly under the instructions below."
};

export const prompts = {
  init: renderPrompt(initRaw, contractRaw, values),
  update: renderPrompt(updateRaw, contractRaw, {
    ...values,
    detectedState: "Run `npx simplest-sdd@latest update` in the target repository for its file inventory and cleanup instructions."
  }),
  remove: renderPrompt(removeRaw, "", values)
};

export function promptResponse(prompt: string) {
  return new Response(prompt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
