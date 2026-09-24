---
title: "Modelling quizzes: question types, manual grading and the attempt state you didn't know you needed"
description: "What I learned by reading the source of a mature open-source LMS plugin before designing a quiz schema."
date: 2026-09-24
tags: [Data modelling, LMS, Databases, Requirements]
---

Before writing a schema for a learning platform's quiz module, I read the source of a mature open-source LMS plugin, both its data models and its enums, purely as a **reference for functionality**. Nothing was ported. Every feature was reimplemented and each got a scope decision. Reading real code beats reading screenshots because code shows you the states that no screenshot captures.

## Two levels, and a grant

The product shape I was building had two renamed primitives:

- a **mock test**: one quiz, a set of questions timed and graded as a unit;
- a **test series**: an ordered collection of mock tests sold and enrolled as one unit.

Access is an **enrolment**: one row per user and series, moving from pending to approved or rejected by an admin. That row is already "conditional enablement for specific students, on request", so no separate feature was needed. The gap list was more interesting: no pricing, no per-user overrides, only single-answer multiple choice, and no timer or pass mark.

## Question types are a grading decision

The plugin's question types split cleanly by **how they are graded**:

| Type | Grading | How correctness works |
|---|---|---|
| true/false | auto | exactly one correct option among two |
| single choice | auto | exactly one correct option among N |
| multiple choice | auto | the chosen **set** must exactly equal the correct set |
| matching | auto | prompt-to-match pairs; text or image variants |
| sortable | auto | correct only if the order matches index for index |
| fill in the blanks | auto | string match, case-insensitive |
| text answer | **manual** | the auto-check always returns false and defers to a human |
| audio, video | **manual** | play media, type a free-text answer |

The detail I liked: `multiple choice` requires an *exact* set match, so partial credit is a separate, deliberate feature rather than a default. And **fill in the blanks** is authored inline. You write the sentence and wrap each answer in double curly braces, with pipes for alternatives:

```text
The capital of France is {{ Paris }}
The sky is {{ blue | azure }}
```

Each token then renders as an inline input inside the sentence. Authoring in the same string that gets displayed avoids a separate answers table that can fall out of sync with the prompt.

## The third attempt state

The most transferable finding was the attempt lifecycle. A naive schema has two states, `in_progress` and `submitted`. The plugin has three:

```text
attempt_started  ->  attempt_pending  ->  attempt_ended
                     (submitted, waiting     (fully graded)
                      for a human grader)
```

`pending` only exists because of the **manually graded** question types. The moment a quiz can contain a text answer, "submitted" and "graded" are different facts, and the score can't be final. If you only ever ship auto-graded types, you can defer the extra state. But you should know it is coming, because adding a state to an attempt table that already has data is harder than reserving the name.

## Questions belong to many quizzes

Another quiet decision: questions and quizzes are related **many-to-many** through a pivot with a per-quiz order:

```sql
quiz_question_rel (quiz_id, question_id, menu_order,  UNIQUE (quiz_id, question_id))
```

That is what makes a shared **question bank** possible: the same question row attached to several quizzes and reordered independently in each. Retrofitting it later means migrating a foreign key into a pivot, which is exactly the sort of change to avoid.

## Settings, and what was gated

The quiz settings are the usual suspects: pass mark, full mark, duration, attempts allowed (zero meaning unlimited), whether to reveal the correct answer immediately, and questions per page. A few (percentage-based pass marks, randomised question order, and "must answer every question") were premium-only in the reference. That was useful as a *scoping* signal: features a mature product treats as advanced can wait for a fast follow.

## How I used it

Every discovered feature went into one catalogue with a **decision**: build now (V1), fast-follow, defer, or cut. The V1 rows became a dependency-ordered task plan, and the domain foundation got a short ADR. The schema reserved room for some deferred items, for example a nullable per-enrolment attempt override, without building the feature. Design for the future, build for the roadmap.

## Takeaways

- Read a mature product's **models and enums**, not only its UI.
- Classify question types by how they are graded.
- Reserve the "waiting for a human" attempt state early.
- Prefer many-to-many for anything you might want to reuse.
