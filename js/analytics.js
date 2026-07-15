// Thin wrapper around Google Analytics 4's gtag() function, used for
// custom event tracking across the site (photo views, slideshow usage,
// lightbox opens). Safe to call even if GA4 hasn't loaded yet or is
// blocked by an ad blocker — it just silently does nothing in that case.

function trackEvent(name, params) {
  if (typeof gtag === 'function') {
    gtag('event', name, params || {});
  }
}
