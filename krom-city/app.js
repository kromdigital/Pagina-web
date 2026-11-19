(function(){
const $=s=>document.querySelector(s);
// Equalizer bars
const hs=Array.from({length:24},(_,i)=>[35,75,100,55,85,45][i%6]);
$('#meter').innerHTML=hs.map((h,i)=>`<span style="--h:${h}%;--i:${i%5}"></span>`).join('');
// Clock
function tick(){const n=new Date();$('#clock').textContent=n.toLocaleTimeString('es-MX',{hour:'2-digit',minute:'2-digit',hour12:false});$('#date').textContent=n.toLocaleDateString('es-MX',{weekday:'long',day:'2-digit',month:'short'}).toUpperCase().replace(/\./g,'')}
tick();setInterval(tick,1000);
// Controls
const fs=()=>{try{document.fullscreenElement?document.exitFullscreen():document.documentElement.requestFullscreen()}catch(e){}};
const hud=()=>document.body.classList.toggle('clean');
$('#bf').onclick=fs;$('#bh').onclick=hud;
addEventListener('keydown',e=>{const k=e.key.toLowerCase();if(k==='f')fs();if(k==='h')hud()});
addEventListener('dblclick',hud);

// ---- Musica: synthwave generado en el navegador (sin archivos) + barras reactivas
let AC,an,mg,dl,NB,tm,ext=null,playing=false,stp=0,nt=0,LV=0;
const meter=$('#meter'),bars=[...meter.children],fdata=new Uint8Array(64),mtof=n=>440*Math.pow(2,(n-69)/12);
const PR=[{b:45,c:[57,60,64]},{b:41,c:[53,57,60]},{b:48,c:[60,64,67]},{b:43,c:[55,59,62]}];
function initAudio(){if(AC)return;AC=new(window.AudioContext||window.webkitAudioContext)();
 const cp=AC.createDynamicsCompressor();mg=AC.createGain();mg.gain.value=.7;an=AC.createAnalyser();an.fftSize=128;an.smoothingTimeConstant=.78;
 mg.connect(cp);cp.connect(an);an.connect(AC.destination);
 dl=AC.createDelay(1);dl.delayTime.value=.47;const fb=AC.createGain();fb.gain.value=.33;dl.connect(fb);fb.connect(dl);const dg=AC.createGain();dg.gain.value=.5;dl.connect(dg);dg.connect(mg);
 NB=AC.createBuffer(1,AC.sampleRate,AC.sampleRate);const d=NB.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1}
function osc(type,f,t,dur,g,flt,send){const o=AC.createOscillator(),v=AC.createGain(),l=AC.createBiquadFilter();o.type=type;o.frequency.value=f;l.type='lowpass';l.frequency.value=flt;
 v.gain.setValueAtTime(0,t);v.gain.linearRampToValueAtTime(g,t+.01);v.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(l);l.connect(v);v.connect(mg);if(send)v.connect(dl);o.start(t);o.stop(t+dur+.05)}
function noise(t,dur,g,type,f){const o=AC.createBufferSource(),v=AC.createGain(),l=AC.createBiquadFilter();o.buffer=NB;l.type=type;l.frequency.value=f;
 v.gain.setValueAtTime(g,t);v.gain.exponentialRampToValueAtTime(.0001,t+dur);o.connect(l);l.connect(v);v.connect(mg);o.start(t);o.stop(t+dur+.05)}
function kick(t){const o=AC.createOscillator(),v=AC.createGain();o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(42,t+.12);
 v.gain.setValueAtTime(1,t);v.gain.exponentialRampToValueAtTime(.0001,t+.28);o.connect(v);v.connect(mg);o.start(t);o.stop(t+.3)}
function pad(ch,t,dur){ch.forEach(n=>[-6,6].forEach(dt=>{const o=AC.createOscillator(),v=AC.createGain(),l=AC.createBiquadFilter();o.type='sawtooth';o.frequency.value=mtof(n);o.detune.value=dt;l.type='lowpass';l.frequency.value=900;
 v.gain.setValueAtTime(0,t);v.gain.linearRampToValueAtTime(.035,t+.5);v.gain.linearRampToValueAtTime(0,t+dur);o.connect(l);l.connect(v);v.connect(mg);o.start(t);o.stop(t+dur+.1)}))}
function beat(n,t){const bar=PR[(n>>4)&3],k=n&15;
 if(k%4===0)kick(t);if(k===4||k===12)noise(t,.18,.35,'bandpass',1800);if(k%2===1)noise(t,.04,.12,'highpass',7000);
 if(k%2===0)osc('sawtooth',mtof(bar.b),t,.2,.28,k%4===0?380:260);
 osc('square',mtof(bar.c[[0,1,2,1][k%4]]+(k%8>=4?19:12)),t,.14,.05,2600,true);
 if(k===0)pad(bar.c,t,2.7)}
function sched(){while(nt<AC.currentTime+.15){beat(stp,nt);nt+=.15625;stp=(stp+1)&63}}
const ctl=document.querySelector('.ctl'),bm=document.createElement('button'),bl=document.createElement('button'),fi=document.createElement('input');
bm.textContent='♪';bm.title='Música (M)';bl.textContent='♫';bl.title='Link de YouTube/Spotify o archivo de audio';fi.type='file';fi.accept='audio/*';fi.hidden=true;ctl.append(bm,bl,fi);
function startMusic(){playing=true;bm.classList.add('on');if(ext)ext.play();else{nt=AC.currentTime+.05;stp=0;tm=setInterval(sched,30)}}
function stopMusic(){playing=false;bm.classList.remove('on');clearInterval(tm);if(ext)ext.pause()}
function toggleMusic(){if(emb){const h=mp.style.opacity==='0';mp.style.opacity=h?'1':'0';mp.style.pointerEvents=h?'':'none';return}initAudio();if(AC.state==='suspended')AC.resume();playing?stopMusic():startMusic()}
// ---- Link de YouTube / Spotify: reproductor embebido (las barras bailan con ritmo simulado)
let mp=null,emb=false,ytSt=null;
function parseLink(u){let x;try{x=new URL(u.trim())}catch(e){return null}const h=x.hostname.replace(/^(www\.|m\.|music\.)/,''),p=x.pathname.split('/').filter(Boolean),Y='https://www.youtube.com/embed/',O='autoplay=1&playsinline=1&enablejsapi=1';
 if(h==='youtu.be'&&p[0])return{k:'yt',src:`${Y}${p[0]}?${O}&loop=1&playlist=${p[0]}`};
 if(h==='youtube.com'){const l=x.searchParams.get('list'),v=x.searchParams.get('v')||(['shorts','embed','live'].includes(p[0])?p[1]:null);
  if(v)return{k:'yt',src:`${Y}${v}?${O}&loop=1`+(l?`&list=${l}`:`&playlist=${v}`)};
  if(l)return{k:'yt',src:`${Y}videoseries?list=${l}&${O}&loop=1`}}
 if(h==='open.spotify.com'){const i=p.findIndex(a=>['track','album','playlist','artist','episode','show'].includes(a));if(i>=0&&p[i+1])return{k:'sp',src:`https://open.spotify.com/embed/${p[i]}/${p[i+1]}?utm_source=generator&theme=0`}}
 return null}
function closeEmbed(){if(mp)mp.remove();mp=null;emb=false;bm.classList.remove('on')}
function openEmbed(c){closeEmbed();if(playing)stopMusic();
 mp=document.createElement('div');mp.style.cssText='position:fixed;z-index:6;top:max(54px,calc(env(safe-area-inset-top) + 40px));right:12px;width:min(250px,calc(100vw - 24px));background:rgba(10,2,6,.88);border:1px solid rgba(255,40,70,.6);box-shadow:0 0 18px rgba(255,23,56,.4);transition:opacity .3s';
 const hd=document.createElement('div');hd.style.cssText='display:flex;justify-content:space-between;align-items:center;padding:4px 8px;font:700 9px Orbitron,sans-serif;letter-spacing:2px;color:#ff7585';hd.innerHTML='<span>♫ KROM PLAYER</span>';
 const cx=document.createElement('button');cx.textContent='✕';cx.title='Cerrar reproductor';cx.style.cssText='background:none;border:0;color:#ff7585;cursor:pointer;font-size:12px';cx.onclick=closeEmbed;hd.append(cx);
 const f=document.createElement('iframe');f.src=c.src;f.allow='autoplay; encrypted-media; picture-in-picture';f.style.cssText=`border:0;display:block;width:100%;height:${c.k==='yt'?'200px':'152px'}`;
 f.onload=()=>{if(c.k==='yt')try{f.contentWindow.postMessage(JSON.stringify({event:'listening',id:1,channel:'widget'}),'*')}catch(e){}};
 mp.append(hd,f);document.body.append(mp);emb=true;ytSt=null;bm.classList.add('on')}
const embPlaying=()=>emb&&(ytSt===null||ytSt===1||ytSt===3||ytSt===5);
addEventListener('message',e=>{if(!emb||!/youtube/.test(e.origin))return;let d;try{d=JSON.parse(e.data)}catch(_){return}const st=d.event==='onStateChange'?d.info:d.info&&d.info.playerState;if(typeof st==='number')ytSt=st});
bm.onclick=toggleMusic;bl.onclick=()=>{const u=prompt('Pega un link de YouTube o Spotify.\nDeja vacío para elegir un archivo de audio de tu dispositivo.');if(u===null)return;if(!u.trim()){fi.click();return}const c=parseLink(u);c?openEmbed(c):alert('No reconocí ese link. Usa un link de youtube.com, youtu.be u open.spotify.com')};
fi.onchange=()=>{const f=fi.files[0];if(!f)return;closeEmbed();initAudio();if(AC.state==='suspended')AC.resume();if(playing)stopMusic();
 ext=new Audio(URL.createObjectURL(f));ext.loop=true;AC.createMediaElementSource(ext).connect(mg);startMusic()};
addEventListener('keydown',e=>{if(e.key.toLowerCase()==='m')toggleMusic()});
(function viz(){requestAnimationFrame(viz);
 if(embPlaying()){const t=performance.now()/1000,bp=Math.pow(Math.max(0,Math.sin(t*Math.PI*1.7)),3);meter.classList.add('live');
  bars.forEach((b,i)=>{const v=Math.min(1,.18+.5*Math.abs(Math.sin(t*(1.3+i*.17)+i))*(1-i/36)+bp*(.55-i*.012));b.style.height=Math.max(6,v*100)+'%'});LV=bp*.8;return}
 if(!an||!playing){if(LV>0){LV*=.9;if(LV<.02){LV=0;meter.classList.remove('live');bars.forEach(b=>b.style.height='')}}return}
 an.getByteFrequencyData(fdata);meter.classList.add('live');let sum=0;
 bars.forEach((b,i)=>{const v=Math.pow(fdata[1+Math.floor(Math.pow(i/24,1.5)*38)]/255,1.3);b.style.height=Math.max(6,v*100)+'%';if(i<4)sum+=v});LV=sum/4})();

function go(){if(!window.THREE)return;
let seed=11;const R=()=>(seed=seed*16807%2147483647)/2147483647;
const small=innerWidth<700,big=innerWidth>1400;
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2(0x090207,.027);
const cam=new THREE.PerspectiveCamera(54,innerWidth/innerHeight,.1,200);cam.position.set(0,7.5,25);
const rd=new THREE.WebGLRenderer({antialias:big,alpha:true,powerPreference:'low-power'});
const pr=()=>Math.min(devicePixelRatio,big?2:1.5);
rd.setPixelRatio(pr());rd.setSize(innerWidth,innerHeight);rd.outputEncoding=THREE.sRGBEncoding;rd.toneMapping=THREE.ACESFilmicToneMapping;rd.toneMappingExposure=1.25;
$('#scene').prepend(rd.domElement);

scene.add(new THREE.AmbientLight(0x5b1726,1.5));
const red=new THREE.PointLight(0xff123d,95,75);red.position.set(0,12,3);scene.add(red);
const back=new THREE.PointLight(0x6c102b,100,90);back.position.set(0,14,-35);scene.add(back);

const gnd=new THREE.Mesh(new THREE.PlaneGeometry(220,220),new THREE.MeshStandardMaterial({color:0x090509,roughness:.42,metalness:.65}));
gnd.rotation.x=-Math.PI/2;gnd.position.y=-.15;scene.add(gnd);
const road=new THREE.Mesh(new THREE.PlaneGeometry(12,130),new THREE.MeshStandardMaterial({color:0x10060b,metalness:.8,roughness:.22}));
road.rotation.x=-Math.PI/2;road.position.set(0,-.08,-30);scene.add(road);
const lm=new THREE.MeshBasicMaterial({color:0xff183d});
[-5.7,5.7,-1.9,1.9].forEach(x=>{const l=new THREE.Mesh(new THREE.PlaneGeometry(Math.abs(x)>5?.045:.018,110),lm);l.rotation.x=-Math.PI/2;l.position.set(x,-.045,-30);scene.add(l)});

// Buildings (windows merged into one InstancedMesh for performance)
const mats=[[0x10080d,0x21020a],[0x160910,0x330411],[0x090a10,0x17040c]].map(a=>new THREE.MeshStandardMaterial({color:a[0],roughness:.6,metalness:.55,emissive:a[1],emissiveIntensity:.5}));
const wins=[];const edgeA=new THREE.MeshBasicMaterial({color:0xff183d}),edgeB=new THREE.MeshBasicMaterial({color:0x8f102c});
const CH=[0,1,2,3].map(()=>{const c=document.createElement('canvas');c.width=128;c.height=256;return{c,x:c.getContext('2d'),t:new THREE.CanvasTexture(c)}});
const WCH=[0,1,2].map(()=>{const c=document.createElement('canvas');c.width=512;c.height=256;return{c,x:c.getContext('2d'),t:new THREE.CanvasTexture(c)}});
function grid(cx,cz,len,h,rot){const cols=Math.max(2,Math.floor(len/.65)),rows=Math.max(3,Math.floor(h/1.15));
 for(let r=1;r<rows;r++)for(let c=0;c<cols;c++){if(R()>.5)continue;const q=R(),u=-len/2+.35+c*(len-.55)/cols;
  wins.push([rot?cx:cx+u,r*(h/rows),rot?cz+u:cz,q>.93?2:q>.35?1:0,rot])}}
function building(x,z,w,h,d,i,col){
 const b=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),mats[i%3]);b.position.set(x,h/2-.1,z);scene.add(b);
 const em=i%3===0?edgeA:edgeB;
 [-w/2,w/2].forEach(sx=>{const e=new THREE.Mesh(new THREE.BoxGeometry(.035,h*.96,.04),em);e.position.set(x+sx,h/2,z+d/2+.025);scene.add(e)});
 const sd=x>0?-1:1,rot=sd*Math.PI/2;
 grid(x+sd*(w/2+.03),z,d,h,rot);grid(x,z+d/2+.03,w,h,0);
 if(col===0&&R()<.7){const sh=Math.min(d*1.7,h*.6),sc=new THREE.Mesh(new THREE.PlaneGeometry(sh/2,sh),new THREE.MeshBasicMaterial({map:CH[(R()*4)|0].t}));
  sc.position.set(x+sd*(w/2+.07),h*.55,z);sc.rotation.y=rot;scene.add(sc)}
 if(z>-45&&R()<.8){const nb=h>16&&R()<.6?2:1;for(let k=0;k<nb;k++){const bw=w*.92,bh=bw*.5,cy=Math.min(h-bh/2-.5,Math.max(bh/2+1.5,h*(.32+k*.36+R()*.1)));
  const bm2=new THREE.Mesh(new THREE.PlaneGeometry(bw,bh),new THREE.MeshBasicMaterial({map:WCH[(R()*3)|0].t}));bm2.position.set(x,cy,z+d/2+.09);scene.add(bm2)}}
 if(i%4===0){const a=new THREE.Mesh(new THREE.BoxGeometry(.045,1.4,.045),em);a.position.set(x+w*.22,h+.6,z);scene.add(a)}
}
let n=0;
for(const s of[-1,1])for(let row=0;row<9;row++){const z=-row*8-3,cnt=row<3?2:3;
 for(let i=0;i<cnt;i++)building(s*(8.5+i*5.2+R()*1.5),z+R()*3,3.4+R()*2.3,8+R()*(row<3?16:25),4+R()*2.5,n++,i)}
const wm=new THREE.InstancedMesh(new THREE.PlaneGeometry(.26,.42),new THREE.MeshBasicMaterial({color:0xffffff}),wins.length),M=new THREE.Matrix4(),D=new THREE.Object3D(),C=[0x751329,0xff294b,0xffe6ea,0x1a0510].map(c=>new THREE.Color(c));
wins.forEach((w,i)=>{D.position.set(w[0],w[1],w[2]);D.rotation.y=w[4];D.updateMatrix();wm.setMatrixAt(i,D.matrix);wm.setColorAt(i,C[w[3]])});wm.frustumCulled=false;scene.add(wm);

// Signs: KROM-themed vertical holograms + hero sign at the end of the avenue
function signTex(t){const c=document.createElement('canvas');c.width=128;c.height=512;const x=c.getContext('2d');
 x.fillStyle='rgba(30,0,8,.55)';x.fillRect(0,0,128,512);x.strokeStyle='#ff4960';x.lineWidth=4;x.strokeRect(4,4,120,504);
 x.fillStyle='#ffe9ec';x.shadowColor='#ff1738';x.shadowBlur=14;x.textAlign='center';x.textBaseline='middle';
 const s=Math.min(84,460/t.length);x.font=`800 ${s*.8}px Orbitron,sans-serif`;[...t].forEach((ch,i)=>x.fillText(ch,64,256+(i-(t.length-1)/2)*s));return new THREE.CanvasTexture(c)}
const still0=matchMedia('(prefers-reduced-motion:reduce)').matches;let heroR=still0?1:0;
function ft(x,txt,maxW,size,wgt){let z=size;do{x.font=`${wgt} ${z}px Orbitron,sans-serif`;z-=2}while(x.measureText(txt).width>maxW&&z>8)}
const hc=document.createElement('canvas');hc.width=1024;hc.height=256;const hx=hc.getContext('2d');
function drawHero(g){const x=hx;x.clearRect(0,0,1024,256);x.fillStyle=`rgba(8,1,5,${.55*Math.min(1,heroR*3)})`;x.fillRect(10,10,1004,236);x.save();x.textAlign='center';x.textBaseline='middle';if('letterSpacing'in x)x.letterSpacing='14px';
 const base=(dx,col,al)=>{const main=col==='#fff0f2',T='KROM DIGITAL',S='WEB · APPS · VIDEO · MARKETING';x.save();x.translate(dx,0);x.shadowColor='#ff1738';x.shadowBlur=g?8:24;
  x.globalAlpha=al*Math.min(1,heroR*5);x.strokeStyle=main?'#ff4960':col;x.lineWidth=5;x.strokeRect(10,10,1004,236);
  const ls=v=>{if('letterSpacing'in x)x.letterSpacing=v};ls('10px');x.fillStyle=col;ft(x,T,900,130,800);
  const tw=x.measureText(T).width,n=Math.floor(heroR*T.length+.001),cut=n>=T.length?1024:517-tw/2+x.measureText(T.slice(0,n)).width;
  if(heroR<1){x.globalAlpha=al*.12;x.fillText(T,517,100)}
  x.globalAlpha=heroR<1?al*(.65+Math.random()*.35):al;x.save();x.beginPath();x.rect(0,0,cut,256);x.clip();x.fillText(T,517,100);x.restore();
  ls('5px');x.fillStyle=main?'#ff7585':col;ft(x,S,840,34,700);x.globalAlpha=al*Math.max(0,Math.min(1,(heroR-.75)*4));x.fillText(S,515,205);x.restore()};
 if(g){const d=6+g*14;base(-d,'#ff1738',.9);base(d,'#ffffff',.55)}
 base(0,'#fff0f2',g&&Math.random()<.3?.45:1);
 if(g){for(let k=0;k<2+g*4;k++){const y=Math.random()*230|0,h=6+Math.random()*34|0,o=(Math.random()-.5)*120*g;x.drawImage(hc,0,y,1024,h,o,y,1024,h)}
  x.fillStyle='rgba(5,3,5,.9)';for(let k=0;k<2;k++)x.fillRect(Math.random()*900,Math.random()*240,40+Math.random()*120,3+Math.random()*7)}
 x.restore()}
drawHero(0);const heroT=new THREE.CanvasTexture(hc);
const names=['KROM','KD','WEB','APPS','VIDEO','MARKETING'],tex=names.map(signTex);
for(let i=0;i<14;i++){const s=i%2?1:-1,z=-8-R()*55,x=s*(8+R()*9);
 const p=new THREE.Mesh(new THREE.PlaneGeometry(1.3,5.2),new THREE.MeshBasicMaterial({map:tex[i%6],transparent:true,opacity:.9,side:THREE.DoubleSide,depthWrite:false}));
 p.position.set(x,8+R()*8,z);p.lookAt(0,8,z-15);scene.add(p)}
const hero=new THREE.Mesh(new THREE.PlaneGeometry(32,8),new THREE.MeshBasicMaterial({map:heroT,transparent:true,fog:false,depthWrite:false,depthTest:false}));
hero.position.set(0,22,-64);hero.renderOrder=10;scene.add(hero);

// Rain + dust
const RC=small?700:big?1700:1150,rp=new Float32Array(RC*3);
for(let i=0;i<RC;i++){rp[i*3]=(R()-.5)*(big?70:42);rp[i*3+1]=R()*28;rp[i*3+2]=R()*-75+8}
const rg=new THREE.BufferGeometry();rg.setAttribute('position',new THREE.BufferAttribute(rp,3));
scene.add(new THREE.Points(rg,new THREE.PointsMaterial({color:0xff6378,size:.055,transparent:true,opacity:.62})));
const dp=new Float32Array(540);for(let i=0;i<180;i++){dp[i*3]=(R()-.5)*34;dp[i*3+1]=R()*18;dp[i*3+2]=-R()*65}
const dg=new THREE.BufferGeometry();dg.setAttribute('position',new THREE.BufferAttribute(dp,3));
scene.add(new THREE.Points(dg,new THREE.PointsMaterial({color:0xff183d,size:.075,transparent:true,opacity:.7})));
// Skyline (wider for landscape screens)
const sm=new THREE.MeshBasicMaterial({color:0x12050b});
for(let i=0;i<48;i++){const w=2+R()*4,h=5+R()*17,m=new THREE.Mesh(new THREE.BoxGeometry(w,h,2),sm);m.position.set((R()-.5)*140,h/2,-70-R()*12);scene.add(m)}

// Cars on the avenue (instanced): white headlights toward camera, red taillights away
const NC=small?10:big?22:16,LN=[-4.8,-2.8,2.8,4.8],cars=[];
const carM=new THREE.InstancedMesh(new THREE.BoxGeometry(1,.45,2.2),new THREE.MeshBasicMaterial({color:0x2a0a12}),NC),
 cabM=new THREE.InstancedMesh(new THREE.BoxGeometry(.8,.3,1.1),new THREE.MeshBasicMaterial({color:0x1d0710}),NC),
 lgtM=new THREE.InstancedMesh(new THREE.BoxGeometry(.95,.14,.08),new THREE.MeshBasicMaterial({color:0xffffff}),NC);
for(let i=0;i<NC;i++){const x=LN[i%4],dir=x<0?1:-1;cars.push({x,dir,z:-90+R()*112,v:7+R()*8});lgtM.setColorAt(i,new THREE.Color(dir>0?0xfff0f2:0xff1738))}
lgtM.instanceColor.needsUpdate=true;[carM,cabM,lgtM].forEach(m=>{m.frustumCulled=false;scene.add(m)});
// Drones: dark bodies with glowing red lights
const ND=small?5:big?10:7,drones=[],drB=new THREE.InstancedMesh(new THREE.BoxGeometry(.7,.14,.7),new THREE.MeshBasicMaterial({color:0x1a0a10}),ND);
const gc=document.createElement('canvas');gc.width=gc.height=64;
{const g=gc.getContext('2d'),gr=g.createRadialGradient(32,32,0,32,32,32);gr.addColorStop(0,'#fff');gr.addColorStop(.25,'rgba(255,60,90,.9)');gr.addColorStop(1,'rgba(255,23,56,0)');g.fillStyle=gr;g.fillRect(0,0,64,64)}
const dl=new Float32Array(ND*3),dlg=new THREE.BufferGeometry();dlg.setAttribute('position',new THREE.BufferAttribute(dl,3));
const dlp=new THREE.Points(dlg,new THREE.PointsMaterial({map:new THREE.CanvasTexture(gc),size:1.6,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,color:0xff4960}));
for(let i=0;i<ND;i++)drones.push({x:(R()-.5)*80,y:9+R()*13,z:-8-R()*50,v:(R()<.5?-1:1)*(2+R()*4),ph:R()*6});
[drB,dlp].forEach(m=>{m.frustumCulled=false;scene.add(m)});

// Animated giant screens: 4 channels redrawn ~14 fps and shared by all screens
const WORDS=['WEB','APPS','VIDEO','MARKETING'],NF=small?6:14;
const DRAW=[
 (x,t)=>{x.fillStyle='#0a0206';x.fillRect(0,0,128,256);x.textAlign='center';x.textBaseline='middle';x.font='800 70px Orbitron,sans-serif';x.shadowColor='#ff1738';x.shadowBlur=16;x.fillStyle='#fff0f2';
  const o=(t*70)%360;'KROM'.split('').forEach((ch,k)=>x.fillText(ch,64,((k*90+o)%360)-50));x.shadowBlur=0;x.fillStyle='#ff1738';x.fillRect(0,0,128,6);x.fillRect(0,250,128,6)},
 (x,t)=>{x.fillStyle='#0a0206';x.fillRect(0,0,128,256);for(let k=0;k<8;k++){const h=40+(Math.sin(t*3+k*1.3)*.5+.5)*190,g=x.createLinearGradient(0,256,0,256-h);g.addColorStop(0,'#72091d');g.addColorStop(1,'#ff4960');x.fillStyle=g;x.fillRect(6+k*15.5,256-h,11,h)}
  x.fillStyle='#ff7585';x.font='700 14px Orbitron,sans-serif';x.textAlign='center';x.fillText('KD // LIVE',64,16)},
 (x,t)=>{x.fillStyle='#0a0206';x.fillRect(0,0,128,256);x.lineWidth=2;for(let l=0;l<3;l++){x.strokeStyle=['#ff1738','#ff7585','#8f102c'][l];x.beginPath();
  for(let y=0;y<=256;y+=4){const px=64+Math.sin(y*.05+t*(2+l)+l*2)*(26+l*8);y?x.lineTo(px,y):x.moveTo(px,y)}x.stroke()}x.fillStyle='rgba(255,40,70,.25)';x.fillRect(0,(t*90)%256,128,10)},
 (x,t)=>{const w=WORDS[Math.floor(t/2)%4],gl=t%2<.25,dx=gl?(Math.random()-.5)*12:0;x.fillStyle='#0a0206';x.fillRect(0,0,128,256);x.textAlign='center';x.textBaseline='middle';x.shadowColor='#ff1738';x.shadowBlur=14;
  ft(x,w,92,44,800);if(gl){x.fillStyle='#ff1738';x.fillText(w,64-dx-4,128)}x.fillStyle='#fff0f2';x.fillText(w,64+dx,128);
  x.shadowBlur=0;x.fillStyle='#ff7585';ft(x,'KROM DIGITAL',104,13,700);x.fillText('KROM DIGITAL',64,24);ft(x,'@krom_digital_',104,13,700);x.fillText('@krom_digital_',64,232);x.strokeStyle='#ff4960';x.lineWidth=3;x.strokeRect(5,5,118,246)}
];
const WTXT='KROM DIGITAL  ·  PÁGINAS WEB  ·  APPS  ·  VIDEO  ·  MARKETING  ·  ',W2=['KROM DIGITAL','WEB','APPS','VIDEO','MARKETING'];
function WB(x){x.shadowBlur=0;x.fillStyle='rgba(255,40,70,.08)';for(let y=0;y<256;y+=4)x.fillRect(0,y,512,1);x.strokeStyle='#ff4960';x.lineWidth=6;x.strokeRect(4,4,504,248)}
const WDRAW=[
 (x,t)=>{x.fillStyle='#0a0206';x.fillRect(0,0,512,256);x.save();x.beginPath();x.rect(14,14,484,228);x.clip();x.textBaseline='middle';x.textAlign='left';x.shadowColor='#ff1738';x.shadowBlur=18;x.font='800 120px Orbitron,sans-serif';
  const T='KROM DIGITAL   ',w=x.measureText(T).width,o=(t*140)%w;x.fillStyle='#fff0f2';x.fillText(T,-o,128);x.fillText(T,w-o,128);x.restore();WB(x)},
 (x,t)=>{x.fillStyle='#0a0206';x.fillRect(0,0,512,256);x.textAlign='center';x.textBaseline='middle';x.shadowColor='#ff1738';x.shadowBlur=16;x.fillStyle=t%3<.12?'#ff4960':'#fff0f2';ft(x,'KROM DIGITAL',450,76,800);x.fillText('KROM DIGITAL',256,92);
  x.shadowBlur=0;x.save();x.beginPath();x.rect(14,170,484,56);x.clip();x.fillStyle='rgba(255,23,56,.18)';x.fillRect(14,170,484,56);x.textAlign='left';x.fillStyle='#ff7585';x.font='700 30px Orbitron,sans-serif';
  const w=x.measureText(WTXT).width,o=(t*110)%w;x.fillText(WTXT,-o,198);x.fillText(WTXT,w-o,198);x.restore();WB(x)},
 (x,t)=>{const i=Math.floor(t/1.8)%5,p=(t%1.8)/1.8,w=W2[i],gl=p<.12,dx=gl?(Math.random()-.5)*20:0;x.fillStyle='#0a0206';x.fillRect(0,0,512,256);x.textAlign='center';x.textBaseline='middle';x.shadowColor='#ff1738';x.shadowBlur=16;
  ft(x,w,430,i?110:64,800);if(gl){x.fillStyle='#ff1738';x.fillText(w,256-dx-6,128)}x.fillStyle='#fff0f2';x.fillText(w,256+dx,128);
  x.shadowBlur=0;x.fillStyle='#ff1738';x.fillRect(34,206,444*p,4);x.fillStyle='#ff7585';ft(x,'KROM DIGITAL // @krom_digital_',440,18,700);x.fillText('KROM DIGITAL // @krom_digital_',256,36);WB(x)}
];
const drawCH=t=>{CH.forEach((c,i)=>{DRAW[i](c.x,t);c.t.needsUpdate=true});WCH.forEach((c,i)=>{WDRAW[i](c.x,t);c.t.needsUpdate=true})};drawCH(0);

// Parallax: mouse / gyroscope
let tx=0,ty=0,px=0,py=0;
addEventListener('pointermove',e=>{tx=(e.clientX/innerWidth-.5)*1.5;ty=(e.clientY/innerHeight-.5)*.7},{passive:true});
addEventListener('deviceorientation',e=>{if(e.gamma!==null){tx=Math.max(-1,Math.min(1,e.gamma/35))*.65;ty=Math.max(-1,Math.min(1,(e.beta-35)/55))*.25}},{passive:true});
const still=still0,INTRO=still?0:7.2;let lastS=0,lastF=0,nextG=0,gEnd=0,lastD=0,gOn=false,t0=null,introDone=false,hudOn=false,baseFov=54,ov=null;
const huds=[...document.querySelectorAll('.hud')];
if(INTRO){huds.forEach(h=>h.style.opacity=0);ov=document.createElement('div');ov.style.cssText='position:fixed;inset:0;z-index:9;background:#050305;display:grid;place-items:center;pointer-events:none;transition:opacity 1.6s ease;color:#ff4960;font:600 12px Orbitron,sans-serif;letter-spacing:3px;text-shadow:0 0 10px #ff1738;white-space:pre;line-height:2';
 const pre=document.createElement('div');ov.append(pre);document.body.append(ov);
 ['> KROM DIGITAL // SYSTEM BOOT','> CONECTANDO NEO GDL ... OK','> SISTEMA EN LINEA ●'].forEach((l,i)=>setTimeout(()=>pre.textContent+=(i?'\n':'')+l,250+i*380));
 setTimeout(()=>{ov.style.opacity=0;setTimeout(()=>ov.remove(),1800)},1500)}
const skipIntro=()=>{if(t0!==null&&lastS-t0<INTRO){t0=lastS-INTRO;if(ov)ov.style.opacity=0}};
addEventListener('pointerdown',skipIntro);addEventListener('keydown',e=>{if(e.key===' '||e.key==='Escape'||e.key==='Enter')skipIntro()});
function frame(t){requestAnimationFrame(frame);const s=t*.001,dt=Math.min(.05,s-lastS);lastS=s;if(t0===null){t0=s+(INTRO?1.4:0);nextG=t0+INTRO+2.5}const it=s-t0;
 px+=(tx-px)*.025;py+=(ty-py)*.025;
 let k=1;if(it<INTRO){const p=Math.max(0,it/INTRO);k=p<.5?4*p*p*p:1-Math.pow(-2*p+2,3)/2}
 const nx=px*1.25+Math.sin(s*.22)*.12,ny=7.5-py*.55+Math.sin(s*.35)*.09,ly=(cam.aspect>1?7:5.2)-py*.2;
 cam.position.set(nx*k+(1-k)*16,ny+(1-k)*58,25+(1-k)*34);cam.lookAt(px*.45*k,ly-(1-k)*30,-18);
 scene.fog.density=.027-(1-k)*.019;
 if(it<INTRO){cam.fov=baseFov+(1-k)*26;cam.updateProjectionMatrix();
  const r=Math.min(1,Math.max(0,(it-2.4)/3.4));if(s-lastD>.05&&(r>0||heroR>0)){lastD=s;heroR=r;drawHero(0);heroT.needsUpdate=true}
  if(it>5.4&&!hudOn){hudOn=true;huds.forEach(h=>h.style.opacity='')}}
 else if(!introDone){introDone=true;heroR=1;drawHero(0);heroT.needsUpdate=true;cam.fov=baseFov;cam.updateProjectionMatrix();scene.fog.density=.027;if(!hudOn){hudOn=true;huds.forEach(h=>h.style.opacity='')}}
 red.intensity=88+Math.sin(s*2.1)*9+LV*45;hero.material.opacity=.88+Math.sin(s*1.7)*.12;
 if(!still){const a=rg.attributes.position.array;
  for(let i=0;i<RC;i++){a[i*3+1]-=.24;a[i*3]+=.018;if(a[i*3+1]<0){a[i*3+1]=26+Math.random()*5;a[i*3+2]=Math.random()*-75+8;a[i*3]=(Math.random()-.5)*(big?70:42)}}
  rg.attributes.position.needsUpdate=true}
 if(!still){
  cars.forEach((c,i)=>{c.z+=c.dir*c.v*dt;if(c.dir>0&&c.z>26)c.z=-90;if(c.dir<0&&c.z<-90)c.z=26;
   M.setPosition(c.x,.28,c.z);carM.setMatrixAt(i,M);M.setPosition(c.x,.62,c.z-.1);cabM.setMatrixAt(i,M);M.setPosition(c.x,.3,c.z+1.12);lgtM.setMatrixAt(i,M)});
  carM.instanceMatrix.needsUpdate=cabM.instanceMatrix.needsUpdate=lgtM.instanceMatrix.needsUpdate=true;
  drones.forEach((d,i)=>{d.x+=d.v*dt;if(Math.abs(d.x)>45)d.x=d.v>0?-45:45;const y=d.y+Math.sin(s*1.3+d.ph)*.4;
   M.setPosition(d.x,y,d.z);drB.setMatrixAt(i,M);dl[i*3]=d.x;dl[i*3+1]=y-.12;dl[i*3+2]=d.z});
  drB.instanceMatrix.needsUpdate=true;dlg.attributes.position.needsUpdate=true;dlp.material.size=1.5+Math.sin(s*6)*.4;
  // Screens animate + windows flicker on/off
  if(s-lastF>.07){lastF=s;drawCH(s);for(let k=0;k<NF;k++){const r=Math.random();wm.setColorAt((Math.random()*wins.length)|0,C[r<.55?1:r<.8?0:r<.9?2:3])}wm.instanceColor.needsUpdate=true}
  // KROM glitch: short bursts every few seconds
  if(s>nextG&&s>gEnd){gEnd=s+.35+Math.random()*.35;nextG=gEnd+3+Math.random()*4}
  if(s<gEnd){if(s-lastD>.05){lastD=s;gOn=true;drawHero(.4+Math.random()*.6);heroT.needsUpdate=true;hero.position.x=(Math.random()-.5)*.8}}
  else if(gOn){gOn=false;drawHero(0);heroT.needsUpdate=true;hero.position.x=0}
 }
 rd.render(scene,cam)}
function fit(){cam.aspect=innerWidth/innerHeight;baseFov=cam.aspect>1?46:54;if(introDone||!INTRO)cam.fov=baseFov;cam.updateProjectionMatrix();hero.scale.setScalar(cam.aspect>1.2?1.35:1);rd.setPixelRatio(pr());rd.setSize(innerWidth,innerHeight)}
addEventListener('resize',fit);fit();
requestAnimationFrame(frame)}
(document.fonts&&document.fonts.load?document.fonts.load('800 80px Orbitron'):Promise.resolve()).catch(()=>{}).finally(go);
})();