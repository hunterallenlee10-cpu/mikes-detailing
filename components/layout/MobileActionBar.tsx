import { links } from "@/content/site";
import { ChatIcon, PhoneIcon, PinIcon } from "../icons";

const items = [
  { label: "Call", href: links.tel, track: "call", Icon: PhoneIcon },
  { label: "Text", href: links.sms, track: "text", Icon: ChatIcon },
  { label: "Quote", href: "/#quote", track: "quote_cta", Icon: null },
  { label: "Directions", href: links.directions, track: "directions", Icon: PinIcon },
];

export function MobileActionBar() {
  return (
    <nav
      aria-label="Quick actions"
      className="glass fixed inset-x-0 bottom-0 z-50 border-t border-white/10 px-2 pt-2 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] lg:hidden"
    >
      <ul className="grid grid-cols-4 gap-1.5">
        {items.map(({ label, href, track, Icon }) => (
          <li key={label}>
            <a
              href={href}
              data-track={track}
              {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
              className={
                label === "Quote"
                  ? "flex h-14 flex-col items-center justify-center gap-0.5 rounded-xl bg-red text-[0.7rem] font-extrabold tracking-wide text-white uppercase shadow-[0_6px_20px_-6px_rgb(227_25_31/0.9)]"
                  : "flex h-14 flex-col items-center justify-center gap-0.5 rounded-xl bg-white/[0.05] text-[0.7rem] font-extrabold tracking-wide text-white uppercase ring-1 ring-white/10 active:bg-white/10"
              }
            >
              {Icon ? (
                <Icon size={20} />
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M7 3.5h10L22 12l-5 8.5H7L2 12z" />
                  <path d="M9 12h6M12 9v6" />
                </svg>
              )}
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
