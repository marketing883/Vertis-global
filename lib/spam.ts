/* ============================================================
   SPAM SCREENING FOR PUBLIC FORMS

   Why this exists: the job seeker form was receiving bot
   submissions where every text box held random mixed-case letters
   ("kXLFBVSVBkOYfcQECd", "BjGddhWHuljwmEycZebK") and the email was
   a plausible stranger's address. The field mapping was correct;
   the values were junk. The honeypot missed them because the bot
   skips hidden inputs. Left alone, each one also sent our thank-you
   to whoever owns that address.

   Signals, strongest first:
     · honeypot       the hidden "website" field has a value
     · no timing      the form was posted without our script running,
                      so the "t" field (time on form) is missing
     · too fast       under three seconds from first sight to submit;
                      a person cannot fill seven fields that quickly
     · random text    a field reads like keyboard noise: a long word
                      with several capitals scattered inside it

   The rule is deliberately lenient, because losing a real candidate
   is worse than letting one bot through (see `screen` for the three
   outcomes). A person with scripts off (no timing) is still accepted
   unless their text also reads as noise. Dropped submissions are
   logged with their reasons only, never with what was typed, so the
   log holds no candidate data.
   ============================================================ */

export const MIN_FILL_MS = 3000;

/** A word that looks like random keyboard input rather than language.
    Each run of letters (so "McMillan-O'Donnell" is judged as three
    parts) of eight or more letters counts as random when it has three
    or more capitals after the first letter, some lowercase, and flips
    between upper and lower case at least five times. The spam samples
    flip six to nine times ("kXLFBVSVBkOYfcQECd", "WaUPmsUrmwseLKben");
    names and product words flip once or twice ("McDonald",
    "MSSQLServer", "SharePoint", "DeShawn", "JavaScript"). */
function isRandomWord(word: string): boolean {
  return (word.match(/\p{L}+/gu) ?? []).some((part) => {
    if (part.length < 8) return false;
    const innerCaps = (part.slice(1).match(/\p{Lu}/gu) ?? []).length;
    const lower = (part.match(/\p{Ll}/gu) ?? []).length;
    if (innerCaps < 3 || lower < 3) return false;
    let flips = 0;
    for (let i = 1; i < part.length; i++) {
      const a = part[i - 1]!;
      const b = part[i]!;
      if ((a === a.toUpperCase()) !== (b === b.toUpperCase())) flips++;
    }
    return flips >= 5;
  });
}

export function looksRandom(value: string | undefined): boolean {
  if (!value) return false;
  return value.split(/\s+/).some(isRandomWord);
}

/* Three outcomes, so a genuine candidate is never silently lost to a
   borderline signal:

     drop       certain bot: honeypot filled, posted faster than a
                person can type, two or more fields of keyboard noise,
                or noise with no sign the page script ran. The visitor
                sees the normal success screen and nothing is sent, so
                the bot learns nothing.
     challenge  one field reads as keyboard noise but everything else
                looks human. The visitor is asked to check that field
                and can resubmit; a person fixes it in seconds, a bot
                does not.
     ok         nothing suspicious. */
export type SpamAction = "drop" | "challenge" | "ok";
export type SpamVerdict = { action: SpamAction; reasons: string[]; noisy: string[] };

export function screen(input: {
  honeypot?: string;
  /** Milliseconds between the form being shown and submitted, as the
      browser measured it. Missing when the page script did not run. */
  fillMs?: string;
  /** The free-text fields a person would type into, by field name. */
  text: Record<string, string | undefined>;
}): SpamVerdict {
  const reasons: string[] = [];
  if (input.honeypot) reasons.push("honeypot filled");

  const ms = Number(input.fillMs);
  const timed = input.fillMs !== undefined && input.fillMs !== "" && Number.isFinite(ms);
  const tooFast = timed && ms < MIN_FILL_MS;
  if (!timed) reasons.push("no timing (script did not run)");
  else if (tooFast) reasons.push(`submitted in ${Math.round(ms)}ms`);

  const noisy = Object.entries(input.text)
    .filter(([, v]) => looksRandom(v))
    .map(([k]) => k);
  if (noisy.length) reasons.push(`random text in ${noisy.join(", ")}`);

  const drop =
    Boolean(input.honeypot) || tooFast || noisy.length >= 2 || (!timed && noisy.length >= 1);
  return { action: drop ? "drop" : noisy.length === 1 ? "challenge" : "ok", reasons, noisy };
}

/* In-memory rate limits. The site runs as a single process, so memory
   is shared by every request. Two keys, because either can be missing
   or forged on its own:

     · per client address: ten in ten minutes. Beyond what a shared
       office or library connection produces, well short of a bot.
       Only applies when nginx passes the address through.
     · per email address: three in a day. Always available, and it
       also stops the form being used to send our thank-you email to
       a stranger over and over. A genuine candidate resubmitting a
       correction stays well inside it. */
type Limit = { windowMs: number; max: number; seen: Map<string, number[]> };
const BY_ADDRESS: Limit = { windowMs: 10 * 60 * 1000, max: 10, seen: new Map() };
const BY_EMAIL: Limit = { windowMs: 24 * 60 * 60 * 1000, max: 3, seen: new Map() };

function hit(limit: Limit, key: string | null): boolean {
  if (!key) return false;
  const now = Date.now();
  const recent = (limit.seen.get(key) ?? []).filter((t) => now - t < limit.windowMs);
  recent.push(now);
  limit.seen.set(key, recent);
  if (limit.seen.size > 5000) {
    for (const [k, times] of limit.seen) if (times.every((t) => now - t >= limit.windowMs)) limit.seen.delete(k);
  }
  return recent.length > limit.max;
}

/** True when this client address has submitted too often. */
export function rateLimited(address: string | null): boolean {
  return hit(BY_ADDRESS, address);
}

/** True when this email address has been submitted too often. */
export function emailRateLimited(email: string): boolean {
  return hit(BY_EMAIL, email.trim().toLowerCase() || null);
}

/** Clears both limits. Tests only. */
export function resetRateLimits() {
  BY_ADDRESS.seen.clear();
  BY_EMAIL.seen.clear();
}

/** The client's address as nginx passes it on, or null if unknown.
    A loopback address means the real client was not passed through
    (every visitor would share it), so it counts as unknown and no
    limit applies, rather than one bucket throttling the whole site. */
export function clientAddress(h: Headers): string | null {
  const address =
    h.get("x-forwarded-for")?.split(",")[0]?.trim() || h.get("x-real-ip")?.trim() || "";
  if (!address || /^(127\.|::1$|::ffff:127\.|localhost$)/i.test(address)) return null;
  return address;
}
