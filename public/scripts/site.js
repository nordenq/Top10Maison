(function () {
  const header = document.getElementById('site-header');
  const menuButton = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  let ticking = false;

  function updateScrollState() {
    if (!header) {
      return;
    }
    header.dataset.scrolled = window.scrollY > 12 ? 'true' : 'false';
    ticking = false;
  }

  if (header) {
    window.addEventListener(
      'scroll',
      function () {
        if (ticking) {
          return;
        }
        ticking = true;
        window.requestAnimationFrame(updateScrollState);
      },
      { passive: true }
    );
    updateScrollState();
  }

  function setMenuState(isOpen) {
    if (!mobileMenu || !menuButton) {
      return;
    }
    mobileMenu.classList.toggle('hidden', !isOpen);
    mobileMenu.setAttribute('aria-hidden', (!isOpen).toString());
    menuButton.setAttribute('aria-expanded', isOpen.toString());
    if (isOpen) {
      const firstLink = mobileMenu.querySelector('a, summary');
      if (firstLink instanceof HTMLElement) {
        firstLink.focus();
      }
    } else {
      menuButton.focus();
    }
  }

  if (menuButton && mobileMenu) {
    menuButton.addEventListener('click', function () {
      const isOpen = !mobileMenu.classList.contains('hidden');
      setMenuState(!isOpen);
    });
    mobileMenu.setAttribute('aria-hidden', 'true');
  }

  const backLink = document.getElementById('smart-back');
  if (backLink instanceof HTMLAnchorElement) {
    const referrer = document.referrer;
    const sameOrigin = referrer && referrer.startsWith(window.location.origin);
    if (sameOrigin && referrer.includes('/category/')) {
      backLink.setAttribute('href', referrer);
    } else {
      backLink.setAttribute('href', '/');
    }
    backLink.classList.remove('hidden');
  }

  function initCookieBanner() {
    if (localStorage.getItem('cookieConsent')) {
      return;
    }
    const banner = document.createElement('div');
    banner.className = 'cookie-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie preferences');
    banner.setAttribute('aria-modal', 'false');
    banner.tabIndex = -1;
    const text = document.createElement('p');
    text.className = 'cookie-banner__text';
    text.append('This site uses cookies to improve performance and serve personalized ads. ');
    const link = document.createElement('a');
    link.href = '/legal/';
    link.className = 'cookie-banner__link';
    link.textContent = 'Learn more about cookies and privacy';
    text.append(link, '.');

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

    banner.append(text, actions);
    const lastFocused = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    acceptBtn.addEventListener('click', function () {
      localStorage.setItem('cookieConsent', 'true');
      banner.remove();
      lastFocused?.focus();
    });
    declineBtn.addEventListener('click', function () {
      localStorage.setItem('cookieConsent', 'false');
      banner.remove();
      lastFocused?.focus();
    });
    document.body.appendChild(banner);
    acceptBtn.focus();
  }

  function scheduleCookieBanner() {
    if ('requestIdleCallback' in window) {
      window.requestIdleCallback(initCookieBanner, { timeout: 1500 });
    } else {
      setTimeout(initCookieBanner, 800);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', scheduleCookieBanner);
  } else {
    scheduleCookieBanner();
  }

  function loadAdsScript(client) {
    if (!client || window.__adsbygoogleLoaded) {
      return;
    }
    window.__adsbygoogleLoaded = true;
    const script = document.createElement('script');
    script.async = true;
    script.src =
      'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' +
      encodeURIComponent(client);
    script.crossOrigin = 'anonymous';
    document.head.appendChild(script);
  }

  function initAds() {
    const slots = document.querySelectorAll('ins.adsbygoogle');
    if (!slots.length) {
      return;
    }
    const client = slots[0].getAttribute('data-ad-client');
    if (client) {
      loadAdsScript(client);
    }
    slots.forEach(() => {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAds);
  } else {
    initAds();
  }
})();
