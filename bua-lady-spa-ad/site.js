/* Bua concept: services search + category index. Everything works without this file. */
(function(){
  var q=document.querySelector('[data-s-search]');
  if(q){
    var items=[].slice.call(document.querySelectorAll('.s-item')),cats=[].slice.call(document.querySelectorAll('.s-cat')),
        out=document.querySelector('[data-s-count]'),none=document.querySelector('[data-s-none]'),
        ar=document.documentElement.lang==='ar';
    var norm=function(s){return s.toLowerCase().replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي').replace(/&/g,'and')};
    items.forEach(function(i){i._t=norm(i.textContent+' '+(i.closest('.s-cat').getAttribute('data-k')||''))});
    q.addEventListener('input',function(){
      var v=norm(q.value.trim()),n=0;
      items.forEach(function(i){var hit=!v||v.split(/\s+/).every(function(w){return i._t.indexOf(w)>-1});i.hidden=!hit;if(hit)n++});
      cats.forEach(function(c){c.hidden=!!v&&!c.querySelector('.s-item:not([hidden])')});
      if(out)out.textContent=v?(ar?(n+' نتيجة'):(n+(n===1?' treatment':' treatments'))):'';
      if(none)none.hidden=!(v&&n===0);
    });
  }
  var links=[].slice.call(document.querySelectorAll('.s-index a'));
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.remove('is-on')});var a=map[e.target.id];if(a){a.classList.add('is-on');if(a.scrollIntoView&&innerWidth<1100){var ul=a.closest('ul');ul.scrollTo({left:a.offsetLeft-20,behavior:'smooth'})}}}})},{rootMargin:'-30% 0px -60% 0px'});
    document.querySelectorAll('.s-cat').forEach(function(c){io.observe(c)});
  }
})();
