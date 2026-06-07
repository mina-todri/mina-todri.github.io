// ── CURSOR ──────────────────────────────────
const cur = document.getElementById('cur');
const cur2 = document.getElementById('cur2');
let mx = 0,
    my = 0,
    cx = 0,
    cy = 0;
document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
    cur.style.left = mx + 'px';
    cur.style.top = my + 'px';
});

function moveCur2() {
    cx += (mx - cx) * .12;
    cy += (my - cy) * .12;
    cur2.style.left = cx + 'px';
    cur2.style.top = cy + 'px';
    requestAnimationFrame(moveCur2);
}
moveCur2();

// ── PROGRESS ────────────────────────────────
window.addEventListener('scroll', () => {
    const s = document.documentElement.scrollTop;
    const h = document.documentElement.scrollHeight - window.innerHeight;
    document.getElementById('prog').style.width = (s / h * 100) + '%';
});

// ── PARTICLES (mouse-reactive) ───────────────
const canvas = document.getElementById('particles');
const ctx = canvas.getContext('2d');
const mouse = {
    x: -9999,
    y: -9999
};
let W, H, pts = [];

function resize() {
    const dpr = devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = W * dpr;
    canvas.height = H * dpr;
    canvas.style.width = W + 'px';
    canvas.style.height = H + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(100, Math.floor(W * H / 14000));
    pts = Array.from({
        length: n
    }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - .5) * .35,
        vy: (Math.random() - .5) * .35,
        r: Math.random() * 1.5 + .4
    }));
}
resize();
window.addEventListener('resize', resize);
document.addEventListener('mousemove', e => {
    mouse.x = e.clientX;
    mouse.y = e.clientY
});
document.addEventListener('mouseleave', () => {
    mouse.x = -9999;
    mouse.y = -9999
});

function tick() {
    ctx.clearRect(0, 0, W, H);
    for (const p of pts) {
        const dx = p.x - mouse.x,
            dy = p.y - mouse.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 16000) {
            const f = (1 - d2 / 16000) * .6;
            const d = Math.sqrt(d2) || 1;
            p.vx += (dx / d) * f * .35;
            p.vy += (dy / d) * f * .35
        }
        p.vx *= .96;
        p.vy *= .96;
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;
        ctx.globalAlpha = .65;
        ctx.fillStyle = '#22d3ee';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.lineWidth = .5;
    for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
            const dx = pts[i].x - pts[j].x,
                dy = pts[i].y - pts[j].y;
            const d2 = dx * dx + dy * dy;
            if (d2 < 9000) {
                ctx.strokeStyle = '#22d3ee';
                ctx.globalAlpha = (1 - d2 / 9000) * .2;
                ctx.beginPath();
                ctx.moveTo(pts[i].x, pts[i].y);
                ctx.lineTo(pts[j].x, pts[j].y);
                ctx.stroke();
            }
        }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(tick);
}
tick();

// ── SCROLL REVEAL ──────────────────────────
const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.classList.add('visible')
        }
    });
}, {
    threshold: .1,
    rootMargin: '0px 0px -40px 0px'
});
document.querySelectorAll('.reveal,.reveal-left,.reveal-right').forEach(el => obs.observe(el));

// ── SKILL BARS ─────────────────────────────
const skillObs = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.skill-row').forEach(row => {
                const fill = row.querySelector('.skill-fill');
                const pct = row.dataset.pct;
                setTimeout(() => {
                    fill.style.width = pct + '%'
                }, 100);
            });
            skillObs.unobserve(e.target);
        }
    });
}, {
    threshold: .2
});
const skillSection = document.getElementById('skillBars');
if (skillSection) skillObs.observe(skillSection);

// ── ORBITAL TAGS ──────────────────────────
const tags = ['Flutter', 'Dart', 'Firebase', 'Bloc', 'Riverpod', 'REST', 'GraphQL', 'Figma', 'CI/CD', 'Stripe', 'Hive', 'Supabase'];
const orbital = document.querySelector('.orbital');
if (orbital) {
    const size = orbital.offsetWidth || 400;
    const radius = size * .4;
    tags.forEach((tag, i) => {
        const angle = (i / tags.length) * Math.PI * 2 - Math.PI / 2;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        const el = document.createElement('div');
        el.className = 'orbital-tag';
        el.textContent = tag;
        el.style.cssText = `left:50%;top:50%;transform:translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`;
        orbital.appendChild(el);
    });
}

// ── SMOOTH SCROLL ─────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
        e.preventDefault();
        const t = document.querySelector(a.getAttribute('href'));
        if (t) t.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    });
});

// ── FORM ──────────────────────────────────
            const btn = document.getElementById('formBtn');
            const name = document.getElementById('fname').value;
            const email = document.getElementById('femail').value;
            const msg = document.getElementById('fmsg').value;
            if (!name || !email || !msg) return;
            btn.classList.add('loading');
            btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" style="animation:spin 1s linear infinite" fill="none" stroke="#080b14" stroke-width="2" stroke-linecap="round"><circle cx="[...]
            btn.classList.remove('loading');
                btn.classList.add('sent');
                btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#080b14" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="2[...]
                document.getElementById('fname').value = '';
                document.getElementById('femail').value = '';
                document.getElementById('fmsg').value = '';
                setTimeout(() => {
                    btn.classList.remove('sent');
                    btn.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="#080b14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="22" y1=[...]
                }, 3000);
            }

// ── SPIN KEYFRAME ─────────────────────────
const style = document.createElement('style');
style.textContent = '@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}';
document.head.appendChild(style);
