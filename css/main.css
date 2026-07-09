:root{
  --bg: #000000;
  --text: #f5f5f7;
  --text-dim: #86868b;
  --hairline: rgba(255,255,255,0.08);
}

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

html { scroll-behavior: smooth; }

body{
  margin: 0;
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Helvetica Neue', Arial, sans-serif;
  font-weight: 300;
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; }

/* ---------- shared header ---------- */
header.page-header{
  padding: 12vw 6vw 5vw;
  text-align: left;
}

header.page-header p.eyebrow{
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: var(--text-dim);
  margin: 0 0 1.4rem;
}

header.page-header h1{
  font-weight: 200;
  font-size: clamp(2.6rem, 7vw, 5.2rem);
  line-height: 1.04;
  letter-spacing: -0.02em;
  margin: 0 0 1.4rem;
  max-width: 18ch;
}

header.page-header p.sub{
  font-weight: 300;
  font-size: 1.05rem;
  line-height: 1.6;
  color: var(--text-dim);
  max-width: 44ch;
  margin: 0;
}

.back-link{
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 0.04em;
  color: var(--text-dim);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
  margin: 0 6vw;
}
.back-link:hover{ color: var(--text); border-color: var(--text-dim); }

/* ---------- homepage hero ---------- */
.hero{
  position: relative;
  height: 92vh;
  min-height: 480px;
  display: flex;
  align-items: flex-end;
  overflow: hidden;
  background: #0a0a0a;
}

.hero img{
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 1s ease;
}
.hero img.loaded{ opacity: 1; }

.hero-scrim{
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.32);
}

.hero-content{
  position: relative;
  padding: 0 6vw 5vw;
  z-index: 1;
}

.hero-eyebrow{
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 0.14em;
  text-transform: uppercase;
  color: rgba(245,245,247,0.75);
  margin: 0 0 1rem;
}

.hero-title{
  font-weight: 200;
  font-size: clamp(2.8rem, 8vw, 6rem);
  line-height: 1.0;
  letter-spacing: -0.02em;
  margin: 0 0 1rem;
  max-width: 16ch;
}

.hero-sub{
  font-weight: 300;
  font-size: 1.05rem;
  color: rgba(245,245,247,0.8);
  max-width: 40ch;
  margin: 0;
}

/* ---------- section headings ---------- */
section{
  padding: 6vw 6vw;
}

section h2{
  font-weight: 200;
  font-size: clamp(1.6rem, 3.4vw, 2.2rem);
  letter-spacing: -0.01em;
  margin: 0 0 2.4rem;
}

/* ---------- featured grid (homepage) ---------- */
.feature-grid{
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}
@media (min-width: 900px){
  .feature-grid{ grid-template-columns: repeat(3, 1fr); }
}

.feature-tile{
  position: relative;
  overflow: hidden;
  aspect-ratio: 4 / 5;
  opacity: 0;
  transform: translateY(14px);
  transition: opacity 0.4s ease, transform 0.4s ease;
  cursor: pointer;
}
.feature-tile.visible{ opacity: 1; transform: translateY(0); }

.feature-tile img{
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s cubic-bezier(.2,.7,.2,1);
}
.feature-tile:hover img{ transform: scale(1.03); }

/* ---------- gear section ---------- */
.gear p{
  font-weight: 300;
  font-size: 1rem;
  line-height: 1.7;
  color: var(--text-dim);
  max-width: 52ch;
  margin: 0;
}

/* ---------- album links ---------- */
.album-list{
  display: flex;
  flex-direction: column;
  gap: 0;
}

.album-link{
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  padding: 1.6rem 0;
  border-top: 1px solid var(--hairline);
  text-decoration: none;
  color: var(--text);
  transition: opacity 0.2s ease;
}
.album-list .album-link:last-child{ border-bottom: 1px solid var(--hairline); }
.album-link:hover{ opacity: 0.7; }

.album-link-title{
  font-weight: 300;
  font-size: 1.3rem;
}

.album-link-sub{
  font-weight: 300;
  font-size: 0.85rem;
  color: var(--text-dim);
}

.album-link-arrow{
  font-weight: 200;
  font-size: 1.2rem;
  color: var(--text-dim);
}

/* ---------- masonry gallery (album pages) ---------- */
.gallery{
  column-count: 1;
  column-gap: 6px;
}
@media (min-width: 560px){ .gallery{ column-count: 2; } }
@media (min-width: 900px){ .gallery{ column-count: 3; } }
@media (min-width: 1300px){ .gallery{ column-count: 4; } }

figure.tile{
  margin: 0 0 6px;
  break-inside: avoid;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.35s ease, transform 0.35s ease;
  cursor: pointer;
}
figure.tile.visible{ opacity: 1; transform: translateY(0); }

figure.tile img{
  display: block;
  width: 100%;
  height: auto;
  transition: transform 0.3s cubic-bezier(.2,.7,.2,1), filter 0.3s ease;
}
figure.tile:hover img{ transform: scale(1.015); filter: brightness(1.04); }

/* ---------- lightbox ---------- */
.lightbox{
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.98);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.22s ease;
  z-index: 100;
}
.lightbox.open{ opacity: 1; pointer-events: auto; }

.lightbox-close{
  position: absolute;
  top: 2rem;
  right: 2.5vw;
  background: none;
  border: none;
  color: var(--text);
  font-size: 1.6rem;
  font-weight: 200;
  cursor: pointer;
  opacity: 0.7;
  transition: opacity 0.2s ease;
  line-height: 1;
  padding: 0.5rem;
}
.lightbox-close:hover{ opacity: 1; }

.lightbox-stage{
  flex: 1;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 4vh 4vw 2vh;
  min-height: 0;
}

.lightbox-stage img{
  max-width: 100%;
  max-height: 100%;
  object-fit: contain;
  opacity: 0;
  transform: scale(0.985);
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.lightbox-stage img.shown{ opacity: 1; transform: scale(1); }

.lightbox-info{ text-align: center; padding: 0 6vw 1.6rem; }

.lightbox-title{ font-weight: 300; font-size: 0.95rem; color: var(--text); margin: 0 0 0.3rem; }
.lightbox-meta{ font-weight: 300; font-size: 0.8rem; color: var(--text-dim); margin: 0 0 0.3rem; }
.lightbox-exif{ font-weight: 300; font-size: 0.75rem; letter-spacing: 0.02em; color: var(--text-dim); opacity: 0.75; margin: 0 0 0.9rem; }

.lightbox-download{
  font-weight: 400;
  font-size: 0.78rem;
  letter-spacing: 0.04em;
  color: var(--text-dim);
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: color 0.2s ease, border-color 0.2s ease;
}
.lightbox-download:hover{ color: var(--text); border-color: var(--text-dim); }

.lightstrip{
  width: 100%;
  display: flex;
  gap: 6px;
  overflow-x: auto;
  padding: 0 3vw 2.2rem;
  scrollbar-width: none;
}
.lightstrip::-webkit-scrollbar{ display: none; }

.lightstrip img{
  height: 56px;
  width: 56px;
  object-fit: cover;
  flex: 0 0 auto;
  opacity: 0.35;
  cursor: pointer;
  transition: opacity 0.25s ease, transform 0.25s ease;
}
.lightstrip img:hover{ opacity: 0.7; }
.lightstrip img.active{ opacity: 1; transform: scale(1.06); }

footer{
  padding: 3vw 6vw 5vw;
  color: var(--text-dim);
  font-size: 0.75rem;
  font-weight: 300;
  letter-spacing: 0.02em;
}

@media (prefers-reduced-motion: reduce){
  * { transition: none !important; }
}

:focus-visible{
  outline: 1px solid var(--text-dim);
  outline-offset: 3px;
}
