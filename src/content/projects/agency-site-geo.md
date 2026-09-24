---
title: "Agency site and GEO audit"
blurb: "An Astro marketing site for a services agency, and the audit that showed a perfect on-page score does not rank a young domain."
era: recent
order: 13
image: /images/projects/agency-site-geo.png
alt: "Diagram: Astro site, GEO audit, Search Console, action plan, with llms.txt, schema and long-tail content"
tags: [Astro, SEO, GEO, Search Console]
kind: "Studio work · anonymized"
featured: false
---

A marketing site for a services agency, built with Astro, along with the strategy documents around it: SEO strategy, content roadmap and style guide, brand kit, design system and a social campaign.

## The audit

Once the site was live I ran an open-source GEO audit CLI across six representative pages and cross-referenced it with four weeks of Search Console data. The scores landed between 61 and 68 out of 100. Two categories scored **zero on every page**: `llms.txt` (18 points) and AI discovery endpoints (6 points), together the biggest cheap wins available.

## What the data actually said

- One production deploy hadn't landed, so structured data the audit expected wasn't there yet.
- Plain HTTP returned 200 instead of redirecting, and several HTTP URLs were independently indexed.
- Ten URLs competed for the same head query. That is an unmade decision, not a content shortage, and adding more content made it worse.
- Long-tail resource pages earned nearly all the clicks, while the commercial pages earned none. Internal links should flow *from* the pages that rank *to* the ones that sell.

## The caveat that matters

The score is a checklist proxy, not a ranking model. Moving from 61 to 90 is about a day of work, and it will not move a young domain off page six, because the real bottleneck is external trust: links, directories and entity signals. I wrote that up in [a checklist is not a ranking model](/blog/geo-audit-checklist-not-ranking-model/). The answer-extraction side of the same problem is what [aeo-skills](/projects/aeo-skills/) measures.

## Stack

Astro, JSON-LD, Search Console, llms.txt.
