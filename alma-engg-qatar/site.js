/* Al-Mana concept · Websmith. Kit 05/07/08/16/18/19 behaviour + header, index hover, services index. */
(function(){
  var d=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,
      DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches,RTL=d.dir==='rtl';

  /* header: solid after the hero, hides on scroll down, shows on scroll up */
  var hd=document.querySelector('.hd');
  if(hd&&!hd.classList.contains('hd--light')){
    var last=0,tk=false;
    var upd=function(){tk=false;var y=scrollY;hd.classList.toggle('is-solid',y>innerHeight*.72);
      if(!RM)hd.classList.toggle('is-hidden',y>innerHeight&&y>last+4);if(y<last-4)hd.classList.remove('is-hidden');last=y};
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();
  }
  /* mobile menu */
  var mb=document.querySelector('.hd__menu'),mn=document.querySelector('.mnav');
  if(mb&&mn){var mx=mn.querySelector('.mnav__x');
    var setM=function(o){mn.classList.toggle('is-open',o);mb.setAttribute('aria-expanded',o);mn.toggleAttribute('inert',!o);document.body.style.overflow=o?'hidden':'';(o?mx:mb).focus()};
    mn.setAttribute('inert','');mb.addEventListener('click',function(){setM(true)});mx.addEventListener('click',function(){setM(false)});
    mn.addEventListener('click',function(e){if(e.target.closest('a'))setM(false)});
    addEventListener('keydown',function(e){if(e.key==='Escape'&&mn.classList.contains('is-open'))setM(false)});}

  /* kit 18: reveals */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;el.setAttribute('aria-label',el.textContent.trim());
    var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')};
    var words=el.textContent.trim().split(/\s+/);el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+esc(w)+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.querySelectorAll('.k-rv-w'),function(w){var t=w.offsetTop;if(t!==top){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
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
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:0});
    els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
  }
  var px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(DESK&&!RM&&px.length){var tp=false;var updP=function(){tp=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var c=(r.top+r.height/2-vh/2);e.style.transform='translate3d(0,'+(c*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})};
    addEventListener('scroll',function(){if(!tp){tp=true;requestAnimationFrame(updP)}},{passive:true});updP();}

  /* kit 19: magnetic */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});});
  }

  /* kit 07: marquee */
  document.querySelectorAll('[data-k-marquee]').forEach(function(m){
    var tr=m.querySelector('.k-marquee__track');if(!tr)return;
    m.style.setProperty('--k-mq-s',(+m.getAttribute('data-k-marquee-speed')||40)+'s');if(RM)return;
    var c=tr.cloneNode(true);c.setAttribute('aria-hidden','true');c.setAttribute('inert','');m.appendChild(c);
    new IntersectionObserver(function(e){m.classList.toggle('is-off',!e[0].isIntersecting)}).observe(m);
  });

  /* kit 05: sticky story */
  document.querySelectorAll('[data-k-story]').forEach(function(root){
    var steps=[].slice.call(root.querySelectorAll('[data-k-story-step]')),media=[].slice.call(root.querySelectorAll('[data-k-story-media]')),box=root.querySelector('.k-story__media');
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var n=steps.indexOf(e.target);
      steps.forEach(function(s,k){s.classList.toggle('is-on',k===n)});media.forEach(function(m,k){m.classList.toggle('is-on',k===n)});
      if(box)box.style.setProperty('--k-story-p',((n+1)/steps.length).toFixed(3))})},{rootMargin:'-45% 0px -45% 0px'});
    steps.forEach(function(s){so.observe(s)});
  });

  /* project index: floating photo on hover (desktop) */
  var tbl=document.querySelector('[data-ihover]');
  if(tbl&&DESK&&!RM){
    var fl=document.createElement('div');fl.className='ihover';fl.setAttribute('aria-hidden','true');fl.innerHTML='<img alt="">';document.body.appendChild(fl);
    var im=fl.querySelector('img'),tx=0,ty=0,cx=0,cy=0,raf=0;
    var loop=function(){cx+=(tx-cx)*.16;cy+=(ty-cy)*.16;fl.style.left=cx+'px';fl.style.top=cy+'px';raf=requestAnimationFrame(loop)};
    tbl.querySelectorAll('tr[data-img]').forEach(function(r){
      r.addEventListener('pointerenter',function(e){im.src=r.getAttribute('data-img');fl.classList.add('is-on');tx=cx=e.clientX+28;ty=cy=e.clientY-120;if(!raf)raf=requestAnimationFrame(loop)});
      r.addEventListener('pointermove',function(e){tx=RTL?e.clientX-328:e.clientX+28;ty=e.clientY-120});
      r.addEventListener('pointerleave',function(){fl.classList.remove('is-on')});
    });
    tbl.addEventListener('pointerleave',function(){cancelAnimationFrame(raf);raf=0});
  }

  /* kit 16: tap-to-load map */
  document.querySelectorAll('[data-k-map]').forEach(function(m){var b=m.querySelector('button');
    if(b)b.addEventListener('click',function(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=m.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');b.remove()};m.appendChild(f)})});

  /* services side index */
  var side=document.querySelectorAll('.svc__side a');
  if(side.length){var so2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){side.forEach(function(a){a.classList.toggle('is-on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-40% 0px -55% 0px'});
    document.querySelectorAll('.svc__item[id]').forEach(function(s){so2.observe(s)});}

  /* projects page: filter + lightbox (kit 08) */
  var pf=document.querySelector('[data-pfilter]'),cards=[].slice.call(document.querySelectorAll('.pcard'));
  if(pf)pf.addEventListener('click',function(e){var b=e.target.closest('button');if(!b)return;var c=b.dataset.cat;
    pf.querySelectorAll('button').forEach(function(x){x.setAttribute('aria-pressed',x===b)});
    cards.forEach(function(k){k.hidden=!(c==='all'||k.dataset.cat.split(' ').indexOf(c)>-1)})});
  var shots=[].slice.call(document.querySelectorAll('[data-lb]'));
  if(shots.length){
    var lb=document.createElement('dialog');lb.className='k-lb';lb.setAttribute('aria-label',RTL?'عارض الصور':'Photo viewer');
    lb.innerHTML='<div class="k-lb__top"><span class="k-lb__count"></span><button class="k-lb__close" aria-label="'+(RTL?'إغلاق':'Close')+'">×</button></div><div class="k-lb__stage"><button class="k-lb__nav k-lb__prev" aria-label="'+(RTL?'السابق':'Previous')+'">←</button><img alt=""><button class="k-lb__nav k-lb__next" aria-label="'+(RTL?'التالي':'Next')+'">→</button></div><p class="k-lb__cap"></p>';
    document.body.appendChild(lb);
    var li=lb.querySelector('img'),lc=lb.querySelector('.k-lb__cap'),ln=lb.querySelector('.k-lb__count'),cur=0,set=[];
    var show=function(n){cur=(n+set.length)%set.length;var a=set[cur];li.src=a.getAttribute('data-lb');li.alt=(a.querySelector('img')||{}).alt||'';lc.textContent=a.getAttribute('data-cap')||'';ln.textContent=(cur+1)+' / '+set.length;li.style.animation='none';void li.offsetWidth;li.style.animation=''};
    shots.forEach(function(a){a.addEventListener('click',function(e){e.preventDefault();var g=a.closest('[data-lb-group]');set=g?[].slice.call(g.querySelectorAll('[data-lb]')):shots;show(set.indexOf(a));lb.showModal()})});
    lb.querySelector('.k-lb__prev').onclick=function(){show(cur-1)};lb.querySelector('.k-lb__next').onclick=function(){show(cur+1)};
    lb.querySelector('.k-lb__close').onclick=function(){lb.close()};
    lb.addEventListener('click',function(e){if(e.target===lb||e.target.classList.contains('k-lb__stage'))lb.close()});
    lb.addEventListener('keydown',function(e){if(e.key==='ArrowRight')show(cur+(RTL?-1:1));if(e.key==='ArrowLeft')show(cur+(RTL?1:-1))});
    var x0=null;lb.addEventListener('pointerdown',function(e){x0=e.clientX});
    lb.addEventListener('pointerup',function(e){if(x0===null)return;var dx=e.clientX-x0;x0=null;if(Math.abs(dx)>50)show(cur+((dx<0)!==RTL?1:-1))});
  }
})();
