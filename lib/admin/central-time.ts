/* Webinar times are entered as US Central wall-clock time (the Dallas
   office) and stored as an exact instant, so daylight saving is
   handled and every visitor sees the right moment. */

const ZONE = "America/Chicago";

/** Minutes Central is ahead of UTC at an instant (negative: behind). */
function offsetMinutes(utcMs: number): number {
  const parts = Object.fromEntries(
    new Intl.DateTimeFormat("en-US", {
      timeZone: ZONE,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    })
      .formatToParts(new Date(utcMs))
      .map((p) => [p.type, p.value]),
  );
  const asUtc = Date.UTC(+parts.year!, +parts.month! - 1, +parts.day!, +parts.hour!, +parts.minute!);
  return Math.round((asUtc - Math.floor(utcMs / 60000) * 60000) / 60000);
}

/** "2026-10-22T11:00" (Central) → ISO UTC, or null if invalid. */
export function centralToIso(local: string): string | null {
  const m = local.match(/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})$/);
  if (!m) return null;
  const wall = Date.UTC(+m[1]!, +m[2]! - 1, +m[3]!, +m[4]!, +m[5]!);
  if (Number.isNaN(wall)) return null;
  let t = wall - offsetMinutes(wall) * 60000;
  t = wall - offsetMinutes(t) * 60000;
  return new Date(t).toISOString();
}

/** ISO → "2026-10-22T11:00" in Central, for a datetime-local input. */
export function isoToCentral(iso: string | undefined): string {
  if (!iso) return "";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return iso.slice(0, 16);
  return new Date(t + offsetMinutes(t) * 60000).toISOString().slice(0, 16);
}
