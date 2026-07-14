// Shared slideshow, usable from any album/gallery page or from inside the
// lightbox. Fills the screen (and requests real browser fullscreen, when
// available) unless the person changes the defaults via the settings panel.

const Slideshow = {
  photos: [],
  index: 0,
  playing: false,
  timer: null,
  idleTimer: null,
  speedSeconds: 4,
  display: 'all', // 'captions' | 'exif' | 'all' | 'none'

  init() {
    this.el = document.getElementById('slideshow');
    if (!this.el) return; // page doesn't include the slideshow markup

    this.imgEl = document.getElementById('slideshow-img');
    this.captionEl = document.getElementById('slideshow-caption');
    this.exifEl = document.getElementById('slideshow-exif');
    this.playPauseBtn = document.getElementById('slideshow-playpause');
    this.closeBtn = document.getElementById('slideshow-close');
    this.settingsBtn = document.getElementById('slideshow-settings-btn');
    this.settingsPanel = document.getElementById('slideshow-settings');
    this.speedRadios = document.querySelectorAll('input[name="slideshow-speed"]');
    this.displayRadios = document.querySelectorAll('input[name="slideshow-display"]');

    this.closeBtn.addEventListener('click', () => this.close());
    this.playPauseBtn.addEventListener('click', () => this.togglePause());
    this.settingsBtn.addEventListener('click', () => this.toggleSettings());

    this.el.addEventListener('click', (e) => {
      if (e.target === this.el) this.close();
    });

    // Auto-hide the controls and cursor after 4s of no activity — mouse
    // movement, taps, clicks, or key presses all count as activity and
    // bring them back immediately. Stays visible while the settings
    // panel is open, since the person is actively using it.
    const activityEvents = ['mousemove', 'touchstart', 'click', 'keydown'];
    activityEvents.forEach((evt) => {
      this.el.addEventListener(evt, () => this.registerActivity());
    });

    this.speedRadios.forEach((r) => {
      if (parseInt(r.value, 10) === this.speedSeconds) r.checked = true;
      r.addEventListener('change', (e) => {
        this.speedSeconds = parseInt(e.target.value, 10);
        if (this.playing) this.startTimer();
      });
    });

    this.displayRadios.forEach((r) => {
      if (r.value === this.display) r.checked = true;
      r.addEventListener('change', (e) => {
        this.display = e.target.value;
        this.renderOverlay();
      });
    });

    document.addEventListener('keydown', (e) => {
      if (!this.el.classList.contains('open')) return;
      if (e.key === 'Escape') this.close();
      if (e.key === ' ') { e.preventDefault(); this.togglePause(); }
      if (e.key === 'ArrowRight') this.next(true);
      if (e.key === 'ArrowLeft') this.prev(true);
    });

    document.addEventListener('fullscreenchange', () => {
      if (!document.fullscreenElement && this.el.classList.contains('open')) {
        this.close();
      }
    });
  },

  open(photos, startIndex = 0) {
    if (!this.el || !photos.length) return;
    this.photos = photos;
    this.index = startIndex;
    this.playing = true;
    this.el.classList.add('open');
    this.settingsPanel.classList.remove('open');
    this.render();
    this.startTimer();
    this.updatePlayPauseIcon();
    this.registerActivity();

    if (this.el.requestFullscreen) {
      this.el.requestFullscreen().catch(() => {
        // Fullscreen can be denied (e.g. some mobile browsers) — the
        // overlay itself already covers the full viewport regardless.
      });
    }
  },

  close() {
    this.el.classList.remove('open');
    clearInterval(this.timer);
    clearTimeout(this.idleTimer);
    this.el.classList.remove('idle');
    this.settingsPanel.classList.remove('open');
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    }
  },

  registerActivity() {
    this.el.classList.remove('idle');
    clearTimeout(this.idleTimer);
    // Don't hide controls while the settings panel is open — the person
    // is actively using it even if their mouse happens to sit still.
    if (this.settingsPanel.classList.contains('open')) return;
    this.idleTimer = setTimeout(() => {
      this.el.classList.add('idle');
    }, 4000);
  },

  startTimer() {
    clearInterval(this.timer);
    this.timer = setInterval(() => this.next(), this.speedSeconds * 1000);
  },

  togglePause() {
    this.playing = !this.playing;
    if (this.playing) this.startTimer();
    else clearInterval(this.timer);
    this.updatePlayPauseIcon();
  },

  updatePlayPauseIcon() {
    this.playPauseBtn.innerHTML = this.playing
      ? '<span class="icon">&#10073;&#10073;</span>'
      : '<span class="icon">&#9654;</span>';
  },

  toggleSettings() {
    this.settingsPanel.classList.toggle('open');
    this.registerActivity();
  },

  next(manual) {
    this.index = (this.index + 1) % this.photos.length;
    this.render();
    if (manual && this.playing) this.startTimer();
  },

  prev(manual) {
    this.index = (this.index - 1 + this.photos.length) % this.photos.length;
    this.render();
    if (manual && this.playing) this.startTimer();
  },

  render() {
    const p = this.photos[this.index];
    this.imgEl.src = p.stage;
    this.imgEl.alt = p.title || '';
    this.renderOverlay();
    this.preloadNext();
  },

  preloadNext() {
    const nextIndex = (this.index + 1) % this.photos.length;
    const next = this.photos[nextIndex];
    if (next) {
      const preload = new Image();
      preload.src = next.stage;
    }
  },

  renderOverlay() {
    const p = this.photos[this.index];
    const showCaption = this.display === 'captions' || this.display === 'all';
    const showExif = this.display === 'exif' || this.display === 'all';

    if (showCaption && p.title) {
      this.captionEl.textContent = p.title;
      this.captionEl.style.display = 'block';
    } else {
      this.captionEl.textContent = '';
      this.captionEl.style.display = 'none';
    }

    if (showExif && p.exif) {
      const parts = [
        p.exif.camera, p.exif.lens, p.exif.focalLength,
        p.exif.aperture, p.exif.shutterSpeed,
        p.exif.iso ? `ISO ${p.exif.iso}` : null
      ].filter(Boolean);
      this.exifEl.textContent = parts.join(' · ');
      this.exifEl.style.display = parts.length ? 'block' : 'none';
    } else {
      this.exifEl.textContent = '';
      this.exifEl.style.display = 'none';
    }
  }
};

Slideshow.init();
