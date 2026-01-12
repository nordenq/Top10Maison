function loadAdsScript(client) {
  if (!client || window.__adsbygoogleLoaded) {
    return;
  }
  window.__adsbygoogleLoaded = true;
  const script = document.createElement('script');
  script.async = true;
  const url =
    'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=' +
    encodeURIComponent(client);
  try {
    const policy = window.trustedTypes?.createPolicy('top10maison#ads', {
      createScriptURL: (value) => value
    });
    script.src = policy ? policy.createScriptURL(url) : url;
  } catch (error) {
    script.src = url;
  }
  script.crossOrigin = 'anonymous';
  document.head.appendChild(script);
}

export function initAds() {
  const slots = document.querySelectorAll('ins.adsbygoogle');
  if (!slots.length) {
    return;
  }
  const client = slots[0].getAttribute('data-ad-client');
  if (!client) {
    return;
  }
  loadAdsScript(client);
  slots.forEach(() => {
    (window.adsbygoogle = window.adsbygoogle || []).push({});
  });
}
