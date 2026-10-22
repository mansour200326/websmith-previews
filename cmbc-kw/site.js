/* CMBC concept by Websmith: kit 03 (hero sequence), 18 (reveals), 19 (micro) + register, clock, menu */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
  var AR=document.documentElement.lang==='ar';

  /* mobile menu */
  var mb=document.querySelector('.menu-btn'),mn=document.getElementById('mnav');
  if(mb&&mn){mb.addEventListener('click',function(){var o=mn.classList.toggle('is-open');mb.setAttribute('aria-expanded',o)})}

  /* Kuwait clock (Thirdway idea) */
  var ck=document.querySelector('[data-clock]');
  if(ck){var tick=function(){try{ck.textContent=(AR?'الكويت ':'Kuwait ')+new Intl.DateTimeFormat(AR?'ar-KW':'en-GB',{timeZone:'Asia/Kuwait',hour:'2-digit',minute:'2-digit',hour12:false,numberingSystem:'latn'}).format(new Date())}catch(e){}};tick();setInterval(tick,20000)}

  /* kit 03: hero sequence with title-block caption */
  document.querySelectorAll('[data-k-seq]').forEach(function(root){
    var frames=[].slice.call(root.querySelectorAll('[data-k-seq-frame]'));
    var bars=root.querySelector('[data-k-seq-bars]'),tb=root.querySelector('.tblock'),mc=root.querySelector('.hero__cap');
    var ms=+root.getAttribute('data-k-seq-ms')||4800,i=0,t=null,visible=true,hover=false,started=false;
    root.style.setProperty('--k-seq-ms',ms+'ms');
    var pad=function(n){return(n<10?'0':'')+n};
    var btns=frames.map(function(f,n){var b=document.createElement('button');b.className='k-seq__bar';b.type='button';b.setAttribute('aria-label',(AR?'عرض الصورة ':'Show photo ')+(n+1));b.onclick=function(){go(n,true)};bars.appendChild(b);return b});
    function fill(){
      var f=frames[i];
      if(tb){['p','c','w'].forEach(function(k){var el=tb.querySelector('[data-f='+k+']');if(el)el.textContent=f.getAttribute('data-'+k)||'—'});var s=tb.querySelector('[data-f=s]');if(s)s.textContent=pad(i+1)+' / '+pad(frames.length)}
      if(mc){mc.innerHTML='';var bd=document.createElement('bdi');bd.dir='ltr';bd.textContent=pad(i+1)+' / '+pad(frames.length);mc.appendChild(bd);mc.appendChild(document.createTextNode('  '));var pn=document.createElement('bdi');pn.textContent=f.getAttribute('data-p')||'';mc.appendChild(pn)}
    }
    function go(n){
      frames[i].classList.remove('is-on');i=(n+frames.length)%frames.length;
      var img=frames[i].querySelector('img');if(img&&img.loading==='lazy')img.loading='eager';
      frames[i].classList.add('is-on');frames.forEach(function(f,k){if(k===i)f.removeAttribute('aria-hidden');else f.setAttribute('aria-hidden','true')});
      btns.forEach(function(b,k){b.classList.toggle('is-done',k<i);b.classList.remove('is-on')});
      void btns[i].offsetWidth;btns[i].classList.add('is-on');
      if(tb&&!RM&&started){tb.classList.add('is-swap');setTimeout(function(){fill();tb.classList.remove('is-swap')},180)}else fill();started=true;
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

  /* kit 18: reveals */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;el.setAttribute('aria-label',el.textContent.trim());
    var words=el.textContent.trim().split(/\s+/);el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+w.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.querySelectorAll('.k-rv-w'),function(w){var tp=w.offsetTop;if(top===null||Math.abs(tp-top)>4){lines.push([]);top=tp}lines[lines.length-1].push(w.textContent)});
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
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0});
    els.forEach(function(e){if(e.closest('.hero'))return;var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
    /* hero content plays on load, not on scroll (its bottom sits under the observer margin) */
    var heroIn=function(){document.querySelectorAll('.hero [data-reveal]').forEach(function(e){e.classList.add('is-in')})};
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){requestAnimationFrame(heroIn)});else heroIn();
    setTimeout(heroIn,1200);
  }

  /* kit 19: magnetic */
  if(FINE&&!RM){document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
    var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
  })}

  /* project register: tabs, show more, hover peek */
  var reg=document.querySelector('[data-reg]');
  if(reg){
    var tabs=[].slice.call(reg.querySelectorAll('.tab')),groups=[].slice.call(reg.querySelectorAll('.rgroup')),more=reg.querySelector('.rmore'),mbtn=more&&more.querySelector('button'),LIM=10,cur=null;
    function show(id,all){
      cur=id;
      tabs.forEach(function(t){var on=t.getAttribute('data-tab')===id;t.setAttribute('aria-selected',on);t.tabIndex=on?0:-1});
      groups.forEach(function(g){var on=g.getAttribute('data-group')===id;g.classList.toggle('is-active',on);
        if(on){var rows=[].slice.call(g.querySelectorAll('.rrow'));rows.forEach(function(r,k){r.classList.toggle('is-hidden',!all&&k>=LIM)});
          var n=rows.length;if(more){more.classList.toggle('is-on',!all&&n>LIM);mbtn.querySelector('[data-more-n]').textContent=n}}});
    }
    tabs.forEach(function(t,k){
      t.addEventListener('click',function(){show(t.getAttribute('data-tab'))});
      t.addEventListener('keydown',function(e){var d=e.key==='ArrowRight'?1:e.key==='ArrowLeft'?-1:0;if(AR)d=-d;if(!d)return;e.preventDefault();var n=tabs[(k+d+tabs.length)%tabs.length];n.focus();n.click()});
    });
    if(mbtn)mbtn.addEventListener('click',function(){show(cur,true)});
    show(tabs[0].getAttribute('data-tab'));
    var tw=reg.querySelector('.tabs-wrap'),tl=reg.querySelector('.tabs'),tm=reg.querySelector('.tabs-more');
    if(tw&&tl&&tm){
      var chk=function(){var left=tl.scrollWidth-tl.clientWidth-Math.abs(tl.scrollLeft);tw.classList.toggle('has-more',left>4)};
      tl.addEventListener('scroll',chk,{passive:true});addEventListener('resize',chk);chk();if(document.fonts)document.fonts.ready.then(chk);
      tm.addEventListener('click',function(){tl.scrollBy({left:(AR?-1:1)*tl.clientWidth*.7,behavior:RM?'auto':'smooth'})});
    }
    if(FINE){
      var pk=document.createElement('div');pk.className='peek';pk.setAttribute('aria-hidden','true');pk.innerHTML='<img alt="">';document.body.appendChild(pk);
      var pim=pk.querySelector('img'),x=0,y=0,raf=0;
      function place(){raf=0;var w=340,h=255,px=x+24,py=y-h/2;if(px+w>innerWidth-12)px=x-w-24;py=Math.max(12,Math.min(innerHeight-h-12,py));pk.style.transform='translate3d('+px+'px,'+py+'px,0) scale('+(pk.classList.contains('is-on')?1:.92)+')'}
      reg.addEventListener('pointermove',function(e){x=e.clientX;y=e.clientY;if(!raf)raf=requestAnimationFrame(place)});
      reg.querySelectorAll('.rrow.has-img').forEach(function(r){
        r.addEventListener('pointerenter',function(){pim.src=r.getAttribute('data-img');pk.classList.add('is-on');place()});
        r.addEventListener('pointerleave',function(){pk.classList.remove('is-on')});
      });
    }
  }
})();
