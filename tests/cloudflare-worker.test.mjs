// Tests for the login rate-limiter added to cloudflare-worker.js (10 failed
// attempts -> 24h lockout, per client IP). Run with:
//   node --test tests/cloudflare-worker.test.mjs
//
// No dependencies beyond Node's built-in test runner + assert — the Worker
// only uses standard Web APIs (Request/Response/crypto.subtle/fetch globals),
// all present in Node 18+, so it can be imported and driven directly without
// wrangler or any Cloudflare-specific runtime.
//
// A MockKV stands in for the real RATE_LIMIT_KV binding: same get/put/delete
// shape Workers KV exposes, backed by an in-memory Map instead of Cloudflare's
// actual (eventually-consistent) storage. That means these tests confirm the
// rate-limit *logic* is correct; they can't catch the KV-consistency caveat
// documented in cloudflare-worker.js's rate-limiting comments (concurrent
// requests racing on the same counter) — that's a real-infrastructure
// behavior no mock can reproduce.

import assert from "node:assert/strict";
import { test, beforeEach } from "node:test";

import worker from "../cloudflare-worker.js";

class MockKV {
  constructor() {
    this.store = new Map();
  }
  async get(key) {
    return this.store.has(key) ? this.store.get(key) : null;
  }
  async put(key, value) {
    this.store.set(key, value);
  }
  async delete(key) {
    this.store.delete(key);
  }
}

const CORRECT_PASSWORD = "correct-horse-battery-staple";

function makeEnv() {
  return {
    GROUP_PASSWORDS: JSON.stringify({ family: CORRECT_PASSWORD }),
    SESSION_SECRET: "test-only-session-secret-not-used-in-production",
    RATE_LIMIT_KV: new MockKV(),
  };
}

function loginRequest(password, ip = "203.0.113.1") {
  return new Request("https://example.com/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json", "CF-Connecting-IP": ip },
    body: JSON.stringify({ password }),
  });
}

let env;
beforeEach(() => {
  env = makeEnv();
});

test("correct password on the first attempt succeeds", async () => {
  const res = await worker.fetch(loginRequest(CORRECT_PASSWORD), env);
  const body = await res.json();
  assert.equal(res.status, 200);
  assert.equal(body.ok, true);
  assert.ok(body.token, "expected a session token in the response body");
});

test("wrong password returns 401 and does not lock out before the threshold", async () => {
  for (let i = 0; i < 9; i++) {
    const res = await worker.fetch(loginRequest("wrong"), env);
    assert.equal(res.status, 401, `attempt ${i + 1} should be a plain 401, not locked out yet`);
  }
  // The 9th failure hasn't reached LOGIN_MAX_ATTEMPTS (10) yet, so the
  // correct password should still work right after.
  const res = await worker.fetch(loginRequest(CORRECT_PASSWORD), env);
  assert.equal(res.status, 200, "should not be locked out before 10 failures");
});

test("the 10th failed attempt triggers a 24h lockout, even with the correct password", async () => {
  for (let i = 0; i < 10; i++) {
    await worker.fetch(loginRequest("wrong"), env);
  }
  const res = await worker.fetch(loginRequest(CORRECT_PASSWORD), env);
  const body = await res.json();
  assert.equal(res.status, 429);
  assert.ok(body.retryAfterSeconds > 0, "expected a positive retryAfterSeconds");
  // Should be close to 24h (allow a little slack for test execution time).
  assert.ok(
    body.retryAfterSeconds > 24 * 60 * 60 - 5 && body.retryAfterSeconds <= 24 * 60 * 60,
    `expected retryAfterSeconds near 86400, got ${body.retryAfterSeconds}`
  );
});

test("lockout includes a Retry-After header", async () => {
  for (let i = 0; i < 10; i++) {
    await worker.fetch(loginRequest("wrong"), env);
  }
  const res = await worker.fetch(loginRequest("wrong"), env);
  assert.equal(res.status, 429);
  assert.ok(Number(res.headers.get("Retry-After")) > 0);
});

test("a successful login clears the failure counter", async () => {
  for (let i = 0; i < 5; i++) {
    await worker.fetch(loginRequest("wrong"), env);
  }
  const ok = await worker.fetch(loginRequest(CORRECT_PASSWORD), env);
  assert.equal(ok.status, 200);

  // Counter should be back to zero — 9 more failures shouldn't lock out.
  for (let i = 0; i < 9; i++) {
    const res = await worker.fetch(loginRequest("wrong"), env);
    assert.equal(res.status, 401);
  }
  const stillWorks = await worker.fetch(loginRequest(CORRECT_PASSWORD), env);
  assert.equal(stillWorks.status, 200, "counter should have reset after the earlier success");
});

test("lockout is scoped per IP, not global", async () => {
  for (let i = 0; i < 10; i++) {
    await worker.fetch(loginRequest("wrong", "203.0.113.1"), env);
  }
  const lockedOut = await worker.fetch(loginRequest(CORRECT_PASSWORD, "203.0.113.1"), env);
  assert.equal(lockedOut.status, 429);

  const otherIp = await worker.fetch(loginRequest(CORRECT_PASSWORD, "198.51.100.7"), env);
  assert.equal(otherIp.status, 200, "a different IP should be unaffected");
});

test("missing RATE_LIMIT_KV binding degrades to no rate limiting rather than erroring", async () => {
  const envWithoutKv = makeEnv();
  delete envWithoutKv.RATE_LIMIT_KV;

  for (let i = 0; i < 20; i++) {
    const res = await worker.fetch(loginRequest("wrong"), envWithoutKv);
    assert.equal(res.status, 401, "should keep returning plain 401s, never crash");
  }
  const res = await worker.fetch(loginRequest(CORRECT_PASSWORD), envWithoutKv);
  assert.equal(res.status, 200, "correct password should still work without KV bound");
});

test("never reveals which group's password matched, win or lose", async () => {
  const twoGroupEnv = makeEnv();
  twoGroupEnv.GROUP_PASSWORDS = JSON.stringify({ family: CORRECT_PASSWORD, friends: "another-password" });

  const res = await worker.fetch(loginRequest(CORRECT_PASSWORD), twoGroupEnv);
  const body = await res.json();
  assert.equal(Object.keys(body).sort().join(","), "ok,token");
});
