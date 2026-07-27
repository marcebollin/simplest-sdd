import initPrompt from "../../prompts/init.md?raw";

export const prerender = true;

export function GET() {
  return new Response(initPrompt, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8"
    }
  });
}
