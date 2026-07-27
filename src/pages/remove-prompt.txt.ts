import removePrompt from "../../prompts/remove.md?raw";

export const prerender = true;

export function GET() {
  return new Response(removePrompt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
