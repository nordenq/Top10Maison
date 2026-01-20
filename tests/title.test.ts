import { strict as assert } from "node:assert";
import { test } from "node:test";
import { buildPageTitle, titleHasYear } from "../src/utils/seo.ts";

test("titleHasYear detects embedded year", () => {
  assert.equal(titleHasYear("Best Air Fryers of 2026 – Top Picks", "2026"), true);
  assert.equal(titleHasYear("Best Air Fryers – Top Picks", "2026"), false);
});

test("buildPageTitle keeps toplist title when year exists", () => {
  const title = buildPageTitle({
    bestToplistTitle: "Best Air Fryers of 2026 – Top Picks for Home Use",
    baseTitle: "Air Fryers",
    year: "2026"
  });
  assert.equal(title, "Best Air Fryers of 2026 – Top Picks for Home Use");
});

test("buildPageTitle appends year when missing", () => {
  const title = buildPageTitle({
    bestToplistTitle: "Best Air Fryers – Top Picks for Home Use",
    baseTitle: "Air Fryers",
    year: "2026"
  });
  assert.equal(title, "Best Air Fryers – Top Picks for Home Use (2026)");
});

test("buildPageTitle falls back to base title with brand", () => {
  const title = buildPageTitle({
    baseTitle: "Air Fryers",
    year: "2026"
  });
  assert.equal(title, "Air Fryers Rankings 2026 | Top10Maison");
});
