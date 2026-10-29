/* Dr. Sasil's Dental Center concept: small extras on top of kit.js */
(function () {
  var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // header rule once the page scrolls
  var hd = document.querySelector('.hd');
  if (hd) {
    var onS = function () { hd.classList.toggle('is-scrolled', scrollY > 10); };
    addEventListener('scroll', onS, { passive: true }); onS();
  }

  // hero: treatment word rolls through the list once, then rests on the last one
  document.querySelectorAll('[data-roll]').forEach(function (r) {
    var items = [].slice.call(r.children);
    if (items.length < 2) return;
    if (reduce) { items.forEach(function (s, i) { s.classList.toggle('is-on', i === items.length - 1); }); return; }
    var i = 0;
    var t = setTimeout(function step() {
      items[i].classList.remove('is-on'); items[i].classList.add('is-out');
      i++;
      items[i].classList.remove('is-out'); items[i].classList.add('is-on');
      if (i < items.length - 1) t = setTimeout(step, 1500);
    }, 2200);
  });

  // services page: highlight the index entry for the treatment in view
  var idx = document.querySelectorAll('.svc__idx a[href^="#"]');
  if (idx.length && 'IntersectionObserver' in window) {
    var map = {};
    idx.forEach(function (a) { map[a.getAttribute('href').slice(1)] = a; });
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) {
        if (e.isIntersecting && map[e.target.id]) {
          idx.forEach(function (a) { a.classList.remove('is-on'); });
          map[e.target.id].classList.add('is-on');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' });
    Object.keys(map).forEach(function (id) { var el = document.getElementById(id); if (el) io.observe(el); });
  }
})();
