/* Yeseul You — 포트폴리오 2026
   1) 로딩  2) 메뉴  3) 첫화면 마우스 반응  4) 스크롤 등장  5) 숫자 세기
   6) 프로젝트 캐러셀  7) 프로젝트 팝업  8) 사이드 프로젝트 */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var hasIO = 'IntersectionObserver' in window;

  function onView(els, opts, fn) {
    if (!hasIO) { els.forEach(fn); return; }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { fn(e.target); io.unobserve(e.target); }
      });
    }, opts);
    els.forEach(function (el) { io.observe(el); });
  }

  /* 1) 로딩 화면 — 로드 후 0.3초, 늦어도 2.5초 뒤 감춤 */
  function hideLoader() { var l = $('#loader'); if (l) l.classList.add('hidden'); }
  window.addEventListener('load', function () { setTimeout(hideLoader, reduceMotion ? 0 : 300); });
  setTimeout(hideLoader, 2500);

  /* 2) 메뉴 — 스크롤 상태, 남색 구간 위 흰 글자, 현재 섹션 표시 */
  var nav = $('#nav');
  var hero = $('#hero');
  var darkZones = [hero, $('.stats'), $('#contact')].filter(Boolean);
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

  /* 3) 첫화면 — 마우스를 따라 배경(--mx/--my)과 data-depth 요소가 움직임 */
  if (hero && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    var layers = $$('[data-depth]', hero).map(function (el) { return { el: el, d: parseFloat(el.dataset.depth) || 0 }; });
    var tx = 0, ty = 0, cx = 0, cy = 0, raf = null;

    var tick = function () {
      cx += (tx - cx) * 0.08;
      cy += (ty - cy) * 0.08;
      hero.style.setProperty('--mx', cx.toFixed(4));
      hero.style.setProperty('--my', cy.toFixed(4));
      layers.forEach(function (l) {
        l.el.style.transform = 'translate3d(' + (cx * l.d).toFixed(2) + 'px,' + (cy * l.d * 0.55).toFixed(2) + 'px,0)';
      });
      raf = (Math.abs(tx - cx) > 0.0005 || Math.abs(ty - cy) > 0.0005) ? requestAnimationFrame(tick) : null;
    };
    var kick = function () { if (raf === null) raf = requestAnimationFrame(tick); };

    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      var px = (e.clientX - r.left) / r.width, py = (e.clientY - r.top) / r.height;
      tx = px - 0.5; ty = py - 0.5;
      hero.style.setProperty('--px', px * 100 + '%');
      hero.style.setProperty('--py', py * 100 + '%');
      kick();
    });
    hero.addEventListener('mouseleave', function () { tx = ty = 0; kick(); });
  }

  /* 4) 스크롤 등장 — 같은 부모 안의 .reveal 은 순서대로 0.09초씩 늦게 */
  var reveals = $$('.reveal');
  reveals.forEach(function (el) {
    var sibs = $$(':scope > .reveal', el.parentNode);
    var i = sibs.indexOf(el) % 4;
    if (i > 0) el.style.transitionDelay = (i * 0.09) + 's';
  });
  onView(reveals, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }, function (el) { el.classList.add('visible'); });
  setTimeout(function () { // 안전장치: 관찰이 동작하지 않으면 전부 표시
    if (!$('.reveal.visible')) reveals.forEach(function (el) { el.classList.add('visible'); });
  }, 2000);

  /* 5) 숫자 세기 — data-count 까지 0부터 올라감 */
  onView($$('.stat-n[data-count]'), { threshold: 0.5 }, function (el) {
    var end = parseFloat(el.dataset.count);
    var tail = el.dataset.suffix ? '<span class="unit">' + el.dataset.suffix + '</span>' : '';
    var render = function (v) { el.innerHTML = Math.round(v).toLocaleString('ko-KR') + tail; };
    if (reduceMotion || isNaN(end)) return;
    var t0 = null;
    var step = function (ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / 1300, 1);
      render(end * (1 - Math.pow(1 - p, 3)));
      if (p < 1) requestAnimationFrame(step);
    };
    render(0);
    requestAnimationFrame(step);
  });

  /* 6) 프로젝트 캐러셀 — 탭 · 화살표 · ←→ 키 · 스와이프 */
  var track = $('.works-track');
  var cards = $$('.work-card', track);
  var tabsBox = $('.works-tabs');
  var countNow = $('.works-count b');
  var prevBtn = $('.works-arrow.prev');
  var nextBtn = $('.works-arrow.next');
  var pad2 = function (n) { return (n < 10 ? '0' : '') + n; };
  var current = -1;

  $('.works-count span').textContent = pad2(cards.length);
  var tabs = cards.map(function (card, i) {
    var tab = document.createElement('button');
    tab.type = 'button';
    tab.className = 'works-tab';
    tab.setAttribute('role', 'tab');
    tab.innerHTML = '<em>' + pad2(i + 1) + '</em>';
    tab.appendChild(document.createTextNode($('h3', card).textContent));
    tab.addEventListener('click', function () { goTo(i); });
    tabsBox.appendChild(tab);
    return tab;
  });

  function setActive(i) {
    if (i === current) return;
    current = i;
    cards.forEach(function (c, k) {
      c.classList.toggle('is-active', k === i);
      c.tabIndex = k === i ? 0 : -1;
    });
    tabs.forEach(function (t, k) {
      t.classList.toggle('is-active', k === i);
      t.setAttribute('aria-selected', String(k === i));
    });
    if (tabsBox.scrollWidth > tabsBox.clientWidth) {
      tabsBox.scrollTo({ left: tabs[i].offsetLeft - tabsBox.offsetLeft - 8, behavior: 'smooth' });
    }
    countNow.textContent = pad2(i + 1);
    prevBtn.disabled = i === 0;
    nextBtn.disabled = i === cards.length - 1;
  }

  function goTo(i) {
    i = Math.max(0, Math.min(cards.length - 1, i));
    track.scrollTo({ left: cards[i].offsetLeft - cards[0].offsetLeft, behavior: reduceMotion ? 'auto' : 'smooth' });
    setActive(i);
  }

  var scrollTimer;
  track.addEventListener('scroll', function () {
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(function () {
      var x = track.scrollLeft, best = 0, bestD = Infinity;
      cards.forEach(function (c, k) {
        var d = Math.abs(c.offsetLeft - cards[0].offsetLeft - x);
        if (d < bestD) { bestD = d; best = k; }
      });
      if (x + track.clientWidth >= track.scrollWidth - 4) best = cards.length - 1;
      setActive(best);
    }, 80);
  }, { passive: true });

  prevBtn.addEventListener('click', function () { goTo(current - 1); });
  nextBtn.addEventListener('click', function () { goTo(current + 1); });
  $('.works-carousel').addEventListener('keydown', function (e) {
    if (e.key === 'ArrowRight') { e.preventDefault(); goTo(current + 1); }
    if (e.key === 'ArrowLeft') { e.preventDefault(); goTo(current - 1); }
  });
  setActive(0);

  // 첫화면 카드 → 해당 프로젝트로 이동
  $$('[data-go]').forEach(function (a) {
    a.addEventListener('click', function () { goTo(parseInt(a.dataset.go, 10) || 0); });
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

  cards.forEach(function (card, i) {
    card.addEventListener('click', function () {
      if (i !== current) { goTo(i); return; } // 옆 카드를 누르면 그 카드로 이동
      openModal(card);
    });
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
