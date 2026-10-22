/* Shepparton Service Centre concept: live open chip (Shepparton time, Mon–Fri 8–5) */
(function(){
  var chip=document.querySelector('[data-open-chip]');if(!chip)return;
  try{
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Australia/Melbourne',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var d=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    var open=d>=1&&d<=5&&now>=8&&now<17;
    chip.classList.add(open?'is-open':'is-shut');
    var b=chip.querySelector('[data-state]');
    var s=chip.querySelector('[data-when]');
    if(open){b.textContent='Open now';s.textContent='Until 5pm today. Call (03) 5831 2866'}
    else{
      var next=(d>=1&&d<=5&&now<8)?'today':(d===5||d===6||d===0)?'Monday':'tomorrow';
      if(d===4&&now>=17)next='tomorrow';
      b.textContent='Closed now';s.textContent='Opens 8am '+next+', Mon–Fri 8–5';
    }
  }catch(e){}
})();
