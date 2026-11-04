/* Blue Feather concept: kit 05 (sticky story), 07 (marquee), 18 (reveals), 19 (magnetic) + header state */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var f=function(){hd.classList.toggle('is-scrolled',scrollY>8)};addEventListener('scroll',f,{passive:true});f();}
})();
/* kit 05 */
(function(){
  document.querySelectorAll('[data-k-story]').forEach(function(root){
    var steps=[].slice.call(root.querySelectorAll('[data-k-story-step]')),media=[].slice.call(root.querySelectorAll('[data-k-story-media]'));
    var box=root.querySelector('.k-story__media');
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;var n=steps.indexOf(e.target);
      steps.forEach(function(s,k){s.classList.toggle('is-on',k===n)});media.forEach(function(m,k){m.classList.toggle('is-on',k===n)});
      if(box)box.style.setProperty('--k-story-p',((n+1)/steps.length).toFixed(3));})},{rootMargin:'-45% 0px -45% 0px'});
    steps.forEach(function(s){io.observe(s)});
  });
})();
/* kit 07 */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-k-marquee]').forEach(function(m){
    var tr=m.querySelector('.k-marquee__track');if(!tr||m.dataset.kReady)return;m.dataset.kReady=1;
    m.style.setProperty('--k-mq-s',(+m.getAttribute('data-k-marquee-speed')||40)+'s');
    if(RM)return;
    var c=tr.cloneNode(true);c.setAttribute('aria-hidden','true');c.setAttribute('inert','');c.querySelectorAll('a,button').forEach(function(a){a.tabIndex=-1});m.appendChild(c);
    new IntersectionObserver(function(e){m.classList.toggle('is-off',!e[0].isIntersecting)}).observe(m);
  });
})();
/* kit 18 */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches;
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;el.setAttribute('aria-label',el.textContent.trim());
    var words=el.textContent.trim().split(/\s+/);el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+w.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</span>'}).join(' ');
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
  if(DESK&&px.length){var tk=false;var upd=function(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var c=(r.top+r.height/2-vh/2);e.style.transform='translate3d(0,'+(c*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})};
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();}
})();
/* kit 19 */
(function(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
    var k=parseFloat(el.getAttribute('data-k-magnetic'))||.35;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();var x=(e.clientX-r.left-r.width/2)*k,y=(e.clientY-r.top-r.height/2)*k;el.classList.add('is-mag');el.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
  });
})();
