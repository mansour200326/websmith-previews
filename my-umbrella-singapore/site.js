/* My Umbrella concept: small page behaviours (kit.js handles reveals, counters, magnetic) */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var FINE=matchMedia('(hover:hover) and (pointer:fine)').matches;
  // mobile menu
  var hd=document.querySelector('.hd'),mb=document.querySelector('.hd__menu');
  if(hd&&mb){mb.addEventListener('click',function(){var o=hd.classList.toggle('is-open');mb.setAttribute('aria-expanded',o)});
    hd.querySelectorAll('.hd__nav a').forEach(function(a){a.addEventListener('click',function(){hd.classList.remove('is-open');mb.setAttribute('aria-expanded','false')})});}
  // hero canopies drift apart a little as you scroll
  var discs=[].slice.call(document.querySelectorAll('.disc[data-drift]'));
  if(discs.length&&!RM){var tick=false;function up(){var y=Math.min(scrollY,900);discs.forEach(function(d){var k=parseFloat(d.dataset.drift);d.style.transform='translate3d(0,'+(y*k).toFixed(1)+'px,0) rotate('+(y*k*.08).toFixed(2)+'deg)'});tick=false}
    addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(up)}},{passive:true});}
  // category sentence: photo follows the cursor
  var list=document.querySelector('[data-float]');
  if(list&&FINE&&!RM){var fl=document.createElement('div');fl.className='float';fl.setAttribute('aria-hidden','true');var im=document.createElement('img');im.alt='';fl.appendChild(im);document.body.appendChild(fl);
    var tx=0,ty=0,cx=0,cy=0,on=false,raf;
    function loop(){cx+=(tx-cx)*.16;cy+=(ty-cy)*.16;fl.style.setProperty('--fx',cx+'px');fl.style.setProperty('--fy',cy+'px');if(on||Math.abs(tx-cx)>.5)raf=requestAnimationFrame(loop)}
    list.querySelectorAll('a[data-img]').forEach(function(a){
      a.addEventListener('mouseenter',function(e){im.src=a.dataset.img;on=true;fl.classList.add('is-on');tx=e.clientX+24;ty=e.clientY-120;if(!raf||true){cancelAnimationFrame(raf);raf=requestAnimationFrame(loop)}});
      a.addEventListener('mousemove',function(e){tx=e.clientX+24;ty=e.clientY-120});
      a.addEventListener('mouseleave',function(){on=false;fl.classList.remove('is-on')});
    });
    list.querySelectorAll('a[data-img]').forEach(function(a){var p=new Image();p.src=a.dataset.img});
  }
  // anatomy drawing: start when in view
  var an=document.querySelector('.anat');
  if(an){an.querySelectorAll('.draw').forEach(function(p){try{p.style.setProperty('--len',Math.ceil(p.getTotalLength()+2))}catch(e){}});
    if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){an.classList.add('is-in');io.disconnect()}})},{threshold:.25});io.observe(an.querySelector('svg')||an)}else an.classList.add('is-in');}
  // products page: mark the group in view
  var side=[].slice.call(document.querySelectorAll('.side a[href^="#"]'));
  if(side.length&&'IntersectionObserver' in window){var map={};side.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){side.forEach(function(a){a.classList.remove('is-on');a.removeAttribute('aria-current')});var a=map[e.target.id];if(a){a.classList.add('is-on');a.setAttribute('aria-current','true');if(innerWidth<1000){var sc=a.closest('.side');sc.scrollTo({left:a.offsetLeft-30,behavior:RM?'auto':'smooth'})}}}})},{rootMargin:'-40% 0px -55% 0px'});
    Object.keys(map).forEach(function(id){var s=document.getElementById(id);if(s)so.observe(s)});}
  // footer wordmark spans the full width
  var fw=document.querySelector('.ft__word span');
  if(fw){var box=fw.parentNode;function fit(){box.style.fontSize='100px';var cs=getComputedStyle(box),w=box.clientWidth-parseFloat(cs.paddingLeft)-parseFloat(cs.paddingRight);box.style.fontSize=(100*w/fw.getBoundingClientRect().width*.97).toFixed(2)+'px'}
    fit();addEventListener('resize',fit);if(document.fonts)document.fonts.ready.then(fit);}
})();
