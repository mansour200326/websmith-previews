/* Al Arabi concept, Websmith: menu, project tabs, catalogue hover preview. Motion core is kit.js. */
(function(){
  var rm=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  // mobile menu
  var mb=document.querySelector('.menu-btn'),nav=document.getElementById('nav');
  if(mb&&nav){mb.addEventListener('click',function(){var o=nav.classList.toggle('is-open');mb.setAttribute('aria-expanded',o)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('is-open')){nav.classList.remove('is-open');mb.setAttribute('aria-expanded','false');mb.focus()}})}
  // project tabs
  var tabs=document.querySelectorAll('[role=tab]');
  tabs.forEach(function(t){
    t.addEventListener('click',function(){sel(t)});
    t.addEventListener('keydown',function(e){
      var list=[].slice.call(tabs),i=list.indexOf(t),rtl=document.dir==='rtl',n=null;
      if(e.key==='ArrowRight')n=list[(i+(rtl?-1:1)+list.length)%list.length];
      if(e.key==='ArrowLeft')n=list[(i+(rtl?1:-1)+list.length)%list.length];
      if(n){n.focus();sel(n);e.preventDefault()}
    });
  });
  function sel(t){
    tabs.forEach(function(x){var on=x===t;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1;
      var p=document.getElementById(x.getAttribute('aria-controls'));if(p)p.hidden=!on});
    var k=t.dataset.ph;document.querySelectorAll('.proj__ph img').forEach(function(im){var on=im.dataset.ph===k;im.classList.toggle('on',on);if(on)im.removeAttribute('aria-hidden');else im.setAttribute('aria-hidden','true')});
  }
  document.querySelectorAll('.morebtn').forEach(function(b){
    b.addEventListener('click',function(){var l=document.getElementById(b.getAttribute('aria-controls'));var o=l.classList.toggle('is-all');b.setAttribute('aria-expanded',o);b.textContent=o?b.dataset.less:b.dataset.more});
  });
  // catalogue: floating photo on hover (desktop pointer only)
  var idx=document.querySelector('.idx');
  if(idx&&!rm&&window.matchMedia('(hover:hover) and (pointer:fine)').matches){
    var f=document.createElement('div');f.className='idx-float';f.setAttribute('aria-hidden','true');var im=document.createElement('img');im.alt='';f.appendChild(im);document.body.appendChild(f);
    var x=0,y=0,cx=0,cy=0,raf=0;
    function loop(){cx+=(x-cx)*.16;cy+=(y-cy)*.16;f.style.left=cx+'px';f.style.top=cy+'px';raf=requestAnimationFrame(loop)}
    idx.querySelectorAll('a[data-img]').forEach(function(a){
      a.addEventListener('mouseenter',function(e){im.src=a.dataset.img;x=cx=e.clientX+150;y=cy=e.clientY;f.classList.add('on');if(!raf)loop()});
      a.addEventListener('mousemove',function(e){x=e.clientX+(document.dir==='rtl'?-150:150);y=e.clientY});
      a.addEventListener('mouseleave',function(){f.classList.remove('on');cancelAnimationFrame(raf);raf=0});
    });
  }
})();
