import { cacheLife } from "next/cache";

/**
 * "Now" for server-rendered, date-dependent UI (promos, copyright year).
 * Cached for an hour so pages stay static, then refreshed in the background.
 * The browser re-checks promo dates with the exact current time on top of this.
 */
export async function serverNow(): Promise<number> {
  "use cache";
  cacheLife("hours");
  return Date.now();
}
