# The repo is the system of record

Setting up a small codebase so that both people and coding agents can work in it reliably, without a 500-line instruction file.

Source: https://cybars69.github.io/blog/repo-as-system-of-record/


Published: 2026-09-24
Tags: Coding agents, Engineering, Documentation

Most instruction files for coding agents grow the same way: someone adds a rule after a mistake, then another, until there's a 500-line blob nobody reads, including the agent. For a small storefront project I tried the opposite, based on the idea of *harness engineering*: optimise the **environment** (docs, lints, tests, CI) so that agents and people can ship reliably without a monolithic prompt.

## Eight rules

I wrote the project's principles down in the repo itself. The ones that changed my behaviour:

1. **The repository is the system of record.** Chat threads and issue comments are invisible to an agent. A decision that affects implementation belongs in `docs/` or in code, in the same pull request.
2. **A map, not a manual.** `AGENTS.md` is a table of contents. If a topic needs depth, write a focused doc and link to it.
3. **Boundaries over guesswork.** Parse and validate at the HTTP and key-value boundaries. Don't assume a payment provider's payload matches what you remember.
4. **Secrets stay in the Worker.** Never in the frontend, never in the repo.
5. **Services before duplication.** Before writing storage logic in a route, extend a service.
6. **Tests encode behaviour.** Changing business logic without touching tests is unfinished work.
7. **Continuous small cleanup.** Prefer many small follow-ups over letting sloppy patches accumulate. Debt goes in a tracker.
8. **Boring, inspectable dependencies.** Prefer libraries an agent can reason about, and wrap opaque SDKs behind a service.

## Make the rules mechanical

A rule that lives only in prose gets broken. So the CI job validates two things: that the docs tree has the structure it should, and that the code respects its architecture's import layers. There are also structural tests for the harness itself.

## A quality score

A small table grades each domain, A to D: products, collections, checkout, admin auth, settings, analytics, media, UI, and the documentation harness itself. A means solid tests, docs and boundaries. D means risky and undocumented. Most rows are B, a few are C, and only the docs and architecture-enforcement rows earn an A, which is honest. The purpose isn't to look good, it's to tell an agent (or me) where to be careful, and to force a small update to the grade whenever a domain materially changes.

## What I chose not to copy

The approach I borrowed from came out of a huge monorepo with a zero-human-written-code policy and custom observability per worktree. None of that fits a small open project. Humans and agents both write code here, and the tooling stays proportionate.

## The goal

New sessions should start fast because the answer to "where does this go?" is in a file, not in someone's head. Mistakes should be caught by a check rather than a review comment. And the docs should stay honest because CI fails when they drift.
