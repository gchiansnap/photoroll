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

  // A photo tagged "about" in Cloudinary shows up as the banner image
  // at the top of the About page.
  aboutHeroTag: "about",

  // Each album pulls its photos live from Cloudinary by tag — tag a
  // photo with an album's tag to add it, remove the tag to drop it.
  // To add a new album: tag some photos in Cloudinary, then add one
  // entry here and a matching page in /albums.
/* PUBLISHER:ALBUMS:START — auto-generated, do not hand-edit */
  albums: [
    ... your existing entries stay exactly as they are ...
    {
      slug: "animals",
      title: "Animals",
      subtitle: "An ongoing collection",
      homeSubtitle: "Creatures encountered along the way — wild, stray, and everything in between.",
      tag: "animals",
      description: "Creatures encountered along the way — wild, stray, and everything in between."
    },
    {
      slug: "architecture",
      title: "Architecture",
      subtitle: "An ongoing collection",
      homeSubtitle: "Facades, structures, and the shapes cities take.",
      tag: "architecture",
      description: "Facades, structures, and the shapes cities take."
    },
    {
      slug: "street",
      title: "Street",
      subtitle: "An ongoing collection",
      homeSubtitle: "Unscripted moments from streets and sidewalks.",
      tag: "street",
      description: "Unscripted moments from streets and sidewalks."
    },
    {
      slug: "hortpark",
      title: "Hort Park",
      subtitle: "Jul 2020",
      homeSubtitle: "July 2020",
      tag: "hortpark",
      description: "An afternoon among the gardens at Hort Park."
    },
    {
      slug: "muhammadsultan",
      title: "Muhammad Sultan",
      subtitle: "Oct 2025",
      homeSubtitle: "October 2025",
      tag: "muhammadsultan",
      description: "An evening walk along Muhammad Sultan."
    },
    {
      slug: "joochiat",
      title: "Joo Chiat",
      subtitle: "Jan 2026",
      homeSubtitle: "January 2026",
      tag: "joochiat",
      description: "A walk through Joo Chiat, shot on the Olympus E-M5 Mark II."
    },
    {
      slug: "chinatown",
      title: "Chinatown",
      subtitle: "Jan 2026",
      homeSubtitle: "January 2026",
      tag: "chinatown",
      description: "A wander through Chinatown's lanes and shopfronts."
    }
  ],
  /* PUBLISHER:ALBUMS:END */

  // Private galleries are no longer defined here. Listing them in this
  // file would make their titles/tags visible to anyone reading the
  // site's source, defeating "hidden" galleries entirely. They now live
  // in GALLERY_REGISTRY inside cloudflare-worker.js, which decides what
  // to reveal based on the visitor's signed session. See
  // gallery-schema.example.json for that registry's format.

  // Content for the About page. Edit freely — this is the one place
  // to update your bio and gear list.
  about: {
    intro: [
      "I'm Greg, a photographer based in Singapore.",
      "I didn't pick up a camera to chase perfect sunsets or famous landmarks. What keeps me coming back is the opportunity to preserve the small moments that might otherwise pass unnoticed—a quiet alley, shifting weather, familiar streets, or a fleeting interaction between strangers.",
      "Whether I'm exploring neighbourhoods close to home or travelling abroad, I hope these photographs encourage others to slow down, look a little closer, and find beauty in the everyday.",
      "I photograph almost exclusively with the Micro Four Thirds system. Its compact size allows me to carry a camera almost everywhere, because the best photographs often happen when you least expect them."
    ],
    gearHeading: "In My Bag",
    gear: [
      { type: "Primary Camera", name: "Olympus OM-D E-M1 Mark II" },
      { type: "Secondary Camera", name: "Olympus OM-D E-M5 Mark II" },
      { type: "Everyday Lens", name: "M.Zuiko 12–100mm F4 IS PRO" },
      { type: "Telephoto Lens", name: "M.Zuiko 40–150mm F4 PRO" },
      { type: "Favourite Prime", name: "M.Zuiko 25mm F1.8" },
      { type: "Editing", name: "Adobe Lightroom Classic · RNI Films" }
    ]
  }
};
