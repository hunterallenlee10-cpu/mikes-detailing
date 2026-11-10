"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const QuoteBuilder = dynamic(() => import("./QuoteBuilder").then((m) => m.QuoteBuilder), {
  ssr: false,
  loading: () => <QuoteSkeleton />,
});

function QuoteSkeleton() {
  return (
    <div aria-hidden className="overflow-hidden rounded-[2rem] bg-carbon ring-1 ring-white/10">
      <div className="grid grid-cols-4 gap-2 border-b border-white/10 px-5 pt-5 pb-4 sm:px-8">
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-1.5 rounded-full ${i === 0 ? "bg-red" : "bg-white/10"}`} />
        ))}
      </div>
      <div className="grid min-h-[21rem] content-start gap-4 px-5 py-7 sm:px-8">
        <span className="skeleton h-8 w-2/3 rounded-lg" />
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <span key={i} className="skeleton h-12 rounded-2xl" />
          ))}
        </div>
        <span className="skeleton h-12 rounded-xl" />
        <span className="skeleton h-12 rounded-xl" />
      </div>
      <div className="h-[4.6rem] border-t border-white/10" />
    </div>
  );
}

/** Loads the quote builder (and its animation library) only when it's about to be seen. */
export function LazyQuoteBuilder({ initialServices }: { initialServices?: string[] }) {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (location.hash === "#quote") {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShow(true);
      return;
    }
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setShow(true), { rootMargin: "800px 0px" });
    if (ref.current) io.observe(ref.current);
    const onHash = () => location.hash === "#quote" && setShow(true);
    window.addEventListener("hashchange", onHash);
    return () => {
      io.disconnect();
      window.removeEventListener("hashchange", onHash);
    };
  }, []);
  return <div ref={ref}>{show ? <QuoteBuilder initialServices={initialServices} /> : <QuoteSkeleton />}</div>;
}
