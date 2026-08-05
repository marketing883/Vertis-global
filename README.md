# Vertis Global — vertisglobal.com

Editorial marketing site. Static HTML from [Eleventy](https://www.11ty.dev/) v3,
[Tailwind CSS](https://tailwindcss.com/) v4, and about 150 lines of vanilla JS.
One small Node service handles the contact form; everything else is files on disk.

## Requirements

- Node 20 or newer
- npm

## Quick start

```bash
npm install
npm run dev          # http://localhost:8080, with CSS + template watching
```

## Build

```bash
npm run build        # → _site/
```

`build` runs four steps in order, and **the order matters**:

| Step | What it does |
|---|---|
| `clean` | `rimraf _site` |
| `copy:fonts` | copies the four variable WOFF2 files out of `node_modules/@fontsource-variable/*` into `src/fonts/`, which Eleventy then serves from `/assets/fonts/`. `src/fonts/` is generated and gitignored. |
| `build:css` | Tailwind compiles `src/css/main.css` → `_site/assets/css/main.css` |
| `build:eleventy` | renders `src/` → `_site/` |

CSS is written into `_site/` *before* Eleventy runs. Eleventy does not clear its output
directory, so the stylesheet survives. Don't reorder these.

## How the site is put together

Almost every page is **front matter only, with no body**. Three layouts do the rendering,
and a new page is a YAML file that fills in their slots.

| Layout | Selected by | Used for |
|---|---|---|
| `_includes/layouts/detail-page.njk` | `pillar: projects \| managed \| staffing` | the 22 service pages |
| `_includes/layouts/industry-page.njk` | `industry:` + `accent:` | the 5 industry pages |
| `_includes/layouts/case-study-page.njk` | `tags: work` | case studies under `/work/` |
| `_includes/layouts/insight-page.njk` | `tags: insights` | long-form posts under `/insights/` |

`detail-page.njk` reads `pillar` and looks it up in a `pillarConfig` map at the top of the
file — that's where a pillar's accent colour, parent URL, and schema.org service type come
from. Every layout emits JSON-LD; `_includes/partials/head-meta.njk` adds `Organization`
and all the OG/Twitter tags on every page.

### Adding a page

**A service** — copy any file in `src/services/`, set `pillar`, `permalink`, and the
`capabilities` / `technologies` / `numbers` / `faqs` / `related` arrays. Add it to
`src/_data/nav.json` so it appears in the footer.

**A case study** — copy a file from `src/work/`. Needs `tags: work`, `year` (drives sort
order), and `permalink`. It shows up on `/work/` automatically.

**An insight** — drop a Markdown file in `src/insights/` with `tags: insights`, a `date`,
and a `permalink`. It appears on `/insights/` and in the home page's recent list, newest
first. Prose is styled by `.prose-editorial` in `main.css`; `h2`–`h4` get anchor links.

### Content data

- `src/_data/site.json` — name, URL, contact email, founding year, stats, social links
- `src/_data/nav.json` — primary nav plus the four footer columns

## Assets

**Fonts** are self-hosted variable WOFF2, copied from `node_modules` at build time. To change
which ones ship, edit `scripts/copy-fonts.mjs` and the `@font-face` rules in `src/css/main.css`.

**The hero video** in `src/public/video/` is committed in its three derived forms (mp4, webm,
poster). The uncompressed master is *not* in git — masters match `*.master.mp4` in
`.gitignore`. When the footage changes, keep the master somewhere shared and run:

```bash
npm run encode:hero -- /path/to/hero.master.mp4
```

That regenerates all three files; commit them.

**The social card** `src/public/og-default.png` is used as `og:image` for every page that
doesn't set its own `ogImage`. Its source is `scripts/og-card.html` — re-render it with the
command documented at the top of that file.

## Contact form

`src/contact/index.njk` POSTs to `/api/contact`, served by `server/contact.mjs` — a
dependency-light `node:http` listener on loopback that nginx proxies to.

It writes every valid submission to a JSONL log **before** attempting mail, and a mail
failure never fails the request. Bad SMTP credentials cost you an alert in the journal, not
a lead. It also runs a honeypot field and a per-IP rate limit.

Configuration is entirely environment variables — see the header comment in
`server/contact.mjs` for the full list. With `SMTP_HOST` unset it logs and skips mail, which
is the right behaviour for local development.

```bash
npm run serve:contact                 # localhost:8787, logs to ./data/leads.jsonl
curl -X POST localhost:8787/api/contact \
  -H 'content-type: application/json' \
  -d '{"name":"A","email":"a@b.com","company":"C","interest":"project","message":"hi"}'
```

The form works without JavaScript: the server answers `303` to `/contact/thanks/`.
`src/js/contact-form.js` upgrades that to an inline confirmation when JS is available.

## Deploy (VPS)

```bash
VPS_HOST=deploy@vertisglobal.com ./deploy/deploy.sh
```

The script builds, verifies the build isn't half-finished, rsyncs `_site/` to the web root,
syncs `server/` to the app root, and restarts the systemd unit.

One-time setup on the box:

1. `deploy/nginx.conf.example` → `/etc/nginx/sites-available/vertisglobal` (adjust
   `root` and `server_name`, add the `limit_req_zone` line to `nginx.conf`)
2. `deploy/vertis-contact.service` → `/etc/systemd/system/`
3. Create `/etc/vertis/contact.env`, mode `0600`, with the SMTP settings listed in that unit
4. `systemctl enable --now vertis-contact && systemctl reload nginx`
5. `certbot --nginx -d vertisglobal.com -d www.vertisglobal.com`

Health check: `curl localhost:8787/api/health`.

## Layout

```
eleventy.config.mjs     plugins, passthroughs, collections, filters
scripts/                copy-fonts, encode-hero, og-card source
server/contact.mjs      contact endpoint
deploy/                 nginx config, systemd unit, deploy script
src/
  _data/                site.json, nav.json
  _includes/            layouts/ and partials/
  css/main.css          the whole design system: tokens, components, utilities
  js/                   main.js entry + four small modules
  public/               images, PDFs, video — copied to the site root verbatim
  <section>/            page templates, mirroring the URL structure
```
