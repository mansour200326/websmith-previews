/* Al Zahmy Advocates concept: header, mobile menu, services index. */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var f=function(){hd.classList.toggle('is-scrolled',scrollY>8)};f();addEventListener('scroll',f,{passive:true})}
  var b=document.querySelector('.hd__menu'),m=document.getElementById('mnav');
  if(b&&m){b.addEventListener('click',function(){var o=m.classList.toggle('is-open');b.setAttribute('aria-expanded',o)});
    m.addEventListener('click',function(e){if(e.target.closest('a')){m.classList.remove('is-open');b.setAttribute('aria-expanded','false')}})}
  var links=[].slice.call(document.querySelectorAll('.toc a'));
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.remove('is-on')});var a=map[e.target.id];if(a)a.classList.add('is-on')}})},{rootMargin:'-40% 0px -55% 0px'});
    Object.keys(map).forEach(function(id){var s=document.getElementById(id);if(s)io.observe(s)});
  }
})();
