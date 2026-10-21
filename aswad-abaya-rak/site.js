/* Aswad Abaya concept: header state. Everything else comes from kit.js */
(function(){
  var h=document.querySelector('.hd');if(!h)return;
  function f(){h.classList.toggle('is-scrolled',window.scrollY>8)}
  f();window.addEventListener('scroll',f,{passive:true});
})();
/* open the service matching the URL hash (services.html#stitching) */
(function(){
  function go(){var id=location.hash.slice(1);if(!id)return;var d=document.getElementById(id);if(d&&d.tagName==='DETAILS'){d.open=true}}
  go();window.addEventListener('hashchange',go);
})();
/* colour index: photo follows the cursor on desktop (reuses .k-acc__float styles) */
(function(){
  var root=document.querySelector('[data-colours]');if(!root)return;
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var rows=[].slice.call(root.querySelectorAll('[data-img]'));
  var fl=document.createElement('div');fl.className='k-acc__float colours__float';fl.setAttribute('aria-hidden','true');document.body.appendChild(fl);
  var imgs={};rows.forEach(function(r){var u=r.getAttribute('data-img');if(imgs[u])return;var i=new Image();i.src=u;i.alt='';i.decoding='async';fl.appendChild(i);imgs[u]=i});
  var tx=0,ty=0,x=0,y=0,run=false,rtl=getComputedStyle(root).direction==='rtl';
  function loop(){x+=(tx-x)*.14;y+=(ty-y)*.14;fl.style.setProperty('--fx',x+'px');fl.style.setProperty('--fy',y+'px');if(run)requestAnimationFrame(loop)}
  root.addEventListener('pointermove',function(e){var w=fl.offsetWidth,h=fl.offsetHeight;tx=rtl?e.clientX-w-40:e.clientX+40;ty=e.clientY-h/2;if(tx+w>innerWidth)tx=e.clientX-w-40;if(tx<0)tx=e.clientX+40});
  rows.forEach(function(r){var u=r.getAttribute('data-img');
    r.addEventListener('pointerenter',function(){for(var k in imgs)imgs[k].classList.toggle('is-on',k===u);fl.classList.add('is-on');if(!run){run=true;x=tx;y=ty;loop()}});
    r.addEventListener('pointerleave',function(){fl.classList.remove('is-on');run=false})});
})();
