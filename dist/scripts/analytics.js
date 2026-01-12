function schedule(task, timeout = 6000) {
  if ('requestIdleCallback' in window) {
    window.requestIdleCallback(task, { timeout });
  } else {
    setTimeout(task, Math.min(2500, timeout));
  }
}

function getMeasurementId() {
  const meta = document.querySelector('meta[name="ga-id"]');
  return meta?.getAttribute('content') || '';
}

function makeTrustedScriptUrl(url) {
  try {
    const policy = window.trustedTypes?.createPolicy('top10maison#ga', {
      createScriptURL: (value) => value
    });
    return policy ? policy.createScriptURL(url) : url;
  } catch (error) {
    return url;
  }
}

function loadAnalytics() {
  const measurementId = getMeasurementId();
  if (!measurementId || window.__top10maisonGaLoaded) {
    return;
  }

  window.__top10maisonGaLoaded = true;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', measurementId, { anonymize_ip: true });

  const script = document.createElement('script');
  script.async = true;
  script.src = makeTrustedScriptUrl(
    `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`
  );
  document.head.appendChild(script);
}

if (document.readyState === 'complete') {
  schedule(loadAnalytics);
} else {
  window.addEventListener(
    'load',
    function () {
      schedule(loadAnalytics);
    },
    { once: true }
  );
}

