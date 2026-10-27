/* Pearly White concept: header state + live open/closed with split shifts (Muscat time). */
(function(){
  var h=document.querySelector('.hdr');
  if(h){var f=function(){h.classList.toggle('is-scrolled',scrollY>8)};f();addEventListener('scroll',f,{passive:true})}
  document.querySelectorAll('[data-pw-hours]').forEach(function(root){
    var spans={};try{spans=JSON.parse(root.getAttribute('data-pw-hours'))}catch(e){}
    var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Muscat',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
    var day=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),now=(+g('hour')%24)+(+g('minute'))/60;
    var row=root.querySelector('tr[data-day="'+day+'"]');if(row)row.classList.add('is-today');
    var open=(spans[day]||[]).some(function(s){return now>=s[0]&&now<s[1]});
    var b=root.querySelector('[data-k-badge]');
    if(b){b.hidden=false;b.classList.add(open?'is-open':'is-shut');b.querySelector('span').textContent=open?(root.getAttribute('data-open')||'Open now'):(root.getAttribute('data-shut')||'Closed now')}
  });
})();
