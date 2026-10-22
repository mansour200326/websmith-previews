/* Hair Garage concept · Websmith. Kit 07, 16 (hours/map, Tucson time), 18, 19, 25 + the storefront hero. */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* hero entrance: words slide out from behind the pole once fonts are in */
  var front=document.querySelector('.front');
  if(front){var go=function(){requestAnimationFrame(function(){front.classList.add('is-up')})};
    if(RM)go();else if(document.fonts&&document.fonts.ready){Promise.race([document.fonts.ready,new Promise(function(r){setTimeout(r,900)})]).then(go)}else go();}

  /* the pole bands travel with the scroll (no loop) */
  var poles=[].slice.call(document.querySelectorAll('.pole'));
  if(poles.length&&!RM){var tk=false;function pu(){tk=false;var y=(scrollY*.45).toFixed(1)+'px';poles.forEach(function(p){p.style.setProperty('--py',y)})}
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(pu)}},{passive:true});}

  /* mobile menu */
  var mb=document.querySelector('.menu-btn'),mn=document.getElementById('mnav');
  if(mb&&mn)mb.addEventListener('click',function(){var o=mn.hidden;mn.hidden=!o;mb.setAttribute('aria-expanded',o?'true':'false');mb.textContent=o?'Close':'Menu'});

  /* hours: Tucson (America/Phoenix, no DST). 0=Sun */
  var H={0:[10,17],1:[9,14],2:[9,18],3:[9,18],4:[9,14],5:[9,18],6:[9,18]};
  var fmt=function(h){var p=h>=12?'pm':'am',x=h%12||12;return x+p};
  try{
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Phoenix',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    var sp=H[day],open=sp&&now>=sp[0]&&now<sp[1],txt;
    if(open)txt='Open now in Tucson, until '+fmt(sp[1]);
    else{var nd=day,nh;if(sp&&now<sp[0]){nh=sp[0];txt='Closed now. Opens today at '+fmt(nh)}else{nd=(day+1)%7;txt='Closed now. Opens '+(['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][nd])+' at '+fmt(H[nd][0])}}
    document.querySelectorAll('[data-badge]').forEach(function(b){b.hidden=false;b.classList.toggle('is-shut',!open);b.querySelector('span').textContent=txt});
    document.querySelectorAll('tr[data-day="'+day+'"]').forEach(function(r){r.classList.add('is-today')});
  }catch(e){}

  /* map: real OSM poster first, live map on tap */
  document.querySelectorAll('[data-map]').forEach(function(m){var b=m.querySelector('.map__go');if(!b)return;
    b.addEventListener('click',function(){var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title='Map: Hair Garage, 7069 East 22nd Street, Tucson';f.loading='lazy';m.appendChild(f);b.remove()})});

  /* kit 07 marquee */
  document.querySelectorAll('[data-k-marquee]').forEach(function(m){
    var tr=m.querySelector('.k-marquee__track');if(!tr||m.dataset.kReady)return;m.dataset.kReady=1;
    m.style.setProperty('--k-mq-s',(+m.getAttribute('data-k-marquee-speed')||40)+'s');if(RM)return;
    var c=tr.cloneNode(true);c.setAttribute('aria-hidden','true');c.setAttribute('inert','');m.appendChild(c);
    new IntersectionObserver(function(e){m.classList.toggle('is-off',!e[0].isIntersecting)}).observe(m);
  });

  /* kit 19 magnetic */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});});
  }

  /* kit 25 halftone (one image, about page) */
  document.querySelectorAll('[data-k-fx]').forEach(function(fig){
    var img=fig.querySelector('img');if(!img)return;
    function rgb(h){h=h.replace('#','');var v=parseInt(h,16);return[v>>16&255,v>>8&255,v&255]}
    function render(){var W=fig.clientWidth,Hh=fig.clientHeight;if(!W||!Hh||!img.naturalWidth)return;
      var cell=+fig.getAttribute('data-k-fx-cell')||7;cell=Math.min(cell,Math.max(4,W/110));
      var k=+fig.getAttribute('data-k-fx-contrast')||1.25,ink=fig.getAttribute('data-k-fx-ink')||'#141a2e',paper=fig.getAttribute('data-k-fx-paper')||'#ffffff';
      var cols=Math.ceil(W/cell),rows=Math.ceil(Hh/cell),s=document.createElement('canvas');s.width=cols;s.height=rows;
      var sx=s.getContext('2d',{willReadFrequently:true});var sc=Math.max(cols/img.naturalWidth,rows/img.naturalHeight),dw=img.naturalWidth*sc,dh=img.naturalHeight*sc;sx.drawImage(img,(cols-dw)/2,(rows-dh)/2,dw,dh);
      var d;try{d=sx.getImageData(0,0,cols,rows).data}catch(e){return}
      var cv=fig.querySelector('canvas')||fig.appendChild(document.createElement('canvas'));cv.setAttribute('aria-hidden','true');
      var dpr=Math.min(devicePixelRatio||1,2);cv.width=Math.round(W*dpr);cv.height=Math.round(Hh*dpr);
      var c2=cv.getContext('2d');c2.scale(dpr,dpr);c2.fillStyle=paper;c2.fillRect(0,0,W,Hh);c2.fillStyle=ink;c2.beginPath();
      for(var y=0;y<rows;y++)for(var x=0;x<cols;x++){var i=y*cols+x,l=(.2126*d[i*4]+.7152*d[i*4+1]+.0722*d[i*4+2])/255;l=Math.min(1,Math.max(0,(l-.5)*k+.5));var r=cell*.62*Math.sqrt(1-l);if(r<.35)continue;var px=x*cell+cell/2+(y&1?cell/2:0),py=y*cell+cell/2;c2.moveTo(px+r,py);c2.arc(px,py,r,0,6.2832)}
      c2.fill();}
    if(img.complete&&img.naturalWidth)render();else img.addEventListener('load',render);
    var lw=fig.clientWidth,rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){if(fig.clientWidth!==lw){lw=fig.clientWidth;render()}},200)});
    fig.addEventListener('click',function(){fig.classList.toggle('is-peek')});
    fig.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();fig.classList.toggle('is-peek')}});
    if(RM){fig.classList.add('is-in');return}
    var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){fig.classList.add('is-in');io.disconnect()}},{threshold:.25});io.observe(fig);
  });

  /* kit 18 reveals */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;el.innerHTML=el.dataset.kTxt;el.setAttribute('aria-label',el.textContent.trim());
    var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')};
    var words=el.textContent.trim().split(/\s+/);el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+esc(w)+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.querySelectorAll('.k-rv-w'),function(w){var t=w.offsetTop;if(t!==top){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
    el.innerHTML=lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+esc(l.join(' '))+'</span></span>'}).join('');
    el.classList.add('k-rv-ready');
  }
  var lineEls=[].slice.call(document.querySelectorAll('[data-reveal=lines]'));
  if(!RM){var ready=function(){lineEls.forEach(split)};if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ready);else ready();
    var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;lineEls.forEach(function(e){var on=e.classList.contains('is-in');split(e);if(on)e.classList.add('is-in')})}});}
  var els=document.querySelectorAll('[data-reveal]');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0});
  els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
})();
