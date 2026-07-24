const ALLOWED_ORIGIN = "https://gchiansnap.github.io";

// The site (gchiansnap.github.io) and this Worker (*.workers.dev) live on two
// different registrable domains — no custom domain planned — so every fetch()
// from the site to the Worker is a cross-site request as far as the browser
// is concerned.
//
// SameSite=Lax cookies are NOT sent on cross-site fetch()/XHR calls (only on
// top-level navigations), which would silently break the "cookie exists ->
// allow immediately" flow: login would set the cookie, but the very next
// /galleries or /gallery request wouldn't include it. So this uses
// SameSite=None instead — Secure is already required either way, and
// SameSite=None is what's needed for the cookie to actually travel with
// cross-site fetch() calls.
//
// Trade-off: SameSite=None is a weaker CSRF boundary than Lax. That's
// acceptable here because /auth/login only *sets* a cookie (nothing
// state-changing happens by having one), and every other endpoint is a
// read-only GET that re-verifies the signed token itself — there's no
// state-changing action a forged cross-site request could trigger.
const SESSION_COOKIE_SAMESITE = "None";
const SESSION_COOKIE_NAME = "pr_session";
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60; // 30 days

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
  "Access-Control-Allow-Credentials": "true",
};

// --- gallery registry --------------------------------------------------
//
// The single source of truth for every gallery the private-gallery system
// knows about. No database — this array *is* the database. Edit it and
// redeploy the Worker to add/retire a gallery.
//
// Schema:
//   title:         display name
//   slug:          used in the gallery URL (?slug=...) — keep it URL-safe
//   tag:           the Cloudinary tag whose photos make up this gallery
//   visibility:    "public" | "private"
//   listed:        (private only) whether it appears in the "Private Galleries"
//                  list for members who can see it. false = hidden: only
//                  reachable by someone who already has the direct link,
//                  and still fully gated by allowedGroups.
//   allowedGroups: (private only) which login groups may view it. Group
//                  names must match keys in the GROUP_PASSWORDS secret.
// PUBLISHER:GALLERIES:START — auto-generated, do not hand-edit
const GALLERY_REGISTRY = [
  {
    title: "Gregnes Family Photos",
    slug: "gregnes",
    tag: "gregnes",
    visibility: "private",
    listed: true,
    allowedGroups: ["family", "VIP"],
  },
  {
    title: "Italy 2018",
    slug: "italy-2018",
    tag: "italy-2018",
    visibility: "private",
    listed: true,
    allowedGroups: ["VIP", "family"],
  },
  {
    title: "Switzerland 2018",
    slug: "switzerland-2018",
    tag: "switzerland-2018",
    visibility: "private",
    listed: true,
    allowedGroups: ["VIP", "family"],
  },
  {
    title: "Japan 2023",
    slug: "japan-2023",
    tag: "japan-2023",
    visibility: "private",
    listed: true,
    allowedGroups: ["VIP", "family"],
  },
  {
    title: "Japan 2025",
    slug: "japan-2025",
    tag: "japan-2025",
    visibility: "private",
    listed: true,
    allowedGroups: ["family", "VIP"],
  },
  {
    title: "Studio Photoshoot",
    slug: "gregnes-studio-photoshoot",
    tag: "gregnes-studio-photoshoot",
    visibility: "private",
    listed: true,
    allowedGroups: ["VIP", "family"],
  },
  {
    title: "BKK Photoshoot",
    slug: "gregnes-bkk-photoshoot",
    tag: "gregnes-bkk-photoshoot",
    visibility: "private",
    listed: true,
    allowedGroups: ["VIP", "family"],
  },
  {
    title: "Vietnam 2016",
    slug: "vietnam-2016",
    tag: "vietnam-2016",
    visibility: "private",
    listed: true,
    allowedGroups: ["dinnerclub", "VIP"],
  },
  {
    title: "Dinner Club Penang Trip",
    slug: "dc-penang",
    tag: "dc-penang",
    visibility: "private",
    listed: true,
    allowedGroups: ["dinnerclub", "VIP"],
  },
  {
    title: "Dinner Club Wedding",
    slug: "dc-wedding",
    tag: "dc-wedding",
    visibility: "private",
    listed: true,
    allowedGroups: ["dinnerclub", "VIP"],
  },
  {
    title: "Dinner Club Christmas",
    slug: "dc-xmas",
    tag: "dc-xmas",
    visibility: "private",
    listed: true,
    allowedGroups: ["dinnerclub", "VIP"],
  },
  {
    title: "Bangkok 2026",
    slug: "bangkok-2026",
    tag: "bangkok-2026",
    visibility: "private",
    listed: true,
    allowedGroups: ["VIP", "family"],
  },
];
// PUBLISHER:GALLERIES:END

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (url.pathname === "/tag" && request.method === "GET") {
      return handleTagLookup(url.searchParams.get("tag"), env);
    }

    if (url.pathname === "/auth/login" && request.method === "POST") {
      return handleLogin(request, env);
    }

    if (url.pathname === "/auth/logout" && request.method === "POST") {
      return handleLogout();
    }

    if (url.pathname === "/auth/session" && request.method === "GET") {
      return handleSessionCheck(request, env);
    }

    if (url.pathname === "/galleries" && request.method === "GET") {
      return handleGalleryList(request, env);
    }

    if (url.pathname === "/gallery" && request.method === "GET") {
      return handleGalleryPhotos(request, env, url.searchParams.get("slug"));
    }

    return new Response("Not found", { status: 404, headers: CORS_HEADERS });
  },
};

// --- shared Cloudinary helpers -------------------------------------------

function cloudinaryAuth(env) {
  return btoa(`${env.CLOUDINARY_API_KEY}:${env.CLOUDINARY_API_SECRET}`);
}

// Cheaper than fetchResourcesByTag when only a number is needed (e.g. for
// the gallery list) — one search call, max_results:1, reading total_count
// from the response instead of paginating and fetching full resource
// details for every photo.
async function countResourcesByTag(tag, env) {
  const auth = cloudinaryAuth(env);
  const cloudName = env.CLOUDINARY_CLOUD_NAME;

  const res = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${auth}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ expression: `tags="${tag}"`, max_results: 1 }),
    }
  );
  if (!res.ok) {
    throw new Error(`Cloudinary count failed: ${await res.text()}`);
  }
  const data = await res.json();
  return data.total_count || 0;
}

async function fetchResourcesByTag(tag, env) {
  const auth = cloudinaryAuth(env);
  const cloudName = env.CLOUDINARY_CLOUD_NAME;

  let publicIds = [];
  let nextCursor = null;
  do {
    const searchBody = { expression: `tags="${tag}"`, max_results: 500 };
    if (nextCursor) searchBody.next_cursor = nextCursor;

    const searchRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/search`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${auth}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(searchBody),
      }
    );
    if (!searchRes.ok) {
      throw new Error(`Cloudinary search failed: ${await searchRes.text()}`);
    }
    const searchData = await searchRes.json();
    publicIds.push(...(searchData.resources || []).map((r) => r.public_id));
    nextCursor = searchData.next_cursor || null;
  } while (nextCursor);

  if (publicIds.length === 0) return [];

  const resources = [];
  const CHUNK_SIZE = 100;
  for (let i = 0; i < publicIds.length; i += CHUNK_SIZE) {
    const chunk = publicIds.slice(i, i + CHUNK_SIZE);
    const idParams = chunk
      .map((id) => `public_ids[]=${encodeURIComponent(id)}`)
      .join("&");

    const detailsRes = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/resources/image/upload?${idParams}&image_metadata=true&context=true`,
      { headers: { Authorization: `Basic ${auth}` } }
    );
    if (!detailsRes.ok) {
      throw new Error(`Cloudinary details fetch failed: ${await detailsRes.text()}`);
    }
    const detailsData = await detailsRes.json();
    resources.push(
      ...(detailsData.resources || []).map((r) => ({
        public_id: r.public_id,
        tags: r.tags,
        context: r.context,
        image_metadata: r.image_metadata || null,
      }))
    );
  }

  return resources;
}

function json(data, status, cacheControl, extraHeaders) {
  const headers = { ...CORS_HEADERS, "Content-Type": "application/json", ...extraHeaders };
  if (cacheControl) headers["Cache-Control"] = cacheControl;
  return new Response(JSON.stringify(data), { status, headers });
}

// --- session tokens: base64url(payload).base64url(HMAC-SHA256 signature) ---

function base64UrlEncode(bytes) {
  let binary = "";
  bytes.forEach((b) => (binary += String.fromCharCode(b)));
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlDecode(str) {
  const padded = str.replace(/-/g, "+").replace(/_/g, "/").padEnd(str.length + ((4 - (str.length % 4)) % 4), "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

async function getSigningKey(env) {
  const secret = env.SESSION_SECRET;
  if (!secret) throw new Error("Missing SESSION_SECRET");
  return crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign", "verify"]
  );
}

// Signs { g: group, exp: <unix seconds> } into a compact, tamper-proof token.
// The token proves group membership; it never contains the password itself.
async function signSession(group, env) {
  const payload = JSON.stringify({
    g: group,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  });
  const payloadB64 = base64UrlEncode(new TextEncoder().encode(payload));
  const key = await getSigningKey(env);
  const sig = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payloadB64));
  const sigB64 = base64UrlEncode(new Uint8Array(sig));
  return `${payloadB64}.${sigB64}`;
}

// Verifies a token's signature and expiry. Returns { authenticated, group }.
async function verifySession(token, env) {
  if (!token) return { authenticated: false, group: null };
  const parts = token.split(".");
  if (parts.length !== 2) return { authenticated: false, group: null };
  const [payloadB64, sigB64] = parts;

  let sigBytes;
  try {
    sigBytes = base64UrlDecode(sigB64);
  } catch {
    return { authenticated: false, group: null };
  }

  const key = await getSigningKey(env);
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    sigBytes,
    new TextEncoder().encode(payloadB64)
  );
  if (!valid) return { authenticated: false, group: null };

  let payload;
  try {
    payload = JSON.parse(new TextDecoder().decode(base64UrlDecode(payloadB64)));
  } catch {
    return { authenticated: false, group: null };
  }

  if (!payload.g || !payload.exp || payload.exp < Math.floor(Date.now() / 1000)) {
    return { authenticated: false, group: null };
  }

  return { authenticated: true, group: payload.g };
}

function getCookie(request, name) {
  const header = request.headers.get("Cookie") || "";
  const match = header.match(new RegExp(`(?:^|;\\s*)${name}=([^;]+)`));
  return match ? match[1] : null;
}

function getBearerToken(request) {
  const header = request.headers.get("Authorization") || "";
  const match = header.match(/^Bearer\s+(.+)$/i);
  return match ? match[1] : null;
}

// Checks for a session token two ways: an Authorization: Bearer header
// first, then the pr_session cookie as a fallback. The header path exists
// because in-app browsers (Instagram, Facebook, TikTok, etc.) run on
// locked-down WebViews that block or silently drop third-party/cross-site
// cookies — even ones explicitly marked SameSite=None; Secure, which a
// regular browser accepts fine. A token sent as a normal request header
// isn't a cookie at all, so those WebViews have nothing to block.
async function getSession(request, env) {
  const token = getBearerToken(request) || getCookie(request, SESSION_COOKIE_NAME);
  return verifySession(token, env);
}

function buildSetCookie(value, maxAgeSeconds) {
  return [
    `${SESSION_COOKIE_NAME}=${value}`,
    `Max-Age=${maxAgeSeconds}`,
    "Path=/",
    "HttpOnly",
    "Secure",
    `SameSite=${SESSION_COOKIE_SAMESITE}`,
  ].join("; ");
}

// Constant-time-ish string compare — avoids the most obvious timing leak
// (early-exit on first mismatched byte). Not a substitute for rate limiting;
// see DEPLOYMENT notes on this system's realistic threat model.
function timingSafeEqual(a, b) {
  const aBytes = new TextEncoder().encode(a);
  const bBytes = new TextEncoder().encode(b);
  const len = Math.max(aBytes.length, bBytes.length);
  let diff = aBytes.length ^ bBytes.length;
  for (let i = 0; i < len; i++) {
    diff |= (aBytes[i] || 0) ^ (bBytes[i] || 0);
  }
  return diff === 0;
}

// --- routes ----------------------------------------------------------------

// GET /tag?tag=X — public, no auth. Used for hero, feature, and public albums.
async function handleTagLookup(tag, env) {
  if (!tag) return json({ error: "Missing tag parameter" }, 400);
  try {
    const resources = await fetchResourcesByTag(tag, env);
    return json({ resources }, 200, "public, max-age=60");
  } catch (err) {
    return json({ error: "Worker error", detail: err.message }, 500);
  }
}

// POST /auth/login { password } — one password field. The password is
// checked against every entry in the GROUP_PASSWORDS secret (a JSON object
// mapping group name -> password, e.g. {"family":"...","friends":"...",
// "guests":"..."}); whichever group's password matches becomes the signed
// session's group. On success, sets a signed, HttpOnly session cookie (for
// regular browsers) AND returns the same signed token in the response body
// (for clients storing it in localStorage — see getSession's comment on
// why: in-app browsers block the cookie). Never echoes back which group
// matched.
async function handleLogin(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const { password } = body || {};
  if (!password || typeof password !== "string") {
    return json({ error: "Missing password" }, 400);
  }

  let groupPasswords;
  try {
    groupPasswords = JSON.parse(env.GROUP_PASSWORDS || "{}");
  } catch {
    return json({ error: "Server misconfiguration" }, 500);
  }

  // Check every group rather than stopping at the first match, so the
  // response time doesn't hint at how many groups exist or which one hit.
  let matchedGroup = null;
  for (const [group, expected] of Object.entries(groupPasswords)) {
    if (timingSafeEqual(password, String(expected))) matchedGroup = group;
  }

  if (!matchedGroup) {
    return json({ error: "Incorrect password" }, 401);
  }

  const token = await signSession(matchedGroup, env);
  return json(
    { ok: true, token },
    200,
    "no-store",
    { "Set-Cookie": buildSetCookie(token, SESSION_MAX_AGE_SECONDS) }
  );
}

// POST /auth/logout — clears the session cookie.
function handleLogout() {
  return json(
    { ok: true },
    200,
    "no-store",
    { "Set-Cookie": buildSetCookie("", 0) }
  );
}

// GET /auth/session — tells the caller's own browser whether it currently
// holds a valid session. Deliberately returns nothing about which group.
async function handleSessionCheck(request, env) {
  const session = await getSession(request, env);
  return json({ authenticated: session.authenticated }, 200, "no-store");
}

// GET /galleries — returns the galleries this visitor is allowed to know
// about: all public ones, plus any *listed* private ones whose
// allowedGroups includes the visitor's authenticated group. Hidden private
// galleries are never included here regardless of auth — they only exist
// via direct link. No password/group/access info is ever revealed for
// galleries that are filtered out. Each entry includes a photo count,
// fetched concurrently across all visible galleries.
async function handleGalleryList(request, env) {
  const session = await getSession(request, env);

  const visible = GALLERY_REGISTRY.filter((g) => {
    if (g.visibility === "public") return true;
    if (g.visibility === "private") {
      if (!g.listed) return false;
      return session.authenticated && g.allowedGroups.includes(session.group);
    }
    return false;
  });

  const galleries = await Promise.all(
    visible.map(async (g) => {
      let count = null;
      try {
        count = await countResourcesByTag(g.tag, env);
      } catch {
        // Don't let one gallery's count lookup fail the whole list —
        // it'll just render without a count client-side.
      }
      return { title: g.title, slug: g.slug, count };
    })
  );

  return json({ galleries }, 200, "no-store");
}


// GET /gallery?slug=X — returns photos for one gallery. Public galleries
// are always served. Private galleries require a valid session whose group
// is in allowedGroups. A gallery that doesn't exist and a gallery the
// visitor can't access return the identical 404 — this endpoint never
// reveals whether a slug exists, or whether the caller merely has the
// wrong group.
async function handleGalleryPhotos(request, env, slug) {
  if (!slug) return json({ error: "Not found" }, 404);

  const gallery = GALLERY_REGISTRY.find((g) => g.slug === slug);
  if (!gallery) return json({ error: "Not found" }, 404);

  if (gallery.visibility === "private") {
    const session = await getSession(request, env);
    const allowed = session.authenticated && gallery.allowedGroups.includes(session.group);
    if (!allowed) return json({ error: "Not found" }, 404);
  }

  try {
    const resources = await fetchResourcesByTag(gallery.tag, env);
    return json({ title: gallery.title, resources }, 200, "no-store");
  } catch (err) {
    return json({ error: "Worker error", detail: err.message }, 500);
  }
}
