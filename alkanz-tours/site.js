/* Alkanz Tours concept: small extras on top of kit.js */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var on=false;addEventListener('scroll',function(){var s=scrollY>10;if(s!==on){on=s;hd.classList.toggle('is-scrolled',s)}},{passive:true})}

  // tour index: photo follows the pointer on desktop (kit 11 float, adapted to plain link rows)
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
  document.querySelectorAll('[data-tix]').forEach(function(list){
    if(!FINE||RM)return;
    var rows=[].slice.call(list.querySelectorAll('a[data-img]'));
    var fl=document.createElement('div');fl.className='tix-float';fl.setAttribute('aria-hidden','true');document.body.appendChild(fl);
    var imgs={};rows.forEach(function(a){var u=a.getAttribute('data-img');if(imgs[u])return;var i=new Image();i.alt='';i.decoding='async';i.dataset.src=u;fl.appendChild(i);imgs[u]=i});
    var loaded=false;function load(){if(loaded)return;loaded=true;for(var k in imgs)imgs[k].src=imgs[k].dataset.src}
    var tx=0,ty=0,x=0,y=0,run=false,rtl=getComputedStyle(list).direction==='rtl';
    function loop(){x+=(tx-x)*.14;y+=(ty-y)*.14;fl.style.setProperty('--fx',x+'px');fl.style.setProperty('--fy',y+'px');if(run)requestAnimationFrame(loop)}
    list.addEventListener('pointermove',function(e){var w=fl.offsetWidth,h=fl.offsetHeight;tx=rtl?e.clientX-w-50:e.clientX+50;ty=e.clientY-h/2;if(tx+w>innerWidth-10)tx=e.clientX-w-50;if(tx<10)tx=e.clientX+50});
    list.addEventListener('pointerenter',load);
    rows.forEach(function(a){var u=a.getAttribute('data-img');
      a.addEventListener('pointerenter',function(){for(var k in imgs)imgs[k].classList.toggle('is-on',k===u);fl.classList.add('is-on');if(!run){run=true;x=tx;y=ty;loop()}});
      a.addEventListener('pointerleave',function(){fl.classList.remove('is-on');run=false});});
  });
})();
