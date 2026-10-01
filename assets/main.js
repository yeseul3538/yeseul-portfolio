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

  /* 3) 첫화면 — 스크롤 진행도 p(0~1)
        ① 코랄 실 한 가닥이 큰 'YESEUL' 글자 사이를 드나듦 (Y·L 기둥은 한 바퀴 감음)
        ② 스크롤하면 실이 왼쪽부터 팽팽하게 당겨지며 풀리고, 큰 글자는 메뉴 로고 자리로 줄어듦
        ③ 실이 세 갈래로 갈라져 카드 3개에 닿고, 내용이 등장
        앞/뒤 표현: 뒤 레이어(글자 아래)에는 실 전체, 앞 레이어(글자 위)에는 '위로 지나가는 구간'만 그림 */
  var stage = hero && $('.th-stage', hero), back = hero && $('.th-back', hero), front = hero && $('.th-front', hero), mark = hero && $('.th-mark', hero);
  if (stage && back && front && mark) {
    var NS = 'http://www.w3.org/2000/svg', N = 1100, CREAM = '#faf7f2', THREAD = '#c2583f', STRAND2 = '#8e9db2';
    var clamp01 = function (v) { return v < 0 ? 0 : v > 1 ? 1 : v; };
    var ease = function (t) { return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2; };
    var lerp = function (a, b, t) { return a + (b - a) * t; };
    var mk = function (tag, attrs, parent) { var e = document.createElementNS(NS, tag); for (var k in attrs) e.setAttribute(k, attrs[k]); parent.appendChild(e); return e; };
    var logo = $('.nav-logo'), logoText = null;
    if (logo) for (var ci = 0; ci < logo.childNodes.length; ci++) if (logo.childNodes[ci].nodeType === 3 && logo.childNodes[ci].textContent.trim()) logoText = logo.childNodes[ci];
    var textRect = function (node, from, to) { var r = document.createRange(); r.setStart(node, from); r.setEnd(node, to); return r.getBoundingClientRect(); };
    var G = null, el = {}, intro = 1, built = false;

    var resample = function (pts, n) {   // 길이 기준으로 n개 점으로 고르게
      var L = [0], i, j = 0, out = [];
      for (i = 1; i < pts.length; i++) L.push(L[i - 1] + Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]));
      for (i = 0; i < n; i++) {
        var d = L[L.length - 1] * i / (n - 1);
        while (j < L.length - 2 && L[j + 1] < d) j++;
        var t = (d - L[j]) / ((L[j + 1] - L[j]) || 1);
        out.push([lerp(pts[j][0], pts[j + 1][0], t), lerp(pts[j][1], pts[j + 1][1], t), pts[j + 1][2]]);
      }
      return out;
    };
    var elbow = function (pts, r) {   // 꺾은선의 모서리를 둥글게 (흐름도 선)
      var out = [pts[0]];
      for (var i = 1; i < pts.length - 1; i++) {
        var a = pts[i - 1], b = pts[i], c = pts[i + 1];
        var d1 = Math.hypot(b[0] - a[0], b[1] - a[1]), d2 = Math.hypot(c[0] - b[0], c[1] - b[1]), rr = Math.min(r, d1 / 2, d2 / 2);
        var s0 = [b[0] - (b[0] - a[0]) / d1 * rr, b[1] - (b[1] - a[1]) / d1 * rr], s1 = [b[0] + (c[0] - b[0]) / d2 * rr, b[1] + (c[1] - b[1]) / d2 * rr];
        for (var k = 0; k <= 8; k++) { var t = k / 8, u = 1 - t; out.push([u * u * s0[0] + 2 * u * t * b[0] + t * t * s1[0], u * u * s0[1] + 2 * u * t * b[1] + t * t * s1[1]]); }
      }
      out.push(pts[pts.length - 1]);
      return out.map(function (q) { return [q[0], q[1], 1]; });
    };
    var toD = function (pts) { var d = 'M'; for (var i = 0; i < pts.length; i++) d += (i ? 'L' : '') + pts[i][0].toFixed(1) + ' ' + pts[i][1].toFixed(1); return d; };

    var build = function () {
      var W = stage.clientWidth, H = stage.clientHeight, narrow = W < 760;
      [back, front].forEach(function (s2) { s2.setAttribute('viewBox', '0 0 ' + W + ' ' + H); while (s2.firstChild) s2.removeChild(s2.firstChild); });
      var tw = narrow ? 1.8 : 2.4, tr = narrow ? 2.4 : 3.4, tp = narrow ? 18 : 26; // 가닥 굵기 · 꼬임 반지름 · 꼬임 한 바퀴 길이

      // 큰 워드마크 크기·시작 위치
      mark.style.transform = 'none'; mark.style.fontSize = '100px';
      var tn = mark.firstChild, sr = stage.getBoundingClientRect();
      var r100 = textRect(tn, 0, tn.length), glyphW100 = r100.width - 16; // 마지막 글자 뒤 자간 제외
      var inner = $('.hero-inner', hero), ir = inner.getBoundingClientRect(), cs = getComputedStyle(inner);
      var cl = ir.left - sr.left + parseFloat(cs.paddingLeft), cw = ir.width - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight); // 본문 콘텐츠의 왼쪽 기준선·폭
      var fs = Math.min(100 * cw / glyphW100, H * (narrow ? 0.2 : 0.4));
      mark.style.fontSize = fs.toFixed(1) + 'px';
      var m0 = textRect(tn, 0, tn.length), mx = m0.left - sr.left, my = m0.top - sr.top;
      var sx = cl, sy = H * (narrow ? 0.4 : 0.46) - 0.5 * fs; // 왼쪽 기준선에 맞춤
      // 글자별 상자 (시작 위치 기준). 캡 높이 0.716em, 기준선 = 내용 상자 위 + 0.927em
      var box = [];
      for (var i = 0; i < tn.length; i++) {
        var cr = textRect(tn, i, i + 1), x0 = cr.left - sr.left - mx + sx;
        var w = cr.width - 0.16 * fs, base = sy + 0.927 * fs;
        box.push({ x0: x0, x1: x0 + w, cx: x0 + w / 2, w: w, T: base - 0.716 * fs, B: base, M: base - 0.358 * fs });
      }
      var cap = 0.716 * fs, Y = box[0], E1 = box[1], S = box[2], E2 = box[3], U = box[4], L = box[5];
      // 끈의 중심선 설계. 점마다 표시값: 1 = 글자 앞으로 지나감, 2 = 매듭에서 끈이 자기 자신 위로 지나감
      var pts = [], last = function () { return pts[pts.length - 1]; };
      var bez = function (c1, c2, a1, f) { var a0 = last(); for (var k = 1; k <= 48; k++) { var t = k / 48, u = 1 - t;
        pts.push([u*u*u*a0[0] + 3*u*u*t*c1[0] + 3*u*t*t*c2[0] + t*t*t*a1[0], u*u*u*a0[1] + 3*u*u*t*c1[1] + 3*u*t*t*c2[1] + t*t*t*a1[1], f]); } };
      var helix = function (cx, y0, rx, ry, drop) {   // 기둥을 2바퀴 감으며 내려감: 위쪽 호 = 기둥 앞, 아래쪽 호 = 기둥 뒤
        for (var k = 1; k <= 200; k++) { var t = k / 200, th = Math.PI + t * 4 * Math.PI; pts.push([cx + rx * Math.cos(th), y0 + drop * t + ry * Math.sin(th), Math.sin(th) <= 0 ? 1 : 0]); }
      };
      var Ys = Y.cx, Ls = L.x0 + L.w * 0.16, rY = Y.w * 0.34, rL = L.w * 0.3, ry = cap * 0.16, R = cap * 0.2;
      var yY = Y.M + cap * 0.06, yL = L.T + cap * 0.22;
      pts.push([-0.08 * W, Y.T - cap * 0.1, 1]);
      bez([Y.x0 - 0.8 * Y.w, Y.T - cap * 0.1], [Ys - rY - 0.3 * Y.w, yY - ry * 2], [Ys - rY, yY], 1);       // 진입
      helix(Ys, yY, rY, ry, cap * 0.32);                                                                       // Y 기둥 2바퀴
      bez([last()[0] + 0.5 * Y.w, last()[1]], [E1.x0 - 0.1 * E1.w, E1.T - cap * 0.3], [E1.cx, E1.T - cap * 0.22], 1);  // E 위로 넘어감 (왼쪽 획 앞)
      bez([E1.x1 + 0.1 * E1.w, E1.T - cap * 0.14], [(E1.x1 + S.x0) / 2, S.M], [S.cx, S.B + cap * 0.2], 1);   // E와 S 사이로 내려가 S 아래로
      var K = [(S.x1 + E2.x0) / 2, S.T + cap * 0.12];
      bez([S.x1 + 0.1 * S.w, S.B + cap * 0.2], [K[0] - 1.2 * R, K[1] + 2.2 * R], [K[0] - 0.2 * R, K[1] + 0.3 * R], 1);  // S 뒤를 지나 매듭으로
      bez([K[0] + 0.5 * R, K[1] - 0.9 * R], [K[0] + 1.6 * R, K[1] - 2.4 * R], [K[0] + 0.2 * R, K[1] - 2.3 * R], 1);   // 고리 위쪽
      bez([K[0] - 1.4 * R, K[1] - 2.2 * R], [K[0] - 1.6 * R, K[1] - 0.8 * R], [K[0] - 0.9 * R, K[1] - 0.1 * R], 1);   // 고리 왼쪽
      bez([K[0] - 0.2 * R, K[1] + 0.6 * R], [K[0] + 0.6 * R, K[1] + 0.9 * R], [K[0] + 1.6 * R, K[1] + 1.1 * R], 2);   // 자기 자신 위로 교차
      bez([E2.cx, E2.M + cap * 0.1], [U.x0, U.B + cap * 0.25], [U.cx, U.B + cap * 0.18], 1);               // E 앞을 대각선으로, U 아래로
      bez([U.x1 + 0.2 * U.w, U.B + cap * 0.1], [Ls - rL - 0.5 * L.w, yL - cap * 0.1], [Ls - rL, yL], 1);   // U 뒤를 올라 L로
      helix(Ls, yL, rL, ry, cap * 0.3);                                                                          // L 기둥 2바퀴
      bez([last()[0] + 0.7 * L.w, last()[1]], [L.x1 + 0.5 * L.w, L.T - cap * 0.3], [1.08 * W, L.T - cap * 0.5], 1); // 퇴장
      // 글자 획을 지나는 구간의 앞/뒤: E 앞, S 뒤, E 앞, U 뒤 (기둥 감기·매듭은 위에서 정함)
      pts.forEach(function (q) { if (q[2] !== 1) return;
        for (var bi = 1; bi <= 4; bi++) if (q[0] > box[bi].x0 && q[0] < box[bi].x1 && q[1] > box[bi].T && q[1] < box[bi].B) q[2] = bi % 2; });
      for (var it = 0; it < 3; it++) {   // 이음매를 매끈하게 (Chaikin)
        var sm = [pts[0]];
        for (var j = 0; j < pts.length - 1; j++) { var a1 = pts[j], b1 = pts[j + 1];
          sm.push([0.75 * a1[0] + 0.25 * b1[0], 0.75 * a1[1] + 0.25 * b1[1], a1[2]], [0.25 * a1[0] + 0.75 * b1[0], 0.25 * a1[1] + 0.75 * b1[1], b1[2]]); }
        sm.push(pts[pts.length - 1]); pts = sm;
      }
      var tang = resample(pts, N);
      // 중간 모양: 감긴 고리·매듭을 지운 완만한 곡선 (시작 → 중간 → 완성 순서로 펴져서 고리가 접히며 생기는 지그재그를 막음)
      var mid = tang.map(function (q2) { return [q2[0], q2[1]]; });
      for (var pass = 0; pass < 5; pass++) {
        var nx2 = [];
        for (var a3 = 0; a3 < N; a3++) { var sx2 = 0, sy2 = 0, c3 = 0; for (var b3 = Math.max(0, a3 - 30); b3 <= Math.min(N - 1, a3 + 30); b3++) { sx2 += mid[b3][0]; sy2 += mid[b3][1]; c3++; } nx2.push([sx2 / c3, sy2 / c3]); }
        nx2[0] = mid[0]; nx2[N - 1] = mid[N - 1]; mid = nx2;
      }

      // 완성: 카드 3개로 이어지는 흐름도
      var cards = $$('.hero-card', hero), lead = $('.hero-lead', hero);
      var cr2 = cards.map(function (c) { var r = c.getBoundingClientRect(); return { x: r.left - sr.left, cy: r.top - sr.top + r.height / 2, b: r.bottom - sr.top }; });
      var lr = lead.getBoundingClientRect(), stacked = cr2[0].cy > lr.bottom - sr.top - 5;
      var bx = cr2[0].x - (stacked ? 22 : 64), rad = narrow ? 10 : 16, yIn = stacked ? cr2[2].b + 34 : H * 0.88;
      var mainF = resample(elbow([[-0.08 * W, yIn], [bx, yIn], [bx, cr2[1].cy], [cr2[1].x, cr2[1].cy]], rad), N);
      var br1 = elbow([[bx, cr2[1].cy], [bx, cr2[0].cy], [cr2[0].x, cr2[0].cy]], rad);
      var br3 = [[bx, cr2[2].cy, 1], [cr2[2].x, cr2[2].cy, 1]];

      // 뒤 레이어(글자 아래): 두 가닥 전체 → 꼬임의 앞쪽 가닥 → 매듭 교차
      // 앞 레이어(글자 위): 글자 앞으로 지나가는 구간만 다시 그림
      var P_ = function (svg, stroke, w, butt) { var a2 = { stroke: stroke, 'stroke-width': w }; if (butt) a2['stroke-linecap'] = 'butt'; return mk('path', a2, svg); };
      var cordW = 2 * tr + tw + 4;
      el = {
        bB: P_(back, STRAND2, tw), bA: P_(back, THREAD, tw),
        twist: [P_(back, CREAM, tw + 3, 1), P_(back, STRAND2, tw, 1), P_(back, CREAM, tw + 3, 1), P_(back, THREAD, tw, 1)],
        knot: [P_(back, CREAM, cordW, 1), P_(back, STRAND2, tw, 1), P_(back, THREAD, tw, 1)],
        fr: [P_(front, CREAM, cordW, 1), P_(front, STRAND2, tw, 1), P_(front, THREAD, tw, 1), P_(front, CREAM, tw + 3, 1), P_(front, STRAND2, tw, 1)],
        b1: mk('path', { d: toD(br1), stroke: THREAD, 'stroke-width': tw }, back),
        b3: mk('path', { d: toD(br3), stroke: THREAD, 'stroke-width': tw }, back),
        dots: [[bx, cr2[1].cy], [bx, cr2[2].cy]].concat(cr2.map(function (c) { return [c.x, c.cy]; })).map(function (q) {
          return mk('circle', { cx: q[0].toFixed(1), cy: q[1].toFixed(1), r: narrow ? 3.5 : 4.5, fill: THREAD, stroke: CREAM, 'stroke-width': 3 }, back);
        }),
        clip: null
      };
      [el.b1, el.b3].forEach(function (b) { var l = b.getTotalLength(); b._len = l; b.style.strokeDasharray = l + ' ' + l; });
      // 첫 로딩 때 실이 왼쪽부터 그려지는 연출(한 번)
      ['th-clip-b', 'th-clip-f'].forEach(function (id, k) {
        var s2 = k ? front : back, cp = mk('clipPath', { id: id }, mk('defs', {}, s2));
        var rc = mk('rect', { x: -20, y: -20, width: (W + 40) * intro, height: H + 40 }, cp); (el.clip = el.clip || []).push(rc);
      });
      $$('path', back).forEach(function (e) { if (e !== el.b1 && e !== el.b3) e.setAttribute('clip-path', 'url(#th-clip-b)'); });
      $$('path', front).forEach(function (e) { e.setAttribute('clip-path', 'url(#th-clip-f)'); });
      // 워드마크 아래 소개 줄: 기존 hero-eyebrow 문구를 그대로 복제(장식용)
      var cap2 = $('.th-caption', stage) || stage.appendChild(Object.assign(document.createElement('p'), { className: 'th-caption' }));
      cap2.setAttribute('aria-hidden', 'true'); cap2.className = 'th-caption parts'; cap2.innerHTML = $('.hero-eyebrow', hero).innerHTML;
      cap2.style.left = cl + 'px'; cap2.style.top = (sy + 0.927 * fs + fs * 0.1 + (narrow ? 14 : 22)) + 'px';
      G = { W: W, H: H, tang: tang, mid: mid, fin: mainF, tr: tr, tp: tp, sep: narrow ? 24 : 46, rmin: narrow ? 7 : 9, mx: mx, my: my, sx: sx, sy: sy, fs: fs, cap: cap2 };
      built = true;
    };

    // 끈 물리: 마디 M개 사슬. 목표 쪽으로 당기고 → 마디 간 거리 유지 → 급하게 꺾인 마디는 이웃 가운데로 펴기 (반복)
    var rope = {
      M: 600,
      down: function (P) { var out = [], M = rope.M; for (var j = 0; j < M; j++) out.push(P[Math.round(j * (P.length - 1) / (M - 1))]); return out; },
      step: function (P, T, rmin) {
        var M = P.length, j, it, err = 0;
        for (j = 0; j < M; j++) { P[j][0] += (T[j][0] - P[j][0]) * 0.32; P[j][1] += (T[j][1] - P[j][1]) * 0.32; }
        var pin = function () { P[0][0] = T[0][0]; P[0][1] = T[0][1]; P[M - 1][0] = T[M - 1][0]; P[M - 1][1] = T[M - 1][1]; };
        pin();
        for (it = 0; it < 6; it++) {
          for (j = 0; j < M - 1; j++) {   // 늘어나지도 줄지도 않게
            var rest = Math.hypot(T[j + 1][0] - T[j][0], T[j + 1][1] - T[j][1]), dx = P[j + 1][0] - P[j][0], dy = P[j + 1][1] - P[j][1], d = Math.hypot(dx, dy) || 0.0001, f = (d - rest) / d * 0.5;
            P[j][0] += dx * f; P[j][1] += dy * f; P[j + 1][0] -= dx * f; P[j + 1][1] -= dy * f;
          }
          for (j = 1; j < M - 1; j++) {   // 최소 굽힘 반경 rmin보다 급한 꺾임은 펴기
            var ax = P[j][0] - P[j - 1][0], ay = P[j][1] - P[j - 1][1], bx2 = P[j + 1][0] - P[j][0], by2 = P[j + 1][1] - P[j][1];
            var la = Math.hypot(ax, ay), lb = Math.hypot(bx2, by2), turn = Math.abs(Math.atan2(ax * by2 - ay * bx2, ax * bx2 + ay * by2)), maxT = ((la + lb) / 2) / rmin;
            if (turn > maxT) { var k3 = 0.5 * (turn - maxT) / turn, mx2 = (P[j - 1][0] + P[j + 1][0]) / 2, my2 = (P[j - 1][1] + P[j + 1][1]) / 2;
              P[j][0] += (mx2 - P[j][0]) * k3; P[j][1] += (my2 - P[j][1]) * k3; }
          }
          pin();
        }
        for (j = 0; j < M; j++) err += Math.abs(T[j][0] - P[j][0]) + Math.abs(T[j][1] - P[j][1]);
        return err / M;
      },
      smoothD: function (P) {   // 마디 사이를 곡선으로 이어 그림
        var d = 'M' + P[0][0].toFixed(1) + ' ' + P[0][1].toFixed(1);
        for (var j = 1; j < P.length - 1; j++) d += 'Q' + P[j][0].toFixed(1) + ' ' + P[j][1].toFixed(1) + ' ' + ((P[j][0] + P[j + 1][0]) / 2).toFixed(1) + ' ' + ((P[j][1] + P[j + 1][1]) / 2).toFixed(1);
        var e = P[P.length - 1]; return d + 'L' + e[0].toFixed(1) + ' ' + e[1].toFixed(1);
      }
    };
    var settle = function () { queue(); };

    var render = function (p) {
      if (!built) return;
      // ② 끈이 왼쪽부터 팽팽해지며 꼬임이 풀려 한 가닥으로 합쳐짐 (점마다 조금씩 늦게 출발)
      var pm = clamp01((p - 0.06) / 0.42), C = [], qs = [], qb = [], i;
      for (i = 0; i < N; i++) {
        var q = ease(clamp01((pm - 0.35 * i / N) / 0.65)); qs.push(q);
        qb.push(ease(clamp01((pm - 0.35 * i / N - 0.07) / 0.65)));   // 블루그레이 가닥은 조금 늦게 따라옴
        var q1 = ease(clamp01(q * 2)), q2 = ease(clamp01(q * 2 - 1));   // 시작 → 중간(고리 없음) → 완성
        C.push([lerp(lerp(G.tang[i][0], G.mid[i][0], q1), G.fin[i][0], q2), lerp(lerp(G.tang[i][1], G.mid[i][1], q1), G.fin[i][1], q2)]);
      }
      // 스크롤이 빠를수록 크게 출렁임
      var spd = Math.min(1.5, Math.abs(p - (G.lastP == null ? p : G.lastP)) * 60); G.lastP = p;
      var bump = function (t) { return Math.pow(Math.sin(Math.PI * t), 1.3); };
      // 두 가닥 = 중심선 ± 법선 × (꼬임 + 벌어짐)
      //  꼬임: 반지름이 줄며 반대 방향으로 돌면서 풀림 / 벌어짐: 풀리는 동안 서로 밀어내듯 벌어졌다가, 끝에서 한 가닥으로 합쳐짐(B는 한 번 튕김)
      var limRaw = [], LIM = [];
      for (i = 0; i < N; i++) {   // 급커브(감긴 구간)에서는 벌어짐을 줄여 꼬이지 않게 — 값은 주변과 부드럽게 평균
        var u1 = C[Math.max(0, i - 6)], u2 = C[Math.min(N - 1, i + 6)];
        var v1x = C[i][0] - u1[0], v1y = C[i][1] - u1[1], v2x = u2[0] - C[i][0], v2y = u2[1] - C[i][1];
        var dl = (Math.hypot(v1x, v1y) + Math.hypot(v2x, v2y)) / 2 || 1, turn = Math.abs(Math.atan2(v1x * v2y - v1y * v2x, v1x * v2x + v1y * v2y));
        limRaw.push(turn > 0.01 ? Math.min(1, 0.7 * dl / turn / G.sep) : 1);
      }
      for (i = 0; i < N; i++) { var sm2 = 0, cn = 0; for (var k2 = Math.max(0, i - 20); k2 <= Math.min(N - 1, i + 20); k2++) { sm2 += limRaw[k2]; cn++; } LIM.push(Math.min(limRaw[i] * 1.5, sm2 / cn)); }
      var A = [], B = [], face = [], arc = 0;
      for (i = 0; i < N; i++) {
        var a0 = C[Math.max(0, i - 10)], a1 = C[Math.min(N - 1, i + 10)], nx = -(a1[1] - a0[1]), ny = a1[0] - a0[0], ln = Math.hypot(nx, ny) || 1; // 넓은 구간의 법선 → 급커브에서 뒤집힘 방지
        if (i) arc += Math.hypot(C[i][0] - C[i - 1][0], C[i][1] - C[i - 1][1]);
        var qa = qs[i], qB = qb[i];
        var lim = LIM[i];
        var ph = arc / G.tp * 6.2832 * (1 - qa) - qa * 18.85, tw2 = Math.sin(ph) * G.tr * (1 - qa);
        var wav = 1 + 0.35 * Math.sin(arc / 90 + qa * 8);
        var sa = G.sep * lim * bump(qa) * wav * (1 + spd * 0.6);
        var sb = G.sep * lim * (bump(qB) + (qB > 0.5 ? 0.22 * Math.sin(2 * Math.PI * qB) : 0)) * (1 + 0.35 * Math.sin(arc / 70 - qB * 9)) * (1 + spd * 0.6);
        nx /= ln; ny /= ln;
        A.push([C[i][0] + nx * (tw2 + sa), C[i][1] + ny * (tw2 + sa)]); B.push([C[i][0] - nx * (tw2 + sb), C[i][1] - ny * (tw2 + sb)]); face.push(Math.cos(ph) > 0);
      }
      var early = p < 0.04;   // 앞뒤·꼬임 표현은 끈이 움직이기 전까지만 (움직이면 한 번에 끔 → 끊김 방지)
      // 움직이는 동안에는 끈 물리(늘어나지 않음 + 일정 반경 이하로 꺾이지 않음)로 모양을 정함 — 위 A·B는 끌어당기는 목표
      if (early || p >= 0.999) {
        G.PA = G.PB = null;
        el.bA.setAttribute('d', toD(A)); el.bB.setAttribute('d', toD(B));
      } else {
        var TA = rope.down(A), TB = rope.down(B);
        if (!G.PA) { G.PA = TA.map(function (q2) { return q2.slice(); }); G.PB = TB.map(function (q2) { return q2.slice(); }); }
        var moved = rope.step(G.PA, TA, G.rmin) + rope.step(G.PB, TB, G.rmin);
        el.bA.setAttribute('d', rope.smoothD(G.PA)); el.bB.setAttribute('d', rope.smoothD(G.PB));
        if (moved > 0.3) settle();   // 목표에 닿을 때까지 몇 프레임 더 이어서 움직임
      }
      var all = [].concat(el.twist, el.knot, el.fr);
      all.forEach(function (e) { e.style.visibility = early ? '' : 'hidden'; });
      if (early) {
        var dashFor = function (pts2, test) {   // test가 참인 구간만 보이는 대시 배열
          var dsh = [], run = 0, on = test(0), tot = 0;
          if (!on) dsh.push(0);
          for (var k = 1; k < N; k++) { var sg = Math.hypot(pts2[k][0] - pts2[k - 1][0], pts2[k][1] - pts2[k - 1][1]), cu = test(k);
            if (cu !== on) { dsh.push(run.toFixed(1)); run = 0; on = cu; } run += sg; tot += sg; }
          dsh.push(run.toFixed(1), (tot + 10).toFixed(0)); return dsh.join(' ');
        };
        var dC = toD(C), dA = toD(A), dB = toD(B);
        var fl = function (k) { return G.tang[k][2]; };
        var set = function (e, d2, da) { e.setAttribute('d', d2); e.style.strokeDasharray = da; };
        // 꼬임: 가닥 B가 앞인 구간(A는 기본으로 B 위에 그려짐)
        set(el.twist[0], dB, dashFor(B, function (k) { return !face[k]; })); set(el.twist[1], dB, dashFor(B, function (k) { return !face[k]; }));
        set(el.twist[2], dA, dashFor(A, function (k) { return face[k]; })); set(el.twist[3], dA, dashFor(A, function (k) { return face[k]; }));
        // 매듭: 끈이 자기 자신 위로 지나가는 구간
        set(el.knot[0], dC, dashFor(C, function (k) { return fl(k) === 2; }));
        set(el.knot[1], dB, dashFor(B, function (k) { return fl(k) === 2; })); set(el.knot[2], dA, dashFor(A, function (k) { return fl(k) === 2; }));
        // 글자 앞: 글자 위로 끈 전체(배경 테두리 포함)를 다시 그림
        var over = function (k) { return fl(k) >= 1; };
        set(el.fr[0], dC, dashFor(C, over)); set(el.fr[1], dB, dashFor(B, over)); set(el.fr[2], dA, dashFor(A, over));
        set(el.fr[3], dB, dashFor(B, function (k) { return over(k) && !face[k]; })); set(el.fr[4], dB, dashFor(B, function (k) { return over(k) && !face[k]; }));
      }
      G.cap.style.opacity = (1 - clamp01(p / 0.06)).toFixed(3);
      // ③ 갈래와 점
      var bp = clamp01((p - 0.6) / 0.18);
      [el.b1, el.b3].forEach(function (b) { b.style.strokeDashoffset = (b._len * (1 - bp)).toFixed(1); b.style.visibility = bp > 0 ? '' : 'hidden'; }); // 시작 전엔 숨김 (둥근 끝 점 방지)
      var dp = clamp01((p - 0.74) / 0.1);
      el.dots.forEach(function (c) { c.style.opacity = dp; });
      // 큰 워드마크 → 메뉴 로고
      var t = ease(clamp01((p - 0.04) / 0.5)), done = t >= 0.995, s = 1, tx = G.sx - G.mx, ty = G.sy - G.my;
      if (logoText) {
        var lr = textRect(logoText, 0, logoText.length), sr = stage.getBoundingClientRect(), s1 = parseFloat(getComputedStyle(logo).fontSize) / G.fs;
        s = lerp(1, s1, t);
        var px = lerp(G.sx, lr.left - sr.left, t), py = lerp(G.sy, lr.top - sr.top, t);
        tx = px - s * G.mx; ty = py - s * G.my;
      }
      mark.style.transform = 'translate(' + tx.toFixed(1) + 'px,' + ty.toFixed(1) + 'px) scale(' + s.toFixed(4) + ')';
      mark.style.opacity = done ? 0 : 1;
      if (logo) logo.style.opacity = done ? '' : 0;
      nav.classList.toggle('th-clear', p < 1 && !reduceMotion);
      hero.style.setProperty('--th-copy', clamp01((p - 0.45) / 0.25).toFixed(3));
      hero.style.setProperty('--th-card', clamp01((p - 0.55) / 0.2).toFixed(3));
      hero.style.setProperty('--th-click', p > 0.7 ? 'auto' : 'none');
      hero.style.setProperty('--th-hint', (1 - clamp01(p / 0.08)).toFixed(3));
    };

    var progress = function () {
      if (reduceMotion) return 1;
      var r = hero.getBoundingClientRect(), span = r.height - window.innerHeight;
      return span > 0 ? clamp01(-r.top / span) : 1;
    };
    var thRaf = null;
    var queue = function () { if (thRaf === null) thRaf = requestAnimationFrame(function () { thRaf = null; render(progress()); }); };
    var rebuild = function () { build(); render(progress()); };
    if (!reduceMotion && progress() < 0.05) {   // 첫 로딩: 실이 그려지는 연출
      intro = 0;
      window.addEventListener('load', function () {
        var t0 = null, step = function (ts) {
          if (t0 === null) t0 = ts;
          intro = ease(clamp01((ts - t0) / 1600));
          if (el.clip) el.clip.forEach(function (rc) { rc.setAttribute('width', ((G.W + 40) * intro).toFixed(1)); });
          if (intro < 1) requestAnimationFrame(step);
        };
        setTimeout(function () { requestAnimationFrame(step); }, 350);
      });
    }
    rebuild();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(rebuild);
    window.addEventListener('scroll', queue, { passive: true });
    var rT; window.addEventListener('resize', function () { clearTimeout(rT); rT = setTimeout(rebuild, 150); });
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
