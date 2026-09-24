---
title: "Clinic site and lead pipeline"
blurb: "A clinic website that publishes an MCP server for AI assistants, and a lead pipeline that connects ad clicks to revenue."
era: recent
order: 10
image: /images/projects/clinic-lead-pipeline.png
alt: "Diagram: ad click, landing page, lead sheet, purchase event, with MCP server, OpenAPI and llms.txt"
tags: [MCP, OpenAPI, Attribution, Google Sheets]
kind: "Client work · anonymized"
featured: false
---

A website for a clinic, built for two audiences: patients and the AI assistants patients increasingly ask first.

## Readable by agents

The site publishes a small **MCP server** (stateless Streamable HTTP) with four tools: list treatments, get treatment detail, get clinic info, and request a consultation. Alongside it sit an OpenAPI 3.1 description, an MCP server card, an RFC 9727 API catalogue, an `auth.md`, an `llms.txt`, and a Markdown version of every page.

The rules for agents are written into the docs, and they matter more than the endpoints:

- There is **no online calendar**. A successful request means staff will phone the patient, and an agent must never report an appointment as confirmed.
- Get explicit consent before sending a name, phone number or medical concern.
- Never invent patient details, because a wrong number means staff cold-call a stranger.
- One submission per patient, since each one emails and phones real people.

## From click to revenue

Every enquiry lands in a Google Sheet through a service account, with the attribution kept: UTM parameters, ad click identifiers, browser identifiers, landing page and referrer. Staff move each lead through a validated status list from lead to booked to active patient, and record amount paid and estimated lifetime value. When a lead converts, a server-side purchase event is sent back to the ad platform and the row is marked as sent, so the ad account learns which clicks became patients.

## Stack

Google Sheets API, MCP, OpenAPI, structured data, server-side conversion events.
