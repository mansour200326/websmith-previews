/* Al Rawda Fitness concept: day ribbon with a now-marker (Dubai time), today's hours row, mobile action bar. */
(function(){
  var d=document.documentElement,AR=d.lang==='ar';
  // Dubai time now
  var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
  var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
  var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),h=(+g('hour'))%24,m=+g('minute'),now=h+m/60;
  // Published hours: Monday to Saturday, 5am to 2am (the night runs into the next day). Sunday not published.
  var state;
  if((day===0&&h>=5)||(day===1&&h<2))state='ask';
  else if(h>=5&&day>=1&&day<=6)state='open';
  else if(h<2&&day>=2)state='open'; // Tue..Sat early hours, plus Sun 00:00–02:00 (Saturday night)
  else if(h<2&&day===0)state='open';
  else state='shut';
  var T=AR?{open:'مفتوح الآن · حتى 2 فجرًا',shut:'مغلق الآن · نفتح 5 فجرًا',ask:'الأحد: اسألنا على واتساب'}
          :{open:'Open now · closes 2am',shut:'Closed now · opens 5am',ask:'Sunday: ask on WhatsApp'};
  document.querySelectorAll('[data-day-ribbon]').forEach(function(r){
    r.classList.add(state==='open'?'is-open':state==='shut'?'is-shut':'is-ask','has-now');
    if(h<5)r.classList.add('is-early'); // marker sits in or beside the closed gap: let the tag speak
    r.style.setProperty('--now',(now/24*100)+'%');
    var s=r.querySelector('[data-day-state]'),bar=r.querySelector('.day__bar');
    if(s){
      s.textContent=T[state];
      if(bar)bar.setAttribute('aria-label',bar.getAttribute('aria-label')+(AR?'. ':'. ')+T[state]);
      // anchor left of the marker past 75% of the bar (or when the tag would run off the end), right of it otherwise
      var place=function(){
        var bw=bar.getBoundingClientRect().width,x=now/24*bw,tw=s.getBoundingClientRect().width+8;
        r.classList.toggle('is-flip',now/24>.75||(x+tw>bw&&x>bw-x));
      };
      place();addEventListener('resize',place);
      if(document.fonts&&document.fonts.ready)document.fonts.ready.then(place);
    }
    if(!matchMedia('(prefers-reduced-motion: reduce)').matches)r.classList.add('js-fill');
  });
  var row=document.querySelector('.hrs tr[data-day="'+day+'"]');if(row)row.classList.add('is-today');

  // Mobile action bar: only once the hero's own buttons have scrolled away
  var bar=document.querySelector('.bar'),hero=document.querySelector('[data-hero-acts]');
  if(bar&&hero&&'IntersectionObserver' in window){
    new IntersectionObserver(function(e){
      var past=!e[0].isIntersecting&&e[0].boundingClientRect.top<0;
      bar.classList.toggle('is-on',past);bar.toggleAttribute('inert',!past);
    }).observe(hero);
    bar.setAttribute('inert','');
  }else if(bar){bar.classList.add('is-on')}
})();
