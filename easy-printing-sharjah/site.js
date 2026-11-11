/* Easy Printing & Designing concept: small site behaviours (kit.js does the motion). */
(function(){
  var AR=document.documentElement.lang==='ar';
  var WA='971509100152';

  /* days to UAE National Day (2 December), Dubai time; hidden after the day */
  var cd=document.querySelector('[data-nd-count]');
  if(cd){
    var p=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Dubai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date()).split('-');
    var today=Date.UTC(+p[0],+p[1]-1,+p[2]),nd=Date.UTC(+p[0],11,2),d=Math.round((nd-today)/864e5);
    if(d>1&&d<=60){cd.querySelector('b').textContent=d;cd.hidden=false}
    else if(d===1||d===0){cd.querySelector('b').textContent=AR?(d?'بكرة':'اليوم'):(d?'Tomorrow':'Today');var u=cd.querySelector('[data-unit]');if(u)u.textContent=AR?'عيد الاتحاد':'is National Day';cd.hidden=false}
  }

  /* order docket: builds the WhatsApp message, never submits anything */
  var dk=document.querySelector('[data-docket]');
  if(dk){
    var out=dk.querySelector('[data-docket-out]'),go=dk.querySelector('[data-docket-go]');
    var q=dk.querySelector('[name=qty]'),by=dk.querySelector('[name=by]');
    function build(){
      var it=dk.querySelector('[name=item]:checked'),item=it?it.value:'';
      var t=AR
        ? 'مرحبا Easy Printing & Designing،\nأبا عرض سعر لـ: '+(item||'___')+'\nالكمية: '+(q.value.trim()||'___')+'\nأحتاجها قبل: '+(by.value.trim()||'___')+'\nبرسل لكم الشعار أو التصميم هنا.'
        : 'Hi Easy Printing & Designing,\nI\'d like a quote for: '+(item||'___')+'\nQuantity: '+(q.value.trim()||'___')+'\nNeeded by: '+(by.value.trim()||'___')+'\nI\'ll send my logo / artwork here.';
      out.textContent=t;go.href='https://wa.me/'+WA+'?text='+encodeURIComponent(t);
    }
    dk.addEventListener('input',build);dk.addEventListener('change',build);build();
  }

  /* colour bars draw in when they reach the screen */
  var bars=document.querySelectorAll('.cbar--draw:not(.hero .cbar)');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('is-in');io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px'});
    bars.forEach(function(b){io.observe(b)});
  } else bars.forEach(function(b){b.classList.add('is-in')});

  /* phone action bar appears once the hero buttons scroll away */
  var mb=document.querySelector('.mbar'),hero=document.querySelector('[data-hero-acts]');
  if(mb){
    if(hero&&'IntersectionObserver' in window){new IntersectionObserver(function(e){mb.classList.toggle('is-on',!e[0].isIntersecting&&e[0].boundingClientRect.top<0)}).observe(hero)}
    else mb.classList.add('is-on');
  }

  /* close the phone menu after picking a link */
  document.querySelectorAll('.menu__panel a').forEach(function(a){a.addEventListener('click',function(){a.closest('details').open=false})});
})();

/* round 3: hero caption swaps at the middle of the crossfade; National Day swipe row is a labelled region on phones */
(function(){
  document.querySelectorAll('.reel__meta').forEach(function(meta){
    var src=meta.querySelector('[data-k-seq-cap]'),cnt=meta.querySelector('[data-k-seq-count]');
    var oc=meta.querySelector('[data-cap-out]'),on=meta.querySelector('[data-cnt-out]');
    if(!src||!oc)return;
    var RM=matchMedia('(prefers-reduced-motion: reduce)').matches,t=null;
    new MutationObserver(function(){
      clearTimeout(t);
      if(RM){oc.textContent=src.textContent;if(on&&cnt)on.textContent=cnt.textContent;return}
      meta.classList.add('is-swap');
      t=setTimeout(function(){oc.textContent=src.textContent;if(on&&cnt)on.textContent=cnt.textContent;meta.classList.remove('is-swap')},600);
    }).observe(src,{childList:true,characterData:true,subtree:true});
  });
  var row=document.querySelector('[data-gift-row]');
  if(row){
    var mq=matchMedia('(max-width:639px)');
    var set=function(){if(mq.matches){row.setAttribute('role','region');row.setAttribute('tabindex','0');row.setAttribute('aria-label',row.getAttribute('data-label'))}else{row.removeAttribute('role');row.removeAttribute('tabindex');row.removeAttribute('aria-label')}};
    set();mq.addEventListener?mq.addEventListener('change',set):mq.addListener(set);
  }
})();
