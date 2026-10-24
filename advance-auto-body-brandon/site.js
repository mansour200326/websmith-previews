/* Advance Auto Body - small page helpers (kit.js does reveals, marquee, accordion, hours, map, magnetic, counters) */
(function(){
  // services page: highlight the index entry for the section in view
  var links=document.querySelectorAll('.chips a');
  if(links.length&&'IntersectionObserver' in window){
    var map={};links.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var io=new IntersectionObserver(function(es){es.forEach(function(e){
      if(e.isIntersecting){links.forEach(function(a){a.classList.remove('is-on')});var a=map[e.target.id];if(a){a.classList.add('is-on');var c=a.parentNode;if(c.scrollWidth>c.clientWidth)c.scrollTo({left:a.offsetLeft-20,behavior:'smooth'})}}
    })},{rootMargin:'-40% 0px -55% 0px'});
    document.querySelectorAll('.svc__item[id]').forEach(function(s){io.observe(s)});
  }
  // kit 16 sets only the first badge in a section: mirror it to the others (hero has one per breakpoint)
  document.querySelectorAll('[data-k-hours]').forEach(function(root){
    var bs=root.querySelectorAll('[data-k-badge]');if(bs.length<2||bs[0].hidden)return;
    for(var i=1;i<bs.length;i++){bs[i].hidden=false;bs[i].className=bs[0].className;bs[i].querySelector('span').textContent=bs[0].querySelector('span').textContent}
  });
  // Find us: mark today's hours line (Winnipeg time)
  document.querySelectorAll('[data-k-hours]').forEach(function(root){
    var ls=root.querySelectorAll('.vis__l[data-days]');if(!ls.length)return;
    var tz=root.getAttribute('data-k-tz')||'America/Winnipeg';
    var d=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(new Intl.DateTimeFormat('en-US',{timeZone:tz,weekday:'short'}).format(new Date()));
    ls.forEach(function(l){if(l.getAttribute('data-days').split(',').indexOf(String(d))>-1)l.classList.add('is-today')});
  });
  // close the phone menu after a tap
  var m=document.querySelector('.hd__menu');
  if(m)m.addEventListener('click',function(e){if(e.target.tagName==='A')m.removeAttribute('open')});
})();
