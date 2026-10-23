/* Anthrock concept: small site script (kit.js holds the kit sections) */
(function(){
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  // header shadow
  var hd=document.querySelector('.hd');
  if(hd){var f=function(){hd.classList.toggle('is-scrolled',scrollY>8)};addEventListener('scroll',f,{passive:true});f()}
  // hero: split the name into letters and play the entrance once
  var hero=document.querySelector('.hero');
  if(hero){
    requestAnimationFrame(function(){requestAnimationFrame(function(){hero.classList.add('is-on')})});
  }
  // header open/closed, Sydney time (Mon-Fri 6am-4pm, Sat by appointment)
  var b=document.querySelector('[data-open]');
  if(b){
    var p=new Intl.DateTimeFormat('en-US',{timeZone:'Australia/Sydney',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(k){return(p.find(function(x){return x.type===k})||{}).value};
    var d=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),h=(+g('hour')%24)+(+g('minute'))/60;
    var open=d>=1&&d<=5&&h>=6&&h<16;
    var txt=open?'Open now · till 4pm':(d>=1&&d<=5&&h<6?'Closed now · opens 6am':(d>=1&&d<=4?'Closed now · opens 6am':'Closed now · opens Mon 6am'));
    b.querySelector('span').textContent=txt;b.classList.toggle('is-open',open);b.hidden=false;
  }
  // reveal fail-safe: anything already scrolled past (or on screen) after load/scroll gets shown
  if(!RM){var chk=function(){var vh=innerHeight;document.querySelectorAll('[data-reveal]:not(.is-in)').forEach(function(e){var r=(e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e).getBoundingClientRect();if(r.top<vh*0.95)e.classList.add('is-in')})};
    var st;addEventListener('scroll',function(){clearTimeout(st);st=setTimeout(chk,250)},{passive:true});addEventListener('load',function(){setTimeout(chk,2500)});}
  // services page: highlight the index entry for the block in view
  var idx=document.querySelectorAll('.svc__idx a');
  if(idx.length&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){idx.forEach(function(a){a.classList.toggle('is-on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-40% 0px -55% 0px'});
    document.querySelectorAll('.block[id]').forEach(function(s){io.observe(s)});
  }
})();
