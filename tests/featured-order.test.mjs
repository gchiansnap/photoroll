// Tests for js/featured-order.js's sortByFeaturedOrder — the ordering
// logic behind the homepage's "Featured work" section. Pure function, no
// DOM/Cloudinary/network needed. Run with:
//   node --test tests/featured-order.test.mjs

import assert from "node:assert/strict";
import { test } from "node:test";

import { sortByFeaturedOrder } from "../js/featured-order.js";

function res(id) {
  return { public_id: id };
}

test("orders resources according to the given order list", () => {
  const resources = [res("a"), res("b"), res("c")];
  const result = sortByFeaturedOrder(resources, ["c", "a", "b"]);
  assert.deepEqual(result.map((r) => r.public_id), ["c", "a", "b"]);
});

test("appends unranked resources after ranked ones, in their original order", () => {
  const resources = [res("a"), res("new-photo"), res("b"), res("another-new")];
  const result = sortByFeaturedOrder(resources, ["b", "a"]);
  assert.deepEqual(result.map((r) => r.public_id), ["b", "a", "new-photo", "another-new"]);
});

test("empty order list preserves Cloudinary's original order entirely", () => {
  const resources = [res("a"), res("b"), res("c")];
  const result = sortByFeaturedOrder(resources, []);
  assert.deepEqual(result.map((r) => r.public_id), ["a", "b", "c"]);
});

test("undefined order list behaves the same as an empty one", () => {
  const resources = [res("a"), res("b")];
  const result = sortByFeaturedOrder(resources, undefined);
  assert.deepEqual(result.map((r) => r.public_id), ["a", "b"]);
});

test("order entries for photos no longer tagged 'feature' are harmlessly ignored", () => {
  const resources = [res("a"), res("b")];
  // "z" was ordered at some point but isn't in the current tagged set —
  // e.g. the "feature" tag was removed from it in Cloudinary.
  const result = sortByFeaturedOrder(resources, ["z", "b", "a"]);
  assert.deepEqual(result.map((r) => r.public_id), ["b", "a"]);
});

test("does not mutate the input resources array", () => {
  const resources = [res("a"), res("b")];
  const original = [...resources];
  sortByFeaturedOrder(resources, ["b", "a"]);
  assert.deepEqual(resources, original);
});
