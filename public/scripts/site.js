const header = document.getElementById('site-header');
const menuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');

function scheduleIdle(task, timeout = 1500) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(task, { timeout });
  } else {
    setTimeout(task, 800);
  }
}

function initScrollState() {
  if (!header) {
    return;
  }
  let ticking = false;

  function updateScrollState() {
    header.dataset.scrolled = window.scrollY > 12 ? 'true' : 'false';
    ticking = false;
  }

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

function initMenu() {
  if (!menuButton || !mobileMenu) {
    return;
  }

  function setMenuState(isOpen) {
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

  menuButton.addEventListener('click', function () {
    const isOpen = !mobileMenu.classList.contains('hidden');
    setMenuState(!isOpen);
  });
  mobileMenu.setAttribute('aria-hidden', 'true');
}

function initSmartBack() {
  const backLink = document.getElementById('smart-back');
  if (!(backLink instanceof HTMLAnchorElement)) {
    return;
  }
  const referrer = document.referrer;
  const sameOrigin = referrer && referrer.startsWith(window.location.origin);
  if (sameOrigin && referrer.includes('/category/')) {
    backLink.setAttribute('href', referrer);
  } else {
    backLink.setAttribute('href', '/');
  }
  backLink.classList.remove('hidden');
}

function shouldShowCookieBanner() {
  try {
    return !localStorage.getItem('cookieConsent');
  } catch (error) {
    return true;
  }
}

function maybeLoadCookieBanner() {
  if (!shouldShowCookieBanner()) {
    return;
  }
  scheduleIdle(() => {
    import('./cookie-banner.js')
      .then((module) => {
        module.initCookieBanner();
      })
      .catch(() => {
        return;
      });
  });
}

function maybeLoadAds() {
  const slot = document.querySelector('ins.adsbygoogle');
  if (!slot) {
    return;
  }
  scheduleIdle(() => {
    import('./ads.js')
      .then((module) => {
        module.initAds();
      })
      .catch(() => {
        return;
      });
  }, 2000);
}

function onReady() {
  initScrollState();
  initMenu();
  initSmartBack();
  maybeLoadCookieBanner();
  maybeLoadAds();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onReady);
} else {
  onReady();
}
