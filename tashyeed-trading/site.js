/* Tashyeed concept: kit 18 (reveal), 19 (magnetic), 11 (accordion float), 09 (drag), 16 (map) + page bits */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,FINE=matchMedia('(hover:hover) and (pointer:fine)').matches,DESK=matchMedia('(min-width:900px) and (pointer:fine)').matches;

  /* menu */
  var mb=document.querySelector('.hd__menu'),nav=document.getElementById('nav');
  if(mb&&nav){mb.addEventListener('click',function(){var o=nav.classList.toggle('is-open');mb.setAttribute('aria-expanded',o)});
    nav.addEventListener('click',function(e){if(e.target.closest('a')){nav.classList.remove('is-open');mb.setAttribute('aria-expanded','false')}})}

  /* kit 18: reveals */
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
  if(!RM){
    var ready=function(){lineEls.forEach(split)};
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ready);else ready();
    var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;lineEls.forEach(function(e){var on=e.classList.contains('is-in');split(e);if(on)e.classList.add('is-in')})}});
  }
  var els=document.querySelectorAll('[data-reveal],.spec');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -10% 0px',threshold:0});
    els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
  }
  var px=[].slice.call(document.querySelectorAll('[data-speed]'));
  if(DESK&&!RM&&px.length){var tk=false;var upd=function(){tk=false;var vh=innerHeight;px.forEach(function(e){var r=e.parentElement.getBoundingClientRect();if(r.bottom<-200||r.top>vh+200)return;var c=(r.top+r.height/2-vh/2);e.style.transform='translate3d(0,'+(c*(+e.getAttribute('data-speed'))).toFixed(1)+'px,0) scale(1.12)'})};
    addEventListener('scroll',function(){if(!tk){tk=true;requestAnimationFrame(upd)}},{passive:true});upd();}

  /* spec drawing: measure path lengths for the draw-in */
  document.querySelectorAll('.spec svg .draw').forEach(function(p){try{p.style.setProperty('--len',Math.ceil(p.getTotalLength()+2))}catch(e){}});

  /* kit 19: magnetic */
  if(FINE&&!RM)document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
    var k=parseFloat(el.getAttribute('data-k-magnetic'))||.3;
    el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
    el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
  });

  /* kit 11: accordion + floating preview */
  document.querySelectorAll('[data-k-acc]').forEach(function(root){
    var rows=[].slice.call(root.querySelectorAll('.k-acc__row'));
    rows.forEach(function(d){var s=d.querySelector('summary'),b=d.querySelector('.k-acc__body');
      s.addEventListener('click',function(e){if(RM||!b.animate)return;e.preventDefault();
        if(d.open){var h=b.offsetHeight;b.animate({height:[h+'px','0px'],opacity:[1,0]},{duration:380,easing:'cubic-bezier(.16,1,.3,1)'}).onfinish=function(){d.open=false};}
        else{d.open=true;var h2=b.offsetHeight;b.animate({height:['0px',h2+'px'],opacity:[0,1]},{duration:520,easing:'cubic-bezier(.16,1,.3,1)'});}});});
    if(!FINE||RM)return;
    var fl=document.createElement('div');fl.className='k-acc__float';fl.setAttribute('aria-hidden','true');document.body.appendChild(fl);
    var imgs={};rows.forEach(function(d){var u=d.getAttribute('data-img');if(!u||imgs[u])return;var i=new Image();i.src=u;i.alt='';i.decoding='async';fl.appendChild(i);imgs[u]=i});
    var tx=0,ty=0,x=0,y=0,run=false,rtl=getComputedStyle(root).direction==='rtl';
    function loop(){x+=(tx-x)*.14;y+=(ty-y)*.14;fl.style.setProperty('--fx',x+'px');fl.style.setProperty('--fy',y+'px');if(run)requestAnimationFrame(loop)}
    root.addEventListener('pointermove',function(e){var w=fl.offsetWidth,h=fl.offsetHeight;tx=rtl?e.clientX-w-40:e.clientX+40;ty=e.clientY-h/2;if(tx+w>innerWidth)tx=e.clientX-w-40;if(tx<0)tx=e.clientX+40;});
    rows.forEach(function(d){var s=d.querySelector('summary'),u=d.getAttribute('data-img');if(!u)return;
      s.addEventListener('pointerenter',function(){for(var k in imgs)imgs[k].classList.toggle('is-on',k===u);fl.classList.add('is-on');if(!run){run=true;x=tx;y=ty;loop()}});
      s.addEventListener('pointerleave',function(){fl.classList.remove('is-on');run=false});});
  });

  /* kit 09: drag strip */
  document.querySelectorAll('[data-k-drag]').forEach(function(root){
    var tr=root.querySelector('.k-drag__track'),bar=root.querySelector('.k-drag__bar'),prev=root.querySelector('[data-k-drag-prev]'),next=root.querySelector('[data-k-drag-next]');
    var rtl=getComputedStyle(tr).direction==='rtl';
    if('IntersectionObserver' in window)new IntersectionObserver(function(e,o){if(e[0].isIntersecting){root.classList.add('is-in');o.disconnect()}},{threshold:0,rootMargin:'0px 0px 15% 0px'}).observe(root);else root.classList.add('is-in');
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
    addEventListener('pointerup',function(){if(!down)return;down=false;
      if(RM||Math.abs(v)<.05){tr.classList.remove('is-drag');return}
      var vel=v*16;(function glide(){tr.scrollLeft-=vel;vel*=.93;if(Math.abs(vel)>.5)raf=requestAnimationFrame(glide);else tr.classList.remove('is-drag')})()});
    tr.addEventListener('click',function(e){if(moved>6){e.preventDefault();e.stopPropagation()}},true);
  });

  /* kit 16: tap-to-load map */
  document.querySelectorAll('[data-k-map]').forEach(function(m){
    var btn=m.querySelector('button');
    function load(){if(m.querySelector('iframe'))return;var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=m.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';f.onload=function(){f.classList.add('is-on');if(btn)btn.remove();var p=m.querySelector('.k-visit__pin');if(p)p.remove()};m.appendChild(f)}
    if(btn)btn.addEventListener('click',load);
  });

  /* colour picker */
  document.querySelectorAll('[data-sw]').forEach(function(root){
    var view=root.querySelector('.mma__view'),name=root.querySelector('[data-sw-name]'),btns=root.querySelectorAll('.sw button');
    btns.forEach(function(b){b.addEventListener('click',function(){
      btns.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
      var old=view.querySelector('img'),n=new Image();n.src=b.getAttribute('data-src');n.alt=b.getAttribute('data-alt');n.className=RM?'':'out';
      old.after(n);name.textContent=b.querySelector('span').textContent;
      requestAnimationFrame(function(){requestAnimationFrame(function(){n.classList.remove('out');old.classList.add('out');setTimeout(function(){old.remove()},RM?0:700)})});
    })});
  });

  /* products page: highlight current item in the index */
  var toc=document.querySelectorAll('.toc a');
  if(toc.length&&'IntersectionObserver' in window){
    var map={};toc.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var o2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){toc.forEach(function(a){a.classList.remove('is-on')});var a=map[e.target.id];if(a)a.classList.add('is-on')}})},{rootMargin:'-40% 0px -55% 0px'});
    document.querySelectorAll('.item[id]').forEach(function(s){o2.observe(s)});
  }
})();
