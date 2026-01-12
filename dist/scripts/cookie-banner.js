export function initCookieBanner() {
  try {
    if (localStorage.getItem('cookieConsent')) {
      return;
    }
  } catch (error) {
    // If storage is blocked, fall through to show the banner.
  }

  const banner = document.createElement('div');
  banner.className = 'cookie-banner';
  banner.setAttribute('role', 'dialog');
  banner.setAttribute('aria-label', 'Cookie preferences');
  banner.setAttribute('aria-modal', 'false');
  banner.tabIndex = -1;

  const text = document.createElement('p');
  text.className = 'cookie-banner__text';
  text.append('This site uses cookies to improve performance and serve personalized ads.');

  const linkRow = document.createElement('div');
  linkRow.className = 'cookie-banner__links';
  const link = document.createElement('a');
  link.href = '/legal/';
  link.className = 'cookie-banner__link';
  link.textContent = 'Learn more about cookies and privacy';
  linkRow.append(link);

  const actions = document.createElement('div');
  actions.className = 'cookie-banner__actions';
  const acceptBtn = document.createElement('button');
  acceptBtn.type = 'button';
  acceptBtn.dataset.consent = 'accept';
  acceptBtn.textContent = 'Got it!';
  const declineBtn = document.createElement('button');
  declineBtn.type = 'button';
  declineBtn.dataset.consent = 'decline';
  declineBtn.className = 'cookie-banner__decline';
  declineBtn.textContent = 'Decline';
  actions.append(acceptBtn, declineBtn);

  banner.append(text, linkRow, actions);
  const lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  acceptBtn.addEventListener('click', function () {
    try {
      localStorage.setItem('cookieConsent', 'true');
    } catch (error) {
      // Ignore storage failures.
    }
    banner.remove();
    lastFocused?.focus();
  });
  declineBtn.addEventListener('click', function () {
    try {
      localStorage.setItem('cookieConsent', 'false');
    } catch (error) {
      // Ignore storage failures.
    }
    banner.remove();
    lastFocused?.focus();
  });
  document.body.appendChild(banner);
  acceptBtn.focus();
}
