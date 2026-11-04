/* Services page: two clinic groups (Dental / Skin), each with its own tab bar, plus price search across every row. */
(function(){
  var root=document.querySelector('[data-smenu]');if(!root)return;
  var RM=matchMedia('(prefers-reduced-motion: reduce)').matches;
  var groups=[].slice.call(root.querySelectorAll('[data-group]'));
  var lists=[].slice.call(root.querySelectorAll('[data-group-tabs]'));
  var panels=[].slice.call(root.querySelectorAll('[data-panel]'));
  panels.forEach(function(p){[].forEach.call(p.querySelectorAll('.k-menu__item'),function(li,i){li.style.setProperty('--i',i)})});
  function tabsOf(l){return [].slice.call(l.querySelectorAll('[role=tab]'))}
  function line(l){var b=l.querySelector('[aria-selected=true]'),ink=l.querySelector('.k-menu__ink');if(!b||!ink||l.hidden)return;ink.style.width=b.offsetWidth+'px';ink.style.transform='translateX('+b.offsetLeft+'px)'}
  function pick(b){
    var l=b.closest('[data-group-tabs]');
    tabsOf(l).forEach(function(x){var on=x===b;x.setAttribute('aria-selected',on);x.tabIndex=on?0:-1});
    panels.forEach(function(p){var on=p.dataset.panel===b.dataset.tab;p.hidden=!on;p.classList.remove('is-in');if(on)requestAnimationFrame(function(){requestAnimationFrame(function(){p.classList.add('is-in')})})});
    line(l);
    if(l.scrollWidth>l.clientWidth){var x=b.offsetLeft-(l.clientWidth-b.offsetWidth)/2;l.scrollTo({left:x,behavior:RM?'auto':'smooth'})}
  }
  function group(g){
    groups.forEach(function(x){x.setAttribute('aria-pressed',x.dataset.group===g)});
    var cur;lists.forEach(function(l){var on=l.dataset.groupTabs===g;l.hidden=!on;if(on)cur=l});
    if(cur)pick(cur.querySelector('[aria-selected=true]')||tabsOf(cur)[0]);
  }
  groups.forEach(function(x){x.addEventListener('click',function(){group(x.dataset.group)})});
  lists.forEach(function(l){
    tabsOf(l).forEach(function(b){b.addEventListener('click',function(){pick(b)})});
    l.addEventListener('keydown',function(e){
      if(e.key!=='ArrowRight'&&e.key!=='ArrowLeft')return;
      var bs=tabsOf(l),i=bs.findIndex(function(b){return b.getAttribute('aria-selected')==='true'});
      var fwd=(e.key==='ArrowRight')!==(getComputedStyle(l).direction==='rtl');
      var n=bs[(i+(fwd?1:-1)+bs.length)%bs.length];n.focus();pick(n);e.preventDefault();
    });
  });
  function fromHash(scroll){
    var h=location.hash.slice(1);
    if(h==='skin'||h==='dental'){group(h);if(scroll){var t=root.querySelector('.sgroups');t.scrollIntoView({behavior:RM?'auto':'smooth',block:'start'})}return true}
  }
  if(!fromHash(false))group('dental');
  addEventListener('hashchange',function(){fromHash(true)});
  root.addEventListener('click',function(e){var a=e.target.closest&&e.target.closest('a[href="#skin"],a[href="#dental"]');if(a)setTimeout(function(){fromHash(true)},0)});
  document.querySelectorAll('a.dept__go').forEach(function(a){a.addEventListener('click',function(){setTimeout(function(){fromHash(true)},0)})});
  addEventListener('resize',function(){lists.forEach(line)});
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){lists.forEach(line)});

  /* price search: filters every row across all tabs and both clinics */
  var input=document.querySelector('[data-pfind]');if(!input)return;
  var out=document.querySelector('[data-pfind-out]');
  var items=[].slice.call(root.querySelectorAll('.k-menu__item'));
  var norm=function(s){return s.toLowerCase().replace(/[أإآ]/g,'ا').replace(/ة/g,'ه').replace(/ى/g,'ي')};
  items.forEach(function(li){li._t=norm(li.textContent)});
  var lang=document.documentElement.lang;
  input.addEventListener('input',function(){
    var q=norm(input.value.trim());
    if(!q){root.classList.remove('is-search');items.forEach(function(li){li.hidden=false});
      panels.forEach(function(p){p.classList.remove('is-empty')});out.textContent='';return}
    root.classList.add('is-search');var n=0;
    items.forEach(function(li){var hit=li._t.indexOf(q)>-1;li.hidden=!hit;if(hit)n++});
    panels.forEach(function(p){p.classList.add('is-in');p.classList.toggle('is-empty',!p.querySelector('.k-menu__item:not([hidden])'))});
    out.textContent=lang==='ar'?(n?n+' نتيجة':'لا توجد نتائج، اتصل بنا على 920007882'):(n?n+(n===1?' treatment':' treatments')+' found':'Nothing found. Call us on 920007882 and ask.');
  });
})();
