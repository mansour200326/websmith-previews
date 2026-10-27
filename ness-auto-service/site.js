/* Ness Auto Service concept: live "open now" panel in Winnipeg time (hours from their site: Mon-Fri 8am-6pm). */
(function(){
  var el=document.querySelector('[data-now]');if(!el)return;
  var parts=new Intl.DateTimeFormat('en-US',{timeZone:'America/Winnipeg',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
  var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
  var days=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'],d=days.indexOf(g('weekday')),h=(+g('hour')%24)+(+g('minute'))/60;
  var work=function(x){return x>=1&&x<=5};
  var open=work(d)&&h>=8&&h<18,msg;
  if(open)msg='Open now, till 6pm';
  else if(work(d)&&h<8)msg='Closed, opens 8am';
  else{var n=(d+1)%7;while(!work(n))n=(n+1)%7;msg='Closed, opens '+(n===(d+1)%7?'tomorrow':['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][n])+' 8am'}
  el.querySelector('b').textContent=msg;
  el.classList.add(open?'is-open':'is-shut');
  var i=el.querySelector('i');if(i)i.hidden=false;
})();
