// Private gallery page. Reads ?tag=<cloudinary-tag>&title=<display-title>
// from the URL, prompts for a password, and — if the Worker accepts it —
// renders the matching photos the same way a public album does.
//
// One file serves every private gallery; nothing here is specific to
// a particular gallery. See DEPLOYMENT.md for how to create a new one.

const params = new URLSearchParams(window.location.search);
const tag = params.get('tag');
const title = params.get('title') || 'Gallery';

document.getElementById('gallery-title').textContent = title;
document.title = `${title} — GCHIANSNAP`;

const gate = document.getElementById('password-gate');
const form = document.getElementById('password-form');
const input = document.getElementById('password-input');
const errorEl = document.getElementById('password-error');
const galleryEl = document.getElementById('gallery');

let photos = [];

function renderGallery(resources) {
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

  gate.style.display = 'none';
  galleryEl.style.display = '';
  const slideshowWrap = document.getElementById('page-slideshow-wrap');
  if (slideshowWrap) slideshowWrap.style.display = photos.length ? 'block' : 'none';
}

async function tryPassword(password) {
  errorEl.textContent = '';

  let res;
  try {
    res = await fetch(`${CONFIG.apiBaseUrl}/private`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tag, password })
    });
  } catch {
    errorEl.textContent = 'Could not reach the server — check your connection.';
    return false;
  }

  if (res.status === 401) {
    errorEl.textContent = 'Incorrect password — try again.';
    return false;
  }
  if (res.status === 404) {
    errorEl.textContent = 'This gallery link looks broken — check the URL.';
    return false;
  }
  if (!res.ok) {
    errorEl.textContent = 'Something went wrong — try again in a moment.';
    return false;
  }

  const data = await res.json();
  sessionStorage.setItem(`gallery-pw:${tag}`, password);
  renderGallery(Cloudinary.sortResources(data.resources || []));
  return true;
}

if (!tag) {
  errorEl.textContent = 'No gallery specified in this link.';
} else {
  const remembered = sessionStorage.getItem(`gallery-pw:${tag}`);
  if (remembered) {
    tryPassword(remembered);
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  await tryPassword(input.value);
});

const slideshowTrigger = document.getElementById('page-slideshow-trigger');
if (slideshowTrigger) {
  slideshowTrigger.addEventListener('click', () => {
    if (photos.length) Slideshow.open(photos, 0);
  });
}
