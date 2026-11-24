(function(){
var svg=document.getElementById('roof');if(!svg)return;
var scenes={'Warm white':['#ffe3a8'],'Christmas':['#ff3b3b','#2ecc71','#fff3d0'],'Halloween':['#ff7a00','#9b59ff'],'Canada Day':['#ff2d2d','#ffffff'],'Valentine’s':['#ff5fa2','#ff2d55','#ffffff']};
var pts=[],N=18,i,t;
for(i=0;i<N;i++){t=i/N;pts.push([40+t*460,125-t*100]);}
for(i=0;i<N;i++){t=i/N;pts.push([500+t*460,25+t*100]);}
pts.push([960,125]);
var ns='http://www.w3.org/2000/svg',bulbs=[];
pts.forEach(function(p){var c=document.createElementNS(ns,'circle');c.setAttribute('cx',p[0]);c.setAttribute('cy',p[1]);c.setAttribute('r',6);svg.appendChild(c);bulbs.push(c);});
function set(name){var cols=scenes[name];bulbs.forEach(function(b,k){var c=cols[k%cols.length];b.setAttribute('fill',c);b.style.color=c;});
document.querySelectorAll('.scenes button').forEach(function(x){x.setAttribute('aria-pressed',x.textContent===name);});}
var box=document.querySelector('.scenes');
Object.keys(scenes).forEach(function(n){var b=document.createElement('button');b.textContent=n;b.onclick=function(){set(n)};box.appendChild(b);});
set('Warm white');
})();
