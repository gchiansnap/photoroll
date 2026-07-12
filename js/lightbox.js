// Shared lightbox used across the homepage and every album page.
// Handles rendering, the lightstrip, and navigation via:
//   - left/right arrow keys
//   - clicking the left/right half of the photo
//   - swiping left/right on touch devices
//
// Expects the lightbox markup (ids below) to already exist in the page.

const Lightbox = {
  photos: [],
  currentIndex: 0,

  init() {
    this.el = document.getElementById('lightbox');
    this.stageEl = document.querySelector('.lightbox-stage');
    this.imgEl = document.getElementById('lightbox-img');
    this.titleEl = document.getElementById('lightbox-title');
    this.metaEl = document.getElementById('lightbox-meta');
    this.gearEl = document.getElementById('lightbox-gear');
    this.exifEl = document.getElementById('lightbox-exif');
    this.downloadEl = document.getElementById('lightbox-download');
    this.closeEl = document.getElementById('lightbox-close');
    this.stripEl = document.getElementById('lightstrip');
    this.prevEl = document.getElementById('lightbox-prev');
    this.nextEl = document.getElementById('lightbox-next');

    this.closeEl.addEventListener('click', () => this.close());
    this.el.addEventListener('click', (e) => {
      if (e.target === this.el) this.close();
    });

    document.addEventListener('keydown', (e) => {
      if (!this.el.classList.contains('open')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === 'ArrowRight') this.next();
      if (e.key === 'ArrowLeft') this.prev();
    });

    // Click the left/right half of the photo to go prev/next.
    this.imgEl.addEventListener('click', (e) => {
      const rect = this.imgEl.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      if (clickX < rect.width / 2) this.prev();
      else this.next();
    });

    if (this.prevEl) this.prevEl.addEventListener('click', () => this.prev());
    if (this.nextEl) this.nextEl.addEventListener('click', () => this.next());

    // Swipe support on touch devices.
    let touchStartX = null;
    this.stageEl.addEventListener('touchstart', (e) => {
      touchStartX = e.touches[0].clientX;
    }, { passive: true });

    this.stageEl.addEventListener('touchend', (e) => {
      if (touchStartX === null) return;
      const delta = e.changedTouches[0].clientX - touchStartX;
      if (Math.abs(delta) > 40) {
        if (delta < 0) this.next();
        else this.prev();
      }
      touchStartX = null;
    }, { passive: true });
  },

  open(photos, index) {
    this.photos = photos;
    this.currentIndex = index;
    this.render();
    this.el.classList.add('open');
  },

  close() {
    this.el.classList.remove('open');
  },

  next() {
    this.currentIndex = (this.currentIndex + 1) % this.photos.length;
    this.render();
  },

  prev() {
    this.currentIndex = (this.currentIndex - 1 + this.photos.length) % this.photos.length;
    this.render();
  },

  render() {
    const p = this.photos[this.currentIndex];

    this.imgEl.classList.remove('shown');
    const preload = new Image();
    preload.onload = () => {
      this.imgEl.src = p.stage;
      requestAnimationFrame(() => this.imgEl.classList.add('shown'));
    };
    preload.src = p.stage;
    this.imgEl.alt = p.title || '';

    const hasTitle = Boolean(p.title && p.title.trim().length > 0);
    this.titleEl.textContent = hasTitle ? p.title : '';
    this.titleEl.style.display = hasTitle ? 'block' : 'none';
    this.metaEl.textContent = p.location || '';

    if (p.exif) {
      const gearParts = [p.exif.camera, p.exif.lens].filter(Boolean);
      this.gearEl.textContent = gearParts.join(' · ');
      this.gearEl.style.display = gearParts.length ? 'block' : 'none';

      const settingsParts = [p.exif.focalLength, p.exif.aperture, p.exif.shutterSpeed, p.exif.iso ? `ISO ${p.exif.iso}` : null].filter(Boolean);
      this.exifEl.textContent = settingsParts.join(' · ');
      this.exifEl.style.display = settingsParts.length ? 'block' : 'none';
    } else {
      this.gearEl.textContent = '';
      this.gearEl.style.display = 'none';
      this.exifEl.textContent = '';
      this.exifEl.style.display = 'none';
    }

    this.downloadEl.href = p.download || '#';

    this.stripEl.innerHTML = '';
    this.photos.forEach((photo, i) => {
      const img = document.createElement('img');
      img.src = photo.thumb;
      img.alt = photo.title || '';
      if (i === this.currentIndex) img.classList.add('active');
      img.addEventListener('click', (e) => {
        e.stopPropagation();
        this.currentIndex = i;
        this.render();
      });
      this.stripEl.appendChild(img);
    });

    const activeStripImg = this.stripEl.children[this.currentIndex];
    if (activeStripImg) {
      activeStripImg.scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' });
    }
  }
};

Lightbox.init();
