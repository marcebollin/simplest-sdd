# Reading lists

This read-later example keeps the rules for three lists in a single Markdown file. You can read the records, follow their links or edit the rules directly. [Open DECISIONS.md](DECISIONS.md).

## A clear fix

**Reader:** “In compact search results, clicking the title no longer opens the item. Fix it.”

**Agent:** “DES-001 says both card sizes open the item in the same way. Search already uses the shared item card. I'll reproduce the failure with the compact card, fix it there, and check the regular card too.”

This fix restores the agreed behavior. The tests and code change. The decision already says what future work should honor.

## A new consumer and one open choice

**Reader:** “Bring the compact card to our partner reading list. People should see how long items take.”

Searching the decision file for “card” finds **DES-001** for the shared component and **LST-001** for its time label. The agent finds that the partner site can use the existing compact size. Articles have a reading-time estimate. Some videos have a known runtime. Estimating video length would conflict with the article-only rule.

**Agent:** “The card already supports the compact size. LST-001 reserves reading estimates for articles. Should the card also show a video's known runtime wherever that same card appears? I recommend labeling it ‘runtime’ and leaving the label out when duration is unknown.”

**Reader:** “Yes. Use the same labels on all three lists.”

The agent extends the shared card's time label and verifies library, search and partner views under the project's TDD policy. It adds the partner list to DES-001 and amends LST-001 with the authorized label behavior. Both records live under the same Lists heading. The example shows their status after delivery.

## A correction in conversation

**Reader:** “Going forward, whenever a card changes, check it in both sizes.”

The agent adds one instruction under **Project practice** in the installed skill. On the next card change, it reads that instruction and checks both sizes. Repeating the request points to the existing instruction. The product decisions keep their IDs.

## How an older library becomes this one

| Earlier source | Result |
| --- | --- |
| An HTML map and a page for each area | The records become sections of one `DECISIONS.md`. Active links point to the ID headings. The generated pages and empty area directory are retired. |
| A design decision named DES-001 and a business spec repeating the card rule | One record with the original ID, approval and scope. |
| A requirement to reserve reading estimates for articles | A linked decision for the time label. |
| A technical plan listing component paths and rendering steps | Retired after the product rules are accounted for. |
| A suggestion to add a progress badge | Listed as an open idea in the migration report. |

## Historical examples

The [previous discovery conversation](discovery-conversation.md) and [generated spec set](generated-result.md) show the earlier workflow and its technical documents.
