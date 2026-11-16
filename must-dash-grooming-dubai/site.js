/* Must Dash · concept by Websmith */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // header turns solid after the hero starts scrolling away
  var hd=document.querySelector('.hd');
  if(hd){var f=function(){hd.classList.toggle('is-solid',scrollY>40)};addEventListener('scroll',f,{passive:true});f()}

  // service index: a photo peeks next to the hovered line (desktop, pointer only)
  var list=document.querySelector('.idx__list'),peek=document.querySelector('.idx__peek');
  if(list&&peek&&matchMedia('(hover:hover) and (pointer:fine) and (min-width:900px)').matches){
    var img=peek.querySelector('img');
    list.querySelectorAll('a[data-peek]').forEach(function(a){
      a.addEventListener('mouseenter',function(){
        var src=a.getAttribute('data-peek');if(img.getAttribute('src')!==src)img.setAttribute('src',src);img.style.setProperty('--o',a.getAttribute('data-peek-o')||'50% 50%');img.style.setProperty('--z',a.getAttribute('data-peek-z')||'1.6');
        var r=a.getBoundingClientRect(),lr=list.getBoundingClientRect();
        peek.style.top=(r.top-lr.top+r.height/2)+'px';peek.classList.add('on');
      });
    });
    list.addEventListener('mouseleave',function(){peek.classList.remove('on')});
  }

  // services page: highlight the section in the jump bar
  var jump=document.querySelectorAll('.jump a');
  if(jump.length&&'IntersectionObserver' in window){
    var map={};jump.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){jump.forEach(function(a){a.classList.remove('on')});var a=map[e.target.id];if(a){a.classList.add('on');var n=a.parentElement;if(n.scrollWidth>n.clientWidth){var r=a.getBoundingClientRect(),nr=n.getBoundingClientRect();n.scrollBy({left:(r.left+r.width/2)-(nr.left+nr.width/2),behavior:RM?'auto':'smooth'})}}}})},{rootMargin:'-45% 0px -50% 0px'});
    document.querySelectorAll('.svc[id]').forEach(function(s){io.observe(s)});
  }
  // Find us: load the map embed when the section is ~300px from the screen
  document.querySelectorAll('[data-md-map]').forEach(function(m){
    function load(){if(m.querySelector('iframe'))return;m.classList.add('is-loading');var f=document.createElement('iframe');f.src=m.getAttribute('data-src');f.title=m.getAttribute('data-title')||'Map';f.loading='lazy';f.referrerPolicy='no-referrer-when-downgrade';
      f.onload=function(){f.classList.add('is-on');m.classList.remove('is-loading');var a=m.querySelector('.map-fallback');if(a)a.setAttribute('hidden','')};m.appendChild(f)}
    if('IntersectionObserver' in window)new IntersectionObserver(function(e,o){if(e[0].isIntersecting){o.disconnect();load()}},{rootMargin:'300px 0px'}).observe(m);else load();
  });
})();
