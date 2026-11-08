(()=>{
const d=document,de=d.documentElement;
de.classList.add('js');
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;

// Hero video: Safari needs HEVC-with-alpha; pause when off-screen to save CPU/battery
const v=d.getElementById('me');
if(v){
  const ua=navigator.userAgent;
  if(/Safari/.test(ua)&&!/Chrome|Chromium|Android/.test(ua)||/iPhone|iPad/.test(ua)){
    v.innerHTML='<source src="assets/me.mov" type="video/quicktime">';v.load();
  }
  if(reduce){v.removeAttribute('autoplay');v.pause()}
  else{
    new IntersectionObserver(es=>{es[0].isIntersecting?v.play().catch(()=>{}):v.pause()}).observe(v);
    v.play().catch(()=>{});
  }
}

// Scroll reveal (stagger siblings)
const io=new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(!e.isIntersecting)return;
    e.target.classList.add('in');io.unobserve(e.target);
  });
},{threshold:.12,rootMargin:'0px 0px -40px'});
d.querySelectorAll('.reveal').forEach((el,i)=>{
  el.style.setProperty('--d',(el.parentElement.children.length>1?[...el.parentElement.children].indexOf(el)*.08:0)+'s');
  io.observe(el);
});

// Count-up numbers (vi-VN decimal comma)
const fmt=(v,dec)=>v.toFixed(dec).replace('.',',');
const cio=new IntersectionObserver(es=>{
  es.forEach(e=>{
    if(!e.isIntersecting)return;
    cio.unobserve(e.target);
    const el=e.target,end=+el.dataset.count,dec=+(el.dataset.dec||0),suf=el.dataset.suffix||'';
    if(reduce){return}
    const t0=performance.now(),dur=1400;
    (function tick(t){
      const p=Math.min((t-t0)/dur,1),k=1-Math.pow(1-p,3);
      el.textContent=fmt(end*k,dec)+suf;
      if(p<1)requestAnimationFrame(tick);
    })(t0);
  });
},{threshold:.6});
d.querySelectorAll('[data-count]').forEach(el=>cio.observe(el));

// Chart bars
const chart=d.querySelector('.chart');
if(chart)new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){chart.classList.add('in');o.disconnect()}},{threshold:.4}).observe(chart);

// Nav + progress (rAF throttled, passive)
const nav=d.getElementById('nav'),bar=d.getElementById('progress');
let tick=false;
const onScroll=()=>{
  if(tick)return;tick=true;
  requestAnimationFrame(()=>{
    const y=scrollY,h=de.scrollHeight-innerHeight;
    nav.classList.toggle('on',y>20);
    bar.style.transform='scaleX('+(h>0?y/h:0)+')';
    tick=false;
  });
};
addEventListener('scroll',onScroll,{passive:true});onScroll();
d.getElementById('y').textContent=new Date().getFullYear();
})();

