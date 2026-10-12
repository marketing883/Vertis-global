/* ============================================================
   DATABASE SCHEMA

   Plain JavaScript on purpose: the site (lib/db/index.ts) and the
   server command line tool (scripts/admin.mjs) both run these, so
   whichever touches the database first brings it up to date.

   Each migration runs once, in order, inside a transaction, and
   bumps SQLite's user_version. Never edit a migration that has
   shipped; add a new one.
   ============================================================ */

import path from "node:path";

export const MIGRATIONS = [
  /* 1 · Admin users, sessions, audit log */
  `
  CREATE TABLE admin_users (
    id            INTEGER PRIMARY KEY,
    email         TEXT NOT NULL UNIQUE COLLATE NOCASE,
    name          TEXT NOT NULL,
    role          TEXT NOT NULL CHECK (role IN ('admin', 'hr')),
    password_hash TEXT NOT NULL,
    disabled      INTEGER NOT NULL DEFAULT 0,
    created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    last_login_at TEXT
  );

  CREATE TABLE admin_sessions (
    token_hash  TEXT PRIMARY KEY,
    user_id     INTEGER NOT NULL REFERENCES admin_users(id) ON DELETE CASCADE,
    created_at  TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    expires_at  TEXT NOT NULL
  );
  CREATE INDEX admin_sessions_user ON admin_sessions(user_id);

  CREATE TABLE admin_audit (
    id         INTEGER PRIMARY KEY,
    user_id    INTEGER REFERENCES admin_users(id) ON DELETE SET NULL,
    action     TEXT NOT NULL,
    entity     TEXT,
    entity_id  TEXT,
    at         TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );
  `,

  /* 2 · Jobs */
  `
  CREATE TABLE jobs (
    id               INTEGER PRIMARY KEY,
    slug             TEXT NOT NULL UNIQUE,
    title            TEXT NOT NULL,
    summary          TEXT NOT NULL DEFAULT '',
    description      TEXT NOT NULL DEFAULT '',
    responsibilities TEXT NOT NULL DEFAULT '',
    qualifications   TEXT NOT NULL DEFAULT '',
    skills           TEXT NOT NULL DEFAULT '',
    industry         TEXT NOT NULL,
    location         TEXT NOT NULL,
    employment_type  TEXT NOT NULL,
    level            TEXT NOT NULL,
    arrangement      TEXT NOT NULL,
    schedule         TEXT NOT NULL DEFAULT '',
    status           TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    is_sample        INTEGER NOT NULL DEFAULT 0,
    posted_at        TEXT,
    created_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );
  CREATE INDEX jobs_status ON jobs(status, posted_at);
  `,

  /* 3 · Applications (job seeker form submissions) */
  `
  CREATE TABLE applications (
    id               INTEGER PRIMARY KEY,
    reference        TEXT NOT NULL UNIQUE,
    name             TEXT NOT NULL,
    email            TEXT NOT NULL,
    phone            TEXT NOT NULL DEFAULT '',
    looking_for      TEXT NOT NULL DEFAULT '',
    work             TEXT NOT NULL DEFAULT '',
    location         TEXT NOT NULL DEFAULT '',
    message          TEXT NOT NULL DEFAULT '',
    job_id           INTEGER REFERENCES jobs(id) ON DELETE SET NULL,
    job_title        TEXT NOT NULL DEFAULT '',
    resume_path      TEXT,
    resume_filename  TEXT,
    resume_type      TEXT,
    resume_size      INTEGER,
    status           TEXT NOT NULL DEFAULT 'new'
                     CHECK (status IN ('new', 'reviewed', 'shortlisted', 'interview', 'rejected')),
    internal_notes   TEXT NOT NULL DEFAULT '',
    screening        TEXT NOT NULL DEFAULT '',
    notification     TEXT NOT NULL DEFAULT 'paused',
    source           TEXT NOT NULL DEFAULT 'form',
    created_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at       TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
  );
  CREATE INDEX applications_created ON applications(created_at);
  CREATE INDEX applications_status ON applications(status);
  CREATE INDEX applications_job ON applications(job_id);
  `,

  /* 4 · Content: case studies, blog, whitepapers, webinars, news */
  `
  CREATE TABLE content_items (
    id            INTEGER PRIMARY KEY,
    type          TEXT NOT NULL CHECK (type IN ('case-study', 'blog', 'whitepaper', 'webinar', 'news')),
    slug          TEXT NOT NULL,
    title         TEXT NOT NULL,
    excerpt       TEXT NOT NULL DEFAULT '',
    body          TEXT NOT NULL DEFAULT '',
    category      TEXT NOT NULL DEFAULT '',
    cover_image   TEXT NOT NULL DEFAULT '',
    cover_alt     TEXT NOT NULL DEFAULT '',
    author        TEXT NOT NULL DEFAULT '',
    data          TEXT NOT NULL DEFAULT '{}',
    status        TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    published_at  TEXT,
    created_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    updated_at    TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now')),
    UNIQUE (type, slug)
  );
  CREATE INDEX content_type_status ON content_items(type, status, published_at);
  `,

  /* 5 · Key/value flags (one-time seeding, imports) */
  `
  CREATE TABLE meta (
    key   TEXT PRIMARY KEY,
    value TEXT NOT NULL
  );
  `,

  /* 6 · Per-job settings: an optional application deadline (a US
     Central date, inclusive) and who is emailed each application
     (comma separated; empty means JOB_APPLICATIONS_INBOX) */
  `
  ALTER TABLE jobs ADD COLUMN deadline TEXT;
  ALTER TABLE jobs ADD COLUMN notify_emails TEXT NOT NULL DEFAULT '';
  `,
];

/** Brings a better-sqlite3 database up to date. Returns the version. */
export function migrate(db) {
  db.pragma("journal_mode = WAL");
  db.pragma("foreign_keys = ON");
  db.pragma("busy_timeout = 10000");
  /* Several processes can open the database at once (the build's
     workers, the running site, the admin script). Each migration takes
     the write lock (BEGIN IMMEDIATE) and re-reads the version inside
     it, so only one process ever applies a given step. */
  const step = db.transaction(() => {
    const v = db.pragma("user_version", { simple: true });
    if (v >= MIGRATIONS.length) return false;
    db.exec(MIGRATIONS[v]);
    db.pragma(`user_version = ${v + 1}`);
    return true;
  });
  while (step.immediate()) {
    /* apply the next migration */
  }
  return MIGRATIONS.length;
}

/** Where the database and uploaded files live: outside the app checkout,
    so a deploy's git reset never touches them. */
export function dataDir(cwd = process.cwd()) {
  const fromEnv = process.env.VERTIS_DATA_DIR?.trim();
  return path.resolve(fromEnv || path.join(cwd, "..", "data"));
}
