/* Nolan's concept: page progress line (loaded after kit.js) */
(function(){
  var bar=document.querySelector('.prog');if(!bar)return;
  if(matchMedia('(prefers-reduced-motion: reduce)').matches){bar.remove();return}
  var t=false;
  function upd(){t=false;var h=document.documentElement.scrollHeight-innerHeight;bar.style.setProperty('--p',h>0?Math.min(1,scrollY/h).toFixed(4):0)}
  addEventListener('scroll',function(){if(!t){t=true;requestAnimationFrame(upd)}},{passive:true});
  addEventListener('resize',upd);upd();
})();
