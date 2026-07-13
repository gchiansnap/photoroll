# Deployment

This site is hosted on GitHub Pages, deployed from the `main` branch, root folder.

## Pushing an update

1. Make your changes locally (or edit directly in GitHub's web UI).
2. In the `photoroll` repo: **Add file → Upload files**, drag in the changed file(s)
   — keep the same folder structure (e.g. an updated `main.css` goes into `css/`,
   not the repo root).
3. Commit changes.
4. Give it a minute, then refresh the live site. Hard refresh
   (Ctrl+Shift+R / Cmd+Shift+R) if you don't see the update right away.

## Live URLs

- Homepage: `https://gchiansnap.github.io/photoroll/`
- Joo Chiat album: `https://gchiansnap.github.io/photoroll/albums/joochiat.html`

## Managing photos (no code changes needed)

Most day-to-day changes — adding/removing photos from an album, changing the
homepage hero or featured shots, editing captions — don't require touching any
files here at all. They're done entirely in Cloudinary:

- **Add/remove from an album:** add or remove that album's tag on the photo.
- **Change the hero:** move the `hero` tag to a different photo.
- **Change featured shots:** adjust which 6 photos carry the `feature` tag.
- **Edit a caption:** update the photo's `caption` context field.

Changes take effect within about a minute (Cloudinary's tag-list cache).

## Private galleries for friends & family

Unlike public albums, private galleries aren't linked from anywhere on the
site — the only way in is a direct link you share, and that link is
password-protected. One page (`private.html`) serves every private
gallery; you don't create a new HTML file each time.

### Creating a new private gallery

**1. Tag the photos in Cloudinary**
Pick a tag name for this gallery — something specific and not easily
guessed, e.g. `family-reunion-2026` rather than `family`. Tag the relevant
photos with it, same as any other tag.

**2. Set a password for that tag**
In the Cloudflare dashboard: **Workers & Pages → photoroll-api → Settings
→ Variables and Secrets**, find `PRIVATE_GALLERY_PASSWORDS`, and edit it.
It's a single JSON object mapping tag → password:

```json
{"family-reunion-2026": "somepassword", "bali-friends": "anotherpassword"}
```

Add a new entry for your new tag, keep the existing ones, save, and
redeploy the Worker (Cloudflare prompts you to when you save a secret).

**3. Build the link**
```
https://gchiansnap.github.io/photoroll/private.html?tag=family-reunion-2026&title=Family%20Reunion%202026
```
- `tag` must exactly match the Cloudinary tag and the key you set in the password JSON.
- `title` is what shows as the page heading — spaces need to be `%20` (or use any URL encoder).

**4. Share it**
Send the link and the password to whoever you want to have access —
ideally through different channels (e.g. link over chat, password over a
call or a separate message), so a single intercepted message doesn't hand
over both.

### Retiring or updating a gallery

- **Change the password:** edit the value for that tag in
  `PRIVATE_GALLERY_PASSWORDS` and redeploy. Anyone with the old password
  is locked out immediately; anyone who already unlocked it in their
  browser this session stays in until they close the tab.
- **Remove it entirely:** delete that tag's entry from
  `PRIVATE_GALLERY_PASSWORDS`, and remove the tag from the photos in
  Cloudinary. The link stops working either way, but doing both keeps
  things tidy.
- **Add/remove photos from an existing gallery:** same as any tag — add
  or remove it in Cloudinary, changes show up within a minute.

### How it works, and its real limits

The password check happens on the Cloudflare Worker, not in the page's
JavaScript — so unlike a simple "hide the gallery behind a JS password
prompt," someone reading the page's source code can't find the password
sitting in plain text. The Worker only returns photo data after it
verifies the password server-side.

That said, be realistic about what this protects against: it keeps out
casual visitors and stops the gallery from being discoverable or indexed
(the page includes `noindex` for search engines), but it isn't
bank-grade security. There's no rate-limiting on password attempts, so
it wouldn't stop a determined, technical person from brute-forcing a
weak password. Use it for "keep this out of search engines and casual
browsing," not for anything genuinely sensitive. Pick passwords that
aren't trivially guessable, and you're in good shape for its actual
purpose — sharing photos with people you trust without making them
public.

A convenience note: once someone enters the correct password, the
browser remembers it for that tab session (not permanently), so they
won't be re-prompted on every visit until they close the tab.

## GitHub Pages settings

Settings → Pages → Source: **Deploy from a branch** → Branch: **main** → Folder: **/ (root)**
