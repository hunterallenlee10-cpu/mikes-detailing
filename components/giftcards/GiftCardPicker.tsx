"use client";

import { useState } from "react";
import { business, giftCards } from "@/content/site";
import { cn } from "@/lib/cn";
import { ArrowIcon, ChatIcon } from "../icons";

/** Pick an amount, then pay online (whichever of Square / Venmo / PayPal is set up) or text Mike to order. */
export function GiftCardPicker() {
  const [amount, setAmount] = useState<number>(giftCards.amounts[1] ?? giftCards.amounts[0]);
  const [to, setTo] = useState("");

  const note = `Gift certificate${to.trim() ? ` for ${to.trim()}` : ""}`;
  const sms = `sms:${business.phone.e164}?&body=${encodeURIComponent(
    `Hey Mike! I'd like a $${amount} gift certificate${to.trim() ? ` for ${to.trim()}` : ""}. How do I pay?`,
  )}`;
  const venmo = giftCards.venmo && `https://venmo.com/${giftCards.venmo}?txn=pay&amount=${amount}&note=${encodeURIComponent(note)}`;
  const paypal = giftCards.paypal && `https://paypal.me/${giftCards.paypal}/${amount}USD`;
  const track = (how: string) => import("@vercel/analytics").then(({ track: t }) => t("gift_card", { how, amount }));

  const chip = (on: boolean) =>
    cn(
      "font-wide min-h-14 rounded-2xl px-4 text-xl font-black ring-1 transition select-none",
      on ? "bg-red/15 text-white ring-red shadow-[inset_0_0_0_1px_rgb(227_25_31)]" : "bg-white/[0.03] text-chrome ring-white/12 hover:bg-white/[0.07] hover:text-white",
    );
  const ghost = "inline-flex min-h-12 items-center gap-2 rounded-full bg-white/5 px-6 py-3 font-extrabold text-white ring-1 ring-white/15 hover:bg-white/10";

  return (
    <div className="rounded-[2rem] bg-carbon p-6 ring-1 ring-white/10 sm:p-9">
      <fieldset>
        <legend className="text-sm font-bold text-muted">Amount</legend>
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {giftCards.amounts.map((a) => (
            <button key={a} type="button" aria-pressed={amount === a} onClick={() => setAmount(a)} className={chip(amount === a)}>
              ${a}
            </button>
          ))}
        </div>
      </fieldset>
      <label className="mt-6 block text-sm font-bold text-muted">
        Who&apos;s it for? <span className="font-normal">(optional)</span>
        <input
          className="mt-1.5 block min-h-12 w-full rounded-xl bg-jet px-4 py-3 text-white ring-1 ring-white/15 placeholder:text-white/35 focus:ring-2 focus:ring-red focus:outline-none"
          maxLength={60}
          placeholder="Dad, Sarah, the new truck…"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        />
      </label>

      <div className="mt-7 flex flex-wrap gap-3">
        {giftCards.squareUrl && (
          <a href={giftCards.squareUrl} target="_blank" rel="noopener noreferrer" onClick={() => track("square")} className="inline-flex min-h-12 items-center gap-2 rounded-full bg-red px-6 py-3 font-extrabold text-white hover:bg-[#f0262c]">
            Buy online <ArrowIcon size={18} />
          </a>
        )}
        {venmo && (
          <a href={venmo} target="_blank" rel="noopener noreferrer" onClick={() => track("venmo")} className={ghost}>
            Pay ${amount} with Venmo
          </a>
        )}
        {paypal && (
          <a href={paypal} target="_blank" rel="noopener noreferrer" onClick={() => track("paypal")} className={ghost}>
            Pay ${amount} with PayPal
          </a>
        )}
        <a href={sms} onClick={() => track("text")} className={giftCards.squareUrl || venmo || paypal ? ghost : "inline-flex min-h-12 items-center gap-2 rounded-full bg-red px-6 py-3 font-extrabold text-white hover:bg-[#f0262c]"}>
          <ChatIcon size={18} /> Text Mike to order
        </a>
      </div>
      {(venmo || paypal) && <p className="mt-4 text-sm text-muted">Paying with Venmo or PayPal? Text Mike afterwards so he knows where to send the certificate.</p>}
    </div>
  );
}
