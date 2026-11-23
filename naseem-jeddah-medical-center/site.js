/* Naseem Jeddah Medical Center concept: live Jeddah clock, "in clinic now" per doctor, doctor filter, services index. */
(function(){
  var AR=document.documentElement.lang==='ar';
  var DAYS=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  function now(){
    var p={};new Intl.DateTimeFormat('en-GB',{timeZone:'Asia/Riyadh',weekday:'short',hour:'2-digit',minute:'2-digit',hourCycle:'h23'})
      .formatToParts(new Date()).forEach(function(x){p[x.type]=x.value});
    return {d:DAYS.indexOf(p.weekday),h:+p.hour+(+p.minute)/60,hh:+p.hour,mm:p.minute};
  }
  function fmt(h){
    var H=Math.floor(h)%24,m=Math.round((h-Math.floor(h))*60),ap;
    if(AR){ap=H<12?'ص':'م';var t=(H%12||12)+(m?':'+(m<10?'0':'')+m:'');return t+' '+ap}
    ap=H<12?'am':'pm';return (H%12||12)+(m?':'+(m<10?'0':'')+m:'')+ap;
  }
  function clock(){
    var n=now(),t=fmt(n.hh+(+n.mm)/60);
    document.querySelectorAll('[data-clock]').forEach(function(el){
      el.textContent=AR?('مفتوح الآن · الساعة '+t+' في جدة'):('Open now · '+t+' in Jeddah');
    });
  }
  function status(){
    var n=now();
    document.querySelectorAll('[data-sched]').forEach(function(card){
      var s;try{s=JSON.parse(card.getAttribute('data-sched'))}catch(e){return}
      var today=s[n.d]!==undefined?s[n.d]:(s['*']||[]);
      var st=card.querySelector('.st');if(!st)return;
      var on=null,next=null;
      today.forEach(function(r){if(n.h>=r[0]&&n.h<r[1])on=r;else if(r[0]>n.h&&(!next||r[0]<next[0]))next=r});
      st.className='st';var lab;
      if(on){st.classList.add('is-on');lab=AR?('في العيادة الآن · حتى '+fmt(on[1])):('In clinic now · until '+fmt(on[1]));card.dataset.rank=0}
      else if(next){st.classList.add('is-later');lab=AR?('اليوم من '+fmt(next[0])):('In today from '+fmt(next[0]));card.dataset.rank=1}
      else{st.classList.add('is-off');lab=AR?'لا يوجد دوام الآن':'Not in clinic now';card.dataset.rank=2}
      st.querySelector('span').textContent=lab;
    });
    document.querySelectorAll('[data-sort-duty]').forEach(function(track){
      var cards=[].slice.call(track.children);
      cards.sort(function(a,b){return (a.dataset.rank||2)-(b.dataset.rank||2)||(a.dataset.order-b.dataset.order)});
      cards.forEach(function(c){track.appendChild(c)});
      var on=cards.filter(function(c){return c.dataset.rank==='0'}).length,out=document.querySelector('[data-duty-count]');
      if(out)out.textContent=AR?(on+' من أطبائنا في العيادة الآن'):(on+(on===1?' doctor':' doctors')+' in clinic right now');
    });
  }
  clock();status();setInterval(function(){clock();status()},60000);

  // doctors page filter
  document.querySelectorAll('[data-filter]').forEach(function(bar){
    var btns=[].slice.call(bar.querySelectorAll('button')),cards=[].slice.call(document.querySelectorAll('.dcard'));
    btns.forEach(function(b){b.addEventListener('click',function(){
      var f=b.getAttribute('data-f');btns.forEach(function(x){x.setAttribute('aria-pressed',x===b)});
      cards.forEach(function(c){var show=f==='all'||c.getAttribute('data-dep')===f;c.hidden=!show;if(show)c.classList.add('is-in')});
      var live=document.querySelector('[data-filter-live]');if(live)live.textContent=cards.filter(function(c){return !c.hidden}).length+(AR?' طبيب':' doctors shown');
    })});
  });
  // doctors page cards rise in
  var dc=document.querySelectorAll('.dcard');
  if(dc.length&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    dc.forEach(function(c,i){c.style.transitionDelay=(i%4)*70+'ms';io.observe(c)});
  }else dc.forEach(function(c){c.classList.add('is-in')});

  // services index: mark the section in view
  var idx=document.querySelectorAll('.svc__idx a');
  if(idx.length&&'IntersectionObserver' in window){
    var map={};idx.forEach(function(a){map[a.getAttribute('href').slice(1)]=a});
    var io2=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){idx.forEach(function(a){a.classList.remove('is-on')});var a=map[e.target.id];if(a)a.classList.add('is-on')}})},{rootMargin:'-40% 0px -55% 0px'});
    document.querySelectorAll('.dep[id]').forEach(function(s){io2.observe(s)});
  }
})();
