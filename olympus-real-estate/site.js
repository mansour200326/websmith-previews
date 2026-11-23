/* Olympus Real Estate concept, Websmith. Kit 05/14/16/18/19 + header, hero, property index. */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
  var DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches;

  /* header: scrolled shadow + phone menu */
  var hd=document.querySelector('.hd');
  if(hd){var on=function(){hd.classList.toggle('is-scrolled',scrollY>10)};addEventListener('scroll',on,{passive:true});on()}
  var mb=document.querySelector('.menu-btn'),nav=document.getElementById('nav');
  if(mb&&nav){mb.addEventListener('click',function(){var o=nav.classList.toggle('is-open');mb.setAttribute('aria-expanded',o)});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&nav.classList.contains('is-open')){nav.classList.remove('is-open');mb.setAttribute('aria-expanded','false');mb.focus()}});
    nav.addEventListener('click',function(e){if(e.target.closest('a')){nav.classList.remove('is-open');mb.setAttribute('aria-expanded','false')}})}

  /* hero name letters */
  var hero=document.querySelector('.hero');
  if(hero){requestAnimationFrame(function(){requestAnimationFrame(function(){hero.classList.add('is-in')})})}

  /* kit 18: reveals */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;var said=el.textContent.trim().replace(/\s+/g,' ');
    var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')},parts=[];
    [].slice.call(el.childNodes).forEach(function(n){if(n.nodeType===3)n.textContent.split(/\s+/).forEach(function(w){if(w)parts.push(esc(w))});else if(n.nodeType===1&&n.tagName!=='BR')parts.push(n.outerHTML)});
    el.innerHTML=parts.map(function(h){return'<span class="k-rv-w">'+h+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.children,function(w){var t=w.getBoundingClientRect().top;if(top===null||Math.abs(t-top)>2){lines.push([]);top=t}lines[lines.length-1].push(w.innerHTML)});
    el.innerHTML='<span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">'+esc(said)+'</span>'+lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+l.join(' ')+'</span></span>'}).join('');
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
  if(FINE&&!RM)document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
    var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
  });

  /* property index: floating photo follows the cursor (desktop only) */
  var fl=document.querySelector('.idx__float');
  if(fl&&FINE&&!RM&&innerWidth>=900){
    var imgs={};[].forEach.call(fl.querySelectorAll('img'),function(i){imgs[i.getAttribute('data-k')]=i});
    var x=0,y=0,tx=0,ty=0,run=false;
    function loop(){x+=(tx-x)*.16;y+=(ty-y)*.16;fl.style.transform='translate3d('+(x+28).toFixed(1)+'px,'+(y-110).toFixed(1)+'px,0)';if(run)requestAnimationFrame(loop)}
    document.querySelectorAll('.idx a[data-img]').forEach(function(a){
      a.addEventListener('pointerenter',function(e){var k=a.getAttribute('data-img');for(var n in imgs)imgs[n].classList.toggle('is-on',n===k);
        if(!fl.classList.contains('is-on')){x=tx=e.clientX;y=ty=e.clientY}fl.classList.toggle('is-on',!!imgs[k]);if(!run){run=true;loop()}});
      a.addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY});
      a.addEventListener('pointerleave',function(){fl.classList.remove('is-on')});
    });
    var list=document.querySelector('.idx');if(list)list.addEventListener('pointerleave',function(){fl.classList.remove('is-on');run=false});
  }

  /* kit 05: sticky story */
  document.querySelectorAll('[data-k-story]').forEach(function(root){
    var steps=[].slice.call(root.querySelectorAll('[data-k-story-step]')),media=[].slice.call(root.querySelectorAll('[data-k-story-media]'));
    var box=root.querySelector('.k-story__media');
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var n=steps.indexOf(e.target);
      steps.forEach(function(s,k){s.classList.toggle('is-on',k===n)});media.forEach(function(m,k){m.classList.toggle('is-on',k===n)});
      if(box)box.style.setProperty('--k-story-p',((n+1)/steps.length).toFixed(3));})},{rootMargin:'-45% 0px -45% 0px'});
    steps.forEach(function(s){so.observe(s)});
  });

  /* kit 14: reviews */
  document.querySelectorAll('[data-k-quotes]').forEach(function(root){
    var tr=root.querySelector('.k-quotes__track'),sl=[].slice.call(root.querySelectorAll('.k-quotes__slide')),dots=root.querySelector('.k-quotes__dots'),cur=0,t,auto=+root.getAttribute('data-k-quotes-auto')||0,hold=false,vis=false;
    var rtl=getComputedStyle(tr).direction==='rtl',ar=/^ar/.test(document.documentElement.lang);
    if(!RM)sl.forEach(function(s){var q=s.querySelector('blockquote');var w=q.textContent.trim().split(/\s+/);q.setAttribute('aria-label',q.textContent.trim());q.innerHTML=w.map(function(x,i){return'<span class="k-w" aria-hidden="true" style="--w:'+i+'">'+x.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</span>'}).join(' ')});
    var db=sl.map(function(s,i){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label',(ar?'رأي ':'Review ')+(i+1));b.onclick=function(){go(i)};dots&&dots.appendChild(b);return b});
    function mark(i){cur=i;sl.forEach(function(s,k){s.classList.toggle('is-on',k===i)});db.forEach(function(b,k){b.setAttribute('aria-current',k===i)})}
    function go(i){i=(i+sl.length)%sl.length;tr.scrollTo({left:(rtl?-1:1)*sl[i].offsetWidth*i,behavior:RM?'auto':'smooth'});mark(i);sched()}
    var st;tr.addEventListener('scroll',function(){clearTimeout(st);st=setTimeout(function(){var i=Math.round(Math.abs(tr.scrollLeft)/tr.clientWidth);if(i!==cur)mark(i)},80)},{passive:true});
    var p=root.querySelector('[data-k-quotes-prev]'),n=root.querySelector('[data-k-quotes-next]');if(p)p.onclick=function(){go(cur-1)};if(n)n.onclick=function(){go(cur+1)};
    function sched(){clearTimeout(t);if(auto&&!RM&&!hold&&vis)t=setTimeout(function(){go(cur+1)},auto)}
    root.addEventListener('pointerenter',function(){hold=true;sched()});root.addEventListener('pointerleave',function(){hold=false;sched()});
    root.addEventListener('focusin',function(){hold=true;sched()});root.addEventListener('focusout',function(){hold=false;sched()});
    new IntersectionObserver(function(e){vis=e[0].isIntersecting;if(vis)sl[cur].classList.add('is-on');sched()},{threshold:.4}).observe(root);
    mark(0);sl[0].classList.remove('is-on');
  });

  /* kit 16: tap-to-load map */
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=m.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');if(btn)btn.remove()};m.appendChild(f)}
    if(btn)btn.addEventListener('click',load);
  });
})();
