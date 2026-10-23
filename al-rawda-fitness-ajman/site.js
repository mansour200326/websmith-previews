/* Al Rawda Fitness concept: live day ribbon (Dubai time), today's hours row, mobile action bar. */
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
  var T=AR?{open:'مفتوح الآن',shut:'مغلق الآن',ask:'الأحد: اسألنا على واتساب',closes:'نغلق الساعة 2 فجرًا',opens:'نفتح الساعة 5 فجرًا',now:'الساعة الآن في عجمان '}
          :{open:'Open now',shut:'Closed now',ask:'Sunday: ask us on WhatsApp',closes:'closes at 2am',opens:'opens at 5am',now:'Ajman time '};
  var pad=function(n){return(n<10?'0':'')+n};
  document.querySelectorAll('[data-day-ribbon]').forEach(function(r){
    r.classList.add(state==='open'?'is-open':state==='shut'?'is-shut':'is-ask','has-now');
    r.style.setProperty('--now',(now/24*100)+'%');
    var s=r.querySelector('[data-day-state]');
    if(s)s.textContent=state==='open'?T.open+' · '+T.closes:state==='shut'?T.shut+' · '+T.opens:T.ask;
    var n=r.querySelector('[data-day-now]');if(n)n.textContent=T.now+pad(h)+':'+pad(m);
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
