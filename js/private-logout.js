// Shared "Log out" button behavior for private.html and
// private-gallery.html. Calls the Worker's /auth/logout, which clears
// the pr_session cookie (Set-Cookie with Max-Age=0), then sends the
// visitor back to the login page.

(() => {
  const btn = document.getElementById('logout-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    try {
      await fetch(`${CONFIG.apiBaseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch {
      // Even if the request fails, still send them to login — worst case
      // the cookie lingers until it expires on its own in 30 days.
    }
    window.location.href = 'private-login.html';
  });
})();
