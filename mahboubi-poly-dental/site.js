/* Mahboubi concept: header state + rail open dot. Kit motion lives in kit.js. */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var f=function(){hd.classList.toggle('is-scrolled',window.scrollY>8)};f();window.addEventListener('scroll',f,{passive:true})}
  // Jumeirah hours, Dubai time: Sun-Wed 9:30-20:00, Thu & Sat 9:30-18:00, Fri closed
  var H={0:[9.5,20],1:[9.5,20],2:[9.5,20],3:[9.5,20],4:[9.5,18],6:[9.5,18]};
  try{
    var p=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
    var g=function(t){return(p.find(function(x){return x.type===t})||{}).value};
    var d=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].indexOf(g('weekday')),n=(+g('hour')%24)+(+g('minute'))/60;
    var s=H[d]||[],open=s.length===2&&n>=s[0]&&n<s[1];
    document.querySelectorAll('[data-open-dot]').forEach(function(el){
      el.classList.toggle('is-open',open);
      el.setAttribute('title',open?(el.getAttribute('data-on')||'Open now'):(el.getAttribute('data-off')||'Closed now'));
      var l=el.querySelector('.vh');if(l)l.textContent=el.getAttribute('title');
    });
  }catch(e){}
})();
