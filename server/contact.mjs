// Contact endpoint for the Vertis Global site.
//
// The site itself is static; this is the one piece that needs a process. It
// binds to loopback and expects nginx (or any reverse proxy) to forward
// /api/ to it — see deploy/nginx.conf.example.
//
// Design rule: a submission is written to disk BEFORE mail is attempted, and
// a mail failure never fails the request. Bad SMTP credentials should cost us
// an alert in the log, not a lead.
//
// Config is entirely environment-driven; nothing provider-specific is baked in.
//   PORT           listen port on 127.0.0.1            (default 8787)
//   LEADS_FILE     append-only JSONL log               (default ./data/leads.jsonl)
//   SITE_ORIGIN    used for the no-JS redirect target  (default https://vertisglobal.com)
//   SMTP_HOST/PORT/USER/PASS   SMTP transport. Mail is skipped if HOST is unset.
//   SMTP_SECURE    "true" to force TLS on connect      (default: port === 465)
//   CONTACT_TO     where notifications go              (default hello@vertisglobal.com)
//   CONTACT_FROM   envelope from                       (default: SMTP_USER)

import http from "node:http";
import { promises as fs } from "node:fs";
import path from "node:path";

const PORT = Number(process.env.PORT || 8787);
const LEADS_FILE = path.resolve(process.env.LEADS_FILE || "./data/leads.jsonl");
const SITE_ORIGIN = (process.env.SITE_ORIGIN || "https://vertisglobal.com").replace(/\/$/, "");
const CONTACT_TO = process.env.CONTACT_TO || "hello@vertisglobal.com";
const CONTACT_FROM = process.env.CONTACT_FROM || process.env.SMTP_USER;

const MAX_BODY_BYTES = 32 * 1024;
const RATE_LIMIT = { max: 5, windowMs: 60 * 60 * 1000 };

const FIELDS = ["name", "email", "company", "role", "interest", "message"];
const REQUIRED = ["name", "email", "company", "interest", "message"];
const INTERESTS = new Set(["project", "managed", "staffing", "not-sure"]);
const LIMITS = { name: 120, email: 200, company: 160, role: 120, interest: 32, message: 5000 };

// ---------------------------------------------------------------- mail

let transport = null;
if (process.env.SMTP_HOST) {
  const { default: nodemailer } = await import("nodemailer");
  const port = Number(process.env.SMTP_PORT || 587);
  transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
    auth: process.env.SMTP_USER
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
  });
} else {
  console.warn("[contact] SMTP_HOST unset — submissions will be logged only, no mail sent");
}

const INTEREST_LABELS = {
  project: "A project with fixed scope",
  managed: "Managed services",
  staffing: "Staffing",
  "not-sure": "Not sure yet",
};

async function notify(lead) {
  if (!transport) return { sent: false, reason: "smtp-not-configured" };
  const label = INTEREST_LABELS[lead.interest] || lead.interest;
  const lines = [
    `Name:     ${lead.name}`,
    `Email:    ${lead.email}`,
    `Company:  ${lead.company}`,
    `Role:     ${lead.role || "—"}`,
    `Interest: ${label}`,
    "",
    lead.message,
    "",
    "—",
    `Received ${lead.receivedAt}`,
  ];
  await transport.sendMail({
    to: CONTACT_TO,
    from: CONTACT_FROM,
    replyTo: `${lead.name} <${lead.email}>`,
    subject: `Contact: ${lead.company} — ${label}`,
    text: lines.join("\n"),
  });
  return { sent: true };
}

// ---------------------------------------------------------------- helpers

function clientIp(req) {
  const fwd = req.headers["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length) return fwd.split(",")[0].trim();
  return req.socket.remoteAddress || "unknown";
}

const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_LIMIT.windowMs);
  recent.push(now);
  hits.set(ip, recent);
  // Opportunistic sweep so the map cannot grow without bound.
  if (hits.size > 5000) {
    for (const [key, times] of hits) {
      if (!times.some((t) => now - t < RATE_LIMIT.windowMs)) hits.delete(key);
    }
  }
  return recent.length > RATE_LIMIT.max;
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let size = 0;
    const chunks = [];
    req.on("data", (chunk) => {
      size += chunk.length;
      if (size > MAX_BODY_BYTES) {
        reject(Object.assign(new Error("payload too large"), { statusCode: 413 }));
        req.destroy();
        return;
      }
      chunks.push(chunk);
    });
    req.on("end", () => resolve(Buffer.concat(chunks).toString("utf8")));
    req.on("error", reject);
  });
}

function parseBody(raw, contentType = "") {
  if (contentType.includes("application/json")) {
    try {
      const parsed = JSON.parse(raw);
      return parsed && typeof parsed === "object" ? parsed : {};
    } catch {
      return {};
    }
  }
  return Object.fromEntries(new URLSearchParams(raw));
}

// Deliberately permissive. The goal is to catch typos and obvious junk, not to
// adjudicate RFC 5322 — over-strict email regexes reject real addresses.
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

function validate(input) {
  const lead = {};
  const errors = [];

  for (const field of FIELDS) {
    const value = typeof input[field] === "string" ? input[field].trim() : "";
    if (!value && REQUIRED.includes(field)) {
      errors.push(field);
      continue;
    }
    if (value.length > LIMITS[field]) {
      errors.push(field);
      continue;
    }
    lead[field] = value;
  }

  if (lead.email && !EMAIL_RE.test(lead.email)) errors.push("email");
  if (lead.interest && !INTERESTS.has(lead.interest)) errors.push("interest");

  return { lead, errors: [...new Set(errors)] };
}

async function appendLead(lead) {
  await fs.mkdir(path.dirname(LEADS_FILE), { recursive: true });
  await fs.appendFile(LEADS_FILE, JSON.stringify(lead) + "\n", "utf8");
}

function send(res, status, payload, { wantsJson, redirect }) {
  if (!wantsJson && redirect) {
    res.writeHead(303, { Location: redirect });
    res.end();
    return;
  }
  const body = JSON.stringify(payload);
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "content-length": Buffer.byteLength(body),
    "cache-control": "no-store",
  });
  res.end(body);
}

// ---------------------------------------------------------------- server

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);

  if (url.pathname === "/api/health") {
    send(res, 200, { ok: true, mail: Boolean(transport) }, { wantsJson: true });
    return;
  }

  if (url.pathname !== "/api/contact") {
    send(res, 404, { ok: false, error: "not_found" }, { wantsJson: true });
    return;
  }
  if (req.method !== "POST") {
    res.writeHead(405, { allow: "POST" });
    res.end();
    return;
  }

  const accept = req.headers.accept || "";
  const wantsJson =
    accept.includes("application/json") ||
    (req.headers["content-type"] || "").includes("application/json");

  try {
    const raw = await readBody(req);
    const input = parseBody(raw, req.headers["content-type"] || "");

    // Honeypot. Real users never see this field; bots fill everything in.
    // Answer 200 so the bot has no signal to adapt to, but store nothing.
    if (typeof input.website === "string" && input.website.trim() !== "") {
      send(res, 200, { ok: true }, { wantsJson, redirect: `${SITE_ORIGIN}/contact/thanks/` });
      return;
    }

    const ip = clientIp(req);
    if (rateLimited(ip)) {
      send(res, 429, { ok: false, error: "rate_limited" }, { wantsJson });
      return;
    }

    const { lead, errors } = validate(input);
    if (errors.length) {
      send(res, 400, { ok: false, error: "invalid", fields: errors }, { wantsJson });
      return;
    }

    lead.receivedAt = new Date().toISOString();
    lead.ip = ip;
    lead.userAgent = (req.headers["user-agent"] || "").slice(0, 300);

    // Durable first. If this throws we genuinely cannot accept the lead.
    await appendLead(lead);

    // Best effort. A mail failure is an ops problem, not the visitor's problem.
    try {
      const result = await notify(lead);
      if (!result.sent) console.warn(`[contact] stored but not mailed (${result.reason})`);
    } catch (err) {
      console.error("[contact] mail failed, lead is safe in the log:", err.message);
    }

    send(res, 200, { ok: true }, { wantsJson, redirect: `${SITE_ORIGIN}/contact/thanks/` });
  } catch (err) {
    const status = err.statusCode || 500;
    if (status === 500) console.error("[contact] unhandled:", err);
    send(res, status, { ok: false, error: status === 413 ? "too_large" : "server_error" }, { wantsJson });
  }
});

server.listen(PORT, "127.0.0.1", () => {
  console.log(`[contact] listening on 127.0.0.1:${PORT} — leads → ${LEADS_FILE}`);
});

for (const signal of ["SIGTERM", "SIGINT"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
