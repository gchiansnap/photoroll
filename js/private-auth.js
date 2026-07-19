// Shared helpers for the private-gallery session token.
//
// The Worker issues a signed session token on login — the same token that
// also backs the pr_session cookie for regular browsers. This module
// stores that token in localStorage and attaches it as an
// "Authorization: Bearer <token>" header on every private-gallery
// request, in addition to sending the cookie.
//
// Why both: locked-down in-app browsers (Instagram, Facebook, TikTok,
// etc.) run on WebViews that block or silently drop third-party/
// cross-site cookies — even ones marked SameSite=None; Secure, which a
// regular mobile browser accepts fine. A token sent as a normal request
// header isn't a cookie at all, so those WebViews have nothing to block.
// Regular browsers get both the cookie and the header; only the header
// actually matters for them either way since the Worker checks it first.
//
// Trade-off: a token sitting in localStorage can be read by any script
// running on the page, which an HttpOnly cookie can't be. That only
// matters if something else on the page were ever compromised (e.g. a
// malicious third-party script) — worth knowing, not a reason to avoid
// this on a site that doesn't run any such script.

const PR_TOKEN_KEY = 'pr_session_token';

const PrivateAuth = {
  getToken() {
    return localStorage.getItem(PR_TOKEN_KEY);
  },
  setToken(token) {
    localStorage.setItem(PR_TOKEN_KEY, token);
  },
  clearToken() {
    localStorage.removeItem(PR_TOKEN_KEY);
  },
  // Spread into a fetch()'s options.headers.
  authHeader() {
    const token = PrivateAuth.getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  }
};
