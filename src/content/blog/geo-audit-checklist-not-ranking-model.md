---
title: "A GEO audit is a checklist, not a ranking model"
description: "What an audit of a young marketing site found, and why fixing every point on the checklist still wouldn't have moved it off page six."
date: 2026-09-24
tags: [SEO, GEO, AEO, Search Console]
---

I built an Astro marketing site for a services agency and, a few weeks after launch, audited it with an open-source GEO tool (the kind that checks whether AI answer engines can find, read and cite your pages). I cross-referenced the audit with four weeks of Search Console data.

The audit and the data disagreed in a way that taught me more than either alone.

## The scores

Six representative pages scored between **61 and 68 out of 100**. Meta tags were perfect (14 out of 14). Robots access was strong. Two categories scored **zero on every page**:

- `llms.txt`: 18 points, the single largest gap.
- AI discovery endpoints: 6 points.

Those 24 points were about a day of work. The tool can scaffold both files, and I'd review them before committing, since it knows nothing about your content model.

## What was actually broken

1. **A deploy hadn't landed.** Structured data the audit expected, including `sameAs` links to the brand's profiles, was missing from production. Nothing else about schema matters until that ships.
2. **Plain HTTP returned 200.** No redirect to HTTPS, and five separate HTTP URLs were indexed and collecting impressions. The canonical tag was the only thing preventing a real duplicate-content split.
3. **Ten pages competed for one query.** That isn't a content shortage, it's an unmade decision. Google was choosing among ten candidates and settling somewhere between position 52 and 91. Adding more content would have made it worse.

## What the search data said

The clearest signal wasn't in the top pages by impressions. It was in the long tail:

- Nine of the twelve clicks came from integration and comparison pages with single-digit impressions.
- Nineteen URLs sat on page one for narrow queries.
- The commercial "services" section had 19 pages, hundreds of impressions and **zero clicks**.

The practical consequence was to reverse internal linking. The long-tail pages that rank are the site's only real authority, and none of it was being routed anywhere. Links should flow *from* the pages that rank *to* the pages that sell.

## The caveat that matters most

**The score is a checklist proxy, not a ranking model.** Going from 61 to 90 is roughly a day of work, and it would not have moved this site off position sixty. Every crawler got identical full content, nothing was blocked, the schema was valid and the meta tags were perfect, and the site still averaged page six.

That's the signature of a domain that Google has indexed and doesn't yet trust. The bottleneck was external: backlinks, directory listings, a company profile, a business listing and roundup mentions. On-page technique was already done.

## What the audit recommended

- Fix what was broken first: the deploy and the HTTPS redirect.
- Make the cannibalisation decision explicitly: one page owns the head query, and the others link to it instead of competing with it.
- Take the cheap points: `llms.txt`, discovery endpoints, an RSS feed, `dateModified` on templates.
- List what **not** to do: filling every "missing" alt attribute (most are correctly decorative), adding `hreflang` for a single English site, or chasing pre-standard tooling.
- Then put the real effort into the external work.

If you care about the other half of this problem, whether a page can be *extracted as an answer* rather than cited as a source, that is what [aeo-skills](/projects/aeo-skills/) measures. It is a different question from the one a GEO audit asks.
