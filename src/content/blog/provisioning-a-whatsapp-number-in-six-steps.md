---
title: "Provisioning a WhatsApp number in six steps"
description: "Twilio subaccounts, a Chatwoot account, an agent bot, an inbox and a Meta embedded signup, wired into one onboarding flow."
date: 2026-09-24
tags: [Twilio, Chatwoot, WhatsApp, Integrations, Automation]
---

Giving each business its own WhatsApp number, its own inbox and an AI agent used to be a manual checklist across three dashboards. I turned it into two endpoints. This is what those endpoints actually do, because the sequence and the failure modes are where the lessons are.

The pieces: **Twilio** provides the number and the WhatsApp Business API, **Chatwoot** provides the inbox, conversations and human takeover, and **Meta** owns the WhatsApp Business Account and its approval.

## Step 1: `POST /provision-number`

Authenticated with the business's bearer token, with an optional area code. The service performs six operations in order, five external calls and then a save:

```text
1. Twilio   create a subaccount              -> sub_sid, sub_auth_token
2. Twilio   buy a number on that subaccount  -> phone_number
3. Chatwoot POST /platform/api/v1/accounts        { name }           -> account_id
4. Chatwoot POST /platform/api/v1/agent_bots      { name, outgoing_url: <our webhook>, account_id }
                                                                     -> bot_id, bot_access_token
5. Chatwoot POST /api/v1/accounts/{id}/inboxes    { channel: { type: "api", medium: "whatsapp",
                                                     phone_number, twilio credentials } }
                                                                     -> inbox_id
6. Ours     save one row mapping all of it to the business
```

Two design choices stand out. A **Twilio subaccount per business** isolates credentials, usage and billing, and means a compromised token exposes one tenant. And a **Chatwoot account per business** means each business sees only its own conversations, with the bot registered *per account* so the webhook payload carries an account ID that resolves back to a tenant.

The row saved at the end holds the whole mapping: business, Chatwoot account, bot ID and token, inbox ID, the Twilio subaccount credentials and the phone number.

## Step 2: the human part, Meta embedded signup

WhatsApp requires the business to authorise access to its own WhatsApp Business Account. That happens in the business's browser via Meta's embedded signup, which hands back a `waba_id` and a `phone_number_id`. The business then calls `POST /connect-wa`:

```text
1. Twilio  create a Messaging Service on the subaccount
            (use_inbound_webhook_on_number = true)
2. Twilio  add the number as a WhatsApp sender on that service
3. Ours    update the mapping row with waba_id, phone_number_id and the sender ids
```

After this, a message to the number flows: customer WhatsApp, Twilio, Chatwoot, agent-bot webhook.

## Step 3: the inbox link

`GET /chatwoot_link` asks Chatwoot's platform API for a **time-limited SSO login URL** for the business's user, so they land in their inbox already signed in. There is no second password to manage and no credentials in an email.

## An observation on failure modes

My reading of this flow, not something the docs call out: steps 1 to 5 create external resources in sequence and the mapping row is only written at step 6. If step 4 fails, you have a subaccount, a purchased number and a Chatwoot account that the database doesn't know about. Numbers cost money and subaccounts are hard to find later, so a flow like this wants either compensation (delete what you created on failure) or an early "provisioning started" row that records each resource as it is created. The right shape is idempotent steps keyed by business, so a retry resumes rather than duplicates.

## Takeaways

- Model the **human-in-the-loop step** (the Meta authorisation) as its own endpoint, not as a hidden wait inside the first one.
- Isolate tenants at the credential level, with a subaccount and an account each.
- Use platform APIs for SSO so onboarding never involves a shared password.
- When a flow creates paid external resources, record each one *as it is created*.
