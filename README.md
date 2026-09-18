# Vertis Global — Website

A staffing company's digital front door. Next.js 16 · TypeScript · Tailwind v4.

**The website is not the product. The staffing service is.** The site's job is: attract → explain → build trust → connect → capture the lead.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000

| Script | Purpose |
|---|---|
| `npm run dev` | Dev server |
| `npm run build` | Production build |
| `npm run typecheck` | `tsc --noEmit` |

### Environment

The employer inquiry form delivers by email through Resend. Without these it still works — leads are logged to the server console.

```
RESEND_API_KEY=   # from resend.com
INQUIRY_TO=       # inbox that receives leads (defaults to info@vertisglobal.com)
```

## Staging deployment

**https://staging.vertisglobal.com** runs on the VPS at 160.153.176.140 (AlmaLinux 9, shared with several other sites). Ship the working tree with:

```bash
npm run deploy:staging
```

That packs the tree (no node_modules, .next, .git, env files or the dev-only hero clip options), uploads it, and on the server runs `npm ci`, `npm run build` and a zero-downtime `pm2 reload`. The build runs on the server, never locally, so native artefacts match its Node. It needs a `vertis-staging` host in `~/.ssh/config` pointing at root@160.153.176.140 with an authorised key.

How it is laid out on the box, in case something needs a hand:

| What | Where |
| --- | --- |
| App | `/var/www/vertisglobal.com/staging/app`, owned by the `vertis` user |
| Process | pm2 as `vertis`, name `vertis-staging`, `ecosystem.config.cjs` in the app dir, Next on 127.0.0.1:3010 (3001 to 3006 belong to other sites) |
| Boot | `pm2-vertis.service` (systemd, enabled) resurrects the saved pm2 list |
| nginx | `/etc/nginx/conf.d/staging.vertisglobal.com.conf`, proxies to 3010; the previous static-site config is beside it as `.bak.<date>` |
| TLS | Let's Encrypt via certbot, auto renews; it had lapsed in July and was renewed on 18 Sep 2026 |
| Logs | `/home/vertis/.pm2/logs/vertis-staging-*.log`, `/var/log/nginx/staging_vertis_*.log` |
| Env | `.env.local` in the app dir is NOT shipped by the deploy script; put `RESEND_API_KEY` and inbox overrides there by hand, then `pm2 reload vertis-staging --update-env` |

The old static export in `staging/public_html` is still on disk but nothing serves it. Production (`vertisglobal.com`) is untouched: it is still the static site in `public_html`, on its own nginx config.

## Positioning

**People first. Staffing for every kind of work.** Vertis places people from frontline and administrative roles to specialised professionals, across 18 industries in four groups. Technology staffing is *one capability*, not the identity.

Not offered, and not listed anywhere on the site: construction, real estate, media and entertainment, nonprofit, logistics, legal, life sciences, creative, clerical, education, customer service.

Headline: **"People who keep business moving."**

## Where things live

```
app/
  page.tsx            the homepage, nine sections
  actions/inquiry.ts  server action — validates and emails the employer lead
  globals.css         design tokens
components/
  hire/               the "How can we help?" modal — provider, modal, button
  blocks/             homepage sections
  layout/             Header (six links + one button), Footer
  media/Photo.tsx     every photograph on the site goes through this
  ui/                 Button, Section, Container, Eyebrow
config/
  industries.ts       29 industries in 6 groups + the 5 talent levels  ← content lives here
  photography.ts      the shot list
  navigation.ts       menus as data
  site.ts             name, tagline, contact
lib/validation/       zod schema shared by form and action
docs/                 the original blueprint (much of it now superseded — see below)
```

## The primary conversion

`Hire Talent` anywhere on the site opens one modal:

1. **How can we help?** — four plain choices (hire for a role / build a team / staff a project / not sure)
2. **Eight fields**, three optional
3. **Thanks** — with a reference number

No account, no second page. `components/hire/HireTalentModal.tsx`.

## Design system

Four colours: near-black ink, warm paper, a warm neutral ramp, one accent blue. The logo's cyan lives inside the mark only.

- **Cards are the exception.** Editorial lists, split layouts, full-bleed photography.
- **One button per section.** In-page CTAs are `.link-underline` text links.
- **Body is 17px.** The smallest style is the 13px `.eyebrow`, the only uppercase on the site.
- **Base styles live in `@layer base`.** Unlayered CSS beats Tailwind's layered utilities, so an unlayered `h1 { color }` would defeat `text-white`.
- **Put `max-w-[Nch]` on the heading, never on its wrapper.** `ch` resolves against the element's own font. On a wrapper it uses 17px body text, and a 56px heading gets squeezed to a third of its intended width. This is what produced the nine-line Industries headline.
- **A component that renders two layouts must not share toggle state between them.** The Industries accordion once set the shared index to `-1` to close, and the desktop panel crashed on `INDUSTRY_GROUPS[-1].id`, unmounting the whole section. Desktop selection and accordion expansion are separate state now.
- **No long dashes in copy.** Use a comma, a colon, or a new sentence.

## Brand

Official palette only: `#27196D` deep purple is the foundation (the `ink` token resolves to it), `#F26522` orange is the primary accent and every conversion button, `#FAA918` amber is the accent on purple, and `#F5791F #F6871D #F8931B #F99E19` are hover and gradient tones. Plus white, warm paper and a purple-biased neutral ramp. Nothing else. Orange buttons carry purple text: white on the brand orange is only 3.2:1.

The mark in `components/brand/Logo.tsx` and the favicon in `app/icon.svg` are vector reconstructions of the supplied artwork. To use the official vectors, place them in `public/brand/` as `vertis-global-logo.svg` and `vertis-global-logo-light.svg` and set `USE_OFFICIAL_ASSET` to `true` in `Logo.tsx`.

## The hero

A soft cinematic clip plays muted on a loop behind the headline, under a purple gradient that keeps the type readable. Reduced-motion users get the poster frame. If `config/hero-video.json` has no `src`, the hero falls back to the group photograph (`public/photos/hero-main.jpg`).

**The current clip** is `gen-all-trades-wide`: seven people walking toward camera who between them do every kind of work Vertis staffs. Chef whites, a technician's work shirt, a business suit, coveralls and a tool pouch, a laptop, scrubs, a senior professional. **This is the point of the shot, so keep it if you replace the clip:** the earlier `gen-team-walk` was a factory floor with hard hats, which claimed one industry and one we do not staff. Blue collar here is read through hospitality, trades and healthcare rather than hi-vis. Generated to our own brief (a Seedream 5 Pro still animated on Kling 2.5, 1080p), so there is nothing to license. Shipped files, all in `public/hero-video/`:

| File | Purpose | Weight |
| --- | --- | --- |
| `hero.mp4` | 1080p, served at 768px and up | 1.6 MB |
| `hero-mobile.mp4` | 540p, served below 768px | 0.5 MB |
| `hero-poster.jpg` | first frame, poster and reduced-motion fallback | 120 KB |

**A hero clip must be framed with margin at both edges.** The clip is 16:9 and the hero is taller, so `object-cover` trims the sides, and the taller the window the more it trims. The first take of this shot had the group running to the right edge and the two people on that end were cropped out of existence on a tall screen. The replacement is framed wide, all seven full length with clear floor either side, which is what lets the crop stay centred (`md:object-[50%_42%]`) and keep everybody. Anchoring left buys the headline more clear space but is what cut those two people off, so do not reach for it again.

A phone shows so narrow a slice that a centred crop lands between people, so below `md` it pulls right onto them (`object-[62%_45%]`). Check both breakpoints when you change the clip, and keep the reduced-motion poster `div` in step with the video.

**Playback speed is baked in, not scripted.** Generated clips walk briskly for a background loop, so `hero:encode` takes `--slow <factor>`: it retimes with `setpts` and interpolates back to 30 fps, so it is a real slow-down rather than a stutter. The shipped clip was encoded at `--slow 1.45`, taking 5.0 s to 7.3 s. Doing it here rather than with `playbackRate` keeps the hero free of JavaScript.

```bash
node scripts/encode-hero-video.mjs public/hero-video/options/gen-all-trades-wide.mp4 --slow 1.45
```

The `<video>` uses two `<source>` elements; the desktop one carries `media="(min-width: 768px)"` and comes first, so any browser that ignores `media` still gets the full-quality file.

**Choosing a different clip.** Run the dev server and open `/dev/hero-video`. Four generated clips (final quality) and twelve stock previews (watermarked), each with a "Use This Video" button. Choosing one writes `config/hero-video.json` and puts that file into the hero immediately so it can be judged in place. The page and its server action are development-only. The registry is `config/hero-video-options.ts`; the files live in `public/hero-video/options/`.

**Finalising a new choice.** The picker points the hero at the raw option, which for the generated clips is 7 to 10 MB. Encode it with `npm run hero:encode -- public/hero-video/options/<id>.mp4` (uses the `ffmpeg-static` dev dependency, no system ffmpeg needed) and set `src`, `mobile` and `poster` in `config/hero-video.json` to the three files it writes. A stock choice must first be licensed through Magnific `stock_download` (600 credits for a premium clip) and the clean file encoded the same way.

Two carried-over choices: no `mask-image` (a gradient overlay does the same job everywhere without prefixes) and no entrance fade on the backdrop (it delays the hero's moment and stalls in background tabs).

## Employers, job seekers and jobs

Three routes finish the two audiences the site is built around.

`/hire-talent` is the employer page: hero, three proof figures, the four steps from a call to a first day (its `#how-it-works` anchor is linked from the footer), the five ways to hire, what comes with every placement, who we place, FAQ, resources and a close. It is assembled almost entirely from components the service pages already use.

`/candidates` is the job seeker page, and it is deliberately ordered to earn trust before it asks for anything: what we do for you, the straight answers, how it works, the range of work, open roles, advice, FAQ, and only then the form. `#why` and `#submit-resume` are both linked from the footer.

`/jobs` opens on its own video hero (`components/jobs/JobsHero.tsx`, a candidate walking into a lobby, "Find work that moves you forward"), then what you get, how it goes, the careers inbox, and only then the listing. It used to be the listing alone, which read as a filter with nothing behind it. The copy it shares with `/candidates` lives in `config/job-seekers.ts` so the two pages cannot drift. The clip is encoded with the same script as the homepage hero: `node scripts/encode-hero-video.mjs <clip> --out public/jobs-video --name jobs-hero --slow 1.3`. `/jobs` came out of `LIGHT_HEADER_ROUTES` when it went dark, so the header overlays it.

The listing itself reads `config/jobs.ts`, filtered by arrangement and industry. **The roles are representative, not a live vacancy feed**, the page says so in a notice, and every action reads "register interest" rather than "apply", so nobody believes they have applied to an opening that does not exist. When a real feed arrives, replace `JOBS`, drop `SAMPLE_NOTICE` and change the card action. Each row deep links to `/candidates?role=<title>#submit-resume`, which prefills the form.

**Two inboxes.** `SITE.staffingEmail` (info@) takes employer and general enquiries and is every mailto on the site bar one; `SITE.careersEmail` (careers@) is for resumes and portfolios and appears on `/jobs` and `/contact`. Change either in `config/site.ts` and nothing else needs touching.

`/contact` is deliberately one form short. The employer enquiry is the Hire Talent modal, which already validates, emails and confirms, so the page routes an employer into it rather than repeating the same eight questions. Three doors (employers, job seekers, everything else), what happens next, where we are (`#offices`, which the footer's Locations link now points at), and a close. The office addresses are still `[CONFIRM]` in the footer; the contact page names the two countries and no more.

**The resume form** (`components/candidates/ResumeForm.tsx` and `app/actions/candidate.ts`) takes seven fields and an optional attachment, capped at 5MB and limited to PDF, Word, RTF or text. It emails the recruiter with the file attached and stores nothing, which is how "no candidate database" survives contact with a resume. The attachment is why `next.config.ts` raises `serverActions.bodySizeLimit`; the default 1MB would reject most CVs. `CANDIDATE_TO` overrides the inbox.

**One React 19 trap worth knowing.** React resets an uncontrolled form once its action returns, so a validation error used to wipe every field the person had typed. Both forms now echo the submitted values back in the error state and use them as the inputs' defaults. If you add a field to either form, give it a `defaultValue` from that state or it will empty itself on the first typo.

## The About page

`/about` tells the company story in the order a staffing firm actually explains itself: who we are, the numbers, what we believe, why it matters, how we work, who we are to work with, where we work, then the two doors out. It reuses `PageHero`, `WhyVertis` for the proof band and `Pathways` for the closing call to action, so nothing about the brand is restated in a second place.

**Every claim on it is one the company can stand behind.** Twenty years, 80+ Fortune 500 clients, 48 to 72 hour turnaround, the no cost replacement, onshore United States plus offshore India, eighteen industries, five levels of work. There is deliberately no founding myth, no headcount, no office list and no awards, because none of those are confirmed. If a fact is not in the company deck it does not belong on this page.

**The founder section** carries the client's own approved words from Jag, so treat that copy as signed off and do not rewrite it.

His photograph (`public/photos/founder-jag.png`, slot `founder`) is a 2.45:1 black and white frame composed with him on the right and empty black on the left, made to sit behind type. It runs full bleed under a scrim that stays strong on the left and falls to nothing on his side, so he stays black and white rather than tinted, with the crop anchored at 70 percent across because the right edge is empty shoulder. Below the large breakpoint that frame would have to zoom so far that his face landed under the paragraph, so the photograph stacks above the words instead. If the picture is ever replaced with a different crop, both the anchor and the scrim need revisiting.

`PageHero` gained a `scrim` prop for it. The About hero photograph is bright and low contrast, and the standard purple scrim erased it, so `scrim="light"` holds the purple over the copy and lets the picture stay visible on the right. The default is unchanged, so `/industries` and the service pages are untouched.

## The Services pages

Six routes: `/services` and five `/services/<slug>` pages, all prerendered. One renderer at `app/services/[slug]/page.tsx` with `generateStaticParams` and `dynamicParams = false`, so an unknown slug is a static 404.

**They share a skeleton and differ in everything else.** Hero message, photograph, the three proof figures, the body copy, the sequence, the FAQ and the closing call to action all come from `config/services.ts`. The only conditional in the renderer is the optional `aside`, which is why contract staffing, contract-to-hire and direct hire carry a section the other two do not: onshore and offshore delivery, a comparison against direct hire, and the cost of an empty seat. Each service also states, in `notRightIf`, when it is the wrong answer and links to the service that is right. That honesty section is the strongest trust device on the page, so keep it.

Every figure traces to the company deck. Do not add one that does not.

**The service travels with the lead.** `HireTalentProvider` now exposes `open()`, `openFor(ctx)` and `setScope(ctx)`. A page mounts `<HireTalentScope service serviceName need />`, and from then on every plain `open()` on that page inherits it, including the site header's own Hire Talent button. That last part is the reason the scope exists: without it the header button on a service page would send a lead with no idea which page it came from. The scope is held in a ref rather than state, because the provider wraps the whole app.

Arriving from a service page skips step one of the modal, since the page already implies the need. The service is submitted as a hidden field rather than an eleventh visible control, and one line of the form confirms it in words. Changing your mind should change the page, which is what the compare section on every service page is for.

Shared pieces extracted while building this, and used by `/industries` too: `components/ui/PageHero.tsx` (the ink photo hero, its two layer gradient and the `pt-32 lg:pt-40` the overlaying header depends on), `components/ui/Faq.tsx` (the accordion, third time it was written), and `components/blocks/ResourceGrid.tsx`. The mobile accordion inside `components/blocks/Industries.tsx` is deliberately not folded into `Faq`: its rows are a heading and a list of links, not a question and an answer.

**Ampersand rule.** `name` is the prose form and uses "and", so body copy reads as a sentence. `navLabel` keeps the ampersand for the header and footer, where space is tight. `shortName` is for table headings.

`config/navigation.ts` derives both the Services dropdown and the footer column from `SERVICES`, so the five hrefs exist in one place. The homepage services block keeps its own copy for now, which is the one remaining duplication.

`app/sitemap.ts` and `app/robots.ts` are generated from the same configs, so a new service or article is listed automatically.

## Industry pages

`/industries/<slug>` is a long form page per industry. **All eighteen are built.** Engineering was the master template and the other seventeen follow it exactly.

**It is written as a hiring brief, not a brochure.** The first version was the same nine sections as every other page with the industry name dropped in, and it proved nothing to a hiring manager. The rebuild earns the page: the disciplines we recruit for and what each actually produces, the tools and standards a screen has to be conducted in, how a recruiter who is not an engineer screens one, an honest read on which roles are hard to fill, and a checklist of what to have ready before calling.

That candour is the point. Saying controls and automation takes three to four weeks builds more trust than promising everything in 48 hours, and the market section is framed as recruiter experience rather than as a statistic.

One renderer at `app/industries/[slug]/page.tsx` reads `config/industry-pages.ts`, so adding an industry means adding a data object and a hero photograph, never a component. Thirteen sections: hero, three facts on the purple, the problem in their language, disciplines, the spec sheet, a pull quote, screening, market reality, engagement shapes, the pre-call checklist, open roles, FAQ and the close. Open roles filter out of `config/jobs.ts`, so a new listing appears without an edit.

Three of those sections are deliberately unlike anything else on the site, which is what stops eighteen of these reading as one page repeated: the sticky discipline rail (`components/industries/DisciplinePanel.tsx`, desktop tablist and mobile accordion with separate state, the trap the homepage industries block fell into), the bordered mono spec sheet, and the dark numbered screening panel.

When writing the next industry, the tool, standard and credential names are industry vocabulary rather than claims about us, so they are safe to list and they are what makes the page credible. Do not swap them for generic staffing copy. Two things to avoid, both of which had to be rewritten out of the first Engineering draft: invented anecdotes about hypothetical candidates, and copy that narrates the page to itself ("this page sets out..."). The overview should say what we cover, in what shapes, and where the work can run.

**Every discipline has its own photograph.** `Discipline.photo` and `photoAlt` are required, and the 110 files live in `public/photos/roles/<industry>-<discipline>.jpg`, each generated to a brief for that exact job: a receptionist at a reception desk, a splicer at a splicer, a cleanroom operator carrying a wafer carrier. They are 3:4, 1200px wide, and sit beside the copy in the sticky panel and above it in the accordion, cropped square so a phone does not scroll through a tall picture to reach the words. `object-[50%_28%]` keeps the face in the crop because the subject is in the upper third. If you add a discipline, generate its picture; do not reuse a neighbour's, because the whole point of the section is that we can show the job.

**Sticky gotcha.** Make one wrapper sticky, never two siblings. Sticking a heading at `top-32` and its paragraph at `top-64` made them collide and overlap on the way down. The fix is a single `lg:sticky` container around both.

**`overview.photo` is optional.** With a photo the overview is a seven column text block beside an image; without one it becomes a full width two column read. Only supply a photo where a genuinely matching image exists in the library. Six industries reuse one, the rest deliberately run without, and inventing a stock image per industry would have been worse than the whitespace.

**Only industries with an entry get a route.** `generateStaticParams` covers what exists and `dynamicParams` is false, so an unknown slug is a clean static 404. All eighteen industries in `config/industries.ts` now have an entry, so the explorer on `/industries` and the homepage industries block both link straight to the page. The `withPages` prop and the modal fallback that covered the gap are gone.

To add an industry: write the object in `config/industry-pages.ts`, add its hero photo slot, generate imagery appropriate to that industry rather than generic office stock, and it is live. Nothing else changes.

## The Industries page

`/industries` is the first full interior page. Nine sections in the order a hiring manager reads them: hero, explorer, staffing solutions, people at work, why Vertis, how we help, FAQ, resources, and the closing call to action. The content hierarchy follows a competitor page the client shared as a reference; nothing about its design was copied.

Two pieces are interactive and live in `components/industries/`. `IndustryExplorer.tsx` filters the 18 industries by group and, when one is chosen, calls `openFor(slug)` so the inquiry modal opens with that industry already selected. It does **not** link to `/industries/<slug>`: those pages do not exist yet, and a filter that leads to a dead end is worse than one that leads to a conversation. When the per-industry pages land, swap the button for a `Link` and nothing else changes. `IndustryFaq.tsx` is the same accordion mechanic as the homepage industries list.

**Deep links into the explorer.** `/industries?industry=<slug>` filters to that industry's group, highlights the row with an orange rule and scrolls it into view; `/industries#<group-id>` selects a group. The homepage industries list uses the first form (`?industry=<slug>#explorer`) and the header dropdown uses the second, so neither points at a page that does not exist. Both are read from `window.location` in an effect rather than through `useSearchParams`, which keeps the page fully static and avoids a Suspense fallback in the middle of the section.

**Industry travels with the lead.** `HireTalentProvider` exposes `open()` and `openFor(slug)`. `openFor` is separate on purpose: `open` is handed straight to `onClick` handlers and would otherwise be called with a mouse event. The modal renders an Industry select, pre-selected from that slug and still changeable, and `submitInquiry` maps the slug back to the industry name for the email. The field is optional, so every other entry point still works unchanged.

Everything else on the page is data at the top of `app/industries/page.tsx`: the five staffing arrangements, the six capability cards, and the captions for the photo strip. Industry names and lines come from `config/industries.ts`, so adding an industry there adds it to the explorer, the filter counts and the page description. The proof section reuses `WhyVertis`, and the resources row reuses the Insights and whitepaper data, so those numbers and articles are never stated twice.

## Proof and Insights

**Why Vertis Global** (`components/blocks/WhyVertis.tsx`) is the proof section: a heading and one headline figure on the left, three ruled rows of figures on the right. The years, the Fortune 500 count, the 48 to 72 hour turnaround and the no-cost replacement come from the company deck; the industry count is derived from `config/industries.ts`. Change a number there, not in the component.

**Insights** are data in `config/insights.ts`. To publish a post, add an entry (slug, title, excerpt, category, ISO date, reading time, image, body paragraphs; a paragraph starting with `## ` becomes a subheading) and drop its 3:2 photograph in `public/photos/`. Nothing else is needed: the homepage resources grid rotates in the three most recent, `/insights` lists all of them newest first, and `/insights/<slug>` renders the article with a category-matched call to action and two more articles beneath. Three sample posts ship with the site; their photographs were generated to the same editorial brief as the rest of the set.

**Whitepapers are not Insights.** They are a separate resource with their own route, `/whitepapers`, their own data in `config/resources.ts`, and a footer link under Company. Nothing about them lives in the Insights config or the Insights page. To publish one, add an entry to `WHITEPAPERS` and put the PDF in `public/whitepapers/`, then set `file` to that path. Until `file` is set the link opens a pre-filled "request a copy" email, so nothing ever points at a missing download.

The **newsletter**, "The Shift", also lives in `config/resources.ts`. Its form (`NewsletterForm.tsx`) posts to `app/actions/newsletter.ts`, which delivers through Resend like the inquiry (`NEWSLETTER_TO` overrides the inbox) and logs when no key is set. Swapping in a list provider is a one-function change there.

The homepage **resources grid** (`components/blocks/Resources.tsx`) is the one place all three meet: the newest article standing tall on the left, two more articles, a Whitepapers tile and a newsletter tile.

## Photography

21 slots in `config/photography.ts`, all filled from `public/photos/<id>.jpg`, plus one 3:2 photograph per Insights post referenced directly from `config/insights.ts`.

**The set is corporate, HR and recruitment led** (changed 8 Sep 2026 on the client's direction: the site had drifted too industrial). What the pictures show now: professionals crossing an office atrium, a team arriving in an open plan office, a coordinator handing badges to temporary staff, a specialist working with a client team in a meeting room, a manager beside someone three months into the job, a permanent hire running a stand up, a project team around a table, two talent acquisition professionals going through a shortlist, a hiring manager listening, a candidate waiting for an interview, and the five talent levels as operations, technical, administrative, professional and analytical work.

**Do not reintroduce** factories, assembly lines, machinery, hard hats or hi-vis as *general* imagery. Keep it modern, premium, natural, diverse and people centric. The one deliberate exception is the per discipline photographs on the industry pages (`public/photos/roles/`), where the picture has to show the actual job: a substation technician wears the PPE a substation requires. Even there the settings are clean and modern, and hard hats appear only where the work genuinely calls for one. Two industrial files remain in `public/photos/` but nothing renders them: `hero-main.jpg` (the hero photo fallback, only used if the hero video is removed) and the unused `hero-a` to `hero-d` set. Replace them if either is ever brought back.

**The scrim is light on purpose.** The photograph is the point, so the purple stays at the edges. `.scrim-photo` in `globals.css` is the only hero overlay on the site (PageHero, the homepage and jobs video heroes, the About purpose band): from `lg` up it is a well under the copy on the left that is gone by two thirds across, a short close on brand along the bottom, a light band at the top so the overlaying header reads, and a whisper on the right edge. Faces sit centre and right and are clear. Below `lg` the copy spans the full width, so the well runs bottom up and is necessarily deeper, but still much lighter at the top where the people are. `.scrim-caption` is the equivalent for text on the lower third of a tile (Pathways, the Insights cards). Before this, every hero carried a 30 to 35 percent purple veil over the whole frame and the client said the pictures were unclear; do not reach for a full frame veil again. If a headline stops reading on a bright photograph, use `scrim="light"` on PageHero, which deepens the well slightly and nothing else.

Next's image optimiser caches by path, so after overwriting a photo with the same filename, clear `.next/dev/cache/images` or the old picture keeps being served. The set was generated with Magnific (Seedream 5 Pro, 2k) to one editorial documentary brief so the style is consistent: natural light, candid moments at work, nobody looking at camera, a cast that spans a nurse, an electrician, a warehouse associate, a welder, an office coordinator, an accountant, a cleanroom engineer, a recruiter, a supervisor and a kitchen worker.

To replace any image, overwrite the file. To fall back to the placeholder, pass `null` as the last argument of that slot. Aspect boxes are reserved, so swaps cause no layout shift.

## Scope — MVP is deliberately simple

**In:** homepage · employer inquiry modal · job listings (next) · contact and application forms (next) · industry and service pages (next).

**Out until specifically required:** user accounts, candidate dashboards, employer portals, matching engines, candidate databases, authentication, workflow engines. The architecture leaves room for them; nothing is built.

## Note on `docs/website-blueprint.md`

The blueprint was written for a technology-staffing positioning and a full recruitment platform. The IA, page templates, SEO and accessibility sections remain useful. The positioning (§4), the five capability pages, the delivery-models differentiator, the backend/database/API/admin sections and the AI section are **superseded** by the broad-staffing, simple-MVP direction.
