/* Websmith kit: sections 11, 14, 16, 18, 19 only */

/* 11-services-accordion.html */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
  document.querySelectorAll('[data-k-acc]').forEach(function(root){
    var rows=[].slice.call(root.querySelectorAll('.k-acc__row'));
    // smooth open/close
    rows.forEach(function(d){var s=d.querySelector('summary'),b=d.querySelector('.k-acc__body');
      s.addEventListener('click',function(e){if(RM||!b.animate)return;e.preventDefault();
        if(d.open){var h=b.offsetHeight;b.animate({height:[h+'px','0px'],opacity:[1,0]},{duration:380,easing:'cubic-bezier(.16,1,.3,1)'}).onfinish=function(){d.open=false};}
        else{d.open=true;var h2=b.offsetHeight;b.animate({height:['0px',h2+'px'],opacity:[0,1]},{duration:520,easing:'cubic-bezier(.16,1,.3,1)'});}});});
    if(!FINE||RM)return;
    var fl=document.createElement('div');fl.className='k-acc__float';fl.setAttribute('aria-hidden','true');document.body.appendChild(fl);
    var imgs={};rows.forEach(function(d){var u=d.getAttribute('data-img');if(!u)return;var i=new Image();i.src=u;i.alt='';i.decoding='async';fl.appendChild(i);imgs[u]=i});
    var tx=0,ty=0,x=0,y=0,run=false,rtl=getComputedStyle(root).direction==='rtl';
    function loop(){x+=(tx-x)*.14;y+=(ty-y)*.14;fl.style.setProperty('--fx',x+'px');fl.style.setProperty('--fy',y+'px');if(run)requestAnimationFrame(loop)}
    root.addEventListener('pointermove',function(e){var w=fl.offsetWidth,h=fl.offsetHeight;tx=rtl?e.clientX-w-40:e.clientX+40;ty=e.clientY-h/2;
      if(tx+w>innerWidth)tx=e.clientX-w-40;if(tx<0)tx=e.clientX+40;});
    rows.forEach(function(d){var s=d.querySelector('summary'),u=d.getAttribute('data-img');if(!u)return;
      s.addEventListener('pointerenter',function(){for(var k in imgs)imgs[k].classList.toggle('is-on',k===u);fl.classList.add('is-on');if(!run){run=true;x=tx;y=ty;loop()}});
      s.addEventListener('pointerleave',function(){fl.classList.remove('is-on');run=false});});
  });
})();

/* 14-testimonial-carousel.html */
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

/* 16-map-hours.html */
(function(){
  document.querySelectorAll('[data-k-hours]').forEach(function(root){
    var h={};try{h=JSON.parse(root.getAttribute('data-k-hours'))}catch(e){}
    var tz=root.getAttribute('data-k-tz')||'Asia/Dubai';
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:tz,weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    var row=root.querySelector('tr[data-day="'+day+'"]');if(row)row.classList.add('is-today');
    var span=h[day]||[],open=span.length===2&&now>=span[0]&&now<span[1];
    var b=root.querySelector('[data-k-badge]');if(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');b.querySelector('span').textContent=open?(root.getAttribute('data-k-open')||'Open now'):(root.getAttribute('data-k-shut')||'Closed now')}
  });
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title='Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');if(btn)btn.remove()};m.appendChild(f)}
    if(btn)btn.addEventListener('click',load);
    // desktop: load automatically when near; phones: wait for tap (data + scroll-trap)
    if(!m.hasAttribute('data-k-map-tap')&&matchMedia('(min-width:900px)').matches)new IntersectionObserver(function(e,o){if(e[0].isIntersecting){o.disconnect();load()}},{rootMargin:'200px'}).observe(m);
  });
})();

/* 18-reveal-utilities.html */
(function(){
  var d=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches,DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches;
  // stagger
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  // split lines (by measuring word tops)
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

/* 19-magnetic-micro.html */
(function(){
  if(!matchMedia('(hover:hover) and (pointer:fine)').matches||matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
    var k=parseFloat(el.getAttribute('data-k-magnetic'))||.35;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();var x=(e.clientX-r.left-r.width/2)*k,y=(e.clientY-r.top-r.height/2)*k;el.classList.add('is-mag');el.style.transform='translate3d('+x.toFixed(1)+'px,'+y.toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
  });
})();
/* ===== Brilliant Mechanical Workshop concept: own scripts (kit above) ===== */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Open now / closed now, Cape Town time. Mon–Fri 08:00–17:00, weekends closed (from their Contact page).
  var HOURS={1:[8,17],2:[8,17],3:[8,17],4:[8,17],5:[8,17]};
  var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Africa/Johannesburg',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
  var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
  var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
  var span=HOURS[day]||[],open=span.length===2&&now>=span[0]&&now<span[1];
  var nxt=(function(){if(span.length&&now<span[0])return 'today 08:00';for(var i=1;i<8;i++){var d=(day+i)%7;if(HOURS[d])return(i===1?'tomorrow':['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][d])+' 08:00'}})();
  document.querySelectorAll('[data-open]').forEach(function(el){
    el.hidden=false;el.classList.add(open?'is-open':'is-shut');
    el.querySelector('span').textContent=open?'Open now, until 17:00':'Closed now, opens '+nxt;
  });

  // Gear outline turns as you scroll (scroll-linked, stops when you stop).
  var gears=[].slice.call(document.querySelectorAll('[data-gear]'));
  if(gears.length&&!RM){
    var tick=false;
    var upd=function(){tick=false;var y=scrollY;gears.forEach(function(gm){gm.style.setProperty('--rot',(y*+(gm.getAttribute('data-gear')||.06))+'deg')})};
    addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});upd();
  }

  // Job card: builds an email to the workshop with the same details their Service Request form asked for.
  var card=document.querySelector('[data-jobcard]');
  if(card){
    var send=card.querySelector('[data-send]'),to=card.getAttribute('data-to');
    var val=function(n){var e=card.querySelector('[name="'+n+'"]');return e?e.value.trim():''};
    var build=function(){
      var work=[].map.call(card.querySelectorAll('input[name="work"]:checked'),function(c){return c.value}).join(', ');
      var make=val('make'),model=val('model'),year=val('year');
      var car=[make,model].filter(Boolean).join(' ')+(year?' ('+year+')':'');
      var subj='Service request'+(car?': '+car:'');
      var body=['Hi Brilliant Mechanical Workshop,','','I would like to book my car in.','',
        'Vehicle: '+(make||'-'),'Model: '+(model||'-'),'Year: '+(year||'-'),'VIN No: '+(val('vin')||'-'),
        'What I am looking for: '+(work||'-'),'Special instructions: '+(val('notes')||'-'),'',
        'Name: '+(val('name')||'-'),'Phone: '+(val('phone')||'-'),'','Thank you'].join('\n');
      send.href='mailto:'+to+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(body);
    };
    card.addEventListener('input',build);card.addEventListener('change',build);build();
    // makes and services elsewhere on the page preset the card
    document.querySelectorAll('[data-make],[data-work]').forEach(function(a){
      a.addEventListener('click',function(){
        var m=a.getAttribute('data-make'),w=a.getAttribute('data-work');
        if(m){var s=card.querySelector('[name="make"]');if(s){[].forEach.call(s.options,function(o){if(o.value===m)s.value=m})}}
        if(w){var c=card.querySelector('input[name="work"][value="'+w+'"]');if(c)c.checked=true}
        build();
      });
    });
  }

  // Route sketch draws itself when it comes into view; the Google map replaces it on tap.
  var rt=document.querySelector('[data-route]');
  if(rt&&'IntersectionObserver' in window){new IntersectionObserver(function(e,o){if(e[0].isIntersecting){rt.classList.add('is-in');o.disconnect()}},{threshold:.35}).observe(rt)}else if(rt)rt.classList.add('is-in');
  var mp=document.querySelector('.k-visit__map');
  if(mp){var mb=mp.querySelector('button');if(mb)mb.addEventListener('click',function(){mp.classList.add('has-map')})}

  // Services page index: mark the section in view.
  var idx=document.querySelectorAll('.sv__idx a');
  if(idx.length&&'IntersectionObserver' in window){
    var map={};idx.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;idx.forEach(function(a){a.classList.remove('is-on')});var a=map[e.target.id];if(a)a.classList.add('is-on')})},{rootMargin:'-40% 0px -55% 0px'});
    document.querySelectorAll('.sv__item[id]').forEach(function(s){io.observe(s)});
  }
})();
