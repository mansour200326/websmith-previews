/* IESCO concept: small extras on top of kit.js */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // hairline rules draw across when they enter
  var rules=document.querySelectorAll('.rule[data-draw]');
  if(rules.length&&!RM&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{threshold:.1});
    rules.forEach(function(r){io.observe(r)});
  }else rules.forEach(function(r){r.classList.add('is-in')});
  // catalogue side index: mark the section in view
  var nav=document.querySelector('.catl__nav');
  if(nav){
    var links=[].slice.call(nav.querySelectorAll('a'));
    var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var id=e.target.id;
      links.forEach(function(a){var on=a.getAttribute('href')==='#'+id;a.classList.toggle('is-on',on);if(on)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')})})},{rootMargin:'-40% 0px -55% 0px'});
    links.forEach(function(a){var t=document.querySelector(a.getAttribute('href'));if(t)io2.observe(t)});
  }
})();
/* services: "Show all" for long lists on phones; chip scroller follows the section in view */
(function(){
  document.querySelectorAll('.more').forEach(function(b){b.addEventListener('click',function(){var ul=b.previousElementSibling;ul.classList.add('is-open');b.setAttribute('aria-expanded','true');var li=ul.querySelectorAll('li')[4];if(li){li.setAttribute('tabindex','-1');li.focus({preventScroll:true})}})});
  var chips=document.querySelector('.chips');if(!chips||!('IntersectionObserver' in window))return;
  var as=[].slice.call(chips.querySelectorAll('a'));
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;as.forEach(function(a){var on=a.getAttribute('href')==='#'+e.target.id;a.classList.toggle('is-on',on);if(on&&chips.scrollWidth>chips.clientWidth){a.scrollIntoView({inline:'center',block:'nearest',behavior:'smooth'})}})})},{rootMargin:'-40% 0px -55% 0px'});
  as.forEach(function(a){var t=document.querySelector(a.getAttribute('href'));if(t)io.observe(t)});
})();
