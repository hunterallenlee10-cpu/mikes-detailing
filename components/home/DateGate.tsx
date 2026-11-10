"use client";

import { useEffect, useState, type ReactNode } from "react";
import { activeItems, nowFromSearch, type DatedItem } from "@/lib/time";

/**
 * Re-checks date windows in the browser (exact time, or ?previewDate=YYYY-MM-DD)
 * and hides the children once none of the windows are active.
 */
export function DateGate({ windows, children }: { windows: DatedItem[]; children: ReactNode }) {
  const [show, setShow] = useState(true);
  const key = JSON.stringify(windows);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShow(activeItems(JSON.parse(key) as DatedItem[], nowFromSearch(window.location.search)).length > 0);
  }, [key]);
  return show ? <>{children}</> : null;
}
