/* Polish Beauty Lounge concept: small page helpers. Loaded BEFORE kit.js so the price list starts on the right tab. */
(function(){
  var hd=document.querySelector('.hd');
  if(hd){var on=false;var f=function(){var s=scrollY>8;if(s!==on){on=s;hd.classList.toggle('is-stuck',s)}};addEventListener('scroll',f,{passive:true});f();}
  // home: the header wordmark comes back once the big name in the hero has scrolled away
  var hero=document.querySelector('.hero h1');
  if(hero&&document.body.classList.contains('is-home')){
    var g=function(){document.body.classList.toggle('past-hero',hero.getBoundingClientRect().bottom<70)};addEventListener('scroll',g,{passive:true});g();
  }

  // Services page. Without JS every price group shows; with JS only one does.
  // The tab named in the URL (#nails, #hair ...) is chosen before kit 12 reads aria-selected.
  var menu=document.querySelector('[data-k-menu]');if(!menu)return;
  var btns=[].slice.call(menu.querySelectorAll('[data-k-menu-tabs] [data-tab]')),panels=[].slice.call(menu.querySelectorAll('[data-panel]'));
  var want=location.hash.replace('#','');if(!btns.some(function(b){return b.dataset.tab===want}))want=btns[0].dataset.tab;
  btns.forEach(function(b){b.setAttribute('aria-selected',b.dataset.tab===want)});
  // the chosen group shows straight away (kit 12 only animates rows in once 15% of the whole menu is on screen)
  panels.forEach(function(p){var on=p.dataset.panel===want;p.hidden=!on;p.classList.toggle('pb-first',on)});
  btns.forEach(function(b){b.addEventListener('click',function(){panels.forEach(function(p){p.classList.remove('pb-first')})})});
  // kit 12 measures the tab underline at start-up; measure again once the web fonts have loaded
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(function(){dispatchEvent(new Event('resize'))});
  addEventListener('load',function(){dispatchEvent(new Event('resize'))});
  // phones: bring the chosen tab into view inside the sideways-scrolling tab row
  addEventListener('load',function(){var t=menu.querySelector('[data-k-menu-tabs]'),b=btns.filter(function(x){return x.dataset.tab===want})[0];if(!t||!b||b===btns[0])return;
    var tr=t.getBoundingClientRect(),br=b.getBoundingClientRect(),rtl=getComputedStyle(t).direction==='rtl';
    t.scrollLeft+=rtl?(br.right-tr.right)+16:(br.left-tr.left)-16;});
  if(location.hash&&want===location.hash.slice(1))addEventListener('load',function(){menu.scrollIntoView()});
})();
