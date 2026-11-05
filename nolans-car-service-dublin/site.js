/* Nolan's concept: page progress line (loaded after kit.js) */
(function(){
  var bar=document.querySelector('.prog');if(!bar)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){bar.remove();return}
  var t=false;
  function upd(){t=false;var h=document.documentElement.scrollHeight-innerHeight;bar.style.setProperty('--p',h>0?Math.min(1,scrollY/h).toFixed(4):0)}
  addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(upd)}},{passive:true});
  addEventListener('resize',upd);upd();
})();
/* home, phones: hide the header wordmark while the big hero name is on screen */
(function(){
  var h=document.querySelector('.is-home .hero h1');if(!h||!('IntersectionObserver' in window))return;
  new IntersectionObserver(function(e){document.body.classList.toggle('name-in-view',e[0].isIntersecting)},{rootMargin:'-60px 0px 0px 0px'}).observe(h);
})();
