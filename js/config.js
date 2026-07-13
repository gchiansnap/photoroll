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
  albums: [
    {
      slug: "joochiat",
      title: "Joo Chiat",
      subtitle: "Jan 2026",
      tag: "joochiat",
      description: "A walk through Joo Chiat, shot on the Olympus E-M5 Mark II."
    },
    {
      slug: "animals",
      title: "Animals",
      subtitle: "An ongoing collection",
      tag: "animals",
      description: "Creatures encountered along the way — wild, stray, and everything in between."
    },
    {
      slug: "architecture",
      title: "Architecture",
      subtitle: "An ongoing collection",
      tag: "architecture",
      description: "Facades, structures, and the shapes cities take."
    },
    {
      slug: "street",
      title: "Street",
      subtitle: "An ongoing collection",
      tag: "street",
      description: "Unscripted moments from streets and sidewalks."
    },
    {
      slug: "chinatown",
      title: "Chinatown",
      subtitle: "Jan 2026",
      tag: "chinatown",
      description: "A wander through Chinatown's lanes and shopfronts."
    },
    {
      slug: "hortpark",
      title: "Hort Park",
      subtitle: "Jul 2020",
      tag: "hortpark",
      description: "An afternoon among the gardens at Hort Park."
    },
    {
      slug: "muhammadsultan",
      title: "Muhammad Sultan",
      subtitle: "Oct 2025",
      tag: "muhammadsultan",
      description: "An evening walk along Muhammad Sultan."
    }
  ],

  // Content for the About page. Edit freely — this is the one place
  // to update your bio and gear list.
  about: {
    intro: [
      "I'm Greg, a photographer based in Singapore.",
      "I didn't pick up a camera to chase perfect sunsets or famous landmarks. What keeps me returning is the chance to preserve the small moments that would otherwise pass unnoticed — a quiet alley, changing weather, familiar streets, or a brief interaction between strangers.",
      "Whether I'm exploring neighbourhoods close to home or travelling abroad, I hope these photographs encourage others to slow down and see beauty in the everyday.",
      "I shoot almost exclusively with the Micro Four Thirds system, favouring a lightweight setup that lets me keep a camera close wherever I go."
    ],
    gearIntro: "No single kit — whatever suits the walk that day. Currently rotating between:",
    gear: [
      { type: "Camera", name: "Olympus OM-D E-M1 Mark II" },
      { type: "Camera", name: "Olympus OM-D E-M5 Mark II" },
      { type: "Lens", name: "M.Zuiko Digital ED 12-100mm F4 IS PRO" },
      { type: "Lens", name: "M.Zuiko Digital ED 25mm F1.8" },
      { type: "Lens", name: "M.Zuiko Digital ED 40-150mm F2.8 PRO" },
      { type: "Lens", name: "M.Zuiko Digital ED 12mm F2.0" },
      { type: "Lens", name: "M.Zuiko Digital ED 14-42mm F3.5-5.6 EZ" },
      { type: "Lens", name: "M.Zuiko Digital 45mm F1.8" },
      { type: "Lens", name: "M.Zuiko Digital ED 60mm F2.8 Macro" },
      { type: "Lens", name: "M.Zuiko Digital ED 40-150mm F4.0-5.6 R" },
      { type: "Phone", name: "iPhone 16 Pro Max" }
    ]
  }
};
