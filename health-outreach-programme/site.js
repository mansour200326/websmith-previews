/* Health Outreach Programme concept, Websmith. Parts from kit 06, 11, 18, 19, 21 (adapted). */
(function(){
  var d=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
  var E='cubic-bezier(.16,1,.3,1)';

  /* header: border on scroll, phone menu */
  var hd=document.querySelector('.hd');
  if(hd){var onS=function(){hd.classList.toggle('is-scrolled',scrollY>8)};addEventListener('scroll',onS,{passive:true});onS();}
  var mb=document.querySelector('.menu-btn'),nav=document.getElementById('nav');
  if(mb&&nav){mb.addEventListener('click',function(){var o=nav.classList.toggle('is-open');mb.setAttribute('aria-expanded',o);mb.textContent=o?'Close':'Menu'});
    nav.addEventListener('click',function(e){if(e.target.closest('a')){nav.classList.remove('is-open');mb.setAttribute('aria-expanded','false');mb.textContent='Menu'}});}

  /* kit 18: reveals + line split */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;el.setAttribute('aria-label',el.textContent.trim().replace(/\s+/g,' '));
    var words=el.textContent.trim().split(/\s+/);el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+esc(w)+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.querySelectorAll('.k-rv-w'),function(w){var t=w.offsetTop;if(t!==top){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
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
  var els=document.querySelectorAll('[data-reveal],.sketch');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0});
    els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
  }

  /* scroll-lit paragraph (after Atomic Health): words go from grey to ink as it passes the middle of the screen */
  document.querySelectorAll('[data-lit]').forEach(function(p){
    if(RM)return;
    var html=p.innerHTML;
    // wrap words, keeping <em> wrappers
    var tmp=document.createElement('div');tmp.innerHTML=html;
    (function walk(n){[].slice.call(n.childNodes).forEach(function(c){
      if(c.nodeType===3){var f=document.createDocumentFragment();c.textContent.split(/(\s+)/).forEach(function(w){if(!w)return;if(/^\s+$/.test(w)){f.appendChild(document.createTextNode(w))}else{var s=document.createElement('span');s.className='w';s.textContent=w;f.appendChild(s)}});n.replaceChild(f,c)}
      else if(c.nodeType===1)walk(c)})})(tmp);
    p.innerHTML=tmp.innerHTML;p.classList.add('is-lit');
    var ws=[].slice.call(p.querySelectorAll('.w')),tk=false;
    function upd(){tk=false;var r=p.getBoundingClientRect(),vh=innerHeight;var k=(vh*.78-r.top)/(r.height+vh*.25);k=Math.max(0,Math.min(1,k));var n=Math.round(k*ws.length);ws.forEach(function(w,i){w.classList.toggle('on',i<n)})}
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});addEventListener('resize',upd);upd();
  });

  /* kit 06: counters */
  var cnt=document.querySelectorAll('[data-k-count]');
  if(cnt.length&&!RM){
    var fmt=function(el,v,dec){return v.toLocaleString('en-SG',{minimumFractionDigits:dec,maximumFractionDigits:dec,useGrouping:!el.hasAttribute('data-k-count-plain')})};
    var cio=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;cio.unobserve(e.target);var el=e.target,to=parseFloat(el.getAttribute('data-k-count')),from=parseFloat(el.getAttribute('data-k-count-from')||0),dec=+el.getAttribute('data-k-count-dec')||0,t0=performance.now();
      (function f(t){var k=Math.min(1,(t-t0)/1700),q=1-Math.pow(1-k,4);el.textContent=fmt(el,from+(to-from)*q,dec);if(k<1)requestAnimationFrame(f)})(t0)})},{threshold:.5});
    cnt.forEach(function(el){el.style.minWidth=el.offsetWidth+'px';el.style.display='inline-block';el.textContent=fmt(el,parseFloat(el.getAttribute('data-k-count-from')||0),+el.getAttribute('data-k-count-dec')||0);cio.observe(el)});
  }

  /* kit 11 + 21: smooth details */
  function smooth(d,bodySel,group){
    var s=d.querySelector('summary'),b=d.querySelector(bodySel);
    function close(x){var bb=x.querySelector(bodySel);if(RM||!bb.animate){x.open=false;return}bb.animate({height:[bb.offsetHeight+'px','0px'],opacity:[1,0]},{duration:360,easing:E}).onfinish=function(){x.open=false}}
    s.addEventListener('click',function(e){if(RM||!b.animate)return;e.preventDefault();
      if(d.open){close(d);return}
      if(group)group.forEach(function(o){if(o!==d&&o.open)close(o)});
      d.open=true;var h=b.offsetHeight;b.animate({height:['0px',h+'px'],opacity:[0,1]},{duration:520,easing:E})});
  }
  document.querySelectorAll('.acc__row').forEach(function(d){smooth(d,'.acc__body')});
  document.querySelectorAll('[data-k-faq]').forEach(function(l){var qs=[].slice.call(l.querySelectorAll('.k-faq__q'));qs.forEach(function(d){smooth(d,'.k-faq__a',l.hasAttribute('data-k-faq-single')?qs:null)})});

  /* kit 19: magnetic */
  if(FINE&&!RM)document.querySelectorAll('[data-k-magnetic]').forEach(function(el){var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''})});

  /* open now: Singapore time, several spans per day (the clinic closes for lunch) */
  var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Singapore',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
  var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
  var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
  document.querySelectorAll('[data-hours]').forEach(function(root){
    var h={};try{h=JSON.parse(root.getAttribute('data-hours'))}catch(e){}
    var spans=h[day]||[],open=spans.some(function(s){return now>=s[0]&&now<s[1]});
    var lunch=!open&&spans.length>1&&now>=spans[0][1]&&now<spans[spans.length-1][0];
    root.querySelectorAll('tr[data-day]').forEach(function(r){if((','+r.getAttribute('data-day')+',').indexOf(','+day+',')>-1)r.classList.add('is-today')});
    var b=root.querySelector('.badge');if(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');b.querySelector('span').textContent=open?'Open now':lunch?'Lunch break, back at 1.30pm':'Closed now'}
  });

  /* services page (mobile): drop the right-edge fade once the index row is scrolled to its end */
  document.querySelectorAll('.toc ol').forEach(function(ol){var f=function(){ol.classList.toggle('is-end',ol.scrollLeft+ol.clientWidth>=ol.scrollWidth-4)};ol.addEventListener('scroll',f,{passive:true});addEventListener('resize',f);f()});

  /* services page: highlight the section in view */
  var toc=[].slice.call(document.querySelectorAll('.toc a'));
  if(toc.length&&'IntersectionObserver' in window){var map={};toc.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var tio=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){toc.forEach(function(a){a.classList.remove('is-on')});var a=map[e.target.id];if(a)a.classList.add('is-on')}})},{rootMargin:'-40% 0px -55% 0px'});
    Object.keys(map).forEach(function(id){var s=document.getElementById(id);if(s)tio.observe(s)});}
})();
