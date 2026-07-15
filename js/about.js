// About page logic — pulls bio and gear content from CONFIG.about
// (see js/config.js). Edit that file to change what's shown here.

async function initAboutHero() {
  const resources = await Cloudinary.fetchByTag(CONFIG.aboutHeroTag);
  const heroEl = document.getElementById('about-hero-img');
  const mobileSource = document.getElementById('about-hero-source-mobile');
  const desktopSource = document.getElementById('about-hero-source-desktop');
  if (!resources.length) {
    console.warn(`No photo tagged "${CONFIG.aboutHeroTag}" found in Cloudinary.`);
    return;
  }
  const hero = resources[0];
  mobileSource.srcset = Cloudinary.heroUrl(hero.public_id, '4:3', 800);
  desktopSource.srcset = Cloudinary.heroUrl(hero.public_id, '3:1', 1800);
  heroEl.src = Cloudinary.heroUrl(hero.public_id, '3:1', 1800);
  heroEl.alt = Cloudinary.captionFor(hero, "About page banner");
  heroEl.onload = () => heroEl.classList.add('loaded');
}

function initAbout() {
  const introEl = document.getElementById('about-intro');
  introEl.innerHTML = '';
  CONFIG.about.intro.forEach((paragraph) => {
    const p = document.createElement('p');
    p.textContent = paragraph;
    introEl.appendChild(p);
  });

  document.getElementById('gear-heading').textContent = CONFIG.about.gearHeading;

  const gearList = document.getElementById('gear-list');
  gearList.innerHTML = '';
  CONFIG.about.gear.forEach((item) => {
    const row = document.createElement('div');
    row.className = 'gear-item';
    row.innerHTML = `
      <span class="gear-type">${item.type}</span>
      <span class="gear-name">${item.name}</span>
    `;
    gearList.appendChild(row);
  });
}

initAboutHero();
initAbout();
