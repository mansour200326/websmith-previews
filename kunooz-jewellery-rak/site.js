/* Kunooz concept · Websmith. Kit 03 (sequence), 09 (drag strip), 18 (reveals), 19 (micro), restyled. */
(function(){
var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
var FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;

/* header border once scrolled */
var hdr=document.querySelector('.hdr');
if(hdr){var st=function(){hdr.classList.toggle('is-stuck',scrollY>8)};addEventListener('scroll',st,{passive:true});st()}

/* hero display case opens */
var cs=document.querySelector('.case[data-open]');
if(cs){requestAnimationFrame(function(){requestAnimationFrame(function(){cs.classList.add('is-open')})})}
/* the name wipes in (RTL on Arabic) */
var nm=document.querySelector('.hero .h1 b');
if(nm){requestAnimationFrame(function(){requestAnimationFrame(function(){nm.classList.add('is-in')})})}

/* kit 03: story sequence inside the case */
document.querySelectorAll('[data-k-seq]').forEach(function(root){
  var frames=[].slice.call(root.querySelectorAll('[data-k-seq-frame]'));if(!frames.length)return;
  var bars=root.querySelector('[data-k-seq-bars]'),cap=root.querySelector('[data-k-seq-cap]'),cnt=root.querySelector('[data-k-seq-count]');
  var ms=+root.getAttribute('data-k-seq-ms')||4200,label=root.getAttribute('data-k-seq-label')||'Show photo',i=0,t=null,visible=true,hover=false;
  root.style.setProperty('--k-seq-ms',ms+'ms');
  var pad=function(n){return(n<10?'0':'')+n};
  var btns=frames.map(function(f,n){var b=document.createElement('button');b.className='k-seq__bar';b.type='button';b.setAttribute('aria-label',label+' '+(n+1));b.onclick=function(){go(n,true)};bars.appendChild(b);return b});
  function go(n){
    frames[i].classList.remove('is-on');i=(n+frames.length)%frames.length;
    var img=frames[i].querySelector('img');if(img&&img.loading==='lazy')img.loading='eager';
    frames[i].classList.add('is-on');
    btns.forEach(function(b,k){b.classList.toggle('is-done',k<i);b.classList.remove('is-on');b.removeAttribute('aria-current')});
    void btns[i].offsetWidth;btns[i].classList.add('is-on');btns[i].setAttribute('aria-current','true');
    if(cap)cap.textContent=frames[i].getAttribute('data-cap')||'';
    if(cnt)cnt.textContent=pad(i+1)+' / '+pad(frames.length);
    schedule();
  }
  function schedule(){clearTimeout(t);if(RM||!visible||hover||document.hidden){root.classList.add('is-paused');return}root.classList.remove('is-paused');t=setTimeout(function(){go(i+1)},ms)}
  new IntersectionObserver(function(e){visible=e[0].isIntersecting;schedule()},{threshold:.2}).observe(root);
  root.addEventListener('pointerenter',function(e){if(e.pointerType==='mouse'){hover=true;schedule()}});
  root.addEventListener('pointerleave',function(){hover=false;schedule()});
  root.addEventListener('focusin',function(){hover=true;schedule()});
  root.addEventListener('focusout',function(){hover=false;schedule()});
  document.addEventListener('visibilitychange',schedule);
  addEventListener('load',function(){frames.forEach(function(f){var im=f.querySelector('img');if(im)im.loading='eager'})});
  go(0);
});

/* collections index: photo peeks beside the row (desktop) */
document.querySelectorAll('[data-idx]').forEach(function(list){
  var peek=list.querySelector('.idx__peek');if(!peek||!FINE)return;var im=peek.querySelector('img');
  list.querySelectorAll('.idx__row').forEach(function(row){
    var src=row.getAttribute('data-img');if(!src)return;var pre=new Image();pre.src=src;
    row.addEventListener('pointerenter',function(){im.src=src;var r=row.offsetTop+row.offsetHeight/2-peek.offsetHeight/2;peek.style.top=Math.max(-40,r)+'px';peek.classList.add('is-on')});
  });
  list.addEventListener('pointerleave',function(){peek.classList.remove('is-on')});
});

/* kit 09: drag strip */
document.querySelectorAll('[data-k-drag]').forEach(function(root){
  var tr=root.querySelector('.k-drag__track'),bar=root.querySelector('.k-drag__bar'),prev=root.querySelector('[data-k-drag-prev]'),next=root.querySelector('[data-k-drag-next]');
  var rtl=getComputedStyle(tr).direction==='rtl';
  new IntersectionObserver(function(e,o){if(e[0].isIntersecting){root.classList.add('is-in');o.disconnect()}},{threshold:.15}).observe(root);
  function pos(){return Math.abs(tr.scrollLeft)}
  function upd(){var max=tr.scrollWidth-tr.clientWidth,p=max>0?pos()/max:1;
    if(bar)bar.style.setProperty('--k-prog',Math.max(.08,Math.min(1,p*.92+.08)));
    if(prev)prev.disabled=pos()<4;if(next)next.disabled=pos()>max-4;
    if(!RM)tr.querySelectorAll('.k-drag__card').forEach(function(c){var r=c.getBoundingClientRect(),cx=(r.left+r.width/2)/innerWidth-.5;c.style.setProperty('--k-px',(cx*-5).toFixed(2)+'%')});}
  tr.addEventListener('scroll',function(){requestAnimationFrame(upd)},{passive:true});addEventListener('resize',upd);upd();
  function step(d){var c=tr.querySelector('.k-drag__card');var w=c?c.getBoundingClientRect().width+20:300;tr.scrollBy({left:d*w*(rtl?-1:1),behavior:RM?'auto':'smooth'})}
  if(prev)prev.onclick=function(){step(-1)};if(next)next.onclick=function(){step(1)};
  var down=false,x0=0,s0=0,v=0,lx=0,lt=0,moved=0,raf;
  tr.addEventListener('pointerdown',function(e){if(e.pointerType!=='mouse')return;down=true;moved=0;x0=lx=e.clientX;s0=tr.scrollLeft;lt=performance.now();v=0;cancelAnimationFrame(raf)});
  addEventListener('pointermove',function(e){if(!down)return;var dx=e.clientX-x0;if(Math.abs(dx)>4)tr.classList.add('is-drag');moved=Math.max(moved,Math.abs(dx));tr.scrollLeft=s0-dx;var t=performance.now();v=(e.clientX-lx)/Math.max(1,t-lt);lx=e.clientX;lt=t});
  addEventListener('pointerup',function(){if(!down)return;down=false;
    if(RM||Math.abs(v)<.05){tr.classList.remove('is-drag');return}
    var vel=v*16;(function glide(){tr.scrollLeft-=vel;vel*=.93;if(Math.abs(vel)>.5)raf=requestAnimationFrame(glide);else tr.classList.remove('is-drag')})()});
  tr.addEventListener('click',function(e){if(moved>6){e.preventDefault();e.stopPropagation()}},true);
});

/* kit 18: reveals */
document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
function esc(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')}
function split(el){
  if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
  el.innerHTML=el.dataset.kTxt;var txt=el.textContent.trim().replace(/\s+/g,' ');
  var words=txt.split(' ');el.innerHTML=words.map(function(w){return'<span class="k-rv-w">'+esc(w)+'</span>'}).join(' ');
  var lines=[],top=null;[].forEach.call(el.querySelectorAll('.k-rv-w'),function(w){var t=w.offsetTop;if(top===null||Math.abs(t-top)>4){lines.push([]);top=t}lines[lines.length-1].push(w.textContent)});
  el.innerHTML='<span class="sr">'+esc(txt)+'</span>'+lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+esc(l.join(' '))+'</span></span>'}).join('');
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

/* kit 19: magnetic main buttons */
if(FINE&&!RM)document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
  var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
  el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
  el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
});
})();
