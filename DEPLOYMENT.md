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

## GitHub Pages settings

Settings → Pages → Source: **Deploy from a branch** → Branch: **main** → Folder: **/ (root)**
