(function(){
  var header=document.getElementById('top');
  var nav=document.querySelector('nav');
  var links=[].slice.call(nav.querySelectorAll('#anav'));
  var secs=links.map(function(a){return document.querySelector(a.getAttribute('href'));});
  function update(){
    var h=header.offsetHeight, y=window.scrollY||0;
    header.style.opacity=Math.max(0,1-y/(h*0.7));
    var top=Math.max(0,h-y);
    nav.style.setProperty('--nt',top+'px');
    nav.classList.toggle('stuck',top===0);
    var cur=0;
    secs.forEach(function(s,i){if(s.getBoundingClientRect().top<window.innerHeight*0.4)cur=i;});
    links.forEach(function(a,i){a.classList.toggle('active',y>h*0.5&&i===cur);});
  }
  window.addEventListener('scroll',update,{passive:true});
  window.addEventListener('resize',update);
  update();
})();



(function(){
var reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
function setup(c){var d=window.devicePixelRatio||1,w=c.clientWidth,h=c.clientHeight;c.width=w*d;c.height=h*d;var x=c.getContext("2d");x.setTransform(d,0,0,d,0,0);return{x:x,w:w,h:h}}
var lerp=function(a,b,t){return a+(b-a)*t};

/* Balloon */
var spots=[[-.5,-.45],[.1,-.62],[.55,-.3],[-.62,.1],[-.02,-.05],[.5,.25],[-.3,.5],[.2,.58]];
var b={c:document.getElementById("balloon")},g={c:document.getElementById("galaxy")};
var s1=document.getElementById("s1"),s2=document.getElementById("s2");
var cur1=s1.value/100,cur2=s2.value/100;

function drawBalloon(t){
 var S=b.s,x=S.x,w=S.w,h=S.h;x.clearRect(0,0,w,h);
 var r=lerp(48,Math.min(150,w*.34),t),rx=r,ry=r*1.12,cx=w/2,cy=Math.min(185,h*.5);
 var by=cy+ry;
 x.strokeStyle="rgba(120,130,145,.8)";x.lineWidth=1.5;x.beginPath();x.moveTo(cx,by+9);
 x.bezierCurveTo(cx-14,by+50,cx+16,by+90,cx-4,h-4);x.stroke();
 var gr=x.createRadialGradient(cx-rx*.35,cy-ry*.4,r*.1,cx,cy,r*1.2);
 gr.addColorStop(0,"#ff6a62");gr.addColorStop(.45,"#d9202b");gr.addColorStop(1,"#8d0f1a");
 x.fillStyle=gr;x.beginPath();x.ellipse(cx,cy,rx,ry,0,0,Math.PI*2);x.fill();
 x.beginPath();x.moveTo(cx,by-2);x.lineTo(cx-9,by+11);x.lineTo(cx+9,by+11);x.closePath();x.fillStyle="#a8141f";x.fill();
 x.fillStyle="rgba(255,255,255,.28)";x.beginPath();x.ellipse(cx-rx*.42,cy-ry*.45,rx*.12,ry*.22,-.6,0,Math.PI*2);x.fill();
 var p=spots.map(function(q){return[cx+q[0]*rx,cy+q[1]*ry]});
 x.fillStyle="#0c0c0e";p.forEach(function(q){x.beginPath();x.arc(q[0],q[1],6.5,0,Math.PI*2);x.fill()});
}

/* Galaxies */
var gal=[[0,0]],seed=7;
function rnd(){seed=(seed*16807)%2147483647;return seed/2147483647}
for(var tries=0;tries<6000&&gal.length<200;tries++){var gx=(rnd()-.5)*36,gy=(rnd()-.5)*21,ok=true;
 for(var k2=0;k2<gal.length;k2++){var dx=gal[k2][0]-gx,dy=gal[k2][1]-gy;if(dx*dx+dy*dy<2.6){ok=false;break}}
 if(ok)gal.push([gx,gy])}
var off=gal.map(function(){return[0,0]});
var tgt=1; // marked galaxy index
function drawGalaxy(t){
 var S=g.s,x=S.x,w=S.w,h=S.h,cx=w/2,cy=h/2,sc=lerp(.45,1.7,t),u=58*sc;
 x.fillStyle="#12163a";x.fillRect(0,0,w,h);
 var fa=(1-t)*.2;
 if(fa>.01){var f=u/4,m=Math.ceil(Math.max(w,h)/f/2)+1;x.lineWidth=1;x.strokeStyle="rgba(140,160,255,"+fa+")";x.beginPath();
 for(var j=-m;j<=m;j++){x.moveTo(cx+j*f,0);x.lineTo(cx+j*f,h);x.moveTo(0,cy+j*f);x.lineTo(w,cy+j*f)}
 x.stroke()}
 x.lineWidth=1;x.strokeStyle="rgba(140,160,255,.24)";x.beginPath();
 var n=Math.ceil(Math.max(w,h)/u/2)+1;
 for(var i=-n;i<=n;i++){x.moveTo(cx+i*u,0);x.lineTo(cx+i*u,h);x.moveTo(0,cy+i*u);x.lineTo(w,cy+i*u)}
 x.stroke();
 var pos=gal.map(function(q,i){return[cx+(q[0]+off[i][0])*u,cy+(q[1]+off[i][1])*u]});
 pos.forEach(function(q,i){
  if(q[0]<-30||q[0]>w+30||q[1]<-30||q[1]>h+30)return;
  var a=i*1.9,col=i==0?"255,200,120":"170,190,255";
  x.save();x.translate(q[0],q[1]);x.rotate(a);x.scale(1,.62);
  var gl=x.createRadialGradient(0,0,0,0,0,18);gl.addColorStop(0,"rgba("+col+",.4)");gl.addColorStop(1,"rgba("+col+",0)");
  x.fillStyle=gl;x.beginPath();x.arc(0,0,18,0,Math.PI*2);x.fill();
  x.lineCap="round";x.lineWidth=2;x.strokeStyle="rgba("+col+",.9)";
  for(var k=0;k<2;k++){x.beginPath();for(var th=0;th<=5.2;th+=.2){var rr=1.5+th*2.3,an=th+k*Math.PI,px=Math.cos(an)*rr,py=Math.sin(an)*rr;if(th==0)x.moveTo(px,py);else x.lineTo(px,py)}x.stroke()}
  x.fillStyle="#fff6df";x.beginPath();x.arc(0,0,2.4,0,Math.PI*2);x.fill();
  x.restore();
 });
 var a=pos[0];
 x.font="600 13px system-ui,sans-serif";x.fillStyle="#ffd9a8";x.fillText("Milky Way",a[0]+12,a[1]+26);
 document.getElementById("r2a").textContent=sc.toFixed(2)+"×";
}

function layout(){b.s=setup(b.c);g.s=setup(g.c);drawBalloon(cur1);drawGalaxy(cur2)}
addEventListener("resize",layout);layout();

function tick(){
 var t1=s1.value/100,t2=s2.value/100,dirty=false;
 if(Math.abs(t1-cur1)>.0005){cur1=reduce?t1:cur1+(t1-cur1)*.18;dirty=true;drawBalloon(cur1)}
 if(Math.abs(t2-cur2)>.0005){cur2=reduce?t2:cur2+(t2-cur2)*.18;dirty=true;drawGalaxy(cur2)}
 requestAnimationFrame(tick);
}
tick();
})();