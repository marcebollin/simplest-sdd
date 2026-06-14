# Read-later project: discovery conversation

This example abstracts a real read-later application without exposing its codebase or private implementation details.

From the repository, the agent infers:

- **Goal:** help people capture, organize, rediscover, and read useful material from across the internet.
- **Intended users:** people who read heavily online and want to preserve attention instead of managing a complicated knowledge system.
- **Existing clues:** saving links is already fast, content is organized through several entity types, and the interface favors calm, compact workflows.

Because the goal and clues are already visible, the agent does not ask the two optional prerequisite questions. It asks the mandatory product questions:

1. I infer this feature is for heavy internet readers who need to find previously saved material without remembering how they organized it. What should I correct?
2. Should success mean faster discovery, more complete results, easier export, or a particular combination?
3. Should the new flow supplement the existing filters or replace them?
4. Which behavior is explicitly out of scope, such as changing saved-item cards or organization semantics?
5. Which product and technical constraints matter most when choosing the approach?
6. What user-visible flow and automated checks would make the result acceptable?

The answers become product context, not a prescribed file list. The agent still inspects the codebase and chooses the implementation surfaces.
