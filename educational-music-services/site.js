/* Educational Music Services concept: page behaviour (kit.js handles reveals, marquee, magnetic). */
(function(){
  var RM = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // mobile menu
  var btn = document.querySelector('.menu-btn'), mnav = document.getElementById('mnav');
  if (btn && mnav) btn.addEventListener('click', function(){
    var open = mnav.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
  });

  // draw-once elements: staves and the rental bar
  var once = document.querySelectorAll('.stave--draw, .plan');
  if ('IntersectionObserver' in window && !RM) {
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){ if (e.isIntersecting) { e.target.classList.add('is-in'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -12% 0px' });
    once.forEach(function(el){ io.observe(el); });
  } else once.forEach(function(el){ el.classList.add('is-in'); });

  // instrument index: the "from the list" card follows the hovered/focused family
  var pick = document.querySelector('.pick');
  if (pick) {
    var f = {
      fam: pick.querySelector('[data-p=fam]'), brand: pick.querySelector('[data-p=brand]'),
      model: pick.querySelector('[data-p=model]'), desc: pick.querySelector('[data-p=desc]'),
      price: pick.querySelector('[data-p=price]'), tag: pick.querySelector('[data-p=tag]'),
      link: pick.querySelector('[data-p=link]')
    };
    var cur = null, t = null;
    function show(row){
      if (row === cur) return; cur = row;
      var d = row.dataset;
      function fill(){
        f.fam.textContent = d.fam; f.brand.textContent = d.brand; f.model.textContent = d.model;
        f.desc.textContent = d.desc; f.price.textContent = d.price; f.tag.textContent = d.tag || '';
        f.link.href = row.getAttribute('href'); f.link.querySelector('span').textContent = 'All ' + d.fam.toLowerCase();
        pick.classList.remove('is-swapping');
      }
      if (RM) return fill();
      pick.classList.add('is-swapping'); clearTimeout(t); t = setTimeout(fill, 220);
    }
    document.querySelectorAll('.ix__row').forEach(function(r){
      r.addEventListener('mouseenter', function(){ show(r); });
      r.addEventListener('focus', function(){ show(r); });
    });
  }

  // tap-to-load map
  document.querySelectorAll('[data-map]').forEach(function(box){
    var b = box.querySelector('button');
    b && b.addEventListener('click', function(){
      var i = document.createElement('iframe');
      i.src = box.dataset.src; i.title = 'Map: 22 Mountjoy Square, Dublin 1'; i.loading = 'lazy';
      i.referrerPolicy = 'no-referrer-when-downgrade';
      i.onload = function(){ i.classList.add('is-on'); b.remove(); box.querySelectorAll('.stave').forEach(function(s){ s.remove(); }); };
      box.appendChild(i);
    });
  });

  // services page: highlight the family in view in the jump bar
  var jumps = document.querySelectorAll('.jump a');
  if (jumps.length && 'IntersectionObserver' in window) {
    var map = {}; jumps.forEach(function(a){ map[a.getAttribute('href').slice(1)] = a; });
    var jio = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if (e.isIntersecting && map[e.target.id]) {
          jumps.forEach(function(a){ a.classList.remove('is-on'); });
          var a = map[e.target.id]; a.classList.add('is-on');
          var bar = a.parentNode; bar.scrollTo({ left: a.offsetLeft - 20, behavior: RM ? 'auto' : 'smooth' });
        }
      });
    }, { rootMargin: '-30% 0px -60% 0px' });
    Object.keys(map).forEach(function(id){ var s = document.getElementById(id); s && jio.observe(s); });
  }
})();
/* services: collapse long tables on phones, with a "show all" button */
(function(){
  document.querySelectorAll('.fam').forEach(function(sec){
    var b = sec.querySelector('.more-btn'); if (!b) return;
    sec.classList.add('is-collapsed'); b.hidden = false;
    b.addEventListener('click', function(){ sec.classList.remove('is-collapsed'); b.hidden = true; });
  });
})();
