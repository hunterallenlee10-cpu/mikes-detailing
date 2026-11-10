"use client";

import { AnimatePresence, LazyMotion, domAnimation, m } from "framer-motion";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { business, links, quoteServiceOptions } from "@/content/site";
import { cn } from "@/lib/cn";
import { ArrowIcon, CalendarIcon, ChatIcon, CheckIcon, CloseIcon, MailIcon, PhoneIcon, UploadIcon } from "../icons";

const VEHICLES = ["Car", "SUV", "Truck", "Van", "Exotic / Classic"] as const;
const CONTACT = [
  { v: "Text", Icon: ChatIcon },
  { v: "Call", Icon: PhoneIcon },
  { v: "Email", Icon: MailIcon },
] as const;
const STEPS = ["Vehicle", "Services", "Condition", "Contact"];
const MAX_PHOTOS = 5;

type Status = { kind: "idle" } | { kind: "sending" } | { kind: "sent" } | { kind: "fallback"; reason: string };

/** Shrink phone photos in the browser so uploads stay small and fast. */
async function compress(file: File): Promise<File> {
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 1600 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const blob = await new Promise<Blob | null>((r) => canvas.toBlob(r, "image/jpeg", 0.8));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.\w+$/, "") + ".jpg", { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export function QuoteBuilder({ initialServices = [] }: { initialServices?: string[] }) {
  const id = useId();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [vehicleType, setVehicleType] = useState<string>("");
  const [ymm, setYmm] = useState({ year: "", make: "", model: "" });
  const [svc, setSvc] = useState<string[]>(initialServices);
  const [notes, setNotes] = useState("");
  const [photos, setPhotos] = useState<{ file: File; url: string }[]>([]);
  const [contact, setContact] = useState<string>("Text");
  const [person, setPerson] = useState({ name: "", phone: "", email: "", date: "" });
  const [hp, setHp] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const startedAt = useRef(0);
  useEffect(() => {
    startedAt.current = Date.now();
  }, []);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const summary = useMemo(() => {
    const v = [ymm.year, ymm.make, ymm.model].filter(Boolean).join(" ");
    return [
      `Quote request — ${person.name || "website visitor"}`,
      `Vehicle: ${vehicleType}${v ? ` — ${v}` : ""}`,
      `Services: ${svc.join(", ") || "Not sure yet"}`,
      notes && `Notes: ${notes}`,
      `Contact by: ${contact}`,
      person.phone && `Phone: ${person.phone}`,
      person.email && `Email: ${person.email}`,
      person.date && `Preferred date: ${person.date}`,
    ]
      .filter(Boolean)
      .join("\n");
  }, [vehicleType, ymm, svc, notes, contact, person]);

  const smsHref = `sms:${business.phone.e164}?&body=${encodeURIComponent(`Hey Mike! ${summary}`)}`;

  const validate = (s: number) => {
    if (s === 0 && !vehicleType) return "Pick a vehicle type.";
    if (s === 0 && !ymm.make.trim()) return "Add the make (e.g. Chevy, Ford, Jeep).";
    if (s === 1 && svc.length === 0) return "Pick at least one service — or “Not sure yet”.";
    if (s === 3) {
      if (!person.name.trim()) return "Add your name.";
      if (contact !== "Email" && person.phone.replace(/\D/g, "").length < 10) return "Add a phone number so Mike can reach you.";
      if (contact === "Email" && !/^\S+@\S+\.\S+$/.test(person.email)) return "Add a valid email.";
      if (person.email && !/^\S+@\S+\.\S+$/.test(person.email)) return "That email doesn't look right.";
    }
    return "";
  };

  const go = (to: number) => {
    if (to > step) {
      const err = validate(step);
      if (err) return setError(err);
    }
    setError("");
    setDir(to > step ? 1 : -1);
    setStep(to);
    requestAnimationFrame(() => headingRef.current?.focus({ preventScroll: true }));
  };

  const addPhotos = async (files: FileList | null) => {
    if (!files) return;
    const room = MAX_PHOTOS - photos.length;
    const picked = Array.from(files)
      .filter((f) => f.type.startsWith("image/"))
      .slice(0, room);
    if (files.length > room) setError(`Up to ${MAX_PHOTOS} photos.`);
    const small = await Promise.all(picked.map(compress));
    setPhotos((p) => [...p, ...small.map((file) => ({ file, url: URL.createObjectURL(file) }))].slice(0, MAX_PHOTOS));
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const err = validate(3);
    if (err) return setError(err);
    setError("");
    setStatus({ kind: "sending" });
    const fd = new FormData();
    fd.set("vehicleType", vehicleType);
    fd.set("year", ymm.year);
    fd.set("make", ymm.make);
    fd.set("model", ymm.model);
    fd.set("services", JSON.stringify(svc));
    fd.set("notes", notes);
    fd.set("contact", contact);
    fd.set("name", person.name);
    fd.set("phone", person.phone);
    fd.set("email", person.email);
    fd.set("date", person.date);
    fd.set("company", hp); // honeypot
    fd.set("elapsed", String(Date.now() - startedAt.current));
    photos.forEach((p) => fd.append("photos", p.file));
    try {
      const res = await fetch("/api/quote", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; reason?: string };
      if (res.ok && data.ok) {
        setStatus({ kind: "sent" });
        import("@vercel/analytics").then(({ track }) => track("quote_submit", { services: svc.length, photos: photos.length }));
      } else {
        setStatus({ kind: "fallback", reason: data.reason ?? "error" });
        import("@vercel/analytics").then(({ track }) => track("quote_fallback", { reason: data.reason ?? "error" }));
      }
    } catch {
      setStatus({ kind: "fallback", reason: "network" });
    }
  };

  if (status.kind === "sent" || status.kind === "fallback") {
    const sent = status.kind === "sent";
    return (
      <div className="relative overflow-hidden rounded-[2rem] bg-carbon p-8 text-center ring-1 ring-white/10 sm:p-12" role="status">
        <div aria-hidden className="absolute inset-0 bg-[radial-gradient(60%_60%_at_50%_0%,rgb(227_25_31/0.25),transparent_70%)]" />
        <div className="relative">
          <span className={cn("hex-clip mx-auto flex h-16 w-[4.5rem] items-center justify-center", sent ? "bg-igl" : "bg-red")}>
            {sent ? <CheckIcon size={30} className="text-white" /> : <ChatIcon size={28} className="text-white" />}
          </span>
          <h3 className="mt-6 text-3xl font-black text-white uppercase sm:text-4xl">{sent ? "Got it. We'll hit you back fast." : "One tap to send it."}</h3>
          <p className="mx-auto mt-3 max-w-md text-lg text-chrome/90">
            {sent
              ? "Want it faster? Text Mike now."
              : "Our online form is taking a break — your quote is ready to go as a text. Just hit send."}
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href={smsHref} data-track="text" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-red px-6 py-3 font-extrabold text-white hover:bg-[#f0262c]">
              <ChatIcon size={18} /> Text Mike {sent ? "now" : "my quote"}
            </a>
            <a href={links.tel} data-track="call" className="inline-flex min-h-12 items-center gap-2 rounded-full bg-white/5 px-6 py-3 font-extrabold text-white ring-1 ring-white/15 hover:bg-white/10">
              <PhoneIcon size={18} /> Call {business.phone.display}
            </a>
          </div>
          {!sent && (
            <p className="mt-6 text-sm text-muted">
              Or email{" "}
              <a className="underline hover:text-white" href={`mailto:${business.email}?subject=${encodeURIComponent("Quote request")}&body=${encodeURIComponent(summary)}`}>
                {business.email}
              </a>
              {photos.length > 0 && " — attach your photos there."}
            </p>
          )}
        </div>
      </div>
    );
  }

  const chip = (active: boolean) =>
    cn(
      "min-h-12 rounded-2xl px-4 py-3 text-left text-sm font-extrabold ring-1 transition select-none",
      active ? "bg-red/15 text-white ring-red shadow-[inset_0_0_0_1px_rgb(227_25_31)]" : "bg-white/[0.03] text-chrome ring-white/12 hover:bg-white/[0.07] hover:text-white",
    );
  const input =
    "mt-1.5 block w-full min-h-12 rounded-xl bg-jet px-4 py-3 text-white ring-1 ring-white/15 placeholder:text-white/35 focus:ring-2 focus:ring-red focus:outline-none";

  return (
    <LazyMotion features={domAnimation}>
      <form onSubmit={submit} noValidate className="relative overflow-hidden rounded-[2rem] bg-carbon ring-1 ring-white/10" aria-labelledby={`${id}-h`}>
        {/* progress */}
        <div className="border-b border-white/10 px-5 pt-5 pb-4 sm:px-8">
          <ol className="grid grid-cols-4 gap-2" aria-label="Quote steps">
            {STEPS.map((s, i) => (
              <li key={s}>
                <button
                  type="button"
                  onClick={() => i < step && go(i)}
                  disabled={i > step}
                  aria-current={i === step ? "step" : undefined}
                  className="w-full text-left disabled:cursor-default"
                >
                  <span className={cn("block h-1.5 rounded-full transition-colors duration-500", i <= step ? "bg-red" : "bg-white/10")} />
                  <span className={cn("mt-2 block text-[0.7rem] font-extrabold tracking-wider uppercase", i === step ? "text-white" : "text-muted")}>
                    {i + 1}. {s}
                  </span>
                </button>
              </li>
            ))}
          </ol>
        </div>

        <div className="relative min-h-[21rem] px-5 py-7 sm:px-8">
          {/* honeypot — hidden from humans */}
          <div aria-hidden className="absolute -left-[9999px] h-px w-px overflow-hidden">
            <label>
              Company
              <input tabIndex={-1} autoComplete="off" name="company" value={hp} onChange={(e) => setHp(e.target.value)} />
            </label>
          </div>

          <AnimatePresence mode="wait" custom={dir} initial={false}>
            <m.div
              key={step}
              custom={dir}
              initial={{ opacity: 0, x: dir * 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: dir * -40 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <h3 id={`${id}-h`} ref={headingRef} tabIndex={-1} className="text-2xl font-black text-white uppercase outline-none sm:text-3xl">
                {["What are we working on?", "What does it need?", "How's it looking?", "How should Mike reach you?"][step]}
              </h3>

              {step === 0 && (
                <div className="mt-6 grid gap-6">
                  <fieldset>
                    <legend className="text-sm font-bold text-muted">Vehicle type</legend>
                    <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-5">
                      {VEHICLES.map((v) => (
                        <button key={v} type="button" aria-pressed={vehicleType === v} onClick={() => setVehicleType(v)} className={chip(vehicleType === v)}>
                          {v}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <div className="grid gap-3 sm:grid-cols-[0.6fr_1fr_1fr]">
                    <label className="text-sm font-bold text-muted">
                      Year
                      <input className={input} inputMode="numeric" maxLength={4} placeholder="2025" value={ymm.year} onChange={(e) => setYmm({ ...ymm, year: e.target.value.replace(/\D/g, "") })} />
                    </label>
                    <label className="text-sm font-bold text-muted">
                      Make <span className="text-red-text">*</span>
                      <input className={input} placeholder="Chevrolet" autoComplete="off" value={ymm.make} onChange={(e) => setYmm({ ...ymm, make: e.target.value })} required />
                    </label>
                    <label className="text-sm font-bold text-muted">
                      Model
                      <input className={input} placeholder="Corvette Z06" autoComplete="off" value={ymm.model} onChange={(e) => setYmm({ ...ymm, model: e.target.value })} />
                    </label>
                  </div>
                </div>
              )}

              {step === 1 && (
                <fieldset className="mt-6">
                  <legend className="text-sm font-bold text-muted">Pick everything you&apos;re interested in</legend>
                  <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
                    {[...quoteServiceOptions, "Not sure yet"].map((o) => {
                      const on = svc.includes(o);
                      return (
                        <button
                          key={o}
                          type="button"
                          aria-pressed={on}
                          onClick={() => setSvc((s) => (on ? s.filter((x) => x !== o) : [...s, o]))}
                          className={cn(chip(on), "flex items-center justify-between gap-2")}
                        >
                          <span>{o}</span>
                          {on && <CheckIcon size={16} className="shrink-0 text-red-text" />}
                        </button>
                      );
                    })}
                  </div>
                </fieldset>
              )}

              {step === 2 && (
                <div className="mt-6 grid gap-5">
                  <label className="text-sm font-bold text-muted">
                    Condition notes <span className="font-normal">(swirls, pet hair, scratches, what bugs you…)</span>
                    <textarea className={cn(input, "min-h-32 resize-y")} maxLength={2000} value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Black paint looks hazy in the sun, dog hair in the back seat…" />
                  </label>
                  <div>
                    <p className="text-sm font-bold text-muted">Photos (optional, up to {MAX_PHOTOS}) — daylight shots help the most</p>
                    <label className="mt-2 flex min-h-28 cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-white/20 bg-jet/60 p-5 text-center text-sm text-chrome hover:border-red/60 focus-within:border-red">
                      <UploadIcon size={24} className="text-red-text" />
                      <span className="font-extrabold text-white">Tap to add photos</span>
                      <span className="text-xs text-muted">{photos.length}/{MAX_PHOTOS} added</span>
                      <input type="file" accept="image/*" multiple className="sr-only" onChange={(e) => addPhotos(e.target.files)} disabled={photos.length >= MAX_PHOTOS} />
                    </label>
                    {photos.length > 0 && (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {photos.map((p, i) => (
                          <li key={i} className="relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.url} alt={`Upload ${i + 1}`} className="h-20 w-20 rounded-xl object-cover ring-1 ring-white/15" />
                            <button
                              type="button"
                              aria-label={`Remove photo ${i + 1}`}
                              onClick={() => {
                                URL.revokeObjectURL(p.url);
                                setPhotos((ps) => ps.filter((_, j) => j !== i));
                              }}
                              className="absolute -top-2 -right-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-red text-white"
                            >
                              <CloseIcon size={14} />
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {step === 3 && (
                <div className="mt-6 grid gap-5">
                  <fieldset>
                    <legend className="text-sm font-bold text-muted">Best way to reach you</legend>
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {CONTACT.map(({ v, Icon }) => (
                        <button key={v} type="button" aria-pressed={contact === v} onClick={() => setContact(v)} className={cn(chip(contact === v), "flex items-center justify-center gap-2")}>
                          <Icon size={18} /> {v}
                        </button>
                      ))}
                    </div>
                  </fieldset>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <label className="text-sm font-bold text-muted">
                      Name <span className="text-red-text">*</span>
                      <input className={input} autoComplete="name" value={person.name} onChange={(e) => setPerson({ ...person, name: e.target.value })} required />
                    </label>
                    <label className="text-sm font-bold text-muted">
                      Phone {contact !== "Email" && <span className="text-red-text">*</span>}
                      <input className={input} type="tel" autoComplete="tel" inputMode="tel" placeholder="(301) 555-0123" value={person.phone} onChange={(e) => setPerson({ ...person, phone: e.target.value })} />
                    </label>
                    <label className="text-sm font-bold text-muted">
                      Email {contact === "Email" && <span className="text-red-text">*</span>}
                      <input className={input} type="email" autoComplete="email" value={person.email} onChange={(e) => setPerson({ ...person, email: e.target.value })} />
                    </label>
                    <label className="text-sm font-bold text-muted">
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarIcon size={14} /> Preferred date
                      </span>
                      <input className={cn(input, "[color-scheme:dark]")} type="date" value={person.date} onChange={(e) => setPerson({ ...person, date: e.target.value })} />
                    </label>
                  </div>
                  <p className="text-xs text-muted">
                    We only use this to reply to your quote. See our <a href="/privacy" className="underline hover:text-white">privacy policy</a>.
                  </p>
                </div>
              )}
            </m.div>
          </AnimatePresence>

          <p role="alert" className="mt-5 min-h-6 text-sm font-bold text-red-text">
            {error}
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 border-t border-white/10 px-5 py-4 sm:px-8">
          <button
            type="button"
            onClick={() => go(step - 1)}
            className={cn("min-h-12 rounded-full px-5 font-extrabold text-chrome hover:text-white", step === 0 && "invisible")}
          >
            Back
          </button>
          {step < 3 ? (
            <button type="button" onClick={() => go(step + 1)} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-red px-7 font-extrabold text-white hover:bg-[#f0262c]">
              Next <ArrowIcon size={18} />
            </button>
          ) : (
            <button
              type="submit"
              disabled={status.kind === "sending"}
              className="inline-flex min-h-12 items-center gap-2 rounded-full bg-red px-7 font-extrabold text-white hover:bg-[#f0262c] disabled:opacity-60"
              data-track="quote_submit_click"
            >
              {status.kind === "sending" ? "Sending…" : "Send my quote"} <ArrowIcon size={18} />
            </button>
          )}
        </div>
      </form>
    </LazyMotion>
  );
}
