/* Van Zeilen Family Chiropractic concept. Kit 18 (reveals), 19 (micro), 14 (reviews), 21 (FAQ) + site code below. */
(function(){
  var d=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches;
  // stagger
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  // split lines (by measuring word tops)
  function split(el){
    // keeps inline child elements (e.g. <span class="ar" lang="ar">, <em>) whole, with their class/lang/style
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;var said=el.textContent.trim().replace(/\s+/g,' ');
    var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')},parts=[];
    [].slice.call(el.childNodes).forEach(function(n){if(n.nodeType===3)n.textContent.split(/\s+/).forEach(function(w){if(w)parts.push(esc(w))});else if(n.nodeType===1&&n.tagName!=='BR')parts.push(n.outerHTML)});
    el.innerHTML=parts.map(function(h){return'<span class="k-rv-w">'+h+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.children,function(w){var t=w.getBoundingClientRect().top;if(top===null||Math.abs(t-top)>2){lines.push([]);top=t}lines[lines.length-1].push(w.innerHTML)});
    // screen readers get the text once from a visually hidden copy (aria-label isn't allowed on spans)
    el.innerHTML='<span style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0);white-space:nowrap">'+esc(said)+'</span>'+lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+l.join(' ')+'</span></span>'}).join('');
    el.classList.add('k-rv-ready');
  }
  var lineEls=[].slice.call(document.querySelectorAll('[data-reveal=lines]'));
  if(!RM){
    var ready=function(){lineEls.forEach(split)};
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ready);else ready();
    var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;lineEls.forEach(function(e){var on=e.classList.contains('is-in');split(e);if(on)e.classList.add('is-in')})}});
  }
  // observe
  var els=document.querySelectorAll('[data-reveal]');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')});return}
  // clip reveals are fully clipped (zero visible area), which IntersectionObserver never reports, so watch their parent
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:0});
  els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
  // parallax
  var px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(DESK&&px.length){var tk=false;function upd(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var c=(r.top+r.height/2-vh/2);e.style.transform='translate3d(0,'+(c*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0)'})}
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();}
  // Lenis (opt-in)
  if(DESK&&d.hasAttribute('data-lenis')){var s=document.createElement('script');s.src='https://cdn.jsdelivr.net/npm/lenis@1.3.4/dist/lenis.min.js';s.async=true;
    s.onload=function(){if(!window.Lenis)return;var l=new Lenis({lerp:.11,smoothWheel:true});window.kLenis=l;(function raf(t){l.raf(t);requestAnimationFrame(raf)})(performance.now());
      document.addEventListener('click',function(e){var a=e.target.closest('a[href^="#"]');if(!a||a.getAttribute('href').length<2)return;var t=document.querySelector(a.getAttribute('href'));if(t){e.preventDefault();l.scrollTo(t,{offset:-70})}})};
    document.head.appendChild(s);}
})();
(function(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
    var k=parseFloat(el.getAttribute('data-k-magnetic'))||.35;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();var x=(e.clientX-r.left-r.width/2)*k,y=(e.clientY-r.top-r.height/2)*k;el.classList.add('is-mag');el.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
  });
})();
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.querySelectorAll('[data-k-quotes]').forEach(function(root){
    var tr=root.querySelector('.k-quotes__track'),sl=[].slice.call(root.querySelectorAll('.k-quotes__slide')),dots=root.querySelector('.k-quotes__dots'),cur=0,t,auto=+root.getAttribute('data-k-quotes-auto')||0,hold=false,vis=false;
    var rtl=getComputedStyle(tr).direction==='rtl',ar=/^ar/.test(document.documentElement.lang);
    // keyboard + screen-reader basics even on older markup: the track scrolls, so it must take focus; dots are a group, not tabs
    if(!tr.hasAttribute('tabindex')){tr.tabIndex=0;tr.setAttribute('role','region');tr.setAttribute('aria-label',ar?'آراء العملاء':'Customer reviews')}
    if(dots){dots.setAttribute('role','group');dots.hasAttribute('aria-label')||dots.setAttribute('aria-label',ar?'اختر رأياً':'Choose a review')}
    // split words for the reveal (text stays readable to screen readers)
    if(!RM)sl.forEach(function(s){var q=s.querySelector('blockquote');var w=q.textContent.trim().split(/\s+/);q.setAttribute('aria-label',q.textContent.trim());q.innerHTML=w.map(function(x,i){return'<span class="k-w" aria-hidden="true" style="--w:'+i+'">'+x.replace(/</g,'&lt;')+'</span>'}).join(' ')});
    var db=sl.map(function(s,i){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Review '+(i+1));b.onclick=function(){go(i)};dots&&dots.appendChild(b);return b});
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
})();
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,E='cubic-bezier(.16,1,.3,1)';
  document.querySelectorAll('[data-k-faq]').forEach(function(list){
    var qs=[].slice.call(list.querySelectorAll('.k-faq__q')),single=list.hasAttribute('data-k-faq-single');
    function close(d){var b=d.querySelector('.k-faq__a');if(RM||!b.animate){d.open=false;return}
      b.animate({height:[b.offsetHeight+'px','0px'],opacity:[1,0]},{duration:340,easing:E}).onfinish=function(){d.open=false}}
    qs.forEach(function(d){d.querySelector('summary').addEventListener('click',function(e){e.preventDefault();
      if(d.open){close(d);return}
      if(single)qs.forEach(function(o){if(o!==d&&o.open)close(o)});
      d.open=true;var b=d.querySelector('.k-faq__a');
      if(!RM&&b.animate)b.animate({height:['0px',b.offsetHeight+'px'],opacity:[0,1]},{duration:480,easing:E});});});
    // fill an empty FAQPage schema block from the visible Q&As
    var sc=(list.closest('section')||document).querySelector('script[data-k-faq-schema]');
    if(sc&&!sc.textContent.trim())sc.textContent=JSON.stringify({"@context":"https://schema.org","@type":"FAQPage",mainEntity:qs.map(function(d){
      var s=d.querySelector('summary').cloneNode(true);[].forEach.call(s.querySelectorAll('[aria-hidden]'),function(x){x.remove()});
      return {"@type":"Question",name:s.textContent.trim(),acceptedAnswer:{"@type":"Answer",text:d.querySelector('.k-faq__a').textContent.trim()}}})});
  });
})();

/* ---- site: header turns solid after the hero ---- */
(function(){
  var hd=document.querySelector('.hd');if(!hd||hd.classList.contains('hd--light'))return;
  function f(){hd.classList.toggle('is-solid',scrollY>innerHeight*.6)}
  addEventListener('scroll',f,{passive:true});f();
})();

/* ---- site: live open/closed in Rochester time; days can have a lunch break ([[8,12.5],[14.5,18]]) ---- */
(function(){
  document.querySelectorAll('[data-hours]').forEach(function(root){
    var h={};try{h=JSON.parse(root.getAttribute('data-hours'))}catch(e){}
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/New_York',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    var row=root.querySelector('tr[data-day="'+day+'"]');if(row)row.classList.add('is-today');
    var spans=h[day]||[],open=spans.some(function(s){return now>=s[0]&&now<s[1]});
    var next=spans.filter(function(s){return s[0]>now})[0];
    var fmt=function(x){var hr=Math.floor(x),m=Math.round((x-hr)*60),ap=hr>=12?'pm':'am';hr=hr%12||12;return hr+(m?':'+(m<10?'0':'')+m:'')+ap};
    root.querySelectorAll('[data-badge]').forEach(function(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');
      b.querySelector('span').textContent=open?'Open now, until '+fmt(spans.filter(function(s){return now>=s[0]&&now<s[1]})[0][1]):(next?'Closed now, back at '+fmt(next[0])+' today':'Closed now')});
  });
  document.querySelectorAll('[data-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title='Map: 1367 Ridge Road West, Rochester';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on')};m.appendChild(f);if(btn)btn.remove()}
    if(btn)btn.addEventListener('click',load);
  });
})();

/* ---- site: first-visit story; the spine fills one section per step (kit 05 pattern) ---- */
(function(){
  var root=document.querySelector('[data-story]');if(!root)return;
  var steps=[].slice.call(root.querySelectorAll('[data-step]')),vs=[].slice.call(root.querySelectorAll('.spine .v'));
  function set(n){steps.forEach(function(s,k){s.classList.toggle('is-on',k===n)});
    var upto=Math.round(vs.length*(n+1)/steps.length);
    vs.forEach(function(v,i){v.style.setProperty('--d',Math.max(0,i-(upto-7)));v.classList.toggle('on',i<upto)});var cap=root.querySelector('[data-spine-cap]');if(cap)cap.textContent='Step '+(n+1)+' of '+steps.length}
  if(!('IntersectionObserver' in window)){set(steps.length-1);return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)set(steps.indexOf(e.target))})},{rootMargin:'-45% 0px -45% 0px'});
  steps.forEach(function(s){io.observe(s)});set(0);
})();
