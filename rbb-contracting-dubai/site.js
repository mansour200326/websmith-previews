/* RBB concept: live Dubai clock in the header (idea from BCG Building Design's local clock) */
(function(){
  var els=document.querySelectorAll('[data-clock]');if(!els.length)return;
  var ar=document.documentElement.lang==='ar';
  function tick(){
    var t=new Intl.DateTimeFormat(ar?'ar-AE-u-nu-latn':'en-GB',{timeZone:'Asia/Dubai',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date());
    els.forEach(function(e){e.textContent=t});
  }
  tick();setInterval(tick,15000);
})();
