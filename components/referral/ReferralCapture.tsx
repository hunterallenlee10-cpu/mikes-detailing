"use client";

import { useEffect, useState } from "react";
import { referral } from "@/content/site";
import { cleanRef, saveRef } from "@/lib/referral";
import { CloseIcon } from "../icons";

/** Picks up ?ref=Name from a friend's referral link, remembers it for the quote form, and says hi once. */
export function ReferralCapture() {
  const [name, setName] = useState("");

  useEffect(() => {
    const ref = cleanRef(new URLSearchParams(window.location.search).get("ref"));
    if (!ref) return;
    saveRef(ref);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setName(ref);
    const t = setTimeout(() => setName(""), 12000);
    return () => clearTimeout(t);
  }, []);

  if (!name) return null;
  return (
    <div
      role="status"
      className="fade-up fixed inset-x-3 bottom-[calc(env(safe-area-inset-bottom)+5.5rem)] z-[60] mx-auto flex max-w-md items-start gap-3 rounded-2xl bg-graphite/95 p-4 text-sm text-chrome shadow-[0_20px_50px_-20px_rgb(0_0_0/0.9)] ring-1 ring-red/40 backdrop-blur sm:left-auto sm:mx-0 lg:right-6 lg:bottom-6"
    >
      <span aria-hidden className="hex-clip mt-0.5 block h-5 w-6 shrink-0 bg-red" />
      <p className="flex-1 leading-snug">
        <strong className="text-white">{name} sent you.</strong> You&apos;ll get {referral.forFriend} — we&apos;ll add their name to your quote automatically.
      </p>
      <button type="button" aria-label="Dismiss" onClick={() => setName("")} className="-m-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full hover:bg-white/10">
        <CloseIcon size={14} />
      </button>
    </div>
  );
}
