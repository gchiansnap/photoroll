// Central place to configure the site. Edit this file to change
// cloud name, which tags drive the homepage, or to add new albums.

const CONFIG = {
  cloudName: "ikxlglox",

  // Secure proxy that fetches tag data from Cloudinary's Admin API —
  // needed because the public tag-list endpoint isn't available on
  // this account. See cloudflare-worker.js for the Worker's source.
  apiBaseUrl: "https://photoroll-api.gchian-b53.workers.dev",

  // Photos tagged "hero" in Cloudinary show up as the homepage hero.
  // If more than one photo has this tag, the first one returned is used.
  heroTag: "hero",

  // Photos tagged "feature" in Cloudinary show up in the "Featured work"
  // section on the homepage. Tag up to 6 for the best layout.
  featureTag: "feature",

  // Each album pulls its photos live from Cloudinary by tag — tag a
  // photo with an album's tag to add it, remove the tag to drop it.
  // To add a new album: tag some photos in Cloudinary, then add one
  // entry here and a matching page in /albums.
  albums: [
    {
      slug: "joochiat",
      title: "Joo Chiat",
      subtitle: "Roll 001 — Jan 2026",
      tag: "joochiat",
      description: "A walk through Joo Chiat, shot on the Olympus E-M5 Mark II."
    }
  ],

  // Brief gear description shown on the homepage.
  gear: {
    heading: "Gear",
    body: "Shot primarily on an Olympus E-M5 Mark II with a mix of prime and zoom micro four-thirds glass, alongside an iPhone 16 Pro Max for quicker, unplanned frames. No fixed kit — whatever fits the walk that day."
  }
};
