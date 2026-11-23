
/* ===== Doha Specialized: header shadow, doctor peek ===== */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var on=false;var f=function(){var s=scrollY>60;if(s!==on){on=s;hd.classList.toggle('is-stuck',s)}};addEventListener('scroll',f,{passive:true});f()}
  // doctors index: a portrait follows the pointer over the rows (desktop, fine pointer, motion allowed)
  if(!matchMedia('(hover:hover) and (pointer:fine) and (min-width:900px)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var list=document.querySelector('[data-peek]');if(!list)return;
  var peek=document.createElement('div');peek.className='dx-peek';peek.setAttribute('aria-hidden','true');var im=document.createElement('img');im.alt='';peek.appendChild(im);document.body.appendChild(peek);
  var x=0,y=0,tx=0,ty=0,raf=0;
  function loop(){x+=(tx-x)*.18;y+=(ty-y)*.18;peek.style.transform='translate3d('+(x+28).toFixed(1)+'px,'+(y-140).toFixed(1)+'px,0)';raf=Math.abs(tx-x)+Math.abs(ty-y)>.5?requestAnimationFrame(loop):0}
  list.querySelectorAll('li').forEach(function(li){
    var src=li.getAttribute('data-src');
    li.addEventListener('pointerenter',function(e){if(!src){peek.classList.remove('is-on');return}im.src=src;tx=x=e.clientX;ty=y=e.clientY;peek.classList.add('is-on');if(!raf)raf=requestAnimationFrame(loop)});
    li.addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;if(!raf)raf=requestAnimationFrame(loop)});
  });
  list.addEventListener('pointerleave',function(){peek.classList.remove('is-on')});
})();
