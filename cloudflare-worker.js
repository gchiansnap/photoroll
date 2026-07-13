const ALLOWED_ORIGIN = "https://gchiansnap.github.io";

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": ALLOWED_ORIGIN,
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: CORS_HEADERS });
    }

    if (url.pathname === "/tag" && request.method === "GET") {
      return handleTagLookup(url.searchParams.get("tag"), env);
    }

    if (url.pathname === "/private" && request.method === "POST") {
      return handlePrivateLookup(request, env);
    }

    return new Response("Not found", { status: 404, headers: CORS_HEADERS });
  },
};

// --- shared Cloudinary helpers -------------------------------------------

function cloudinaryAuth(env) {
  return btoa(`${env.CLOUDINARY_API_KEY}:${env.CLOUDINARY_API_SECRET}`);
}

async function fetchResourcesByTag(tag, env) {
  const auth = cloudinaryAuth(env);
  const cloudName = env.CLOUDINARY_CLOUD_NAME;

  // Step 1: page through search results to collect every public ID
  // with this tag. Cloudinary's Search API caps each request at 500
  // results, so galleries larger than that need multiple requests,
  // following next_cursor until it's exhausted.
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

  // Step 2: fetch full details (context + EXIF) for those public IDs.
  // The Admin API's by-public-ID lookup caps at 100 IDs per request,
  // so batch large galleries into chunks of 100 and combine.
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

function json(data, status, cacheControl) {
  const headers = { ...CORS_HEADERS, "Content-Type": "application/json" };
  if (cacheControl) headers["Cache-Control"] = cacheControl;
  return new Response(JSON.stringify(data), { status, headers });
}

// --- routes ----------------------------------------------------------------

// GET /tag?tag=X — public, no password. Used for hero, feature, and
// public album galleries.
async function handleTagLookup(tag, env) {
  if (!tag) return json({ error: "Missing tag parameter" }, 400);
  try {
    const resources = await fetchResourcesByTag(tag, env);
    return json({ resources }, 200, "public, max-age=60");
  } catch (err) {
    return json({ error: "Worker error", detail: err.message }, 500);
  }
}

// POST /private { tag, password } — password-gated. Used for unlisted
// friends & family galleries. Passwords live in the PRIVATE_GALLERY_PASSWORDS
// secret, a JSON object mapping tag -> password, e.g.
// {"family2026": "somepassword", "bali-friends": "anotherpassword"}
async function handlePrivateLookup(request, env) {
  let body;
  try {
    body = await request.json();
  } catch {
    return json({ error: "Invalid request body" }, 400);
  }

  const { tag, password } = body || {};
  if (!tag || !password) {
    return json({ error: "Missing tag or password" }, 400);
  }

  let passwordMap;
  try {
    passwordMap = JSON.parse(env.PRIVATE_GALLERY_PASSWORDS || "{}");
  } catch {
    return json({ error: "Server misconfiguration" }, 500);
  }

  const expected = passwordMap[tag];
  if (!expected) {
    return json({ error: "Gallery not found" }, 404);
  }
  if (password !== expected) {
    return json({ error: "Incorrect password" }, 401);
  }

  try {
    const resources = await fetchResourcesByTag(tag, env);
    return json({ resources }, 200, "no-store");
  } catch (err) {
    return json({ error: "Worker error", detail: err.message }, 500);
  }
}
