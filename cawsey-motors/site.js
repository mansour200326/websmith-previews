/* Cawsey Motors concept: page-specific motion (kit.js handles reveals, marquee, accordion, magnetic). */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Statement: words fill from grey to ink as the paragraph scrolls through the screen (Selected Car Group idea).
  var fills=[].slice.call(document.querySelectorAll('[data-fill]'));
  if(!RM&&fills.length){
    fills.forEach(function(el){
      var txt=el.textContent.trim();
      el.innerHTML='<span class="vh">'+txt.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</span>'+txt.split(/\s+/).map(function(w){return'<span class="w" aria-hidden="true">'+w.replace(/&/g,'&amp;').replace(/</g,'&lt;')+'</span>'}).join(' ');
      el.classList.add('is-live');el.__w=el.querySelectorAll('.w');
    });
    var tick=false;
    function upd(){tick=false;var vh=innerHeight;
      fills.forEach(function(el){var r=el.getBoundingClientRect();
        var p=(vh*.88-r.top)/(r.height+vh*.42);p=Math.max(0,Math.min(1,p));
        var n=Math.max(el.__n||0,Math.round(p*el.__w.length));el.__n=n;
        for(var i=0;i<el.__w.length;i++)el.__w[i].classList.toggle('on',i<n);
      });
    }
    addEventListener('scroll',function(){if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});
    addEventListener('resize',upd);upd();
  }

  // Services page: mark the section in view in the sticky index.
  var nav=document.querySelector('.list__nav');
  if(nav&&'IntersectionObserver' in window){
    var links={};[].forEach.call(nav.querySelectorAll('a'),function(a){links[a.getAttribute('href').slice(1)]=a});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){
      [].forEach.call(nav.querySelectorAll('a'),function(a){a.classList.remove('is-here');a.removeAttribute('aria-current')});
      var a=links[e.target.id];if(a){a.classList.add('is-here');a.setAttribute('aria-current','location')}}})},{rootMargin:'-40% 0px -55% 0px'});
    [].forEach.call(document.querySelectorAll('.item[id]'),function(s){io.observe(s)});
  }
})();
