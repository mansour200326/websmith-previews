/* Dries Barnard Properties concept: page behaviour */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // header turns solid after the hero
  var hd=document.querySelector('.hd');
  if(hd&&!hd.classList.contains('hd--solid')){
    var on=function(){hd.classList.toggle('is-solid',scrollY>innerHeight*0.6)};
    addEventListener('scroll',on,{passive:true});on();
  }
  // mobile menu
  var mb=document.querySelector('.menu-btn'),mn=document.getElementById('mnav');
  if(mb&&mn){
    mb.addEventListener('click',function(){var o=mn.classList.toggle('is-open');mb.setAttribute('aria-expanded',o);hd&&hd.classList.toggle('hd--open',o);if(o&&hd)hd.classList.add('is-solid')});
    mn.addEventListener('click',function(e){if(e.target.closest('a')){mn.classList.remove('is-open');mb.setAttribute('aria-expanded','false')}});
  }
  // listings index: town filter
  var fs=[].slice.call(document.querySelectorAll('.ix__f')),rows=[].slice.call(document.querySelectorAll('.ix__row')),cnt=document.querySelector('[data-ix-count]'),lbl=document.querySelector('[data-ix-label]');
  fs.forEach(function(b){b.addEventListener('click',function(){
    var was=b.getAttribute('aria-pressed')==='true';
    fs.forEach(function(x){x.setAttribute('aria-pressed','false')});
    var t=was?null:b.dataset.town;if(t)b.setAttribute('aria-pressed','true');
    var n=0;rows.forEach(function(r){var s=!t||r.dataset.town===t;r.hidden=!s;if(s)n++});
    if(cnt)cnt.textContent=n;
    if(lbl)lbl.textContent=t?('For sale around '+t):'Farms and smallholdings for sale';
  })});
  // listings index: photo that follows the cursor (desktop, fine pointer only)
  var peek=document.querySelector('.ix__peek');
  if(peek&&!RM&&matchMedia('(hover:hover) and (pointer:fine) and (min-width:1000px)').matches){
    var img=peek.querySelector('img'),x=0,y=0,tx=0,ty=0,raf=0;
    var loop=function(){x+=(tx-x)*.16;y+=(ty-y)*.16;peek.style.transform='translate3d('+(x+28)+'px,'+(y-110)+'px,0)';raf=Math.abs(tx-x)+Math.abs(ty-y)>.5?requestAnimationFrame(loop):0};
    document.querySelectorAll('.ix__row summary').forEach(function(s){
      s.addEventListener('pointerenter',function(e){if(s.parentElement.open)return;img.src=s.dataset.img;tx=x=e.clientX;ty=y=e.clientY;peek.classList.add('is-on');loop()});
      s.addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY;if(!raf)raf=requestAnimationFrame(loop)});
      s.addEventListener('pointerleave',function(){peek.classList.remove('is-on')});
      s.addEventListener('click',function(){peek.classList.remove('is-on')});
    });
  }
  // gallery lightbox (farm page)
  var lb=document.getElementById('lb');
  if(lb&&lb.showModal){
    var gb=[].slice.call(document.querySelectorAll('.gal button')),li=lb.querySelector('img'),lp=lb.querySelector('p'),i=0;
    var show=function(n){i=(n+gb.length)%gb.length;var im=gb[i].querySelector('img');li.src=gb[i].dataset.full||im.src;li.alt=im.alt;lp.textContent=(i+1)+' / '+gb.length};
    gb.forEach(function(b,n){b.addEventListener('click',function(){show(n);lb.showModal()})});
    lb.querySelector('.x').addEventListener('click',function(){lb.close()});
    lb.querySelector('.pv').addEventListener('click',function(){show(i-1)});
    lb.querySelector('.nx').addEventListener('click',function(){show(i+1)});
    lb.addEventListener('keydown',function(e){if(e.key==='ArrowLeft')show(i-1);if(e.key==='ArrowRight')show(i+1)});
    var sx=0;lb.addEventListener('touchstart',function(e){sx=e.touches[0].clientX},{passive:true});
    lb.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-sx;if(Math.abs(d)>50)show(d<0?i+1:i-1)});
  }
  // video: load YouTube only when asked
  document.querySelectorAll('[data-yt]').forEach(function(b){b.addEventListener('click',function(){
    var f=document.createElement('iframe');f.src='https://www.youtube-nocookie.com/embed/'+b.dataset.yt+'?autoplay=1&rel=0';f.title=b.dataset.title||'Video';f.allow='autoplay; encrypted-media; picture-in-picture';f.allowFullscreen=true;b.replaceWith(f);
  })});
})();
