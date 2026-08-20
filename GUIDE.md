# 수정 가이드 (처음 하시는 분용)

HTML을 몰라도 이 문서만 보고 따라 하면 대부분의 수정이 가능합니다.

---

## 0. 준비: 어떤 파일을 열어야 하나

파일 3개만 기억하면 됩니다.

| 무엇을 바꾸고 싶은가 | 열어야 할 파일 |
| --- | --- |
| 글자, 문장, 프로젝트 내용 | `index.html` |
| 색깔, 글자 크기, 여백 | `assets/styles.css` |
| 동작 (팝업, 애니메이션) | `assets/main.js` |

메모장으로도 열리지만 [VS Code](https://code.visualstudio.com/)를 쓰면 색이 구분되어 훨씬 편합니다.

### 수정한 걸 바로 보는 법

`index.html` 파일을 더블클릭하면 브라우저에서 열립니다.
파일을 저장한 뒤 브라우저에서 **F5**(새로고침)를 누르면 바뀐 내용이 보입니다.

> 저장했는데 안 바뀌면 `Ctrl + Shift + R` 을 누르세요. (브라우저가 예전 파일을 기억하고 있는 경우)

---

## 1. 자주 하는 수정 12가지

### ① 첫 화면의 큰 제목 바꾸기

`index.html`에서 `hero-title`을 검색하세요.

```html
<h1 class="hero-title" data-depth="14">
  복잡한 운영을 구조로,<br />반복 이슈를 자동화로
</h1>
```

`<h1 ...>` 과 `</h1>` **사이의 글자만** 바꾸면 됩니다.
`<br />`는 줄바꿈입니다. 한 줄로 쓰고 싶으면 지우세요.

---

### ② 프로젝트 내용 바꾸기

`index.html`에서 `Project 01`을 검색하세요. 아래처럼 생겼습니다.

```html
<span class="work-no">Project 01</span>          ← 번호
<h3>위약금 계산기</h3>                            ← 제목
<p class="work-sub">영업 · CX 업무 자동화 툴 기획</p>  ← 한 줄 설명
<span class="work-meta">Product Planning · 2024–2025</span>  ← 기간·소속
```

**규칙은 하나입니다: `>` 와 `<` 사이의 글자만 바꾸세요.**
`<`, `>`, `class="..."` 부분은 절대 건드리지 마세요.

---

### ③ 프로젝트 추가하기

1. `index.html`에서 `<!-- 05 -->` 를 찾습니다.
2. 그 아래 `<article class="work-card ...>` 부터 짝이 되는 `</article>` 까지 **통째로** 복사합니다.
3. `</article>` 바로 뒤에 붙여넣습니다.
4. 붙여넣은 것의 글자만 바꿉니다. (Project 06, 새 제목, 새 설명 …)

> `<article>` 로 시작해서 `</article>` 로 끝나는 한 덩어리가 카드 1개입니다.
> VS Code에서 `<article>`을 클릭하면 짝이 되는 `</article>`이 표시됩니다.

---

### ④ 프로젝트 삭제하기

지우고 싶은 카드의 `<article class="work-card ...>` 부터 `</article>` 까지 통째로 지우면 됩니다.

> 맨 위 카드에는 `feature`가 붙어 있어 가로로 넓습니다.
> 맨 위 카드를 지웠다면, 새로 맨 위가 된 카드의 `class="work-card"` 를
> `class="work-card feature"` 로 바꿔주세요.

---

### ⑤ 클릭했을 때 뜨는 팝업 내용 바꾸기

카드 안쪽 `<div class="work-detail" hidden>` 부터가 팝업 내용입니다.

```html
<div class="work-detail" hidden>
  ...
  <div class="d-note">              ← 흰색 상자
    <h4>문제 정의</h4>
    <ul>
      <li>여기에 문장을 씁니다.</li>   ← 줄을 추가하려면 이 <li> 한 줄을 복사
    </ul>
  </div>

  <ol class="d-flow">               ← 남색 박스 + 주황 화살표 프로세스
    <li><div class="d-box">계약내용 분해</div><p>설명 글</p></li>
  </ol>
</div>
```

- `hidden` 은 **지우지 마세요.** (카드에서는 숨겨야 하는 내용입니다)
- `d-flow` 안에 `<li>` 를 추가하면 화살표가 자동으로 그려집니다.

### 두 가지 도식 중 고르기

프로젝트 성격에 따라 골라 쓰세요. **둘을 섞지 마세요.**

| 도식 | 언제 쓰나 | 생김새 |
| --- | --- | --- |
| `d-flow` | 실제로 **순서대로 진행**된 일 (감지 → 분류 → 조치) | 남색 박스가 주황 화살표로 이어짐 |
| `d-logic` | 순서가 아니라 **판단의 흐름** (관찰 → 가설 → 반증 → 결론) | 흰 카드 2×2, 화살표 없음 |

`d-logic` 은 Project 05(CMS 결제 정책 개선)에서 쓰고 있습니다. 형태는 이렇습니다.

```html
<ol class="d-logic">
  <li>
    <span class="d-logic-role">관찰 · AS-IS</span>   ← 작은 주황 라벨
    <h5>분석</h5>                                     ← 카드 제목
    <p>설명 글</p>
  </li>
  <li class="is-pivot">                               ← 판단이 뒤집힌 칸
    <span class="d-logic-role">반증 · Trade-off</span>
    <h5>리스크</h5>
    <p>설명 글</p>
  </li>
</ol>
```

`class="is-pivot"` 을 붙이면 그 카드만 주황 테두리로 강조됩니다.
가설이 뒤집힌 지점 **한 곳에만** 붙이세요. 여러 곳에 붙이면 강조 효과가 사라집니다.

---

### ⑥ 색깔 전체 바꾸기

`assets/styles.css` 파일 맨 위 `:root` 부분입니다. 여기만 바꾸면 사이트 전체 색이 바뀝니다.

```css
--navy-900: #13253f;   /* 가장 진한 남색 : 첫화면 배경 */
--navy:     #1e3a5f;   /* 기본 남색 : 모든 제목 글자 */
--coral:    #e07a5f;   /* 주황 : 라벨, 세로 막대, 버튼 */
--cream:    #faf7f2;   /* 페이지 기본 배경 */
```

예를 들어 주황색을 초록색으로 바꾸고 싶다면 `--coral` 값만 `#4c956c` 처럼 바꾸면
라벨·화살표·버튼이 한꺼번에 바뀝니다.

> 색상 코드는 [Google 색상 선택기](https://www.google.com/search?q=color+picker)에서 고르면 `#` 으로 시작하는 코드를 알려줍니다.

---

### ⑦ 자격증 추가하기

`index.html`에서 `cert-card`를 검색하세요. 카드 1개는 이렇게 생겼습니다.

```html
<article class="cert-card reveal">
  <span class="cert-cat">Data · AI</span>        ← 작은 주황 분류 라벨
  <h3>AI-POT 1급</h3>                             ← 자격증 이름
  <span class="cert-badge is-earned">취득</span>  ← 오른쪽 상태 배지
</article>
```

`<article>` 부터 `</article>` 까지 복사해서 붙여넣고 글자만 바꾸면 됩니다.

배지는 두 종류입니다.

| 클래스 | 표시 | 모양 |
| --- | --- | --- |
| `is-earned` | 취득 | 남색 채움 |
| `is-completed` | 수료 | 주황 테두리 |

**발급기관과 취득일을 넣고 싶다면** `<h3>` 바로 아래에 이 한 줄을 추가하세요.

```html
<span class="cert-meta">한국산업인력공단 · 2025.08</span>
```

스타일은 이미 준비되어 있어서 줄만 추가하면 바로 보입니다.

---

### ⑧ 사이드 프로젝트 (접었다 펴지는 한 줄)

자격증 섹션 맨 아래, 얇은 선 아래 작은 글씨 한 줄입니다.
업무와 무관한 내용이라 **일부러 눈에 안 띄게** 만들어 두었습니다.
`index.html`에서 `side-project`를 검색하세요.

**한 줄 글씨 바꾸기**

```html
<b>고유명사 지킴이</b>                              ← 이름
<span>직접 만든 웹앱 · 바로 실행해 볼 수 있습니다</span>  ← 한 줄 설명
<span class="sp-toggle-cta-text">펼쳐보기</span>      ← 오른쪽 안내 글자
```

**왼쪽 주황 점의 깜빡임을 끄고 싶다면** `assets/styles.css` 의 `.sp-dot::after` 에서
`animation:` 로 시작하는 줄을 지우세요. (스크롤 중에 시선을 끌기 위한 표시입니다)

**펼쳤을 때 나오는 설명 바꾸기**

```html
<p class="sp-desc">맞춤법 검사기가 ...</p>
```

**안에 넣는 앱 주소 바꾸기**

```html
<iframe id="spFrame" data-src="https://kurotoni.github.io/novel-spell-checker/" ...>
```

`src` 가 아니라 **`data-src`** 인 점에 주의하세요. 버튼을 처음 눌렀을 때만
앱을 불러오도록 일부러 이렇게 해두었습니다. (안 누른 사람은 안 불러와서 페이지가 가볍습니다)

같은 주소가 아래 `새 탭에서 열기` 링크에도 있으니 **두 군데 다** 바꿔야 합니다.

**앱 화면 높이 바꾸기** — `assets/styles.css` 에서 `.sp-frame iframe` 를 찾아 `height` 값을 조절하세요.

**더 조용하게 하고 싶다면** `assets/styles.css` 의 `.sp-toggle` 에서
`background: var(--cream-2)` 를 `none` 으로, `border` 를 `0` 으로 바꾸세요.

**블록을 통째로 빼고 싶다면** `<div class="side-project ...>` 부터 짝이 되는 `</div>` 까지 지우면 됩니다.

---

### ⑨ 연락처 링크 바꾸기 / 살리기

`index.html`에서 `contact-card`를 검색하세요.

**링크가 있는 것** (클릭 가능):
```html
<a class="contact-card" href="mailto:easter3538@naver.com">
  <b>Email</b>
  <span>easter3538@naver.com</span>
</a>
```

**준비 중인 것** (클릭 불가, 흐리게 표시):
```html
<div class="contact-card is-soon">
  <b>Notion</b>
  <span>Coming soon</span>
</div>
```

Notion 주소가 생기면 위 `<div ...>` 를 아래처럼 바꾸면 됩니다.

```html
<a class="contact-card" href="https://notion.so/내주소" target="_blank" rel="noopener noreferrer">
  <b>Notion</b>
  <span>포트폴리오 보기</span>
</a>
```

시작 태그가 `<div>` → `<a>` 로, 끝 태그도 `</div>` → `</a>` 로 **둘 다** 바뀐 점에 주의하세요.

---

### ⑩ 숫자 요약 띠 바꾸기

`index.html`에서 `data-count`를 검색하세요.

```html
<span class="stat-n" data-count="4" data-suffix="년 4개월">0</span>
<span class="stat-label">운영 · 기획 경력</span>
```

- `data-count` : 0부터 세어 올라갈 목표 숫자
- `data-suffix` : 숫자 뒤에 붙는 글자
- `stat-label` : 아래 설명

숫자 애니메이션 없이 글자를 그냥 쓰고 싶다면 `data-count`, `data-suffix`를 지우고
`<span class="stat-n">원하는 글자</span>` 로 쓰면 됩니다.

---

### ⑪ 메뉴 항목 추가하기

**두 군데를 똑같이** 고쳐야 합니다. (PC 메뉴 / 모바일 메뉴)

```html
<!-- PC 메뉴 : nav-links 안 -->
<li><a href="#works">Works</a></li>

<!-- 모바일 메뉴 : mobile-menu 안 -->
<a href="#works">Works</a>
```

`href="#works"` 의 `works` 는 이동할 섹션의 `id` 와 같아야 합니다.
(예: `<section id="works">` 로 이동)

새 섹션을 만들었다면 `assets/main.js` 의 이 줄에도 id를 추가하세요.

```javascript
var sectionIds = ['about', 'competency', 'works', 'stack', 'credentials', 'contact'];
```

---

### ⑫ 마우스 따라 움직이는 효과 조절 / 끄기

`index.html`의 `data-depth` 숫자입니다.

```html
<h1 class="hero-title" data-depth="14">
```

- 숫자가 **클수록** 마우스를 많이 따라 움직입니다
- `data-depth="0"` 이면 안 움직입니다
- `data-depth="14"` 부분을 통째로 지워도 안 움직입니다

---

## 2. 절대 하면 안 되는 것

| 하면 안 되는 것 | 이유 |
| --- | --- |
| `class="..."` 안의 영어를 바꾸기 | 디자인이 깨집니다 |
| `<` `>` `/` 기호를 지우기 | 페이지가 안 보일 수 있습니다 |
| 여는 태그만 지우고 닫는 태그를 남기기 | 레이아웃이 무너집니다 |
| `hidden` 지우기 | 팝업 내용이 카드에 그대로 다 보입니다 |
| 파일 이름 바꾸기 | 연결이 끊어집니다 |

---

## 3. 망가졌을 때

### 되돌리기
편집기에서 `Ctrl + Z` 를 계속 누르면 저장 전 상태로 돌아갑니다.

### 이미 저장했다면 (GitHub에 올린 경우)
```bash
git checkout -- index.html
```
마지막으로 커밋한 상태로 되돌립니다.

### 안전하게 작업하는 습관
크게 고치기 전에 `index.html` 을 복사해서 `index-백업.html` 로 만들어 두세요.
문제가 생기면 백업 파일 내용을 다시 붙여넣으면 됩니다.

---

## 4. 수정한 내용을 실제 사이트에 반영하기

GitHub + Vercel로 배포한 뒤에는, 파일을 고치고 아래 3줄만 실행하면
Vercel이 자동으로 사이트를 새로 만들어 줍니다. (1~2분 소요)

```bash
git add .
```
```bash
git commit -m "내용 수정"
```
```bash
git push
```

GitHub 웹사이트에서 파일을 직접 고쳐도 됩니다.
저장소 → 파일 클릭 → 연필 아이콘 → 수정 → `Commit changes` 버튼.

---

## 5. 구조 한눈에 보기

```
index.html
 ├─ [1]  로딩 화면
 ├─ [2]  상단 메뉴바
 ├─ [3]  첫 화면        (남색 배경)
 ├─ [4]  소개 ABOUT
 ├─ [5]  핵심 역량       (카드 3개)
 ├─ [6]  프로젝트 WORKS  ★ 가장 자주 고치는 곳
 ├─ [7]  숫자 요약       (남색 띠)
 ├─ [8]  사용 도구 STACK
 ├─ [9]  자격증 CREDENTIALS
 ├─ [10] 연락처 CONNECT  (남색 배경)
 └─ [11] 프로젝트 팝업   (빈 껍데기, 건드릴 일 없음)
```

`index.html`에서 `[6]` 처럼 대괄호를 검색하면 해당 위치로 바로 갑니다.
