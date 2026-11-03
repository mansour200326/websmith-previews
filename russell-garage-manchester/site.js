/* Russell Garage concept: header height for the sticky chip index */
(function(){
  var hd=document.querySelector('.hd'),idx=document.querySelector('.svc__idx');if(!hd||!idx)return;
  function set(){var h=hd.offsetHeight,d=document.documentElement;d.style.setProperty('--hdh',h+'px');
    d.style.scrollPaddingTop=(matchMedia('(max-width:1059px)').matches?h+idx.offsetHeight+12:h+20)+'px'}
  set();addEventListener('resize',set);
})();
/* services index highlight (kit.js handles reveals, marquee, accordion, hours, dither, magnetic) */
(function(){
  var links=[].slice.call(document.querySelectorAll('.svc__idx a'));if(!links.length||!('IntersectionObserver' in window))return;
  var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.remove('is-on');a.removeAttribute('aria-current')});var a=map[e.target.id];if(a){a.classList.add('is-on');a.setAttribute('aria-current','true');var ol=a.closest('ol');if(ol&&ol.scrollWidth>ol.clientWidth){var li=a.parentNode;ol.scrollTo({left:li.offsetLeft-ol.clientWidth/2+li.offsetWidth/2,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'})}}}})},{rootMargin:'-40% 0px -55% 0px'});
  Object.keys(map).forEach(function(id){var s=document.getElementById(id);if(s)io.observe(s)});
})();
