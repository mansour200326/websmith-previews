/* X Factor Car Care concept: kit 03 (sequence, restyled as a story reel), 16 (tap-load map), 18 (reveals), 19 (magnetic) + header/bar */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var AR=document.documentElement.lang==='ar';

  // header goes solid after the first screen; phone bar shows after the hero
  var hd=document.querySelector('.hd'),bar=document.querySelector('.bar');
  function onScroll(){var y=scrollY;if(hd)hd.classList.toggle('is-solid',y>40);if(bar)bar.classList.toggle('is-on',y>innerHeight*.6)}
  addEventListener('scroll',onScroll,{passive:true});onScroll();

  // clear the hero entry animation once done (full-page captures replay it otherwise)
  document.querySelectorAll('.hero h1 .ln>span,.hero__lead,.hero .acts,.hero__reel').forEach(function(e){e.addEventListener('animationend',function(){e.style.animation='none';e.style.opacity='1';e.style.transform='none';e.style.clipPath='none'})});

  // menu (phones)
  var mb=document.querySelector('.hd__menu'),mp=document.getElementById('menu');
  if(mb&&mp){var mx=mp.querySelector('.menu__x');
    function shut(){mp.hidden=true;mb.setAttribute('aria-expanded','false');document.documentElement.classList.remove('menu-open');mb.focus()}
    mb.addEventListener('click',function(){mp.hidden=false;mb.setAttribute('aria-expanded','true');document.documentElement.classList.add('menu-open');mx.focus()});
    mx.addEventListener('click',shut);
    mp.addEventListener('keydown',function(e){if(e.key==='Escape')shut()});
    mp.querySelectorAll('nav a').forEach(function(a){a.addEventListener('click',function(){if(a.getAttribute('href').indexOf('#')>-1){mp.hidden=true;mb.setAttribute('aria-expanded','false');document.documentElement.classList.remove('menu-open')}})});
  }

  // kit 03: sequence
  document.querySelectorAll('[data-k-seq]').forEach(function(root){
    var frames=[].slice.call(root.querySelectorAll('[data-k-seq-frame]'));
    var bars=root.querySelector('[data-k-seq-bars]'),cap=root.querySelector('[data-k-seq-cap]'),cnt=root.querySelector('[data-k-seq-count]');
    var ms=+root.getAttribute('data-k-seq-ms')||4200,i=0,t=null,visible=true,hover=false;
    root.style.setProperty('--k-seq-ms',ms+'ms');
    var pad=function(n){return(n<10?'0':'')+n};
    var btns=frames.map(function(f,n){var b=document.createElement('button');b.className='k-seq__bar';b.type='button';b.setAttribute('aria-label',(AR?'عرض الصورة ':'Show photo ')+(n+1));b.onclick=function(){go(n,true)};bars.appendChild(b);return b});
    function go(n){
      frames[i].classList.remove('is-on');i=(n+frames.length)%frames.length;
      var img=frames[i].querySelector('img');if(img&&img.loading==='lazy')img.loading='eager';
      frames[i].classList.add('is-on');
      btns.forEach(function(b,k){b.classList.toggle('is-done',k<i);b.classList.remove('is-on')});
      void btns[i].offsetWidth;btns[i].classList.add('is-on');
      if(cap)cap.textContent=frames[i].getAttribute('data-cap')||'';
      if(cnt)cnt.textContent=pad(i+1)+' / '+pad(frames.length);
      schedule();
    }
    function schedule(){clearTimeout(t);if(RM||!visible||hover||document.hidden){root.classList.add('is-paused');return}root.classList.remove('is-paused');t=setTimeout(function(){go(i+1)},ms)}
    new IntersectionObserver(function(e){visible=e[0].isIntersecting;schedule()},{threshold:.2}).observe(root);
    root.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'){hover=true;schedule()}});
    root.addEventListener('pointerleave',function(){hover=false;schedule()});
    document.addEventListener('visibilitychange',schedule);
    addEventListener('load',function(){frames.forEach(function(f){var im=f.querySelector('img');if(im)im.loading='eager'})});
    go(0);
  });

  // kit 16: map loads on tap (phones) or when near (desktop)
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=AR?'خريطة الموقع':'Map: X Factor Car Care, Al Faseel, Fujairah';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');if(btn)btn.remove()};m.appendChild(f)}
    if(btn)btn.addEventListener('click',load);
    // tap to load only: the Google embed is ~400KB of JS
  });

  // kit 19: magnetic
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }

  // kit 18: reveals
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;el.setAttribute('aria-label',el.textContent.trim());
    var words=el.textContent.trim().split(/[ \t\n\r]+/);el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+w.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.querySelectorAll('.k-rv-w'),function(w){var t=w.offsetTop;if(t!==top){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
    var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')};
    el.innerHTML=lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+esc(l.join(' '))+'</span></span>'}).join('');
    el.classList.add('k-rv-ready');
  }
  var lineEls=[].slice.call(document.querySelectorAll('[data-reveal=lines]'));
  if(!RM){
    var ready=function(){lineEls.forEach(split)};
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ready);else ready();
    var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;lineEls.forEach(function(e){var on=e.classList.contains('is-in');split(e);if(on)e.classList.add('is-in')})}});
  }
  var els=document.querySelectorAll('[data-reveal]');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:0});
  els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
  var px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(matchMedia('(min-width:900px) and (pointer:fine)').matches&&px.length){var tk=false;function upd(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var c=(r.top+r.height/2-vh/2);e.style.transform='translate3d(0,'+(c*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})}
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();}
})();
