/* DACO concept: menu toggle + services index highlight. Kit behaviour lives in kit.js. */
(function(){
  var b=document.querySelector('.hd__menu'),n=document.getElementById('nav');
  if(b&&n){b.addEventListener('click',function(){var o=n.classList.toggle('is-open');b.setAttribute('aria-expanded',o)});
    n.addEventListener('click',function(e){if(e.target.closest('a')){n.classList.remove('is-open');b.setAttribute('aria-expanded','false')}})}
  var links=[].slice.call(document.querySelectorAll('.svc__idx a'));
  if(links.length&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var id=e.target.id;
      links.forEach(function(a){a.classList.toggle('is-on',a.getAttribute('href')==='#'+id)})})},{rootMargin:'-40% 0px -55% 0px'});
    links.forEach(function(a){var t=document.querySelector(a.getAttribute('href'));if(t)io.observe(t)});
  }
})();
