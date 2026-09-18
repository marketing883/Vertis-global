# Vertis Global — Website Strategy & Architecture Blueprint

**Version 1.0 — For Approval**
**Prepared:** 27 August 2026
**Status:** Pre-build. No code written. Approve this document before Phase 1 begins.

---

## Assumptions Register

These are stated up front so you can correct any of them before we build. Every downstream decision traces back to one of these.

| # | Assumption | Basis | Risk if wrong |
|---|---|---|---|
| A1 | Brand is **Vertis Global**, positioned as an enterprise **technology** staffing firm | Confirmed by you; corroborated by the Technology Staffing Solutions deck | Low |
| A2 | Proof points are real and publishable: 200+ consultants, 20+ years, 80+ Fortune 500 clients, 48–72hr profile turnaround, 2-week onboarding, replacement guarantee | Extracted from the Staffing Solutions deck (2026, marked Confidential) | **Medium — see A3** |
| A3 | The deck is marked *Confidential*. I assume these figures are cleared for public marketing use | Inference | **High.** Legal/leadership must sign off before any number goes live. Flagged as `[CLEAR-LEGAL]` throughout |
| A4 | Proven delivery footprint today is **onshore US + offshore India**. You selected a Global (US/EU/APAC) market target | Deck states US + India only; you selected Global | **High.** We design location IA to scale globally but only publish region pages where real delivery capability exists. Claiming EU delivery without entities/payroll is a legal and credibility risk |
| A5 | No ATS is integrated at launch. The website is the system of record for web-sourced applications | `info@vertisglobal.com` implies an internal RMG function, but no ATS was named | Medium — Phase 2 sync path documented |
| A6 | Vertis staffs **technology roles**, not general clerical/light-industrial/healthcare-clinical staffing | Deck covers Data, Cloud, ERP, AI, AppDev/QA only | Low |
| A7 | Contract volume is in the hundreds of live roles, not tens of thousands | 200+ consultant bench | Low — drives the "Postgres FTS, not Elasticsearch" decision |
| A8 | Primary hiring currency/market for salary content is USD (US) with INR secondary | Onshore/offshore model | Low |
| A9 | Budget supports a real build (not a template) but not a bespoke ATS. Off-the-shelf where possible | Inferred from scope | Medium |

**A note on scope vs. the brief.** Your brief listed healthcare, government, finance, manufacturing, engineering staffing and professional staffing. The capability deck supports **technology staffing across those industries** — which is a different and stronger claim. A 200-consultant technology firm that pretends to be a 500,000-person generalist will lose to Kelly and Randstad on every generalist search term and win nothing. This blueprint positions Vertis where it can actually win. I have flagged where the brief and the deck diverge.

---

# 1. Executive Summary

## 1.1 What we are building

A conversion-focused, SEO-first, full-stack technology staffing platform for Vertis Global, built on Next.js + TypeScript + PostgreSQL, serving three audiences on one property:

1. **Enterprise hiring managers and procurement** — who need to know Vertis can fill a Snowflake architect role in Charlotte in three weeks, onshore or offshore, at a rate they can defend internally.
2. **Technology consultants and job seekers** — who need to find, evaluate and apply to a role in under four minutes on a phone.
3. **Executive decision-makers (CIO, VP Engineering, Head of TA)** — who are evaluating Vertis as a workforce partner across a multi-year program, not a single req.

## 1.2 The strategic call

Vertis is not Kelly Services and should not try to be. Kelly, Adecco and Randstad win on scale and category breadth. TEKsystems and Insight Global win on US IT staffing density and brand recall. Robert Half wins on finance/accounting and salary-guide SEO.

**Vertis wins on a gap none of them own cleanly: a single vetted bench available onshore, offshore, or blended — with transparent tiered rate cards and a two-week path to productive.** TEKsystems and Insight Global are overwhelmingly US-onshore. Randstad and Adecco have global scale but sell it as separate country businesses, not as one delivery decision. Vertis can credibly say: *same vetting standard, three cost structures, you choose.*

That is the spine of the entire website.

## 1.3 The twelve decisions I am making for you

| # | Decision | Rationale |
|---|---|---|
| 1 | **Employer-led hero** with an embedded, equal-dignity candidate lane — not a 50/50 split screen | Employer leads are worth 100–1000x a candidate session. Split screens force a choice before credibility is established and depress both paths |
| 2 | **Two front doors in the nav**, not two websites | `Hire Talent` and `Find Jobs` as visually distinct nav destinations; no separate candidate subdomain (kills SEO authority consolidation) |
| 3 | **Five industries at launch**, not nine | Financial Services, Healthcare & Life Sciences, Manufacturing & Industrial, Retail & Consumer, Energy & Utilities. Public Sector deferred until contract vehicles exist |
| 4 | **Capability pages beat generic "IT Staffing" pages** | `/capabilities/data-analytics-staffing` with 12 real roles and 10 named platforms outranks and outconverts a generic "IT Staffing" page |
| 5 | **Postgres full-text search, not Elasticsearch** | Hundreds of jobs, not millions. FTS + GIN + trigram is faster to build, cheaper to run, and sufficient until ~25k jobs |
| 6 | **Payload CMS 3 embedded in the Next.js app**, one Postgres, one deploy | No separate CMS bill, no separate auth, no content API latency. Editors, recruiters and admins use one system |
| 7 | **Multi-step application, not single-page** — but only 3 steps, with resume-parse prefill | Resume-first parsing removes 12 form fields. Single-page long forms test worse on mobile, which is where 60%+ of candidate traffic lands |
| 8 | **AI limited to four MVP features**, all assistive, none decisioning | EU AI Act classifies recruitment AI as high-risk; NYC LL144 mandates bias audits for automated employment decision tools. No AI ranks or screens out a human at MVP |
| 9 | **One dynamic lead system, five entry points** | A single `leads` pipeline with a `lead_type` discriminator and routing rules — not five disconnected forms nobody maintains |
| 10 | **`JobPosting` schema on every job, indexed to Google Jobs, day one** | This is the single highest-ROI SEO action available to a staffing site and most competitors implement it partially |
| 11 | **Programmatic SEO with index thresholds** | Skill × location pages only indexed at ≥3 live roles. Prevents the thin-content bloat that has hurt every major job board |
| 12 | **Ink-dominant design system**, Vertis Blue as the action colour, cyan used surgically — every value sampled from the logo | Blue-dominant reads generic; ink-dominant reads premium. The logo's blue→cyan gradient and pixel scatter become tightly-licensed brand assets rather than decoration |

## 1.4 What success looks like at 12 months

| Metric | Baseline | 12-month target |
|---|---|---|
| Qualified employer leads / month | 0 (new site) | 40–60 |
| Organic sessions / month | — | 18,000–25,000 |
| Jobs indexed in Google Jobs | 0 | 95%+ of live roles |
| Candidate applications / month | — | 900–1,400 |
| Application completion rate | Industry avg ~35% | 65%+ |
| Lighthouse Performance (mobile, key pages) | — | ≥90 |
| Core Web Vitals | — | All "Good" at p75 |
| Employer form → qualified lead | — | ≥55% |

## 1.5 Timeline and shape

**16 weeks to production launch**, 10 phases, with a hard "marketing site live" milestone at week 8 so SEO indexing begins before the job platform ships. Detail in Section 32.

---

# 2. Website Goals

Goals are ranked. When two goals conflict during build, the higher-ranked one wins. This ranking is the tiebreaker rule for the whole project.

## 2.1 Primary goals

**G1 — Generate qualified enterprise staffing leads.**
The commercial reason the site exists. Success = a named person at a named company with a stated requirement, routed to the right account manager within 15 minutes. Target: 40–60/month by month 12.
*Measured by:* `lead_submit` events with `lead_type=employer` and qualification status.

**G2 — Build and convert a candidate pipeline at low cost.**
Vertis's product is its bench. A self-serve application funnel that adds 900–1,400 vetted-intake candidates per month reduces sourcing cost per placement materially.
*Measured by:* `application_complete`, resume submissions, candidate account creations.

**G3 — Establish Vertis as a credible enterprise partner, not a vendor.**
An enterprise buyer must be able to complete a vendor-evaluation checklist from the website alone: capabilities, vetting methodology, delivery model, compliance posture, references, geographic coverage, commercial model.
*Measured by:* Solutions/Capabilities page depth-of-scroll, case study reads, time-on-site for return visitors, direct-traffic growth.

## 2.2 Secondary goals

**G4 — Own the long tail of technology staffing search.**
Programmatic SEO across skills, roles, locations and capabilities. This is the compounding asset.

**G5 — Reduce recruiter administrative load.**
Structured applications, parsed resumes, and pre-filtered candidates delivered into a usable admin — not an inbox full of PDFs.

**G6 — Be the reference asset in the sales cycle.**
The site must be linkable and quotable mid-deal: "here's our vetting process," "here's our Snowflake bench," "here's the case study."

## 2.3 Explicit non-goals

Stating these prevents scope creep, which is what kills staffing website projects.

- **Not** a public job board for third-party employers. Vertis posts Vertis roles only.
- **Not** a replacement for a real ATS. If Vertis buys Bullhorn/Ceipal/JobDiva, the site becomes a front end to it.
- **Not** a candidate social network, community, or forum.
- **Not** a timesheet, invoicing, VMS or payroll portal. Consultant self-service is a separate product decision.
- **Not** a generalist staffing site. No clerical, light industrial, or clinical healthcare staffing content.
- **Not** multi-tenant. One brand, one property.

---

# 3. Target Audiences

## 3.1 Audience map

| Audience | Share of traffic | Share of revenue influence | Site priority |
|---|---|---|---|
| Candidates / consultants | ~70–80% | Indirect (supply) | High volume, low friction |
| Hiring managers / tech leads | ~10–15% | **Direct, high** | Highest conversion priority |
| TA / procurement / vendor management | ~3–5% | **Direct, high** | Evidence and compliance depth |
| C-level / VP (CIO, VP Eng) | ~2–3% | **Direct, highest value** | Credibility and scale signals |
| Job-market researchers, competitors, press | ~5% | None | Ignore in design decisions |

The trap in staffing web design is optimising for the 75% (candidates) because the analytics dashboard is dominated by them. **Design for the 15% who pay, without degrading the 75% who supply.**

## 3.2 Primary customer personas

### P1 — "Dana", Director of Engineering, Financial Services, 900-person tech org
**Context.** Three open reqs sitting 60+ days. Internal TA cannot source Databricks or dbt talent. Her program slips if she does not have two data engineers by end of quarter.
**Trigger.** Googles `databricks engineer staffing agency` or gets a Vertis referral.
**What she needs in 30 seconds.** Do they actually have Databricks people, or is this a generic IT staffing site with a keyword page? How fast? What does it cost, roughly?
**Objections.** "Every agency says they're fast." "Last vendor sent 20 unqualified resumes." "I don't have time for a discovery call."
**What converts her.** Named platforms and role titles (not "we staff data professionals"), the 48–72hr profile commitment, the "2–3 profiles, not 20" promise, a case study in her industry, and a form that takes 90 seconds.
**Primary CTA:** Request Talent. **Secondary:** Book a 15-min call.

### P2 — "Marcus", VP Talent Acquisition, Manufacturing, 12,000 employees
**Context.** Managing a vendor panel of 8 suppliers. Consolidating to 4. Evaluating who stays.
**Trigger.** RFP process, vendor scorecard review, or a referral from a peer.
**What he needs.** Delivery methodology, vetting rigour, compliance documentation, geographic coverage, replacement terms, commercial model, references, insurance/certifications.
**Objections.** "Can they scale beyond 3 reqs?" "Are they compliant in every jurisdiction we operate?" "What's their fill rate and time-to-submit, actually measured?"
**What converts him.** A Vetting & Quality page with a named four-stage process. A Delivery Models page explaining onshore/offshore/hybrid honestly. A Compliance section. Downloadable capability PDF. Case studies with real metrics.
**Primary CTA:** Download Capability Overview / Talk to a Staffing Expert.

### P3 — "Priya", CIO, Retail, mid-market enterprise
**Context.** Running an ERP migration and a cloud modernisation simultaneously. Needs 25 people across SAP, Azure and QA for 18 months. Cost pressure from the board.
**Trigger.** Program planning; her SI partner cannot supply everything; she needs a flexible cost structure.
**What she needs.** Can one partner cover SAP *and* cloud *and* QA? Can they blend onshore leadership with offshore execution to hit her budget? Is the quality bar the same offshore?
**Objections.** "Offshore quality is a gamble." "Coordinating two vendors is worse than one."
**What converts her.** The Hybrid Delivery model page — onshore leads paired with offshore execution. The "same vetting standard, both geographies" claim, evidenced. Team Deployment engagement model. A multi-workstream case study.
**Primary CTA:** Talk to a Staffing Expert. **Secondary:** Explore Delivery Models.

### P4 — "Ben", Procurement / Vendor Manager
**Context.** Not a technologist. Owns the paper. Will kill a deal over missing compliance.
**What he needs.** Legal entity details, insurance, MSA readiness, background-check policy, data privacy posture, rate card structure, SOW vs T&M, invoicing.
**What converts him.** A Compliance & Governance page and a Working With Vertis / Engagement Model page that answers commercial questions plainly.

## 3.3 Candidate personas

### C1 — "Arun", Senior Data Engineer, 8 years, India, open to onshore
**Behaviour.** Mobile-first, evening browsing, applies to 8–12 roles a week. Will abandon any application over 4 minutes or requiring account creation before applying.
**Needs.** Rate/salary visibility, remote/onsite clarity, contract duration, visa/work-authorization clarity, a real recruiter name.
**Kills the application.** Mandatory registration, re-typing a resume into 20 fields, no salary range, "competitive compensation," a broken mobile upload.
**Design implications.** Apply without an account. Resume-parse prefill. Three steps max. Salary range on every posting or an explicit reason it is withheld.

### C2 — "Sarah", Cloud Architect, US, currently employed, passive
**Behaviour.** Not actively searching. Arrived from a Google Jobs result or LinkedIn. Reads the whole posting. Researches the company before applying.
**Needs.** Credibility that this is not a resume-harvesting body shop. Who is the client (or the industry, if confidential)? Is this a real role? Who is the recruiter?
**Kills it.** Vague postings, no company context, no named recruiter, obvious copy-paste JD.
**Design implications.** Recruiter card with photo and name on every job. Job authenticity signals: posted date, job ID, last-updated. A "Save job" / "Job alert" path for passive candidates not ready to apply.

### C3 — "Miguel", SAP FI/CO Consultant, contractor, between engagements
**Behaviour.** Actively searching daily. Wants alerts. Wants to be on the bench list.
**Needs.** Job alerts, a general resume submission path even when no role matches, rate transparency, fast recruiter contact.
**Design implications.** "Submit your resume" as a first-class path, not a footer link. Job alerts by skill + location. Saved searches.

### C4 — "Lena", QA Automation Engineer, EU-based
**Needs.** GDPR clarity on data retention, whether the role is EU-eligible, language requirements.
**Design implications.** Explicit consent checkbox with retention period stated, not buried. Region eligibility on postings.

## 3.4 Audience-to-path mapping

| Audience | Entry | Path | Conversion |
|---|---|---|---|
| P1 Dana | Google: skill + staffing | Capability page → proof → Request Talent | Employer lead |
| P2 Marcus | Referral / direct | Hire Talent → Vetting → Compliance → Case Studies → Contact | Employer lead + PDF download |
| P3 Priya | Google: managed tech teams | Delivery Models → Team Deployment → Case Study → Contact | Employer lead |
| C1 Arun | Google Jobs | Job detail → Apply | Application |
| C2 Sarah | Google Jobs / LinkedIn | Job detail → About → Apply or Save | Application / alert |
| C3 Miguel | Direct / alert email | Job search → Apply, or Submit Resume | Application / bench add |

---

# 4. Brand Positioning

## 4.1 Recommended brand positioning

> **Vertis Global is the enterprise technology staffing partner that delivers the same vetted talent standard onshore, offshore, or blended — so clients choose their cost structure without compromising their quality bar.**

Three things make this defensible rather than aspirational:

1. **It is true and evidenced.** 200+ consultants, US and India delivery, one four-stage vetting process applied in both geographies.
2. **It is a gap in the competitive set.** TEKsystems and Insight Global are essentially US-onshore. Randstad and Adecco sell country-by-country. Nobody markets *delivery-geography as a client choice under a single quality standard.*
3. **It maps to a real buying decision.** Every enterprise technology program has a cost/proximity trade-off. Vertis sells the trade-off itself, not just headcount.

## 4.2 Primary value proposition

**Site-wide, single sentence:**

> **Vetted technology consultants, delivered in 48 hours — onshore, offshore, or hybrid.**

It carries the three things a buyer needs: *what* (vetted technology consultants), *how fast* (48 hours), *how flexible* (three delivery models). No adjectives that cannot be proven.

## 4.3 Secondary value propositions

Each maps to a page and a proof point.

| # | Proposition | Proof | Lives on |
|---|---|---|---|
| V1 | **Two to three profiles, not twenty.** | Stated quality-over-volume policy | Homepage, Vetting, Hire Talent |
| V2 | **Productive in two weeks, not two months.** | 10-business-day onboarding commitment | Homepage, Engagement Model |
| V3 | **Twenty years inside Fortune 500 programs.** | 20+ years, 80+ F500 clients `[CLEAR-LEGAL]` | Homepage trust bar, About |
| V4 | **Full-stack coverage: data, cloud, ERP, AI, application engineering.** | Five documented practice areas with named platforms | Capabilities hub |
| V5 | **If a consultant underperforms, we replace them at no cost.** | Replacement guarantee | Hire Talent, Engagement Model |
| V6 | **One vetting standard in every geography.** | Four-stage process applied onshore and offshore | Delivery Models, Vetting |
| V7 | **Transparent tiered rate cards.** | Onshore/offshore rate card structure, SOW or T&M | Engagement Model |
| V8 | **A single account manager, not a call centre.** | Dedicated account manager model | Hire Talent, Contact |

## 4.4 Positioning statements and taglines

Ranked. My recommendation is #1.

**Tier 1 — Recommended**

1. **"Onshore. Offshore. One standard."**
   Three words, one differentiator, unmistakably enterprise. It states the flexibility *and* pre-empts the objection (offshore = lower quality) in the same breath. Works as a lockup under the logo, as a hero kicker, and as a deck cover. Echoes the deck's existing "Onshore. Offshore. Hybrid." while adding the promise.

2. **"The bench behind enterprise delivery."**
   Positions Vertis as infrastructure rather than intermediary. Strong for the CIO persona. Best as an About page H1 or brand line.

**Tier 2 — Strong supporting lines**

3. **"Vetted in 48 hours. Productive in two weeks."** — The operational promise. Best as a homepage hero subhead or the trust bar's organising line.
4. **"Two to three profiles. Not twenty resumes."** — Sharp, memorable, directly attacks the category's worst behaviour. Best as a Vetting page H1 or a homepage differentiator card.
5. **"Technology talent, on your terms."** — Softer, broader; useful for paid social where the delivery-model nuance won't land.
6. **"We staff the programs that cannot slip."** — High-stakes framing for the enterprise buyer. Good for a case-studies hub H1.
7. **"Skilled talent. Delivered fast."** — Your existing deck line. Retain as an internal/sales line; it is too category-generic to carry the website.

**Rejected, and why** — so the standard is explicit:
- ~~"Connecting talent with opportunity"~~ — every competitor's line; says nothing.
- ~~"Your trusted staffing partner"~~ — trust is demonstrated, never claimed.
- ~~"Empowering businesses through people"~~ — meaningless; you flagged this pattern yourself.
- ~~"Where talent meets opportunity"~~ — same as above, with worse rhythm.
- ~~"Unlocking human potential"~~ — HR-conference language, not buyer language.

## 4.5 Key differentiators

Written as claims a buyer can verify, not adjectives.

| Differentiator | The generic version we reject | The Vertis version |
|---|---|---|
| **Delivery geography as a client choice** | "Global reach" | "Same four-stage vetting, applied in the US and India. You pick the cost structure." |
| **Submission discipline** | "Quality candidates" | "Two to three vetted profiles per requirement. We do not shotgun resumes." |
| **Speed, quantified** | "Fast turnaround" | "Profiles in 48–72 hours. Onboarded and productive in 10 business days." |
| **Technology depth** | "Experienced team" | "Five practice areas. 60+ role types. 45+ named platforms from Snowflake to S/4HANA." |
| **Risk transfer** | "We stand behind our people" | "Underperformance means a no-cost replacement." |
| **Enterprise pedigree** | "Trusted by leading companies" | "20+ years. 80+ Fortune 500 clients." `[CLEAR-LEGAL]` |
| **Commercial clarity** | "Competitive rates" | "Tiered rate cards, onshore and offshore. SOW or T&M. One account manager." |

## 4.6 Brand personality

Five traits, each with a design and copy consequence.

| Trait | Means | Design consequence | Copy consequence |
|---|---|---|---|
| **Precise** | Specific numbers over adjectives | Tabular numerals, monospace for IDs/rates, tight type | Never "many," "leading," "world-class" |
| **Composed** | Confident without volume | Ink-dominant palette, generous whitespace, restrained motion | Short declarative sentences. No exclamation marks |
| **Operational** | Sells delivery, not inspiration | Process diagrams, timelines, structured data | Verbs of execution: deliver, deploy, vet, onboard |
| **Direct** | Respects the reader's time | Answer above the fold, detail below | Lead with the claim, then evidence |
| **Human** | It is a people business | Real consultant and recruiter photography, named recruiters | First names in recruiter cards. Candidate voice in testimonials |

**Not:** playful, disruptive, scrappy, edgy, or inspirational.

## 4.7 Tone of voice

**Principles**

1. **Numbers before adjectives.** "48-hour profile turnaround" not "rapid turnaround."
2. **Second person for the audience in question.** Employer pages say *you* to the hiring manager. Candidate pages say *you* to the candidate. Never mix on one page.
3. **Short sentences. Average 14–18 words.** No sentence over 30.
4. **No hedging.** "We deliver profiles in 48–72 hours," not "we aim to deliver."
5. **Name the thing.** "Snowflake, Databricks, dbt" not "modern data platforms."
6. **Plain over clever.** Clarity is the premium signal in enterprise.

**Voice by audience**

| Audience | Register | Example |
|---|---|---|
| Hiring manager | Peer-to-peer, operational | "Three vetted Databricks engineers, submitted Thursday. Interviewing Monday." |
| Procurement | Precise, documentary | "Background verification covers employment history, education and references for every consultant, onshore and offshore." |
| Executive | Strategic, outcome-framed | "Blend onshore leadership with offshore execution and hold one quality standard across both." |
| Candidate | Warm, respectful, concrete | "You'll speak to a recruiter who knows the role — not a chatbot. Most candidates hear back within two business days." |

**Banned phrases** (add to the CMS editorial checklist): unlock your potential, empowering businesses, bridging the gap, world-class, best-in-class, cutting-edge, synergy, game-changing, seamlessly, holistic solutions, "we're passionate about people," "your success is our success," "people are our greatest asset."

**Permitted with proof only:** leading, trusted, proven, expert — each requires an adjacent number or named client.

## 4.8 Trust signals and where they appear

| Signal | Type | Placement |
|---|---|---|
| 200+ consultants | Scale | Homepage trust bar, About, Hire Talent |
| 20+ years | Longevity | Trust bar, About, footer |
| 80+ Fortune 500 clients | Credibility `[CLEAR-LEGAL]` | Trust bar, About, Hire Talent |
| 48-hr profile turnaround | Operational | Hero subhead, trust bar, Engagement Model |
| Four-stage vetting process | Methodology | Vetting page, Hire Talent, homepage differentiators |
| Replacement guarantee | Risk transfer | Hire Talent, Engagement Model, employer form page |
| Named recruiters with photos | Human | Every job detail page, Contact |
| Client logos | Social proof | Homepage logo strip, Hire Talent, case studies — *only with written permission; otherwise use "Fortune 500 financial services client" descriptors* |
| Case studies with metrics | Evidence | Homepage, hub, industry and capability pages |
| Candidate testimonials | Supply-side proof | Candidate hub, job search sidebar |
| Client testimonials | Demand-side proof | Hire Talent, homepage |
| Certifications (ISO 27001, SOC 2, E-Verify, MSA-ready) | Compliance `[CONFIRM]` | Footer, Compliance page, About |
| Physical office addresses | Legitimacy | Locations, footer, Contact |
| Live job count | Vitality | Nav ("Find Jobs · 214 live"), homepage, job search |
| Response-time commitment | Candidate trust | Application confirmation, job pages |
| Privacy/GDPR posture | Data trust | Application consent, footer, Privacy page |

**On client logos.** Using Fortune 500 logos without written consent is a real legal exposure and a common staffing-industry misstep. Default to anonymised descriptors ("a Fortune 100 retail bank") until logo consent is documented. Flagged `[CLEAR-LEGAL]` in the content spec.

## 4.9 The first 5–10 seconds

What a visitor should feel, and the mechanism that produces it.

| Second | Employer visitor | Mechanism |
|---|---|---|
| 0–2 | "This is a serious, established firm." | Ink-dominant hero, restrained type, no stock-photo handshake, no carousel |
| 2–4 | "They do technology staffing specifically." | H1 names technology talent; capability chips visible (Data · Cloud · ERP · AI · AppDev) |
| 4–7 | "They're fast, and they're at scale." | Trust bar: 200+ / 20+ / 80+ / 48hrs, in tabular numerals |
| 7–10 | "There's a low-friction next step." | Single dominant CTA — *Request Talent* — plus a quieter *Talk to an expert* |

| Second | Candidate visitor | Mechanism |
|---|---|---|
| 0–2 | "There are real jobs here." | Live job count and search field visible without scrolling |
| 2–5 | "For my skills." | Skill chips: Snowflake · AWS · SAP · React · ML |
| 5–10 | "I can apply quickly." | "Apply in under 3 minutes. No account required." |

**Anti-goals for the first 10 seconds:** no autoplay video with sound, no modal, no cookie wall covering the hero, no carousel, no "we are a leading provider of..." paragraph, no more than one primary CTA competing for attention.



---

# 5. Sitemap

## 5.1 Design principles behind this IA

1. **Two front doors, one house.** Employers and candidates get distinct entry paths but share one domain — never a `careers.` subdomain, which fragments SEO authority.
2. **Capability over category.** `/capabilities/data-analytics-staffing` beats `/services/it-staffing`. Specific pages rank and convert; generic ones do neither.
3. **Engagement model ≠ hiring type ≠ practice area.** These are three different axes and conflating them is the most common staffing-site IA failure. We separate them.
4. **No page without a job.** Every URL has a defined purpose, audience, CTA and conversion goal, or it does not ship.
5. **Programmatic depth, editorial control.** Machine-generated pages exist at scale but are gated by quality thresholds.

## 5.2 Full sitemap

```
/                                           Home
│
├── /hire-talent/                           EMPLOYER HUB  ★ core conversion
│   ├── /hire-talent/request-talent/        Request Talent form  ★ conversion
│   ├── /hire-talent/vetting-process/       Four-stage vetting methodology
│   ├── /hire-talent/engagement-model/      Rate cards, SOW/T&M, onboarding, account mgmt
│   └── /hire-talent/compliance/            Compliance & governance (procurement)
│
├── /solutions/                             SOLUTIONS HUB
│   ├── /solutions/staff-augmentation/      Engagement model 1
│   ├── /solutions/team-deployment/         Engagement model 2
│   ├── /solutions/project-based-staffing/  Engagement model 3
│   ├── /solutions/contract-staffing/       Hiring type 1        [Phase 2]
│   ├── /solutions/contract-to-hire/        Hiring type 2        [Phase 2]
│   ├── /solutions/direct-hire/             Hiring type 3        [Phase 2]
│   └── /solutions/delivery-models/         Onshore / Offshore / Hybrid  ★ differentiator
│
├── /capabilities/                          CAPABILITIES HUB  ★ primary SEO
│   ├── /capabilities/data-analytics-staffing/
│   ├── /capabilities/cloud-infrastructure-staffing/
│   ├── /capabilities/erp-enterprise-applications-staffing/
│   │   ├── /capabilities/sap-staffing/              [Phase 2 sub-page]
│   │   ├── /capabilities/salesforce-staffing/       [Phase 2]
│   │   ├── /capabilities/servicenow-staffing/       [Phase 2]
│   │   └── /capabilities/oracle-staffing/           [Phase 2]
│   ├── /capabilities/ai-automation-staffing/
│   └── /capabilities/application-development-qa-staffing/
│
├── /industries/                            INDUSTRIES HUB
│   ├── /industries/financial-services/
│   ├── /industries/healthcare-life-sciences/
│   ├── /industries/manufacturing-industrial/
│   ├── /industries/retail-consumer/
│   ├── /industries/energy-utilities/
│   └── /industries/public-sector/                   [Phase 3 — gated on contract vehicles]
│
├── /jobs/                                  JOB SEARCH  ★ core candidate
│   ├── /jobs/[slug]-[id]/                  Job detail  ★ Google Jobs entry
│   ├── /jobs/skill/[skill]/                Programmatic — skill
│   ├── /jobs/category/[category]/          Programmatic — job family
│   ├── /jobs/location/[country]/[city]/    Programmatic — location
│   ├── /jobs/type/[employment-type]/       Contract / C2H / Direct hire
│   └── /jobs/remote/                       Remote roles
│
├── /candidates/                            CANDIDATE HUB
│   ├── /candidates/submit-resume/          General resume submission  ★ conversion
│   ├── /candidates/job-alerts/             Alert subscription  ★ conversion
│   ├── /candidates/why-vertis/             Consultant value proposition
│   ├── /candidates/faq/                    Candidate FAQ  (FAQPage schema)
│   └── /candidates/resources/              Career resources index
│
├── /account/                               CANDIDATE ACCOUNT  [Phase 3, noindex]
│   ├── /account/profile/
│   ├── /account/applications/
│   ├── /account/saved-jobs/
│   └── /account/alerts/
│
├── /about/                                 ABOUT
│   ├── /about/leadership/
│   ├── /about/how-we-work/                 Delivery methodology narrative
│   └── /about/careers-at-vertis/           Internal hiring (distinct from /jobs)
│
├── /locations/                             LOCATIONS HUB
│   ├── /locations/united-states/
│   │   └── /locations/united-states/[city]/
│   ├── /locations/india/
│   │   └── /locations/india/[city]/
│   └── /locations/[region]/                 EMEA / APAC  [gated — see A4]
│
├── /insights/                              CONTENT HUB
│   ├── /insights/[slug]/                    Articles
│   ├── /insights/category/[category]/
│   ├── /insights/salary-guides/             ★ high-value SEO + lead magnet
│   │   └── /insights/salary-guides/[role]-[year]/
│   ├── /insights/hiring-guides/
│   └── /insights/workforce-reports/         ★ gated lead magnets
│
├── /case-studies/                          PROOF HUB
│   └── /case-studies/[slug]/
│
├── /contact/                               CONTACT ROUTER  ★ conversion
│
├── UTILITY
│   ├── /search/                             Site search        [noindex]
│   ├── /thank-you/employer/                 [noindex]
│   ├── /thank-you/candidate/                [noindex]
│   ├── /thank-you/subscribe/                [noindex]
│   ├── /404, /500
│   ├── /sitemap.xml, /sitemap-jobs.xml, /robots.txt
│   └── /admin/*                             Admin & CMS  [noindex, auth-gated]
│
└── LEGAL
    ├── /legal/privacy-policy/
    ├── /legal/cookie-policy/
    ├── /legal/terms-of-use/
    ├── /legal/candidate-privacy-notice/     ★ GDPR/DPDP requirement
    ├── /legal/accessibility-statement/
    └── /legal/eeo-statement/                US requirement
```

## 5.3 Page classification

| Class | Pages | Count | Role |
|---|---|---|---|
| **Core** | Home, Hire Talent, Solutions hub, Capabilities hub, Industries hub, Jobs, Job detail, Candidates hub, About, Contact | 10 | Carry the brand and the primary journeys |
| **Conversion** | Request Talent, Submit Resume, Job Apply, Job Alerts, Contact, gated report downloads | 6 | Single job: capture a qualified record |
| **SEO landing** | 5 capability pages, 5 industry pages, delivery models, location pages, programmatic job facets, salary guides | 15 editorial + unlimited programmatic | Acquire non-brand organic traffic |
| **Supporting** | Vetting Process, Engagement Model, Compliance, How We Work, Leadership, Why Vertis (candidate), Candidate FAQ, Case studies | 8+ | Remove objections mid-funnel |
| **Utility** | Search, thank-you pages, 404/500, account area, admin | 10+ | Function, not acquisition. `noindex` |
| **Legal** | Privacy, Cookie, Terms, Candidate Privacy Notice, Accessibility, EEO | 6 | Compliance and trust |

**MVP page count: ~48 editorial pages** plus programmatic job pages. Deferred pages are marked `[Phase 2]` / `[Phase 3]`.

## 5.4 Page specification table

Each core page defined by purpose, audience, CTAs, sections, conversion goal and SEO purpose.

---

### `/` — Home
- **Purpose:** Route three audiences correctly in under 10 seconds while establishing enterprise credibility.
- **Audience:** All. Weighted to employers.
- **Primary CTA:** Request Talent
- **Secondary CTA:** Browse Open Roles (+ inline job search)
- **Sections:** Hero · Trust bar · Capabilities · Delivery models · Differentiators · Candidate lane · Industries · Case study · Testimonials · Insights · Employer CTA band · Footer
- **Conversion goal:** Employer lead initiation; secondary, job-search entry
- **SEO purpose:** Brand terms, `Organization` + `WebSite` schema, sitelinks search box, authority hub distributing internal link equity

---

### `/hire-talent/` — Employer Hub
- **Purpose:** The single page that answers "can Vertis solve my hiring problem?" end to end.
- **Audience:** P1 Dana, P2 Marcus, P3 Priya
- **Primary CTA:** Request Talent · **Secondary:** Download Capability Overview
- **Sections:** Hero · Hiring challenges · Engagement models (3) · Delivery models (3) · Capabilities grid · Vetting process summary · Speed commitments · Industries · Case studies · Client testimonials · Compliance summary · FAQ · CTA band
- **Conversion goal:** Employer lead
- **SEO purpose:** `technology staffing company`, `IT staffing agency`, `staff augmentation services`. `FAQPage` schema.

---

### `/hire-talent/request-talent/` — Request Talent
- **Purpose:** Convert intent into a routed, qualified requirement.
- **Primary CTA:** Submit Requirement · **Secondary:** Book a 15-minute call (calendar)
- **Sections:** Compact hero · Form (2-step) · Trust rail (what happens next, response SLA, replacement guarantee, privacy)
- **Conversion goal:** Qualified employer lead → CRM/account manager within 15 minutes
- **SEO purpose:** Minimal. Conversion page. Indexed but not optimised for volume.

---

### `/hire-talent/vetting-process/` — Vetting & Quality
- **Purpose:** Convert the "every agency says they're fast" sceptic. Highest-value objection-handling page on the site.
- **Primary CTA:** Request Talent · **Secondary:** See case studies
- **Sections:** Hero (`Two to three profiles. Not twenty resumes.`) · Four-stage process (Technical Screening → Domain Assessment → Soft Skills Review → Background Verification) · Same standard onshore and offshore · Replacement guarantee · Performance monitoring · Submission philosophy · Metrics · CTA
- **Conversion goal:** Mid-funnel objection removal → Request Talent
- **SEO purpose:** `how staffing agencies vet candidates`, `technical screening process` — informational intent that attracts evaluators

---

### `/solutions/delivery-models/` — Onshore / Offshore / Hybrid
- **Purpose:** Carry the single biggest differentiator. Likely the most commercially important non-form page.
- **Primary CTA:** Talk to a Staffing Expert · **Secondary:** Request Talent
- **Sections:** Hero · Comparison table (onshore vs offshore vs hybrid: cost, timezone, proximity, ramp speed, clearance eligibility, best-fit use cases) · Onshore detail · Offshore detail · Hybrid detail (onshore leads + offshore execution) · One standard, two geographies · Compliance by geography · Case study · FAQ · CTA
- **Conversion goal:** Employer lead from cost-sensitive, scale-sensitive buyers
- **SEO purpose:** `onshore vs offshore staffing`, `hybrid delivery model`, `offshore IT staffing` — strong commercial intent, low competitive density

---

### `/capabilities/[capability]/` — Capability Pages (×5)
- **Purpose:** Rank for skill-specific staffing intent and prove genuine depth.
- **Audience:** P1 Dana primarily; candidates secondarily
- **Primary CTA:** Request Talent (employer) · **Secondary:** View open [capability] roles (candidate)
- **Sections:** Hero · The hiring problem in this domain · Roles we staff (full list) · Platforms & tools (named) · How we vet for this capability · Delivery options · Related industries · Live roles in this capability (dynamic) · Case study · FAQ · CTA
- **Conversion goal:** Employer lead + job-search entry
- **SEO purpose:** The site's primary non-brand traffic engine. `snowflake staffing`, `databricks consultants`, `SAP staffing agency`, `devops staffing`, `ML engineer staffing`.

---

### `/industries/[industry]/` — Industry Pages (×5)
- **Purpose:** Demonstrate domain context; capture industry + staffing intent.
- **Primary CTA:** Request Talent · **Secondary:** See case study
- **Sections:** Hero · Industry hiring challenges · Roles we staff in this industry · Regulatory/compliance context · Capabilities applied · Delivery considerations · Proof points · Case study · Related insights · CTA
- **Conversion goal:** Employer lead
- **SEO purpose:** `IT staffing for financial services`, `healthcare technology staffing`, `manufacturing IT talent`

---

### `/jobs/` — Job Search
- **Purpose:** Let a candidate find a relevant role in under 60 seconds.
- **Primary CTA:** Apply · **Secondary:** Save job / Create alert
- **Sections:** Search bar · Filter rail · Result list · Sort · Pagination · Alert prompt · Empty state with resume-submit fallback
- **Conversion goal:** Job detail view → application
- **SEO purpose:** Indexed hub. Facet pages carry the programmatic strategy. `ItemList` schema.

---

### `/jobs/[slug]-[id]/` — Job Detail
- **Purpose:** Convert an interested candidate into an applicant.
- **Primary CTA:** Apply Now (sticky) · **Secondary:** Save · Share · Contact recruiter
- **Conversion goal:** Application submission
- **SEO purpose:** **`JobPosting` schema → Google Jobs.** The single highest-volume organic entry point on the site.

---

### `/candidates/` — Candidate Hub
- **Purpose:** Serve candidates who are not ready to apply to a specific role.
- **Primary CTA:** Search Jobs · **Secondary:** Submit Resume / Create Job Alert
- **Sections:** Hero + search · Why work with Vertis · How our process works (4 steps) · Capability areas hiring now · Featured roles · Submit resume band · Job alerts · Candidate testimonials · Career resources · FAQ
- **Conversion goal:** Application, resume submission, or alert subscription
- **SEO purpose:** `technology contract jobs`, `IT consultant jobs`, candidate-intent terms

---

### `/about/` — About
- **Purpose:** Convert the "who are these people, really" evaluation.
- **Primary CTA:** Talk to a Staffing Expert · **Secondary:** View open roles
- **Sections:** Hero · Story · What we do · Scale (metrics) · How we work · Delivery footprint map · Leadership · Values · Certifications · Careers at Vertis · CTA
- **Conversion goal:** Trust → contact
- **SEO purpose:** Brand terms, `Organization` schema, E-E-A-T signals

---

### `/contact/` — Contact Router
- **Purpose:** Route four intents without dumping four forms on one page.
- **Primary CTA:** Contextual to selected intent
- **Sections:** Intent selector (I want to hire / I'm looking for a role / Partnership / Something else) → dynamic form · Office locations · Direct emails · Response SLA
- **Conversion goal:** Correctly-routed lead
- **SEO purpose:** `LocalBusiness` / `Organization` contact data, brand + contact terms

---

### `/insights/` and `/case-studies/`
- **Purpose:** Top-of-funnel acquisition (insights) and mid-funnel proof (case studies).
- **Primary CTA:** Contextual — download report, request talent, view related capability
- **SEO purpose:** `Article` / `BlogPosting` schema; salary guides and workforce reports are the highest-value link-earning and lead-generation assets.

---

# 6. Navigation Architecture

## 6.1 The core navigation problem

A staffing site serves two audiences with opposite goals. The failure modes are well documented across the competitive set:

- **Burying jobs** — candidates bounce, and the job-search SEO engine (the largest traffic source) never starts.
- **Leading with jobs** — the site reads as a job board; enterprise buyers don't perceive a partner.
- **A 50/50 split homepage** — forces a choice before credibility is established; both paths underperform.

**Solution: asymmetric prominence with unambiguous separation.** Employer content occupies the navigation's centre of gravity. The candidate path is a single, visually distinct, always-visible destination that is impossible to miss but never competes for the same visual weight.

## 6.2 Desktop header — Left → Centre → Right

```
┌──────────────────────────────────────────────────────────────────────────────────────┐
│                                                                                      │
│  VERTIS GLOBAL      Hire Talent  Solutions  Capabilities  Industries  Insights  About│
│  ▔▔▔▔▔▔▔▔▔▔▔▔                                                                        │
│                                          [ Find Jobs · 214 live ]  [Request Talent] │
│                                                                                      │
└──────────────────────────────────────────────────────────────────────────────────────┘
   LEFT                        CENTRE                                    RIGHT
```

### LEFT — Logo (`Vertis Global`)
Wordmark, links to `/`. Fixed 40px height desktop, 32px mobile. On dark hero variants, a light logo swaps via CSS custom property.
**Why:** Universal convention. Users' first fixation lands top-left in LTR layouts. Moving it costs orientation for zero gain.

### CENTRE — Six primary items
`Hire Talent` · `Solutions` · `Capabilities` · `Industries` · `Insights` · `About`

**Why these six, and why in this order:**

| Item | Menu type | Rationale |
|---|---|---|
| **Hire Talent** | Mega menu | First position after logo = highest-value audience. Directly names the commercial action |
| **Solutions** | Mega menu | *How* we engage (engagement models, delivery models). Distinct from *what* we staff |
| **Capabilities** | Mega menu | *What* we staff. The SEO engine. Separated from Solutions deliberately |
| **Industries** | Dropdown | *Who* we staff for. Simple list, no mega menu needed |
| **Insights** | Dropdown | Content hub. Positioned late — informational, not transactional |
| **About** | Simple link | Credibility. Right-most of the centre group; visited during evaluation, not discovery |

**Explicitly rejected from the nav:** "Services" (ambiguous overlap with Solutions), "Resources" (renamed Insights — more editorial, less support-desk), "Contact" (lives in the right-side CTA cluster and the footer; a nav slot is wasted on it), "Locations" (footer + About; low navigational demand, high SEO value).

**Six is the ceiling.** Seven or more items measurably degrades scan time and forces font-size reduction that undermines the premium register.

### RIGHT — The two-CTA cluster
`[ Find Jobs · 214 live ]` (secondary, outlined) and `[ Request Talent ]` (primary, filled)

**Why the right side, and why in this order:**
- The top-right is the second-strongest fixation zone and the conventional home for action in enterprise UI.
- **Find Jobs sits left of Request Talent** so the higher-value employer CTA occupies the terminal, most-prominent position while the candidate path still gets a persistent, visually distinct button — not a text link lost among nav items.
- **The live job count is doing real work.** It is a vitality signal for candidates ("real jobs here"), a scale signal for employers ("they have active demand"), and a click magnet. Rendered from a cached count, revalidated every 5 minutes.
- **Visual differentiation is essential.** Outlined vs filled makes the two audiences' paths instantly separable without labels or explanation.

**Optional third element, Phase 3:** a small account icon appears right of Request Talent once candidate accounts ship, showing initials when authenticated.

## 6.3 Mega menu structure

Triggered on hover (150ms open delay, 300ms close delay) and on click/Enter for keyboard and touch. Full-width panel, max 1280px content, 32px padding, ink-on-white, one hairline top border. Opens with a 180ms fade + 4px rise — no slide, no bounce.

### Hire Talent
```
┌─ HOW WE HELP ──────────┬─ THE PROCESS ─────────┬─ FEATURED ────────────────┐
│ Hire Talent Overview   │ Vetting & Quality     │  ┌─────────────────────┐  │
│ Request Talent      →  │ Engagement Model      │  │ Two to three        │  │
│ Delivery Models        │ Compliance & Gov.     │  │ profiles.           │  │
│ Talk to an Expert      │ How We Work           │  │ Not twenty resumes. │  │
│                        │                       │  │                     │  │
│                        │                       │  │ See our vetting  →  │  │
│                        │                       │  └─────────────────────┘  │
└────────────────────────┴───────────────────────┴───────────────────────────┘
```

### Solutions
```
┌─ ENGAGEMENT MODELS ────┬─ HIRING TYPES ────────┬─ DELIVERY ────────────────┐
│ Staff Augmentation     │ Contract Staffing     │  Onshore (US)             │
│   Embedded ICs         │ Contract-to-Hire      │  Offshore (India)         │
│ Team Deployment        │ Direct Hire           │  Hybrid                   │
│   Full squads + lead   │                       │                           │
│ Project-Based Staffing │                       │  ┌──────────────────────┐ │
│   Fixed scope, outcome │                       │  │ Onshore. Offshore.   │ │
│                        │                       │  │ One standard.     →  │ │
│ All Solutions       →  │                       │  └──────────────────────┘ │
└────────────────────────┴───────────────────────┴───────────────────────────┘
```
Each engagement model carries a one-line descriptor. This is where a buyer self-identifies, so the labels must be self-explanatory without a click.

### Capabilities
```
┌─ PRACTICE AREAS ───────────────────────────────┬─ LIVE ROLES ──────────────┐
│ ◈ Data & Analytics      Snowflake, Databricks  │  Data & Analytics     47  │
│ ◈ Cloud & Infrastructure AWS, Azure, GCP       │  Cloud & Infra        62  │
│ ◈ ERP & Enterprise Apps  SAP, Salesforce, SNOW │  ERP                  38  │
│ ◈ AI & Automation        ML, LLM, RPA          │  AI & Automation      21  │
│ ◈ App Development & QA   React, Java, .NET     │  AppDev & QA          46  │
│                                                 │                           │
│ All Capabilities →                              │  Browse all roles      →  │
└─────────────────────────────────────────────────┴───────────────────────────┘
```
The platform names under each capability are the SEO and credibility payload — a buyer scanning for "Databricks" finds it in the navigation itself. Live counts pull from cached aggregates and give candidates an entry point from an employer-oriented menu.

### Industries — simple dropdown, single column
Financial Services · Healthcare & Life Sciences · Manufacturing & Industrial · Retail & Consumer · Energy & Utilities · *All Industries →*

### Insights — two columns
`BY TYPE`: Articles · Salary Guides · Hiring Guides · Workforce Reports · Case Studies
`FEATURED`: latest workforce report card with thumbnail.

## 6.4 Sticky header behaviour

Three states, driven by scroll position and direction.

| State | Trigger | Appearance |
|---|---|---|
| **Rest** | `scrollY < 24px` | Transparent over dark hero (light logo/nav) or white over light pages. 88px tall. No shadow |
| **Condensed** | `scrollY ≥ 24px`, scrolling down | 64px tall. Solid white, `backdrop-filter: blur(12px)`, 1px hairline bottom border. Logo scales to 32px. 200ms ease transition |
| **Hidden** | Scrolling down past 480px | Translates `-100%`. Returns instantly on any upward scroll (`translateY(0)`, 240ms) |

**Rules:**
- Never hide on `/jobs/` or `/jobs/[id]` — persistent access to search and Apply matters more than vertical space.
- `prefers-reduced-motion: reduce` disables hide/show; header stays pinned in condensed state.
- Mega menu open → header locks to condensed and does not hide.
- Header is always `position: sticky` with `z-index: var(--z-sticky)`, never `fixed` (avoids layout-shift and iOS viewport bugs).

**A progress bar** (2px, accent colour) appears under the header on `/insights/[slug]` and `/case-studies/[slug]` only.

## 6.5 Mobile navigation

**Header bar (56px):** `[Logo] ......... [Search icon] [☰]`

The search icon opens job search directly — one tap from anywhere to the candidate's primary task.

**Drawer (full-screen, slides from right, 280ms cubic-bezier):**

```
┌────────────────────────────────┐
│  VERTIS GLOBAL            [✕]  │
├────────────────────────────────┤
│                                │
│  ┌──────────────────────────┐  │
│  │   Find Jobs · 214 live   │  │   ← outlined, full width
│  └──────────────────────────┘  │
│  ┌──────────────────────────┐  │
│  │     Request Talent       │  │   ← filled, full width
│  └──────────────────────────┘  │
│                                │
├────────────────────────────────┤
│  Hire Talent               ▾   │   ← accordion
│  Solutions                 ▾   │
│  Capabilities              ▾   │
│  Industries                ▾   │
│  Insights                  ▾   │
│  About                         │   ← direct link, no accordion
├────────────────────────────────┤
│  Submit Resume                 │
│  Job Alerts                    │
│  Contact                       │
├────────────────────────────────┤
│  info@vertisglobal.com          │
│  [in] [X]                      │
└────────────────────────────────┘
```

**Mobile rules:**
- **Both CTAs at the top, above the nav list.** On mobile, the top of the drawer is the highest-value real estate. Burying CTAs below six accordions loses them.
- **Accordions, not drill-down slides.** Users lose orientation in multi-level slide navigation; accordions keep context visible. One open at a time.
- **44×44px minimum touch targets**, 8px minimum spacing between them.
- Body scroll locks while open; focus traps inside the drawer; `Esc` closes and returns focus to the trigger.
- The drawer is a `<dialog>` element with `aria-modal="true"` for correct screen-reader semantics.

## 6.6 Navigation hierarchy summary

| Level | Elements | Purpose |
|---|---|---|
| **0 — Persistent CTAs** | Request Talent, Find Jobs | Always reachable, never more than one tap away |
| **1 — Primary nav** | 6 items | Core IA. Every page reachable in ≤3 clicks from here |
| **2 — Mega menus** | 4 panels | Depth without a page load. Self-descriptive labels |
| **3 — In-page nav** | Sticky sub-nav on long pages, breadcrumbs everywhere below root | Orientation within deep content |
| **4 — Footer** | Full sitemap, 6 columns | Comprehensive access + internal-link equity distribution |

**Breadcrumbs** appear on every page below the root, immediately under the header, using `BreadcrumbList` schema. Format: `Home / Capabilities / Data & Analytics Staffing`.

---

# 7. Homepage Architecture

## 7.1 The hero decision

**Recommendation: employer-led hero with an embedded, visually distinct candidate lane.**

I evaluated three options:

| Option | Verdict |
|---|---|
| **Candidate-led** (big job search, à la Indeed) | **Rejected.** Reads as a job board. Destroys enterprise-partner perception. Kelly and Adecco suffer from this — their homepages read as consumer job portals and their enterprise story is buried three clicks deep |
| **50/50 split screen** ("I'm hiring" / "I'm looking") | **Rejected.** Forces a choice before any credibility is established. Halves the available space for the value proposition, so neither side gets a real message. Consistently underperforms in enterprise B2B testing. It looks like a solution to the designer and like an obstacle to the user |
| **Employer-led with embedded candidate lane** | **Recommended.** One clear message for the highest-value audience, with the candidate path present, obvious and frictionless — but not competing for the primary visual weight |

**How it works in practice.** The H1 and primary CTA speak to the employer. Directly beneath the CTA row sits a single-line job search field with a live role count. It is unmistakably a job search — placeholder text, magnifier icon, live count — but it occupies roughly a third of the hero's vertical weight and none of its typographic weight. A candidate arriving from Google Jobs or a referral finds their path in under two seconds. An employer reads a clean value proposition without a competing headline.

**Additional insurance:** the nav's `Find Jobs · 214 live` button is persistent, and the mobile header's search icon is one tap. The candidate path is never more than one tap away regardless of where they land.

## 7.2 Section-by-section specification

---

### Section 1 — Hero

**Objective.** Establish enterprise credibility and the core differentiator within 5 seconds; route both audiences.

**Content**
- Eyebrow: `Technology Staffing · Onshore · Offshore · Hybrid`
- **H1:** `Vetted technology consultants, delivered in 48 hours.`
- Sub: `200+ consultants across data, cloud, ERP, AI and application engineering. Two decades inside Fortune 500 programs. Onshore, offshore, or blended — you choose the model.`
- Primary CTA: `Request Talent` → `/hire-talent/request-talent/`
- Secondary CTA: `Explore Delivery Models` → `/solutions/delivery-models/`
- Candidate lane: search field `Search 214 open roles — try "Snowflake" or "SAP FICO"` + `Search` button + skill chips: `Snowflake` `AWS` `SAP` `React` `Databricks` `ServiceNow`

**Headline alternatives considered:**
- `Onshore. Offshore. One standard.` — strongest brand line but weaker as an H1 (doesn't state the category for a first-time visitor or for SEO). **Use as the eyebrow or the Delivery Models H1.**
- `The bench behind enterprise delivery.` — excellent About H1, too abstract for the homepage.
- Chosen H1 leads with the concrete promise and contains the category keyword. Correct trade-off for a homepage.

**Visual.** Full-bleed background: ink `#0B1220` base with a very low-opacity abstract network/grid graphic (2–3% opacity, geometric, not decorative) and a subtle radial gradient from the upper-right. **No stock photography of handshakes, no smiling-team-around-a-laptop, no video autoplay.** Optional: a muted, desaturated real photograph of a working environment at 15% opacity behind the ink, only if authentic photography exists. Ships as AVIF/WebP, `priority`, ≤120KB, explicit dimensions to prevent CLS.

**Layout.** Full-bleed dark band. Content in a 1280px container. Text block spans 7 of 12 columns, left-aligned. Right 5 columns hold the abstract graphic and, at ≥1280px, a small floating "live roles" stat card. Hero height `min(88vh, 780px)` — deliberately not 100vh so the trust bar peeks above the fold and invites scroll.

**Desktop.** H1 at `clamp(2.5rem, 4.2vw, 3.75rem)`, 700, `-0.025em`. CTA row horizontal. Search field below CTAs at 560px max-width. Chips on one line.

**Mobile.** Single column, 24px gutters. Hero height `auto`, min 620px. H1 at `2rem`, 700. CTAs stack full-width, `Request Talent` first. **The search field moves above the CTAs on mobile** — mobile traffic skews heavily candidate, and this is a genuine, measurable audience difference worth a layout inversion. Chips scroll horizontally with a fade mask; no scrollbar.

**Conversion purpose.** Two conversions initiated simultaneously without either cannibalising the other. Hero CTA click is the single most important engagement metric on the site.

---

### Section 2 — Trust Bar

**Objective.** Convert the hero's claim into evidence immediately, before any further scroll.

**Content.** Four metrics, tabular numerals, accent-coloured figures on ink or mist:

| `200+` | `20+` | `80+` | `48hrs` |
|---|---|---|---|
| Technology consultants | Years of delivery | Fortune 500 clients `[CLEAR-LEGAL]` | Average profile turnaround |

Below, a hairline-separated logo strip: `Trusted by enterprise technology teams` + 6 client logos in monochrome at 40% opacity, 100% on hover. **If logo consent is not documented, replace with six anonymised descriptors:** `Fortune 100 Retail Bank` · `Global Pharmaceutical Manufacturer` · etc. `[CLEAR-LEGAL]`

**Headline.** None. A headline here would slow the scan. The numbers *are* the content.

**Visual.** No icons. Icons above numbers are a template tell and add nothing. Numbers in Funnel Display 700 at `clamp(2.25rem, 3.5vw, 3rem)`, labels in Inter 500 at `0.875rem`, uppercase, `0.06em` tracking, muted.

**Layout.** Mist `#F3F6FB` band immediately below the ink hero — the tonal shift itself signals a new information register. 4-column grid desktop, thin vertical hairlines between. Padding 64px vertical.

**Mobile.** 2×2 grid. Logo strip becomes a horizontally auto-scrolling marquee at 40s duration, paused on `prefers-reduced-motion`.

**Motion.** Numbers count up from 0 over 900ms when 40% in view, once per session. Respects reduced-motion (renders final value immediately).

**Conversion purpose.** Reduces bounce by validating the hero claim. Enterprise buyers who don't see scale signals within one scroll leave.

---

### Section 3 — Capabilities

**Objective.** Answer "do they staff *my* technology?" with specificity, and distribute link equity to the five most important SEO pages.

**Content.** Five cards.

| Capability | Roles line | Platforms | Live count |
|---|---|---|---|
| Data & Analytics | Data Engineers · Analytics Engineers · Data Architects · BI Developers | Snowflake · Databricks · dbt · BigQuery · Power BI | 47 roles |
| Cloud & Infrastructure | Cloud Architects · DevOps/SRE · Platform Engineers · Cloud Security | AWS · Azure · GCP · Terraform · Kubernetes | 62 roles |
| ERP & Enterprise Applications | SAP Functional · ABAP · Salesforce · ServiceNow · Oracle | S/4HANA · Salesforce · ServiceNow · Oracle Fusion | 38 roles |
| AI & Automation | ML Engineers · NLP/LLM Specialists · RPA Developers · AI Architects | PyTorch · Azure AI · UiPath · LangChain · SageMaker | 21 roles |
| Application Development & QA | Full Stack · Frontend · Backend · Mobile · QA Automation | React · Java/Spring · .NET · Node · Cypress | 46 roles |

**H2:** `Five practice areas. One vetting standard.`
**Sub:** `We staff the technology functions enterprise programs depend on — with consultants who have already done the work at scale.`
**CTA:** `Explore all capabilities →` · **Secondary per card:** `View roles →`

**Layout.** Asymmetric grid, deliberately not a uniform 5-across (which would force cramped cards and read as a template). Row 1: three cards. Row 2: two cards at 1.5× width with room for the platform list. Cards are bordered (1px hairline), not shadowed, with a 3px accent top-edge that appears on hover alongside a `-2px` lift and border darkening.

**Mobile.** Single column stack. Platform lists truncate to four items + `+6 more`.

**Conversion purpose.** Self-identification for the employer, entry point for the candidate. The strongest internal-link distribution on the homepage.

---

### Section 4 — Delivery Models

**Objective.** Carry the primary differentiator. This section is the reason a buyer chooses Vertis over TEKsystems.

**Content.**
**H2:** `Onshore. Offshore. One standard.`
**Sub:** `Every consultant clears the same four-stage vetting process, whether they sit in Dallas or Hyderabad. What changes is your cost structure — not your quality bar.`

Three columns:

| | **Onshore (US)** | **Offshore (India)** | **Hybrid** |
|---|---|---|---|
| Best for | Leadership, client-facing, clearance-eligible roles | Scale ramps, sustained support, cost optimisation | Large programs needing both |
| Timezone | Same-timezone collaboration | Round-the-clock with overlap | Onshore leads, offshore execution |
| Ramp | Days | Rapid team ramps | Phased |
| Cost | Standard tier | Significant advantage | Blended |

**CTA:** `Compare delivery models →` · **Secondary:** `Talk to a staffing expert`

**Visual.** A restrained delivery-footprint graphic — geometric world abstraction with two anchored regions (US, India) and a connecting arc. **Not** an animated globe, **not** pulsing dots. Static SVG, ink and accent, ~18KB. Region markers are anchored to real cities, and the graphic is `aria-hidden` with the comparison table serving as the accessible content.

**Layout.** Ink `#0B1220` full-bleed band — the second dark section, creating a light/dark rhythm through the page. Three columns with hairline dividers. Graphic sits above the columns, centred, max 720px wide.

**Mobile.** Columns stack. The comparison becomes three stacked cards with a label/value list. Graphic reduces to a simplified two-node version.

**Conversion purpose.** The single strongest differentiation moment on the homepage. Feeds the highest-intent page on the site.

---

### Section 5 — Why Vertis (Differentiators)

**Objective.** Replace generic reassurance with four verifiable operational commitments.

**Content.** Four items, each a claim + mechanism.

| Claim | Mechanism |
|---|---|
| **Two to three profiles. Not twenty.** | We submit only consultants who clear technical screening, domain assessment, soft-skills review and background verification. Volume is not a strategy. |
| **Profiles in 48–72 hours.** | Pre-vetted talent pools mean we are not starting a search when you send a requirement. We are shortlisting one. |
| **Productive in two weeks.** | From profile approval to a contributing team member in 10 business days or less, including onboarding and compliance. |
| **Replaced at no cost.** | If a consultant underperforms, we replace them. The commercial risk of a bad fit is ours, not yours. |

**H2:** `What we commit to.`
**Sub:** `Four operational commitments. Each one is measured, and each one is in the contract.`
**CTA:** `See how we vet →`

**Layout.** 2×2 grid on mist background. Each item: large accent-coloured numeral (01–04) in monospace, ink headline at `1.5rem/600`, muted body at `1rem/1.6`. Generous internal padding (40px). Hairline dividers forming a cross, no card borders — a quieter, more editorial treatment that separates this section visually from the card-heavy sections above.

**Mobile.** Single column, hairline separators between items.

**Conversion purpose.** Direct objection handling for the "every agency says this" sceptic. Note that no thin-line icons are used here — the numerals carry the structure, which keeps the section from reading as another icon grid.

---

### Section 6 — Candidate Lane

**Objective.** Give candidates a substantial, respectful destination on an employer-weighted homepage.

**Content.**
**H2:** `Looking for your next engagement?`
**Sub:** `214 open roles across data, cloud, ERP, AI and application engineering. Apply in under three minutes — no account required.`

Three paths:
1. **Search open roles** — `Browse 214 live roles →` · `/jobs/`
2. **Submit your resume** — `No role that fits yet? Join the bench and we'll contact you when one opens.` → `/candidates/submit-resume/`
3. **Create a job alert** — `Get new roles matching your skills, weekly.` → `/candidates/job-alerts/`

Plus: featured roles strip — three live job cards pulled dynamically (most recent, or most-viewed).

**CTA:** `Browse all roles →` · **Secondary:** `Submit your resume`

**Visual.** One authentic photograph of a consultant working — real, not stock, desaturated slightly to sit within the palette. If authentic photography is unavailable at launch, use a mist-background layout with no image rather than a stock substitute. `[CONFIRM — photography]`

**Layout.** Two-column split: left 5 columns for heading, copy and three path links; right 7 columns for the three live job cards stacked. White background, returning to light after the ink Delivery Models band.

**Mobile.** Heading and copy first, then the three paths as full-width bordered rows with chevrons, then job cards in a horizontal snap-scroll carousel.

**Conversion purpose.** Captures the ~75% of homepage traffic that is candidate-side without diluting the employer message above it. The three-path structure catches active seekers, passive candidates and bench-joiners separately.

---

### Section 7 — Industries

**Objective.** Signal domain context and distribute link equity to five industry pages.

**Content.** Five industry cards: Financial Services · Healthcare & Life Sciences · Manufacturing & Industrial · Retail & Consumer · Energy & Utilities.

Each: name, one-line hiring-context descriptor, `View →`.
Example — *Financial Services*: `Data platform modernisation and regulatory reporting under audit constraints.`

**H2:** `Industry context, not just role titles.`
**Sub:** `A data engineer in a regulated bank and one in a retail business are not interchangeable. We staff for the operating environment, not just the tech stack.`
**CTA:** `All industries →`

**Layout.** Horizontal band, five equal cards, minimal treatment — name + descriptor + arrow, hairline borders, no images. Restraint here is deliberate: image-heavy industry cards are the most template-like pattern in staffing web design.

**Mobile.** Horizontal snap-scroll, 80% card width so the next card peeks and signals scrollability.

**Conversion purpose.** Industry self-identification; internal linking.

---

### Section 8 — Case Study (Featured)

**Objective.** One piece of concrete, metric-backed proof.

**Content.** A single featured case study, not a carousel.
- Industry tag + delivery model tag
- **Headline:** the outcome, e.g. `18 consultants across SAP and Azure, deployed in six weeks.`
- Structure: `Challenge` → `Approach` → `Outcome`, ~40 words each
- Three metrics: `18 consultants` · `6 weeks to full deployment` · `94% retention over 18 months` `[CONFIRM]`
- Client descriptor: `Fortune 500 industrial manufacturer` (anonymised unless consent documented)
- CTA: `Read the full case study →` · Secondary: `View all case studies`

**Layout.** Two columns: left 5 columns for tags, headline, metrics; right 7 columns for the Challenge/Approach/Outcome narrative in three hairline-separated blocks. Ink background — the third dark band, and the last one before the footer.

**Mobile.** Stacked. Metrics become a 3-column row of numerals directly under the headline, before the narrative.

**Conversion purpose.** Evidence for the evaluation-stage buyer. A single deep case study outperforms three shallow carousel slides — carousels beyond the first slide are effectively unviewed.

---

### Section 9 — Testimonials

**Objective.** Third-party validation from both sides of the marketplace.

**Content.** Three quotes: **two client, one candidate** — the ratio reflects the commercial priority while proving supply-side health.

Each: quote (25–45 words), name, title, company or descriptor, photo if consented.

Client example: *"They sent three profiles. We hired two. That has not happened with any other vendor on our panel."* — VP Engineering, Financial Services `[CONFIRM]`

**H2:** `What clients and consultants say.`

**Visual.** Static three-column grid. **No carousel.** Photos are 48px circles; where a photo is unavailable, use initials in an accent-tinted circle rather than a generic avatar.

**Layout.** White background, three equal columns, hairline-bordered quote cards with a large accent quotation glyph at low opacity.

**Mobile.** Stack, or 2-card snap-scroll.

**Conversion purpose.** Peer validation immediately before the final CTA — the highest-leverage position for social proof.

---

### Section 10 — Insights

**Objective.** Demonstrate market expertise; feed the content funnel; give returning visitors a reason to re-engage.

**Content.** Three cards — deliberately mixed types:
1. **Salary Guide** — `2026 US Technology Contract Rate Guide` (gated lead magnet)
2. **Article** — `What enterprise buyers get wrong about offshore quality`
3. **Workforce Report** — `Enterprise AI hiring: demand vs. supply, 2026`

Each: type tag, title, 1-line excerpt, read time or `Download`.

**H2:** `Staffing intelligence.` **Sub:** `Rate benchmarks, hiring trends and workforce analysis from inside enterprise programs.`
**CTA:** `All insights →`

**SEO and lead-generation role.** This is the top of the content funnel. Salary guides and workforce reports are the site's highest-value link-earning assets — journalists, analysts and procurement teams cite rate data, which builds the domain authority that lifts every commercial page. Gated reports capture leads at a much earlier funnel stage than Request Talent, feeding nurture sequences that convert months later. Ungated articles capture informational search intent and internally link to capability and solution pages.

**Layout.** Three cards, mist background. 16:9 thumbnails (abstract data-viz treatments, not stock photos), tag chip, title at `1.25rem/600`, excerpt, meta row.

**Mobile.** Stack.

---

### Section 11 — Employer CTA Band

**Objective.** The final, unmissable employer conversion moment.

**Content.**
**H2:** `Tell us what you need. We'll have profiles in 48 hours.`
**Sub:** `Send us a requirement and a dedicated account manager will come back with two to three vetted consultants — onshore, offshore, or blended.`
**Primary CTA:** `Request Talent` · **Secondary:** `Book a 15-minute call`
Below, three reassurance micro-items: `No obligation` · `Response within one business day` · `Replacement guarantee on every placement`

**Headline alternatives considered:** `Need talent that moves your business forward?` (your example) — rejected as slightly generic and question-framed; questions invite "no." The recommended line states the commitment and the timeframe, which is both more specific and more confident.

**Visual.** No image. Full-bleed accent-adjacent treatment: deep ink with a single accent hairline above the H2. Restraint at the conversion point is intentional — nothing should compete with the CTA.

**Layout.** Centred, max 720px content width, 120px vertical padding. The generous whitespace is what makes it read as a deliberate pause rather than another section.

**Mobile.** Full-width stacked CTAs, `Request Talent` first, 56px tall.

**Conversion purpose.** Catches the scrolled-to-bottom evaluator — a high-intent segment, since reaching the footer area implies genuine consideration.

---

### Section 12 — Footer

Full specification in §7.3.

## 7.3 Footer architecture

Six columns plus a base bar. Ink background, muted text, accent hover.

```
┌───────────────────────────────────────────────────────────────────────────────────────┐
│  VERTIS GLOBAL                                                                        │
│  Vetted technology consultants, delivered in 48 hours.                                │
│  Onshore. Offshore. One standard.                                                     │
│                                                                                       │
│  ┌─────────────────────────────────────────────────────────────────────────────────┐ │
│  │  Get monthly rate benchmarks and hiring trends.  [ email ]  [ Subscribe ]        │ │
│  └─────────────────────────────────────────────────────────────────────────────────┘ │
├───────────┬───────────┬───────────┬───────────┬───────────┬───────────────────────────┤
│ SOLUTIONS │ CAPABILI- │ INDUSTRIES│ CANDIDATES│ COMPANY   │ CONTACT                   │
│           │ TIES      │           │           │           │                           │
│ Hire      │ Data &    │ Financial │ Find Jobs │ About     │ Staffing inquiries        │
│  Talent   │  Analytics│  Services │ Submit    │ Leadership│ info@vertisglobal.com      │
│ Staff Aug │ Cloud &   │ Healthcare│  Resume   │ How We    │                           │
│ Team      │  Infra    │  & Life   │ Job Alerts│  Work     │ United States             │
│  Deploy   │ ERP &     │  Sciences │ Why Vertis│ Careers at│ [City, State]  [CONFIRM]  │
│ Project-  │  Ent Apps │ Manufact- │ Candidate │  Vertis   │                           │
│  Based    │ AI &      │  uring    │  FAQ      │ Insights  │ India                     │
│ Delivery  │  Automat. │ Retail &  │ Career    │ Case      │ [City]         [CONFIRM]  │
│  Models   │ App Dev   │  Consumer │  Resources│  Studies  │                           │
│ Vetting   │  & QA     │ Energy &  │           │ Locations │ [in] [X]                  │
│ Engagement│           │  Utilities│           │ Contact   │                           │
│  Model    │           │           │           │           │ [ Request Talent ]        │
│ Compliance│           │           │           │           │                           │
├───────────┴───────────┴───────────┴───────────┴───────────┴───────────────────────────┤
│  © 2026 Vertis Global. All rights reserved.                                           │
│  Privacy · Cookies · Terms · Candidate Privacy Notice · Accessibility · EEO           │
│  [Cookie preferences]                                                                 │
└───────────────────────────────────────────────────────────────────────────────────────┘
```

**Footer rationale**
- **Six columns matching the IA** — the footer is the site's most reliable internal-linking surface and should mirror the sitemap, not offer a random subset.
- **Newsletter above the columns**, not buried — this is a real lead-capture surface and belongs at the top of the footer where scroll-completers land.
- **A Request Talent button inside the contact column** — the footer is the last chance to convert a scrolled-through evaluator.
- **Locations with real addresses** — legitimacy signal and `Organization` schema payload.
- **Candidate Privacy Notice as a distinct link** from the general Privacy Policy. This is a GDPR/DPDP requirement, not a nicety: candidate data processing needs its own disclosed lawful basis and retention period.
- **Accessibility statement linked** — a WCAG conformance and procurement-checklist requirement.
- **Cookie preferences link** persists so consent is revocable, which GDPR requires.

**Mobile footer.** Columns collapse to accordions; newsletter and contact stay expanded by default; legal links wrap in the base bar; social icons centred.


---

# 8. Page-by-Page Architecture

Text wireframes for every major page. Each shows section order top to bottom. `★` marks the primary conversion element.

## 8.1 Homepage

```text
HEADER (sticky)
├── Logo
├── Nav: Hire Talent · Solutions · Capabilities · Industries · Insights · About
└── CTA cluster: [Find Jobs · 214 live] [Request Talent] ★

HERO (ink, full-bleed, min(88vh,780px))
├── Eyebrow: Technology Staffing · Onshore · Offshore · Hybrid
├── H1: Vetted technology consultants, delivered in 48 hours.
├── Sub (2 lines max)
├── CTA row: [Request Talent] ★  [Explore Delivery Models]
├── Job search field + [Search]
├── Skill chips: Snowflake · AWS · SAP · React · Databricks · ServiceNow
└── Visual: abstract network graphic (right 5 cols)

TRUST BAR (mist)
├── 200+ Technology consultants
├── 20+  Years of delivery
├── 80+  Fortune 500 clients        [CLEAR-LEGAL]
├── 48hrs Average profile turnaround
└── Logo strip / anonymised client descriptors

CAPABILITIES (white)
├── H2: Five practice areas. One vetting standard.
├── Row 1: [Data & Analytics] [Cloud & Infrastructure] [ERP & Enterprise Apps]
├── Row 2: [AI & Automation]  [Application Development & QA]
│         └── each: name · roles · platforms · live count · View roles →
└── CTA: Explore all capabilities →

DELIVERY MODELS (ink, full-bleed)
├── H2: Onshore. Offshore. One standard.
├── Sub
├── Footprint graphic (static SVG, aria-hidden)
├── 3 columns: Onshore (US) | Offshore (India) | Hybrid
│   └── each: best for · timezone · ramp · cost
└── CTA: Compare delivery models →   [Talk to a staffing expert]

WHY VERTIS (mist)
├── H2: What we commit to.
└── 2×2 grid
    ├── 01 Two to three profiles. Not twenty.
    ├── 02 Profiles in 48–72 hours.
    ├── 03 Productive in two weeks.
    └── 04 Replaced at no cost.

CANDIDATE LANE (white)
├── LEFT (5 cols)
│   ├── H2: Looking for your next engagement?
│   ├── Sub: 214 open roles · apply in under 3 minutes · no account required
│   └── 3 paths: Search roles → · Submit resume → · Create job alert →
└── RIGHT (7 cols)
    └── 3 live JobCards (dynamic)

INDUSTRIES (mist)
├── H2: Industry context, not just role titles.
└── 5 minimal cards: Financial Services · Healthcare & Life Sciences ·
    Manufacturing & Industrial · Retail & Consumer · Energy & Utilities

CASE STUDY — FEATURED (ink)
├── LEFT: tags · outcome headline · 3 metrics
├── RIGHT: Challenge → Approach → Outcome
└── CTA: Read the full case study →

TESTIMONIALS (white)
└── 3 quotes: client · client · candidate

INSIGHTS (mist)
├── H2: Staffing intelligence.
└── 3 cards: Salary Guide · Article · Workforce Report

EMPLOYER CTA BAND (ink, centred, 120px padding)
├── H2: Tell us what you need. We'll have profiles in 48 hours.
├── [Request Talent] ★  [Book a 15-minute call]
└── No obligation · Response within 1 business day · Replacement guarantee

FOOTER (ink)
├── Brand + tagline + newsletter capture
├── 6 columns: Solutions · Capabilities · Industries · Candidates · Company · Contact
└── Base: © · Privacy · Cookies · Terms · Candidate Privacy · Accessibility · EEO
```

## 8.2 Job Search — `/jobs/`

```text
HEADER (sticky, never hides on this route)

SEARCH BAR (sticky below header, ink band, 96px)
├── [Keyword / skill / title]
├── [Location or Remote]
├── [Search] ★
└── Result count: "214 roles" · active filter chips (removable)

BREADCRUMB: Home / Jobs

BODY — 2 columns (desktop)
├── FILTER RAIL (3 cols, sticky, own scroll)
│   ├── Work arrangement: Remote · Hybrid · Onsite
│   ├── Employment type: Contract · Contract-to-Hire · Direct Hire
│   ├── Capability: Data · Cloud · ERP · AI · AppDev & QA
│   ├── Skills (searchable multi-select, top 20 + search)
│   ├── Location (country → state/region → city)
│   ├── Experience: 0–2 · 3–5 · 6–10 · 10+
│   ├── Rate / Salary range (slider + "include unspecified" toggle)
│   ├── Date posted: 24h · 7d · 14d · 30d
│   ├── Delivery model: Onshore · Offshore · Hybrid
│   └── [Clear all]
│
└── RESULTS (9 cols)
    ├── Sort: Most relevant ▾ | Newest | Rate high→low
    ├── JobCard ×20
    │   ├── Title (link) · [NEW] badge if <7d
    │   ├── Location · Employment type · Work arrangement
    │   ├── Rate range or "Rate on application"
    │   ├── Top 4 skill chips
    │   ├── Excerpt (2 lines, clamped)
    │   ├── Posted date · Job ID
    │   └── [Save ♡]  [View role →]  ★
    ├── After card 5: inline JOB ALERT prompt
    ├── After card 12: inline SUBMIT RESUME prompt
    └── Pagination: ‹ 1 2 3 … 11 ›

EMPTY STATE
├── "No roles match these filters."
├── Suggested: remove narrowest filter · broaden location · related skills
└── [Create an alert for this search] ★  [Submit your resume]

FOOTER
```

**Mobile job search**
```text
STICKY SEARCH (56px): [🔍 keyword] [📍 location]
STICKY BAR: "214 roles"  [Filters ▾ (3)]  [Sort ▾]
RESULTS: single-column JobCards, full-bleed with 16px gutters
FILTERS: full-screen bottom sheet
  ├── grouped accordions
  ├── live "Show 47 roles" count updates as filters change
  └── sticky footer: [Clear all]  [Show 47 roles] ★
```

## 8.3 Job Detail — `/jobs/[slug]-[id]/`

```text
HEADER (sticky)
BREADCRUMB: Home / Jobs / Data & Analytics / Senior Data Engineer

┌─ MAIN (8 cols) ──────────────────────┬─ RAIL (4 cols, sticky) ──────────┐
│                                      │                                  │
│ JOB HEADER                           │ APPLY CARD ★                     │
│ ├── H1: Senior Data Engineer         │ ├── Rate: $75–95/hr W2           │
│ ├── Meta row:                        │ ├── Contract · 12 months         │
│ │   📍 Charlotte, NC (Hybrid)        │ ├── Start: Immediate             │
│ │   💼 Contract · 12 months          │ ├── [Apply Now] ★                │
│ │   💰 $75–95/hr                     │ ├── [♡ Save role]                │
│ │   🕐 Posted 3 days ago             │ └── "Apply in under 3 min.       │
│ ├── Job ID: VG-2026-4471             │      No account required."       │
│ └── [Apply Now] ★ [♡ Save] [↗ Share] │                                  │
│                                      │ RECRUITER CARD                   │
│ ABOUT THE ROLE                       │ ├── Photo · Name                 │
│ └── 2–3 paragraphs, client context   │ ├── Senior Technical Recruiter   │
│                                      │ ├── Data & Analytics             │
│ WHAT YOU'LL DO                       │ └── [Message recruiter]          │
│ └── 5–8 bullets                      │                                  │
│                                      │ AT A GLANCE                      │
│ WHAT WE'RE LOOKING FOR               │ ├── Capability: Data & Analytics │
│ ├── Required (5–7 bullets)           │ ├── Delivery: Onshore (US)       │
│ └── Preferred (3–4 bullets)          │ ├── Experience: 6–10 years       │
│                                      │ ├── Work auth: US only           │
│ SKILLS                               │ └── Interview: 2 rounds          │
│ └── chips: Snowflake · dbt · Python  │                                  │
│           · Airflow · SQL · AWS      │ TRUST                            │
│                                      │ ├── Most candidates hear back    │
│ BENEFITS & ENGAGEMENT                │ │   within 2 business days       │
│ └── W2 · health · 401k · PTO         │ └── Your resume is never shared  │
│                                      │     without your permission      │
│ ABOUT VERTIS (compact, 3 lines)      │                                  │
│ └── + trust metrics                  │                                  │
└──────────────────────────────────────┴──────────────────────────────────┘

SIMILAR ROLES
└── 3 JobCards — same capability, then same location, then same skills

CANDIDATE CTA BAND
├── "Not the right role?"
└── [Create a job alert] [Submit your resume]

FOOTER
```

**Mobile job detail**
```text
BREADCRUMB (truncated: … / Senior Data Engineer)
H1
META (stacked, 2-col grid of icon+value)
RATE — prominent
[Apply Now] ★ full-width
[♡ Save]  [↗ Share]  (50/50 split)
RECRUITER CARD (moves up — trust before the long read)
ABOUT / RESPONSIBILITIES / REQUIREMENTS / SKILLS / BENEFITS
AT A GLANCE (accordion, collapsed)
SIMILAR ROLES (horizontal snap-scroll)
────────────────────────────────────────
STICKY BOTTOM BAR (appears after 400px scroll):
  [♡]  $75–95/hr  [Apply Now] ★
```

**Why this layout.** Desktop uses a sticky right rail so Apply is never off-screen during a long read — the single most important conversion mechanic on the page. Mobile promotes the recruiter card above the body copy because on a small screen the "is this a real role from a real person?" question must be answered before the candidate commits to scrolling. The sticky bottom bar with the rate visible is what converts the scroll-to-bottom reader.

## 8.4 Apply — `/jobs/[slug]-[id]/apply/`

```text
COMPACT HEADER (logo + "Applying for: Senior Data Engineer" + [✕ exit])
  └── minimal nav — this is a focused flow, distractions cost completions

PROGRESS: ●━━━━○━━━━○   Step 1 of 3 · About 3 minutes

┌─ STEP 1 — YOUR RESUME ──────────────────────────────────┐
│  H2: Start with your resume                             │
│  Sub: We'll read it and fill in the rest.               │
│                                                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │        ⬆  Drag your resume here                   │  │
│  │           or browse files                         │  │
│  │        PDF, DOC, DOCX · up to 10MB                │  │
│  └───────────────────────────────────────────────────┘  │
│  [Apply with LinkedIn]   ·   [Enter details manually]   │
│                                                         │
│  → parsing state: "Reading your resume…" (2–4s)         │
│  → parsed state:  "✓ We found your details. Check them  │
│                    on the next step."                   │
│                                     [Continue →] ★      │
└─────────────────────────────────────────────────────────┘

┌─ STEP 2 — CONFIRM YOUR DETAILS ─────────────────────────┐
│  H2: Does this look right?                              │
│  Sub: We pulled this from your resume. Edit anything.   │
│                                                         │
│  Full name *          [prefilled]                       │
│  Email *              [prefilled]                       │
│  Phone *              [prefilled] (intl. format)        │
│  Location *           [prefilled] city + country        │
│  Current title        [prefilled]                       │
│  Years of experience * [prefilled ▾]                    │
│  Key skills           [prefilled chips, editable]       │
│  LinkedIn URL         [optional]                        │
│                              [← Back]  [Continue →] ★   │
└─────────────────────────────────────────────────────────┘

┌─ STEP 3 — A FEW ROLE QUESTIONS ─────────────────────────┐
│  H2: Last step                                          │
│                                                         │
│  Work authorization *        [ ▾ ] (region-aware)       │
│  Do you require sponsorship now or in future? *  ○Yes ○No│
│  Earliest available start *  [ ▾ ]                      │
│  Expected rate / salary      [ ___ ] [ ▾ hr/yr ] (opt.) │
│  Anything we should know?    [ textarea ] (optional)    │
│                                                         │
│  ☐ * I consent to Vertis Global processing my data for  │
│      recruitment. Retained 24 months. Withdraw anytime. │
│      [Candidate Privacy Notice ↗]                       │
│  ☐   Send me matching roles by email (optional)         │
│                                                         │
│  [invisible bot protection]                             │
│                        [← Back]  [Submit application] ★ │
└─────────────────────────────────────────────────────────┘

┌─ SUCCESS ───────────────────────────────────────────────┐
│  ✓  Application received                                │
│  Reference: VG-APP-88213                                │
│                                                         │
│  What happens next                                      │
│  1. A recruiter reviews your profile — usually within   │
│     2 business days                                     │
│  2. If there's a fit, we'll call to discuss the role    │
│  3. We never share your resume without your permission  │
│                                                         │
│  [Recruiter card: name · photo · direct email]          │
│                                                         │
│  Similar roles you may want:                            │
│  └── 3 JobCards                                         │
│                                                         │
│  [Create a job alert]  [Browse more roles]              │
└─────────────────────────────────────────────────────────┘
```

## 8.5 Hire Talent — `/hire-talent/`

```text
HEADER
BREADCRUMB: Home / Hire Talent

HERO (ink)
├── Eyebrow: For hiring teams
├── H1: Technology talent, vetted and deployed on your timeline.
├── Sub: Two to three qualified profiles in 48–72 hours. Onshore,
│        offshore, or blended — under one vetting standard.
├── [Request Talent] ★  [Download capability overview]
└── Inline metrics: 200+ consultants · 48hr profiles · 2-week onboarding

HIRING CHALLENGES (white)
├── H2: The problems we're usually called in to solve.
└── 4 cards
    ├── "The req has been open 60+ days."
    ├── "We need 15 people, not one."
    ├── "The budget won't support an all-onshore team."
    └── "The last vendor sent 20 resumes and no hires."

ENGAGEMENT MODELS (mist)
├── H2: Three ways to engage.
└── 3 cards: Staff Augmentation [MOST COMMON] · Team Deployment
    [LARGE PROGRAMS] · Project-Based Staffing [FIXED SCOPE]
    └── each: what it is · who it suits · what you control · Learn more →

DELIVERY MODELS (ink)
├── H2: Onshore. Offshore. One standard.
├── 3-col comparison
└── CTA: Compare delivery models →

CAPABILITIES (white)
├── H2: What we staff.
└── 5 capability cards with live role counts

VETTING (mist)
├── H2: Two to three profiles. Not twenty resumes.
├── 4-step horizontal process:
│   01 Technical Screening → 02 Domain Assessment →
│   03 Soft Skills Review  → 04 Background Verification
└── CTA: See the full vetting process →

SPEED & COMMITMENTS (white)
└── 4 stat blocks: 48–72hr profiles · 10-day onboarding ·
    Dedicated account manager · No-cost replacement

INDUSTRIES (mist)
└── 5 industry links

CASE STUDIES (white)
└── 2 case study cards

CLIENT TESTIMONIALS (mist)
└── 3 client quotes

COMPLIANCE SUMMARY (white)
├── H2: The paperwork, handled.
└── Background checks · IP agreements · labour compliance ·
    data privacy · insurance   → Compliance & governance →

FAQ (mist)  [FAQPage schema]
└── 8 questions (rates, timelines, replacement, offshore quality,
    contracts, conversion fees, geographies, minimum engagement)

CTA BAND (ink)
└── [Request Talent] ★  [Book a 15-minute call]

FOOTER
```

## 8.6 Request Talent — `/hire-talent/request-talent/`

```text
COMPACT HEADER

┌─ FORM (7 cols) ─────────────────────┬─ TRUST RAIL (4 cols, sticky) ──┐
│ H1: Tell us what you need.          │ WHAT HAPPENS NEXT              │
│ Sub: Most requirements get profiles │ 1. Account manager reviews     │
│      within 48–72 hours.            │    within 1 business hour      │
│                                     │ 2. 15-min scoping call         │
│ PROGRESS: ●━━━○  Step 1 of 2        │ 3. 2–3 vetted profiles in      │
│                                     │    48–72 hours                 │
│ STEP 1 — THE REQUIREMENT            │                                │
│ ├── Role title *                    │ ─────────────────              │
│ ├── Capability area *      [▾]      │ 200+ consultants               │
│ ├── Key skills *           [chips]  │ 20+ years                      │
│ ├── Number of positions *  [▾]      │ 80+ Fortune 500 clients        │
│ ├── Employment type *      [▾]      │ 48hr average turnaround        │
│ ├── Delivery model *       [▾]      │                                │
│ │   Onshore / Offshore / Hybrid /   │ ─────────────────              │
│ │   Not sure — advise me            │ "They sent three profiles.     │
│ ├── Location *                      │  We hired two."                │
│ ├── Timeline *             [▾]      │  — VP Eng, Financial Services  │
│ └── Additional detail      [textarea]│                               │
│                      [Continue →]   │ ─────────────────              │
│                                     │ 🔒 Your details are never      │
│ STEP 2 — ABOUT YOU                  │    shared or sold.             │
│ ├── Full name *                     │    [Privacy Policy ↗]          │
│ ├── Work email *                    │                                │
│ ├── Company *                       │                                │
│ ├── Job title *                     │                                │
│ ├── Phone            (optional)     │                                │
│ ├── Company size     (optional) [▾] │                                │
│ ├── ☐ * Consent to be contacted     │                                │
│ └── [invisible bot protection]      │                                │
│              [← Back] [Send ✓] ★    │                                │
└─────────────────────────────────────┴────────────────────────────────┘

FOOTER (compact — links only, no full sitemap)
```

## 8.7 Solution Page (template) — `/solutions/[solution]/`

```text
HEADER · BREADCRUMB

HERO (ink)
├── Eyebrow: Engagement model
├── H1: [Solution name]
├── Sub: one-sentence definition
└── [Request Talent] ★ [Talk to an expert]

THE PROBLEM (white)
├── H2: When this model makes sense
└── 3 scenario cards

HOW IT WORKS (mist)
├── H2: [Solution] in practice
└── 4–5 step process, numbered, horizontal desktop / vertical mobile

WHAT YOU CONTROL vs WHAT WE MANAGE (white)
└── 2-column comparison table — critical for engagement-model pages,
    since the buyer's real question is "who is accountable for what"

BENEFITS (mist)
└── 4 proof-backed benefit blocks

DELIVERY OPTIONS (white)
└── Onshore / Offshore / Hybrid applicability for this model

CAPABILITIES AVAILABLE (mist)
└── 5 capability chips → capability pages

COMMERCIAL MODEL (white)
└── Rate card structure · SOW vs T&M · minimum engagement · notice terms

CASE STUDY (ink)
└── One relevant, metric-backed

FAQ (mist)  [FAQPage schema]

CTA BAND (ink) ★

FOOTER
```

## 8.8 Capability Page (template) — `/capabilities/[capability]/`

```text
HEADER · BREADCRUMB

HERO (ink)
├── Eyebrow: Capability
├── H1: [Capability] Staffing
├── Sub: named platforms + delivery flexibility
├── [Request Talent] ★  [View N open roles]
└── Live count badge: "47 open roles in this capability"

THE HIRING PROBLEM (white)
├── H2: Why this talent is hard to hire
└── 3 evidence-backed points specific to this domain

ROLES WE STAFF (mist)
├── H2: Roles we staff
└── 2-column list, all roles named (SEO + credibility payload)

PLATFORMS & TOOLS (white)
├── H2: Platforms we staff for
└── Named platform chips, grouped by sub-domain

HOW WE VET FOR [CAPABILITY] (mist)
└── The 4 stages, made domain-specific
    (e.g. "hands-on SQL and pipeline design assessment")

DELIVERY OPTIONS (white)
└── Onshore / offshore availability for this capability

OPEN ROLES (mist)  ← dynamic
├── H2: Open [capability] roles
├── 6 live JobCards filtered to this capability
└── [View all N roles →]

INDUSTRIES (white)
└── Where we deploy this capability

CASE STUDY (ink)

FAQ (mist)  [FAQPage schema]

CTA BAND (ink) ★  dual: [Request Talent] [Browse roles]

FOOTER
```

**Note.** Capability pages are the only template serving both audiences equally, because the search intent is genuinely mixed — `snowflake staffing` is searched by hiring managers, `snowflake jobs` by candidates. The dual CTA band at the bottom is correct here and nowhere else.

## 8.9 Industry Page (template) — `/industries/[industry]/`

```text
HEADER · BREADCRUMB

HERO (ink)
├── Eyebrow: Industry
├── H1: Technology Staffing for [Industry]
├── Sub: sector-specific framing
└── [Request Talent] ★ [See case study]

SECTOR HIRING CHALLENGES (white)
├── H2: What makes hiring hard in [industry]
└── 3–4 challenges specific to the sector, not generic

ROLES WE STAFF IN [INDUSTRY] (mist)
└── Role list, sector-weighted

REGULATORY & OPERATING CONTEXT (white)
└── e.g. SOX/PCI for finance · HIPAA/GxP for healthcare/life sciences ·
    OT/IT convergence for manufacturing · NERC CIP for energy
    — this section is what separates a real industry page from a
      keyword page

CAPABILITIES APPLIED (mist)
└── Which of the 5 capabilities matter most here, and why

DELIVERY CONSIDERATIONS (white)
└── Data-residency, clearance or onsite constraints by sector

PROOF POINTS (mist)
└── 3 metrics for this sector  [CONFIRM]

CASE STUDY (ink)

RELATED INSIGHTS (mist)
└── 3 articles tagged to this industry

CTA BAND (ink) ★

FOOTER
```

## 8.10 About — `/about/`

```text
HEADER · BREADCRUMB

HERO (ink)
├── H1: The bench behind enterprise delivery.
├── Sub: Vertis Global is a technology staffing firm. For two decades
│        our consultants have worked inside the programs Fortune 500
│        companies cannot afford to get wrong.
└── [Talk to an expert] [View open roles]

STORY (white) — 2 columns
├── H2: How we got here
├── Narrative, ~250 words, three beats:
│   founding intent → why onshore+offshore → what we became
└── Right column: pull-quote or founding-year marker
    ── Avoids the corporate-timeline cliché. A single well-written
       narrative outperforms a horizontal milestone scroller.

SCALE (ink)
├── H2: Where we are today
└── 6 metrics: 200+ consultants · 20+ years · 80+ F500 clients ·
    5 practice areas · 2 delivery geographies · 48hr turnaround

WHAT WE DO (white)
└── 3 blocks: who we staff · how we engage · where we deliver

HOW WE WORK (mist)
├── H2: Our operating principles
└── 4 principles, each with a concrete practice attached
    ├── Quality over volume → 2–3 profiles per requirement
    ├── One standard, every geography → same 4-stage vetting
    ├── Accountability is ours → no-cost replacement
    └── One point of contact → dedicated account manager

DELIVERY FOOTPRINT (white)
├── H2: Where we operate
├── Map (static SVG) + office list with real addresses  [CONFIRM]
└── → Locations

LEADERSHIP (mist)
├── H2: Leadership
└── Grid: photo · name · title · 2-line bio · LinkedIn   [CONFIRM]

VALUES (white)
└── 4 values, each stated as a behaviour not an abstraction

CERTIFICATIONS & COMPLIANCE (mist)
└── Logos/badges + link to Compliance   [CONFIRM]

CAREERS AT VERTIS (white)
├── H2: Work at Vertis
├── Distinct from consultant roles — internal hiring
└── [See internal openings]

CTA BAND (ink) ★

FOOTER
```

## 8.11 Contact — `/contact/`

```text
HEADER · BREADCRUMB

HERO (compact, ink)
├── H1: Talk to Vertis
└── Sub: Tell us which applies and we'll route you to the right person.

INTENT SELECTOR (white) — 4 large radio cards
├── ⬢ I need to hire technology talent      → employer form
├── ⬢ I'm looking for a role                → candidate options
├── ⬢ Partnership or supplier enquiry       → partner form
└── ⬢ Something else                        → general form
    └── selecting one reveals the matching form inline
        (no page reload — preserves context and momentum)

DYNAMIC FORM (mist)
└── fields swap by intent; see §14

OFFICES (white)
├── United States — address · phone · [CONFIRM]
└── India — address · phone · [CONFIRM]

DIRECT CONTACTS (mist)
├── Staffing enquiries — info@vertisglobal.com
├── Candidate support  — [CONFIRM]
└── Media / partnerships — [CONFIRM]

RESPONSE COMMITMENT (white)
└── Employer enquiries: 1 business hour · Candidates: 2 business days

FOOTER
```

## 8.12 Insights hub, article and case study

```text
/insights/                          /insights/[slug]/              /case-studies/[slug]/
─────────────────────────────       ─────────────────────────      ─────────────────────────
HEADER · BREADCRUMB                 HEADER · progress bar          HEADER · BREADCRUMB
HERO: Staffing intelligence         BREADCRUMB                     HERO (ink)
FEATURED (1 large card)             ├── Type · Category            ├── Industry · Capability
FILTER: type · category ·           ├── H1                         │   · Delivery model tags
  capability · industry             ├── Deck (1–2 sentences)       ├── H1: the outcome
GRID: 9 cards (3×3)                 ├── Author · date · read time  └── 3 headline metrics
  ├── after row 1: newsletter       ARTICLE BODY (7 cols)          ─────────────────────────
  └── after row 2: gated report     ├── ~1,200–2,000 words         THE CHALLENGE (white)
LOAD MORE                           ├── H2/H3 structure            THE APPROACH (mist)
NEWSLETTER BAND                     ├── pull quotes, data blocks   └── incl. delivery model
FOOTER                              └── inline CTA at ~60% depth      and vetting applied
                                    STICKY RAIL (4 cols)           THE OUTCOME (white)
                                    ├── Table of contents          └── metrics + 18-month view
                                    ├── Share                      CLIENT QUOTE (ink)
                                    └── Related capability CTA     CAPABILITIES USED (mist)
                                    AUTHOR CARD                    RELATED CASE STUDIES
                                    RELATED ARTICLES (3)           CTA BAND ★
                                    CTA BAND ★                     FOOTER
                                    FOOTER
```

## 8.13 Location page — `/locations/[country]/[city]/`

```text
HEADER · BREADCRUMB: Home / Locations / United States / Dallas

HERO (ink)
├── H1: Technology Staffing in Dallas, TX
├── Sub: local market framing + delivery options
└── [Request Talent] ★  [View N Dallas roles]

LOCAL MARKET CONTEXT (white)
└── 150–250 words of genuinely local content: dominant industries,
    hiring conditions, common role demand
    ── This is the section that determines whether the page ranks or
       is treated as doorway content. It must be written, not templated.

CAPABILITIES IN THIS MARKET (mist)
└── 5 capability chips with local role counts

OPEN ROLES IN DALLAS (white) ← dynamic
└── 6 JobCards + [View all N →]

DELIVERY FROM THIS LOCATION (mist)
└── Onshore presence · offshore support · hybrid applicability

LOCAL OFFICE (white)  [only where a real office exists]
└── Address · phone · map link · [LocalBusiness schema]

INDUSTRIES IN THIS MARKET (mist)

CTA BAND (ink) ★

FOOTER
```

---

# 9. Job Search UX

## 9.1 Search architecture

**Two entry points, one result surface.**
1. Homepage / capability / location hero search → `/jobs?q=&location=`
2. Direct `/jobs/` with the full filter rail

**URL is the state.** Every filter, sort and page writes to the query string via `nuqs`-style URL state (`/jobs?q=snowflake&location=charlotte-nc&type=contract&remote=hybrid&sort=newest&page=2`). This makes searches shareable, back-button-correct, server-renderable and analytics-legible. Filter state must never live only in React state — that breaks sharing, SEO and the back button, and it is the most common failure in job-board builds.

**Rendering.** The results page is server-rendered on first load (SEO + fast LCP), then filter changes are client-side with an optimistic loading state and a debounced (300ms) server action. Never a full page reload on filter change.

## 9.2 Filters — final specification

| Filter | Control | Behaviour | Rationale |
|---|---|---|---|
| **Keyword** | Text, autocomplete | Searches title, skills, description (weighted 3:2:1). Suggests skills and titles from a live index | Primary discovery mechanism |
| **Location** | Combobox, hierarchical | Country → state/region → city. Radius option (`within 25/50/100 mi`) for US | Second-most-used filter in every job-search study |
| **Work arrangement** | Segmented: Remote / Hybrid / Onsite | Multi-select | Post-2020 this is the highest-signal filter for candidates. Must be top-3 in the rail |
| **Employment type** | Checkboxes | Contract · Contract-to-Hire · Direct Hire | Core to staffing; contractors and permanent seekers are different people |
| **Capability** | Checkboxes (5) | Maps to practice areas | Aligns candidate browse with the site's IA |
| **Skills** | Searchable multi-select | Top 20 by live-role count + search-all | Technology candidates search by stack, not job title |
| **Experience** | Checkboxes | 0–2 · 3–5 · 6–10 · 10+ years | Reduces mismatched applications, which is a recruiter-time cost |
| **Rate / Salary** | Dual slider + unit toggle | Hourly or annual. Explicit "include roles without a stated rate" toggle, **on by default** | Without the default-on toggle, hiding unspecified-rate roles silently removes a large share of inventory |
| **Date posted** | Radio | 24h · 7d · 14d · 30d · Any | Freshness matters to active seekers |
| **Delivery model** | Checkboxes | Onshore · Offshore · Hybrid | Vertis-specific and genuinely useful — an India-based candidate filters directly to offshore roles |

**Deliberately excluded:** company name (single-employer site), industry (correlates with capability; adds a filter without adding discrimination), "easy apply" (all applications are easy apply).

**Filter UX rules**
- Active filters render as removable chips above the results — visible state prevents the "why are there no results?" dead end.
- Each option shows a live count; zero-count options are disabled, not hidden (hiding causes disorientation).
- Counts update as filters combine.
- `Clear all` always visible when ≥1 filter is active.
- Desktop: rail is sticky with independent scroll, filters apply instantly.
- Mobile: bottom sheet, filters apply on `Show N roles` — batching avoids repeated network round-trips and re-layouts on a small screen.

## 9.3 Job result card

```text
┌────────────────────────────────────────────────────────────┐
│  Senior Data Engineer                             [NEW]  ♡ │
│  ────────────────────────────────────────────────────────  │
│  📍 Charlotte, NC · Hybrid   💼 Contract · 12 months        │
│  💰 $75–95/hr W2                                            │
│                                                            │
│  Snowflake   dbt   Python   Airflow   +3                   │
│                                                            │
│  Build and own the ingestion layer for a modernised         │
│  customer data platform at a Fortune 100 bank…             │
│                                                            │
│  Posted 3 days ago · VG-2026-4471          View role →     │
└────────────────────────────────────────────────────────────┘
```

**Design decisions**
- **The entire card is a link**; the save heart and skill chips are nested interactive elements with `stopPropagation`.
- **Rate is always shown** — either a range or the explicit string `Rate on application`. A blank rate field reads as concealment and depresses click-through.
- **Skill chips are the highest-value scan element** for a technology candidate — more so than the excerpt. They sit above the excerpt for this reason.
- **Two-line excerpt, clamped** with `line-clamp-2`. Fixed card height prevents a ragged grid.
- **Job ID visible** — an authenticity signal, and it lets candidates reference a role in email.
- **`[NEW]` badge** under 7 days; `[URGENT]` optional, admin-controlled, capped at 10% of live roles so it retains meaning.
- **Hover:** border darkens, 1px lift, title takes accent colour. No shadow bloom.

## 9.4 Pagination vs infinite scroll

**Decision: numbered pagination, 20 per page.**

| | Pagination | Infinite scroll |
|---|---|---|
| SEO | Crawlable, indexable facets | Content invisible to crawlers without extra work |
| Footer access | Reachable | Effectively unreachable |
| Back button | Returns to correct page | Notoriously loses position |
| Sense of progress | "Page 3 of 11" | None — measurably increases fatigue |
| Screen readers | Predictable landmarks | Disorienting |

Job search is a **task with a completion state**, not a feed. Pagination is correct. A `Load more` button is acceptable on mobile as a middle ground — it preserves the back button and footer access while reducing taps — but the paginated URLs must still exist and be crawlable.

**Implementation:** `rel="next"`/`rel="prev"` hints, self-referencing canonicals per page, `?page=` in the URL, page 1 canonical without the parameter.

## 9.5 Sorting

Three options, in this order: **Most relevant** (default when a keyword is present) · **Newest** (default when no keyword) · **Rate: high to low** (roles without a stated rate sort last, never hidden).

Rejected: "Best match" as a distinct AI-scored option — at MVP this is unexplainable to the user and invites bias questions. Relevance is a transparent, weighted text score.

## 9.6 Saved jobs and alerts

**Saved jobs, anonymous-first.** A save writes to `localStorage` immediately and, if authenticated, syncs to the database. On the third save, a non-blocking inline prompt appears: *"Save these across devices? Create an account in 20 seconds."* Never a modal, never blocking. The `♡` state must persist across search and detail pages within a session.

**Job alerts as the primary re-engagement mechanism.** Any executed search can be saved as an alert. Alerts capture email + the full filter set and send daily or weekly digests. Alert creation requires only an email and a double opt-in confirmation — no account.

**Placement:** inline after result 5 (contextual, when the candidate has seen enough to judge relevance), in the empty state (highest-intent moment), and on the job detail CTA band.

## 9.7 Empty and edge states

| State | Treatment |
|---|---|
| **No results** | Name the cause: *"No roles match all 5 filters."* Offer: remove the narrowest filter (named explicitly), broaden location, view related skills. Then: `Create an alert for this search` and `Submit your resume` |
| **No results, no filters** (zero live jobs) | Never show an empty board. Show the resume-submission path, capability pages and the alert signup |
| **Slow load** | Skeleton cards matching final dimensions exactly — zero CLS |
| **Error** | Retryable message with the search preserved; never lose the query |
| **Expired job** | Do not 404. Serve a `410 Gone` with a page explaining the role has closed, plus 3 similar live roles. Protects the Google Jobs relationship and captures the traffic |

---

# 10. Job Application UX

## 10.1 The core problem

Industry-average application completion is roughly 35–40%, and it is worse on mobile. Every abandoned application is a sourcing cost Vertis pays twice. The design target is **65%+ completion**, achieved by removing typing rather than by shortening the form arbitrarily.

## 10.2 Decision: three steps, resume-first

**Multi-step, not single-page.** A single page showing 22 fields produces immediate abandonment on mobile — the scroll length itself is the signal that discourages. Three steps with a progress indicator show a finite, near-complete task at every moment.

**Resume-first, not form-first.** This is the highest-impact decision in the flow. The candidate uploads once; parsing prefills 8–12 fields; step 2 becomes *confirmation* rather than *data entry*. Confirming prefilled data is dramatically faster and psychologically lighter than typing it.

**No account required.** Forced registration before applying is the single largest drop-off cause in candidate funnels. An account is offered *after* submission, prefilled from the application, as a one-click upgrade.

## 10.3 Step definition and field rules

| Step | Fields | Required | Rationale |
|---|---|---|---|
| **1 — Resume** | Resume file, or LinkedIn, or manual entry | Resume (or manual path) | One decision, one action. The lightest possible first commitment |
| **2 — Confirm details** | Name, email, phone, location, current title, years experience, skills, LinkedIn | Name, email, phone, location, years experience | All prefilled. LinkedIn, title optional |
| **3 — Role questions** | Work authorization, sponsorship, availability, expected rate, notes, consent | Work auth, sponsorship, availability, consent | Legally and operationally necessary; only 4 real inputs |

**Field-count discipline.** Every field must justify itself against "does a recruiter act on this in the first 48 hours?" Cut at MVP: address line, postcode, referral source, education history, employment history (the resume has it), cover letter, salary history (illegal to ask in many US states), date of birth, gender/ethnicity (voluntary EEO collection, if required, is a separate post-submission optional step with a clear legal notice — never mixed into the application).

**Rate/salary expectation is optional.** Making it mandatory loses candidates who don't want to anchor first. Optional and clearly labelled, it is still supplied by a majority.

## 10.4 Resume parsing

**Flow.** Upload → immediate optimistic UI (`Reading your resume…`, skeleton of the step-2 fields) → parse (2–4s) → prefill → `We found your details. Check them on the next step.`

**Failure handling is mandatory.** Parsing fails on scanned PDFs, unusual layouts and some non-Latin scripts. On failure or low confidence, never block: show `We couldn't read that automatically — please fill in a few details` and present step 2 empty but pre-focused. **The resume is stored regardless of parse success.** A parse failure must never cost an application.

**Confidence handling.** Low-confidence fields are prefilled but visually marked with a subtle accent underline and a `Check this` hint, drawing the eye to what needs correcting.

## 10.5 Validation and error handling

| Rule | Implementation |
|---|---|
| **Validate on blur, not on keystroke** | Real-time character-level errors while typing are hostile |
| **Re-validate on change once errored** | After a field has failed, live feedback confirms the fix immediately |
| **Errors inline, adjacent to the field** | Never a summary banner alone |
| **Errors say what to do** | "Enter a phone number including country code, e.g. +1 704 555 0142" — not "Invalid input" |
| **Accessible errors** | `aria-invalid="true"`, `aria-describedby` pointing at the error, `role="alert"`, error text is never colour-only — it carries an icon and text |
| **Step gate** | `Continue` blocked only by *required* fields on the current step; focus moves to the first error, which is announced |
| **File validation before upload** | Type and size checked client-side, with the reason stated: "That file is 14MB. The limit is 10MB." |
| **Server-side validation always** | Zod schema shared between client and server. Client validation is UX; server validation is the security boundary |

## 10.6 Drop-off reduction — the full list

1. **No account gate.** Apply, then optionally create an account.
2. **Resume parse prefill.** Removes ~12 fields of typing.
3. **LinkedIn as an alternative entry.** For candidates without a resume to hand on mobile.
4. **Three steps, visible progress, honest time estimate** (`About 3 minutes`). An accurate estimate materially improves start rate.
5. **Auto-save per step.** Progress persists in `sessionStorage` and, once an email is captured, server-side as a draft.
6. **Abandoned-application recovery.** If email is captured at step 2 and the flow is abandoned, a single reminder email after 24 hours with a resume link. One email only, with an unsubscribe.
7. **Mobile file upload done properly.** Native file picker plus cloud-storage sources; 56px tap target; clear post-selection state showing filename and size.
8. **No CAPTCHA challenge.** Invisible bot protection (Cloudflare Turnstile) with a challenge only on a high risk score. Visible CAPTCHAs cost real completions.
9. **Persistent role context.** The job title stays in the header throughout so the candidate never loses track of what they are applying for.
10. **Exit intent handled honestly.** Closing mid-flow shows one dismissible inline confirmation offering to email a resume link. No dark patterns, no repeated modals.
11. **Consent is clear and singular.** One required consent checkbox with the retention period stated inline. Buried or bundled consent is both a GDPR violation and a trust cost.
12. **Every field on mobile has the right keyboard.** `inputmode="email"`, `inputmode="tel"`, `autocomplete` tokens on every field.

## 10.7 Success experience

Reached at `/jobs/[slug]/apply/success` (a real URL, so the conversion is trackable and the back button is safe).

Contains: confirmation with a reference ID · a three-step "what happens next" with a real timeframe · the recruiter's name, photo and direct email · the no-sharing-without-permission promise · three similar roles · alert and account-creation offers.

**The recruiter card here is the highest-trust element in the entire candidate journey** — it converts an anonymous submission into a relationship and measurably reduces "did that go anywhere?" support email.

## 10.8 Email sequence

| Email | Timing | Purpose |
|---|---|---|
| **Application confirmation** → candidate | Immediate | Reference ID, role, what happens next, recruiter contact, withdrawal link |
| **New application** → recruiter | Immediate | Candidate summary, parsed highlights, resume link, direct actions |
| **Daily digest** → recruiter | 08:00 local | All applications in the last 24h, grouped by requirement |
| **Status update** → candidate | On admin status change | Under review / shortlisted / not progressing. **Every candidate gets a closing email.** Non-response is the most-cited candidate complaint in the industry and the cheapest reputational fix available |
| **Abandoned application** → candidate | +24h, once | Resume link |
| **Alert digest** → subscriber | Daily or weekly | Matching roles |

All transactional email is React Email templates sent via Resend, with plain-text alternates, a real reply-to (the recruiter), SPF/DKIM/DMARC configured, and one-click unsubscribe on anything non-transactional.

## 10.9 Candidate database integration

Every submission writes: `candidates` (upsert on email — a returning candidate is matched, not duplicated) · `applications` · `resumes` (versioned; a new resume is a new version, never an overwrite) · `candidate_skills` (from parsing) · `activity_log`.

Deduplication is on normalised email, with a secondary fuzzy check on name + phone that surfaces likely duplicates to a recruiter for merge rather than merging automatically.


---

# 11. Employer UX

## 11.1 The employer journey

```
AWARENESS          CONSIDERATION            EVALUATION           CONVERSION        POST
─────────          ─────────────            ──────────           ──────────        ────
Google search      Capability page          Vetting Process      Request Talent    Confirmation
Referral       →   Delivery Models      →   Engagement Model  →  or Book a call →  Account mgr
LinkedIn           Industry page            Compliance           Direct email      call in 1 hr
Deck / RFP         Case studies             Testimonials                           Profiles 48–72h
```

**Critical insight.** The enterprise buyer does not convert on the first visit. Typical B2B staffing evaluation involves 3–6 sessions across 2–5 weeks, often by different people in the same organisation. The site must therefore serve **two distinct modes**:

- **Fast mode** (Dana, urgent req): homepage → capability page → Request Talent. Three pages, under four minutes. Everything must be answerable without a call.
- **Slow mode** (Marcus/Ben, vendor evaluation): every objection needs a dedicated, linkable, quotable page. This is why Vetting Process, Engagement Model and Compliance exist as standalone URLs — they get forwarded internally and cited in vendor scorecards.

Designing only for fast mode loses enterprise deals. Designing only for slow mode loses urgent reqs. The IA in §5 serves both.

## 11.2 Hire Talent page — section rationale

Full wireframe in §8.5. The reasoning behind the section order:

| Section | Why it sits here |
|---|---|
| **Hero** | State the promise and the differentiator in one screen |
| **Hiring challenges** | Problem-mirroring before solution-selling. The buyer must feel understood before they will evaluate. Each of the four challenges maps to a persona: 60-day req (Dana), 15 people (Priya), budget (Priya), 20 resumes (Marcus) |
| **Engagement models** | The buyer's first structural question: *how* do we work together? |
| **Delivery models** | The differentiator, placed immediately after engagement models because together they define the commercial shape |
| **Capabilities** | Only now — *what* — because a buyer who has not accepted the model does not care about the stack |
| **Vetting** | The primary objection ("how do I know they're good?") answered directly after capability claims |
| **Speed & commitments** | Converts the "everyone says they're fast" sceptic with four contractual specifics |
| **Industries** | Contextual credibility |
| **Case studies + testimonials** | Third-party proof after all first-party claims |
| **Compliance** | Procurement's gate. Late, because only Ben reads this far — but its absence kills deals silently |
| **FAQ** | Catches residual objections; earns `FAQPage` rich results |
| **CTA band** | Final conversion |

## 11.3 Request Talent form — field specification

| Field | Required | Type | Why |
|---|---|---|---|
| **Role title** | ✅ | Text, autocomplete from role taxonomy | Without it there is no requirement. Autocomplete normalises input for routing |
| **Capability area** | ✅ | Select (5) | Routes to the correct delivery team immediately. Single highest-value routing field |
| **Key skills** | ✅ | Chip multi-select + free text | Determines whether the bench already contains matches — drives the 48hr promise |
| **Number of positions** | ✅ | Select (1 / 2–5 / 6–10 / 11–25 / 25+) | Sizes the opportunity and routes 25+ to leadership. A range, not a number — buyers often don't know exactly |
| **Employment type** | ✅ | Select | Contract / C2H / Direct Hire have different commercial models |
| **Delivery model** | ✅ | Radio + **"Not sure — advise me"** | Vertis's differentiator, surfaced as a question. The "not sure" option is deliberate: it converts uncertainty into a consultative conversation instead of an abandoned form |
| **Location** | ✅ | Text/combobox | Determines onshore feasibility and compliance |
| **Timeline** | ✅ | Select (Immediate / 2–4 wks / 1–3 mo / Planning) | Prioritises the queue. "Planning" leads route to nurture, not to an account manager — this alone protects sales capacity |
| **Additional detail** | ⬜ | Textarea | Where good requirements actually get written |
| **Full name** | ✅ | Text | |
| **Work email** | ✅ | Email, business-domain validated | Free-domain submissions are deprioritised, not rejected |
| **Company** | ✅ | Text | Enrichment and dedupe key |
| **Job title** | ✅ | Text | Seniority determines routing |
| **Phone** | ⬜ | Tel | Optional — mandatory phone measurably reduces B2B form completion, and email is sufficient for first contact |
| **Company size** | ⬜ | Select | Segmentation |
| **Consent** | ✅ | Checkbox | Lawful basis for contact |

**Two steps, requirement first.** Asking for the requirement before contact details is deliberate and counter-intuitive: it front-loads the part the buyer finds useful and back-loads the part that feels like a cost. It also means a step-1 abandon still yields analytics on demand, and once step 2 begins the sunk-cost effect works in favour of completion.

**Total required fields: 12.** That is more than a typical B2B form, and it is correct here — a staffing requirement genuinely needs this to be actionable, and each field visibly serves the buyer's own outcome (faster, better-matched profiles). The trust rail states this explicitly.

## 11.4 Lead routing

```
SUBMISSION
    │
    ├── spam / bot score check ──────────────► quarantine queue
    │
    ├── enrichment (company domain → size, industry)
    │
    ├── SCORING
    │   ├── positions 11+           → +30
    │   ├── timeline immediate/2–4w → +25
    │   ├── enterprise email domain → +20
    │   ├── seniority (Dir/VP/C)    → +15
    │   ├── known target industry   → +10
    │   └── free email domain       → −20
    │
    ├── ROUTING
    │   ├── score ≥ 60  → Enterprise account manager · Slack alert · 1hr SLA
    │   ├── score 30–59 → Regional account manager  · email · 4hr SLA
    │   ├── score < 30  → Nurture sequence · weekly review
    │   └── timeline = "Planning" → nurture regardless of score
    │
    └── WRITE: leads table · CRM sync · confirmation email · Slack notification
```

## 11.5 Employer trust mechanics

Every employer page carries at least three of: quantified metrics, the four-stage vetting process, named client outcomes, the replacement guarantee, a named account-management model, compliance posture, response-time commitment.

**Downloadable capability overview** is the highest-value secondary conversion. It captures leads earlier than Request Talent, and it is what gets forwarded internally to the people who actually decide. Gated behind name + work email + company only — three fields, no more.

---

# 12. Solutions Architecture

## 12.1 The three-axis problem

Most staffing sites conflate three orthogonal things into one "Services" menu, which confuses buyers and creates keyword cannibalisation. Vertis separates them:

| Axis | Question it answers | Pages |
|---|---|---|
| **Engagement model** | How do we work together? | Staff Augmentation · Team Deployment · Project-Based Staffing |
| **Hiring type** | What is the commercial arrangement? | Contract · Contract-to-Hire · Direct Hire |
| **Capability** | What technology do we staff? | Data · Cloud · ERP · AI · AppDev & QA |
| **Delivery model** | Where does the work happen? | Onshore · Offshore · Hybrid *(one combined page)* |

## 12.2 What ships, and when

| Page | Phase | Justification |
|---|---|---|
| `/solutions/` hub | MVP | Navigational + explains the three axes |
| `/solutions/staff-augmentation/` | **MVP** | The deck's "most common" model. Highest search volume of the three |
| `/solutions/team-deployment/` | **MVP** | Differentiates from single-contractor vendors; targets Priya |
| `/solutions/project-based-staffing/` | **MVP** | Higher-margin, outcome-based work |
| `/solutions/delivery-models/` | **MVP** | The single biggest differentiator on the site |
| `/solutions/contract-staffing/` | Phase 2 | High search volume but generic; covered as a hub section at MVP. Promote when we have ranking data |
| `/solutions/contract-to-hire/` | Phase 2 | Same |
| `/solutions/direct-hire/` | Phase 2 | Same |
| ~~`/solutions/executive-search/`~~ | **Not building** | Vertis is a technology staffing firm with a consultant bench. Executive search is a different business with a different fee model and delivery motion. Claiming it dilutes the positioning and invites requirements Vertis cannot fill well |
| ~~`/solutions/managed-services/`~~ | **Not building at MVP** | Project-Based Staffing covers the adjacent need. A true MSP/RPO offering is a service-line decision, not a web page. Revisit if the business launches it |
| ~~`/solutions/professional-staffing/`~~ | **Not building** | Outside the technology positioning. Would compete with Robert Half on their home turf and win nothing |

**This is the most important scope decision in the document.** Nine solution pages would produce nine thin, mutually cannibalising pages. Four strong pages at MVP, each with genuine depth, will outrank and outconvert them.

## 12.3 Solution page template

Every solution page follows the same nine-block structure (wireframe in §8.7). Applied to the three engagement models:

### `/solutions/staff-augmentation/`
- **H1:** Staff Augmentation
- **Sub:** Vetted individual contributors embedded in your teams, reporting to your leads, ramped in days.
- **When it makes sense:** a named skill gap · a team that needs capacity, not management · a project with an internal owner already in place
- **How it works:** Requirement intake → 2–3 vetted profiles in 48–72hrs → your interview → onboarding in 10 business days → embedded delivery with account-manager check-ins
- **You control / We manage:** *You:* direction, priorities, process, tooling, performance feedback. *We:* sourcing, vetting, employment, compliance, payroll, replacement, account management
- **Delivery:** all three models available
- **Commercial:** hourly T&M, tiered rate card by geography and seniority

### `/solutions/team-deployment/`
- **H1:** Team Deployment
- **Sub:** Full squads with a technical lead — assembled, coordinated and delivering against your milestones, with full visibility retained by you.
- **When it makes sense:** a workstream needing 4+ people · no internal capacity to manage individuals · a program with fixed milestones
- **You control / We manage:** *You:* milestones, acceptance, architecture direction, visibility into every team member. *We:* team composition, internal coordination, the technical lead, velocity reporting
- **Differentiator to stress:** you retain full visibility — this is not a black box

### `/solutions/project-based-staffing/`
- **H1:** Project-Based Staffing
- **Sub:** Outcome-scoped engagements with defined deliverables, fixed timelines and accountability at the team level.
- **When it makes sense:** a well-defined scope · a fixed budget · an outcome that can be specified in advance
- **Honest caveat, stated on the page:** *if scope is likely to change, Team Deployment is usually the better fit.* Saying this builds more trust than it costs in leads, and it prevents the failed engagements that come from mis-sold fixed scope
- **Commercial:** SOW, milestone-based

### `/solutions/delivery-models/` — the flagship

- **H1:** Onshore. Offshore. One standard.
- **Sub:** Every consultant clears the same four-stage vetting process, whether they sit in Dallas or Hyderabad. What changes is your cost structure — not your quality bar.

Full comparison table:

| | Onshore (US) | Offshore (India) | Hybrid |
|---|---|---|---|
| **Best for** | Leadership, client-facing, clearance-eligible roles | Scale ramps, sustained support, cost optimisation | Large programs needing both |
| **Timezone** | Same-timezone collaboration | Round-the-clock with defined overlap | Onshore leads, offshore execution |
| **Onsite presence** | Available | Remote | Onshore leads onsite as needed |
| **Ramp speed** | Days | Rapid team ramps at scale | Phased |
| **Security clearance** | Eligible roles available | Not applicable | Onshore layer only |
| **Cost structure** | Standard tier | Significant advantage | Blended |
| **Compliance** | Full US labour and tax compliance | Indian entity, contracts, IP assignment | Both, managed by Vertis |

Then: a dedicated section on **why the quality claim is credible** — the identical four-stage process, the same technical assessments, the same background verification standard, the same replacement guarantee. This section must do real work; it is answering the industry's most entrenched objection.

Then: hybrid detail (onshore lead paired with offshore execution, with a concrete team-shape diagram), a case study, an FAQ addressing offshore concerns directly, and the CTA.

---

# 13. Industry Architecture

## 13.1 Which industries ship

**Five at MVP.** Selection criteria: (a) real Vertis delivery history, (b) genuine technology-staffing demand, (c) a defensible amount of sector-specific content.

| Industry | Ship | Rationale |
|---|---|---|
| **Financial Services & Insurance** | ✅ MVP | Largest enterprise technology-staffing spend. Heavy data/cloud modernisation. Regulated — favours vetted vendors |
| **Healthcare & Life Sciences** | ✅ MVP | High demand, high compliance barrier (HIPAA, GxP, validation) which favours specialist vendors. Distinct from clinical staffing — the page must make that distinction explicit |
| **Manufacturing & Industrial** | ✅ MVP | Strong ERP/SAP demand — directly matches the ERP capability. IT/OT convergence is a real, current hiring driver |
| **Retail & Consumer** | ✅ MVP | Data, cloud and commerce platform demand. Cost-sensitive, which suits the hybrid delivery pitch |
| **Energy & Utilities** | ✅ MVP | Grid modernisation and data platforms. Underserved by generalist staffing firms — a genuine opportunity |
| **Technology & Software** | ⬜ Phase 2 | Real demand, but they hire directly and use specialist vendors. Lower conversion per session |
| **Public Sector / Government** | ⬜ Phase 3 | Requires contract vehicles, cleared recruiting infrastructure and FAR compliance. The deck mentions clearance-eligible roles, which is not a public-sector practice. **Do not publish until real capability exists** |
| ~~Professional Services~~ | ❌ | Too vague to write a real page about |
| ~~Engineering (non-IT)~~ | ❌ | Outside Vertis's actual capability set |

## 13.2 Making industry pages rank rather than read as filler

Industry pages are where staffing sites most often produce near-duplicate templated content, which Google treats as low-value. Three rules:

1. **Every industry page needs a section no other page could contain.** The Regulatory & Operating Context block (§8.9) is that section. SOX and PCI-DSS for financial services; HIPAA, GxP and CSV for life sciences; IT/OT convergence and ISA-95 for manufacturing; NERC CIP for energy. This is content only a firm with real sector experience can write.
2. **Role lists must be sector-weighted, not copy-pasted.** A financial services page leads with regulatory reporting data engineers and risk platform developers. Manufacturing leads with SAP PP/MM consultants and MES integration engineers.
3. **Minimum 900 words of genuinely unique content per page**, with at least one sector-specific case study or, if unavailable at launch, a sector-specific insight article linked prominently.

## 13.3 Industry page specification (example)

### `/industries/financial-services/`
- **H1:** Technology Staffing for Financial Services
- **Sub:** Data, cloud and platform consultants who have delivered inside regulated banking, insurance and capital markets environments.
- **Audience:** Technology leaders in banks, insurers, asset managers, fintechs at enterprise scale
- **Hiring challenges:** competition with the buy-side and big tech for the same data talent · regulatory constraints on data handling that rule out most offshore models · legacy-to-cloud migration requiring both mainframe-adjacent and modern-platform skills · audit requirements that make contractor vetting a compliance issue, not just a quality one
- **Roles:** regulatory reporting data engineers · risk platform developers · core banking integration engineers · cloud security engineers (financial services) · Snowflake/Databricks architects · SAS-to-Python migration specialists · QA automation for regulated releases
- **Regulatory context:** SOX controls and change management · PCI-DSS for payment environments · GLBA and data residency · model risk management (SR 11-7) touching AI/ML roles · audit-ready background verification
- **Capabilities applied:** Data & Analytics (primary) · Cloud & Infrastructure (primary) · AI & Automation (growing) · AppDev & QA (secondary)
- **Delivery considerations:** onshore is typically required for production data access; hybrid works well where offshore handles non-production and platform engineering — **this nuance is exactly the kind of specificity that converts, and generalist competitors cannot write it**
- **Proof points:** 3 metrics `[CONFIRM]`
- **CTA:** Request Talent · Secondary: read the financial services case study

The other four industry pages follow the identical structure with sector-specific substance. Full copy is produced in Phase 7 (content production) against this specification.

---

# 14. Content Architecture

## 14.1 Content hub structure

```
/insights/
├── Articles              — hiring trends, market commentary, technical hiring guidance
├── Salary & Rate Guides  — ★ highest-value SEO and lead-gen asset
├── Hiring Guides         — practical how-to for hiring managers
├── Workforce Reports     — ★ gated, research-led, link-earning
└── Career Resources      — candidate-facing (lives under /candidates/resources/,
                             surfaced in /insights/ by tag)
```

**Taxonomy.** Every piece carries: one **type**, one primary **capability** (or "General"), an optional **industry**, and an **audience** (employer / candidate / both). This lets the same content surface contextually on capability, industry and candidate pages — which is what makes a content hub compound rather than accumulate.

## 14.2 The four content types and their jobs

| Type | Job | Funnel | Cadence | Gated |
|---|---|---|---|---|
| **Salary & Rate Guides** | Rank for high-volume rate queries; capture leads from both sides | TOFU → MOFU | 2–4/year, annually refreshed | Summary open, full guide gated |
| **Workforce Reports** | Earn links and citations; establish authority | TOFU | 2/year | Gated |
| **Hiring Guides** | Capture hiring-manager informational intent; link to solutions | MOFU | 1/month | Open |
| **Articles** | Volume, freshness, long-tail, internal linking | TOFU | 2–4/month | Open |
| **Case Studies** | Proof at the evaluation stage | BOFU | 1/quarter | Open |

## 14.3 Why salary guides are the highest-priority content asset

Robert Half built a substantial share of its organic visibility on its annual Salary Guide. The mechanics are worth stating plainly because they justify the investment:

1. **Search volume with commercial intent.** `data engineer contract rate`, `SAP consultant hourly rate`, `devops engineer salary [city]` are searched by both hiring managers building a budget and candidates evaluating an offer — Vertis's exact two audiences, at the exact moment each is most valuable.
2. **Natural link acquisition.** Rate data is cited by journalists, analysts, blogs and internal corporate documents. These are the editorial links that lift domain authority for every commercial page on the site.
3. **Dual-sided lead capture.** A hiring manager downloading a rate guide is budgeting for a hire. A candidate downloading it is evaluating the market. Both are qualified, and both enter nurture.
4. **Annual refresh compounds.** `[Role] Contract Rates 2027` inherits the authority of the 2026 edition through a maintained URL and updated content.
5. **Vertis has proprietary data.** A firm placing consultants across five capabilities and two geographies has real rate data. This is a genuine, defensible content advantage over competitors who aggregate public sources.

**Launch set (Phase 7):** *2026 US Technology Contract Rate Guide* (flagship) · *Data & Analytics Rate Benchmarks* · *Cloud & DevOps Rate Benchmarks* · *Onshore vs Offshore Cost Comparison* (unique to Vertis and directly supports the flagship differentiator).

## 14.4 Editorial calendar — first six months

| Month | Article | Guide/Report | Case study |
|---|---|---|---|
| 1 | What enterprise buyers get wrong about offshore quality | — | Manufacturing SAP + Azure |
| 2 | The 60-day req: why technology roles stall | 2026 US Technology Contract Rate Guide ★ | — |
| 3 | Staff augmentation vs managed teams: choosing correctly | — | Financial services data platform |
| 4 | Hiring for Snowflake: what actually predicts success | Hiring Guide: technology contractor onboarding | — |
| 5 | Contract, C2H or direct hire: a decision framework | — | Retail cloud migration |
| 6 | Enterprise AI hiring: demand vs supply | Workforce Report: enterprise AI talent 2026 ★ | — |

Each article is assigned a primary target keyword, a primary internal-link target (a capability or solution page), and a CTA appropriate to its funnel stage. Content without a defined internal-link target does not get commissioned.

## 14.5 Content-to-conversion mapping

| Content type | In-content CTA | Placement |
|---|---|---|
| Article (employer) | Request Talent, or the relevant capability page | Inline at ~60% scroll depth + end-of-article band |
| Article (candidate) | Browse roles in [capability] | Inline + end |
| Salary guide | Download the full guide (gated) | Hero + inline + exit band |
| Hiring guide | Talk to a staffing expert | End |
| Workforce report | Download (gated) | Hero + end |
| Case study | Request Talent | Sticky rail + end band |

## 14.6 Copy specification for key pages

Written to the voice rules in §4.7. This is the launch copy direction; full production happens in Phase 7.

### Homepage
- **H1:** Vetted technology consultants, delivered in 48 hours.
- **Supporting:** 200+ consultants across data, cloud, ERP, AI and application engineering. Two decades inside Fortune 500 programs. Onshore, offshore, or blended — you choose the model.
- **Section H2s:** Five practice areas. One vetting standard. · Onshore. Offshore. One standard. · What we commit to. · Looking for your next engagement? · Industry context, not just role titles. · What clients and consultants say. · Staffing intelligence. · Tell us what you need. We'll have profiles in 48 hours.

### Hire Talent
- **H1:** Technology talent, vetted and deployed on your timeline.
- **Supporting:** Two to three qualified profiles in 48–72 hours. Onshore, offshore, or blended — under one vetting standard.
- **Intro:** When a technology role stays open, the program slips. We keep pre-vetted consultants across five practice areas so that when a requirement arrives, we are shortlisting rather than starting a search.
- **Section H2s:** The problems we're usually called in to solve. · Three ways to engage. · Onshore. Offshore. One standard. · What we staff. · Two to three profiles. Not twenty resumes. · What we commit to. · Where we've delivered. · The paperwork, handled.

### Vetting Process
- **H1:** Two to three profiles. Not twenty resumes.
- **Supporting:** Every consultant clears four stages before you see them — technical, domain, communication and background.
- **Intro:** Submitting twenty resumes and hoping one lands is not a process; it is a transfer of work from the vendor to the client. We do the filtering first.
- **Section H2s:** Four stages, every consultant. · The same standard in every geography. · What happens if it doesn't work out. · Why we submit fewer candidates.

### Delivery Models
- **H1:** Onshore. Offshore. One standard.
- **Supporting:** Choose your cost structure. Keep your quality bar.
- **Intro:** Most staffing firms sell you a geography. We sell you the choice — because the right answer depends on the role, the data, the timezone and the budget, and it changes across a program.
- **Section H2s:** Three models, one vetting process. · Onshore (US). · Offshore (India). · Hybrid: onshore leadership, offshore execution. · Why the quality claim holds. · Compliance in both geographies.

### Candidates hub
- **H1:** Technology roles at the companies you have heard of.
- **Supporting:** Contract, contract-to-hire and permanent roles across data, cloud, ERP, AI and application engineering.
- **Intro:** You will talk to a recruiter who understands the role — not a chatbot and not a keyword matcher. Most candidates hear back within two business days.
- **Section H2s:** How our process works. · Where we're hiring now. · Not the right role yet? · What consultants say about working with us.

### About
- **H1:** The bench behind enterprise delivery.
- **Supporting:** Vertis Global is a technology staffing firm. For two decades our consultants have worked inside the programs Fortune 500 companies cannot afford to get wrong.
- **Section H2s:** How we got here. · Where we are today. · Our operating principles. · Where we operate. · Leadership.

### Request Talent
- **H1:** Tell us what you need.
- **Supporting:** Most requirements get profiles within 48–72 hours.
- **Micro-copy above submit:** A dedicated account manager reviews every requirement. You will hear from a person, not an autoresponder.

### Submit Resume
- **H1:** Join the Vertis bench.
- **Supporting:** No role that fits right now? Send us your resume and we'll contact you when one opens.
- **Intro:** We keep pre-vetted consultants across five practice areas. When a requirement lands that matches your background, you are already on the shortlist.

## 14.7 Editorial governance

- **Every page has a named owner and a review date.** Capability and industry pages reviewed quarterly; salary guides annually; legal pages on regulatory change.
- **The banned-phrase list (§4.7) is enforced in the CMS** as a soft warning on publish.
- **No page publishes without:** a title tag under 60 characters, a meta description of 140–160 characters, an H1 that is not identical to the title tag, at least two internal links, and alt text on every image.
- **Every statistic carries a source or a `[CONFIRM]` flag** that blocks publication until cleared.


---

# 15. Backend Architecture

## 15.1 Recommended stack

| Layer | Choice | Why this, not the alternatives |
|---|---|---|
| **Framework** | **Next.js 16 (App Router)** | One framework for marketing SSG/ISR, dynamic job pages, API routes and the admin SPA. Continuity with your ACI build. Server Components cut client JS materially, which is what protects Core Web Vitals on content-heavy pages |
| **Language** | **TypeScript (strict)** | Non-negotiable at this scale. `strict: true`, `noUncheckedIndexedAccess: true` |
| **Styling** | **Tailwind CSS v4** + CSS custom properties for tokens | Matches your existing system. v4's CSS-first `@theme` config maps cleanly onto the token architecture in §22 |
| **UI primitives** | **Radix UI** (headless) + custom components | Accessibility for dialogs, comboboxes, tabs, accordions is genuinely hard. Radix solves it correctly. We style everything ourselves so nothing looks off-the-shelf |
| **Icons** | **Lucide**, stroke-width 1.5 | Your existing convention. Tree-shaken per-icon imports |
| **Animation** | **Motion** (Framer Motion successor) | Already in your stack. Used sparingly — see §23 |
| **Forms** | **React Hook Form + Zod** | Your existing stack. Zod schemas shared client/server is the key benefit |
| **Database** | **PostgreSQL 16** | Relational data with genuine relational integrity. Full-text search, JSONB, `pgvector`, and mature indexing all in one engine |
| **ORM** | **Drizzle ORM** | Type-safe, SQL-transparent, near-zero runtime overhead. Prisma's engine adds cold-start latency that matters on serverless. Drizzle also lets us drop to raw SQL for the search queries without leaving the type system |
| **CMS** | **Payload CMS 3** (embedded in the Next app) | See §15.6 — this is the significant architectural decision |
| **Auth** | **Payload auth**, extended with role-based access | One auth system for admins, recruiters and candidates. Avoids the two-auth-system trap |
| **File storage** | **Cloudflare R2** (S3-compatible) | No egress fees, S3 API compatibility, cheap at resume volume. Alternative: Supabase Storage if you prefer consolidating with your ACI setup |
| **Search** | **Postgres FTS** (`tsvector` + GIN) + `pg_trgm` | See §15.5 |
| **Email** | **Resend + React Email** | Templates as React components, versioned in the repo. Strong deliverability |
| **Hosting** | **Vercel** | Native Next.js, edge network, ISR, image optimisation. Continuity with your ACI deployment |
| **Database hosting** | **Neon** (serverless Postgres, branching) | Branch-per-preview-deploy is genuinely valuable. Alternative: Supabase if consolidating |
| **Bot protection** | **Cloudflare Turnstile** | Invisible, privacy-preserving, no completion cost |
| **Monitoring** | **Sentry** + **Vercel Analytics** | Errors and Core Web Vitals from real traffic |
| **Rate limiting** | **Upstash Redis** | Serverless-native, needed for API and form abuse protection |

## 15.2 Application architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                          CLIENT                                     │
│  Browser  ·  React Server Components  ·  minimal client bundles     │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                     VERCEL EDGE / CDN                               │
│  Static assets · ISR cache · image optimisation · edge middleware   │
└───────────────────────────────┬─────────────────────────────────────┘
                                │
┌───────────────────────────────▼─────────────────────────────────────┐
│                     NEXT.JS APPLICATION                             │
│                                                                     │
│  ┌── (marketing) ──────┐  ┌── (jobs) ────────┐  ┌── (admin) ─────┐ │
│  │  SSG + ISR          │  │  ISR + dynamic   │  │  SSR, auth     │ │
│  │  Home, capabilities │  │  Search, detail  │  │  gated, no     │ │
│  │  industries, about  │  │  apply           │  │  index         │ │
│  └─────────────────────┘  └──────────────────┘  └────────────────┘ │
│                                                                     │
│  ┌── SERVER ACTIONS ───────────┐  ┌── ROUTE HANDLERS (REST) ─────┐ │
│  │  Form submissions           │  │  /api/v1/* public + internal │ │
│  │  Filter mutations           │  │  webhooks, cron, sitemaps    │ │
│  └─────────────────────────────┘  └──────────────────────────────┘ │
│                                                                     │
│  ┌── SERVICE LAYER ────────────────────────────────────────────┐   │
│  │ jobs · applications · candidates · leads · search · email   │   │
│  │ parsing · matching · analytics · storage                    │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
│  ┌── PAYLOAD CMS 3 ────────────────────────────────────────────┐   │
│  │ Collections · admin UI · auth · access control · hooks      │   │
│  └─────────────────────────────────────────────────────────────┘   │
└──────┬───────────────┬──────────────┬─────────────┬────────────────┘
       │               │              │             │
┌──────▼──────┐ ┌──────▼──────┐ ┌─────▼─────┐ ┌────▼─────────────────┐
│ PostgreSQL  │ │ Cloudflare  │ │  Upstash  │ │ EXTERNAL             │
│ (Neon)      │ │ R2          │ │  Redis    │ │ Resend · Turnstile   │
│             │ │             │ │           │ │ Anthropic API · GA4  │
│ + pgvector  │ │ resumes     │ │ rate      │ │ CRM (Phase 2)        │
│ + FTS       │ │ documents   │ │ limit +   │ │ ATS (Phase 2)        │
│             │ │ media       │ │ cache     │ │                      │
└─────────────┘ └─────────────┘ └───────────┘ └──────────────────────┘
```

## 15.3 Rendering strategy per route

| Route group | Strategy | Revalidation | Why |
|---|---|---|---|
| Marketing pages | **SSG + ISR** | 1 hour, plus on-publish webhook | Fastest possible LCP; content changes rarely |
| `/jobs/` search | **SSR** (dynamic, cached 60s at the edge for unfiltered) | 60s | Must reflect live inventory; filtered views are user-specific |
| `/jobs/[slug]` | **ISR** | 5 minutes, on-demand revalidate on edit/unpublish | SEO-critical; must be fast and fresh. On-demand revalidation on status change is essential so closed roles leave the index quickly |
| Programmatic facets | **ISR** | 1 hour | Volume requires caching |
| `/insights/*` | **SSG + ISR** | 1 hour + on-publish | Content |
| Apply flow | **Client-side, dynamic** | — | Stateful, no caching |
| `/account/*` | **SSR, dynamic, `noindex`** | — | Personalised |
| `/admin/*` | **SSR, auth-gated, `noindex`** | — | Private |

## 15.4 Authentication and roles

Single auth system (Payload), five roles:

| Role | Access |
|---|---|
| `candidate` | Own profile, own applications, saved jobs, alerts. Nothing else |
| `recruiter` | Assigned requirements, applications on those, candidate records, resume access (logged), own job postings |
| `account_manager` | Leads, client records, all jobs, application pipeline visibility |
| `content_editor` | Insights, case studies, testimonials, page content. **No candidate PII access** |
| `admin` | Everything including user management and audit logs |

**Key access rules**
- Candidate PII and resumes are accessible only to `recruiter`, `account_manager` and `admin`. Content editors are explicitly excluded — a content role should never have a reason to open a resume.
- **Every resume access is logged** to `activity_log` with actor, timestamp and candidate ID. This is a GDPR accountability requirement and a genuine internal-misuse control.
- Sessions: httpOnly, secure, sameSite=lax cookies. 7 days for candidates, 12 hours for staff, with rotation on privilege change.
- Staff accounts require 2FA (TOTP) before production launch.

## 15.5 Search architecture

**Decision: PostgreSQL full-text search. Not Elasticsearch, not Algolia, not Typesense.**

Rationale: Vertis has hundreds of live roles, not millions (assumption A7). Postgres FTS with a GIN index answers a filtered, ranked query over that volume in single-digit milliseconds. Adding a separate search service means a second datastore, a sync pipeline, sync-failure modes, and a monthly bill — all to solve a problem that does not exist at this scale.

**Implementation**
```sql
-- Generated, always-in-sync search vector with field weighting
ALTER TABLE jobs ADD COLUMN search_vector tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('english', coalesce(title,'')), 'A') ||
    setweight(to_tsvector('english', coalesce(skills_text,'')), 'B') ||
    setweight(to_tsvector('english', coalesce(description,'')), 'C') ||
    setweight(to_tsvector('english', coalesce(location_text,'')), 'D')
  ) STORED;

CREATE INDEX jobs_search_idx    ON jobs USING GIN (search_vector);
CREATE INDEX jobs_title_trgm    ON jobs USING GIN (title gin_trgm_ops);  -- typo tolerance
CREATE INDEX jobs_filters_idx   ON jobs (status, employment_type, work_arrangement, capability_id, posted_at DESC);
CREATE INDEX jobs_location_idx  ON jobs (country_code, region_code, city);
```

Ranking: `ts_rank_cd` weighted score, boosted by recency (roles under 7 days get a multiplier) and by `featured`. Trigram matching provides typo tolerance (`snowfalke` → `snowflake`) and drives autocomplete.

**Migration trigger, stated in advance:** move to Typesense or Elasticsearch when live jobs exceed ~25,000, or when p95 search latency exceeds 200ms. Not before.

**Semantic search (Phase 2)** uses `pgvector` in the same database — job and resume embeddings for "similar roles" and match scoring. Same engine, no new infrastructure.

## 15.6 CMS decision

**Recommendation: Payload CMS 3, embedded in the Next.js application, on the same PostgreSQL database.**

Options evaluated:

| Option | Verdict |
|---|---|
| **Headless SaaS CMS** (Contentful, Sanity) | **Rejected.** Editorial content would live in a separate system from jobs, applications and leads — meaning two admin UIs, two auth systems, network latency on every content fetch, and a monthly bill that scales with API calls. Content and jobs need to reference each other (a case study tagged to a capability that also lists live jobs); cross-system references are painful |
| **WordPress** (headless or otherwise) | **Rejected.** Would require a separate PHP stack and hosting, brings a large security-maintenance burden, and cannot own the recruiting data model |
| **Fully custom admin** | **Rejected as the primary approach.** Building rich-text editing, media management, drafts, previews, versioning and role-based access from scratch is months of work that delivers no competitive advantage |
| **Payload CMS 3, embedded** | **Recommended.** Runs *inside* the Next.js app as a set of routes. Same repository, same deployment, same Postgres, same auth. Defines both editorial collections (posts, case studies) and domain collections (jobs, applications, candidates, leads) in one type-safe schema. Generates a genuinely good admin UI, which we extend with custom React views for the recruiting workflows. No separate bill, no network hop, no sync |

**How the hybrid works in practice.** Payload provides the collection definitions, access control, auth, media handling, versioning and the base admin shell. We then add **custom admin views** for the workflows a generic CMS handles badly: the application pipeline (kanban), the lead queue, the candidate search interface, and the analytics dashboard. This is the right split — off-the-shelf for CRUD, custom for workflow.

**Escape hatch.** If Vertis later adopts a commercial ATS (Bullhorn, Ceipal, JobDiva), the `jobs` and `applications` collections become synchronised projections of the ATS via its API, and the website becomes a presentation and capture layer. The service layer in §15.2 is the seam that makes this swap possible without touching the front end — which is precisely why the service layer exists as a distinct tier.

## 15.7 File storage

| Concern | Approach |
|---|---|
| **Bucket layout** | `resumes/{candidateId}/{resumeId}.{ext}` · `documents/{type}/{id}` · `media/{hash}` |
| **Access** | Resumes are **never** publicly accessible. Served only via short-lived (5-minute) signed URLs generated after an authorisation check |
| **Validation** | MIME type verified by magic bytes, not by extension or client-supplied `Content-Type`. Allowed: PDF, DOC, DOCX. Max 10MB |
| **Malware scanning** | ClamAV via a scanning step before the file is marked available. Files quarantined until clean |
| **Filename handling** | Original filename stored as metadata only; the stored object uses a generated UUID. Prevents path traversal and filename-based attacks |
| **Retention** | Resumes deleted 24 months after last candidate activity, per the stated privacy notice. Automated job, with a 30-day pre-deletion notice email |
| **Versioning** | New resume upload creates a new version; prior versions retained for the retention window |

## 15.8 Email architecture

Transactional email via Resend, templates as React Email components in `emails/`. Every send is logged to `email_log` with type, recipient, status and provider ID for support and deliverability debugging. Webhooks from Resend update delivery/bounce status. Bounced addresses are flagged on the candidate record so recruiters know why they cannot reach someone.

Domain configuration: SPF, DKIM, DMARC on a dedicated subdomain (`mail.vertisglobal.com`) so marketing sends cannot damage transactional deliverability.

## 15.9 Background jobs

| Job | Schedule | Purpose |
|---|---|---|
| Job alert digests | Daily 07:00, weekly Monday | Alert emails |
| Expire stale jobs | Hourly | Auto-close roles past their expiry; trigger revalidation |
| Sitemap regeneration | Every 6 hours | Keep `sitemap-jobs.xml` current |
| Google Indexing API ping | On job publish/close | Faster Google Jobs pickup |
| Resume retention sweep | Daily | GDPR/DPDP compliance |
| Abandoned application reminder | Hourly | Recovery email at +24h |
| Recruiter daily digest | Daily 08:00 | Application summary |
| Analytics rollup | Nightly | Admin dashboard aggregates |
| Search vector reindex | Weekly | Maintenance |

Implemented as Vercel Cron hitting authenticated route handlers, with idempotency keys so a retried invocation cannot double-send.

---

# 16. Database Architecture

## 16.1 Conceptual ER model

```
                       ┌──────────────┐
                       │    users     │  auth root; role discriminator
                       └──────┬───────┘
              ┌───────────────┼────────────────┐
              │               │                │
       ┌──────▼─────┐  ┌──────▼──────┐  ┌──────▼──────┐
       │ candidates │  │ recruiters  │  │   admins    │
       └──────┬─────┘  └──────┬──────┘  └─────────────┘
              │               │
              │        ┌──────┴────────────────────┐
              │        │                           │
              │  ┌─────▼──────┐            ┌───────▼──────┐
              │  │    jobs    │◄───────────┤   clients    │
              │  └─────┬──────┘  optional  └───────┬──────┘
              │        │                           │
              │        │                    ┌──────▼──────┐
              │        │                    │    leads    │
              │        │                    └─────────────┘
              │        │
     ┌────────┴────────┴──────────────────────────────┐
     │                                                │
┌────▼─────────┐  ┌──────────────┐  ┌──────────────┐ │
│ applications │  │  saved_jobs  │  │ job_alerts   │ │
└────┬─────────┘  └──────────────┘  └──────────────┘ │
     │                                                │
     │      ┌─────────────────────────────────────────┘
     │      │
┌────▼──────▼───┐   ┌──────────────────┐   ┌─────────────────┐
│   resumes     │   │ candidate_skills │   │    job_skills   │
└───────────────┘   └────────┬─────────┘   └────────┬────────┘
                             │                      │
                             └──────┬───────────────┘
                                    │
                             ┌──────▼──────┐
                             │   skills    │
                             └─────────────┘

  TAXONOMY                          CONTENT
  ┌──────────────┐                  ┌────────────────┐
  │ capabilities │                  │  posts         │
  │ industries   │                  │  case_studies  │
  │ locations    │                  │  testimonials  │
  │ skills       │                  │  media         │
  │ job_categories│                 │  categories    │
  └──────────────┘                  └────────────────┘

  SYSTEM
  ┌──────────────┐
  │ activity_log │  audit trail — every PII access
  │ email_log    │
  │ form_submissions │
  └──────────────┘
```

## 16.2 Core table definitions

**`users`** — auth root for all account types
`id` uuid PK · `email` citext UNIQUE · `password_hash` · `role` enum(candidate, recruiter, account_manager, content_editor, admin) · `email_verified_at` · `two_factor_secret` · `last_login_at` · `status` enum(active, suspended) · `created_at` · `updated_at`

**`candidates`**
`id` uuid PK · `user_id` uuid FK→users NULLABLE *(null = applied without an account)* · `first_name` · `last_name` · `email` citext INDEXED · `phone` · `city` · `region` · `country_code` · `current_title` · `years_experience` smallint · `linkedin_url` · `work_authorization` · `requires_sponsorship` bool · `availability` · `expected_rate_min/max` numeric · `rate_currency` · `rate_unit` enum(hour, year) · `preferred_delivery_model` · `source` · `status` enum(new, screening, active, placed, inactive, archived) · `consent_given_at` · `consent_withdrawn_at` · `retention_expires_at` · `last_activity_at` · `notes` text · timestamps
*Unique index on `lower(email)`. `retention_expires_at` drives the automated deletion sweep.*

**`resumes`**
`id` uuid PK · `candidate_id` FK · `storage_key` · `original_filename` · `mime_type` · `file_size_bytes` · `version` int · `is_current` bool · `parse_status` enum(pending, success, failed, partial) · `parsed_data` jsonb · `parse_confidence` numeric · `scan_status` enum(pending, clean, infected) · `uploaded_at`
*Never overwritten. `is_current` flags the active version.*

**`jobs`**
`id` uuid PK · `job_code` text UNIQUE *(e.g. VG-2026-4471)* · `slug` UNIQUE · `title` · `description` · `responsibilities` · `requirements` · `preferred_qualifications` · `benefits` · `capability_id` FK · `industry_id` FK NULLABLE · `job_category_id` FK · `client_id` FK NULLABLE · `client_display_name` *(anonymised descriptor)* · `employment_type` enum(contract, contract_to_hire, direct_hire) · `work_arrangement` enum(remote, hybrid, onsite) · `delivery_model` enum(onshore, offshore, hybrid) · `city` · `region_code` · `country_code` · `location_text` · `rate_min/max` numeric · `rate_currency` · `rate_unit` · `rate_disclosed` bool · `duration_months` int · `experience_min/max` int · `work_authorization_required` · `openings` int · `recruiter_id` FK · `status` enum(draft, published, on_hold, filled, closed, expired) · `featured` bool · `urgent` bool · `posted_at` · `expires_at` · `filled_at` · `view_count` · `application_count` · `meta_title` · `meta_description` · `search_vector` tsvector GENERATED · `embedding` vector(1536) NULLABLE · timestamps

**`applications`**
`id` uuid PK · `application_code` UNIQUE · `job_id` FK · `candidate_id` FK · `resume_id` FK · `status` enum(submitted, under_review, shortlisted, submitted_to_client, interviewing, offered, placed, rejected, withdrawn) · `status_changed_at` · `source` enum(direct, google_jobs, linkedin, referral, alert) · `work_authorization` · `requires_sponsorship` bool · `availability` · `expected_rate` numeric · `candidate_notes` text · `recruiter_notes` text *(never exposed to the candidate)* · `rejection_reason` · `match_score` numeric NULLABLE *(Phase 2)* · `assigned_recruiter_id` FK · `submitted_at` · timestamps
*Unique constraint on (`job_id`, `candidate_id`) — prevents duplicate applications, surfaced to the candidate as "You applied to this role on [date]."*

**`leads`** — every employer/partner enquiry
`id` uuid PK · `lead_code` UNIQUE · `lead_type` enum(request_talent, contact_employer, contact_general, partnership, download_gated, newsletter) · `first_name` · `last_name` · `email` · `phone` · `company` · `job_title` · `company_size` · `role_title` · `capability_id` FK NULLABLE · `skills_required` text[] · `positions_count` · `employment_type` · `delivery_model` · `location` · `timeline` enum(immediate, 2_4_weeks, 1_3_months, planning) · `message` text · `score` int · `status` enum(new, contacted, qualified, proposal, won, lost, nurture) · `assigned_to_id` FK · `source_page` · `utm_source/medium/campaign/term/content` · `crm_id` *(external sync)* · `consent_given_at` · timestamps

**`skills`** — controlled vocabulary
`id` · `name` UNIQUE · `slug` UNIQUE · `category` enum(language, framework, platform, tool, methodology, domain) · `capability_id` FK NULLABLE · `aliases` text[] *(snowflake ← snowflakedb)* · `is_featured` bool · `job_count` int *(denormalised, refreshed nightly)*

**Junctions:** `job_skills` (job_id, skill_id, is_required bool) · `candidate_skills` (candidate_id, skill_id, years_experience, source enum(parsed, self_reported, verified), confidence numeric)

**`capabilities`** — the five practice areas
`id` · `name` · `slug` · `description` · `icon` · `platforms` text[] · `roles` text[] · `display_order` · `meta_title` · `meta_description` · `is_active`

**`industries`**, **`job_categories`** — same shape

**`locations`** — SEO location entities
`id` · `type` enum(country, region, city) · `parent_id` self-FK · `name` · `slug` · `country_code` · `region_code` · `latitude` · `longitude` · `has_office` bool · `office_address` · `office_phone` · `local_content` text · `job_count` · `is_indexed` bool *(threshold gate)* · SEO fields

**`recruiters`**
`id` · `user_id` FK · `first_name` · `last_name` · `title` · `email` · `phone` · `photo_media_id` FK · `linkedin_url` · `bio` · `capability_ids` uuid[] · `is_active` · `display_on_site` bool

**`clients`** — for case studies and job attribution
`id` · `name` · `display_name` *(anonymised)* · `logo_media_id` · `industry_id` FK · `logo_consent` bool · `name_consent` bool · `website` · `status`
*The two consent booleans are enforced in the UI: a logo cannot render unless `logo_consent` is true. This makes the §4.8 legal requirement structural rather than procedural.*

**`saved_jobs`** — (candidate_id, job_id, saved_at), unique pair
**`job_alerts`** — `id` · `candidate_id` FK NULLABLE · `email` · `name` · `filters` jsonb · `frequency` enum(daily, weekly) · `is_active` · `confirmed_at` *(double opt-in)* · `unsubscribe_token` · `last_sent_at`

**Content:** `posts` · `case_studies` · `testimonials` · `media` · `categories` — standard CMS shapes with SEO fields, `status` enum(draft, published, archived), `published_at`, author FK, and taxonomy relations to `capabilities` / `industries`.

**`case_studies`** deserves specific fields: `client_id` FK · `challenge` · `approach` · `outcome` · `metrics` jsonb *(array of {label, value})* · `capability_ids` uuid[] · `industry_id` · `delivery_model` · `client_quote` · `client_quote_attribution` · `is_anonymised` bool

**System tables**
`activity_log` — `id` · `actor_user_id` · `action` · `entity_type` · `entity_id` · `metadata` jsonb · `ip_address` · `user_agent` · `created_at`. **Every resume view, every candidate record access, every status change, every export.**
`email_log` — type, recipient, subject, provider_id, status, error, timestamps
`form_submissions` — raw payload capture for every form, retained separately from `leads` so a processing failure never loses a submission

## 16.3 Key relationships

| Relationship | Cardinality | Note |
|---|---|---|
| users → candidates | 1:0..1 | A candidate may exist without a user account |
| candidates → resumes | 1:N | Versioned |
| candidates → applications | 1:N | |
| jobs → applications | 1:N | Unique (job, candidate) |
| jobs → skills | M:N | `is_required` on the junction |
| candidates → skills | M:N | With source and confidence |
| capabilities → jobs | 1:N | |
| recruiters → jobs | 1:N | Owner |
| clients → case_studies | 1:N | |
| locations → locations | 1:N | Self-referential hierarchy |

## 16.4 Indexing strategy

```sql
-- Search and filter (the hot path)
CREATE INDEX jobs_search_idx     ON jobs USING GIN (search_vector);
CREATE INDEX jobs_live_idx       ON jobs (status, posted_at DESC) WHERE status = 'published';
CREATE INDEX jobs_facets_idx     ON jobs (capability_id, employment_type, work_arrangement, country_code)
                                   WHERE status = 'published';
CREATE INDEX jobs_slug_idx       ON jobs (slug);
CREATE INDEX jobs_embedding_idx  ON jobs USING hnsw (embedding vector_cosine_ops);  -- Phase 2

-- Applications and candidates
CREATE INDEX apps_job_status_idx      ON applications (job_id, status, submitted_at DESC);
CREATE INDEX apps_candidate_idx       ON applications (candidate_id, submitted_at DESC);
CREATE UNIQUE INDEX apps_unique_idx   ON applications (job_id, candidate_id);
CREATE UNIQUE INDEX cand_email_idx    ON candidates (lower(email));
CREATE INDEX cand_retention_idx       ON candidates (retention_expires_at) WHERE status != 'archived';

-- Leads
CREATE INDEX leads_triage_idx    ON leads (status, score DESC, created_at DESC);
CREATE INDEX leads_assigned_idx  ON leads (assigned_to_id, status);

-- Audit
CREATE INDEX activity_entity_idx ON activity_log (entity_type, entity_id, created_at DESC);
CREATE INDEX activity_actor_idx  ON activity_log (actor_user_id, created_at DESC);
```

**Partial indexes on `status = 'published'`** are deliberate — the overwhelming majority of queries touch only live jobs, and a partial index is dramatically smaller and faster than a full one.

## 16.5 Data integrity rules

- Foreign keys with explicit `ON DELETE` behaviour: `RESTRICT` for jobs with applications (never silently orphan an application), `CASCADE` for junction tables, `SET NULL` for optional references.
- Check constraints: `rate_min <= rate_max`, `experience_min <= experience_max`, `expires_at > posted_at`.
- A job cannot move to `published` without: title, description, capability, location, employment type, and an assigned recruiter. Enforced in the service layer and mirrored as a database constraint.
- Soft delete (`archived` status) for candidates, jobs and leads. Hard delete only via the GDPR erasure path, which also purges storage objects and writes an audit record.

---

# 17. API Architecture

## 17.1 Conventions

- **Base:** `/api/v1/`. Versioned from day one — retrofitting versioning is painful.
- **Auth:** session cookie for first-party browser calls; `Authorization: Bearer <token>` for server-to-server and future integrations.
- **Responses:** `{ data, meta }` on success; `{ error: { code, message, details } }` on failure. Never leak stack traces or SQL.
- **Status codes** used correctly: 200, 201, 204, 400 (validation), 401 (unauthenticated), 403 (unauthorised), 404, 409 (conflict, e.g. duplicate application), 410 (job closed), 422, 429 (rate limited), 500.
- **Pagination:** `?page=&limit=` with `meta: { page, limit, total, totalPages }`. Max limit 100.
- **Validation:** Zod schemas at every boundary, shared with the client.
- **Rate limiting:** per-IP and per-account, returned as `X-RateLimit-*` headers.

**Note on Server Actions vs REST.** First-party form submissions use Next.js Server Actions (less client JS, automatic CSRF protection, progressive enhancement). The REST endpoints below exist for: the admin SPA, future integrations (ATS/CRM/job boards), webhooks, and cron. Both call the same service layer, so business logic is never duplicated.

## 17.2 Public endpoints

| Method | Endpoint | Purpose | Auth | Rate limit |
|---|---|---|---|---|
| GET | `/api/v1/jobs` | Search/filter jobs. Query: `q, location, radius, capability, skills, type, arrangement, delivery, experience, rateMin, rateMax, postedWithin, sort, page, limit` | Public | 60/min |
| GET | `/api/v1/jobs/:slug` | Single job with skills, recruiter, similar roles | Public | 120/min |
| GET | `/api/v1/jobs/:id/similar` | Similar roles | Public | 60/min |
| GET | `/api/v1/jobs/facets` | Filter option counts for current query | Public | 60/min |
| GET | `/api/v1/jobs/autocomplete` | Title/skill suggestions | Public | 120/min |
| GET | `/api/v1/jobs/count` | Live job count (nav badge) | Public, cached 5min | 300/min |
| POST | `/api/v1/applications` | Submit application (multipart) | Public + Turnstile | 5/hr/IP |
| POST | `/api/v1/resumes/parse` | Parse resume, return structured data | Public + Turnstile | 10/hr/IP |
| POST | `/api/v1/candidates/submit-resume` | General bench submission | Public + Turnstile | 5/hr/IP |
| POST | `/api/v1/leads` | Employer/contact/partnership enquiry | Public + Turnstile | 5/hr/IP |
| POST | `/api/v1/job-alerts` | Create alert (triggers double opt-in) | Public + Turnstile | 5/hr/IP |
| GET | `/api/v1/job-alerts/confirm/:token` | Confirm opt-in | Token | 20/hr |
| DELETE | `/api/v1/job-alerts/:token` | Unsubscribe | Token | 20/hr |
| POST | `/api/v1/newsletter` | Newsletter signup | Public + Turnstile | 5/hr/IP |
| GET | `/api/v1/capabilities`, `/industries`, `/locations`, `/skills` | Taxonomy | Public, cached | 60/min |

## 17.3 Candidate account endpoints (Phase 3)

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| POST | `/api/v1/auth/register` · `/login` · `/logout` · `/forgot-password` · `/reset-password` · `/verify-email` | Auth flows | Mixed |
| GET/PATCH | `/api/v1/me` | Own profile | `candidate` |
| GET | `/api/v1/me/applications` | Own applications + status | `candidate` |
| POST | `/api/v1/me/applications/:id/withdraw` | Withdraw | `candidate` |
| GET/POST/DELETE | `/api/v1/me/saved-jobs` | Saved jobs | `candidate` |
| GET/POST/PATCH/DELETE | `/api/v1/me/alerts` | Manage alerts | `candidate` |
| POST/GET | `/api/v1/me/resumes` | Upload/list own resumes | `candidate` |
| POST | `/api/v1/me/export` | GDPR data export | `candidate` |
| DELETE | `/api/v1/me` | GDPR erasure request | `candidate` |

## 17.4 Admin endpoints

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| GET/POST | `/api/v1/admin/jobs` | List (all statuses) / create | recruiter+ |
| GET/PATCH/DELETE | `/api/v1/admin/jobs/:id` | Read / update / archive | recruiter+ |
| POST | `/api/v1/admin/jobs/:id/publish` · `/unpublish` · `/duplicate` | Status + duplication | recruiter+ |
| POST | `/api/v1/admin/jobs/bulk` | Bulk status change | account_manager+ |
| GET | `/api/v1/admin/applications` | Pipeline, filterable | recruiter+ |
| GET | `/api/v1/admin/applications/:id` | Detail + resume signed URL | recruiter+ |
| PATCH | `/api/v1/admin/applications/:id/status` | Advance stage, trigger candidate email | recruiter+ |
| POST | `/api/v1/admin/applications/:id/notes` | Internal note | recruiter+ |
| GET | `/api/v1/admin/candidates` | Search bench | recruiter+ |
| GET | `/api/v1/admin/candidates/:id` | Full record | recruiter+ |
| GET | `/api/v1/admin/candidates/:id/resume` | **Signed URL — logs to activity_log** | recruiter+ |
| POST | `/api/v1/admin/candidates/merge` | Merge duplicates | account_manager+ |
| GET/PATCH | `/api/v1/admin/leads` · `/leads/:id` | Lead queue and triage | account_manager+ |
| POST | `/api/v1/admin/leads/:id/assign` | Assign owner | account_manager+ |
| GET/POST/PATCH/DELETE | `/api/v1/admin/recruiters` · `/clients` · `/testimonials` · `/case-studies` · `/posts` | Content and entity management | role-dependent |
| GET | `/api/v1/admin/analytics/overview` · `/jobs` · `/applications` · `/leads` · `/traffic` | Dashboard metrics | account_manager+ |
| GET | `/api/v1/admin/activity-log` | Audit trail | admin |
| POST | `/api/v1/admin/export/:entity` | CSV export — **logged** | account_manager+ |

## 17.5 System endpoints

| Method | Endpoint | Purpose | Auth |
|---|---|---|---|
| GET | `/api/sitemap.xml`, `/api/sitemap-jobs.xml` | Dynamic sitemaps | Public |
| GET | `/api/feed/jobs.xml` | Job feed for job-board syndication (Indeed, LinkedIn) | Public/token |
| POST | `/api/webhooks/resend` | Email delivery/bounce events | Signature |
| POST | `/api/webhooks/payload` | Content publish → revalidate | Signature |
| POST | `/api/cron/*` | Scheduled jobs (§15.9) | Cron secret |
| GET | `/api/health` | Health check | Public |

---

# 18. Admin Dashboard

## 18.1 Navigation

```
┌──────────────────────────────────────────────────────────────────┐
│  VERTIS ADMIN            [search ⌘K]        [notifications] [me] │
├──────────────┬───────────────────────────────────────────────────┤
│ ▸ Dashboard  │                                                   │
│              │                                                   │
│ RECRUITING   │                                                   │
│ ▸ Jobs    47 │                CONTENT AREA                       │
│ ▸ Applications                                                   │
│         · 23 new                                                 │
│ ▸ Candidates │                                                   │
│ ▸ Job Alerts │                                                   │
│              │                                                   │
│ BUSINESS     │                                                   │
│ ▸ Leads   8 ●│                                                   │
│ ▸ Clients    │                                                   │
│ ▸ Recruiters │                                                   │
│              │                                                   │
│ CONTENT      │                                                   │
│ ▸ Insights   │                                                   │
│ ▸ Case Studies                                                   │
│ ▸ Testimonials                                                   │
│ ▸ Pages      │                                                   │
│ ▸ Media      │                                                   │
│              │                                                   │
│ SETTINGS     │                                                   │
│ ▸ Taxonomy   │                                                   │
│ ▸ Users      │                                                   │
│ ▸ Audit Log  │                                                   │
└──────────────┴───────────────────────────────────────────────────┘
```

Badge counts are live. `⌘K` opens global search across jobs, candidates, applications and leads — for a recruiter this is the fastest path to any record and should be built early, not as a polish item.

## 18.2 Key screens

### Dashboard (landing)
Role-aware. A recruiter sees their pipeline; an account manager sees leads and fill rates.
- **Today:** new applications · new leads · roles closing this week · applications awaiting review > 48hrs *(this last one is the most operationally useful number on the page)*
- **Pipeline funnel:** submitted → under review → shortlisted → submitted to client → interviewing → placed
- **Charts:** applications over time (30d) · leads over time (30d) · top roles by application volume · time-to-first-review
- **Queues:** unassigned leads · applications with no action in 5 days

### Jobs
Table view with inline status control, plus a kanban by status.
Columns: title · job code · capability · location · type · delivery · recruiter · applications · views · status · posted.
Filters: status, capability, recruiter, location, type, date range. Bulk actions: publish, unpublish, extend expiry, reassign.
**Job editor:** two-column — form left, live preview right. Fields grouped: Basics / Location & Delivery / Compensation / Description / Requirements / Skills / SEO / Publishing. Rich text for description with the banned-phrase warning from §14.7. **Autosave every 20 seconds.** Publish validation blocks on missing required fields with a clear checklist.

### Applications
**Kanban by status**, with a table toggle for bulk work. Each card: candidate name · role · match indicators · applied date · resume icon · assigned recruiter.
**Application detail (side panel, not a page navigation)** — keeps pipeline context:
- Candidate summary, parsed highlights, skills matched against the job's required skills *(visual match, not a score, at MVP)*
- Inline resume viewer (PDF.js) — **access logged**
- Status control with a required note on rejection
- Internal notes thread
- Email the candidate from a template
- Full application answers
- Other applications from this candidate

### Candidates
Bench search — the interface recruiters use most. Filters: skills (multi), capability, experience, location, work authorization, availability, delivery preference, status, last activity.
Candidate detail: profile · resume versions · skills with source · application history · notes · activity timeline · GDPR actions (export, erase).

### Leads
**Priority queue sorted by score.** Card view showing company, role, positions, timeline, score, age, assigned owner.
Detail: full requirement, contact, enrichment, source page and UTM chain, status pipeline (new → contacted → qualified → proposal → won/lost), assignment, notes, and a "create job from this lead" action that prefills the job editor — a genuine workflow shortcut that saves real time.
**SLA indicator:** leads unactioned past their SLA turn amber then red. This is the single feature most likely to improve lead conversion.

### Content
Standard Payload collections for Insights, Case Studies, Testimonials, Pages and Media, with draft/preview/publish, versioning and scheduled publishing. Content editors see only this section.

### Analytics
Site-level: sessions, top pages, top job pages, search terms with zero results *(a direct input to what content and roles to add)*, conversion rates by funnel, source attribution.
Recruiting: applications per role, time to first review, application completion rate, drop-off by application step, alert subscriber growth.
Business: leads by score band, by capability, by source, conversion by owner, average time to first contact.

### Audit log
Filterable by actor, action, entity, date. Admin-only. Prominently surfaces resume-access and export events.

## 18.3 Admin design principles

- **Density over decoration.** Admin is a tool. Tighter type (14px base), compact rows, more data per screen than the marketing site.
- **Keyboard-first.** `⌘K` search, `j`/`k` row navigation, `e` edit, `Esc` close. Recruiters live in this interface all day.
- **Side panels over page navigation** for detail views — preserves list context and is dramatically faster in practice.
- **Optimistic updates with rollback** on every status change.
- **Never a destructive action without an undo window** (5-second toast) or a typed confirmation for permanent deletes.
- **Mobile: read and triage only.** Full editing is desktop. A recruiter on a phone needs to review an application and change a status, not write a job description.

---

# 19. AI Opportunities

## 19.1 Governing principle

AI is included where it removes real friction or real manual work — and excluded where it introduces legal risk or unexplainable behaviour into an employment decision. Two regulatory facts shape this section and are not optional:

- **EU AI Act** classifies AI systems used in employment and worker management — including CV filtering and candidate evaluation — as **high-risk**, carrying obligations for risk management, data governance, transparency, human oversight, logging and conformity assessment. Since you have selected the EU as a target market, this applies.
- **NYC Local Law 144** requires an annual independent bias audit and candidate notification for any Automated Employment Decision Tool used to substantially assist hiring decisions for NYC roles. Illinois, Colorado and Maryland have related requirements.

**The consequence:** no AI feature at MVP makes, or substantially assists, a decision about a candidate. AI parses, summarises, drafts and retrieves. Humans decide. Every AI feature is documented, logged and disclosed.

## 19.2 Feature assessment

### MVP — build these four

**1. Resume parsing → application prefill**
- *Benefit:* Removes ~12 fields of typing. The single highest-impact conversion feature in the candidate funnel.
- *Implementation:* Text extraction (`pdf-parse` / `mammoth`) → Claude with a strict structured-output schema (Zod-validated) → prefill. Store `parsed_data` jsonb and a confidence score. Fall back to manual entry on failure. Typical latency 2–4s; ~$0.01–0.03 per parse.
- *Why it's low-risk:* It transcribes what the candidate wrote and shows it back for confirmation. It makes no judgement.
- **MVP. Highest priority AI feature.**

**2. Skills extraction and normalisation**
- *Benefit:* Populates `candidate_skills` automatically; makes the bench genuinely searchable. Normalises variants ("AWS", "Amazon Web Services", "aws cloud") to one canonical skill.
- *Implementation:* Same parse call, extracting skills mapped against the controlled `skills` vocabulary with its alias list. Unmatched skills go to a review queue for taxonomy growth rather than being silently discarded.
- **MVP.** Bundled with #1 — no extra API call.

**3. Job description drafting assistant (admin)**
- *Benefit:* A recruiter enters title, capability, key skills, location and seniority; gets a structured draft of description, responsibilities and requirements to edit. Cuts job-posting time from ~25 minutes to ~5, which directly increases how many roles get properly written up.
- *Implementation:* Claude with a Vertis-voice system prompt encoding the §4.7 rules and the banned-phrase list, plus few-shot examples from existing good postings. **Always a draft — never auto-publishes.**
- **MVP.** Internal-facing, zero candidate risk, immediate operational payoff.

**4. Semantic "similar roles"**
- *Benefit:* Better similar-role recommendations on job detail and post-application pages than keyword matching gives. Directly increases applications per session.
- *Implementation:* Embed job title + skills + description summary with an embedding model; store in `jobs.embedding` (`pgvector`); cosine similarity with an HNSW index, filtered to live roles. Recomputed on publish only.
- *Why it's low-risk:* It recommends roles to candidates. It does not evaluate candidates.
- **MVP.** Cheap, contained, measurable.

### Phase 2 — build after launch, with governance

**5. Candidate-to-job match scoring (recruiter-facing, advisory)**
- *Benefit:* Ranks an application queue so recruiters review the strongest fits first. Meaningful time saving at volume.
- *Implementation:* Hybrid — deterministic component (skill overlap, experience range, location, work authorization) plus an embedding-similarity component. **Deterministic factors are shown explicitly** ("7 of 9 required skills matched").
- *Governance required:* advisory only, never auto-rejects, never hides a candidate from the queue; every score explainable in terms of concrete factors; logged; disclosed in the candidate privacy notice; included in the bias-audit scope if used for NYC roles.
- **Phase 2 — and only with the above controls in place.**

**6. Resume summarisation for recruiters**
- *Benefit:* A 4-line summary at the top of a candidate record. Speeds triage.
- *Implementation:* Claude summarisation, generated once at parse time and cached. Always displayed adjacent to the actual resume, never as a replacement.
- **Phase 2.** Low risk, moderate value.

**7. Natural-language job search**
- *Benefit:* "remote snowflake contract roles paying over $80/hr" → structured filters.
- *Implementation:* Claude with a tool/function-call schema mapping the query to filter parameters, then the existing search. **Resolved filters are shown as normal, editable chips** so the user sees and can correct the interpretation.
- **Phase 2.** Genuinely useful, but standard filters must work perfectly first.

**8. Job alert relevance ranking**
- *Benefit:* Better alert digests → higher open and click rates → more applications.
- *Implementation:* Reuse the embedding index to rank matches within an alert's filter set.
- **Phase 2.**

### Phase 3 or later

**9. Candidate-facing job recommendations** ("roles for you" on an account dashboard) — requires accounts and behavioural data first.
**10. Rate benchmarking from internal data** — an analytics product using Vertis's own placement data, feeding the salary guides. High strategic value; needs data volume and careful anonymisation.
**11. Hiring-demand insights for clients** — a genuine differentiator, but a product in its own right.

### Rejected — and why

| Feature | Why not |
|---|---|
| **AI candidate screening / auto-rejection** | Squarely a high-risk AI system under the EU AI Act and an AEDT under NYC LL144. Legal exposure, bias risk, and reputational damage far exceed the efficiency gain. Humans reject candidates |
| **AI interview scoring / video analysis** | Same regulatory exposure, plus a poor evidence base for validity. Several vendors face enforcement action in this space |
| **AI chatbot as the primary contact channel** | Vertis's differentiator is that a candidate talks to a recruiter who knows the role. A chatbot actively contradicts the positioning |
| **AI-generated marketing content at scale** | The voice guidelines exist precisely to avoid generic AI-sounding copy. Drafting assistance for humans is fine; publishing generated content is not |
| **AI-written candidate rejection reasons** | Impersonal at exactly the moment personal matters most, and legally hazardous |
| **"AI-powered" as a marketing claim** | Nothing on the site should market AI. Buyers care about outcomes. Claiming AI invites scrutiny and offers no commercial benefit |

## 19.3 AI governance requirements

Before any AI feature ships:
1. Documented in a public-facing AI use statement linked from the privacy notice.
2. Every AI call logged (input hash, model, version, output, latency, cost) for auditability.
3. A human-review path exists for every AI output that touches a candidate.
4. A kill switch — every AI feature behind a feature flag that can be disabled without a deploy.
5. Model version pinned; upgrades tested against a regression set before rollout.
6. Cost ceiling and alerting per feature.


---

# 20. SEO Architecture

## 20.1 Strategic frame

Three distinct search markets, each needing a different structure:

| Market | Intent | Pages | Value |
|---|---|---|---|
| **Employer commercial** | `snowflake staffing agency`, `offshore IT staffing` | Capability, solution, industry, delivery-model pages | Highest revenue per session |
| **Candidate job search** | `data engineer jobs charlotte`, `SAP contract jobs` | Job detail (Google Jobs), programmatic facets | Highest volume; feeds supply |
| **Informational** | `contract vs c2h`, `data engineer hourly rate` | Insights, salary guides, hiring guides | Top of funnel; builds authority |

**The compounding asset is the job index.** Every live role is a `JobPosting`-marked page eligible for Google Jobs. At 200–400 live roles refreshed continuously, this produces sustained organic volume that no amount of marketing-page optimisation can match — and it lifts domain authority for the commercial pages.

## 20.2 Technical SEO

| Item | Implementation |
|---|---|
| **Sitemaps** | `sitemap.xml` (index) → `sitemap-pages.xml`, `sitemap-jobs.xml` (regenerated every 6h, `lastmod` per job), `sitemap-insights.xml`, `sitemap-locations.xml`. Split at 10,000 URLs |
| **robots.txt** | Allow all public; disallow `/admin/`, `/account/`, `/api/`, `/thank-you/`, `/search/`, `?page=` beyond 5 on facets. Sitemap declared |
| **Canonicals** | Self-referencing on every page. Facet pages canonical to themselves when indexed, to the parent when below threshold. Paginated pages self-canonical. Tracking parameters stripped |
| **Metadata** | Next.js `generateMetadata` per route. Title ≤60 chars, description 140–160. Templated for programmatic pages with real variable substitution, never a static template string |
| **Open Graph / Twitter** | Every page. Dynamic OG images via `@vercel/og` — job pages render title, location, rate and the Vertis mark; insights render the article title |
| **Breadcrumbs** | Visible on every page below root, with `BreadcrumbList` schema |
| **Internal linking** | Capability ↔ industry ↔ location ↔ jobs cross-linking. Every job links to its capability, category and location pages. Every capability page lists live roles. Contextual in-content links from articles to commercial pages |
| **Hreflang** | Deferred. Only when genuine per-region content exists (see A4). Premature hreflang on near-duplicate pages causes more harm than good |
| **Core Web Vitals** | See §25 |
| **Images** | AVIF with WebP fallback, `next/image`, explicit dimensions, lazy below fold, `priority` on LCP element, descriptive alt |
| **Structured data validation** | Automated Rich Results test in CI on representative URLs; build fails on schema errors |
| **404 / 410 handling** | Closed jobs return **410 Gone** with a helpful page. Removed content 301s to the nearest relevant parent. Never a soft 404 |
| **URL rules** | Lowercase, hyphenated, no trailing slash inconsistency, no parameters in canonical URLs, stable slugs (a job slug never changes after publish) |

## 20.3 Schema markup

| Schema | Where | Notes |
|---|---|---|
| **`Organization`** | Site-wide (root layout) | Name, logo, URL, `sameAs` socials, `contactPoint`, `address` for both offices, `numberOfEmployees` |
| **`WebSite`** + `SearchAction` | Root | Enables the sitelinks search box |
| **`JobPosting`** | Every job detail | **The most important schema on the site.** Full spec below |
| **`BreadcrumbList`** | Every page below root | |
| **`Article`** / `BlogPosting` | Insights | Author, `datePublished`, `dateModified`, image, publisher |
| **`FAQPage`** | Hire Talent, capability, solution, delivery models, candidate FAQ | Only where FAQs are genuinely visible on the page |
| **`Service`** | Solution and capability pages | `serviceType`, `provider`, `areaServed` |
| **`LocalBusiness`** | Location pages with a real office only | Never fabricate an office to win a local pack |
| **`Person`** | Leadership, recruiter profiles | |
| **`ItemList`** | Job search and facet pages | |

**`JobPosting` — required completeness.** Google Jobs eligibility depends on this being correct and complete. Fields: `title`, `description` (full HTML), `datePosted`, `validThrough`, `employmentType` (CONTRACTOR / FULL_TIME / TEMPORARY), `hiringOrganization` (Vertis Global, with logo), `jobLocation` with complete `PostalAddress`, `jobLocationType: TELECOMMUTE` plus `applicantLocationRequirements` for remote roles, `baseSalary` as a `MonetaryAmount` with `QuantitativeValue` (min/max/unitText) **whenever a rate is disclosed**, `identifier` (the job code), `industry`, `skills`, `experienceRequirements`, `directApply: true`.

Three rules that determine whether this works:
1. **`validThrough` must be set on every posting** and must be in the future. Expired postings are dropped and repeated violations damage the whole domain's Google Jobs standing.
2. **When a role closes, the page must return 410 or the posting must be removed from the sitemap immediately** — on-demand revalidation, not a 6-hour wait.
3. **`baseSalary` where disclosed** materially improves both ranking and click-through. This is a commercial argument for disclosing rates on more postings.

## 20.4 Programmatic SEO with index gating

Six programmatic families:

| Family | Pattern | Example | Index rule |
|---|---|---|---|
| **Skill** | `/jobs/skill/[skill]/` | `/jobs/skill/snowflake/` | ≥3 live roles |
| **Category** | `/jobs/category/[category]/` | `/jobs/category/data-engineer/` | ≥3 live roles |
| **Location** | `/jobs/location/[country]/[city]/` | `/jobs/location/united-states/dallas/` | ≥5 live roles |
| **Type** | `/jobs/type/[type]/` | `/jobs/type/contract-to-hire/` | Always (5 fixed pages) |
| **Skill × Location** | `/jobs/[skill]-jobs-in-[city]/` | `/jobs/snowflake-jobs-in-dallas/` | **≥3 live roles AND ≥200 words unique content** |
| **Location marketing** | `/locations/[country]/[city]/` | `/locations/united-states/dallas/` | Manual — requires written local content |

**The index gate is the most important rule in this section.** Below threshold, a page still renders for users but carries `noindex, follow` and canonicals to its parent. Above threshold it becomes indexable and enters the sitemap. This is checked nightly and on job status change.

Without this gate, a job board generates thousands of near-empty pages, Google classifies the site as thin-content, and rankings collapse across the whole domain. Every major job board has learned this expensively. The `locations.is_indexed` boolean in §16.2 exists specifically to enforce it.

**Every programmatic page needs at least one unique element** beyond the job list: for skill pages, a paragraph on what that skill's market looks like and which capability it belongs to; for locations, genuinely written local market content. Templated intros with only the city name swapped are doorway pages.

## 20.5 Keyword architecture

| Page | Primary target | Secondary |
|---|---|---|
| Home | vertis global | technology staffing company |
| /hire-talent/ | technology staffing services | IT staffing agency, hire technology consultants |
| /solutions/delivery-models/ | onshore vs offshore staffing | offshore IT staffing, hybrid delivery model |
| /solutions/staff-augmentation/ | IT staff augmentation | staff augmentation services |
| /capabilities/data-analytics-staffing/ | data engineer staffing | snowflake staffing, databricks consultants |
| /capabilities/cloud-infrastructure-staffing/ | cloud engineer staffing | devops staffing, AWS consultants |
| /capabilities/erp-enterprise-applications-staffing/ | SAP staffing agency | salesforce staffing, servicenow consultants |
| /capabilities/ai-automation-staffing/ | AI engineer staffing | machine learning staffing, RPA developers |
| /capabilities/application-development-qa-staffing/ | software developer staffing | QA automation staffing |
| /industries/financial-services/ | IT staffing financial services | banking technology staffing |
| /hire-talent/vetting-process/ | how staffing agencies vet candidates | technical screening process |
| /insights/salary-guides/ | technology contract rates | data engineer hourly rate |
| /jobs/ | technology contract jobs | IT consultant jobs |

**Cannibalisation control.** One page owns each primary term. Capability pages own skill terms; solution pages own engagement-model terms; the delivery-models page owns geography terms. This separation is why the three-axis IA in §12.1 matters commercially, not just conceptually.

## 20.6 Content velocity and authority

- **Months 1–3:** technical foundation, all commercial pages indexed, job feed live, `JobPosting` validated.
- **Months 3–6:** flagship salary guide, 6–8 articles, first case studies, digital-PR push on the rate data.
- **Months 6–12:** location page expansion (only where real presence or role density exists), skill × location pages passing threshold, second workforce report, link acquisition from the guides.

**Link acquisition is exclusively via the data assets.** Salary guides and workforce reports earn citations. No paid link schemes, no guest-post networks — the reputational and algorithmic risk is not worth it for a firm whose brand is its product.

---

# 21. Conversion Strategy

## 21.1 Candidate funnel

```
Google Jobs / Search        Job Search           Job Detail          Apply             Confirmation
        │                        │                    │                 │                    │
        │  ~55% of candidate     │                    │                 │                    │
        │  entries land here ────┼───────────────────►│                 │                    │
        │  directly                                   │                 │                    │
        ▼                        ▼                    ▼                 ▼                    ▼
   Land on job          Filter & scan          Read & decide      3-step form         Next steps
```

| Stage | Target | Primary CTA | Friction | Mitigation | Trust element |
|---|---|---|---|---|---|
| **Entry** | — | — | Landing on an expired role | 410 page with 3 live similar roles | Posted date, job ID |
| **Search** | 60% → detail | View role | Too many/few results; unclear filters | Live counts, removable chips, named empty-state fixes | Live role count |
| **Detail** | 25% → apply | Apply Now (sticky) | Unclear rate, no company context, long JD | Rate always stated, client descriptor, scannable structure, sticky CTA | Recruiter card, response commitment |
| **Apply** | **65% completion** | Continue → Submit | Typing, account gates, mobile upload, work-auth confusion | Resume parse prefill, no account, 3 steps, native file picker | "3 minutes", "no account required", privacy statement |
| **Confirm** | 20% → second action | Create alert / browse | Dead end | Similar roles, alert offer, recruiter contact | Reference ID, named recruiter, timeline |

**Highest-leverage improvements, in order:** (1) resume-parse prefill, (2) sticky Apply on job detail, (3) rate disclosed on every posting, (4) no account gate, (5) recruiter card on job detail.

## 21.2 Employer funnel

```
Search / Referral      Hire Talent or        Objection pages       Request Talent      Lead routed
                       Capability page       (Vetting, Delivery,
                                              Engagement, Compliance)
      │                       │                      │                    │                 │
      ▼                       ▼                      ▼                    ▼                 ▼
  Land                  Understand fit         Remove doubt         12-field form     AM within 1hr
```

| Stage | Target | Primary CTA | Friction | Mitigation | Trust element |
|---|---|---|---|---|---|
| **Entry** | — | — | Generic page that doesn't match a specific need | Capability pages with named platforms and roles | Trust bar metrics |
| **Understand** | 35% → deeper | Request Talent | "Can they do *my* stack?" | Full role and platform lists; live role counts as proof of activity | Fortune 500 claim, 20 years |
| **Objection** | 45% → form | Request Talent | "Everyone says they're fast"; offshore quality doubt; commercial opacity | Four-stage vetting page; "one standard" section; published engagement model | Replacement guarantee, case studies, testimonials |
| **Form** | **55% completion** | Send requirement | 12 fields feels long; unsure of delivery model | Requirement-first ordering; "Not sure — advise me" option; trust rail showing what happens next | Response SLA, privacy statement, testimonial in rail |
| **Post** | — | — | Slow response destroys the 48hr promise | SLA timers in admin, Slack alerts, scored routing | Immediate confirmation email naming the account manager |

**Secondary conversion for not-yet-ready buyers:** the gated capability overview and salary guides. Three fields, immediate value, enters nurture. This catches the large share of enterprise buyers who are researching months before a requirement exists.

## 21.3 Content funnel

```
Google (informational) → Article / Salary guide → Related commercial page → Request Talent / Download
```

| Stage | CTA | Friction | Mitigation |
|---|---|---|---|
| Article entry | Read | Bounce after one answer | Inline CTA at 60% depth, related-content rail, end-of-article band tied to the article's topic |
| Guide download | Download | Form resistance | Three fields only; summary content ungated so value is proven before the ask |
| Commercial page | Request Talent | Cold traffic, low intent | Nurture sequence rather than a hard push; retargeting audience |

**Realistic expectation:** content-funnel traffic converts to a direct lead at low single-digit rates. Its real jobs are authority-building, link acquisition, and nurture-list growth. Measured on assisted conversions and organic growth, not last-click.

## 21.4 Site-wide conversion mechanics

| Mechanic | Rule |
|---|---|
| **One primary CTA per page** | Every page has exactly one dominant action. Secondary CTAs are visually subordinate — never two equal-weight buttons |
| **CTA repetition** | Hero, mid-page, end band. Three touchpoints, never more |
| **Exit-intent** | Desktop only, once per session, on employer pages only, offering the capability overview. Never on candidate pages or during the apply flow |
| **Form abandonment recovery** | Once email is captured; one email at +24h |
| **Social proof adjacency** | A testimonial or metric within one viewport of every primary CTA |
| **Micro-commitments** | Skill chips, filter interactions and saved jobs are low-cost engagements that raise conversion downstream |
| **No dark patterns** | No fake urgency, no fabricated "3 people viewing", no pre-checked consent, no hidden opt-outs. In a trust business these cost more than they earn |

## 21.5 Measurement

Every funnel step is a tracked event (§27). Reviewed monthly against: candidate application completion rate, employer form completion rate, capability page → form rate, job detail → apply rate, and lead-to-qualified rate. A/B testing begins only once there is sufficient volume — realistically month 6+, starting with hero headline, form step order, and CTA copy.

---

# 22. Design System

## 22.1 Design lineage

This system is the next generation of the language established in your ACI Infotech and ARQ AI builds — recognisably the same hand, deliberately more authoritative.

| Element | ACI Infotech | ARQ AI | **Vertis Global** | Rationale |
|---|---|---|---|---|
| Dominant colour | Blue `#0052CC` | Dark `#161616` | **Ink `#091426`** | Ink-dominant reads more premium than blue-dominant. Blue becomes the action colour, not the brand wallpaper. Deepened from the wordmark navy for use as a full-bleed surface |
| Primary action | Blue `#0052CC` | — | **Vertis Blue `#1B4DE4`** | Sampled from the V's lower body. More vivid and saturated than ACI's corporate blue — the logo's own blue, not a generic one |
| Accent | Lime `#C4FF61` | Chartreuse `#d0f438` | **Cyan `#1EB8F0`** | **Revised on receipt of the logo.** The lime/chartreuse accent was inherited from ACI and ARQ and appears nowhere in the Vertis mark. Cyan is the V's upper terminal and takes the same structural role — brilliant on ink, unusable as text on white |
| Secondary accent | — | — | **Magenta `#E0357D`** | From the pixel scatter. Severely restricted — see usage rules |
| Neutral | Cold grey `#FAFAFA` | Warm `#FAF7F6` | **Mist `#F3F6FB`** | **Revised on receipt of the logo.** The warm mist neutral inherited from ARQ fights a cool blue/cyan/magenta identity. The ramp is now cool and blue-biased |
| Headings | Funnel Display | Template default | **Funnel Display** | Direct continuity — your brand's typographic signature |
| Body | Funnel Sans | Light 300 sans | **Inter Variable** | Deliberate change: a job platform has dense UI, tables, filters and forms. Inter's tabular numerals and UI metrics are materially better here |
| Container | 1200px | Full-bleed | **1280px** | Slightly wider for the job-search two-column layout |
| Radius | 12px cards | Varied | **10px cards, 8px controls** | Tighter reads more precise and enterprise |
| Section rhythm | 80/96px | Large | **112/144px** | More generous whitespace — the primary premium signal |
| Motion | fadeInUp, counters | Template-heavy | **Restrained: fade + 4–8px rise only** | ARQ's template motion is the thing to move away from |

## 22.2 Colour tokens

Every brand value below is taken from the Vertis Global mark.

```css
:root {
  /* ── BRAND — sampled from the logo ─────────────── */
  --vg-ink:            #091426;  /* wordmark navy, deepened for surfaces */
  --vg-ink-raised:     #0F1E34;  /* elevated dark surfaces, dark cards */
  --vg-ink-muted:      #1B2C48;  /* dark-surface borders */

  --vg-blue:           #1B4DE4;  /* PRIMARY ACTION — the V's lower body */
  --vg-blue-hover:     #1540C4;
  --vg-blue-active:    #0F3299;
  --vg-blue-subtle:    #EAF0FE;  /* tinted backgrounds, selected states */
  --vg-blue-on-dark:   #7FA3FA;  /* links on ink — AA compliant */

  --vg-cyan:           #1EB8F0;  /* ACCENT — the V's upper terminal */
  --vg-cyan-deep:      #08698C;  /* cyan as TEXT on light grounds */
  --vg-cyan-subtle:    #E3F6FD;

  /* pixel-scatter hues — severely restricted, see usage rules */
  --vg-magenta:        #E0357D;
  --vg-magenta-deep:   #B81C5E;  /* magenta as small text on light */
  --vg-violet:         #7B4FD6;  /* data visualisation only */
  --vg-teal:           #16C0C0;  /* data visualisation only */

  /* the one permitted brand gradient — the V itself */
  --vg-gradient:       linear-gradient(135deg, #1B4DE4 0%, #1EB8F0 100%);

  /* ── NEUTRALS (cool, blue-biased) ──────────────── */
  --vg-mist:           #F3F6FB;  /* alternating section background */
  --vg-white:          #FFFFFF;
  --vg-n-50:           #F7F9FC;
  --vg-n-100:          #EDF1F7;
  --vg-n-200:          #DFE5EF;  /* hairline borders */
  --vg-n-300:          #C7D0E0;
  --vg-n-400:          #96A1B6;
  --vg-n-500:          #667287;  /* muted text — AA on white */
  --vg-n-600:          #475366;  /* body text */
  --vg-n-700:          #333D4D;
  --vg-n-800:          #222A38;
  --vg-n-900:          #131A26;

  /* ── SEMANTIC ──────────────────────────────────── */
  --vg-success:        #0E9F6E;
  --vg-success-bg:     #E6F7F0;
  --vg-warning:        #B87407;
  --vg-warning-bg:     #FCF2E3;
  --vg-error:          #D93030;  /* deliberately distant from brand magenta */
  --vg-error-bg:       #FDECEC;
  --vg-info:           var(--vg-blue);

  /* ── ROLES ─────────────────────────────────────── */
  --vg-bg:             var(--vg-white);
  --vg-bg-alt:         var(--vg-mist);
  --vg-bg-dark:        var(--vg-ink);
  --vg-text:           var(--vg-ink);
  --vg-text-body:      var(--vg-n-600);
  --vg-text-muted:     var(--vg-n-500);
  --vg-text-on-dark:   #E6EBF4;
  --vg-text-on-dark-muted: #94A2BA;
  --vg-border:         var(--vg-n-200);
  --vg-border-strong:  var(--vg-n-300);
  --vg-focus:          var(--vg-blue);
}
```

**Colour usage rules**

| Colour | Use | Never |
|---|---|---|
| **Ink** | Hero, delivery models, case study, CTA band, footer, headings | More than 4 dark bands per page |
| **Blue** | Primary buttons, links, active states, focus rings | Large background fills — it becomes generic corporate blue |
| **Cyan** | Metric figures on ink, active tab underline, `[NEW]` badges, 3px card top-edge, live-count indicators, single hairlines | Body text on white (2.3:1 — fails). Large fills. More than ~2% of any viewport |
| **Cyan-deep** | Cyan as actual text on light grounds — eyebrows, small labels | Anywhere `--vg-cyan` would already work (on ink) |
| **Magenta** | **One** signature moment per page maximum: a single highlighted data point, the active step in a process diagram, a chart series | Buttons · links · any status or feedback context · adjacent to error red · body text at small sizes on white (4.25:1) |
| **Violet / Teal** | Data visualisation series only — charts in salary guides and workforce reports | Anywhere in the interface |
| **Mist** | Alternating section backgrounds | Adjacent to white without a border — the difference is too subtle to read as intentional |

**Contrast verification (WCAG AA), all values computed:**

| Pair | Ratio | Verdict |
|---|---|---|
| Ink on white | 18.5:1 | ✅ AAA |
| Body `n-600` on white | 7.8:1 | ✅ AAA |
| Muted `n-500` on white | 4.6:1 | ✅ AA |
| Blue on white / white on blue | 6.6:1 | ✅ AA |
| `text-on-dark` on ink | ~15:1 | ✅ AAA |
| `blue-on-dark` on ink | 7.7:1 | ✅ AAA |
| **Cyan on ink** | **8.1:1** | ✅ AAA |
| Cyan on white | 2.3:1 | ❌ **decorative only** |
| `cyan-deep` on white | 5.9:1 | ✅ AA |
| Magenta on white | 4.25:1 | ⚠️ large text only |
| `magenta-deep` on white | 6.2:1 | ✅ AA |
| Magenta on ink | 4.3:1 | ✅ AA (normal text) |

**Two lint rules enforce this:** cyan may not be used as a text colour on any light ground, and magenta may not appear in any component whose name contains `status`, `alert`, `error`, `toast` or `badge-state`.

> **Why magenta is restricted so hard.** It sits close enough to error red in hue that using it decoratively near feedback UI creates genuine ambiguity — a magenta "featured" badge beside a red validation message reads as two error states. Error red `#D93030` is deliberately pushed away from the brand magenta, and every error is paired with an icon and text so hue is never the only signal.

**Dark mode:** not implemented at launch. The site's ink/light rhythm is already a designed light-mode composition; a mechanical dark inversion would break it. Revisit only if analytics justify it.

## 22.3 Typography

```css
:root {
  --vg-font-display: 'Funnel Display', ui-sans-serif, system-ui, sans-serif;
  --vg-font-sans:    'Inter Variable', 'Inter', ui-sans-serif, system-ui, sans-serif;
  --vg-font-mono:    'JetBrains Mono', ui-monospace, 'SF Mono', monospace;
}
```

| Role | Font | Size | Weight | Line height | Tracking |
|---|---|---|---|---|---|
| **Display** (hero H1) | Funnel Display | `clamp(2.5rem, 4.2vw, 3.75rem)` | 700 | 1.05 | −0.025em |
| **H1** (interior) | Funnel Display | `clamp(2.125rem, 3.4vw, 3rem)` | 700 | 1.1 | −0.02em |
| **H2** | Funnel Display | `clamp(1.75rem, 2.6vw, 2.5rem)` | 700 | 1.15 | −0.018em |
| **H3** | Funnel Display | `clamp(1.375rem, 1.8vw, 1.75rem)` | 600 | 1.25 | −0.01em |
| **H4** | Funnel Display | `1.25rem` | 600 | 1.3 | −0.005em |
| **H5** | Inter | `1.0625rem` | 600 | 1.4 | 0 |
| **Lead** | Inter | `clamp(1.0625rem, 1.3vw, 1.25rem)` | 400 | 1.6 | 0 |
| **Body** | Inter | `1rem` | 400 | 1.65 | 0 |
| **Body small** | Inter | `0.9375rem` | 400 | 1.6 | 0 |
| **Caption / meta** | Inter | `0.8125rem` | 500 | 1.45 | 0.01em |
| **Eyebrow / label** | Inter | `0.75rem` | 600 | 1.2 | **0.08em**, uppercase |
| **Button** | Inter | `0.9375rem` | 600 | 1 | 0.005em |
| **Metric figure** | Funnel Display | `clamp(2.25rem, 3.5vw, 3.25rem)` | 700 | 1 | −0.02em, `font-variant-numeric: tabular-nums` |
| **Data / code / IDs** | JetBrains Mono | `0.8125rem` | 500 | 1.4 | 0 |

**Typographic rules**
- **Measure caps at 68ch** for body copy, 34ch for display headings. Long unconstrained lines are the fastest way to make a premium layout look cheap.
- **Only two heading weights** in use: 700 for H1/H2, 600 for H3/H4. Weight variety is not hierarchy.
- **Tabular numerals everywhere numbers align** — metrics, rates, tables, counts.
- **Monospace for job IDs, rate figures and codes.** A small, deliberate signal of precision.
- Font loading: `next/font` with `display: swap`, subset to Latin, preloaded for display and sans. Mono loaded lazily. Total font payload target under 90KB.

## 22.4 Spacing

4px base unit. Space tokens: `1=4 · 2=8 · 3=12 · 4=16 · 5=20 · 6=24 · 8=32 · 10=40 · 12=48 · 16=64 · 20=80 · 24=96 · 28=112 · 32=128 · 36=144`.

| Context | Desktop | Tablet | Mobile |
|---|---|---|---|
| **Section padding (vertical)** | 112px | 80px | 56px |
| **Section padding — feature/hero-adjacent** | 144px | 96px | 64px |
| **Container max-width** | 1280px | — | — |
| **Container gutter** | 32px | 32px | 20px |
| **Grid gap** | 32px | 24px | 16px |
| **Card padding** | 32px | 28px | 24px |
| **Between heading and body** | 16px | 16px | 12px |
| **Between body and CTA** | 32px | 28px | 24px |
| **Stack gap (list items)** | 16px | 16px | 12px |
| **Inline gap (chips, buttons)** | 12px | 12px | 8px |

**Grid.** 12 columns desktop, 8 tablet, 4 mobile. Breakpoints: `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1440`.

## 22.5 Radius, borders, elevation

```css
--vg-radius-xs:   4px;   /* chips, badges, tags */
--vg-radius-sm:   6px;   /* inputs, small controls */
--vg-radius-md:   8px;   /* buttons */
--vg-radius-lg:  10px;   /* cards */
--vg-radius-xl:  14px;   /* modals, sheets, feature panels */
--vg-radius-full: 9999px;/* filter chips, avatars, pills */

--vg-border:       1px solid var(--vg-n-200);
--vg-border-hover: 1px solid var(--vg-n-300);

--vg-shadow-xs: 0 1px 2px rgba(10,20,36,.04);
--vg-shadow-sm: 0 2px 4px rgba(10,20,36,.05), 0 1px 2px rgba(10,20,36,.04);
--vg-shadow-md: 0 6px 16px rgba(10,20,36,.07), 0 2px 4px rgba(10,20,36,.04);
--vg-shadow-lg: 0 16px 40px rgba(10,20,36,.10), 0 4px 8px rgba(10,20,36,.05);
```

**Elevation philosophy: borders first, shadows sparingly.** Cards at rest use a hairline border and no shadow. Shadow appears on hover and on genuinely floating surfaces (dropdowns, modals, sticky bars, the mobile filter sheet). Heavy resting shadows are the clearest template tell in corporate web design.

## 22.6 Buttons

| Variant | Default | Hover | Active | Disabled | Use |
|---|---|---|---|---|---|
| **Primary** | `bg: blue`, white text | `bg: blue-hover`, `translateY(-1px)`, `shadow-sm` | `bg: blue-active`, `translateY(0)` | `bg: n-200`, `n-400` text, `cursor: not-allowed` | The one main action per page/section |
| **Secondary** | `bg: white`, ink text, `1px n-300` border | `bg: n-50`, `border n-400` | `bg: n-100` | 50% opacity | Alternative action beside a primary |
| **Secondary on ink** | transparent, white text, `1px rgba(255,255,255,.25)` | `bg: rgba(255,255,255,.08)`, border `.45` | — | — | Dark bands |
| **Ghost** | transparent, blue text | `bg: blue-subtle` | `bg` darker | — | Tertiary, toolbars, card actions |
| **Text CTA** | blue text + `→`, no background | arrow translates `4px`, underline appears | — | — | Card links, "Learn more", in-content |
| **Destructive** | `bg: error`, white | darker | — | — | Admin only |

**Button specification**
- Heights: `sm 36px · md 44px · lg 52px`. Mobile primary CTAs use `lg` at full width.
- Padding: `md` = 12px 24px; `lg` = 16px 32px.
- Radius 8px. Weight 600. Size `0.9375rem`.
- Icons 16px (`sm`/`md`), 18px (`lg`), 8px gap, stroke 1.5.
- Transition: `background 150ms, transform 150ms, box-shadow 150ms` — never a transition on `all`.
- Loading state: label is replaced by a spinner with `aria-busy="true"`; **width is preserved** to prevent layout shift.
- **Focus:** `outline: 2px solid var(--vg-focus); outline-offset: 2px` on every variant, including on ink where the ring switches to `--vg-cyan` for contrast (8.1:1 on ink).
- Minimum touch target 44×44px, achieved with padding rather than by enlarging visible chrome.

## 22.7 Cards

All cards share: `radius-lg`, hairline border, white or ink surface, `shadow` only on hover, `translateY(-2px)` hover lift, 150ms transition, entire card clickable where it represents one destination.

| Card | Structure | Distinguishing treatment |
|---|---|---|
| **JobCard** | Title + `[NEW]` + save · meta row (location, type, rate) · skill chips · 2-line excerpt · footer (posted, ID, action) | Fixed height with clamped excerpt so grids stay even. Save control is a nested button. Hover: border darkens, title takes blue |
| **CapabilityCard** | Name · role line · platform chips · live count · `View roles →` | **A 3px top-edge in the brand gradient (blue→cyan) appears on hover** — the system's signature interaction, and the one place the logo's gradient recurs in the interface. Platform chips truncate with `+N more` |
| **IndustryCard** | Name · one-line context · `→` | Deliberately minimal: no image, no icon. Restraint here separates the design from template staffing sites |
| **SolutionCard** | Badge (`MOST COMMON`) · name · description · "who it suits" · `Learn more →` | Badge uses `blue-subtle` background with blue text — never cyan or magenta |
| **TestimonialCard** | Large low-opacity quote glyph · quote · 48px avatar or initials · name, title, company | No border on the quote itself; the card border carries the structure |
| **CaseStudyCard** | Industry + capability tags · outcome headline · 3 inline metrics · `Read →` | Metrics in Funnel Display 700 with tabular numerals — the primary scan element |
| **BlogCard** | 16:9 image · type tag · title · 2-line excerpt · author + read time | Image `object-cover`, `radius-lg` top corners only, subtle zoom (`scale 1.03`) on hover |
| **StatCard** | Figure · label | No border, no background. Hairline dividers between siblings |
| **RecruiterCard** | 56px photo · name · title · capability · contact action | Photo is circular; initials fallback in `blue-subtle` |

## 22.8 Forms

| Element | Specification |
|---|---|
| **Input / select / textarea** | 48px height (textarea min 120px), 14px 16px padding, `radius-sm`, `1px n-300` border, white background, `1rem` text (**never below 16px — iOS zooms on focus**) |
| **Focus** | `border: blue`, `box-shadow: 0 0 0 3px var(--vg-blue-subtle)`, plus the standard focus ring for keyboard users |
| **Label** | Above the field always. `0.875rem/600`, ink, 8px gap. **No floating labels** — they fail at small sizes, complicate autofill, and hurt screen-reader clarity |
| **Required** | Asterisk plus a legend. Optional fields marked `(optional)` — marking the smaller set is clearer |
| **Helper text** | `0.8125rem`, `n-500`, below field, 6px gap |
| **Error** | `border: error`, `bg: error-bg`, message below with a 14px icon, `role="alert"` |
| **Success** | Checkmark inside the field's right edge on valid blur, for fields with real validation only |
| **Chips (multi-select)** | `radius-full`, `blue-subtle` background, blue text, 12px 6px padding, `×` remove with a 44px hit area |
| **Checkbox / radio** | 20px, `radius-xs` (checkbox) / full (radio), 2px `n-400` border, blue fill when checked, 12px gap to a fully clickable label |
| **File upload** | Dashed 2px `n-300` border, `radius-lg`, 48px vertical padding, upload icon, drag-active state uses `blue-subtle` background and blue border |
| **Fieldset** | Grouped fields use `<fieldset>` + `<legend>` for screen-reader structure |

## 22.9 Motion

```css
--vg-ease:     cubic-bezier(0.4, 0, 0.2, 1);
--vg-ease-out: cubic-bezier(0.16, 1, 0.3, 1);
--vg-dur-fast: 150ms;   /* hovers, focus, colour */
--vg-dur-base: 240ms;   /* dropdowns, accordions */
--vg-dur-slow: 400ms;   /* page-level reveals */
```

**Permitted:** opacity fades · 4–8px rise on scroll reveal · 1–2px hover lift · colour and border transitions · height transitions on accordions · a 900ms count-up on metrics (once per session) · a 4px arrow translate on text CTAs · skeleton shimmer during load.

**Prohibited:** parallax · scroll-jacking · full-page transitions · rotating or scaling entrances · staggered letter animations · carousels with auto-advance · bouncing or elastic easing · animated gradients · any animation over 400ms on a UI control · anything that moves while the user is reading.

**Reduced motion.** Under `prefers-reduced-motion: reduce`, all transforms are disabled, opacity transitions cap at 100ms, counters render final values immediately, and the header hide/show is disabled. This is implemented as a global rule, not per-component, so no future component can accidentally opt out.

## 22.10 Iconography

Lucide, `stroke-width: 1.5` globally — carried directly from your ACI system. Sizes 16 / 20 / 24px. Icons are always paired with text labels except in universally understood controls (close, search, save). Every standalone icon button carries an `aria-label`. Decorative icons are `aria-hidden="true"`. **No filled icons, no duotone, no mixing icon sets.**

## 22.11 Imagery

| Type | Direction |
|---|---|
| **People** | Real, candid, working environments. Natural light. Slightly desaturated to sit inside the palette. Diverse and authentic — the industry's stock photography is transparently fake and reads as such |
| **Never** | Handshakes · smiling teams around a laptop pointing at a screen · isolated headsets on white · "diverse team high-fiving" · anything from the first page of a stock search for "staffing" |
| **Abstract** | Geometric, structural, restrained. Network and grid motifs at 2–5% opacity behind ink surfaces. Never generic blob gradients or particle fields |
| **Data visualisation** | For insights and reports. This is the **only** place the full pixel-scatter palette is licensed: blue, cyan, magenta, violet, teal as an ordered categorical series. Cyan reserved for the single highlighted series |
| **Illustration** | Avoided. Illustrated styles read as startup or SaaS, not enterprise staffing |
| **Gradients** | **One gradient exists: the brand gradient, `#1B4DE4 → #1EB8F0`, taken from the V.** Permitted in exactly four places — the logo, a single hero accent element, the capability-card hover edge, and data-viz emphasis. Never on button fills, card backgrounds, text, or any area larger than a hairline. Plus at most one very subtle radial in the hero, ink to ink-raised. **No other gradient anywhere** |
| **Pixel-scatter motif** | The logo's dispersing squares are a genuine brand asset. Licensed for: the hero background graphic (2–4% opacity on ink), the 404 and empty states, and section-transition marks. **Never as decoration on cards or repeated per section** — it becomes wallpaper and stops meaning anything |
| **Logos** | Monochrome, uniform optical sizing, 40% opacity at rest, 100% on hover |

**If authentic photography is unavailable at launch,** ship the abstract/typographic treatment rather than stock. A well-set type-and-space layout looks premium; visible stock photography does not, and it undermines the entire credibility argument.


---

# 23. Responsive Strategy

## 23.1 Breakpoints and approach

Mobile-first. Base styles target 375px; every breakpoint is a `min-width` enhancement.

| Name | Range | Grid | Container | Primary consideration |
|---|---|---|---|---|
| **Mobile** | 320–639 | 4 col | fluid, 20px gutter | Single column, thumb reach, 44px targets |
| **Mobile L** | 480–639 | 4 col | fluid, 24px | Slightly larger type |
| **Tablet** | 640–1023 | 8 col | fluid, 32px | Two columns emerge; nav still drawer |
| **Laptop** | 1024–1279 | 12 col | 1024px, 32px | Full desktop nav appears |
| **Desktop** | 1280–1439 | 12 col | 1280px, 32px | Design target |
| **Wide** | 1440+ | 12 col | 1280px centred | Container caps; background bleeds full width |

**The nav breakpoint is 1024px** — six items plus two CTAs cannot fit comfortably below this without shrinking type below the premium threshold.

## 23.2 Component behaviour matrix

| Component | Mobile (<640) | Tablet (640–1023) | Laptop (1024–1279) | Desktop (1280+) |
|---|---|---|---|---|
| **Header** | 56px, logo + search icon + hamburger; full-screen drawer with both CTAs at top | 64px, same drawer | 72px, full nav, both CTAs, hover mega menus | 88px at rest → 64px condensed |
| **Hero** | Single column, search **above** CTAs, H1 2rem, stacked full-width buttons, no side graphic | Single column centred, H1 2.5rem, graphic below content at 60% | 7/5 split, graphic returns, H1 3rem | Full 7/5, floating stat card, H1 3.75rem |
| **Trust bar** | 2×2 grid, logos as marquee | 4 across, logos wrap | 4 across with hairlines | Same, wider spacing |
| **Job search** | Sticky search + `[Filters (3)]` + `[Sort]`; filters in a bottom sheet with a live count and sticky apply | Same pattern; results 2-up | Filter rail appears (3/9 split), sticky | Same, wider results |
| **JobCard** | Full-bleed with 16px gutters, meta stacks to two lines, 4 skill chips max | 2-up grid | List within the 9-col results area | Same |
| **Job detail** | Single column; recruiter card promoted above body; sticky bottom bar with rate + Apply after 400px | Single column; rail content becomes a card above the body | 8/4 with sticky rail | Same |
| **Apply flow** | Full-width fields, 48px height, native pickers, one field per row, sticky footer with Continue | Same, max 560px centred | Centred 640px card with a visible step rail | Same |
| **Forms (Request Talent)** | Single column, one field per row | Two columns for short paired fields (first/last name) | 7/4 form + sticky trust rail | Same |
| **Filters** | Bottom sheet, accordions, live count, `Clear all` + `Show N` sticky footer | Bottom sheet | Sticky left rail, always open, instant apply | Same |
| **Cards (capability/industry)** | Single column stack, or horizontal snap-scroll for industries | 2-up | 3-up (row 1) + 2-up (row 2) | Same, wider |
| **Tables (admin, comparison)** | Transform to stacked label/value cards — **never** a horizontally scrolling data table on mobile | Horizontal scroll with a sticky first column and an edge fade | Full table | Full table |
| **Mega menu** | N/A (accordion) | N/A | Full panel | Full panel |
| **Footer** | Accordions; newsletter and contact expanded by default | 2 columns | 6 columns | 6 columns |
| **Modals** | Full-screen sheets sliding from bottom | Bottom sheet | Centred, max 560px | Same |
| **Section padding** | 56px | 80px | 112px | 112px (144px on feature sections) |

## 23.3 Mobile-specific rules

- **Thumb zone.** Primary actions sit in the lower two-thirds. Sticky bottom bars on job detail and the apply flow put the key action exactly where the thumb rests.
- **No hover-dependent functionality.** Everything reachable by hover on desktop is reachable by tap on touch. Mega menus become accordions; card hover states become always-visible affordances.
- **Inputs at 16px minimum** to prevent iOS zoom-on-focus.
- **`autocomplete` and `inputmode` on every field** — `email`, `tel`, `given-name`, `family-name`, `organization`, `address-level2`.
- **Horizontal scroll containers** (chips, industry cards, similar jobs) use CSS scroll-snap with a fade mask at the trailing edge, sized so the next item peeks — the strongest available affordance for scrollability.
- **The page body never scrolls horizontally.** Wide content scrolls inside its own container.
- **Test on real devices**, not just emulation: iPhone SE (375px, the practical floor), iPhone 15, a mid-range Android, iPad.

## 23.4 The two deliberate layout inversions

Most components simply reflow. Two change order between breakpoints, both for evidence-based reasons:

1. **Hero: job search moves above the CTA row on mobile.** Mobile traffic skews strongly candidate (arriving from Google Jobs and LinkedIn on phones). Serving the majority intent first on mobile, while serving the higher-value intent first on desktop, is a genuine optimisation rather than an inconsistency.
2. **Job detail: the recruiter card moves above the job description on mobile.** On a small screen the "is this real, and who is behind it?" question must be answered before the candidate commits to a long scroll.

Both inversions are implemented with CSS `order` on a flex container, so DOM order remains logical for screen readers.

---

# 24. Accessibility

**Target: WCAG 2.2 Level AA**, with the AAA contrast levels our palette already achieves for body text. This is both an ethical baseline and a commercial requirement — enterprise procurement and public-sector RFPs routinely request a VPAT or accessibility conformance statement.

## 24.1 Perceivable

| Requirement | Implementation |
|---|---|
| **Contrast** | All ratios verified in §22.2. Body text ≥8:1, all interactive text ≥4.5:1, non-text UI ≥3:1. Cyan restricted to decorative use on light grounds, and magenta barred from status contexts, both by lint rule |
| **Colour independence** | No information conveyed by colour alone. Errors carry an icon and text. Job status uses a label, not just a badge colour. Required fields use an asterisk **and** a legend |
| **Alt text** | Every meaningful image has descriptive alt. Decorative images use `alt=""`. Abstract hero graphics are `aria-hidden="true"` with the comparison table serving as the accessible equivalent |
| **Text resize** | Layout holds to 200% zoom with no loss of content or function. All type in `rem`; no fixed-height text containers |
| **Reflow** | Usable at 320px width with no horizontal scrolling (WCAG 1.4.10) |
| **Media** | Any video carries captions and a transcript. No autoplay with sound |

## 24.2 Operable

| Requirement | Implementation |
|---|---|
| **Keyboard** | Every function reachable and operable by keyboard. Logical tab order following DOM order. No keyboard traps |
| **Focus visible** | 2px blue outline, 2px offset, on every interactive element — including on dark surfaces, where it switches to cyan (8.1:1 on ink). **The default outline is never removed without a replacement** |
| **Focus not obscured** (2.2) | `scroll-margin-top` on all focusable elements equal to the sticky header height, so focused elements are never hidden beneath it |
| **Skip link** | "Skip to main content" as the first focusable element, visible on focus |
| **Target size** (2.2) | Minimum 24×24px CSS; 44×44px for all primary touch targets |
| **Mega menus** | Open on hover *and* on Enter/Space. Arrow-key navigation within. `Esc` closes and returns focus to the trigger. `aria-expanded` maintained |
| **Mobile drawer** | `<dialog>` with `aria-modal`, focus trapped while open, `Esc` closes, focus returns to the hamburger, body scroll locked |
| **Filters** | Native checkbox and radio semantics inside a `<fieldset>` with a `<legend>`. Result count changes announced via `aria-live="polite"` |
| **Carousels** | Only used for similar-jobs and industry strips, always with visible controls, never auto-advancing |
| **Timeouts** | None on forms. Session expiry warns with an extension option |

## 24.3 Understandable

| Requirement | Implementation |
|---|---|
| **Language** | `<html lang="en">`; `lang` on any inline foreign-language text |
| **Consistent navigation** | Identical header, footer and nav order on every page |
| **Labels** | Every input has a persistent visible `<label>` with a `for`/`id` association. Placeholder text is never the only label |
| **Error identification** | `aria-invalid="true"`, `aria-describedby` pointing at the message, `role="alert"` on the message, focus moved to the first error on failed submit |
| **Error suggestion** | Errors state how to fix: "Enter a phone number including country code, e.g. +1 704 555 0142" |
| **Error prevention** | Application and Request Talent flows show a review step before submission. Destructive admin actions require confirmation |
| **Help** (2.2) | Contact route consistently available in the same location across pages |
| **Redundant entry** (2.2) | Data entered in step 1 is never re-requested in step 3 |

## 24.4 Robust

| Requirement | Implementation |
|---|---|
| **Semantic HTML** | `<header> <nav> <main> <article> <aside> <footer>`. One `<h1>` per page. Heading levels never skipped. Lists marked up as lists. Buttons are `<button>`, links are `<a>` — **never a `div` with a click handler** |
| **ARIA discipline** | Native semantics preferred. ARIA only where HTML cannot express the pattern (comboboxes, dialogs, tabs, live regions) — via Radix primitives |
| **Landmarks** | One `main`, labelled `nav` elements where multiple exist (`aria-label="Primary"` / `"Footer"`) |
| **Dynamic content** | Search results, filter counts and form status announced via `aria-live="polite"`; errors via `role="alert"` |
| **Screen reader testing** | NVDA/Firefox, VoiceOver/Safari, VoiceOver/iOS on the critical paths: job search, job detail, apply flow, Request Talent |

## 24.5 Process and governance

- **Automated:** `eslint-plugin-jsx-a11y` blocking in CI; `axe-core` via Playwright on key pages, failing the build on violations; Lighthouse accessibility score ≥95 as a CI gate.
- **Manual:** keyboard-only walkthrough of every critical path before each release; screen-reader testing quarterly and on any change to the apply or Request Talent flows.
- **Deliverable:** a published Accessibility Statement at `/legal/accessibility-statement/` stating the conformance target, known limitations, and a contact route for accessibility issues — with a commitment to respond within five business days.
- **Automated tools catch roughly a third of real issues.** The manual keyboard and screen-reader passes are where the rest are found, and they are not optional.

---

# 25. Performance

## 25.1 Targets

| Metric | Target | Hard limit |
|---|---|---|
| **LCP** | < 1.8s | < 2.5s (p75, mobile 4G) |
| **INP** | < 130ms | < 200ms |
| **CLS** | < 0.05 | < 0.1 |
| **TTFB** | < 400ms | < 800ms |
| **Lighthouse Performance** (mobile) | ≥ 92 | ≥ 90 |
| **Initial JS (marketing pages)** | < 100KB gzipped | < 150KB |
| **Initial JS (job search)** | < 140KB gzipped | < 180KB |
| **Total page weight (homepage)** | < 600KB | < 900KB |
| **Font payload** | < 90KB | < 120KB |

Enforced by `@next/bundle-analyzer` in CI with a size budget that fails the build on regression, plus Lighthouse CI on representative URLs.

## 25.2 Rendering and caching

Per-route strategy is defined in §15.3. The layered caching model:

```
Browser cache ──► Vercel Edge (CDN) ──► ISR cache ──► Redis (query cache) ──► Postgres
   1yr immutable      static assets       page HTML       hot aggregates
   for hashed         + ISR pages         per route       (job counts,
   assets                                                  facet counts)
```

| Layer | What | TTL |
|---|---|---|
| Browser | Hashed static assets | 1 year, immutable |
| Edge | Marketing HTML | 1 hour, stale-while-revalidate |
| Edge | Job detail | 5 min, SWR, on-demand purge on status change |
| Edge | Unfiltered job search | 60s |
| Redis | Live job count, facet counts, taxonomy | 5 min |
| Redis | Search results for common queries | 60s |
| Postgres | — | Partial indexes per §16.4 |

**On-demand revalidation** fires from Payload hooks: publishing a job purges the job page, its capability page, its location pages and the sitemap. Closing a job does the same and pushes to the Google Indexing API. This matters commercially — a closed role lingering in Google Jobs damages both candidate experience and the domain's standing.

## 25.3 Frontend optimisation

| Technique | Application |
|---|---|
| **Server Components by default** | `'use client'` only where interactivity genuinely requires it: filters, forms, save buttons, drawers, mega menus. This is the single largest JS reduction available |
| **Code splitting** | Route-level automatic. `next/dynamic` for the mobile filter sheet, the PDF viewer, chart libraries, and the entire admin bundle |
| **Images** | `next/image` with AVIF/WebP, responsive `sizes`, explicit dimensions, `priority` on the LCP image only, `loading="lazy"` elsewhere, blur placeholders on content images |
| **Fonts** | `next/font` self-hosted, `display: swap`, Latin subset, preload display + sans, `size-adjust` fallback metrics to eliminate layout shift on swap |
| **Third-party scripts** | GA4/GTM via `next/script` with `strategy="afterInteractive"`. **No third-party script blocks render.** Consent-gated scripts load only after consent |
| **Prefetch** | `next/link` prefetch on viewport entry for job cards and nav destinations. Disabled on slow connections via the Network Information API where available |
| **CLS prevention** | Explicit dimensions on all media; skeletons matching final dimensions exactly; `min-height` reserved on dynamic regions; fonts with adjusted fallback metrics; no content injected above existing content after load |
| **INP** | Filter changes debounced 300ms with optimistic UI; long lists virtualised above 100 rows (admin only); no synchronous layout thrashing in scroll handlers; `content-visibility: auto` on below-fold sections |

## 25.4 Backend and database

- **Indexes per §16.4**, with partial indexes on `status='published'` for the hot path.
- **No N+1 queries** — Drizzle relational queries with explicit joins; a lint rule flags queries inside loops.
- **Connection pooling** via Neon's pooler; serverless-safe client instantiation.
- **`EXPLAIN ANALYZE` on every query in the search path** during development; p95 database time budget of 50ms for job search.
- **Denormalised counters** (`job_count` on skills and locations, `application_count` on jobs) refreshed by scheduled job rather than computed per request.
- **Cursor pagination in admin lists**; offset pagination on public job search where the offsets stay small.
- **Payload size discipline:** the job search API returns only card-necessary fields, not full descriptions. This alone cuts the search response substantially.

## 25.5 Monitoring

Vercel Analytics for field Core Web Vitals at p75, segmented by route and device. Sentry for errors and performance traces with a 10% sample rate on transactions. Lighthouse CI on every PR against the homepage, a capability page, job search and a job detail page. A weekly performance review during the first three months post-launch, monthly thereafter. Alerts fire when p75 LCP exceeds 2.5s or the error rate exceeds 1%.

---

# 26. Security

Candidate resumes are among the most sensitive data categories a marketing website can hold: full name, contact details, employment history, work authorization status, and often salary expectations. A breach here is both a regulatory event and a business-ending trust event for a staffing firm.

## 26.1 Authentication

| Control | Implementation |
|---|---|
| **Password storage** | Argon2id (memory 19MiB, iterations 2, parallelism 1) or bcrypt cost 12 minimum. Never MD5/SHA family |
| **Password policy** | Minimum 12 characters, checked against the HaveIBeenPwned range API (k-anonymity, no password leaves the server). **No forced composition rules or rotation** — both are counterproductive per current NIST guidance |
| **Sessions** | httpOnly, Secure, SameSite=Lax cookies. 7 days for candidates, 12 hours for staff. Rotated on privilege change. Server-side invalidation on logout |
| **2FA** | TOTP required for all staff accounts before production launch. Optional for candidates |
| **Rate limiting** | 5 login attempts per 15 min per IP+account, then exponential backoff. Account lockout notification email |
| **Password reset** | Single-use, 30-minute, cryptographically random tokens, hashed at rest. **Identical response whether or not the account exists** (prevents enumeration). All sessions invalidated on reset |
| **Email verification** | Required before a candidate account grants access to stored resumes |

## 26.2 Authorisation

- **Role-based access control** enforced in the service layer, not the UI. Hiding a button is not authorisation.
- **Every admin endpoint checks role on every request.** No implicit trust from a prior check.
- **Ownership checks on all `/me/*` routes** — a candidate can only read their own applications, verified against the session, never against a client-supplied ID.
- **Resume access is doubly gated:** role check, then a signed 5-minute URL, then an `activity_log` write. Direct object storage URLs are never exposed.
- **Content editors are structurally excluded from candidate PII** — enforced by Payload collection-level access control, not by convention.
- **IDOR prevention:** all public identifiers are UUIDs or opaque codes, never sequential integers. Every fetch-by-ID re-validates ownership.

## 26.3 Application security

| Threat | Mitigation |
|---|---|
| **SQL injection** | Drizzle parameterised queries exclusively. Raw SQL only via tagged templates that parameterise. A lint rule forbids string-concatenated SQL |
| **XSS** | React escapes by default. `dangerouslySetInnerHTML` only for CMS rich text, sanitised server-side with `isomorphic-dompurify` against an allowlist. Strict CSP with nonces — no `unsafe-inline`, no `unsafe-eval` |
| **CSRF** | SameSite=Lax cookies plus Next.js Server Actions' built-in origin verification. Explicit CSRF tokens on any non-Server-Action state-changing route |
| **Input validation** | Zod schemas at every boundary. Client validation is UX only; **server validation is the security boundary and is never skipped** |
| **File upload** | MIME verified by magic bytes not extension; 10MB cap; PDF/DOC/DOCX only; ClamAV scan before availability; stored under a generated UUID outside the web root; served only via signed URLs; original filename kept as metadata only |
| **SSRF** | No user-supplied URLs are fetched server-side. LinkedIn import (if built) uses the official OAuth flow, not URL scraping |
| **Rate limiting** | Applications 5/hr/IP · leads 5/hr/IP · resume parse 10/hr/IP · search 60/min · auth 5/15min. Upstash Redis, sliding window |
| **Bot protection** | Cloudflare Turnstile on every public form, invisible by default, challenge only on high risk score |
| **Dependency security** | `npm audit` and Dependabot in CI; builds fail on high/critical. Lockfile committed. Quarterly dependency review |
| **Secrets** | Environment variables only; never committed. Rotated quarterly. Separate credentials per environment. Secret scanning in CI |

## 26.4 Security headers

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{random}' https://www.googletagmanager.com;
  style-src 'self' 'nonce-{random}'; img-src 'self' data: https:; font-src 'self';
  connect-src 'self' https://*.vercel-insights.com https://*.sentry.io;
  frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none';
  upgrade-insecure-requests
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=(), usb=()
Cross-Origin-Opener-Policy: same-origin
```

## 26.5 Data privacy

Candidate data spans three regimes given the selected markets: **GDPR** (EU), **India DPDP Act 2023**, and **US state privacy laws** (CCPA/CPRA and successors).

| Requirement | Implementation |
|---|---|
| **Lawful basis** | Consent for candidate data, captured explicitly at application with the purpose and retention period stated inline. Legitimate interest for B2B lead contact, documented in an LIA |
| **Candidate Privacy Notice** | A distinct document from the general privacy policy, linked at the point of collection. States what is collected, why, who sees it, how long it is kept, and how to exercise rights |
| **Retention** | Resumes and candidate records deleted 24 months after last activity. Automated sweep with a 30-day advance notice email offering renewal |
| **Right of access** | Self-service export at `/api/v1/me/export` returning a machine-readable archive of all held data |
| **Right of erasure** | Self-service request; hard-deletes the candidate record, all resume versions from object storage, and skills. An anonymised audit stub is retained where legally required, with no personal data |
| **Right of rectification** | Profile editing, and an email route for candidates without accounts |
| **Data minimisation** | The field-cutting discipline in §10.3 is a privacy control as much as a UX one. **Salary history is never collected** — illegal to request in many US jurisdictions |
| **Cross-border transfers** | US↔India transfers documented with Standard Contractual Clauses. Data residency stated in the privacy notice |
| **Sub-processors** | Published list (Vercel, Neon, Cloudflare, Resend, Anthropic, Sentry) with purpose and location |
| **Breach response** | Documented plan with a 72-hour GDPR notification path, named owner, and communication templates prepared in advance |
| **AI transparency** | Where AI processes candidate data (resume parsing), disclosed in the privacy notice with the model provider named and a human-review path stated |
| **No sale of data** | Explicit commitment. Resumes are never shared with a client without the candidate's specific permission for that role — stated on the job detail page and the confirmation screen because it is a genuine differentiator |

## 26.6 Operational security

Least-privilege access to production. Audit logging of every PII access, export and permission change, retained 24 months. Encrypted backups with a documented restore procedure tested quarterly — **an untested backup is not a backup**. Separate development, preview and production environments with no production data in lower environments (seeded synthetic data only). A pre-launch penetration test focused on the application flow, resume storage and admin authorisation.

---

# 27. Analytics

## 27.1 Stack

| Tool | Purpose |
|---|---|
| **Google Analytics 4** | Behavioural analytics, funnels, attribution |
| **Google Tag Manager** | Tag deployment without redeploys; consent-mode integration |
| **Google Search Console** | Organic performance, indexing, Core Web Vitals, **Google Jobs reporting** |
| **Vercel Analytics** | Field Core Web Vitals, privacy-preserving page views |
| **Sentry** | Errors and performance traces |
| **Internal admin analytics** | Recruiting metrics GA4 cannot see (time-to-review, fill rate, pipeline) |

**Consent Mode v2** is mandatory given the EU market. Analytics and advertising storage default to `denied`; GTM loads in a modelling state and only sets cookies after affirmative consent. This is a legal requirement in the EU, not a preference.

## 27.2 Event naming convention

`{object}_{action}` — lowercase, snake_case, past-tense-free. Consistent parameters across events so reporting composes.

**Standard parameters on every custom event:** `page_path`, `page_type` (home · capability · industry · solution · job_search · job_detail · apply · form · insight · case_study), `audience_context` (employer · candidate · unknown).

## 27.3 Event specification

### Candidate funnel
| Event | Trigger | Key parameters |
|---|---|---|
| `job_search_performed` | Search executed | `search_term`, `location`, `filters_applied` (count), `filter_types`, `results_count` |
| `job_filter_applied` | Filter changed | `filter_name`, `filter_value`, `results_count` |
| `job_search_no_results` | Zero results | `search_term`, `filters_applied` — **the highest-value diagnostic event on the site**, directly informing content and role-sourcing decisions |
| `job_card_clicked` | Result clicked | `job_id`, `job_title`, `capability`, `position_in_results`, `search_term` |
| `job_detail_viewed` | Job page load | `job_id`, `job_title`, `capability`, `employment_type`, `delivery_model`, `location`, `rate_disclosed`, `traffic_source` |
| `job_saved` | Save clicked | `job_id`, `is_authenticated` |
| `job_shared` | Share clicked | `job_id`, `share_method` |
| `apply_started` | Apply clicked | `job_id`, `entry_point` (sticky_bar · header · rail · card) |
| `apply_step_completed` | Step advanced | `job_id`, `step_number`, `step_name`, `time_on_step` |
| `apply_resume_uploaded` | Upload complete | `file_type`, `file_size_kb`, `parse_status`, `parse_confidence` |
| `apply_abandoned` | Exit mid-flow | `job_id`, `last_step`, `time_in_flow` — **drives the drop-off analysis that improves completion rate** |
| `apply_validation_error` | Validation fails | `field_name`, `error_type`, `step_number` |
| `application_submitted` ★ | Success | `job_id`, `capability`, `employment_type`, `application_id`, `time_to_complete`, `used_resume_parse` |
| `resume_submitted` ★ | General submission | `capability`, `source_page` |
| `job_alert_created` ★ | Alert created | `filters`, `frequency`, `source_page` |

### Employer funnel
| Event | Trigger | Key parameters |
|---|---|---|
| `employer_cta_clicked` | Any employer CTA | `cta_label`, `cta_location`, `page_type` |
| `capability_page_viewed` | Capability page | `capability`, `live_job_count` |
| `lead_form_started` | First field focus | `form_type`, `source_page` |
| `lead_form_step_completed` | Step advanced | `form_type`, `step_number` |
| `lead_form_abandoned` | Exit mid-form | `form_type`, `last_field`, `completion_pct` |
| `lead_submitted` ★ | Success | `form_type`, `capability`, `positions_count`, `timeline`, `delivery_model`, `lead_id`, `company_size` |
| `gated_content_downloaded` ★ | Gated asset | `asset_name`, `asset_type`, `source_page` |
| `capability_overview_downloaded` ★ | PDF download | `source_page` |
| `calendar_booking_started` | Book-a-call clicked | `source_page` |

### Engagement
`newsletter_subscribed` ★ · `insight_read` (`scroll_depth ≥ 75%`, `read_time`) · `case_study_viewed` · `faq_expanded` (`question`) · `phone_clicked` ★ · `email_clicked` ★ · `nav_mega_menu_opened` · `filter_sheet_opened` · `video_played`

### Technical
`js_error` · `api_error` (`endpoint`, `status_code`) · `slow_page_load` (LCP > 4s) · `form_submission_failed`

## 27.4 Conversions (GA4 key events)

Marked as key events: `application_submitted`, `lead_submitted`, `resume_submitted`, `job_alert_created`, `gated_content_downloaded`, `capability_overview_downloaded`, `newsletter_subscribed`, `phone_clicked`, `email_clicked`.

**Assigned values** so GA4 can optimise and report meaningfully — approximate expected value, not revenue:
`lead_submitted` 500 · `capability_overview_downloaded` 100 · `gated_content_downloaded` 50 · `application_submitted` 15 · `resume_submitted` 10 · `job_alert_created` 5 · `newsletter_subscribed` 3.

Without values, GA4 treats a newsletter signup and an enterprise lead identically, which makes every channel report misleading.

## 27.5 Dashboards

| Dashboard | Audience | Contents |
|---|---|---|
| **Executive** | Leadership, monthly | Leads, applications, organic sessions, conversion rates, top capabilities by lead volume, cost per lead by channel |
| **Candidate funnel** | Marketing, weekly | Search → detail → apply → complete, with step-level drop-off; zero-result searches; top skills and locations searched |
| **Employer funnel** | Sales + marketing, weekly | Entry page → capability/solution → form start → submit; form abandonment by field; lead quality by source |
| **SEO** | Marketing, weekly | Organic by page type, Google Jobs impressions and clicks, indexed job count, ranking movement on target terms, Core Web Vitals |
| **Content** | Marketing, monthly | Traffic and assisted conversions per article, gated download rate, link acquisition |

## 27.6 Implementation notes

- **UTM discipline:** a documented convention (`utm_source`, `utm_medium`, `utm_campaign`, `utm_content`) captured into `leads` on submission so offline sales outcomes can be attributed back to campaigns.
- **Server-side event mirroring** for the four primary conversions, via the GA4 Measurement Protocol, so ad-blockers and ITP do not silently undercount the events the business is measured on.
- **No PII in analytics — ever.** No email addresses, names or resume content in event parameters. Internal IDs only, which is also a GDPR requirement.
- **Search Console** verified for both the root domain and the job sitemap; Google Jobs performance monitored weekly.

---

# 28. Integrations

## 28.1 MVP integrations

| Integration | Purpose | Notes |
|---|---|---|
| **Resend** | All transactional email | Dedicated sending subdomain, SPF/DKIM/DMARC |
| **Cloudflare R2** | Resume and document storage | S3-compatible, no egress fees |
| **Cloudflare Turnstile** | Bot protection on all public forms | Invisible; no completion cost |
| **Anthropic API** | Resume parsing, skills extraction, JD drafting | Per §19 |
| **Google Analytics 4 + GTM** | Analytics | Consent Mode v2 |
| **Google Search Console** | Organic and Google Jobs monitoring | |
| **Google Indexing API** | Immediate ping on job publish/close | **Materially improves Google Jobs freshness** |
| **Sentry** | Error and performance monitoring | |
| **Upstash Redis** | Rate limiting and caching | |
| **Slack** | Lead and high-priority application alerts | Incoming webhook. Cheapest possible improvement to lead response time |
| **Cal.com** or Calendly | "Book a 15-minute call" | Embedded, not a redirect |
| **Neon** | PostgreSQL | Branch-per-preview |

## 28.2 Phase 2 integrations

| Integration | Purpose | Trigger to build |
|---|---|---|
| **CRM (HubSpot or Salesforce)** | Lead sync, pipeline, nurture | When sales outgrows the admin lead queue — realistically once lead volume exceeds ~40/month |
| **ATS (Bullhorn / Ceipal / JobDiva)** | Two-way job and candidate sync | If Vertis adopts a commercial ATS. The service layer is the designed seam |
| **LinkedIn Apply Connect** | Apply with LinkedIn; job syndication | High candidate-experience value; needs a partner integration |
| **Indeed / Dice / ZipRecruiter feeds** | Job syndication via XML feed | The `/api/feed/jobs.xml` endpoint already exists in the design |
| **Google Jobs enhanced** | Already covered by `JobPosting` schema | Ongoing optimisation, not a new integration |
| **DocuSign** | Consultant onboarding paperwork | Only if onboarding moves onto the platform |
| **Marketing automation** | Nurture sequences | Bundled with CRM |
| **Background check provider** (Checkr, HireRight) | Automate stage 4 of vetting | Only if the volume justifies it |

## 28.3 Explicitly not integrating

| Not building | Why |
|---|---|
| **Payment processing** | No transaction happens on the website. Client invoicing is a finance-system concern |
| **Video interviewing** | Recruiters use existing tools. Building or embedding this adds surface area and legal exposure for no gain |
| **Live chat / chatbot** | Contradicts the positioning (§19.2). If a contact channel is needed, a callback request is better and cheaper |
| **Multiple job-board scrapers** | Vertis posts its own roles. Aggregating third-party jobs would make it a job board, which §2.3 excludes |
| **Social media auto-posting** | Low value, high maintenance. Manual posting with prepared assets is better |

## 28.4 Integration architecture principles

1. **Every external call goes through the service layer**, never directly from a component. This is what makes swapping an email provider or adding an ATS a contained change.
2. **Every integration is behind a feature flag** and degrades gracefully — an email provider outage must never block an application submission. Queue and retry.
3. **Webhooks are signature-verified and idempotent.** Duplicate deliveries are expected and must be harmless.
4. **Every outbound call is logged** with latency and status, and has a timeout and a retry policy with exponential backoff.
5. **No integration holds candidate PII that Vertis does not control**, except where a signed DPA exists and the sub-processor is published.


---

# 29. Component Architecture

## 29.1 Principles

1. **Composition over configuration.** A component with 15 boolean props is a design-system failure. Compose small pieces.
2. **Server by default.** `'use client'` is an explicit decision requiring interactivity, not a default.
3. **Content-agnostic.** Components accept data; they never fetch it. Data fetching lives in server components and the service layer.
4. **One component, one responsibility.** `JobCard` renders a job. It does not fetch, save, or navigate on its own.
5. **Variants via `cva`**, not conditional class strings.

## 29.2 Component inventory

### Primitives (`components/ui/`) — headless-backed, fully styled by us
`Button` · `IconButton` · `Input` · `Textarea` · `Select` · `Combobox` · `Checkbox` · `RadioGroup` · `Switch` · `Slider` · `Chip` · `Badge` · `Avatar` · `Tooltip` · `Dialog` · `Sheet` · `Popover` · `DropdownMenu` · `Tabs` · `Accordion` · `Breadcrumb` · `Pagination` · `Skeleton` · `Spinner` · `Toast` · `Alert` · `Separator` · `ScrollArea` · `Table` · `Progress` · `VisuallyHidden`

### Layout (`components/layout/`)
| Component | Configurable | Notes |
|---|---|---|
| `Header` | `variant: transparent \| solid`, `theme: light \| dark` | Owns sticky/condense/hide logic |
| `MegaMenu` | `config` object per menu | Data-driven — menus defined in `config/navigation.ts`, not hardcoded JSX |
| `MobileDrawer` | — | `<dialog>`, focus trap |
| `Footer` | `variant: full \| compact` | Compact used on apply and form pages |
| `Container` | `size: default \| wide \| narrow` | |
| `Section` | `background: white \| mist \| ink`, `spacing: default \| feature \| compact` | **The most-used layout component.** Enforces the §22.4 rhythm globally |
| `Grid` | `cols`, `gap`, responsive | |
| `Breadcrumbs` | `items` | Emits `BreadcrumbList` schema |
| `SkipLink` | — | |

### Marketing blocks (`components/blocks/`) — page sections
| Component | Key props | Reuse |
|---|---|---|
| `Hero` | `variant: home \| page \| capability \| industry \| compact`, `eyebrow, title, subtitle, primaryCta, secondaryCta, showJobSearch, media, background` | **Every page.** Highest-reuse component on the site |
| `TrustBar` | `metrics[]`, `showLogos`, `variant` | Home, Hire Talent, About |
| `StatsRow` | `stats[]`, `columns`, `animate` | Home, About, capability, industry |
| `LogoCloud` | `logos[]`, `label`, `grayscale` | Home, Hire Talent |
| `CardGrid` | `items[]`, `renderCard`, `columns`, `layout: uniform \| asymmetric` | Generic grid wrapper — capability, industry, solution, insight grids all use it |
| `FeatureSplit` | `media, content, mediaPosition, background` | Candidate lane, delivery detail, about sections |
| `ProcessSteps` | `steps[]`, `orientation`, `numbered` | Vetting, solution pages, candidate hub |
| `ComparisonTable` | `columns[]`, `rows[]`, `responsive: stack \| scroll` | Delivery models, engagement models, solution pages |
| `CaseStudyFeature` | `caseStudy`, `variant: featured \| compact` | Home, capability, industry, solution |
| `TestimonialGrid` | `testimonials[]`, `columns` | Home, Hire Talent, candidate hub |
| `InsightGrid` | `posts[]`, `columns`, `showFilters` | Home, insights hub, capability, industry |
| `FAQ` | `items[]`, `schema: boolean` | Emits `FAQPage` schema when `schema` is true |
| `CtaBand` | `variant: employer \| candidate \| dual`, `title, subtitle, primaryCta, secondaryCta, reassurances[]` | **Every page ends with one** |
| `NewsletterBand` | `variant` | Footer, insights |
| `RichText` | `content` | Sanitised CMS output with prose styling |

### Job platform (`components/jobs/`)
| Component | Props | Client? |
|---|---|---|
| `JobSearchBar` | `variant: hero \| page \| compact`, `defaultValues`, `onSearch` | Client |
| `JobFilters` | `facets`, `activeFilters`, `onChange`, `variant: rail \| sheet` | Client |
| `JobFilterChips` | `activeFilters`, `onRemove`, `onClearAll` | Client |
| `JobCard` | `job`, `variant: default \| compact \| featured`, `showSave`, `position` | Server + client save button |
| `JobList` | `jobs[]`, `loading`, `emptyState` | Server |
| `JobDetailHeader` | `job` | Server |
| `JobApplyCard` | `job`, `sticky` | Client |
| `JobStickyBar` | `job` | Client, mobile |
| `RecruiterCard` | `recruiter`, `variant` | Server |
| `SimilarJobs` | `jobId`, `jobs[]` | Server |
| `SaveJobButton` | `jobId`, `variant: icon \| labelled` | Client |
| `ShareJobButton` | `job` | Client |
| `JobAlertPrompt` | `filters`, `variant: inline \| band` | Client |
| `JobSort` | `value`, `onChange` | Client |
| `JobEmptyState` | `activeFilters`, `onClearFilter` | Client |
| `JobPostingSchema` | `job` | Server, renders JSON-LD |

### Forms (`components/forms/`)
| Component | Notes |
|---|---|
| `FormField` | Label + control + helper + error. **Every field uses this** — the single point where accessibility is guaranteed |
| `FormStep` | Step wrapper with validation gating |
| `FormProgress` | Step indicator |
| `ResumeUpload` | Drag-drop, validation, parse status, error recovery |
| `SkillsInput` | Chip multi-select with autocomplete against the skills taxonomy |
| `LocationInput` | Hierarchical combobox |
| `PhoneInput` | International formatting |
| `ConsentCheckbox` | Required consent with inline retention statement |
| `ApplicationForm` | Composes the three steps |
| `RequestTalentForm` | Two-step employer form |
| `ContactForm` | `intent` prop swaps the field set — **the one dynamic form system from §14** |
| `SubmitResumeForm` | General bench submission |
| `JobAlertForm` | Alert creation |
| `NewsletterForm` | |
| `GatedDownloadForm` | Three fields |
| `FormSuccess` | Shared success surface with next-step slots |

### Admin (`components/admin/`)
`AdminShell` · `AdminSidebar` · `DataTable` (sortable, filterable, selectable, virtualised) · `KanbanBoard` · `DetailPanel` · `StatusSelect` · `NotesThread` · `ResumeViewer` · `MetricCard` · `Chart` · `BulkActionBar` · `CommandPalette` · `ActivityFeed` · `RichTextEditor`

### SEO (`components/seo/`)
`JsonLd` · `OrganizationSchema` · `JobPostingSchema` · `BreadcrumbSchema` · `FaqSchema` · `ArticleSchema` · `Metadata` helpers

## 29.3 The five highest-reuse components

Getting these right is disproportionately important, because a flaw in any of them propagates everywhere:

1. **`Section`** — every page section. Owns background, vertical rhythm and container width. One component enforcing the entire spacing system.
2. **`Hero`** — every page. Five variants covering home, standard page, capability, industry and compact form pages.
3. **`CtaBand`** — every page ends with one. Three variants.
4. **`CardGrid` + `renderCard`** — every card section. Prevents six near-identical grid implementations.
5. **`FormField`** — every input on the site. The single place where labels, errors, ARIA wiring and focus behaviour are guaranteed correct.

## 29.4 What should *not* be a shared component

- **Page-specific compositions.** The homepage's asymmetric capability grid is a composition of `Section` + `CardGrid` + `CapabilityCard`, not a `HomeCapabilitiesSection` component.
- **One-off layouts.** If it is used once, it lives in the route folder.
- **Anything with more than three variants.** Three is the signal to split into separate components.

---

# 30. Project Structure

```
vertis-global/
├── app/
│   ├── (marketing)/                    # SSG/ISR group, shared marketing layout
│   │   ├── page.tsx                    # Home
│   │   ├── hire-talent/
│   │   │   ├── page.tsx
│   │   │   ├── request-talent/page.tsx
│   │   │   ├── vetting-process/page.tsx
│   │   │   ├── engagement-model/page.tsx
│   │   │   └── compliance/page.tsx
│   │   ├── solutions/[[...slug]]/page.tsx
│   │   ├── capabilities/[[...slug]]/page.tsx
│   │   ├── industries/[[...slug]]/page.tsx
│   │   ├── locations/[[...slug]]/page.tsx
│   │   ├── insights/
│   │   │   ├── page.tsx
│   │   │   ├── [slug]/page.tsx
│   │   │   ├── category/[category]/page.tsx
│   │   │   └── salary-guides/[[...slug]]/page.tsx
│   │   ├── case-studies/[[...slug]]/page.tsx
│   │   ├── about/[[...slug]]/page.tsx
│   │   ├── candidates/[[...slug]]/page.tsx
│   │   ├── contact/page.tsx
│   │   ├── legal/[slug]/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (jobs)/
│   │   ├── jobs/
│   │   │   ├── page.tsx                # Search
│   │   │   ├── [slug]/
│   │   │   │   ├── page.tsx            # Detail
│   │   │   │   └── apply/
│   │   │   │       ├── page.tsx
│   │   │   │       └── success/page.tsx
│   │   │   ├── skill/[skill]/page.tsx
│   │   │   ├── category/[category]/page.tsx
│   │   │   ├── location/[...location]/page.tsx
│   │   │   └── type/[type]/page.tsx
│   │   └── layout.tsx
│   │
│   ├── (account)/account/…             # Phase 3, noindex
│   ├── (admin)/admin/[[...segments]]/  # Payload admin + custom views
│   │
│   ├── api/
│   │   ├── v1/
│   │   │   ├── jobs/…
│   │   │   ├── applications/route.ts
│   │   │   ├── candidates/…
│   │   │   ├── leads/route.ts
│   │   │   ├── job-alerts/…
│   │   │   ├── resumes/parse/route.ts
│   │   │   └── admin/…
│   │   ├── webhooks/{resend,payload}/route.ts
│   │   ├── cron/{alerts,expire-jobs,sitemap,retention}/route.ts
│   │   ├── feed/jobs.xml/route.ts
│   │   └── health/route.ts
│   │
│   ├── sitemap.ts
│   ├── robots.ts
│   ├── layout.tsx
│   ├── not-found.tsx
│   ├── error.tsx
│   └── globals.css
│
├── components/
│   ├── ui/            # primitives
│   ├── layout/        # header, footer, section, container
│   ├── blocks/        # marketing page sections
│   ├── jobs/          # job platform
│   ├── forms/         # form system
│   ├── admin/         # admin UI
│   └── seo/           # schema components
│
├── lib/
│   ├── db/
│   │   ├── schema/            # Drizzle table definitions, one file per domain
│   │   ├── migrations/
│   │   ├── queries/           # reusable typed queries
│   │   ├── seed/
│   │   └── index.ts
│   ├── auth/                  # session, RBAC, guards
│   ├── validation/            # Zod schemas — shared client + server
│   ├── email/                 # Resend client + send functions
│   ├── storage/               # R2 client, signed URLs, upload validation
│   ├── ai/                    # parsing, embeddings, drafting; one file per feature
│   ├── search/                # query builder, ranking, facets
│   ├── analytics/             # typed event helpers
│   ├── cache/                 # Redis + revalidation helpers
│   ├── rate-limit/
│   └── utils/                 # cn, formatters, slugify, dates
│
├── services/                  # BUSINESS LOGIC — the swap seam (§15.6)
│   ├── jobs.service.ts
│   ├── applications.service.ts
│   ├── candidates.service.ts
│   ├── leads.service.ts
│   ├── alerts.service.ts
│   ├── search.service.ts
│   ├── resume.service.ts
│   └── notifications.service.ts
│
├── payload/
│   ├── collections/           # Jobs, Applications, Candidates, Leads, Posts, …
│   ├── globals/               # site settings, navigation
│   ├── access/                # role-based access functions
│   ├── hooks/                 # revalidation, notifications, audit logging
│   ├── fields/                # reusable field groups (SEO, media)
│   └── payload.config.ts
│
├── emails/                    # React Email templates
├── config/
│   ├── navigation.ts          # menu structure — data, not JSX
│   ├── site.ts                # name, URLs, socials, contact
│   ├── seo.ts                 # defaults, templates
│   └── analytics.ts           # event names as typed constants
├── types/                     # shared TS types, generated DB types
├── hooks/                     # useJobSearch, useFilters, useMediaQuery, useStickyHeader…
├── content/                   # MDX for legal pages (version-controlled)
├── public/
├── tests/
│   ├── e2e/                   # Playwright: apply flow, request talent, search
│   ├── unit/
│   └── a11y/                  # axe-core
├── scripts/                   # seed, migrate, reindex, generate-sitemap
├── .env.example
├── drizzle.config.ts
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

**Structural rationale**
- **Route groups** `(marketing)` / `(jobs)` / `(admin)` allow different layouts, rendering strategies and headers without affecting URLs.
- **`services/` is deliberately separate from `lib/`.** `lib` is infrastructure; `services` is business logic. This separation is what makes the ATS swap in §15.6 a contained change.
- **Catch-all routes `[[...slug]]`** for solutions, capabilities, industries and locations mean one file handles hub and detail, with content driven by the CMS — no new file per page.
- **`config/navigation.ts` as data** means menu changes are edits to an object, not to JSX across multiple components.
- **`content/` for legal pages as MDX** keeps them version-controlled and reviewable in pull requests, which is appropriate for documents with legal significance.

---

# 31. MVP Scope

## 31.1 Must have — MVP (launch blockers)

**Marketing site**
Home · Hire Talent · Request Talent · Vetting Process · Engagement Model · Solutions hub + 3 engagement models + Delivery Models · Capabilities hub + 5 capability pages · Industries hub + 5 industry pages · About · Contact · Candidates hub · Submit Resume · Job Alerts · 6 legal pages · 404/500

**Job platform**
Job search with all 10 filters · job detail with full `JobPosting` schema · 3-step application with resume parsing · application confirmation · saved jobs (localStorage) · job alerts with double opt-in · programmatic skill/category/location/type facets with index gating

**Backend**
PostgreSQL with the full schema · Payload CMS with all collections · admin job management · application pipeline · lead queue with scoring and routing · candidate records · resume storage with signed URLs and virus scanning · all transactional email · role-based access · audit logging

**AI**
Resume parsing + skills extraction · JD drafting assistant · semantic similar-jobs

**Technical**
All schema markup · sitemaps · GA4 + GTM with Consent Mode v2 · Search Console · Sentry · security headers · rate limiting · Turnstile · WCAG 2.2 AA · Core Web Vitals targets met

**Content**
All page copy written · 5 capability pages with full role and platform lists · 5 industry pages at 900+ words each · 3 case studies · 6 testimonials · 4 launch articles · recruiter profiles · real office addresses

## 31.2 Should have — weeks 1–8 post-launch

Contract Staffing / Contract-to-Hire / Direct Hire solution pages · Compliance & Governance page · Leadership page · How We Work page · Careers at Vertis · flagship salary guide · gated capability overview · location pages for the top 5 markets · Cal.com booking · Slack alerts · admin analytics dashboard · abandoned-application recovery email · candidate FAQ with `FAQPage` schema

## 31.3 Nice to have — months 3–6

Candidate accounts (profile, application tracking, saved jobs, alert management) · match scoring for recruiters (with the §19.3 governance) · resume summarisation · natural-language job search · alert relevance ranking · job feed syndication to Indeed/Dice · CRM integration · workforce report · advanced admin analytics · A/B testing framework · saved searches

## 31.4 Future — phase 2 and beyond

ATS integration · LinkedIn Apply Connect · public sector industry page and contract vehicles · EMEA/APAC location pages *(gated on real delivery capability — see A4)* · multi-language · candidate referral programme · consultant portal (timesheets, documents) · client portal (requirement status, submitted candidates) · rate benchmarking product from internal data · hiring-demand insights for clients

## 31.5 Explicitly out of scope

Third-party job aggregation · video interviewing · live chat/chatbot · payment processing · dark mode · native mobile apps · multi-tenancy · AI candidate screening or auto-rejection · executive search and professional (non-technology) staffing service lines

---

# 32. Development Roadmap

16 weeks to production. **The critical sequencing decision: the marketing site launches at week 8, ahead of the job platform.** SEO indexing has a lead time measured in months, so starting it eight weeks earlier is worth substantially more than launching everything at once.

### Phase 1 — Foundation (weeks 1–2)
**Features:** Repository, Next.js 16 + TS strict + Tailwind v4 · design tokens implemented as CSS custom properties · UI primitives on Radix · `Section`/`Container`/`Grid` · Header with all three sticky states, mega menus, mobile drawer · Footer · Postgres provisioned, Drizzle configured, initial schema and migrations · Payload installed with auth and roles · CI/CD with preview deploys · Sentry · linting, a11y and bundle-size gates.
**Dependencies:** design tokens signed off; brand assets supplied.
**Priority:** P0. **Output:** deployable shell with working navigation and a component library.

### Phase 2 — Core UI (weeks 2–4)
**Features:** All marketing block components (`Hero`, `TrustBar`, `StatsRow`, `CardGrid`, `ProcessSteps`, `ComparisonTable`, `CtaBand`, `FAQ`, `TestimonialGrid`, `LogoCloud`, `FeatureSplit`) · form system (`FormField`, validation, error handling) · all card variants · Payload collections for content · SEO component layer.
**Dependencies:** Phase 1. **Priority:** P0. **Output:** every building block needed to assemble marketing pages.

### Phase 3 — Marketing pages (weeks 4–7)
**Features:** Home · Hire Talent + 4 sub-pages · Solutions hub + 4 pages · Capabilities hub + 5 pages · Industries hub + 5 pages · About · Contact with the dynamic intent router · Candidates hub · legal pages · Request Talent form with scoring and routing · lead pipeline and email notifications.
**Dependencies:** Phase 2; **final copy delivered by week 4** — this is the most common schedule risk on projects of this type.
**Priority:** P0. **Output:** complete marketing site.

### Phase 4 — Pre-launch hardening and **MARKETING LAUNCH** (week 8)
**Features:** All schema markup · sitemaps · GA4/GTM with Consent Mode · Search Console · security headers · rate limiting · Turnstile · accessibility audit and remediation · performance tuning to targets · cross-browser and device testing · penetration test on forms · legal review of all claims and `[CLEAR-LEGAL]` items · DNS and go-live.
**Priority:** P0. **Output:** ★ **Marketing site live. SEO clock starts.**

### Phase 5 — Job platform (weeks 8–11)
**Features:** Jobs schema and search infrastructure (FTS, GIN, trigram) · job search page with all filters, URL state, sorting, pagination · JobCard and empty states · job detail with sticky rail and mobile bottom bar · `JobPosting` schema · similar jobs · saved jobs · programmatic facet pages with index gating · job sitemap · Google Indexing API.
**Dependencies:** Phases 1–3. **Priority:** P0. **Output:** candidates can find roles; Google Jobs indexing begins.

### Phase 6 — Application system (weeks 11–13)
**Features:** 3-step apply flow · resume upload with validation and virus scanning · AI resume parsing and prefill with full failure handling · skills extraction · application submission and dedupe · confirmation and recruiter emails · success experience · job alerts with double opt-in and digest emails · Submit Resume flow · abandoned-application recovery.
**Dependencies:** Phase 5; R2 and Anthropic API configured. **Priority:** P0. **Output:** the complete candidate funnel.

### Phase 7 — Admin dashboard (weeks 12–14, overlapping)
**Features:** Admin shell and navigation · job management with the editor and live preview · application kanban and detail panel with logged resume access · candidate bench search · lead queue with SLA indicators and assignment · content management · recruiter and client management · audit log · `⌘K` command palette · analytics dashboard.
**Dependencies:** Phases 5–6. **Priority:** P0 (the platform is unusable without it). **Output:** the team can operate the site without developer involvement.

### Phase 8 — SEO and content production (weeks 13–15)
**Features:** Full schema validation across all templates · internal linking audit · programmatic page QA and threshold verification · metadata review on every page · OG image generation · 4 launch articles · 3 case studies · salary guide production begins · Search Console monitoring configured.
**Priority:** P1. **Output:** SEO-complete site with launch content.

### Phase 9 — Analytics, testing and QA (weeks 14–16)
**Features:** Full event implementation and verification in GA4 DebugView · server-side conversion mirroring · dashboards built · Playwright E2E on all critical paths · accessibility audit including screen-reader testing · load testing on job search and apply · security review · cross-browser matrix · UAT with real recruiters using the admin.
**Priority:** P0. **Output:** verified, tested platform.

### Phase 10 — Launch and stabilisation (week 16 + 4 weeks)
**Features:** Production data migration and job import · DNS cutover for the job platform · monitoring and alerting live · runbook and admin training · 4-week hypercare with daily monitoring in week 1, then weekly.
**Priority:** P0. **Output:** ★ **Full platform live.**

### Post-launch cadence
Weeks 17–20: "should have" scope. Months 3–6: "nice to have" plus a content programme of 2–4 articles per month. Month 6+: A/B testing once volume permits, phase-2 integrations, candidate accounts.

## 32.2 Critical path and risks

| Risk | Impact | Mitigation |
|---|---|---|
| **Copy not ready by week 4** | Blocks Phase 3, cascades to everything | Copy is the first deliverable after blueprint approval. §14.6 gives the direction; production starts week 1 in parallel |
| **`[CLEAR-LEGAL]` items unresolved** | Cannot publish metrics or client references | Legal review requested at blueprint approval, not at week 7 |
| **No authentic photography** | Falls back to abstract treatment | Decision required by week 3; photography commissioned at approval if wanted |
| **Real job data unavailable at Phase 5** | Cannot test search or launch Google Jobs | Job import format agreed by week 8 |
| **Office addresses and leadership bios missing** | Blocks About, Locations, footer schema | Requested at approval |
| **Scope creep into phase-2 features** | Delays launch | This document is the scope contract. Changes are logged, estimated, and scheduled — not absorbed |

---

# 33. Competitor Benchmark

**Method note.** This is a pattern analysis of the established UX conventions of these six firms, based on how enterprise staffing sites in this category are structured. It is not a live audit conducted today. **Before Phase 3, a formal audit of the current live sites should be commissioned** — competitor sites change, and a fresh review will sharpen the differentiation decisions. The strategic conclusions below are structural and unlikely to shift.

## 33.1 The six, by archetype

| Firm | Archetype | Does well | Weakness |
|---|---|---|---|
| **Kelly Services** | Global generalist, consumer-facing | Enormous job inventory; strong candidate self-service; broad specialty coverage; long-established brand trust | Homepage reads as a consumer job portal. The enterprise workforce-solutions story is buried. Breadth dilutes any specific expertise claim. Heavy IA with many overlapping paths |
| **TEKsystems** | IT staffing + services, enterprise-led | Genuinely enterprise-credible. Strong services/consulting positioning. Good thought leadership. Confident, restrained design that signals scale | Candidate experience is secondary to the enterprise story. Job search is less prominent and less refined than the marketing site. Positioning tilts toward services, which can obscure the staffing offer |
| **Insight Global** | US IT/professional staffing, relationship-led | Warm, human, differentiated brand voice in a cold category. Clear service structure. Effective use of people photography | Almost entirely US-onshore — no global delivery narrative. Lighter on methodology and technology proof. Less depth for procurement-stage evaluation |
| **Randstad** | Global generalist, multi-country | Massive scale and geographic reach. Strong market data and insight publishing. Mature per-country IA | Fragmented across country sites, so global capability reads as a federation rather than one offer. Corporate tone. Heavy consent and localisation layers slow the first experience |
| **Robert Half** | Professional/finance specialist, content-led | **The Salary Guide is the category's best content asset** — a masterclass in content-led SEO and lead generation. Clear specialisation. Strong brand recall in finance and accounting | Weaker in deep technology staffing. Design is conventional. Enterprise workforce-solutions positioning is thinner than the specialist positioning |
| **Adecco** | Global generalist, high volume | Enormous reach and inventory. Strong employer-brand content. Mature multi-country operation | Same federation problem as Randstad. Consumer-portal feel on candidate paths. Technology staffing is one of many verticals, so depth is hard to demonstrate |

## 33.2 Patterns users now expect (build these — they are table stakes)

1. Prominent, always-available job search with keyword + location.
2. A clear, separate "employers" path from the top navigation.
3. Service/solution taxonomy explained in plain language.
4. Industry-specific pages.
5. Location/office pages.
6. Case studies with metrics.
7. A salary or rate guide.
8. Resume submission independent of a specific role.
9. Job alerts.
10. Mobile-first job search and application.
11. Named, human recruiter presence.
12. Visible trust metrics near the top of the homepage.

**Failing to deliver any of these is a competitive deficit, not a differentiation opportunity.**

## 33.3 Common weaknesses across the set — Vertis's openings

| Weakness | Frequency | Vertis's response |
|---|---|---|
| **Delivery geography treated as a footnote or a country-site split** | Near-universal | **The core differentiator.** A dedicated Delivery Models page selling geography as a client choice under one quality standard. No competitor markets this as a single decision |
| **Vetting described in vague terms** ("rigorous process") | Very common | A named four-stage process on its own page, with the "2–3 profiles, not 20" promise as the headline. Concrete where the category is abstract |
| **Rates almost never published** | Universal on job postings | Publish rate ranges on as many postings as commercially possible. Directly improves Google Jobs ranking, click-through and application rate — and is a trust signal in a category that hides pricing |
| **Application flows are long and account-gated** | Common | Three steps, no account, resume-parse prefill. Targeting 65% completion against a category average near 35% |
| **Generic industry pages that are keyword pages with a stock photo** | Very common | The Regulatory & Operating Context section, which only a firm with real sector experience can write |
| **No response after application** | The most-cited candidate complaint in the category | Every candidate receives a closing email. Response-time commitment published. Cheapest reputational advantage available |
| **Capability described by job family, not by named platform** | Common | Name Snowflake, Databricks, S/4HANA, ServiceNow, UiPath explicitly. This is what a hiring manager searches for and what proves depth |
| **Commercial model opaque until a sales call** | Universal | A published Engagement Model page: rate card structure, SOW vs T&M, onboarding timeline, replacement terms. Removes a major evaluation barrier |
| **Slow, consent-heavy, script-laden pages** | Common on the global generalists | Performance and Core Web Vitals as a design constraint from day one |

## 33.4 The differentiation summary

Vertis cannot out-scale Kelly, Randstad or Adecco, and should not try. It cannot out-brand TEKsystems in US IT staffing on recognition alone.

**What it can do is be the most specific, most transparent and most operationally credible firm in the set.** Named platforms instead of categories. A published vetting process instead of a claim. Rate ranges instead of "competitive." A commercial model on the website instead of behind a sales call. And one genuine structural differentiator — delivery geography as the client's choice under a single quality standard — that no competitor in this group markets clearly.

Specificity is the strategy. Every design and content decision in this document serves it.

---

# 34. Final Recommended Architecture

Decisions, not options.

## 34.1 Recommended sitemap
As specified in §5.2. **~48 editorial pages at MVP** plus programmatic job pages. Core structure: Home · Hire Talent (+4) · Solutions (+4) · Capabilities (+5) · Industries (+5) · Jobs (+ programmatic) · Candidates (+4) · About (+3) · Locations · Insights · Case Studies · Contact · Legal (6).

## 34.2 Recommended navigation
Left: logo. Centre: **Hire Talent · Solutions · Capabilities · Industries · Insights · About** (six items, four mega menus). Right: **`[Find Jobs · N live]`** (outlined) + **`[Request Talent]`** (filled). Sticky with three states. Mobile: full-screen drawer with both CTAs pinned at the top above accordion navigation.

## 34.3 Recommended homepage structure
Hero (employer-led, embedded candidate search) → Trust Bar → Capabilities → Delivery Models → Why Vertis → Candidate Lane → Industries → Case Study → Testimonials → Insights → Employer CTA Band → Footer. Twelve sections, alternating white / mist / ink.

## 34.4 Recommended technology stack
**Next.js 16 (App Router) · TypeScript strict · Tailwind CSS v4 · Radix UI · Lucide · Motion · React Hook Form + Zod · PostgreSQL 16 on Neon · Drizzle ORM · Payload CMS 3 (embedded) · Cloudflare R2 · Upstash Redis · Resend + React Email · Cloudflare Turnstile · Anthropic API · Vercel · Sentry · GA4 + GTM.**

## 34.5 Recommended backend architecture
Single Next.js application with route groups for marketing, jobs, account and admin. Server Components by default. Server Actions for first-party forms; versioned REST at `/api/v1/` for the admin SPA, integrations, webhooks and cron. **A distinct `services/` layer holding all business logic** — the seam that makes a future ATS integration a contained change. Payload CMS embedded on the same Postgres, providing collections, auth, RBAC and the admin shell, extended with custom React views for recruiting workflows.

## 34.6 Recommended database
**PostgreSQL 16.** ~24 tables per §16. Postgres full-text search (`tsvector` + GIN + `pg_trgm`) — **not Elasticsearch**. `pgvector` for semantic similarity, in the same database. Partial indexes on `status='published'` for the hot path. Soft deletes, an audit log on every PII access, and automated retention enforcement.

## 34.7 Recommended design direction
**Ink-dominant, blue for action, cyan accent used surgically — all sampled from the Vertis Global mark.** `#091426` ink · `#1B4DE4` Vertis Blue · `#1EB8F0` cyan · `#E0357D` magenta (severely restricted) · `#F3F6FB` mist. The brand gradient `#1B4DE4 → #1EB8F0` appears in four defined places only. **Funnel Display** headings (continuity with your existing work) + **Inter** for body and UI (better for dense job-platform interfaces) + **JetBrains Mono** for IDs and rates. 1280px container, 112/144px section rhythm, 10px card radius, hairline borders with shadow only on hover, restrained motion (fade + 4–8px rise only). Authentic photography or nothing — never stock.

## 34.8 Recommended MVP
The full §31.1 scope. Marketing site plus complete job platform plus admin. **Marketing site live at week 8, full platform at week 16.** Do not add candidate accounts, CRM, ATS or match scoring to MVP — none of them is required to generate a lead or take an application.

## 34.9 Recommended AI features
**MVP, four:** resume parsing → prefill · skills extraction and normalisation · JD drafting assistant (admin) · semantic similar-roles.
**Phase 2, with governance:** advisory match scoring · resume summarisation · natural-language search · alert ranking.
**Never:** AI screening, auto-rejection, interview scoring, or AI as a marketing claim. Under the EU AI Act and NYC LL144, no AI at MVP makes or substantially assists a decision about a candidate.

## 34.10 Recommended SEO structure
`JobPosting` schema on every role, Google Indexing API on publish and close, 410 on closed roles. Capability pages as the primary commercial ranking engine. Programmatic skill/category/location/type facets **with hard index thresholds** (≥3 live roles, ≥200 unique words). Salary guides as the flagship link-earning and lead-generation asset. One page owns each primary term — no cannibalisation.

## 34.11 Recommended conversion strategy
Three funnels per §21. Targets: **65% application completion** (category average ~35%) and **55% employer form completion**. Mechanisms: resume-parse prefill, no account gate, sticky Apply, rates published, requirement-first form ordering, a "Not sure — advise me" delivery option, SLA-driven lead routing with Slack alerts. One primary CTA per page. No dark patterns.

## 34.12 Recommended development roadmap
Ten phases, 16 weeks, with the **marketing site launching at week 8** so SEO indexing starts eight weeks early. Phases: Foundation (1–2) · Core UI (2–4) · Marketing pages (4–7) · Hardening + launch (8) · Job platform (8–11) · Application system (11–13) · Admin (12–14) · SEO and content (13–15) · Analytics and QA (14–16) · Launch and hypercare (16+4).

---

## Approval checklist

Before Phase 1 begins, confirm:

- [ ] **Positioning approved** — "Onshore. Offshore. One standard." as the brand line; enterprise technology staffing (not generalist) as the category
- [ ] **Assumptions A1–A9 confirmed or corrected**, particularly **A3** (metrics cleared for public use) and **A4** (EU/APAC delivery reality vs. the global market target)
- [ ] **Sitemap approved**, including the decision not to build Executive Search, Managed Services or Professional Staffing pages
- [ ] **Five industries confirmed**; Public Sector deferred
- [ ] **Design direction approved** — ink-dominant palette, Funnel Display + Inter, the visual language in §22–23
- [ ] **Technology stack approved**, particularly Payload CMS embedded and Postgres FTS over a dedicated search service
- [ ] **AI scope approved** — four MVP features, no screening or decisioning
- [ ] **MVP scope approved** and phase-2 items accepted as post-launch
- [ ] **`[CLEAR-LEGAL]` items sent to legal:** 80+ Fortune 500 claim, client logo consents, all published metrics
- [ ] **`[CONFIRM]` items supplied:** office addresses, leadership bios and photos, certifications, case study metrics, recruiter profiles, candidate support email
- [ ] **Photography decision made** — commission authentic photography, or ship the abstract/typographic treatment
- [ ] **Copy production authorised** to start immediately in parallel with Phase 1 (critical path)
- [ ] **Job data import format agreed** for Phase 5

---

*Prepared as a pre-build blueprint for Vertis Global. No code has been written. On approval, Phase 1 begins with the design-token implementation and component foundation.*


