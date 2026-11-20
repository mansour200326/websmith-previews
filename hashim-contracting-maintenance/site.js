/* Hashim concept: header state, project register (filter, show all, hover photo). Kit motion lives in kit.js. */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var on=function(){hd.classList.toggle('is-scrolled',scrollY>10)};addEventListener('scroll',on,{passive:true});on();}

  // fit the name to the column width
  var nm=document.querySelector('.hero__name .l');
  if(nm){var fit=function(){var h=nm.closest('.hero__name'),box=h.parentElement,cs=getComputedStyle(box),avail=box.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);
      h.style.fontSize='';var w=nm.scrollWidth,f=parseFloat(getComputedStyle(h).fontSize);if(w>0)h.style.fontSize=Math.min(f*avail/w*.995,f*1.25)+'px'};
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(fit);fit();var lw=innerWidth;addEventListener('resize',function(){if(innerWidth!==lw){lw=innerWidth;fit()}});}

  var reg=document.querySelector('[data-reg]');if(!reg)return;
  var rows=[].slice.call(reg.querySelectorAll('tr.r')),btns=[].slice.call(reg.querySelectorAll('.tabs button')),
      more=reg.querySelector('[data-more]'),LIMIT=+reg.getAttribute('data-limit')||0,cat='all',open=!LIMIT;
  function draw(){
    var shown=0;
    rows.forEach(function(r){var ok=cat==='all'||r.getAttribute('data-c')===cat;if(ok)shown++;r.hidden=!ok||(!open&&shown>LIMIT)});
    var total=rows.filter(function(r){return cat==='all'||r.getAttribute('data-c')===cat}).length;
    if(more){more.hidden=open||total<=LIMIT;}
  }
  btns.forEach(function(b){b.addEventListener('click',function(){cat=b.getAttribute('data-c');btns.forEach(function(x){x.setAttribute('aria-pressed',x===b)});draw()})});
  if(more)more.addEventListener('click',function(){open=true;draw()});
  draw();

  // floating photo beside the cursor (desktop, fine pointer, motion allowed)
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  var pk=document.createElement('div');pk.className='peek';pk.setAttribute('aria-hidden','true');pk.innerHTML='<img alt="">';document.body.appendChild(pk);
  var im=pk.firstChild,x=0,y=0,tx=0,ty=0,raf=0;
  function loop(){x+=(tx-x)*.18;y+=(ty-y)*.18;var rtl=document.dir==='rtl';pk.style.transform='translate3d('+(rtl?x-330:x+30).toFixed(1)+'px,'+(y-110).toFixed(1)+'px,0)';raf=requestAnimationFrame(loop)}
  rows.forEach(function(r){
    r.addEventListener('mouseenter',function(e){var s=r.getAttribute('data-img');if(!s)return;im.src=s;tx=x=e.clientX;ty=y=e.clientY;pk.classList.add('on');if(!raf)loop()});
    r.addEventListener('mousemove',function(e){tx=e.clientX;ty=e.clientY});
    r.addEventListener('mouseleave',function(){pk.classList.remove('on');cancelAnimationFrame(raf);raf=0});
  });
})();
