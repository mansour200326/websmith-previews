/* Pink Passion concept: sticky photo in "What's in the shop" follows the row you're on (scroll, hover or focus). */
(function(){
  var pics=document.querySelector('[data-shop-pics]');if(!pics)return;
  var imgs=pics.querySelectorAll('img'),cap=pics.querySelector('figcaption');
  function show(i){i=+i;imgs.forEach(function(im,n){im.classList.toggle('is-on',n===i)});if(cap&&imgs[i])cap.textContent=imgs[i].getAttribute('data-cap')||''}
  var rows=document.querySelectorAll('[data-pic]');
  rows.forEach(function(r){var i=r.getAttribute('data-pic');r.addEventListener('mouseenter',function(){show(i)});r.addEventListener('focusin',function(){show(i)})});
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)show(e.target.getAttribute('data-pic'))})},{rootMargin:'-45% 0px -45% 0px'});
    rows.forEach(function(r){io.observe(r)});
  }
})();
