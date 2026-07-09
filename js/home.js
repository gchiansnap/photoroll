// Homepage logic: pulls the "hero" and "feature" tagged photos from
// Cloudinary, renders them, fills in the gear blurb, and builds the
// list of album links from CONFIG. Nothing here is hardcoded to a
// specific photo — add/remove the "hero" or "feature" tag in
// Cloudinary and this page picks it up automatically (allow up to a
// minute for Cloudinary's tag-list cache to refresh).

async function initHero() {
  const resources = await Cloudinary.fetchByTag(CONFIG.heroTag);
  const heroEl = document.getElementById('hero-img');
  if (!resources.length) {
    console.warn(`No photo tagged "${CONFIG.heroTag}" found in Cloudinary.`);
    return;
  }
  const hero = resources[0];
  heroEl.src = Cloudinary.stageUrl(hero.public_id, 2000);
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

  resources.slice(0, 6).forEach((r) => {
    const caption = Cloudinary.captionFor(r, '');
    const fig = document.createElement('figure');
    fig.className = 'feature-tile';
    fig.innerHTML = `<img src="${Cloudinary.thumbUrl(r.public_id, 900)}" alt="${caption}" loading="lazy">`;
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

function initGear() {
  document.getElementById('gear-heading').textContent = CONFIG.gear.heading;
  document.getElementById('gear-body').textContent = CONFIG.gear.body;
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
initGear();
initAlbumLinks();
