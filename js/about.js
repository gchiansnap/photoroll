// About page logic — pulls bio and gear content from CONFIG.about
// (see js/config.js). Edit that file to change what's shown here.

function initAbout() {
  const introEl = document.getElementById('about-intro');
  introEl.innerHTML = '';
  CONFIG.about.intro.forEach((paragraph) => {
    const p = document.createElement('p');
    p.textContent = paragraph;
    introEl.appendChild(p);
  });

  document.getElementById('gear-intro').textContent = CONFIG.about.gearIntro;

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

initAbout();
