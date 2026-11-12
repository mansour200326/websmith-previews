/* Heaven Beauty Center concept · motion layer (kit 04, 16, 18, 19, restyled) */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,
      DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches;

  /* header hairline once scrolled */
  var top=document.querySelector('.top');if(top){var sh=function(){document.documentElement.style.setProperty('--hh',top.offsetHeight+'px')};sh();addEventListener('resize',sh)}
  var head=document.querySelector('.head');
  if(head){var hs=function(){head.classList.toggle('is-stuck',scrollY>40)};addEventListener('scroll',hs,{passive:true});hs()}

  /* kit 04 · masked name opens into the photo */
  if(!RM){
    var masks=[].slice.call(document.querySelectorAll('[data-k-mask]'));
    if(masks.length){var tk=false;
      var upd=function(){tk=false;masks.forEach(function(el){var r=el.getBoundingClientRect(),d=el.offsetHeight-innerHeight;var p=d>0?Math.min(1,Math.max(0,-r.top/d)):0;el.style.setProperty('--p',p.toFixed(4));el.classList.toggle('is-open',p>.7)})};
      addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});addEventListener('resize',upd);upd();}
  }

  /* kit 16 · live open/closed in Dubai time */
  document.querySelectorAll('[data-k-hours]').forEach(function(b){
    var h={};try{h=JSON.parse(b.getAttribute('data-k-hours'))}catch(e){}
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    var s=h[day]||[],open=s.length===2&&now>=s[0]&&now<s[1];
    b.classList.add(open?'is-open':'is-shut');
    var t=b.querySelector('span');if(t)t.textContent=open?b.getAttribute('data-open'):b.getAttribute('data-shut');
    b.hidden=false;
  });

  /* kit 18 · reveals */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;var said=el.textContent.trim().replace(/\s+/g,' ');
    var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')},parts=[];
    [].slice.call(el.childNodes).forEach(function(n){if(n.nodeType===3)n.textContent.split(/\s+/).forEach(function(w){if(w)parts.push(esc(w))});else if(n.nodeType===1&&n.tagName!=='BR')parts.push(n.outerHTML)});
    el.innerHTML=parts.map(function(h){return'<span class="k-rv-w">'+h+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.children,function(w){var t=w.getBoundingClientRect().top;if(top===null||Math.abs(t-top)>2){lines.push([]);top=t}lines[lines.length-1].push(w.innerHTML)});
    el.innerHTML='<span class="vh">'+esc(said)+'</span>'+lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+l.join(' ')+'</span></span>'}).join('');
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

  /* kit 19 · magnetic main buttons */
  if(DESK&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }

  /* services page · category index follows the scroll */
  var idx=document.querySelector('[data-spy]');
  if(idx&&'IntersectionObserver' in window){
    var links=[].slice.call(idx.querySelectorAll('a[href^="#"]')),map={};
    links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var cur=null;
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){var a=map[e.target.id];if(a&&a!==cur){if(cur)cur.classList.remove('is-on');a.classList.add('is-on');cur=a;
      var ol=a.closest('ol');if(ol&&ol.scrollWidth>ol.clientWidth){var l=a.offsetLeft-ol.clientWidth/2+a.offsetWidth/2;ol.scrollTo({left:l,behavior:RM?'auto':'smooth'})}}}})},{rootMargin:'-30% 0px -60% 0px'});
    Object.keys(map).forEach(function(id){var s=document.getElementById(id);if(s)so.observe(s)});
    var first=links[0],firstSec=first&&document.getElementById(first.getAttribute('href').slice(1));
    var top0=function(){if(firstSec&&firstSec.getBoundingClientRect().top>innerHeight*.3){if(cur)cur.classList.remove('is-on');first.classList.add('is-on');cur=first}};
    addEventListener('scroll',top0,{passive:true});top0();
  }
})();
