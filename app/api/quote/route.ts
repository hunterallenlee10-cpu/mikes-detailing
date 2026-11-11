import { Resend } from "resend";
import { business } from "@/content/site";

/**
 * Quote form endpoint.
 *   RESEND_API_KEY     – required to send email (otherwise the form falls back to a pre-filled text message)
 *   QUOTE_TO_EMAIL     – where quotes go (defaults to Mike's email)
 *   QUOTE_FROM_EMAIL   – verified sender, e.g. "Mike's Website <quotes@yourdomain.com>"
 */

const MAX_PHOTOS = 5;
const MAX_TOTAL_BYTES = 4 * 1024 * 1024; // stays under Vercel's 4.5 MB request limit
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 5;

// Best-effort, per-instance rate limit (good enough to stop casual abuse on a small site).
const hits = new Map<string, number[]>();
function rateLimited(ip: string, now: number) {
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear();
  return recent.length > MAX_PER_WINDOW;
}

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const field = (fd: FormData, k: string, max = 200) => String(fd.get(k) ?? "").trim().slice(0, max);
const json = (body: object, status = 200) => Response.json(body, { status });

export async function POST(request: Request) {
  let fd: FormData;
  try {
    fd = await request.formData();
  } catch {
    return json({ ok: false, reason: "invalid" }, 400);
  }

  // Bots: honeypot filled or submitted inhumanly fast → pretend success, send nothing.
  if (field(fd, "company") || Number(field(fd, "elapsed")) < 2500) return json({ ok: true });

  const ip = (request.headers.get("x-forwarded-for") ?? "").split(",")[0].trim() || "unknown";
  if (rateLimited(ip, Date.now())) return json({ ok: false, reason: "rate_limited" }, 429);

  const q = {
    vehicleType: field(fd, "vehicleType", 40),
    year: field(fd, "year", 4),
    make: field(fd, "make", 60),
    model: field(fd, "model", 80),
    notes: field(fd, "notes", 2000),
    contact: field(fd, "contact", 10),
    name: field(fd, "name", 100),
    phone: field(fd, "phone", 40),
    email: field(fd, "email", 200),
    date: field(fd, "date", 20),
    referredBy: field(fd, "referredBy", 60),
    services: (() => {
      try {
        const v = JSON.parse(field(fd, "services", 3000));
        return Array.isArray(v) ? v.map(String).slice(0, 30) : [];
      } catch {
        return [];
      }
    })(),
  };

  if (!q.name || !q.make || (!q.phone && !q.email)) return json({ ok: false, reason: "invalid" }, 400);
  if (q.email && !/^\S+@\S+\.\S+$/.test(q.email)) return json({ ok: false, reason: "invalid" }, 400);

  const files = fd.getAll("photos").filter((f): f is File => f instanceof File && f.size > 0);
  if (files.length > MAX_PHOTOS) return json({ ok: false, reason: "too_many_photos" }, 400);
  const total = files.reduce((n, f) => n + f.size, 0);
  if (total > MAX_TOTAL_BYTES || files.some((f) => !f.type.startsWith("image/"))) return json({ ok: false, reason: "invalid_photos" }, 400);

  const key = process.env.RESEND_API_KEY;
  if (!key) return json({ ok: false, reason: "not_configured" }); // form shows the text-message fallback

  const vehicle = [q.year, q.make, q.model].filter(Boolean).join(" ");
  const rows: [string, string][] = [
    ["Name", q.name],
    ["Preferred contact", q.contact],
    ["Phone", q.phone],
    ["Email", q.email],
    ["Vehicle", `${q.vehicleType}${vehicle ? ` — ${vehicle}` : ""}`],
    ["Services", q.services.join(", ") || "Not sure yet"],
    ["Preferred date", q.date],
    ["Referred by", q.referredBy],
    ["Notes", q.notes],
    ["Photos", files.length ? `${files.length} attached` : "None"],
  ];
  const text = rows.filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join("\n");
  const html = `
    <div style="font-family:Arial,sans-serif;max-width:560px">
      <h2 style="margin:0 0 4px;color:#e3191f">New quote request</h2>
      <p style="margin:0 0 16px;color:#555">From your website — ${esc(business.name)}</p>
      <table cellpadding="8" style="border-collapse:collapse;width:100%">
        ${rows
          .filter(([, v]) => v)
          .map(([k, v]) => `<tr><td style="border-bottom:1px solid #eee;color:#777;width:140px;vertical-align:top">${esc(k)}</td><td style="border-bottom:1px solid #eee;white-space:pre-wrap">${esc(v)}</td></tr>`)
          .join("")}
      </table>
      ${q.phone ? `<p style="margin-top:20px"><a href="sms:${esc(q.phone.replace(/[^\d+]/g, ""))}" style="background:#e3191f;color:#fff;padding:10px 16px;border-radius:999px;text-decoration:none;font-weight:bold">Text ${esc(q.name)} back</a></p>` : ""}
    </div>`;

  try {
    const resend = new Resend(key);
    const attachments = await Promise.all(
      files.map(async (f, i) => ({ filename: f.name || `photo-${i + 1}.jpg`, content: Buffer.from(await f.arrayBuffer()) })),
    );
    const { error } = await resend.emails.send({
      from: process.env.QUOTE_FROM_EMAIL || "Mike's Website <onboarding@resend.dev>",
      to: process.env.QUOTE_TO_EMAIL || business.email,
      replyTo: q.email || undefined,
      subject: `Quote: ${vehicle || q.vehicleType} — ${q.name}${q.referredBy ? ` (referred by ${q.referredBy})` : ""}`,
      text,
      html,
      attachments,
    });
    if (error) {
      console.error("Resend error", error);
      return json({ ok: false, reason: "send_failed" }, 502);
    }
    return json({ ok: true });
  } catch (e) {
    console.error("Quote send failed", e);
    return json({ ok: false, reason: "send_failed" }, 502);
  }
}
