/* Retro Grooming Lounge: site behaviour (header state, live open/closed in UAE time). Kit motion lives in kit.js. */
(function(){
  var head=document.querySelector('.site-head');
  if(head){
    var solidAt=head.hasAttribute('data-solid')?-1:40;
    var tick=function(){head.classList.toggle('is-solid',scrollY>solidAt)};
    tick();addEventListener('scroll',tick,{passive:true});
  }
  // Opening hours (Fresha listing): Sat–Thu 10:00–23:00, Fri 10:00–13:15 and 15:00–23:00. JS day 0=Sun.
  var H={0:[[10,23]],1:[[10,23]],2:[[10,23]],3:[[10,23]],4:[[10,23]],5:[[10,13.25],[15,23]],6:[[10,23]]};
  var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
  var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
  var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
  var open=(H[day]||[]).some(function(r){return now>=r[0]&&now<r[1]});
  document.querySelectorAll('tr[data-day="'+day+'"]').forEach(function(r){r.classList.add('is-today')});
  document.querySelectorAll('[data-open-badge]').forEach(function(b){
    b.hidden=false;b.classList.add(open?'is-open':'is-shut');
    var s=b.querySelector('span');if(s)s.textContent=open?b.getAttribute('data-open'):b.getAttribute('data-shut');
  });
})();
/* Reveal safety net (Fannan r1 fix 2): IntersectionObserver can miss fast scrolls and anchor jumps, so sweep on scroll
   (throttled to 150ms) and on load: anything whose top is above 92% of the viewport, including everything already
   scrolled past, gets is-in. Stops listening once nothing is left. Plus a 2.5s safety pass. */
(function(){
  if(!document.documentElement.classList.contains('k-js'))return;
  var left=function(){return document.querySelectorAll('[data-reveal]:not(.is-in)')};
  var sweep=function(){
    var els=left(),lim=innerHeight*.92;
    els.forEach(function(e){if(e.getBoundingClientRect().top<lim)e.classList.add('is-in')});
    if(!left().length){removeEventListener('scroll',onScroll);removeEventListener('resize',onScroll)}
  };
  var last=0,t=0;
  var onScroll=function(){var now=Date.now();clearTimeout(t);if(now-last>=150){last=now;sweep()}else t=setTimeout(function(){last=Date.now();sweep()},150-(now-last))};
  addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll,{passive:true});
  if(document.readyState==='complete')sweep();else addEventListener('load',sweep);
  addEventListener('hashchange',function(){setTimeout(sweep,60)});
  setTimeout(function(){left().forEach(function(e){if(e.getBoundingClientRect().top<innerHeight)e.classList.add('is-in')})},2500);
})();
