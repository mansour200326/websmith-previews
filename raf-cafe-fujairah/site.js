/* RAF Cafe concept · Websmith. Kit 03/07/09/16/18/19 adapted + open-now (past midnight) + shelf index + counter. */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var AR=document.documentElement.lang==='ar';
  var DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches;

  /* header state */
  var hd=document.querySelector('.hd');
  if(hd){var st=function(){hd.classList.toggle('is-stuck',scrollY>40)};addEventListener('scroll',st,{passive:true});st();}

  /* kit 03: story sequence */
  document.querySelectorAll('[data-k-seq]').forEach(function(root){
    var frames=[].slice.call(root.querySelectorAll('[data-k-seq-frame]'));
    var bars=root.querySelector('[data-k-seq-bars]'),cap=root.querySelector('[data-k-seq-cap]'),sub=root.querySelector('[data-k-seq-sub]');
    var ms=+root.getAttribute('data-k-seq-ms')||4200,i=0,t=null,visible=true,hover=false;
    root.style.setProperty('--k-seq-ms',ms+'ms');
    var lbl=root.getAttribute('data-k-seq-label')||'Show photo';
    var btns=frames.map(function(f,n){var b=document.createElement('button');b.className='k-seq__bar';b.type='button';b.setAttribute('aria-label',lbl+' '+(n+1));b.onclick=function(){go(n,true)};bars.appendChild(b);return b});
    function go(n){
      frames[i].classList.remove('is-on');i=(n+frames.length)%frames.length;
      var img=frames[i].querySelector('img');if(img&&img.loading==='lazy')img.loading='eager';
      frames[i].classList.add('is-on');
      frames.forEach(function(f,k){if(k===i)f.removeAttribute('aria-hidden');else f.setAttribute('aria-hidden','true')});
      btns.forEach(function(b,k){b.classList.toggle('is-done',k<i);b.classList.remove('is-on')});
      void btns[i].offsetWidth;btns[i].classList.add('is-on');
      if(cap)cap.textContent=frames[i].getAttribute('data-cap')||'';
      if(sub)sub.textContent=frames[i].getAttribute('data-sub')||'';
      schedule();
    }
    function schedule(){clearTimeout(t);if(RM||!visible||hover||document.hidden){root.classList.add('is-paused');return}root.classList.remove('is-paused');t=setTimeout(function(){go(i+1)},ms)}
    new IntersectionObserver(function(e){visible=e[0].isIntersecting;schedule()},{threshold:.2}).observe(root);
    root.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'){hover=true;schedule()}});
    root.addEventListener('pointerleave',function(){hover=false;schedule()});
    root.addEventListener('click',function(e){if(e.target.closest('button'))return;var r=root.getBoundingClientRect(),x=e.clientX-r.left,back=AR?x>r.width/3*2:x<r.width/3;go(i+(back?-1:1))});
    document.addEventListener('visibilitychange',schedule);
    addEventListener('load',function(){frames.forEach(function(f){var im=f.querySelector('img');if(im)im.loading='eager'})});
    go(0);
  });

  /* kit 07: marquee */
  document.querySelectorAll('[data-k-marquee]').forEach(function(m){
    var tr=m.querySelector('.k-marquee__track');if(!tr)return;
    m.style.setProperty('--k-mq-s',(+m.getAttribute('data-k-marquee-speed')||40)+'s');
    if(RM)return;
    var c=tr.cloneNode(true);c.setAttribute('aria-hidden','true');c.setAttribute('inert','');m.appendChild(c);
    new IntersectionObserver(function(e){m.classList.toggle('is-off',!e[0].isIntersecting)}).observe(m);
  });

  /* kit 09: drag scroller */
  document.querySelectorAll('[data-k-drag]').forEach(function(root){
    var tr=root.querySelector('.k-drag__track'),bar=root.querySelector('.k-drag__bar'),prev=root.querySelector('[data-k-drag-prev]'),next=root.querySelector('[data-k-drag-next]');
    var rtl=getComputedStyle(tr).direction==='rtl';
    new IntersectionObserver(function(e,o){if(e[0].isIntersecting){root.classList.add('is-in');o.disconnect()}},{threshold:.12}).observe(root);
    function pos(){return Math.abs(tr.scrollLeft)}
    function upd(){var max=tr.scrollWidth-tr.clientWidth,p=max>0?pos()/max:1;
      if(bar)bar.style.setProperty('--k-prog',Math.max(.08,Math.min(1,p*.92+.08)));
      if(prev)prev.disabled=pos()<4;if(next)next.disabled=pos()>max-4;
      if(!RM)tr.querySelectorAll('.card').forEach(function(c){var r=c.getBoundingClientRect(),cx=(r.left+r.width/2)/innerWidth-.5;c.style.setProperty('--k-px',(cx*-6).toFixed(2)+'%')});}
    tr.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});addEventListener('resize',upd);upd();
    function step(d){var c=tr.querySelector('.card');var w=c?c.getBoundingClientRect().width+20:300;tr.scrollBy({left:d*w*(rtl?-1:1),behavior:RM?'auto':'smooth'})}
    if(prev)prev.onclick=function(){step(-1)};if(next)next.onclick=function(){step(1)};
    var down=false,x0=0,s0=0,v=0,lx=0,lt=0,moved=0,raf;
    tr.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=0;x0=lx=e.clientX;s0=tr.scrollLeft;lt=performance.now();v=0;cancelAnimationFrame(raf)});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-x0;if(Math.abs(dx)>4)tr.classList.add('is-drag');moved=Math.max(moved,Math.abs(dx));tr.scrollLeft=s0-dx;var t=performance.now();v=(e.clientX-lx)/Math.max(1,t-lt);lx=e.clientX;lt=t});
    addEventListener('pointerup',function(){if(!down)return;down=false;
      if(RM||Math.abs(v)<.05){tr.classList.remove('is-drag');return}
      var vel=v*16;(function glide(){tr.scrollLeft-=vel;vel*=.93;if(Math.abs(vel)>.5)raf=requestAnimationFrame(glide);else tr.classList.remove('is-drag')})()});
    tr.addEventListener('click',function(e){if(moved>6){e.preventDefault();e.stopPropagation()}},true);
  });

  /* open now: every day 09:00 to 00:30 (Dubai time), crosses midnight */
  var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
  var g=function(k){return +((parts.find(function(p){return p.type===k})||{}).value||0)};
  var now=(g('hour')%24)+g('minute')/60,open=now>=9||now<0.5;
  document.querySelectorAll('[data-open]').forEach(function(b){
    b.hidden=false;b.classList.add(open?'is-open':'is-shut');
    b.querySelector('span').textContent=open?(AR?'مفتوح الحين':'Open now'):(AR?'مسكّر الحين، نفتح ٩ الصبح':'Closed now, opens 9am');
  });

  /* kit 16: tap-to-load map */
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=AR?'خريطة رف كافيه':'Map to RAF Cafe';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');if(btn)btn.remove()};m.appendChild(f)}
    if(btn)btn.addEventListener('click',load);
  });

  /* shelf index: hover/focus swaps the sticky photo */
  document.querySelectorAll('[data-idx]').forEach(function(root){
    var rows=[].slice.call(root.querySelectorAll('.idx__row')),imgs=[].slice.call(root.querySelectorAll('.idx__view img')),cap=root.querySelector('.idx__view figcaption');
    function on(n){rows.forEach(function(r,k){r.classList.toggle('is-on',k===n)});imgs.forEach(function(im,k){im.classList.toggle('is-on',k===n)});if(cap&&imgs[n])cap.textContent=imgs[n].getAttribute('data-cap')||''}
    rows.forEach(function(r,n){var a=r.querySelector('a');a.addEventListener('mouseenter',function(){on(n)});a.addEventListener('focus',function(){on(n)})});
    on(0);
  });

  /* services chips: mark the section in view */
  var chips=[].slice.call(document.querySelectorAll('.chips a'));
  if(chips.length){var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){chips.forEach(function(c){c.classList.toggle('is-on',c.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-40% 0px -55% 0px'});
    chips.forEach(function(c){var s=document.querySelector(c.getAttribute('href'));if(s)io2.observe(s)});}

  /* counter (real number only) */
  document.querySelectorAll('[data-count]').forEach(function(el){
    var to=+el.getAttribute('data-count'),fmt=function(n){return AR?n.toLocaleString('ar-AE'):n.toLocaleString('en-US')};
    if(RM){el.textContent=fmt(to);return}
    new IntersectionObserver(function(e,o){if(!e[0].isIntersecting)return;o.disconnect();var t0=performance.now();
      (function f(t){var p=Math.min(1,(t-t0)/1400),k=1-Math.pow(1-p,4);el.textContent=fmt(Math.round(to*k/100)*100);if(p<1)requestAnimationFrame(f);else el.textContent=fmt(to)})(t0)},{threshold:.6}).observe(el);
  });

  /* kit 18: reveals */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    /* keep authored <br> as forced line breaks */
    el.innerHTML=el.dataset.kTxt.replace(/<br\s*\/?>/gi,' \u00b6\u00b6 ');el.setAttribute('aria-label',el.textContent.replace(/\u00b6\u00b6/g,' ').trim().replace(/\s+/g,' '));
    var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')};
    var words=el.textContent.trim().split(/\s+/);el.innerHTML=words.map(function(w){return w==='\u00b6\u00b6'?'<br>':'<span class="k-rv-w">'+esc(w)+'</span>'}).join(' ');
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
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0});
    els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
  }
  var px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(DESK&&!RM&&px.length){var tk=false;var upd=function(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var c=(r.top+r.height/2-vh/2);e.style.transform='translate3d(0,'+(c*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})};
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();}

  /* kit 19: magnetic */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }
})();
