---
layout: insight-page.njk
tags: insights
title: Why generic data platforms fail
tagline: The reference architecture is not the job.
description: Most data platform projects are delivered correctly and used by nobody. The failure is not technical. It is that the platform was designed around a diagram instead of around the decisions it was supposed to support.
intro: Most failed data platforms are technically correct. The pipelines run, the warehouse is well modeled, the dashboards refresh on schedule. Nobody uses them. That gap is not an engineering problem, and buying a better tool will not close it.
permalink: /insights/why-generic-data-platforms-fail/
date: 2026-06-18
category: Field note
readingTime: 6 min read
accent: var(--color-pixel-cyan)
author: Vertis Global
authorRole: Data & Analytics practice
---

We get called in after the first platform. The pattern is consistent enough to be boring.

A team picks a warehouse. They pick an ingestion tool, a transformation framework, a BI layer,
and a catalog. Each choice is defensible. They wire it together over two or three quarters,
land somewhere north of four hundred models, and ship a launch announcement. Six months later
the executive sponsor asks a question in a meeting and three people open a spreadsheet.

The platform did not break. It was built to a diagram rather than to a decision.

## The reference architecture is a parts list

Every vendor publishes the same picture: sources on the left, a bronze-silver-gold stack in the
middle, dashboards on the right. It is not wrong. It is just not a design. It tells you which
components exist and nothing about which questions the thing has to answer, who asks them, how
often, and what happens to the answer.

That omission is what sinks the project, because the parts list is silent on every decision that
actually determines whether the platform gets used:

- Which twelve numbers does the leadership team argue about?
- Who is accountable when one of them is wrong?
- How fresh does each one need to be — and what does the business do differently at one hour
  versus one day?
- Which existing spreadsheet is this replacing, and who owns that spreadsheet today?

A team that cannot answer those will build all four layers of the diagram and still ship
something nobody trusts enough to quote in a board meeting.

## Correct and useless are compatible

The uncomfortable part is that these platforms usually pass every test you would think to run.
Freshness checks green. Row counts reconcile. The semantic layer is tidy. Engineering has done
what it was asked.

The failure shows up somewhere the tests do not look. Finance has a definition of revenue that
includes a deferral treatment nobody modeled. Operations needs the number at 6am because that
is when dispatch plans the day, and the pipeline lands at 9. The head of sales does not want a
dashboard at all, he wants one line in an email on Monday.

None of that is visible from the architecture diagram. All of it decides adoption.

## What we do differently

We start from the decisions, not the sources. On a typical engagement the first two weeks
produce a list of the decisions the platform has to serve, each written as a sentence with a
person's name in it. *The regional VP decides Monday allocation using last week's fill rate by
lane.* That sentence tells us the grain, the latency, the owner, and the delivery surface. Four
things a source inventory would never have given us.

Then we build backwards. Sources get included because a decision needs them, not because they
exist. The model is shaped by the questions, not by the shape of the upstream schema. And the
delivery surface is whatever that person will actually open — often not a dashboard.

Three consequences follow, and they are the whole point:

**The platform is smaller.** Working backwards from thirty real decisions produces a fraction
of the models that working forwards from eighty source tables does. Less to build, less to
maintain, less to be wrong.

**Every number has an owner.** Not a steward in a catalog. A person who will be asked about it
when it looks strange, and who agreed to that in week two.

**You can tell whether it worked.** Adoption stops being a vibe. Either the regional VP uses
the fill-rate number on Monday or she does not, and if she does not, we know within a week and
we know which assumption was wrong.

## The part nobody wants to hear

This is slower at the start. A source-first team is writing pipelines in week one and can show
you a lineage graph by week three. A decision-first team spends those weeks in rooms with
people who have other jobs, and has less to demo.

It is faster by month four, and the difference compounds, because the source-first team is
about to start the rework cycle where every model gets revisited once the business sees it. We
have watched that cycle consume more time than the original build. Twice.

If you are staring at a platform that works and nobody uses, the fix is usually not migration.
It is going back and writing the thirty sentences, then deleting most of what does not serve
them. That is a smaller, less glamorous project than the one you were about to scope. It is
also the one that works.
