(function(){
var v=document.querySelector('.sceneview');if(!v)return;
var imgs=[].slice.call(v.querySelectorAll('img')),box=document.querySelector('.scenes'),btns=[],cur=0,timer=null,stopped=false;
var rm=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function set(i){cur=i;imgs.forEach(function(im,k){im.classList.toggle('on',k===i)});btns.forEach(function(b,k){b.setAttribute('aria-pressed',String(k===i))});}
function stop(){if(timer){clearInterval(timer);timer=null}}
imgs.forEach(function(im,i){var b=document.createElement('button');b.type='button';b.textContent=im.dataset.name;b.onclick=function(){stopped=true;stop();set(i)};box.appendChild(b);btns.push(b)});
set(0);
if(!rm&&'IntersectionObserver' in window){new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting&&!timer&&!stopped){timer=setInterval(function(){set((cur+1)%imgs.length)},3500)}else if(!e.isIntersecting){stop()}})},{threshold:.5}).observe(v);}
})();
