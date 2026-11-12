/* Velvet Beauty Salon concept: small site behaviours on top of kit.js */
(function(){
  // header turns solid after the hero starts scrolling
  var h=document.querySelector('.hdr');
  if(h){var on=function(){h.classList.toggle('is-solid',window.scrollY>40)};on();addEventListener('scroll',on,{passive:true})}

  // "open today" line in the hero, Dubai time. Hours from their Fresha listing.
  var t=document.querySelector('[data-today]');
  if(t){
    var H={0:[12,22],1:[12,22],2:[12,22],3:[12,22],4:[12,22],5:[13,22],6:[12,22]};
    var ar=document.documentElement.lang==='ar';
    var p=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(k){return(p.find(function(x){return x.type===k})||{}).value};
    var d=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    var s=H[d],open=now>=s[0]&&now<s[1],before=now<s[0];
    var fmt=function(x){return ar?(x===12?'12 ظهراً':x===13?'1 ظهراً':(x-12)+' مساءً'):(x===12?'12pm':(x-12)+'pm')};
    var dot=t.querySelector('.dot'),txt=t.querySelector('b');
    if(dot&&!open)dot.classList.add('is-shut');
    // Find-us badge: never "Closed now" in red; say when we open instead (Fannan r2)
    var vb=document.querySelector('.k-visit__badge');
    if(vb&&!open){var nx=before?s[0]:H[(d+1)%7][0];var vt=ar?(before?'نفتح اليوم ':'نفتح غداً ')+fmt(nx):(before?'Opens today at ':'Opens tomorrow at ')+fmt(nx);
      var setB=function(){vb.hidden=false;vb.classList.remove('is-shut');vb.classList.add('is-later');var sp=vb.querySelector('span');if(sp)sp.textContent=vt};
      setB();setTimeout(setB,0)}
    if(txt){
      if(ar)txt.textContent=open?'مفتوح الآن، حتى 10 مساءً':(before?'نفتح اليوم '+fmt(s[0]):'مغلق الآن، نفتح غداً '+fmt(H[(d+1)%7][0]));
      else txt.textContent=open?'Open now, until 10pm':(before?'Opens today at '+fmt(s[0]):'Closed now, opens tomorrow at '+fmt(H[(d+1)%7][0]));
    }
  }

  // services page: highlight the category in view
  var idx=document.querySelector('.price__idx');
  if(idx&&'IntersectionObserver' in window){
    var links=[].slice.call(idx.querySelectorAll('a'));
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){var on=a.getAttribute('href')==='#'+e.target.id;a.classList.toggle('is-on',on);if(on&&idx.scrollWidth>idx.clientWidth){a.scrollIntoView({block:'nearest',inline:'center',behavior:'smooth'})}})}})},{rootMargin:'-35% 0px -60% 0px'});
    document.querySelectorAll('.grp[id]').forEach(function(g){io.observe(g)});
  }
})();
