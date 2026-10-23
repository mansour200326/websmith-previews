/* Promotech concept: page behaviour on top of kit.js */
(function () {
  var d = document, reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // header turns solid after the hero starts scrolling
  var hd = d.querySelector('.hd');
  if (hd) {
    var onS = function () { hd.classList.toggle('is-solid', scrollY > 40); };
    onS(); addEventListener('scroll', onS, { passive: true });
  }

  // mobile menu
  var mb = d.querySelector('.hd__menu'), mn = d.getElementById('mnav');
  if (mb && mn) {
    mb.addEventListener('click', function () {
      var open = mn.classList.toggle('is-open');
      mb.setAttribute('aria-expanded', open);
      d.body.style.overflow = open ? 'hidden' : '';
    });
    mn.addEventListener('click', function (e) { if (e.target.closest('a')) { mn.classList.remove('is-open'); mb.setAttribute('aria-expanded', 'false'); d.body.style.overflow = ''; } });
    d.addEventListener('keydown', function (e) { if (e.key === 'Escape' && mn.classList.contains('is-open')) mb.click(); });
  }

  // the 0.5 mm figure switches on like an EL panel, once
  var lit = d.querySelectorAll('[data-lit]');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-lit'); io.unobserve(e.target); } });
    }, { threshold: .5 });
    lit.forEach(function (el) { io.observe(el); });
  } else lit.forEach(function (el) { el.classList.add('is-lit'); });

  // EL lines draw when they enter
  var lines = d.querySelectorAll('.elline');
  if ('IntersectionObserver' in window) {
    var io2 = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('is-in'); io2.unobserve(e.target); } });
    }, { threshold: 1 });
    lines.forEach(function (el) { io2.observe(el); });
  } else lines.forEach(function (el) { el.classList.add('is-in'); });

  // project index: filters
  var px = d.querySelector('[data-px]');
  if (px) {
    var btns = px.querySelectorAll('[data-f]'), rows = px.querySelectorAll('.px__row');
    btns.forEach(function (b) {
      b.addEventListener('click', function () {
        var f = b.getAttribute('data-f');
        btns.forEach(function (x) { x.setAttribute('aria-pressed', x === b); });
        rows.forEach(function (r) { r.hidden = !(f === 'all' || (' ' + r.getAttribute('data-k') + ' ').indexOf(' ' + f + ' ') > -1); });
      });
    });
    // hover photo that follows the pointer (desktop, fine pointer only)
    if (matchMedia('(hover:hover) and (pointer:fine)').matches && !reduce) {
      var fl = d.createElement('div'); fl.className = 'px__float'; fl.setAttribute('aria-hidden', 'true');
      var im = d.createElement('img'); im.alt = ''; fl.appendChild(im); d.body.appendChild(fl);
      var tx = 0, ty = 0, cx = 0, cy = 0, raf;
      var loop = function () { cx += (tx - cx) * .16; cy += (ty - cy) * .16; fl.style.setProperty('--fx', cx + 'px'); fl.style.setProperty('--fy', cy + 'px'); raf = requestAnimationFrame(loop); };
      px.querySelectorAll('.px__row[data-img]').forEach(function (r) {
        r.addEventListener('mouseenter', function (e) {
          im.src = r.getAttribute('data-img'); tx = cx = e.clientX + 28; ty = cy = e.clientY - 120;
          fl.classList.add('is-on'); cancelAnimationFrame(raf); loop();
        });
        r.addEventListener('mousemove', function (e) { tx = e.clientX + 28; ty = e.clientY - 120; });
        r.addEventListener('mouseleave', function () { fl.classList.remove('is-on'); setTimeout(function () { if (!fl.classList.contains('is-on')) cancelAnimationFrame(raf); }, 400); });
      });
    }
  }

  // map loads only on tap
  d.querySelectorAll('[data-map]').forEach(function (m) {
    var b = m.querySelector('button');
    b && b.addEventListener('click', function () {
      var f = d.createElement('iframe');
      f.src = m.getAttribute('data-map'); f.title = m.getAttribute('data-title') || 'Map'; f.loading = 'lazy';
      m.appendChild(f); b.remove();
    });
  });
})();
