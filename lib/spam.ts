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
   is worse than letting one bot through:
     spam  = honeypot
          or too fast
          or two or more random-text fields
          or no timing and at least one random-text field
   A person with scripts off (no timing) is still accepted unless
   their text also reads as noise. Nothing here ever shows the visitor
   an error: a spam verdict gets the normal thank-you screen and no
   email goes anywhere, so bots learn nothing. Every verdict is
   logged with its reasons, so a false positive can be recovered from
   the server log.
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

export type SpamVerdict = { spam: boolean; reasons: string[] };

export function screen(input: {
  honeypot?: string;
  /** Milliseconds between the form being shown and submitted, as the
      browser measured it. Missing when the page script did not run. */
  fillMs?: string;
  /** The free-text fields a person would type into. */
  text: (string | undefined)[];
}): SpamVerdict {
  const reasons: string[] = [];
  if (input.honeypot) reasons.push("honeypot filled");

  const ms = Number(input.fillMs);
  const timed = input.fillMs !== undefined && input.fillMs !== "" && Number.isFinite(ms);
  if (!timed) reasons.push("no timing (script did not run)");
  else if (ms < MIN_FILL_MS) reasons.push(`submitted in ${Math.round(ms)}ms`);

  const noisy = input.text.filter(looksRandom).length;
  if (noisy) reasons.push(`${noisy} field(s) of random text`);

  const spam =
    Boolean(input.honeypot) ||
    (timed && ms < MIN_FILL_MS) ||
    noisy >= 2 ||
    (!timed && noisy >= 1);

  return { spam, reasons };
}

/* A small in-memory rate limit, per client address. The site runs as
   a single process, so memory is shared by every request. Generous on
   purpose: ten submissions in ten minutes from one address is beyond
   what even a shared office or library connection produces, and well
   short of what a bot does. */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_IN_WINDOW = 10;
const seen = new Map<string, number[]>();

export function rateLimited(key: string | null): boolean {
  if (!key) return false;
  const now = Date.now();
  const recent = (seen.get(key) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  seen.set(key, recent);
  if (seen.size > 5000) {
    for (const [k, times] of seen) if (times.every((t) => now - t >= WINDOW_MS)) seen.delete(k);
  }
  return recent.length > MAX_IN_WINDOW;
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
