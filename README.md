# photoroll

A personal photo journal, hosted on GitHub Pages, with images served through Cloudinary.

## Structure

```
photoroll/
├── index.html          Homepage — hero, featured shots, album links
├── about.html           Bio and full gear breakdown
├── private.html          Password-gated gallery template — one file, reused for every private gallery via URL params
├── albums/
│   └── joochiat.html    An album page (one per "roll")
├── css/
│   └── main.css         Shared styles for the whole site
├── js/
│   ├── config.js        Cloud name, tag names, album list, about/gear content
│   ├── cloudinary.js     Shared helpers for building URLs and fetching photos by tag
│   ├── lightbox.js       Shared lightbox (click/swipe navigation), used everywhere
│   ├── exif-data.js      Static EXIF lookup, since Cloudinary's plan doesn't expose it
│   ├── home.js           Homepage-specific logic
│   ├── about.js          About page logic
│   └── private-gallery.js  Password prompt + gallery rendering for private.html
└── assets/               Favicons and any static files not served from Cloudinary
```

## How photos get on the site

Nothing here is hardcoded to a specific photo. Every gallery — the homepage hero,
the featured strip, and each album — is built by fetching photos **by Cloudinary tag**
at page-load time, using Cloudinary's public, unauthenticated tag-list endpoint.

- Tag a photo `hero` in Cloudinary → it becomes the homepage hero.
- Tag up to 6 photos `feature` → they appear in "Featured work" on the homepage.
- Tag photos with an album's tag (e.g. `joochiat`) → they appear in that album.
- Remove a tag → the photo disappears from that section.

Cloudinary caches these tag lists for about 60 seconds, so changes show up within a minute.

Captions come from each photo's **context metadata** in Cloudinary (the `caption` field).
If a photo has no caption set, the album's title is used as a fallback.

## Adding a new album

1. Tag some photos in Cloudinary with a new tag, e.g. `bali2026`.
2. Add an entry to the `albums` array in `js/config.js`.
3. Copy `albums/joochiat.html`, rename it to match your new slug, and update the `slug` constant near the bottom of the file to match.
4. Add a link — it'll show up automatically on the homepage once it's in `config.js`.

See `DEPLOYMENT.md` for how to push changes live.
