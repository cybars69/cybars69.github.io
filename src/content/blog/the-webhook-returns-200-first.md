---
title: "The webhook returns 200 first: a WhatsApp agent's message pipeline, tool loop and human handoff"
description: "What happens between a customer's message and the reply: filtering, acknowledging early, classifying, routing, a tool loop, a silent fallback and a four-call escalation."
date: 2026-09-24
tags: [AI agents, Webhooks, Python, Chatwoot, LLMs]
---

This is a walkthrough of the request path in a WhatsApp booking agent, following one message from arrival to reply and then one escalation. The architecture is in [dropping the agent framework](/blog/dropping-the-agent-framework/). This post is about the details that decide whether it works in production.

## 1. Filter before you do anything

Chatwoot calls the agent-bot webhook for **every** message event. The very first thing the handler does is throw most of them away:

```python
# only: event == "message_created", message_type == "incoming", sender.type == "contact"
```

That filter is not tidying up. The agent's own replies also produce `message_created` events, so without it the bot answers itself and loops. Human agents' messages are filtered out for the same reason: a human replying must not trigger the AI.

## 2. Acknowledge immediately, work later

The handler extracts the Chatwoot account ID, conversation ID, text and sender phone, resolves the tenant with one lookup on the account ID, and then **returns HTTP 200 right away** and dispatches the real work as a background task.

```text
webhook   -> filter -> resolve tenant -> 200 OK  (milliseconds)
                                          \-> background task: classify -> handle -> reply
```

An LLM call plus tool calls can take seconds. If the webhook waits for them, it ties up the caller and invites timeouts and duplicate deliveries. Acknowledging first decouples the sender's patience from the model's latency.

The conversation ID is **namespaced** (`chatwoot-7`) before it touches the database, so conversation IDs from different sources can never collide.

## 3. State is a small blob

Per-conversation state is a JSON document: whether the customer has been greeted, the recent messages, and what has been learned so far (for example a child's name). The classifier only ever sees the last five messages plus this state, which is cheaper and more predictable than replaying a whole transcript.

## 4. Classify, then route in plain Python

A small fast model returns an intent with a confidence:

```json
{ "intent": "greeting", "confidence": 0.95, "reasoning": "..." }
```

Routing is a normal function, not a prompt:

| Intent and state | Handler |
|---|---|
| greeting, not yet greeted | greeting |
| query | query |
| booking | booking |
| faq | faq |
| escalation | escalation |
| unknown, mid-booking | booking |
| unknown, already greeted | faq |

The last two rows matter most. A message like "March 20" classifies as *unknown* by itself, but in the middle of a booking it is obviously an answer. Deterministic fallbacks keyed on conversation state rescue the cases where a classifier has no context.

## 5. The tool loop

The handler builds a system prompt from the business's name, hours and tone, plus formatting rules for the channel (WhatsApp wants `*bold*` and `_italic_`, and no Markdown headers or brackets). Then it runs the classic loop:

```python
while True:
    resp = call_model(system=system, messages=messages, tools=tools, max_tokens=1024)
    if resp.stop_reason == "tool_use":
        result = execute_tool(resp.tool_name, resp.tool_input, merchant_id)  # a DB query
        messages.append(tool_result(result))
        continue
    return resp.text          # stop_reason == "end_turn"
```

Tools are ordinary functions scoped by tenant: business info, filtered product search, slot availability, create booking. A booking is a multi-turn dance (product, date, time, then confirm), and the state blob is what carries it between turns.

## 6. The fallback that hides "no availability"

One rule made it into the docs as a "key rule". If `create_booking` fails because the slot is full, the handler **silently falls back to creating an ad-hoc booking**, a lead capture. The customer sees "we'll confirm your booking shortly" and never "no availability". The business gets the lead and decides.

That is a product decision expressed in code, and a debatable one: it trades honesty about capacity for not losing the customer. Whichever way you land, it should be written down where the business can see it.

## 7. Handing over to a human

When the intent is escalation, the model first responds with empathy, then calls a `handoff_to_human` tool with a summary. The webhook layer injects the function that talks to Chatwoot, which performs **four sequential calls**:

```text
POST /conversations/{id}/messages     { content: "[AI Summary] ...", private: true }   <- staff-only note
POST /conversations/{id}/labels       { labels: ["escalated"] }
POST /conversations/{id}/toggle_status{ status: "open" }                                <- removes the bot
POST /conversations/{id}/assignments  { team_id: <the business's team> }
```

The private note is the quiet win: staff open the conversation and already have the AI's summary, without the customer being asked to repeat themselves. Setting the status to open is what takes the bot out of the loop.

## 8. Which inbox gets an AI

The agent bot is assigned **only to the WhatsApp inbox**. A second inbox for the website's chat widget has no bot at all, so it is human-only by construction, and the business's staff see both inboxes in one account. Deciding where the AI does *not* speak is as much an architectural decision as where it does.

## Takeaways

- Filter events aggressively, or the bot talks to itself.
- Return 200, then process.
- Use deterministic routing plus state-aware fallbacks around a classifier.
- Hand off with a private summary, an explicit label and a status change.
