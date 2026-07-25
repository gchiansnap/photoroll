// Orders Cloudinary resources (photos tagged "feature") according to
// CONFIG.featuredOrder — a plain list of public_ids managed via the
// Gallery Manager's "Featured Photos" tab (see publisher/data_store.py's
// write_config_js_featured).
//
// Deliberately a pure function with no DOM/Cloudinary dependency, so it
// can be tested directly in Node (see tests/featured-order.test.mjs)
// instead of only being exercisable by loading the whole homepage.
//
// Anything in `resources` whose public_id ISN'T in `order` still gets
// included — just appended after the ordered ones, in whatever order
// Cloudinary's API returned them. That matters: it means tagging a new
// photo "feature" in Cloudinary makes it show up on the homepage right
// away, not silently hidden until someone gets around to ordering it.
function sortByFeaturedOrder(resources, order) {
  const orderIndex = new Map((order || []).map((id, i) => [id, i]));
  const ranked = [];
  const unranked = [];
  for (const r of resources) {
    if (orderIndex.has(r.public_id)) {
      ranked.push(r);
    } else {
      unranked.push(r);
    }
  }
  ranked.sort((a, b) => orderIndex.get(a.public_id) - orderIndex.get(b.public_id));
  return [...ranked, ...unranked];
}

// Node-only: lets tests `require()`/`import` this without a DOM. Harmless
// in the browser — `module` simply doesn't exist there, so this branch
// never runs client-side.
if (typeof module !== "undefined" && module.exports) {
  module.exports = { sortByFeaturedOrder };
}
