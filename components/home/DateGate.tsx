"use client";

import { useEffect, useState, type ReactNode } from "react";
import { activeItems, nowFromSearch } from "@/lib/time";

/** Re-checks a date window in the browser (exact time, or ?previewDate=YYYY-MM-DD) and hides expired content. */
export function DateGate({ startsAt, endsAt, children }: { startsAt: string; endsAt: string; children: ReactNode }) {
  const [show, setShow] = useState(true);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(activeItems([{ startsAt, endsAt }], nowFromSearch(window.location.search)).length > 0);
  }, [startsAt, endsAt]);
  return show ? <>{children}</> : null;
}
