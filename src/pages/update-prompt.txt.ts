import updatePrompt from "../../prompts/update.md?raw";

export const prerender = true;

export function GET() {
  return new Response(updatePrompt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
