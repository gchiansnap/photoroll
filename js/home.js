// Homepage logic: pulls the "hero" and "feature" tagged photos from
// Cloudinary, renders them, fills in the gear blurb, and builds the
// list of album links from CONFIG. Nothing here is hardcoded to a
// specific photo — add/remove the "hero" or "feature" tag in
// Cloudinary and this page picks it up automatically (allow up to a
// minute for Cloudinary's tag-list cache to refresh).

async function initHero() {
  const resources = await Cloudinary.fetchByTag(CONFIG.heroTag);
  const heroEl = document.getElementById('hero-img');
  const mobileSource = document.getElementById('hero-source-mobile');
  const desktopSource = document.getElementById('hero-source-desktop');
  if (!resources.length) {
    console.warn(`No photo tagged "${CONFIG.heroTag}" found in Cloudinary.`);
    return;
  }
  const hero = resources[0];
  mobileSource.srcset = Cloudinary.heroUrl(hero.public_id, '3:4', 900);
  desktopSource.srcset = Cloudinary.heroUrl(hero.public_id, '2:1', 2000);
  heroEl.src = Cloudinary.heroUrl(hero.public_id, '2:1', 2000);
  heroEl.alt = Cloudinary.captionFor(hero, "Hero photograph");
  heroEl.onload = () => heroEl.classList.add('loaded');
}

async function initFeatured() {
  const resources = await Cloudinary.fetchByTag(CONFIG.featureTag);
  const grid = document.getElementById('feature-grid');
  grid.innerHTML = '';

  if (!resources.length) {
    console.warn(`No photos tagged "${CONFIG.featureTag}" found in Cloudinary.`);
    return;
  }

  const photos = resources.slice(0, 6).map((r) => ({
    id: r.public_id,
    title: Cloudinary.captionFor(r, ''),
    thumb: Cloudinary.thumbUrl(r.public_id, 900),
    stage: Cloudinary.stageUrl(r.public_id, 1600),
    download: Cloudinary.downloadUrl(r.public_id),
    location: '',
    exif: exifForPublicId(r.public_id)
  }));

  photos.forEach((p, i) => {
    const fig = document.createElement('figure');
    fig.className = 'feature-tile';
    fig.innerHTML = `<img src="${p.thumb}" alt="${p.title}" loading="lazy">`;
    fig.addEventListener('click', () => Lightbox.open(photos, i));
    grid.appendChild(fig);
  });

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.feature-tile').forEach(f => io.observe(f));
}

async function initAlbumLinks() {
  const list = document.getElementById('album-list');
  list.innerHTML = '';

  // Render all album links immediately with a placeholder count, then
  // fill in the real count as each album's tag lookup resolves — avoids
  // the whole list waiting on the slowest album before showing anything.
  const rows = CONFIG.albums.map((album) => {
    const a = document.createElement('a');
    a.className = 'album-link';
    a.href = `albums/${album.slug}.html`;
    a.innerHTML = `
      <span>
        <span class="album-link-title">${album.title}</span><br>
        <span class="album-link-count" id="count-${album.slug}">&nbsp;</span><br>
        <span class="album-link-sub">${album.homeSubtitle || album.subtitle}</span>
      </span>
      <span class="album-link-arrow">&rarr;</span>
    `;
    list.appendChild(a);
    return album;
  });

  rows.forEach(async (album) => {
    const resources = await Cloudinary.fetchByTag(album.tag);
    const countEl = document.getElementById(`count-${album.slug}`);
    if (countEl) {
      const n = resources.length;
      countEl.textContent = `${n} photograph${n === 1 ? '' : 's'}`;
    }
  });
}

// Private galleries are no longer enumerated client-side — which
// galleries exist (and which of them a given visitor is even allowed to
// know about) is now decided entirely by the Worker's signed session,
// so a single link into the private-galleries hub is all this page
// needs. The hub (private.html) handles login-checking and listing.
//
// This used to sit inside a collapsible section whose header also read
// "Private Galleries" — same text twice in a row. Now it's a plain,
// always-visible link (no accordion), with a padlock to signal it's the
// private entry point instead of relying on the repeated label.
function initPrivateGalleryLinks() {
  const list = document.getElementById('private-gallery-list');
  if (!list) return;
  list.innerHTML = `
    <a class="album-link" href="private.html">
      <span>
        <span class="album-link-title">&#128274; Private Galleries</span><br>
        <span class="album-link-sub">Available by invitation</span>
      </span>
      <span class="album-link-arrow">&rarr;</span>
    </a>
  `;
}

function initSectionToggles() {
  const toggles = [
    { btnId: 'collections-toggle', panelId: 'collections-collapsible' }
  ];

  toggles.forEach(({ btnId, panelId }) => {
    const btn = document.getElementById(btnId);
    const panel = document.getElementById(panelId);
    if (!btn || !panel) return;

    btn.addEventListener('click', () => {
      const isOpen = panel.classList.toggle('open');
      btn.setAttribute('aria-expanded', String(isOpen));
    });
  });
}

initHero();
initFeatured();
initAlbumLinks();
initPrivateGalleryLinks();
initSectionToggles();
