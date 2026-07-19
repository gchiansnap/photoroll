// Private galleries hub (private.html). Requires a valid session — a
// token in localStorage (works everywhere, including in-app browsers)
// and/or the pr_session cookie (regular browsers) — or it bounces to the
// login page. Once authenticated, lists only the galleries the visitor's
// group is allowed to see (public + listed private ones); hidden private
// galleries never appear here.

const listEl = document.getElementById('private-gallery-list');

function goToLogin() {
  window.location.href = `private-login.html?next=${encodeURIComponent('private.html')}`;
}

function renderGalleries(galleries) {
  listEl.innerHTML = '';
  if (!galleries.length) {
    listEl.innerHTML = '<p class="password-prompt">No private galleries available yet.</p>';
    return;
  }
  galleries.forEach((gallery) => {
    const a = document.createElement('a');
    a.className = 'album-link';
    a.href = `private-gallery.html?slug=${encodeURIComponent(gallery.slug)}`;
    const countLabel = typeof gallery.count === 'number'
      ? `${gallery.count} photograph${gallery.count === 1 ? '' : 's'}`
      : '';
    a.innerHTML = `
      <span>
        <span class="album-link-title">${gallery.title}</span><br>
        <span class="album-link-count">${countLabel}</span>
      </span>
      <span class="album-link-arrow">&rarr;</span>
    `;
    listEl.appendChild(a);
  });
}

async function init() {
  let sessionRes;
  try {
    sessionRes = await fetch(`${CONFIG.apiBaseUrl}/auth/session`, {
      credentials: 'include',
      headers: { ...PrivateAuth.authHeader() }
    });
  } catch {
    listEl.innerHTML = '<p class="password-prompt">Could not reach the server — check your connection.</p>';
    return;
  }

  const session = await sessionRes.json();
  if (!session.authenticated) {
    goToLogin();
    return;
  }

  let galleriesRes;
  try {
    galleriesRes = await fetch(`${CONFIG.apiBaseUrl}/galleries`, {
      credentials: 'include',
      headers: { ...PrivateAuth.authHeader() }
    });
  } catch {
    listEl.innerHTML = '<p class="password-prompt">Could not reach the server — check your connection.</p>';
    return;
  }

  if (!galleriesRes.ok) {
    listEl.innerHTML = '<p class="password-prompt">Something went wrong — try again in a moment.</p>';
    return;
  }

  const data = await galleriesRes.json();
  renderGalleries(data.galleries || []);
}

init();
