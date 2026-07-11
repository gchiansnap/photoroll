// Shared Cloudinary helpers. Uses the public, unauthenticated
// "list by tag" endpoint — no API key/secret needed, safe for a
// public static site. Cloudinary caches this for ~60 seconds, so
// tag changes on their end show up here within a minute.

const Cloudinary = {
  thumbUrl(publicId, width = 800) {
    return `https://res.cloudinary.com/${CONFIG.cloudName}/image/upload/w_${width},q_auto,f_auto/${publicId}.jpg`;
  },

  stageUrl(publicId, width = 1600) {
    return `https://res.cloudinary.com/${CONFIG.cloudName}/image/upload/w_${width},q_auto,f_auto/${publicId}.jpg`;
  },

  // Smart-cropped hero image: lets Cloudinary detect the subject
  // (g_auto) and center the crop on it, rather than a flat geometric
  // center-crop — keeps the subject framed consistently whether the
  // box ends up tall (mobile) or wide (desktop).
  heroUrl(publicId, aspectRatio, width) {
    return `https://res.cloudinary.com/${CONFIG.cloudName}/image/upload/c_fill,g_auto,ar_${aspectRatio},w_${width},q_auto,f_auto/${publicId}.jpg`;
  },

  downloadUrl(publicId) {
    return `https://res.cloudinary.com/${CONFIG.cloudName}/image/upload/fl_attachment/${publicId}.jpg`;
  },

  // Returns a promise resolving to an array of resource objects:
  // { public_id, tags, context, image_metadata }
  // Fetched via a Cloudflare Worker that securely calls Cloudinary's
  // Admin API on our behalf — see cloudflare-worker.js.
  // Photos are sorted here by public_id ascending; re-sort in
  // calling code if you want a different order.
  async fetchByTag(tag) {
    const url = `${CONFIG.apiBaseUrl}/tag?tag=${encodeURIComponent(tag)}`;
    const res = await fetch(url);
    if (!res.ok) {
      console.error(`Worker tag "${tag}" fetch failed:`, res.status);
      return [];
    }
    const data = await res.json();
    const resources = data.resources || [];
    resources.sort((a, b) => a.public_id.localeCompare(b.public_id));
    return resources;
  },

  // Pulls a human caption out of a resource's context metadata,
  // falling back to a generic label if none was set in Cloudinary.
  captionFor(resource, fallback = "") {
    return (resource.context && resource.context.custom && resource.context.custom.caption)
      || fallback;
  }
};
