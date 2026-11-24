/* Crossroads concept: header, menu, hero entrance, live open status (Regina time, no DST) */
(function(){
  var d=document.documentElement,RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // header hairline on scroll
  var hd=document.querySelector('.hd');
  function sc(){if(hd)hd.classList.toggle('is-scrolled',scrollY>8)}
  addEventListener('scroll',sc,{passive:true});sc();

  // mobile menu sheet
  var btn=document.querySelector('.hd__menu'),sheet=document.getElementById('sheet'),outside=[].slice.call(document.querySelectorAll('main,footer'));
  function setMenu(open){
    d.classList.toggle('menu-open',open);btn.setAttribute('aria-expanded',open);btn.querySelector('span').textContent=open?'Close':'Menu';
    sheet.toggleAttribute('inert',!open);sheet.setAttribute('aria-hidden',!open);
    outside.forEach(function(e){e.toggleAttribute('inert',open)});
    if(open){var a=sheet.querySelector('a');a&&a.focus()}else btn.focus();
  }
  if(btn&&sheet){
    sheet.setAttribute('inert','');sheet.setAttribute('aria-hidden','true');
    btn.addEventListener('click',function(){setMenu(!d.classList.contains('menu-open'))});
    addEventListener('keydown',function(e){if(e.key==='Escape'&&d.classList.contains('menu-open'))setMenu(false)});
    sheet.addEventListener('click',function(e){if(e.target.closest('a[href^="#"],a[href*=".html#"]'))setMenu(false)});
    matchMedia('(min-width:1080px)').addEventListener('change',function(m){if(m.matches&&d.classList.contains('menu-open'))setMenu(false)});
  }

  // hero / page-head entrance (lines rise, photo opens)
  var heads=document.querySelectorAll('.hero,.ph');
  function go(){heads.forEach(function(h){h.classList.add('is-in')})}
  if(RM)go();else requestAnimationFrame(function(){setTimeout(go,60)});

  // live status: Mon–Fri 8:30–9pm, Sat 8:30–5pm, Sun 9–3 (massage, when available)
  var H={1:[8.5,21],2:[8.5,21],3:[8.5,21],4:[8.5,21],5:[8.5,21],6:[8.5,17],0:[9,15]};
  var fmt=function(h){var hh=Math.floor(h),m=Math.round((h-hh)*60),ap=hh>=12?'pm':'am',x=hh%12||12;return x+(m?':'+(m<10?'0':'')+m:'')+' '+ap};
  var names=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  try{
    var p=new Intl.DateTimeFormat('en-US',{timeZone:'America/Regina',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(p.find(function(x){return x.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    var s=H[day],open=s&&now>=s[0]&&now<s[1],txt;
    if(open)txt=day===0?'Open now · Sunday massage until 3 pm':'Open now · until '+fmt(s[1]);
    else{var nd=day,first=true;if(!(s&&now<s[0])){nd=(day+1)%7;first=false}txt='Closed now · opens '+(first?'today':(nd===(day+1)%7?'tomorrow':names[nd]))+' '+fmt(H[nd][0])}
    document.querySelectorAll('[data-status]').forEach(function(el){el.hidden=false;el.classList.add(open?'is-open':'is-shut');el.querySelector('span').textContent=txt});
  }catch(e){}
})();
