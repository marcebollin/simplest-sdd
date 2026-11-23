import { promptResponse, prompts } from "../lib/prompts";

export const prerender = true;

export function GET() {
  return promptResponse(prompts.init);
}
