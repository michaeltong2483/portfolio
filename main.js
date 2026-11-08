(()=>{
const d = document, de = d.documentElement;
de.classList.add('js');

// Hero video: Safari / iPadOS natively supports HEVC with alpha (me.mov), Chrome/PC supports me.webm
const v = d.getElementById('me');
if (v) {
  v.muted = true;
  v.defaultMuted = true;
  
  const tryPlay = () => {
    const p = v.play();
    if (p !== undefined) {
      p.catch(() => {});
    }
  };

  // Immediate attempt
  tryPlay();

  // Fallback for iOS / iPadOS low power mode or strict autoplay policy
  const onUserGesture = () => {
    tryPlay();
    window.removeEventListener('touchstart', onUserGesture);
    window.removeEventListener('touchend', onUserGesture);
    window.removeEventListener('scroll', onUserGesture);
  };
  window.addEventListener('touchstart', onUserGesture, { passive: true, once: true });
  window.addEventListener('touchend', onUserGesture, { passive: true, once: true });
  window.addEventListener('scroll', onUserGesture, { passive: true, once: true });

  // Pause when off-screen to save battery
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(es => {
      es[0].isIntersecting ? tryPlay() : v.pause();
    }).observe(v);
  }
}

// Scroll reveal (stagger siblings)
const io = new IntersectionObserver(es => {
  es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    io.unobserve(e.target);
  });
}, { threshold: 0.08, rootMargin: '0px 0px -20px' });

d.querySelectorAll('.reveal').forEach(el => {
  const siblings = el.parentElement ? [...el.parentElement.children] : [];
  const idx = siblings.length > 1 ? siblings.indexOf(el) : 0;
  el.style.setProperty('--d', (idx * 0.08) + 's');
  io.observe(el);
});

// Count-up numbers (vi-VN decimal comma)
const fmt = (val, dec) => val.toFixed(dec).replace('.', ',');
const cio = new IntersectionObserver(es => {
  es.forEach(e => {
    if (!e.isIntersecting) return;
    cio.unobserve(e.target);
    const el = e.target;
    const end = +el.dataset.count;
    const dec = +(el.dataset.dec || 0);
    const suf = el.dataset.suffix || '';
    const t0 = performance.now();
    const dur = 1400;

    (function tick(t) {
      const p = Math.min((t - t0) / dur, 1);
      const k = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(end * k, dec) + suf;
      if (p < 1) requestAnimationFrame(tick);
    })(t0);
  });
}, { threshold: 0.15 });

d.querySelectorAll('[data-count]').forEach(el => cio.observe(el));

// Chart bars
const chart = d.querySelector('.chart');
if (chart && 'IntersectionObserver' in window) {
  new IntersectionObserver((es, o) => {
    if (es[0].isIntersecting) {
      chart.classList.add('in');
      o.disconnect();
    }
  }, { threshold: 0.2 }).observe(chart);
}

// Nav + progress bar
const nav = d.getElementById('nav');
const bar = d.getElementById('progress');
let tick = false;
const onScroll = () => {
  if (tick) return;
  tick = true;
  requestAnimationFrame(() => {
    const y = window.scrollY || window.pageYOffset;
    const h = de.scrollHeight - window.innerHeight;
    if (nav) nav.classList.toggle('on', y > 20);
    if (bar) bar.style.transform = 'scaleX(' + (h > 0 ? y / h : 0) + ')';
    tick = false;
  });
};
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

const yEl = d.getElementById('y');
if (yEl) yEl.textContent = new Date().getFullYear();
})();
