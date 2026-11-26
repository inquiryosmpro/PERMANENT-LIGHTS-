(function(){
var h=document.getElementById('hdr'),t=document.querySelector('.navtoggle'),n=document.getElementById('nav');
function sc(){if(h)h.classList.toggle('sc',window.scrollY>8)}sc();window.addEventListener('scroll',sc,{passive:true});
if(t&&n){t.onclick=function(){var o=n.classList.toggle('open');t.setAttribute('aria-expanded',String(o))};n.addEventListener('click',function(e){if(e.target.tagName==='A'){n.classList.remove('open');t.setAttribute('aria-expanded','false')}});}
var els=[].slice.call(document.querySelectorAll('.rv,.lifebar'));
if('IntersectionObserver' in window){var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.12,rootMargin:'0px 0px -40px 0px'});els.forEach(function(x){io.observe(x)});}
else els.forEach(function(x){x.classList.add('in')});
var pv=[].slice.call(document.querySelectorAll('.pv video')),rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
pv.forEach(function(v){v.addEventListener('click',function(){v.paused?v.play():v.pause()})});
if(pv.length&&'IntersectionObserver' in window&&!rm){var vo=new IntersectionObserver(function(es){es.forEach(function(e){var v=e.target;if(e.isIntersecting){var p=v.play();if(p&&p.catch)p.catch(function(){})}else v.pause()})},{threshold:.4});pv.forEach(function(v){vo.observe(v)});}
})();
