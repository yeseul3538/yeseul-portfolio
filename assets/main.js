/* ============================================================================
   Yeseul You — 포트폴리오 2026 / 동작 스크립트

   이 파일이 하는 일은 딱 7가지입니다.

     1) 로딩 화면 감추기
     2) 메뉴바 : 스크롤에 따라 색/높이 바꾸고 현재 위치 표시
     3) 모바일 햄버거 메뉴 열고 닫기
     4) 첫화면 : 마우스를 따라 배경이 살짝 움직이기
     5) 스크롤하면 요소가 아래에서 떠오르기 (.reveal)
     6) 숫자 세기 애니메이션 + 프로젝트 카드 클릭 시 팝업
     7) 사이드 프로젝트 블록 접기 / 펼치기

   글자나 색을 바꾸는 일은 이 파일이 아니라
   index.html / assets/styles.css 에서 합니다.

   ※ 전체가 (function(){ ... })(); 로 감싸져 있는 이유:
      여기서 만든 변수가 밖으로 새어나가지 않게 하려는 관용적인 방법입니다.
   ============================================================================ */
(function () {
  'use strict';

  // 사용자가 OS에서 "동작 줄이기"를 켰는지 확인 (켰으면 애니메이션을 생략)
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1) 로딩 화면 ---------- */
  function hideLoader() {
    var loader = document.getElementById('loader');
    if (loader) loader.classList.add('hidden');
  }
  // 페이지 로딩이 끝나면 0.8초 뒤에 감춥니다. (숫자를 줄이면 더 빨리 사라짐)
  window.addEventListener('load', function () {
    setTimeout(hideLoader, reduceMotion ? 0 : 800);
  });
  // 혹시 이미지가 안 불러와져도 3.5초 뒤에는 무조건 감춥니다 (안전장치)
  setTimeout(hideLoader, 3500);

  /* ---------- 2) 메뉴바 ----------
     · 40px 이상 스크롤하면  → nav 에 'scrolled' 를 붙여 높이를 줄임
     · 남색 구간(첫화면·연락처) 위에서는 → 'on-dark' 를 붙여 글자를 흰색으로
     · 현재 보고 있는 섹션의 메뉴에 'active' 를 붙여 밑줄 표시           */
  var nav = document.getElementById('nav');
  var hero = document.getElementById('hero');
  // 메뉴에서 현재 위치를 표시할 섹션 id 목록.
  // index.html 에 섹션을 추가했다면 여기에도 id 를 넣어주세요.
  var sectionIds = ['about', 'competency', 'works', 'stack', 'credentials', 'contact'];
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-links a'));

  function onScroll() {
    var y = window.scrollY;
    if (nav) {
      nav.classList.toggle('scrolled', y > 40);
      var heroBottom = hero ? hero.offsetHeight - 70 : 0;
      // 연락처 섹션도 남색이라 이 위에서도 메뉴바를 흰 글자로 유지합니다
      var contact = document.getElementById('contact');
      var overContact = contact && y + 70 >= contact.offsetTop && y + 70 < contact.offsetTop + contact.offsetHeight;
      nav.classList.toggle('on-dark', y < heroBottom || !!overContact);
    }

    var pos = y + window.innerHeight * 0.35;
    var current = '';
    sectionIds.forEach(function (id) {
      var el = document.getElementById(id);
      if (el && el.offsetTop <= pos) current = id;
    });
    navLinks.forEach(function (a) {
      a.classList.toggle('active', a.getAttribute('href') === '#' + current);
    });
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- 3) 모바일 햄버거 메뉴 ---------- */
  var burger = document.getElementById('burger');
  var mobileMenu = document.getElementById('mobileMenu');
  var menuClose = document.getElementById('menuClose');

  function setMenu(open) {
    if (!mobileMenu || !burger) return;
    mobileMenu.classList.toggle('open', open);
    burger.setAttribute('aria-expanded', String(open));
  }
  if (burger) burger.addEventListener('click', function () { setMenu(!mobileMenu.classList.contains('open')); });
  if (menuClose) menuClose.addEventListener('click', function () { setMenu(false); });
  if (mobileMenu) {
    mobileMenu.querySelectorAll('a').forEach(function (a) {
      a.addEventListener('click', function () { setMenu(false); });
    });
  }

  /* ---------- 4) 첫화면 마우스 반응 ----------
     마우스 위치를 -0.5 ~ 0.5 범위 숫자로 바꿔서
     CSS 변수 --mx / --my 에 넣어줍니다. 배경은 CSS 가 알아서 움직입니다.
     index.html 에서 data-depth="14" 처럼 적힌 요소는 그 숫자만큼 따라 움직입니다.
     (마우스가 없는 터치 기기에서는 아예 동작하지 않습니다)             */
  if (hero && !reduceMotion && window.matchMedia('(hover: hover)').matches) {
    var layers = Array.prototype.slice.call(hero.querySelectorAll('[data-depth]'));
    var targetX = 0, targetY = 0, curX = 0, curY = 0, rafId = null;

    function tick() {
      curX += (targetX - curX) * 0.08;
      curY += (targetY - curY) * 0.08;
      hero.style.setProperty('--mx', curX.toFixed(4));
      hero.style.setProperty('--my', curY.toFixed(4));
      layers.forEach(function (el) {
        var d = parseFloat(el.getAttribute('data-depth')) || 0;
        el.style.transform = 'translate3d(' + (curX * d).toFixed(2) + 'px,' + (curY * d * 0.55).toFixed(2) + 'px,0)';
      });
      if (Math.abs(targetX - curX) > 0.0005 || Math.abs(targetY - curY) > 0.0005) {
        rafId = requestAnimationFrame(tick);
      } else {
        rafId = null;
      }
    }

    hero.addEventListener('mousemove', function (e) {
      var r = hero.getBoundingClientRect();
      targetX = (e.clientX - r.left) / r.width - 0.5;
      targetY = (e.clientY - r.top) / r.height - 0.5;
      hero.style.setProperty('--px', ((e.clientX - r.left) / r.width * 100) + '%');
      hero.style.setProperty('--py', ((e.clientY - r.top) / r.height * 100) + '%');
      if (rafId === null) rafId = requestAnimationFrame(tick);
    });

    hero.addEventListener('mouseleave', function () {
      targetX = 0; targetY = 0;
      if (rafId === null) rafId = requestAnimationFrame(tick);
    });
  }

  /* ---------- 5) 스크롤 등장 효과 ----------
     class="reveal" 이 붙은 요소가 화면에 들어오면 'visible' 을 붙여
     CSS 가 아래에서 위로 떠오르게 만듭니다. 한 번 나타나면 감시를 멈춥니다. */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll('.reveal'));
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });
    revealEls.forEach(function (el) { io.observe(el); });

    // 안전장치: 2초가 지났는데 단 하나도 나타나지 않았다면
    // IntersectionObserver 가 동작하지 않는 환경이라고 보고 전부 보여줍니다.
    // (이게 없으면 내용이 전부 투명한 채로 남아 빈 화면이 됩니다)
    setTimeout(function () {
      if (!document.querySelector('.reveal.visible')) {
        revealEls.forEach(function (el) { el.classList.add('visible'); });
      }
    }, 2000);
  } else {
    revealEls.forEach(function (el) { el.classList.add('visible'); });
  }

  /* ---------- 6-1) 숫자 세기 애니메이션 ----------
     index.html 의 data-count(목표 숫자) 와 data-suffix(뒤에 붙는 글자)를 읽습니다. */
  function animateCount(el) {
    var end = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (isNaN(end)) return;
    var tail = suffix ? '<span class="unit">' + suffix + '</span>' : '';
    if (reduceMotion) {
      el.innerHTML = end.toLocaleString('ko-KR') + tail;
      return;
    }
    var dur = 1300, t0 = null; // dur = 세는 데 걸리는 시간(밀리초)
    function step(ts) {
      if (t0 === null) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      el.innerHTML = Math.round(end * eased).toLocaleString('ko-KR') + tail;
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  var counters = Array.prototype.slice.call(document.querySelectorAll('.stat-n[data-count]'));
  if ('IntersectionObserver' in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          cio.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- 6-2) 프로젝트 상세 팝업 ----------
     카드를 클릭하면 그 카드 안의 .work-detail 내용을
     화면 가운데 팝업(#modalBody)으로 복사해서 보여줍니다.
     닫기 : X 버튼 / 바깥 어두운 영역 클릭 / ESC 키                    */
  var modal = document.getElementById('modal');
  var modalBody = document.getElementById('modalBody');
  var modalClose = document.getElementById('modalClose');
  var modalPanel = modal ? modal.querySelector('.modal-panel') : null;
  var lastFocused = null;

  function openModal(card) {
    var detail = card.querySelector('.work-detail');
    if (!detail || !modal || !modalBody) return;
    lastFocused = card;
    modalBody.innerHTML = detail.innerHTML;
    modal.classList.add('open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');
    if (modalPanel) modalPanel.scrollTop = 0;
    if (modalClose) modalClose.focus();
  }

  function closeModal() {
    if (!modal || !modal.classList.contains('open')) return;
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');
    if (modalBody) modalBody.innerHTML = '';
    if (lastFocused) lastFocused.focus();
  }

  document.querySelectorAll('.work-card').forEach(function (card) {
    card.addEventListener('click', function () { openModal(card); });
    card.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  if (modalClose) modalClose.addEventListener('click', closeModal);
  if (modal) {
    modal.addEventListener('click', function (e) {
      if (e.target.hasAttribute('data-close')) closeModal();
    });
  }
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') { closeModal(); setMenu(false); }
  });

  /* ---------- 7) 사이드 프로젝트 접기 / 펼치기 ----------
     처음에는 .sp-panel 에 hidden 이 붙어 있어 접혀 있습니다.
     버튼을 누르면 hidden 을 떼고, 안의 앱(iframe)을 그때 처음 불러옵니다.
     이렇게 해야 펼치지 않은 사람은 앱을 내려받지 않아 페이지가 가볍습니다. */
  var spToggle = document.getElementById('spToggle');
  var spPanel = document.getElementById('spPanel');
  var spFrame = document.getElementById('spFrame');

  if (spToggle && spPanel) {
    spToggle.addEventListener('click', function () {
      var willOpen = spPanel.hasAttribute('hidden');

      if (willOpen) {
        spPanel.removeAttribute('hidden');
        // iframe 은 처음 펼칠 때 한 번만 주소를 넣습니다.
        if (spFrame && !spFrame.getAttribute('src')) {
          spFrame.setAttribute('src', spFrame.getAttribute('data-src'));
        }
      } else {
        spPanel.setAttribute('hidden', '');
      }

      spToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      var label = spToggle.querySelector('.sp-toggle-text');
      if (label) label.textContent = willOpen ? '접기' : '직접 써보기';
    });
  }
})();
