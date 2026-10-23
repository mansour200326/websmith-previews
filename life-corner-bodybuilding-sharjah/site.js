/* Life Corner concept. Kit 18 (reveals), 19 (magnetic), 09 (drag strip), 16 (tap-to-load map) + the live timings. */
(function(){
  var AR=document.documentElement.lang==='ar';
  /* ---- live timings (Dubai time). Gym day runs 5am to 5am. 0=Sun ---- */
  function segs(d){return d===0?[[17,22,'s']]:[[5,9.5,'g'],[10,17,'l'],[17,26.5,'g']]}
  function fmt(x){x=x%24;var h=Math.floor(x),m=Math.round((x-h)*60),mm=m?':'+(m<10?'0':'')+m:'';
    if(AR){var p=h<5?'فجرًا':h<12?'صباحًا':h<16?'ظهرًا':'مساءً';var hh=h%12||12;return hh+mm+' '+p}
    return (h%12||12)+mm+(h<12?'am':'pm')}
  var W=AR?{g:'جلسة الرجال الآن',l:'وقت السيدات الآن',s:'مفتوح الآن (الأحد)',until:'حتى',shut:'مغلق الآن',next:'يفتح',gN:'للرجال',lN:'للسيدات',sN:'',at:'الساعة'}
         :{g:'Gents session on now',l:'Ladies hours on now',s:'Open now (Sunday)',until:'until',shut:'Closed now',next:'opens',gN:'for gents',lN:'for ladies',sN:'',at:'at'};
  var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
  var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
  var wd=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),h=(+g('hour')%24)+(+g('minute'))/60;
  var cur=null;
  segs(wd).forEach(function(s){if(h>=s[0]&&h<s[1])cur=s});
  segs((wd+6)%7).forEach(function(s){if(h+24>=s[0]&&h+24<s[1])cur=s});
  var msg,open=!!cur;
  if(cur){msg=W[cur[2]]+' · '+W.until+' '+fmt(cur[1])}
  else{var nx=null;for(var k=0;k<2&&!nx;k++){segs((wd+k)%7).forEach(function(s){if(!nx&&(k>0||s[0]>h))nx=s})}
    msg=W.shut+(nx?' · '+W.next+' '+(W[nx[2]+'N']?W[nx[2]+'N']+' ':'')+W.at+' '+fmt(nx[0]):'')}
  document.querySelectorAll('[data-now]').forEach(function(el){el.classList.add(open?'is-open':'is-shut');var t=el.querySelector('span');if(t)t.textContent=msg;el.hidden=false});
  var gymDay=h<5?(wd+6)%7:wd;
  document.querySelectorAll('.week__row[data-day="'+gymDay+'"]').forEach(function(r){r.classList.add('is-today');var n=r.querySelector('.needle');if(n){n.style.setProperty('--n',((h-5+24)%24).toFixed(2));n.setAttribute('data-label',AR?'الآن':'now')}});

  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* ---- kit 18: reveals ---- */
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
  if(!RM){var ready=function(){lineEls.forEach(split)};if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ready);else ready();
    var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;lineEls.forEach(function(e){var on=e.classList.contains('is-in');split(e);if(on)e.classList.add('is-in')})}});}
  var els=document.querySelectorAll('[data-reveal],.week');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')})}
  else{var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:0});
    els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});}

  /* ---- kit 19: magnetic ---- */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''})});
    /* training index: photo follows the pointer */
    var peek=document.querySelector('.idx__peek');
    if(peek){var pi=peek.querySelector('img');
      document.querySelectorAll('.idx li a[data-img]').forEach(function(a){
        a.addEventListener('pointerenter',function(){pi.src=a.getAttribute('data-img');peek.classList.add('on')});
        a.addEventListener('pointerleave',function(){peek.classList.remove('on')});
        a.addEventListener('pointermove',function(e){peek.style.left=e.clientX+'px';peek.style.top=e.clientY+'px'})})}
  }

  /* ---- kit 09: drag strip ---- */
  document.querySelectorAll('[data-k-drag]').forEach(function(root){
    var tr=root.querySelector('.k-drag__track'),bar=root.querySelector('.k-drag__bar'),prev=root.querySelector('[data-k-drag-prev]'),next=root.querySelector('[data-k-drag-next]');
    var rtl=getComputedStyle(tr).direction==='rtl';
    if('IntersectionObserver' in window)new IntersectionObserver(function(e,o){if(e[0].isIntersecting){root.classList.add('is-in');o.disconnect()}},{threshold:.15}).observe(root);else root.classList.add('is-in');
    function pos(){return Math.abs(tr.scrollLeft)}
    function upd(){var max=tr.scrollWidth-tr.clientWidth,p=max>0?pos()/max:1;
      if(bar)bar.style.setProperty('--k-prog',Math.max(.08,Math.min(1,p*.92+.08)));
      if(prev)prev.disabled=pos()<4;if(next)next.disabled=pos()>max-4;
      if(!RM)tr.querySelectorAll('.k-drag__card').forEach(function(c){var r=c.getBoundingClientRect(),cx=(r.left+r.width/2)/innerWidth-.5;c.style.setProperty('--k-px',(cx*-6).toFixed(2)+'%')});}
    tr.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});addEventListener('resize',upd);upd();
    function step(d){var c=tr.querySelector('.k-drag__card');var w=c?c.getBoundingClientRect().width+20:400;tr.scrollBy({left:d*w*(rtl?-1:1),behavior:RM?'auto':'smooth'})}
    if(prev)prev.onclick=function(){step(-1)};if(next)next.onclick=function(){step(1)};
    var down=false,x0=0,s0=0,v=0,lx=0,lt=0,moved=0,raf;
    tr.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=0;x0=lx=e.clientX;s0=tr.scrollLeft;lt=performance.now();v=0;cancelAnimationFrame(raf)});
    addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-x0;if(Math.abs(dx)>4)tr.classList.add('is-drag');moved=Math.max(moved,Math.abs(dx));tr.scrollLeft=s0-dx;var t=performance.now();v=(e.clientX-lx)/Math.max(1,t-lt);lx=e.clientX;lt=t});
    addEventListener('pointerup',function(){if(!down)return;down=false;if(RM||Math.abs(v)<.05){tr.classList.remove('is-drag');return}
      var vel=v*16;(function glide(){tr.scrollLeft-=vel;vel*=.93;if(Math.abs(vel)>.5)raf=requestAnimationFrame(glide);else tr.classList.remove('is-drag')})()});
    tr.addEventListener('click',function(e){if(moved>6){e.preventDefault();e.stopPropagation()}},true);
  });

  /* ---- kit 16: map loads on tap ---- */
  document.querySelectorAll('[data-k-map]').forEach(function(m){var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=AR?'خريطة الموقع':'Map to Life Corner';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');if(btn)btn.remove()};m.appendChild(f)}
    if(btn)btn.addEventListener('click',load)});
})();
