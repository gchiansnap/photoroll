// Handles the single-password login form on private-login.html.
// On success, the Worker sets a signed session cookie and this page
// redirects to wherever the visitor was headed (?next=...), defaulting
// to the private gallery list.

const params = new URLSearchParams(window.location.search);
const next = params.get('next') || 'private.html';

const form = document.getElementById('login-form');
const input = document.getElementById('password-input');
const errorEl = document.getElementById('login-error');
const submitBtn = form.querySelector('button[type="submit"]');

// If already authenticated (valid cookie from a previous visit), skip
// straight through instead of showing the form.
(async () => {
  try {
    const res = await fetch(`${CONFIG.apiBaseUrl}/auth/session`, { credentials: 'include' });
    const data = await res.json();
    if (data.authenticated) {
      window.location.href = next;
    }
  } catch {
    // Network hiccup — just let them log in normally below.
  }
})();

input.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault();
    form.requestSubmit();
  }
});

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  errorEl.textContent = '';
  submitBtn.disabled = true;

  let res;
  try {
    res = await fetch(`${CONFIG.apiBaseUrl}/auth/login`, {
      method: 'POST',
      credentials: 'include',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: input.value })
    });
  } catch {
    errorEl.textContent = 'Could not reach the server — check your connection.';
    submitBtn.disabled = false;
    return;
  }

  if (res.status === 401) {
    errorEl.textContent = 'Incorrect password — try again.';
    submitBtn.disabled = false;
    input.value = '';
    input.focus();
    return;
  }

  if (!res.ok) {
    errorEl.textContent = 'Something went wrong — try again in a moment.';
    submitBtn.disabled = false;
    return;
  }

  window.location.href = next;
});
