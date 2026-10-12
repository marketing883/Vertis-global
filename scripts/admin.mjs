#!/usr/bin/env node
// Vertis Global admin, on the server. Run as the vertis user from the
// app checkout, e.g.
//
//   su - vertis -c 'cd /var/www/vertisglobal.com/production/app && node scripts/admin.mjs user:list'
//
//   user:add <email> "<Full Name>" <admin|hr>   create a user; prints a one-time password
//   user:reset <email>                           new one-time password, signs them out everywhere
//   user:disable <email> | user:enable <email>   block or restore access
//   user:list                                    everyone, with role and last sign-in
//   db:info                                      where the database is, and row counts
//
// Generated passwords are shown once and never stored in clear. Ask
// the person to change it at /admin/account after signing in.
import { mkdirSync } from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { dataDir, migrate } from "../lib/db/migrations.mjs";
import { hashPassword, oneTimePassword } from "../lib/admin/password.mjs";

// Load .env.local so VERTIS_DATA_DIR matches the site's.
try {
  const { readFileSync } = await import("node:fs");
  for (const line of readFileSync(".env.local", "utf8").split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*?)\s*$/);
    if (m && !(m[1] in process.env)) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {
  /* no .env.local */
}

const dir = dataDir();
mkdirSync(dir, { recursive: true, mode: 0o700 });
const db = new Database(path.join(dir, "vertis.db"));
migrate(db);

const [cmd, ...args] = process.argv.slice(2);
const fail = (msg) => {
  console.error(msg);
  process.exit(1);
};
const findUser = (email) =>
  db.prepare("SELECT * FROM admin_users WHERE email = ?").get(String(email ?? "").trim()) ??
  fail(`No user with email ${email}`);

if (cmd === "user:add") {
  const [email, name, role = "admin"] = args;
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) fail('usage: user:add <email> "<Full Name>" <admin|hr>');
  if (!name) fail("A name is required.");
  if (!["admin", "hr"].includes(role)) fail('Role must be "admin" or "hr".');
  if (db.prepare("SELECT 1 FROM admin_users WHERE email = ?").get(email)) fail(`${email} already exists. Use user:reset.`);
  const password = oneTimePassword();
  db.prepare("INSERT INTO admin_users (email, name, role, password_hash) VALUES (?, ?, ?, ?)").run(
    email.trim(),
    name.trim(),
    role,
    await hashPassword(password),
  );
  console.log(`Created ${role} user ${email}.\nOne-time password: ${password}\nSign in at /admin/login and change it at /admin/account.`);
} else if (cmd === "user:reset") {
  const user = findUser(args[0]);
  const password = oneTimePassword();
  db.prepare("UPDATE admin_users SET password_hash = ? WHERE id = ?").run(await hashPassword(password), user.id);
  db.prepare("DELETE FROM admin_sessions WHERE user_id = ?").run(user.id);
  console.log(`New one-time password for ${user.email}: ${password}\nAll their sessions were signed out.`);
} else if (cmd === "user:disable" || cmd === "user:enable") {
  const user = findUser(args[0]);
  db.prepare("UPDATE admin_users SET disabled = ? WHERE id = ?").run(cmd === "user:disable" ? 1 : 0, user.id);
  if (cmd === "user:disable") db.prepare("DELETE FROM admin_sessions WHERE user_id = ?").run(user.id);
  console.log(`${user.email} ${cmd === "user:disable" ? "disabled and signed out" : "enabled"}.`);
} else if (cmd === "user:list") {
  const users = db.prepare("SELECT email, name, role, disabled, last_login_at FROM admin_users ORDER BY email").all();
  if (!users.length) console.log("No admin users yet. Create one with user:add.");
  for (const u of users)
    console.log(`${u.email}  ${u.name}  ${u.role}${u.disabled ? "  DISABLED" : ""}  last sign-in: ${u.last_login_at ?? "never"}`);
} else if (cmd === "db:info") {
  console.log(`Database: ${path.join(dir, "vertis.db")}`);
  for (const t of ["admin_users", "jobs", "applications", "content_items"])
    console.log(`  ${t}: ${db.prepare(`SELECT COUNT(*) AS n FROM ${t}`).get().n}`);
} else {
  fail('usage: node scripts/admin.mjs user:add <email> "<Full Name>" <admin|hr> | user:reset <email> | user:disable <email> | user:enable <email> | user:list | db:info');
}
db.close();
