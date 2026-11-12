/* Revlon Beauty & Spa concept: marks the department in view on the services page. */
(function(){
  var nav=document.querySelector('[data-svc-nav]');if(!nav||!('IntersectionObserver' in window))return;
  var links=[].slice.call(nav.querySelectorAll('a'));
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;
    links.forEach(function(a){var on=a.getAttribute('href')==='#'+e.target.id;a.classList.toggle('is-on',on);if(on){a.setAttribute('aria-current','true');if(nav.scrollWidth>nav.clientWidth)nav.scrollTo({left:a.offsetLeft-nav.offsetLeft-20,behavior:'smooth'})}else a.removeAttribute('aria-current')})})},
    {rootMargin:'-40% 0px -55% 0px'});
  links.forEach(function(a){var s=document.querySelector(a.getAttribute('href'));if(s)io.observe(s)});
})();
