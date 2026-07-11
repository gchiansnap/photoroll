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

function initAlbumLinks() {
  const list = document.getElementById('album-list');
  list.innerHTML = '';
  CONFIG.albums.forEach((album) => {
    const a = document.createElement('a');
    a.className = 'album-link';
    a.href = `albums/${album.slug}.html`;
    a.innerHTML = `
      <span>
        <span class="album-link-title">${album.title}</span><br>
        <span class="album-link-sub">${album.subtitle}</span>
      </span>
      <span class="album-link-arrow">&rarr;</span>
    `;
    list.appendChild(a);
  });
}

initHero();
initFeatured();
initAlbumLinks();
