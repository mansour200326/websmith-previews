/* Azalea concept: kit 03, 07, 09, 12, 18, 19 (Websmith premium section kit), restyled. */
(function(){
  var AR=document.documentElement.lang==='ar';
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* header border on scroll */
  var hd=document.querySelector('.hd');
  if(hd){var f=function(){hd.classList.toggle('is-scrolled',scrollY>8)};addEventListener('scroll',f,{passive:true});f()}

  /* kit 18: reveals, line split, parallax */
  (function(){
    var DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches;
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
      setTimeout(function(){lineEls.forEach(function(e){if(!e.classList.contains('k-rv-ready'))split(e)})},1500);
      var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;lineEls.forEach(function(e){var on=e.classList.contains('is-in');split(e);if(on)e.classList.add('is-in')})}});
    }
    var els=document.querySelectorAll('[data-reveal]');
    if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')});return}
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0});
    els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
    var px=[].slice.call(document.querySelectorAll('[data-speed]'));
    if(DESK&&px.length){var tk=false;var upd=function(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var c=(r.top+r.height/2-vh/2);e.style.transform='translate3d(0,'+(c*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})};
      addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();}
  })();

  /* kit 03: story-style sequence */
  document.querySelectorAll('[data-k-seq]').forEach(function(root){
    var frames=[].slice.call(root.querySelectorAll('[data-k-seq-frame]'));
    var bars=root.querySelector('[data-k-seq-bars]'),cap=root.querySelector('[data-k-seq-cap]'),cnt=root.querySelector('[data-k-seq-count]');
    var ms=+root.getAttribute('data-k-seq-ms')||4200,i=0,t=null,visible=true,hover=false;
    root.style.setProperty('--k-seq-ms',ms+'ms');
    var pad=function(n){return(n<10?'0':'')+n};
    var btns=frames.map(function(f,n){var b=document.createElement('button');b.className='k-seq__bar';b.type='button';b.setAttribute('aria-label',(AR?'عرض الصورة ':'Show photo ')+(n+1));b.onclick=function(){go(n,true)};bars.appendChild(b);return b});
    function go(n){
      var nx=(n+frames.length)%frames.length;
      if(nx!==i){frames.forEach(function(f){f.classList.remove('was-on')});frames[i].classList.remove('is-on');frames[i].classList.add('was-on')}
      i=nx;
      var img=frames[i].querySelector('img');if(img&&img.loading==='lazy')img.loading='eager';
      frames[i].classList.add('is-on');
      btns.forEach(function(b,k){b.classList.toggle('is-done',k<i);b.classList.remove('is-on')});
      void btns[i].offsetWidth;btns[i].classList.add('is-on');
      if(cap){cap.textContent=frames[i].getAttribute('data-cap')||'';var h=frames[i].getAttribute('data-href');if(h)cap.href=h}
      if(cnt)cnt.textContent=pad(i+1)+' / '+pad(frames.length);
      schedule();
    }
    function schedule(){clearTimeout(t);if(RM||!visible||hover||document.hidden){root.classList.add('is-paused');return}root.classList.remove('is-paused');t=setTimeout(function(){go(i+1)},ms)}
    new IntersectionObserver(function(e){visible=e[0].isIntersecting;schedule()},{threshold:.2}).observe(root);
    root.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'){hover=true;schedule()}});
    root.addEventListener('pointerleave',function(){hover=false;schedule()});
    root.addEventListener('focusin',function(){hover=true;schedule()});
    root.addEventListener('focusout',function(){hover=false;schedule()});
    document.addEventListener('visibilitychange',schedule);
    addEventListener('load',function(){frames.forEach(function(f){var im=f.querySelector('img');if(im)im.loading='eager'})});
    go(0);
  });

  /* kit 07: marquee */
  document.querySelectorAll('[data-k-marquee]').forEach(function(m){
    var tr=m.querySelector('.k-marquee__track');if(!tr||m.dataset.kReady)return;m.dataset.kReady=1;
    m.style.setProperty('--k-mq-s',(+m.getAttribute('data-k-marquee-speed')||40)+'s');
    if(RM)return;
    var c=tr.cloneNode(true);c.setAttribute('aria-hidden','true');c.setAttribute('inert','');m.appendChild(c);
    new IntersectionObserver(function(e){m.classList.toggle('is-off',!e[0].isIntersecting)}).observe(m);
  });

  /* kit 09: drag strip */
  document.querySelectorAll('[data-k-drag]').forEach(function(root){
    var tr=root.querySelector('.k-drag__track'),bar=root.querySelector('.k-drag__bar'),prev=root.querySelector('[data-k-drag-prev]'),next=root.querySelector('[data-k-drag-next]');
    var rtl=getComputedStyle(tr).direction==='rtl';
    new IntersectionObserver(function(e,o){if(e[0].isIntersecting){root.classList.add('is-in');o.disconnect()}},{threshold:.12}).observe(root);
    function pos(){return Math.abs(tr.scrollLeft)}
    function upd(){var max=tr.scrollWidth-tr.clientWidth,p=max>0?pos()/max:1;
      if(bar)bar.style.setProperty('--k-prog',Math.max(.08,Math.min(1,p*.92+.08)));
      if(prev)prev.disabled=pos()<4;if(next)next.disabled=pos()>max-4;
      if(!RM)tr.querySelectorAll('.k-drag__card').forEach(function(c){var r=c.getBoundingClientRect(),cx=(r.left+r.width/2)/innerWidth-.5;c.style.setProperty('--k-px',(cx*-5).toFixed(2)+'%')});}
    tr.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});addEventListener('resize',upd);upd();
    function step(d){var c=tr.querySelector('.k-drag__card');var w=c?c.getBoundingClientRect().width+20:400;tr.scrollBy({left:d*w*(rtl?-1:1),behavior:RM?'auto':'smooth'})}
    if(prev)prev.onclick=function(){step(-1)};if(next)next.onclick=function(){step(1)};
    var down=false,x0=0,s0=0,v=0,lx=0,lt=0,moved=0,raf;
    tr.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=0;x0=lx=e.clientX;s0=tr.scrollLeft;lt=performance.now();v=0;cancelAnimationFrame(raf)});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-x0;if(Math.abs(dx)>4){tr.classList.add('is-drag')}moved=Math.max(moved,Math.abs(dx));tr.scrollLeft=s0-dx;var t=performance.now();v=(e.clientX-lx)/Math.max(1,t-lt);lx=e.clientX;lt=t});
    addEventListener('pointerup',function(){if(!down)return;down=false;
      if(RM||Math.abs(v)<.05){tr.classList.remove('is-drag');return}
      var vel=v*16;(function glide(){tr.scrollLeft-=vel;vel*=.93;if(Math.abs(vel)>.5)raf=requestAnimationFrame(glide);else tr.classList.remove('is-drag')})()});
    tr.addEventListener('click',function(e){if(moved>6){e.preventDefault();e.stopPropagation()}},true);
  });

  /* kit 12: price list tabs */
  document.querySelectorAll('[data-k-menu]').forEach(function(root){
    var tabs=root.querySelector('[data-k-menu-tabs]'),ink=tabs.querySelector('.k-menu__ink'),btns=[].slice.call(tabs.querySelectorAll('[data-tab]')),panels=[].slice.call(root.querySelectorAll('[data-panel]'));
    panels.forEach(function(p){[].forEach.call(p.querySelectorAll('.k-menu__item'),function(li,i){li.style.setProperty('--i',i)})});
    function line(b){ink.style.width=b.offsetWidth+'px';ink.style.left=b.offsetLeft+'px'}
    function pick(b){btns.forEach(function(x){x.setAttribute('aria-selected',x===b);x.tabIndex=x===b?0:-1});panels.forEach(function(p){var on=p.dataset.panel===b.dataset.tab;p.hidden=!on;p.classList.remove('is-in');if(on)requestAnimationFrame(function(){requestAnimationFrame(function(){p.classList.add('is-in')})})});line(b)}
    btns.forEach(function(b){b.addEventListener('click',function(){pick(b)})});
    tabs.addEventListener('keydown',function(e){var i=btns.findIndex(function(b){return b.getAttribute('aria-selected')==='true'});var fwd=AR?'ArrowLeft':'ArrowRight',back=AR?'ArrowRight':'ArrowLeft';if(e.key===fwd||e.key===back){var n=btns[(i+(e.key===fwd?1:-1)+btns.length)%btns.length];n.focus();pick(n)}});
    var first=btns.find(function(b){return b.getAttribute('aria-selected')==='true'})||btns[0];
    // no-JS shows every panel; with JS, hide all but the first
    pick(first);
    if(!RM){panels.forEach(function(p){p.classList.remove('is-in')});new IntersectionObserver(function(e,o){if(e[0].isIntersecting){pick(first);o.disconnect()}},{threshold:.1}).observe(root)}
    addEventListener('resize',function(){line(btns.find(function(b){return b.getAttribute('aria-selected')==='true'}))});
  });

  /* services: highlight the category in the jump bar */
  var jl=[].slice.call(document.querySelectorAll('.jump a'));
  if(jl.length&&'IntersectionObserver' in window){
    var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){jl.forEach(function(a){var on=a.getAttribute('href')==='#'+e.target.id;a.classList.toggle('is-on',on);if(on)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')})}})},{rootMargin:'-40% 0px -55% 0px'});
    jl.forEach(function(a){var s=document.querySelector(a.getAttribute('href'));if(s)io2.observe(s)});
  }

  /* mobile order bar: hidden while the hero buttons or the CTA band are on screen */
  var bar=document.querySelector('.mbar');
  if(bar&&'IntersectionObserver' in window){
    var seen=new Set();
    var io3=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)seen.add(e.target);else seen.delete(e.target)});bar.classList.toggle('is-hidden',seen.size>0)});
    document.querySelectorAll('[data-hide-bar]').forEach(function(el){io3.observe(el)});
  }

  /* kit 19: magnetic */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();var x=(e.clientX-r.left-r.width/2)*k,y=(e.clientY-r.top-r.height/2)*k;el.classList.add('is-mag');el.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }
})();
