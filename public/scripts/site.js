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

  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.setAttribute('aria-label', 'Open menu');

  function setMenuState(isOpen) {
    mobileMenu.classList.toggle('hidden', !isOpen);
    mobileMenu.setAttribute('aria-hidden', (!isOpen).toString());
    menuButton.setAttribute('aria-expanded', isOpen.toString());
    menuButton.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
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

function initBrowseByNav() {
  const roots = Array.from(document.querySelectorAll('[data-browseby]'));
  if (!roots.length) {
    return;
  }

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  roots.forEach((root) => {
    const modeButtons = Array.from(root.querySelectorAll('[data-browse-mode-trigger]'));
    const desktopPanels = Array.from(root.querySelectorAll('[data-browse-panel]'));
    const mobileModes = Array.from(root.querySelectorAll('[data-mobile-mode]'));
    const desktopMedia = window.matchMedia('(min-width: 768px)');
    if (!modeButtons.length) {
      return;
    }

    let activeMode = root.dataset.activeMode || modeButtons[0]?.dataset.browseModeTrigger || '';
    let isDesktopOpen = false;
    let closeTimer = null;
    let lastTrigger = null;
    const roomState = new Map();
    const categoryState = new Map();

    const getPanel = (modeId) => desktopPanels.find((panel) => panel.dataset.mode === modeId);

    const getDefaultRoom = (modeId) => {
      const panel = getPanel(modeId);
      if (!panel) return undefined;
      // Do not auto-open a room; only open on hover/focus
      return panel.dataset.defaultRoom || '';
    };

    const syncRooms = (modeId, roomId) => {
      const panel = getPanel(modeId);
      if (!panel) return;
      const targetId = roomId || roomState.get(modeId) || getDefaultRoom(modeId);
      const triggers = Array.from(panel.querySelectorAll('[data-room-trigger]'));
      const sections = Array.from(panel.querySelectorAll('[data-room-panel]'));
      if (!targetId) {
        triggers.forEach((btn) => btn.setAttribute('aria-selected', 'false'));
        sections.forEach((section) => {
          section.classList.add('hidden');
          section.setAttribute('aria-hidden', 'true');
        });
        return;
      }
      roomState.set(modeId, targetId);

      triggers.forEach((btn) => {
        const match = btn.dataset.roomTrigger === targetId;
        btn.setAttribute('aria-selected', match.toString());
      });

      sections.forEach((section) => {
        const match = section.dataset.roomPanel === targetId;
        section.classList.toggle('hidden', !match);
        section.setAttribute('aria-hidden', (!match).toString());
      });

      // When room changes, clear any category selection under that room
      if (!targetId) return;
      syncCategories(modeId, targetId);
    };

    const syncCategories = (modeId, roomId, categoryId) => {
      const panel = getPanel(modeId);
      if (!panel) return;
      const defaultCat = categoryState.get(`${modeId}|${roomId}`);
      const targetId = categoryId || defaultCat || '';
      const catTriggers = Array.from(
        panel.querySelectorAll(`[data-category-trigger][data-mode="${modeId}"][data-room="${roomId}"]`)
      );
      const catPanels = Array.from(
        panel.querySelectorAll(`[data-category-panel][data-mode="${modeId}"][data-room="${roomId}"]`)
      );

      if (!targetId) {
        catTriggers.forEach((btn) => btn.setAttribute('aria-selected', 'false'));
        catPanels.forEach((node) => {
          node.classList.add('hidden');
          node.setAttribute('aria-hidden', 'true');
        });
        return;
      }

      categoryState.set(`${modeId}|${roomId}`, targetId);

      catTriggers.forEach((btn) => {
        const match = btn.dataset.categoryTrigger === targetId;
        btn.setAttribute('aria-selected', match.toString());
      });

      catPanels.forEach((node) => {
        const match = node.dataset.categoryPanel === targetId;
        node.classList.toggle('hidden', !match);
        node.setAttribute('aria-hidden', (!match).toString());
      });
    };

    const showMobileStage = (modeId, stage, roomId, categoryId) => {
      const modeEl = root.querySelector(`[data-mobile-mode="${modeId}"]`);
      if (!modeEl) return;
      const stages = Array.from(modeEl.querySelectorAll('[data-mobile-stage]'));
      stages.forEach((node) => {
        const type = node.dataset.mobileStage;
        const match =
          (stage === 'rooms' && type === 'rooms') ||
          (stage === 'categories' && type === 'categories' && node.dataset.room === roomId) ||
          (stage === 'subcategories' &&
            type === 'subcategories' &&
            node.dataset.room === roomId &&
            node.dataset.category === categoryId);
        node.classList.toggle('hidden', !match);
        node.setAttribute('aria-hidden', (!match).toString());
        node.dataset.active = match ? 'true' : 'false';
      });
    };

    const showMobileMode = (modeId) => {
      mobileModes.forEach((modeEl) => {
        const match = modeEl.dataset.mobileMode === modeId;
        modeEl.classList.toggle('hidden', !match);
        modeEl.setAttribute('aria-hidden', (!match).toString());
      });
      const defaultRoom = roomState.get(modeId) || getDefaultRoom(modeId);
      showMobileStage(modeId, 'rooms', defaultRoom);
    };

    const syncModeButtons = () => {
      modeButtons.forEach((btn) => {
        const isActive = btn.dataset.browseModeTrigger === activeMode;
        const expanded = isActive && isDesktopOpen;
        btn.classList.toggle('browseby__mode--active', isActive);
        btn.setAttribute('aria-expanded', expanded.toString());
      });
    };

    const openDesktop = (trigger) => {
      if (!desktopPanels.length || !desktopMedia.matches) return;
      const panel = getPanel(activeMode);
      if (!panel) return;
      clearTimeout(closeTimer);
      panel.classList.remove('hidden');
      panel.setAttribute('aria-hidden', 'false');
      panel.classList.add('is-open');
      panel.classList.remove('pointer-events-none');
      isDesktopOpen = true;
      lastTrigger = trigger || lastTrigger;
      root.dataset.open = 'true';
      syncModeButtons();
    };

    const closeDesktop = (focusTrigger = false) => {
      if (!desktopPanels.length || !isDesktopOpen) return;
      const panel = getPanel(activeMode);
      isDesktopOpen = false;
      root.dataset.open = 'false';
      syncModeButtons();
      if (panel) {
        panel.classList.remove('is-open');
        panel.classList.add('pointer-events-none');
        panel.setAttribute('aria-hidden', 'true');
        setTimeout(() => {
          if (!isDesktopOpen) {
            panel.classList.add('hidden');
          }
        }, 160);
      }
      if (focusTrigger && lastTrigger instanceof HTMLElement) {
        lastTrigger.focus();
      }
    };

    const setMode = (modeId, trigger) => {
      activeMode = modeId;
      root.dataset.activeMode = modeId;
      syncModeButtons();
      desktopPanels.forEach((panel) => {
        if (panel.dataset.mode !== modeId) {
          panel.classList.add('hidden');
          panel.classList.remove('is-open');
          panel.classList.add('pointer-events-none');
          panel.setAttribute('aria-hidden', 'true');
        }
      });
      syncRooms(modeId);
      if (isDesktopOpen) {
        const panel = getPanel(modeId);
        if (panel) {
          panel.classList.remove('hidden');
          requestAnimationFrame(() => openDesktop(trigger));
        }
      }
      showMobileMode(modeId);
    };

    syncModeButtons();
    syncRooms(activeMode);
    showMobileMode(activeMode);

    modeButtons.forEach((btn) => {
      const modeId = btn.dataset.browseModeTrigger;
      if (!modeId) return;
      btn.addEventListener('mouseenter', () => {
        if (!canHover || !desktopMedia.matches) return;
        setMode(modeId, btn);
        openDesktop(btn);
      });
      btn.addEventListener('focus', () => {
        if (!desktopMedia.matches) return;
        setMode(modeId, btn);
        openDesktop(btn);
      });
      btn.addEventListener('click', (event) => {
        if (activeMode === modeId && isDesktopOpen) {
          event.preventDefault();
          closeDesktop(true);
          return;
        }
        setMode(modeId, btn);
        if (desktopPanels.length && desktopMedia.matches) {
          openDesktop(btn);
        }
      });
    });

    const roomTriggers = Array.from(root.querySelectorAll('[data-room-trigger]'));
    roomTriggers.forEach((btn) => {
      const modeId = btn.dataset.mode;
      const roomId = btn.dataset.roomTrigger;
      if (!modeId || !roomId) return;
      const selectRoom = () => {
        setMode(modeId, btn);
        syncRooms(modeId, roomId);
      };
      if (canHover) {
        btn.addEventListener('mouseenter', selectRoom);
      }
      btn.addEventListener('focus', selectRoom);
      btn.addEventListener('click', selectRoom);
    });

    const categoryTriggers = Array.from(root.querySelectorAll('[data-category-trigger]'));
    categoryTriggers.forEach((btn) => {
      const modeId = btn.dataset.mode;
      const roomId = btn.dataset.room;
      const catId = btn.dataset.categoryTrigger;
      if (!modeId || !roomId || !catId) return;
      const selectCategory = () => {
        setMode(modeId, btn);
        syncRooms(modeId, roomId);
        syncCategories(modeId, roomId, catId);
      };
      if (canHover) {
        btn.addEventListener('mouseenter', selectCategory);
      }
      btn.addEventListener('focus', selectCategory);
      btn.addEventListener('click', (event) => {
        selectCategory();
        // allow link navigation; no preventDefault
      });
    });

    const mobileRoomButtons = Array.from(root.querySelectorAll('[data-mobile-room]'));
      mobileRoomButtons.forEach((btn) => {
        const modeId = btn.dataset.mode;
        const roomId = btn.dataset.mobileRoom;
        if (!modeId || !roomId) return;
        btn.addEventListener('click', () => {
          setMode(modeId, btn);
          syncRooms(modeId, roomId);
          syncCategories(modeId, roomId);
          showMobileStage(modeId, 'categories', roomId);
        });
      });

    const mobileCategoryButtons = Array.from(root.querySelectorAll('[data-mobile-category]'));
      mobileCategoryButtons.forEach((btn) => {
        const modeId = btn.dataset.mode;
        const roomId = btn.dataset.room;
        const categoryId = btn.dataset.mobileCategory;
        if (!modeId || !roomId || !categoryId) return;
        btn.addEventListener('click', () => {
          setMode(modeId, btn);
          syncRooms(modeId, roomId);
          syncCategories(modeId, roomId, categoryId);
          showMobileStage(modeId, 'subcategories', roomId, categoryId);
        });
      });

    const mobileBackButtons = Array.from(root.querySelectorAll('[data-mobile-back]'));
    mobileBackButtons.forEach((btn) => {
      const target = btn.dataset.mobileBack;
      const modeId = btn.dataset.mode;
      const roomId = btn.dataset.room;
      btn.addEventListener('click', () => {
        if (!modeId) return;
        if (target === 'rooms') {
          showMobileStage(modeId, 'rooms', roomId);
        } else if (target === 'categories' && roomId) {
          showMobileStage(modeId, 'categories', roomId);
        }
      });
    });

    if (canHover) {
      root.addEventListener('mouseleave', () => {
        if (!desktopMedia.matches) return;
        closeTimer = window.setTimeout(() => closeDesktop(false), 120);
      });
      root.addEventListener('mouseenter', () => {
        clearTimeout(closeTimer);
      });
    }

    root.addEventListener('focusout', (event) => {
      if (root.contains(event.relatedTarget)) return;
      closeDesktop(false);
    });

    document.addEventListener('pointerdown', (event) => {
      if (!isDesktopOpen) return;
      if (!root.contains(event.target)) {
        closeDesktop(false);
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && isDesktopOpen) {
        event.preventDefault();
        closeDesktop(true);
      }
    });
  });
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
  import('./cookie-banner.js')
    .then((module) => {
      module.initCookieBanner();
    })
    .catch(() => {
      return;
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
  initBrowseByNav();
  maybeLoadAds();

  if (shouldShowCookieBanner()) {
    window.addEventListener(
      'load',
      function () {
        setTimeout(() => {
          scheduleIdle(maybeLoadCookieBanner, 6000);
        }, 3500);
      },
      { once: true }
    );
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', onReady);
} else {
  onReady();
}
