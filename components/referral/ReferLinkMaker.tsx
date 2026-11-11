"use client";

import { useEffect, useState } from "react";
import { business, referral } from "@/content/site";
import { cleanRef, referralLink } from "@/lib/referral";
import { ChatIcon, CheckIcon } from "../icons";

/** Type your name → get a personal link to text, share or copy. */
export function ReferLinkMaker() {
  const [name, setName] = useState("");
  const [origin, setOrigin] = useState(business.siteUrl);
  const [copied, setCopied] = useState(false);
  const [canShare, setCanShare] = useState(false);

  useEffect(() => {
    // Use the address the visitor is actually on (works on previews and the real domain).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOrigin(window.location.origin);
    setCanShare(typeof navigator.share === "function");
  }, []);

  const clean = cleanRef(name);
  const link = clean ? referralLink(origin, clean) : "";
  const message = `I get my car done at ${business.name} in Leonardtown — Mike does great work. Use my link and you'll get ${referral.forFriend}: ${link}`;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {}
  };
  const share = () => navigator.share?.({ title: business.name, text: message.replace(`: ${link}`, ""), url: link }).catch(() => {});
  const track = (how: string) => import("@vercel/analytics").then(({ track: t }) => t("referral_share", { how }));

  const input =
    "mt-1.5 block w-full min-h-12 rounded-xl bg-jet px-4 py-3 text-white ring-1 ring-white/15 placeholder:text-white/35 focus:ring-2 focus:ring-red focus:outline-none";
  const ghost = "inline-flex min-h-12 items-center gap-2 rounded-full bg-white/5 px-6 py-3 font-extrabold text-white ring-1 ring-white/15 hover:bg-white/10 disabled:opacity-40";

  return (
    <div className="rounded-[2rem] bg-carbon p-6 ring-1 ring-white/10 sm:p-9">
      <label className="block text-sm font-bold text-muted">
        Your name <span className="font-normal">(first name + last initial works)</span>
        <input className={input} autoComplete="name" maxLength={40} placeholder="Jason H." value={name} onChange={(e) => setName(e.target.value)} />
      </label>

      <div className="mt-5 rounded-2xl bg-jet/70 p-4 ring-1 ring-white/10">
        <p className="text-xs font-extrabold tracking-wider text-muted uppercase">Your link</p>
        <p className="mt-1 font-mono text-sm break-all text-white" aria-live="polite">
          {link || "Type your name above"}
        </p>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={link ? `sms:?&body=${encodeURIComponent(message)}` : undefined}
          aria-disabled={!link}
          onClick={(e) => (link ? track("text") : e.preventDefault())}
          className={`inline-flex min-h-12 items-center gap-2 rounded-full bg-red px-6 py-3 font-extrabold text-white hover:bg-[#f0262c] ${link ? "" : "pointer-events-none opacity-40"}`}
        >
          <ChatIcon size={18} /> Text it to a friend
        </a>
        <button type="button" disabled={!link} onClick={() => (copy(), track("copy"))} className={ghost}>
          {copied ? <CheckIcon size={18} className="text-igl-text" /> : null}
          {copied ? "Copied!" : "Copy link"}
        </button>
        {canShare && (
          <button type="button" disabled={!link} onClick={() => (share(), track("share"))} className={ghost}>
            Share…
          </button>
        )}
      </div>
    </div>
  );
}
