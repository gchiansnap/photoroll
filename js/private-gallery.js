// Individual private gallery page (private-gallery.html). Reads
// ?slug=<gallery-slug> and asks the Worker for that gallery's photos,
// sending the session token (via PrivateAuth's Authorization header, plus
// the cookie as a fallback for regular browsers). The Worker enforces
// access — this page never sees a password and never decides access on
// its own; if the Worker says no (401/404), we just redirect to login.
//
// One file serves every private gallery; nothing here is specific to a
// particular gallery. See the GALLERY_REGISTRY in cloudflare-worker.js to
// add or retire one.

const params = new URLSearchParams(window.location.search);
const slug = params.get('slug');

const titleEl = document.getElementById('gallery-title');
const statusEl = document.getElementById('gallery-status');
const galleryEl = document.getElementById('gallery');

let photos = [];

function showStatus(message) {
  statusEl.textContent = message;
  statusEl.style.display = '';
}

function showSkeleton() {
  const heights = [220, 280, 180, 260, 200, 300, 190, 240];
  galleryEl.innerHTML = heights
    .map((h) => `<div class="skeleton-tile" style="height:${h}px"></div>`)
    .join('');
  galleryEl.style.display = '';
}

function hideSkeleton() {
  galleryEl.innerHTML = '';
  galleryEl.style.display = 'none';
}

function renderGallery(title, resources) {
  titleEl.textContent = title;
  document.title = `${title} — GCHIANSNAP`;

  photos = resources.map((r) => ({
    id: r.public_id,
    title: Cloudinary.captionFor(r, ''),
    thumb: Cloudinary.thumbUrl(r.public_id, 800),
    stage: Cloudinary.stageUrl(r.public_id, 1600),
    download: Cloudinary.downloadUrl(r.public_id),
    location: title,
    exif: typeof exifForPublicId === 'function' ? exifForPublicId(r.public_id) : null
  }));

  galleryEl.innerHTML = '';
  photos.forEach((p, i) => {
    const fig = document.createElement('figure');
    fig.className = 'tile';
    fig.innerHTML = `<img src="${p.thumb}" alt="${p.title}" loading="lazy">`;
    fig.addEventListener('click', () => Lightbox.open(photos, i));
    galleryEl.appendChild(fig);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  document.querySelectorAll('figure.tile').forEach((f) => io.observe(f));

  statusEl.style.display = 'none';
  galleryEl.style.display = '';
  const slideshowWrap = document.getElementById('page-slideshow-wrap');
  if (slideshowWrap) slideshowWrap.style.display = photos.length ? 'block' : 'none';
}

function redirectToLogin() {
  const next = `private-gallery.html?slug=${encodeURIComponent(slug || '')}`;
  window.location.href = `private-login.html?next=${encodeURIComponent(next)}`;
}

async function load() {
  if (!slug) {
    showStatus('No gallery specified in this link.');
    return;
  }

  showSkeleton();

  let res;
  try {
    res = await fetch(`${CONFIG.apiBaseUrl}/gallery?slug=${encodeURIComponent(slug)}`, {
      credentials: 'include',
      headers: { ...PrivateAuth.authHeader() }
    });
  } catch {
    hideSkeleton();
    showStatus('Could not reach the server — check your connection.');
    return;
  }

  // 401 (no/expired session) and 404 (wrong group, or gallery doesn't
  // exist) both send the visitor to login — the Worker deliberately
  // doesn't distinguish between these to a caller who isn't authorized.
  if (res.status === 401 || res.status === 404) {
    redirectToLogin();
    return;
  }

  if (!res.ok) {
    hideSkeleton();
    showStatus('Something went wrong — try again in a moment.');
    return;
  }

  const data = await res.json();
  renderGallery(data.title || 'Gallery', Cloudinary.sortResources(data.resources || []));
}

load();

const slideshowTrigger = document.getElementById('page-slideshow-trigger');
if (slideshowTrigger) {
  slideshowTrigger.addEventListener('click', () => {
    if (photos.length) Slideshow.open(photos, 0);
  });
}
