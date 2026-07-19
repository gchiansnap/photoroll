// Shared "Log out" button behavior for private.html and
// private-gallery.html. Clears the localStorage token (this is what
// actually matters for in-app browsers) and calls the Worker's
// /auth/logout, which clears the pr_session cookie for regular browsers
// (Set-Cookie with Max-Age=0). Tokens are stateless and unrevoked
// server-side, so clearing it locally is what makes logout effective —
// the /auth/logout call alone wouldn't be enough on its own.

(() => {
  const btn = document.getElementById('logout-btn');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    btn.disabled = true;
    PrivateAuth.clearToken();
    try {
      await fetch(`${CONFIG.apiBaseUrl}/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      });
    } catch {
      // Even if the request fails, still send them to login — the token
      // is already cleared locally, and the cookie (if any) will expire
      // on its own within 30 days regardless.
    }
    window.location.href = 'private-login.html';
  });
})();
