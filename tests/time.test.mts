// Run with: npm test   (Node's built-in test runner, no extra deps)
import { test } from "node:test";
import assert from "node:assert/strict";
import { activeItems, nowFromSearch, openStatus } from "../lib/time.ts";

const HOURS = [1, 2, 3, 4, 5].map((day) => ({ day, open: "07:00", close: "18:00" })).concat([{ day: 6, open: "09:00", close: "15:00" }]);
const TZ = "America/New_York";

test("open on a weekday morning (Eastern)", () => {
  // Tue 2026-11-10 08:30 EST = 13:30 UTC
  const s = openStatus(new Date("2026-11-10T13:30:00Z"), HOURS, TZ);
  assert.equal(s.open, true);
  assert.equal(s.detail, "Until 6 PM today");
});

test("closed before 7am, opens today", () => {
  const s = openStatus(new Date("2026-11-10T11:30:00Z"), HOURS, TZ); // 6:30 AM EST
  assert.equal(s.open, false);
  assert.equal(s.detail, "Opens today at 7 AM");
});

test("closing soon within the last hour", () => {
  const s = openStatus(new Date("2026-11-10T22:30:00Z"), HOURS, TZ); // 5:30 PM EST
  assert.equal(s.open, true);
  assert.match(s.detail, /Closing soon/);
});

test("closed at 6pm sharp, opens tomorrow", () => {
  const s = openStatus(new Date("2026-11-10T23:00:00Z"), HOURS, TZ); // 6:00 PM EST
  assert.equal(s.open, false);
  assert.equal(s.detail, "Opens tomorrow at 7 AM");
});

test("Saturday hours 9–3", () => {
  assert.equal(openStatus(new Date("2026-11-14T15:00:00Z"), HOURS, TZ).open, true); // Sat 10 AM
  assert.equal(openStatus(new Date("2026-11-14T20:30:00Z"), HOURS, TZ).open, false); // Sat 3:30 PM
});

test("Sunday closed, opens Monday", () => {
  const s = openStatus(new Date("2026-11-15T16:00:00Z"), HOURS, TZ); // Sun 11 AM
  assert.equal(s.open, false);
  assert.equal(s.detail, "Opens tomorrow at 7 AM");
});

test("uses Eastern time, not UTC (Fri 5pm EST is Sat in UTC)", () => {
  const s = openStatus(new Date("2026-11-14T00:30:00Z"), HOURS, TZ); // Fri 7:30 PM EST
  assert.equal(s.open, false);
  assert.equal(s.detail, "Opens tomorrow at 9 AM");
});

test("daylight saving: summer weekday 6:30pm EDT is closed", () => {
  assert.equal(openStatus(new Date("2026-07-14T22:30:00Z"), HOURS, TZ).open, false); // 6:30 PM EDT
  assert.equal(openStatus(new Date("2026-07-14T21:30:00Z"), HOURS, TZ).open, true); // 5:30 PM EDT
});

const PROMOS = [
  { id: "grand", startsAt: "2026-10-24T00:00:00-04:00", endsAt: "2026-11-21T23:59:59-05:00" },
  { id: "fall", startsAt: "2026-09-22T00:00:00-04:00", endsAt: "2026-11-30T23:59:59-05:00" },
];

test("promos active inside their window", () => {
  assert.deepEqual(activeItems(PROMOS, new Date("2026-11-10T12:00:00-05:00")).map((p) => p.id), ["grand", "fall"]);
});

test("grand opening auto-hides after its end date", () => {
  assert.deepEqual(activeItems(PROMOS, new Date("2026-11-22T00:00:01-05:00")).map((p) => p.id), ["fall"]);
});

test("everything hidden once all promos expire", () => {
  assert.deepEqual(activeItems(PROMOS, new Date("2026-12-01T09:00:00-05:00")), []);
});

test("promo not shown before it starts", () => {
  assert.deepEqual(activeItems(PROMOS, new Date("2026-09-01T09:00:00-04:00")), []);
});

test("?previewDate mocks the date", () => {
  assert.equal(nowFromSearch("?previewDate=2026-12-01").toISOString(), "2026-12-01T17:00:00.000Z");
  assert.ok(Math.abs(nowFromSearch("").getTime() - Date.now()) < 1000);
});
