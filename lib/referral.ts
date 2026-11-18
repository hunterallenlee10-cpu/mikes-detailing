/** Referral links look like  https://<site>/?ref=Jason%20H  — the name is remembered on the friend's device. */

const KEY = "mad-ref";
const MAX_AGE_MS = 90 * 24 * 60 * 60 * 1000;

/** Keep it to a short, plain name. */
export function cleanRef(raw: string | null | undefined) {
  return (raw ?? "")
    .replace(/[^\p{L}\p{N} .'&-]/gu, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 40);
}

export function saveRef(name: string) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ name, at: Date.now() }));
  } catch {}
}

export function readRef(): string {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) ?? "null") as { name?: string; at?: number } | null;
    if (!v?.name || !v.at || Date.now() - v.at > MAX_AGE_MS) return "";
    return cleanRef(v.name);
  } catch {
    return "";
  }
}

export function referralLink(origin: string, name: string) {
  return `${origin.replace(/\/$/, "")}/?ref=${encodeURIComponent(cleanRef(name))}`;
}
