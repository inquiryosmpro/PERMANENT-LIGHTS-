(function(){
// EDIT PRICES HERE (CAD). front = [low, high]; SIDE = per easy side; BACK = [low, high]. Large / estate = custom quote.
var P={'Detached':{front:[3000,4000]},'Semi-detached':{front:[2200,3000]},'Bungalow':{front:[2500,3500]}},SIDE=800,BACK=[1000,1500];
// FORM EMAILS: get a free access key at https://web3forms.com (enter inquiry@osmpro.ca) and paste it here.
var WEB3FORMS_KEY=var WEB3FORMS_KEY='5c0f2739-38e9-4c23-8fde-5b4b9a2ccad7';
var f=document.getElementById('est'),steps=[].slice.call(f.querySelectorAll('.step')),cur=0;
var all=document.getElementById('all'),cov=[].slice.call(f.querySelectorAll('input[name=coverage]:not(#all)'));
function $(id){return document.getElementById(id)}
function chk(n){return f.querySelector('input[name='+n+']:checked')}
function anyc(n){return !!chk(n)}
function val(n){return f.elements[n].value.trim()}
function okField(n){return val(n)&&f.elements[n].checkValidity()}
function ok(i){var s=steps[i].dataset.step;
 if(s==='house'||s==='time')return anyc(s==='house'?'house':'timeline');
 if(s==='coverage')return anyc('coverage');if(s==='reason')return anyc('reason');
 if(s==='address')return val('address').length>3;
 return okField('name')&&val('phone').replace(/\D/g,'').length>=10&&okField('email');}
function update(){
 steps[cur].querySelectorAll('.next').forEach(function(b){b.disabled=!ok(cur)});
 var n=[anyc('house'),anyc('coverage'),anyc('reason'),anyc('timeline'),val('address').length>3,okField('name'),val('phone').replace(/\D/g,'').length>=10,okField('email')].filter(Boolean).length;
 var p=Math.round(n/8*50);$('dfill').style.width=p+'%';$('dstat').textContent='Your estimate is loading… '+p+'%';
 $('calc').disabled=!ok(steps.length-1);
}
function show(n){cur=n;steps.forEach(function(s,k){s.classList.toggle('on',k===n)});$('back').hidden=n===0;$('tfill').style.width=(n/steps.length*100)+'%';update();window.scrollTo({top:0});}
function next(){if(ok(cur)&&cur<steps.length-1)show(cur+1);}
$('back').onclick=function(){if(cur>0)show(cur-1)};
f.querySelectorAll('.next').forEach(function(b){b.onclick=next});
f.addEventListener('change',function(e){
 if(e.target.id==='all'){cov.forEach(function(x){x.checked=all.checked});}
 else if(e.target.name==='coverage'){all.checked=cov.every(function(y){return y.checked});}
 update();
 if(e.target.type==='radio')setTimeout(next,250);
});
f.addEventListener('input',update);
f.addEventListener('keydown',function(e){if(e.key==='Enter'&&e.target.tagName==='INPUT'&&e.target.name==='address'){e.preventDefault();next();}});
function money(n){return '$'+n.toLocaleString('en-CA')}
function compute(){
 var h=chk('house').value,c=function(v){return f.querySelector('input[name=coverage][value="'+v+'"]').checked};
 if(!P[h])return {txt:'Custom quote',note:'We’ll price your '+h.toLowerCase()+' property after a quick review.'};
 var p=P[h],lo=0,hi=0;
 if(c('Front')){lo+=p.front[0];hi+=p.front[1];}
 ['Left side','Right side'].forEach(function(s){if(c(s)){lo+=SIDE;hi+=SIDE;}});
 if(c('Back')){lo+=BACK[0];hi+=BACK[1];}
 var areas=cov.filter(function(x){return x.checked}).map(function(x){return x.value.toLowerCase()}).join(', ');
 return {txt:money(lo)+' – '+money(hi),note:h+' home: '+areas+'. Plus HST.'};
}
function list(n){return [].slice.call(f.querySelectorAll('input[name='+n+']:checked')).map(function(x){return x.value}).join(', ')}
function send(r){
 if(!WEB3FORMS_KEY||WEB3FORMS_KEY.indexOf('PASTE')===0||val('bot-field'))return;
 var d={access_key:WEB3FORMS_KEY,subject:'New estimate request: '+val('name')+' ('+r.txt+')',from_name:'OSMPRO Permanent Lights',name:val('name'),email:val('email'),phone:val('phone'),address:val('address'),home_type:chk('house').value,areas:list('coverage'),reasons:list('reason'),timeline:chk('timeline').value,estimate:r.txt,notes:f.elements.message.value};
 try{fetch('https://api.web3forms.com/submit',{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},body:JSON.stringify(d)}).catch(function(){});}catch(e){}
}
$('calc').onclick=function(){
 if(!ok(steps.length-1))return;
 var r=compute();$('estimate').value=r.txt;
 send(r);
 $('wizard').hidden=true;$('loading').hidden=false;window.scrollTo({top:0});
 var v=$('vid'),done=false,fb=false;
 function pct(p){$('lfill').style.width=p+'%';$('lstat').textContent=(p<100?'Your estimate is loading… ':'Your estimate is ready ')+Math.round(p)+'%';}
 function finish(){if(done)return;done=true;pct(100);$('price').textContent=r.txt;$('note').textContent=r.note;setTimeout(function(){$('result').hidden=false;$('result').scrollIntoView({behavior:'smooth',block:'center'});},500);}
 function fallback(){if(fb||done)return;fb=true;v.style.display='none';var t=0,iv=setInterval(function(){t++;pct(50+t*5);if(t>=10){clearInterval(iv);finish();}},800);}
 pct(50);
 v.ontimeupdate=function(){if(v.duration)pct(50+50*v.currentTime/v.duration)};
 v.onended=finish;v.onerror=fallback;$('vsrc').onerror=fallback;
 var pr=v.play();if(pr&&pr.catch)pr.catch(function(){v.muted=true;var p2=v.play();if(p2&&p2.catch)p2.catch(fallback);});
 setTimeout(function(){if(v.readyState===0)fallback();},5000);
};
show(0);
})();
