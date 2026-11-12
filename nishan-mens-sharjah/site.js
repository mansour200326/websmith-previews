/* Nishan concept: small extras on top of kit.js */
(function(){
  // header gets a hairline once the page moves
  var top=document.querySelector('.top');
  if(top){var f=function(){top.classList.toggle('is-stuck',scrollY>8)};addEventListener('scroll',f,{passive:true});f()}

  // the bilingual sign: NISHAN and نيشان at equal letter height, each up to 45% of the band (full width when stacked)
  var band=document.querySelector('.hero__band');
  if(band){
    var en=band.querySelector('.hero__en'),ar=band.querySelector('.hero__ar');
    var ink=function(font,txt){var c=document.createElement('canvas').getContext('2d');c.font=font;var m=c.measureText(txt);return m.actualBoundingBoxAscent+m.actualBoundingBoxDescent};
    var fit=function(){
      var stacked=innerWidth<=700,avail=band.clientWidth*(stacked?.8:.45);
      var capEn=ink('900 100px "Big Shoulders Display"','NISHAN')/100,alef=ink('800 100px "Noto Kufi Arabic"','\u0627')/100;
      if(!capEn||!alef)return;
      [en,ar].forEach(function(e){e.style.fontSize='100px'});
      var we=en.firstElementChild.getBoundingClientRect().width/100,wa=ar.firstElementChild.getBoundingClientRect().width/100;
      // sizes so cap heights match: sEn*capEn = sAr*alef
      var r=capEn/alef,sEn=Math.min(avail/we,avail/(wa*r));
      sEn=Math.min(sEn,innerHeight*(stacked?.085:.115)/capEn);
      en.style.fontSize=sEn+'px';ar.style.fontSize=(sEn*r)+'px';
      var head=band.closest('.hero__head');if(head)document.documentElement.style.setProperty('--hero-top',Math.round(head.getBoundingClientRect().bottom+scrollY)+'px');
    };
    (document.fonts&&document.fonts.ready?document.fonts.ready:Promise.resolve()).then(fit);
    var t;addEventListener('resize',function(){clearTimeout(t);t=setTimeout(fit,120)});
  }

  // services page: mark the category you are reading in the side index
  var links=[].slice.call(document.querySelectorAll('.svc__index a'));
  if(links.length&&'IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){a.classList.toggle('is-on',a.getAttribute('href')==='#'+e.target.id)})}})},{rootMargin:'-40% 0px -55% 0px'});
    links.forEach(function(a){var s=document.querySelector(a.getAttribute('href'));if(s)io.observe(s)});
  }
})();
