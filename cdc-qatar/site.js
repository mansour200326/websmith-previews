/* CDC concept · Websmith. Kit 04/06/07/11/18/19/25, adapted. Everything is visible without JS. */
(function(){
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;

/* header border on scroll */
var hd=document.querySelector('.hd');
if(hd){var f=function(){hd.classList.toggle('is-scrolled',scrollY>10)};addEventListener('scroll',f,{passive:true});f();}

/* kit 04: hero mask opens on scroll */
(function(){
  if(RM)return;var els=[].slice.call(document.querySelectorAll('[data-k-mask]'));if(!els.length)return;var tick=false;
  function upd(){tick=false;els.forEach(function(el){var r=el.getBoundingClientRect(),d=el.offsetHeight-innerHeight;var p=Math.min(1,Math.max(0,-r.top/d));el.style.setProperty('--p',p.toFixed(4))})}
  addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});addEventListener('resize',upd);upd();
})();

/* kit 18: reveals */
(function(){
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
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')});return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:0});
  els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
})();

/* kit 19: magnetic buttons */
if(FINE&&!RM)document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
  var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
  el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
  el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
});

/* kit 06: counters */
(function(){
  var els=document.querySelectorAll('[data-k-count]');if(!els.length||RM||!('IntersectionObserver' in window))return;
  function fmt(el,v,dec){return v.toLocaleString(el.getAttribute('data-k-count-locale')||'en-US',{minimumFractionDigits:dec,maximumFractionDigits:dec,useGrouping:!el.hasAttribute('data-k-count-nogroup')})}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){if(!e.isIntersecting)return;io.unobserve(e.target);var el=e.target,to=parseFloat(el.getAttribute('data-k-count')),dec=+el.getAttribute('data-k-count-dec')||0,from=parseFloat(el.getAttribute('data-k-count-from')||0),t0=performance.now();
    (function f(t){var k=Math.min(1,(t-t0)/1600),q=1-Math.pow(1-k,4);el.firstChild.nodeValue=fmt(el,from+(to-from)*q,dec);if(k<1)requestAnimationFrame(f)})(t0)})},{threshold:.5});
  els.forEach(function(el){var dec=+el.getAttribute('data-k-count-dec')||0;el.style.display='inline-block';el.style.minWidth=el.offsetWidth+'px';el.firstChild.nodeValue=fmt(el,parseFloat(el.getAttribute('data-k-count-from')||0),dec);io.observe(el)});
})();

/* kit 07: marquee */
document.querySelectorAll('[data-k-marquee]').forEach(function(m){
  var tr=m.querySelector('.k-marquee__track');if(!tr)return;m.style.setProperty('--k-mq-s',(+m.getAttribute('data-k-marquee-speed')||40)+'s');if(RM)return;
  var c=tr.cloneNode(true);c.setAttribute('aria-hidden','true');c.setAttribute('inert','');m.appendChild(c);
  new IntersectionObserver(function(e){m.classList.toggle('is-off',!e[0].isIntersecting)}).observe(m);
});

/* project register: filters + floating preview (kit 11 float, adapted) + smooth open */
document.querySelectorAll('[data-reg]').forEach(function(root){
  var rows=[].slice.call(root.querySelectorAll('.reg__row')),cnt=root.querySelector('[data-reg-count]'),btns=[].slice.call(root.querySelectorAll('[data-filter]'));
  btns.forEach(function(b){b.addEventListener('click',function(){var f=b.getAttribute('data-filter'),n=0;
    btns.forEach(function(x){x.setAttribute('aria-pressed',x===b?'true':'false')});
    rows.forEach(function(r){var on=f==='all'||(' '+r.getAttribute('data-type')+' ').indexOf(' '+f+' ')>-1;r.hidden=!on;if(on)n++});
    if(cnt)cnt.textContent=cnt.getAttribute('data-tpl').replace('{n}',n);})});
  rows.forEach(function(d){var s=d.querySelector('summary'),b=d.querySelector('.reg__body');
    s.addEventListener('click',function(e){if(RM||!b.animate)return;e.preventDefault();
      if(d.open){var h=b.offsetHeight;b.animate({height:[h+'px','0px'],opacity:[1,0]},{duration:360,easing:'cubic-bezier(.16,1,.3,1)'}).onfinish=function(){d.open=false};}
      else{d.open=true;var h2=b.offsetHeight;b.animate({height:['0px',h2+'px'],opacity:[0,1]},{duration:520,easing:'cubic-bezier(.16,1,.3,1)'});}})});
  if(!FINE||RM||innerWidth<900)return;
  var fl=document.createElement('div');fl.className='k-acc__float';fl.setAttribute('aria-hidden','true');document.body.appendChild(fl);
  var imgs={},tx=0,ty=0,x=0,y=0,run=false,rtl=getComputedStyle(root).direction==='rtl';
  function get(u){if(!imgs[u]){var i=new Image();i.src=u;i.alt='';i.decoding='async';fl.appendChild(i);imgs[u]=i}return imgs[u]}
  function loop(){x+=(tx-x)*.14;y+=(ty-y)*.14;fl.style.setProperty('--fx',x+'px');fl.style.setProperty('--fy',y+'px');if(run)requestAnimationFrame(loop)}
  root.addEventListener('pointermove',function(e){var w=fl.offsetWidth,h=fl.offsetHeight;tx=rtl?e.clientX-w-40:e.clientX+40;ty=e.clientY-h/2;if(tx+w>innerWidth)tx=e.clientX-w-40;if(tx<0)tx=e.clientX+40;});
  rows.forEach(function(d){var s=d.querySelector('summary'),u=d.getAttribute('data-img');if(!u)return;
    s.addEventListener('pointerenter',function(){if(d.open)return;var im=get(u);for(var k in imgs)imgs[k].classList.toggle('is-on',imgs[k]===im);fl.classList.add('is-on');if(!run){run=true;x=tx;y=ty;loop()}});
    s.addEventListener('pointerleave',function(){fl.classList.remove('is-on');run=false});
    s.addEventListener('click',function(){fl.classList.remove('is-on')});});
});

/* services accordion: smooth open */
document.querySelectorAll('[data-k-acc] .k-acc__row').forEach(function(d){var s=d.querySelector('summary'),b=d.querySelector('.k-acc__body');
  s.addEventListener('click',function(e){if(RM||!b.animate)return;e.preventDefault();
    if(d.open){var h=b.offsetHeight;b.animate({height:[h+'px','0px'],opacity:[1,0]},{duration:380,easing:'cubic-bezier(.16,1,.3,1)'}).onfinish=function(){d.open=false};}
    else{d.open=true;var h2=b.offsetHeight;b.animate({height:['0px',h2+'px'],opacity:[0,1]},{duration:520,easing:'cubic-bezier(.16,1,.3,1)'});}})});

/* kit 25: dither print on ONE photo (plant & machinery fleet) */
(function(){
  var els=document.querySelectorAll('[data-k-fx]');if(!els.length)return;
  var B=[0,32,8,40,2,34,10,42,48,16,56,24,50,18,58,26,12,44,4,36,14,46,6,38,60,28,52,20,62,30,54,22,3,35,11,43,1,33,9,41,51,19,59,27,49,17,57,25,15,47,7,39,13,45,5,37,63,31,55,23,61,29,53,21];
  function rgb(h){h=h.replace('#','');var v=parseInt(h,16);return [v>>16&255,v>>8&255,v&255]}
  function lum(h){var c=rgb(h);return c[0]*.3+c[1]*.59+c[2]*.11}
  function render(fig){
    var img=fig.querySelector('img'),W=fig.clientWidth,H=fig.clientHeight;if(!W||!H||!img.naturalWidth)return;
    var cell=+fig.getAttribute('data-k-fx-cell')||2;cell=Math.max(1.5,cell*Math.min(1,W/700));
    var k=+fig.getAttribute('data-k-fx-contrast')||1.4,ink=fig.getAttribute('data-k-fx-ink'),paper=fig.getAttribute('data-k-fx-paper');
    var cols=Math.ceil(W/cell),rows=Math.ceil(H/cell),s=document.createElement('canvas');s.width=cols;s.height=rows;
    var sx=s.getContext('2d',{willReadFrequently:true});var sc=Math.max(cols/img.naturalWidth,rows/img.naturalHeight),dw=img.naturalWidth*sc,dh=img.naturalHeight*sc;sx.drawImage(img,(cols-dw)/2,(rows-dh)/2,dw,dh);
    var d;try{d=sx.getImageData(0,0,cols,rows).data}catch(e){return}
    var inv=lum(paper)<lum(ink),L=new Float32Array(cols*rows);
    for(var i=0;i<L.length;i++){var l=(.2126*d[i*4]+.7152*d[i*4+1]+.0722*d[i*4+2])/255;l=Math.min(1,Math.max(0,(l-.5)*k+.5));L[i]=inv?1-l:l}
    var cv=fig.querySelector('canvas')||fig.appendChild(document.createElement('canvas'));cv.setAttribute('aria-hidden','true');fig.style.setProperty('--k-fx-paper',paper);
    cv.width=cols;cv.height=rows;var cx=cv.getContext('2d'),o=cx.createImageData(cols,rows),a=rgb(ink),b=rgb(paper);
    for(var y=0;y<rows;y++)for(var x=0;x<cols;x++){var j=y*cols+x,c=L[j]<(B[(y%8)*8+x%8]+.5)/64?a:b;o.data[j*4]=c[0];o.data[j*4+1]=c[1];o.data[j*4+2]=c[2];o.data[j*4+3]=255}
    cx.putImageData(o,0,0);
  }
  els.forEach(function(fig){var img=fig.querySelector('img');if(!img)return;var go=function(){render(fig)};if(img.complete&&img.naturalWidth)go();else img.addEventListener('load',go);
    var lw=fig.clientWidth,rt;addEventListener('resize',function(){clearTimeout(rt);rt=setTimeout(function(){if(fig.clientWidth!==lw){lw=fig.clientWidth;go()}},200)});
    fig.addEventListener('click',function(){fig.classList.toggle('is-peek')});
    fig.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();fig.classList.toggle('is-peek')}});
    if(RM||!('IntersectionObserver' in window)){fig.classList.add('is-in');return}
    var io=new IntersectionObserver(function(e){if(e[0].isIntersecting){fig.classList.add('is-in');io.disconnect()}},{threshold:.25});io.observe(fig);});
})();

/* map: load only on tap */
document.querySelectorAll('[data-map]').forEach(function(b){b.addEventListener('click',function(){var f=document.createElement('iframe');f.src=b.getAttribute('data-map');f.title=b.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';b.parentNode.appendChild(f);b.remove()})});
})();
