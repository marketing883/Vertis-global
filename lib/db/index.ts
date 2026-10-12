import "server-only";
import { mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { dataDir, migrate } from "./migrations.mjs";
import { seedOnce } from "./seed";

/* ============================================================
   THE VERTIS DATABASE

   One SQLite file per environment, outside the app checkout:
     VERTIS_DATA_DIR, default ../data beside the checkout
     (/var/www/vertisglobal.com/<env>/data/vertis.db)

   Production and staging therefore never share data, and nothing
   here is shared with any other site on the server. Uploaded files
   (resumes, images, PDFs) live in the same directory.

   The site runs as one process, so a single connection is shared by
   every request. better-sqlite3 is synchronous, which suits SQLite:
   each statement is microseconds and there is no pool to manage.
   ============================================================ */

let db: Database.Database | null = null;

export function getDb(): Database.Database {
  if (db) return db;
  const dir = dataDir();
  mkdirSync(dir, { recursive: true, mode: 0o700 });
  const conn = new Database(path.join(dir, "vertis.db"));
  migrate(conn);
  seedOnce(conn);
  db = conn;
  return conn;
}

/** A subdirectory of the data directory, created private if missing. */
export function dataPath(...parts: string[]): string {
  const p = path.join(dataDir(), ...parts);
  mkdirSync(path.dirname(p), { recursive: true, mode: 0o700 });
  return p;
}

export function now(): string {
  return new Date().toISOString();
}
