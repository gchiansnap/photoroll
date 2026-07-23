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
  wakeLock: null,

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
        this.updateFadeDuration();
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

    // Fullscreenchange fires under different names depending on browser
    // (only Safari still needs the prefix, but this is cheap insurance).
    ['fullscreenchange', 'webkitfullscreenchange'].forEach((evt) => {
      document.addEventListener(evt, () => {
        if (!this.isFullscreen() && this.el.classList.contains('open')) {
          this.close();
        }
      });
    });

    // The Wake Lock API auto-releases whenever the tab loses visibility
    // (switching apps, locking then unlocking, etc). Re-acquire it when
    // the person comes back, so the screen keeps staying awake for the
    // rest of the slideshow.
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible' && this.el.classList.contains('open') && !this.wakeLock) {
        this.requestWakeLock();
      }
    });
  },

  isFullscreen() {
    return !!(document.fullscreenElement || document.webkitFullscreenElement ||
      document.mozFullScreenElement || document.msFullscreenElement);
  },

  requestFullscreenSafe() {
    const el = this.el;
    const fn = el.requestFullscreen || el.webkitRequestFullscreen ||
      el.mozRequestFullScreen || el.msRequestFullscreen;
    if (!fn) return; // e.g. iOS Safari, which has no Fullscreen API for
    // arbitrary elements — the fixed-position overlay already fills the
    // viewport, so the slideshow still looks and behaves right.
    try {
      const result = fn.call(el);
      if (result && result.catch) result.catch(() => {});
    } catch (err) { /* ignore — not a hard requirement */ }
  },

  exitFullscreenSafe() {
    const fn = document.exitFullscreen || document.webkitExitFullscreen ||
      document.mozCancelFullScreen || document.msExitFullscreen;
    if (!fn || !this.isFullscreen()) return;
    try {
      const result = fn.call(document);
      if (result && result.catch) result.catch(() => {});
    } catch (err) { /* ignore */ }
  },

  async requestWakeLock() {
    if (!('wakeLock' in navigator)) return; // unsupported browser — no-op
    try {
      this.wakeLock = await navigator.wakeLock.request('screen');
      this.wakeLock.addEventListener('release', () => { this.wakeLock = null; });
    } catch (err) {
      this.wakeLock = null; // e.g. low battery or permission denial
    }
  },

  releaseWakeLock() {
    if (!this.wakeLock) return;
    this.wakeLock.release().catch(() => {});
    this.wakeLock = null;
  },

  open(photos, startIndex = 0) {
    if (!this.el || !photos.length) return;
    this.photos = photos;
    this.index = startIndex;
    this.playing = true;
    this.el.classList.add('open');
    this.settingsPanel.classList.remove('open');

    // Force the overlay's critical positioning inline, at maximum CSS
    // specificity — a belt-and-braces guarantee that it truly covers
    // the viewport no matter what, independent of any stylesheet
    // cascade quirk on a particular device/browser.
    Object.assign(this.el.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      width: '100vw',
      height: '100dvh',
      maxHeight: '100dvh',
      zIndex: '2147483647',
      display: 'flex',
      overflow: 'hidden'
    });

    this.requestFullscreenSafe();
    this.requestWakeLock();

    this.updateFadeDuration();
    this.render();
    this.startTimer();
    this.updatePlayPauseIcon();
    this.registerActivity();

    trackEvent('slideshow_start', {
      start_photo_id: photos[startIndex] ? photos[startIndex].id : undefined,
      photo_count: photos.length,
      gallery: document.title
    });
  },

  close() {
    this.el.classList.remove('open');
    this.el.style.display = 'none';
    clearInterval(this.timer);
    clearTimeout(this.idleTimer);
    clearTimeout(this.fadeTimer);
    this.el.classList.remove('idle');
    this.settingsPanel.classList.remove('open');

    this.releaseWakeLock();
    this.exitFullscreenSafe();
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

  // Fade duration scales with slideshow speed — faster speed, faster
  // fade — as a fixed fraction of the interval, clamped to a sensible
  // range so it's never jarringly abrupt or distractingly slow.
  updateFadeDuration() {
    const ms = Math.round(this.speedSeconds * 1000 * 0.25);
    this.currentFadeMs = Math.min(900, Math.max(150, ms));
    this.imgEl.style.transitionDuration = `${this.currentFadeMs}ms`;
  },

  render() {
    const p = this.photos[this.index];

    trackEvent('photo_view', {
      photo_id: p.id,
      photo_title: p.title || undefined,
      source: 'slideshow',
      gallery: document.title
    });

    const fadeMs = this.currentFadeMs || 400;
    clearTimeout(this.fadeTimer);

    this.imgEl.style.opacity = '0';
    const preload = new Image();
    preload.src = p.stage;

    // Wait for the fade-out to actually finish playing before swapping
    // in the new image — without this, a fast-loading or already-cached
    // image (the common case once photos have been preloaded) can swap
    // and fade back in almost immediately, collapsing the whole
    // crossfade into a single paint so it looks like nothing happened.
    this.fadeTimer = setTimeout(() => {
      this.imgEl.src = p.stage;
      requestAnimationFrame(() => {
        this.imgEl.style.opacity = '1';
      });
    }, fadeMs);

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
