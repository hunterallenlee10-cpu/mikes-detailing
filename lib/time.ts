// Pure time helpers — no imports, so they can be unit tested with plain Node.

export type DayHours = { day: number; open: string; close: string };

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

/** Day-of-week (0=Sun) and minutes after midnight for `date` in `timeZone`. */
export function zonedParts(date: Date, timeZone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(date);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const day = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  return { day, minutes };
}

const toMin = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

export function formatTime(hhmm: string) {
  const [h, m] = hhmm.split(":").map(Number);
  const suffix = h >= 12 ? "PM" : "AM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return `${h12}${m ? `:${String(m).padStart(2, "0")}` : ""} ${suffix}`;
}

export type OpenStatus = { open: boolean; label: string; detail: string };

/** Is the shop open at `date`? Returns a short label + detail for the UI. */
export function openStatus(date: Date, hours: DayHours[], timeZone: string): OpenStatus {
  const { day, minutes } = zonedParts(date, timeZone);
  const today = hours.find((h) => h.day === day);
  if (today && minutes >= toMin(today.open) && minutes < toMin(today.close)) {
    const left = toMin(today.close) - minutes;
    return {
      open: true,
      label: "Open now",
      detail: left <= 60 ? `Closing soon · until ${formatTime(today.close)}` : `Until ${formatTime(today.close)} today`,
    };
  }
  // Find next opening.
  for (let i = 0; i < 8; i++) {
    const d = (day + i) % 7;
    const h = hours.find((x) => x.day === d);
    if (!h) continue;
    if (i === 0 && minutes >= toMin(h.open)) continue;
    const when = i === 0 ? "today" : i === 1 ? "tomorrow" : DAY_NAMES[d];
    return { open: false, label: "Closed", detail: `Opens ${when} at ${formatTime(h.open)}` };
  }
  return { open: false, label: "Closed", detail: "" };
}

export type DatedItem = { startsAt: string; endsAt: string };

/** Items whose window contains `now`. Auto-hides anything expired or not started. */
export function activeItems<T extends DatedItem>(items: T[], now: Date): T[] {
  const t = now.getTime();
  return items.filter((p) => t >= new Date(p.startsAt).getTime() && t <= new Date(p.endsAt).getTime());
}

/** Lets QA preview the site at another date with ?previewDate=2026-12-01 (only affects dated UI). */
export function nowFromSearch(search: string): Date {
  try {
    const v = new URLSearchParams(search).get("previewDate");
    if (v) {
      const d = new Date(v.length === 10 ? `${v}T12:00:00-05:00` : v);
      if (!Number.isNaN(d.getTime())) return d;
    }
  } catch {}
  return new Date();
}
