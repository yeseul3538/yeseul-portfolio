/* Yeseul You — 포트폴리오 2026
   2) 메뉴  3) 첫화면 실 연출  6) 프로젝트 목록  7) 프로젝트 팝업  8) 사이드 프로젝트 */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  /* 2) 메뉴 — 스크롤 상태, 남색 구간 위 흰 글자, 현재 섹션 표시 */
  var nav = $('#nav');
  var hero = $('#hero');
  var darkZones = [$('.stats'), $('#contact')].filter(Boolean);
  var navLinks = $$('.nav-links a');
  var sections = navLinks.map(function (a) { return $(a.getAttribute('href')); }).concat($('#contact'));

  function onScroll() {
    var y = window.scrollY;
    var probe = y + 40;
    nav.classList.toggle('scrolled', y > 40);
    nav.classList.toggle('on-dark', darkZones.some(function (z) {
      return probe >= z.offsetTop && probe < z.offsetTop + z.offsetHeight;
    }));
    var pos = y + window.innerHeight * 0.35;
    var current = '';
    sections.forEach(function (s) { if (s && s.offsetTop <= pos) current = '#' + s.id; });
    navLinks.forEach(function (a) { a.classList.toggle('active', a.getAttribute('href') === current); });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* 모바일 메뉴 — 상단 메뉴 링크를 복사해 만듭니다 */
  var burger = $('#burger');
  var mobileMenu = $('#mobileMenu');
  navLinks.concat($('.nav-cta')).forEach(function (a) {
    var m = a.cloneNode(true);
    m.className = '';
    m.addEventListener('click', function () { setMenu(false); });
    mobileMenu.appendChild(m);
  });
  function setMenu(open) {
    mobileMenu.classList.toggle('open', open);
    nav.classList.toggle('menu-open', open);
    burger.setAttribute('aria-expanded', String(open));
    burger.setAttribute('aria-label', open ? '메뉴 닫기' : '메뉴 열기');
  }
  burger.addEventListener('click', function () { setMenu(!mobileMenu.classList.contains('open')); });

  /* 3) 첫화면 배경 실 — 페이지가 열리면 한 번 저절로 진행 (스크롤과 무관)
        ① 코랄·블루그레이 두 가닥이 꼬인 끈이 오른쪽 빈 공간에서 고리를 지으며 그려짐
        ② 꼬임이 풀려 두 가닥으로 벌어졌다가 한 가닥으로 합쳐지며, 성과 카드 위를 지나는 선으로 정렬
        ③ 각 카드로 내려가는 짧은 선과 점이 그려짐
        움직이는 동안 끈 모양은 '늘어나지 않음 + 급하게 꺾이지 않음' 규칙(rope)으로 정함 */
  var hsvg = hero && $('.hero-thread', hero);
  if (hsvg) {
    var NS = 'http://www.w3.org/2000/svg', N = 900, C1 = '#c2583f', C2 = '#8e9db2', CREAM = '#faf7f2';
    var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
    var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
    var lerp = function (a2, b2, t) { return a2 + (b2 - a2) * t; };
    var mk = function (tag, at, parent) { var e = document.createElementNS(NS, tag); for (var k in at) e.setAttribute(k, at[k]); (parent || hsvg).appendChild(e); return e; };
    var toD = function (P) { var d = 'M'; for (var i = 0; i < P.length; i++) d += (i ? 'L' : '') + P[i][0].toFixed(1) + ' ' + P[i][1].toFixed(1); return d; };
    var resample = function (pts, n) {
      var L = [0], i, j = 0, out = [];
      for (i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      for (i = 0; i < n; i++) { var d = L[L.length - 1] * i / (n - 1); while (j < L.length - 2 && L[j + 1] < d) j++;
        var t = (d - L[j]) / ((L[j + 1] - L[j]) || 1); out.push([lerp(pts[j][0], pts[j + 1][0], t), lerp(pts[j][1], pts[j + 1][1], t)]); }
      return out;
    };
    var smooth = function (P, w, passes) { for (var k = 0; k < passes; k++) { var o = [];
      for (var i = 0; i < P.length; i++) { var sx = 0, sy = 0, c = 0; for (var j = Math.max(0, i - w); j <= Math.min(P.length - 1, i + w); j++) { sx += P[j][0]; sy += P[j][1]; c++; } o.push([sx / c, sy / c]); }
      o[0] = P[0]; o[P.length - 1] = P[P.length - 1]; P = o; } return P; };
    var rope = {
      M: 450,
      down: function (P) { var o = []; for (var j = 0; j < rope.M; j++) o.push(P[Math.round(j * (P.length - 1) / (rope.M - 1))]); return o; },
      step: function (P, T, rmin) {
        var M = P.length, j, it;
        for (j = 0; j < M; j++) { P[j][0] += (T[j][0] - P[j][0]) * 0.32; P[j][1] += (T[j][1] - P[j][1]) * 0.32; }
        var pin = function () { P[0] = T[0].slice(); P[M - 1] = T[M - 1].slice(); }; pin();
        for (it = 0; it < 6; it++) {
          for (j = 0; j < M - 1; j++) { var rest = Math.hypot(T[j + 1][0] - T[j][0], T[j + 1][1] - T[j][1]), dx = P[j + 1][0] - P[j][0], dy = P[j + 1][1] - P[j][1], d = Math.hypot(dx, dy) || 1e-4, f = (d - rest) / d * 0.5;
            P[j][0] += dx * f; P[j][1] += dy * f; P[j + 1][0] -= dx * f; P[j + 1][1] -= dy * f; }
          for (j = 1; j < M - 1; j++) { var ax = P[j][0] - P[j - 1][0], ay = P[j][1] - P[j - 1][1], bx = P[j + 1][0] - P[j][0], by = P[j + 1][1] - P[j][1];
            var la = Math.hypot(ax, ay), lb = Math.hypot(bx, by), turn = Math.abs(Math.atan2(ax * by - ay * bx, ax * bx + ay * by)), mt = ((la + lb) / 2) / rmin;
            if (turn > mt) { var k3 = 0.5 * (turn - mt) / turn; P[j][0] += ((P[j - 1][0] + P[j + 1][0]) / 2 - P[j][0]) * k3; P[j][1] += ((P[j - 1][1] + P[j + 1][1]) / 2 - P[j][1]) * k3; } }
          pin();
        }
      },
      smoothD: function (P) { var d = 'M' + P[0][0].toFixed(1) + ' ' + P[0][1].toFixed(1);
        for (var j = 1; j < P.length - 1; j++) d += 'Q' + P[j][0].toFixed(1) + ' ' + P[j][1].toFixed(1) + ' ' + ((P[j][0] + P[j + 1][0]) / 2).toFixed(1) + ' ' + ((P[j][1] + P[j + 1][1]) / 2).toFixed(1);
        var e = P[P.length - 1]; return d + 'L' + e[0].toFixed(1) + ' ' + e[1].toFixed(1); }
    };
    var G = null;
    var build = function () {
      var W = hero.clientWidth, H = hero.clientHeight, narrow = W < 760, hr = hero.getBoundingClientRect();
      hsvg.setAttribute('viewBox', '0 0 ' + W + ' ' + H); while (hsvg.firstChild) hsvg.removeChild(hsvg.firstChild);
      var cards = $$('.hero-card', hero).map(function (c) { var r = c.getBoundingClientRect(); return { x: r.left - hr.left, y: r.top - hr.top, w: r.width, h: r.height }; });
      if (!cards.length) return;
      var lead = $('.hero-lead', hero).getBoundingClientRect(), lx = lead.right - hr.left;
      // 완성 모양: 왼쪽 밖에서 들어와 카드 위를 지나 마지막 카드 위에서 끝나는 선 (+ 카드로 내려가는 짧은 선)
      var yL = narrow ? null : cards[0].y - 26, fin;
      if (narrow) { var xL = Math.max(8, cards[0].x - 14); fin = [[-20, cards[0].y - 22], [xL - 12, cards[0].y - 22], [xL, cards[0].y - 10], [xL, cards[cards.length - 1].y + cards[cards.length - 1].h / 2]]; }
      else fin = [[-20, yL], [cards[cards.length - 1].x + cards[cards.length - 1].w / 2, yL]];
      fin = resample(fin, N);
      // 시작 모양: 오른쪽 빈 공간(모바일은 제목 오른쪽 위)에서 고리 두 개를 지은 꼬인 끈
      var ax0 = narrow ? W * 0.45 : Math.max(lx + 40, W * 0.56), ax1 = W * 0.98, ay0 = narrow ? H * 0.06 : H * 0.14, ay1 = narrow ? cards[0].y - 40 : yL - 30;
      var raw = [[-20, fin[0][1]]], cx, cy, rr;
      var add = function (x, y) { raw.push([x, y]); };
      add(ax0 - 60, ay1); add(ax0 + (ax1 - ax0) * 0.2, lerp(ay0, ay1, 0.75));
      cx = ax0 + (ax1 - ax0) * 0.32; cy = lerp(ay0, ay1, 0.55); rr = Math.min(ax1 - ax0, ay1 - ay0) * 0.16;
      for (var k = 0; k <= 40; k++) { var th = Math.PI * 0.5 + k / 40 * Math.PI * 2; add(cx + rr * Math.cos(th) * 1.3, cy - rr * Math.sin(th)); }
      add(ax0 + (ax1 - ax0) * 0.55, lerp(ay0, ay1, 0.3));
      cx = ax0 + (ax1 - ax0) * 0.7; cy = lerp(ay0, ay1, 0.45); rr *= 0.85;
      for (k = 0; k <= 40; k++) { th = Math.PI * 1.5 - k / 40 * Math.PI * 2; add(cx + rr * Math.cos(th), cy + rr * Math.sin(th) * 1.2); }
      add(ax0 + (ax1 - ax0) * 0.9, lerp(ay0, ay1, 0.75)); add(W + 30, ay0);
      var tang = resample(smooth(resample(raw, N), 6, 3), N), mid = smooth(tang.map(function (q) { return q.slice(); }), 30, 5);
      var tw = narrow ? 1.6 : 2, op = narrow ? 0.5 : 0.7;
      G = { W: W, H: H, N: N, tang: tang, mid: mid, fin: fin, tr: narrow ? 2.2 : 3, tp: narrow ? 16 : 22, sep: narrow ? 14 : 26, rmin: narrow ? 6 : 8,
        bB: mk('path', { stroke: C2, 'stroke-width': tw, opacity: op }), bA: mk('path', { stroke: C1, 'stroke-width': tw, opacity: op }),
        ticks: (narrow ? cards.map(function (c) { return [[fin[N - 1][0], c.y + c.h / 2], [c.x, c.y + c.h / 2]]; })
                       : cards.map(function (c) { return [[c.x + c.w / 2, yL], [c.x + c.w / 2, c.y]]; })).map(function (t) {
          var e = mk('path', { d: toD(t), stroke: C1, 'stroke-width': tw, opacity: op }); var l = e.getTotalLength(); e.style.strokeDasharray = l + ' ' + l; e.style.strokeDashoffset = l; e._l = l; return e; }),
        dots: [], clip: null };
      G.dots = (narrow ? cards.map(function (c) { return [c.x, c.y + c.h / 2]; }) : cards.map(function (c) { return [c.x + c.w / 2, c.y]; })).map(function (q) {
        return mk('circle', { cx: q[0].toFixed(1), cy: q[1].toFixed(1), r: narrow ? 3 : 3.5, fill: C1, stroke: CREAM, 'stroke-width': 2.5, opacity: 0 }); });
      var cp = mk('clipPath', { id: 'heroThreadClip' }, mk('defs', {})); G.clip = mk('rect', { x: -40, y: -40, width: 0, height: H + 80 }, cp);
      G.bA.setAttribute('clip-path', 'url(#heroThreadClip)'); G.bB.setAttribute('clip-path', 'url(#heroThreadClip)');
      G.PA = G.PB = null;
    };
    var render = function (t) {   // t: 0~1 전체 진행
      if (!G) return;
      var N2 = G.N, i, draw = ease(clamp01(t / 0.3)), pm = clamp01((t - 0.36) / 0.44), C = [], qs = [], qb = [];
      G.clip.setAttribute('width', ((G.W + 80) * draw).toFixed(1));
      for (i = 0; i < N2; i++) {
        var q = ease(clamp01((pm - 0.35 * i / N2) / 0.65)); qs.push(q); qb.push(ease(clamp01((pm - 0.35 * i / N2 - 0.07) / 0.65)));
        var q1 = ease(clamp01(q * 2)), q2 = ease(clamp01(q * 2 - 1));
        C.push([lerp(lerp(G.tang[i][0], G.mid[i][0], q1), G.fin[i][0], q2), lerp(lerp(G.tang[i][1], G.mid[i][1], q1), G.fin[i][1], q2)]);
      }
      var A = [], B = [], arc = 0, bump = function (x) { return Math.pow(Math.sin(Math.PI * x), 1.3); };
      for (i = 0; i < N2; i++) {
        var a0 = C[Math.max(0, i - 8)], a1 = C[Math.min(N2 - 1, i + 8)], nx = -(a1[1] - a0[1]), ny = a1[0] - a0[0], ln = Math.hypot(nx, ny) || 1;
        if (i) arc += Math.hypot(C[i][0] - C[i - 1][0], C[i][1] - C[i - 1][1]);
        var ph = arc / G.tp * 6.2832 * (1 - qs[i]) - qs[i] * 18.85, o = Math.sin(ph) * G.tr * (1 - qs[i]);
        var sa = G.sep * bump(qs[i]) * (1 + 0.35 * Math.sin(arc / 90 + qs[i] * 8)), sb = G.sep * (bump(qb[i]) + (qb[i] > 0.5 ? 0.22 * Math.sin(2 * Math.PI * qb[i]) : 0));
        nx /= ln; ny /= ln; A.push([C[i][0] + nx * (o + sa), C[i][1] + ny * (o + sa)]); B.push([C[i][0] - nx * (o + sb), C[i][1] - ny * (o + sb)]);
      }
      if (pm <= 0 || pm >= 1) { G.PA = G.PB = null; G.bA.setAttribute('d', toD(A)); G.bB.setAttribute('d', toD(B)); }
      else {
        var TA = rope.down(A), TB = rope.down(B);
        if (!G.PA) { G.PA = TA.map(function (q3) { return q3.slice(); }); G.PB = TB.map(function (q3) { return q3.slice(); }); }
        rope.step(G.PA, TA, G.rmin); rope.step(G.PB, TB, G.rmin);
        G.bA.setAttribute('d', rope.smoothD(G.PA)); G.bB.setAttribute('d', rope.smoothD(G.PB));
      }
      var tk = clamp01((t - 0.82) / 0.12);
      G.ticks.forEach(function (e) { e.style.strokeDashoffset = (e._l * (1 - tk)).toFixed(1); e.style.visibility = tk > 0 ? '' : 'hidden'; });
      var dp = clamp01((t - 0.9) / 0.1).toFixed(2);
      G.dots.forEach(function (c) { c.setAttribute('opacity', dp); });
    };
    var T0 = null, DUR = 3600, tNow = reduceMotion ? 1 : 0;
    var loop = function (ts) { if (T0 === null) T0 = ts; tNow = clamp01((ts - T0) / DUR); render(tNow); if (tNow < 1) requestAnimationFrame(loop); };
    var start = function () { build(); if (reduceMotion) render(1); else setTimeout(function () { requestAnimationFrame(loop); }, 250); };
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(start); else start();
    var rT; window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(function () { build(); render(tNow < 1 ? tNow : 1); }, 150); });
  }

  /* 6) 프로젝트 목록 — 첫화면 카드(data-go)를 누르면 해당 프로젝트로 스크롤하고 포커스 */
  var cards = $$('.work-card');
  $$('[data-go]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var c = cards[parseInt(a.dataset.go, 10) || 0];
      if (!c) return;
      e.preventDefault();
      c.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
      c.focus({ preventScroll: true });
    });
  });

  /* 7) 프로젝트 팝업 — 카드의 work-side(머리글) + work-detail(본문)을 보여줌 */
  var modal = $('#modal');
  var modalBody = $('#modalBody');
  var modalClose = $('#modalClose');
  var lastFocused = null;

  function openModal(card) {
    lastFocused = card;
    var head = $('.work-side', card).cloneNode(true);
    var title = $('h3', head);
    title.id = 'modalTitle';
    modalBody.innerHTML = '';
    modalBody.appendChild(head);
    modalBody.insertAdjacentHTML('beforeend', $('.work-detail', card).innerHTML);
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    $('.modal-panel', modal).scrollTop = 0;
    modalClose.focus();
  }

  function closeModal() {
    if (!modal.classList.contains('open')) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    modalBody.innerHTML = '';
    if (lastFocused) lastFocused.focus({ preventScroll: true });
  }

  cards.forEach(function (card) {
    card.addEventListener('click', function () { openModal(card); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openModal(card); }
    });
  });

  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', function (e) { if (e.target.hasAttribute('data-close')) closeModal(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(); setMenu(false); }
  });

  /* 8) 사이드 프로젝트 — 처음 펼칠 때만 iframe 로드 */
  var spToggle = $('#spToggle');
  var spPanel = $('#spPanel');
  var spFrame = $('#spFrame');
  spToggle.addEventListener('click', function () {
    var open = spPanel.hidden;
    spPanel.hidden = !open;
    if (open && !spFrame.getAttribute('src')) spFrame.src = spFrame.dataset.src;
    spToggle.setAttribute('aria-expanded', String(open));
  });
})();
