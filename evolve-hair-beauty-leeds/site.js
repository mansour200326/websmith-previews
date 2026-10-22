/* Evolve concept: header state + live opening status in UK time (hours from their contact page). */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var on=function(){hd.classList.toggle('is-scrolled',scrollY>8)};addEventListener('scroll',on,{passive:true});on();}
  // JS day index 0=Sun. Tuesday - Saturday 9:00 - 18:00, Thursday 9:00 - 20:00.
  var H={2:[9,18],3:[9,18],4:[9,20],5:[9,18],6:[9,18]};
  var D=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  var fmt=function(h){return h<12?h+'am':(h===12?'12pm':(h-12)+'pm')};
  var p=new Intl.DateTimeFormat('en-GB',{timeZone:'Europe/London',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
  var g=function(t){return(p.find(function(x){return x.type===t})||{}).value};
  var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
  var t=H[day],open=t&&now>=t[0]&&now<t[1],txt;
  if(open)txt='Open now, until '+fmt(t[1]);
  else if(t&&now<t[0])txt='Closed now, opens at '+fmt(t[0]);
  else{for(var i=1;i<=7;i++){var d=(day+i)%7;if(H[d]){txt='Closed now, open '+(i===1?'tomorrow':D[d])+' from '+fmt(H[d][0]);break}}}
  document.querySelectorAll('[data-status]').forEach(function(el){el.hidden=false;el.classList.toggle('is-open',!!open);el.querySelector('span').textContent=txt});
  document.querySelectorAll('.hours tr[data-day="'+day+'"]').forEach(function(r){r.classList.add('is-today')});
})();
