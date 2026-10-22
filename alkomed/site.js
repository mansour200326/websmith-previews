/* Alkomed concept: services index follows the scroll */
(function(){
  var links=[].slice.call(document.querySelectorAll('.svc__idx a'));if(!links.length||!('IntersectionObserver' in window))return;
  var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.remove('is-on')});var a=map[e.target.id];if(a)a.classList.add('is-on')}})},{rootMargin:'-35% 0px -60% 0px'});
  Object.keys(map).forEach(function(id){var s=document.getElementById(id);if(s)io.observe(s)});
})();
/* hero sequence: only the showing frame is exposed to assistive tech */
(function(){
  document.querySelectorAll('[data-k-seq]').forEach(function(root){
    var fr=[].slice.call(root.querySelectorAll('[data-k-seq-frame]'));
    function sync(){fr.forEach(function(f){if(f.classList.contains('is-on'))f.removeAttribute('aria-hidden');else f.setAttribute('aria-hidden','true')})}
    sync();fr.forEach(function(f){new MutationObserver(sync).observe(f,{attributes:true,attributeFilter:['class']})});
  });
})();
