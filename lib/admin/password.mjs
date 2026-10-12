import { randomBytes, scrypt, timingSafeEqual } from "node:crypto";

/* Password hashing for admin users. Plain JavaScript so the site and
   scripts/admin.mjs share it. scrypt (memory-hard, in Node's standard
   library), a random 16-byte salt per password, and a constant-time
   comparison. Stored as: scrypt$N$r$p$salt$hash (base64). */

const N = 16384;
const R = 8;
const P = 1;
const KEYLEN = 64;

function derive(password, salt, n = N, r = R, p = P) {
  return new Promise((resolve, reject) =>
    scrypt(password, salt, KEYLEN, { N: n, r, p, maxmem: 64 * 1024 * 1024 }, (err, key) =>
      err ? reject(err) : resolve(key),
    ),
  );
}

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await derive(password, salt);
  return `scrypt$${N}$${R}$${P}$${salt.toString("base64")}$${key.toString("base64")}`;
}

export async function verifyPassword(password, stored) {
  const parts = String(stored).split("$");
  if (parts.length !== 6 || parts[0] !== "scrypt") return false;
  const [, n, r, p, salt, hash] = parts;
  const expected = Buffer.from(hash, "base64");
  const key = await derive(password, Buffer.from(salt, "base64"), Number(n), Number(r), Number(p));
  return key.length === expected.length && timingSafeEqual(key, expected);
}

/** Minimum standard for admin passwords. Returns an error or null. */
export function passwordProblem(password) {
  if (typeof password !== "string" || password.length < 12) return "Use at least 12 characters.";
  if (password.length > 200) return "That password is too long.";
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) return "Use letters and at least one number.";
  return null;
}

/** A one-time password for a new or reset account: letters and digits
    only, no look-alikes, about 100 bits, easy to read aloud. */
export function oneTimePassword() {
  const alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (const b of randomBytes(18)) out += alphabet[b % alphabet.length];
  return `${out.slice(0, 6)}-${out.slice(6, 12)}-${out.slice(12, 18)}`;
}
