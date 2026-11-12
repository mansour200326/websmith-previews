/* Small page helpers on top of kit.js */
(function(){
  var h=document.querySelector('.hdr');
  function hh(){if(h)document.documentElement.style.setProperty('--hdr-h',h.offsetHeight+'px')}
  hh();addEventListener('resize',hh);
  /* treatments index: mark the department in view */
  var links=[].slice.call(document.querySelectorAll('.svc__toc a'));
  if(links.length&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){var on=a.getAttribute('href')==='#'+e.target.id;a.classList.toggle('is-on',on);if(on){a.setAttribute('aria-current','true');var ol=a.closest('ol');if(ol&&ol.scrollWidth>ol.clientWidth)ol.scrollTo({left:a.offsetLeft-20,behavior:'smooth'})}else a.removeAttribute('aria-current')})}})},{rootMargin:'-30% 0px -60% 0px'});
    links.forEach(function(a){var t=document.querySelector(a.getAttribute('href'));if(t)io.observe(t)});
  }
})();
