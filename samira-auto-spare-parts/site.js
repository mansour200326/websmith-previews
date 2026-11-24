/* Samira Auto Spare Parts concept (Websmith). Reveal layer + magnetic from kit 18/19, plus branch hours and the part-request slip. */
(function(){
  var d=document.documentElement,AR=d.lang==='ar',RM=matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* mobile menu */
  var mb=document.querySelector('.menu-btn'),nav=document.getElementById('nav');
  if(mb&&nav){mb.addEventListener('click',function(){var o=nav.classList.toggle('is-open');mb.setAttribute('aria-expanded',o);mb.textContent=o?(AR?'إغلاق':'Close'):(AR?'القائمة':'Menu')});
    nav.addEventListener('click',function(e){if(e.target.closest('a')){nav.classList.remove('is-open');mb.setAttribute('aria-expanded','false');mb.textContent=AR?'القائمة':'Menu'}})}

  /* kit 18: reveals */
  document.querySelectorAll('[data-reveal-stagger]').forEach(function(p){var s=+p.getAttribute('data-reveal-stagger')||90;[].forEach.call(p.querySelectorAll('[data-reveal]'),function(c,i){if(!c.hasAttribute('data-reveal-delay'))c.setAttribute('data-reveal-delay',i*s)})});
  document.querySelectorAll('[data-reveal-delay]').forEach(function(e){e.style.setProperty('--k-rv-delay',e.getAttribute('data-reveal-delay')+'ms')});
  function split(el){
    if(!el.dataset.kTxt)el.dataset.kTxt=el.innerHTML;
    el.innerHTML=el.dataset.kTxt;var said=el.textContent.trim().replace(/\s+/g,' ');
    var esc=function(t){return t.replace(/&/g,'&amp;').replace(/</g,'&lt;')},parts=[];
    [].slice.call(el.childNodes).forEach(function(n){if(n.nodeType===3)n.textContent.split(/\s+/).forEach(function(w){if(w)parts.push(esc(w))});else if(n.nodeType===1&&n.tagName!=='BR')parts.push(n.outerHTML)});
    el.innerHTML=parts.map(function(h){return'<span class="k-rv-w">'+h+'</span>'}).join(' ');
    var lines=[],top=null;[].forEach.call(el.children,function(w){var t=w.getBoundingClientRect().top;if(top===null||Math.abs(t-top)>2){lines.push([]);top=t}lines[lines.length-1].push(w.innerHTML)});
    el.innerHTML='<span class="sr">'+esc(said)+'</span>'+lines.map(function(l,i){return'<span class="k-rv-line" aria-hidden="true"><span style="--l:'+i+'">'+l.join(' ')+'</span></span>'}).join('');
    el.classList.add('k-rv-ready');
  }
  var lineEls=[].slice.call(document.querySelectorAll('[data-reveal=lines]'));
  if(!RM){
    var ready=function(){lineEls.forEach(split)};
    if(document.fonts&&document.fonts.ready)document.fonts.ready.then(ready);else ready();
    var rw=innerWidth;addEventListener('resize',function(){if(Math.abs(innerWidth-rw)>40){rw=innerWidth;lineEls.forEach(function(e){var on=e.classList.contains('is-in');split(e);if(on)e.classList.add('is-in')})}});
  }
  var els=document.querySelectorAll('[data-reveal]');
  if(RM||!('IntersectionObserver' in window)){els.forEach(function(e){e.classList.add('is-in')})}
  else{
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){(e.target.__kRv||[e.target]).forEach(function(x){x.classList.add('is-in')});io.unobserve(e.target)}})},{rootMargin:'0px 0px -8% 0px',threshold:0});
    els.forEach(function(e){var t=e.getAttribute('data-reveal')==='clip'&&e.parentElement?e.parentElement:e;(t.__kRv=t.__kRv||[]).push(e);io.observe(t)});
  }

  /* kit 19: magnetic */
  if(matchMedia('(hover:hover) and (pointer:fine)').matches&&!RM){
    document.querySelectorAll('[data-k-magnetic]').forEach(function(el){
      var k=parseFloat(el.getAttribute('data-k-magnetic'))||.25;
      el.addEventListener('pointermove',function(e){var r=el.getBoundingClientRect();el.classList.add('is-mag');el.style.transform='translate3d('+((e.clientX-r.left-r.width/2)*k).toFixed(1)+'px,'+((e.clientY-r.top-r.height/2)*k).toFixed(1)+'px,0)'});
      el.addEventListener('pointerleave',function(){el.classList.remove('is-mag');el.style.transform=''});
    });
  }

  /* branch hours: data-hours='[[8,13.5],[15.5,21]]' Sat-Thu, Friday closed (Dubai time) */
  var parts=new Intl.DateTimeFormat('en-US',{timeZone:'Asia/Dubai',weekday:'short',hour:'numeric',minute:'numeric',hour12:false}).formatToParts(new Date());
  var g=function(t){return(parts.find(function(p){return p.type===t})||{}).value};
  var day=g('weekday'),now=(+g('hour')%24)+(+g('minute'))/60;
  document.querySelectorAll('[data-hours]').forEach(function(b){
    var spans=[];try{spans=JSON.parse(b.getAttribute('data-hours'))}catch(e){}
    var open=day!=='Fri'&&spans.some(function(s){return now>=s[0]&&now<s[1]});
    var txt;
    if(open)txt=AR?'مفتوح الآن':'Open now';
    else if(day!=='Fri'&&now>=spans[0][1]&&now<spans[1][0])txt=AR?'استراحة الظهر، نفتح 3:30':'Lunch break, back at 3:30pm';
    else txt=AR?'مغلق الآن':'Closed now';
    b.hidden=false;b.classList.toggle('is-open',open);b.querySelector('span').textContent=txt;
  });

  /* part-request slip: builds an email to the chosen branch */
  var slip=document.getElementById('slip');
  if(slip){
    var $=function(id){return document.getElementById(id)};
    var send=$('slip-send'),call=$('slip-call'),label=$('slip-branch-name');
    function upd(){
      var o=$('branch').selectedOptions[0],mail=o.getAttribute('data-mail'),tel=o.getAttribute('data-tel'),tels=o.getAttribute('data-tel-show');
      var make=$('make').value,vin=$('vin').value.trim().toUpperCase(),part=$('part').value.trim(),qty=$('qty').value.trim(),ph=$('phone').value.trim();
      var subj=(AR?'طلب قطعة':'Part request')+(make?' · '+make:'')+(part?' · '+part:'');
      var body=AR
        ?['السلام عليكم،','','أبحث عن قطعة أصلية:','الماركة: '+(make||''),'رقم الشاصي (VIN): '+vin,'القطعة أو رقمها: '+part,'الكمية: '+(qty||'1'),'','رقمي: '+ph,'','شكراً']
        :['Hello Samira,','','I am looking for a genuine part:','Make: '+(make||''),'Chassis number (VIN): '+vin,'Part name or number: '+part,'Quantity: '+(qty||'1'),'','My phone: '+ph,'','Thank you'];
      send.href='mailto:'+mail+'?subject='+encodeURIComponent(subj)+'&body='+encodeURIComponent(body.join('\n'));
      call.href='tel:'+tel;call.querySelector('span').textContent=tels;
      if(label)label.textContent=o.textContent;
    }
    slip.addEventListener('input',upd);slip.addEventListener('change',upd);upd();
    slip.addEventListener('submit',function(e){e.preventDefault();location.href=send.href});
    document.querySelectorAll('[data-make]').forEach(function(a){a.addEventListener('click',function(){var m=$('make');m.value=a.getAttribute('data-make');upd()})});
  }
})();
