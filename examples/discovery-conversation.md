# Example discovery conversation

The agent inspects a small invoicing app. It can infer that freelancers are the likely end users and that the product aims to reduce invoicing work, but it finds no directional examples. It starts with one prerequisite question that does not count toward the discovery minimum:

> Which existing app, personal project, or general product should influence the invoicing experience, and what specific quality should we learn from it?

It then asks the core questions:

1. I infer the primary users are freelancers who invoice repeatedly and care most about getting paid without administrative work. What should I correct?
2. Should success prioritize faster invoice creation, payment collection, or both?
3. Which user problem should win when features compete: speed, accounting accuracy, or customization?
4. Which product qualities should guide tradeoffs?
5. What should stay out of the product even if competitors include it?
6. Must all payment and customer data remain behind server routes?
7. Do billing, database migrations, auth, and public API changes require technical approval?
8. Which commands and browser flows define “done” for this repository?

After the answers, the agent adds project-specific principles instead of generic advice such as “write clean code.”
