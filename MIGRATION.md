# Private gallery auth redesign — what changed & how to deploy

## Files in this drop

| File | What it is |
|---|---|
| `cloudflare-worker.js` | Full replacement for your current Worker. |
| `gallery-schema.example.json` | Reference for the `GALLERY_REGISTRY` schema (not loaded by the Worker — it's a doc, the registry lives in the worker file itself). |
| `private-login.html` + `js/private-login.js` | New single-password login page. |
| `private.html` + `js/private-list.js` | **Replaces** your old `private.html`. This is now the "Private Galleries / Welcome back." hub — lists whatever galleries the visitor's session can see. |
| `private-gallery.html` + `js/private-gallery.js` | **New name for your old `private.html`/`private-gallery.js`** — this is the individual-gallery template (what `?tag=&title=` used to be, now `?slug=`). |
| `js/home.js` | One function changed: the homepage's "Private Galleries" section now links to the hub instead of listing galleries by tag. |
| `js/config.js` | Removed `privateGalleries` — that list now lives server-side only. |

Everything else (`css/main.css`, `js/cloudinary.js`, `js/lightbox.js`, `js/slideshow.js`, `js/exif-data.js`, `js/analytics.js`, albums, `about.html`, `index.html`) is untouched — just re-upload the files above.

## Cookie setting: SameSite=None (not Lax)

Your site (`gchiansnap.github.io`) and Worker (`photoroll-api.gchian-b53.workers.dev`) are on different domains, and you've confirmed you don't want a custom domain — so every `fetch()` from the site to the Worker is a **cross-site** request from the browser's point of view.

`SameSite=Lax` cookies are only sent on same-site requests and top-level navigations, not on cross-site `fetch()` calls. Since a custom domain (which would make `Lax` work as originally requested) is off the table, `cloudflare-worker.js` sets `SESSION_COOKIE_SAMESITE = "None"` instead — `Secure` is already set regardless, which `None` requires. This is what makes the "cookie exists → allow immediately" flow actually work across the two domains.

The trade-off is a slightly weaker CSRF boundary than `Lax` would give you. That's acceptable here: `/auth/login` only *sets* a cookie (no state change from merely having one), and every other private-gallery endpoint is a read-only `GET` that re-verifies the signed token itself — there's no state-changing action a forged cross-site request could trigger.

If you ever do get a domain down the road, switching back to `SameSite=Lax` is a one-line change once the site and Worker share a registrable domain.

## Cloudflare secrets

In **Workers & Pages → your worker → Settings → Variables and Secrets**:

- Keep: `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`, `CLOUDINARY_CLOUD_NAME`
- **Remove**: `PRIVATE_GALLERY_PASSWORDS` (no longer used)
- **Add**: `GROUP_PASSWORDS` — a JSON object mapping group name → password:
  ```json
  {"family": "choose-a-strong-passphrase", "friends": "a-different-one", "guests": "and-another"}
  ```
  Group names are your call — they just need to match the `allowedGroups` values you use in `GALLERY_REGISTRY`.
- **Add**: `SESSION_SECRET` — a long random string used to sign session cookies. Generate one with, e.g., `openssl rand -hex 32`, and treat it like a password: if it leaks, anyone can forge a valid session for any group.

Save each as a secret (not a plaintext variable) and redeploy when prompted.

## Editing the gallery list

Open `cloudflare-worker.js` and edit the `GALLERY_REGISTRY` array near the top — see `gallery-schema.example.json` for the field reference (`title`, `slug`, `tag`, `visibility`, `listed`, `allowedGroups`). Redeploy the Worker after any change; there's no separate database to update.

## Why there's both a cookie and a localStorage token

Login now returns the signed session token two ways: as the `pr_session` cookie (as originally designed) *and* in the JSON response body, which `js/private-auth.js` stores in `localStorage` and sends as an `Authorization: Bearer <token>` header on every private-gallery request.

This exists because in-app browsers (Instagram, Facebook, TikTok, etc.) run on locked-down WebViews that block or silently drop third-party/cross-site cookies — including ones marked `SameSite=None; Secure`, which a regular mobile browser accepts fine. A token sent as a normal header isn't a cookie, so those WebViews have nothing to block. `getSession()` in the Worker checks the `Authorization` header first, falling back to the cookie.

**Trade-off:** a token in `localStorage` can be read by any script running on the page — an `HttpOnly` cookie can't be read by JS at all. That only matters if something else on the page were ever compromised (e.g. a malicious third-party script); worth knowing, not a reason to avoid it here.

**Logout** now clears the `localStorage` token client-side (that's what actually matters, since the token itself is stateless and not revoked server-side) in addition to calling `/auth/logout` to clear the cookie.

No new secrets or deploy steps beyond what's already above — redeploy the Worker for the `getSession`/`handleLogin` changes, and push the four updated `js/private-*.js` files plus the new `js/private-auth.js`.

## What this buys you vs. the old system

- One password per person, not one per gallery — a family member with the family password sees every gallery `allowedGroups` grants "family," automatically.
- 30-day signed session instead of the browser remembering a plaintext password.
- Hidden galleries are now actually hidden from the listing endpoint, not just unlinked from the homepage.
- `/gallery?slug=X` returns an identical 404 whether the slug doesn't exist or the visitor's group just isn't allowed — no way to probe which galleries exist or who has access to what.
- Works consistently inside in-app browsers, not just regular mobile/desktop browsers.

## Realistic limits (same as before)

No rate-limiting on login attempts — a determined, technical person could still brute-force a weak password. Keep passwords non-trivial. This is "keep it off search engines and out of casual reach," not bank-grade security, same as your existing README already says.
