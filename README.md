# Yeseul You — 포트폴리오 2026

구글 슬라이드 포트폴리오를 원페이지 웹사이트로 옮긴 정적 사이트입니다.
빌드 도구도, 설치할 것도 없습니다. `index.html`을 더블클릭하면 바로 열립니다.

> **처음 수정하시나요?** → [GUIDE.md](GUIDE.md) 를 먼저 읽어보세요.
> HTML을 몰라도 따라 할 수 있게 쓴 수정 설명서입니다.

---

## 파일 구성

```
index.html          페이지 전체 (글자와 순서)   ← 내용을 고치는 곳
assets/styles.css   색·크기·여백               ← 디자인을 고치는 곳
assets/main.js      팝업·애니메이션 동작        ← 거의 고칠 일 없음
GUIDE.md            초보자용 수정 가이드
vercel.json         Vercel 배포 설정
```

---

## 디자인

색상은 원본 구글 슬라이드에서 그대로 추출했습니다.

| 토큰 | 값 | 쓰이는 곳 |
| --- | --- | --- |
| `--navy-900` | `#13253f` | 첫화면 배경, 숫자 띠, 프로세스 박스 |
| `--navy` | `#1e3a5f` | 모든 제목 글자, 연락처 배경 |
| `--navy-700` | `#2f3f56` | 남색 배경 위의 카드 |
| `--coral` | `#e07a5f` | 라벨, 세로 막대, 화살표, 버튼 |
| `--sand` | `#f2cc8f` | 남색 배경 위 강조 글자 |
| `--cream` | `#faf7f2` | 페이지 배경 |
| `--slate` | `#616e7a` | 본문 글자 |

폰트는 Pretendard Variable (jsDelivr CDN), 폴백은 Inter → 시스템 기본 글꼴.
값은 모두 `assets/styles.css` 맨 위 `:root` 한 곳에 모여 있습니다.

## 슬라이드 → 웹 대응

| 원본 슬라이드 | 웹 섹션 |
| --- | --- |
| 표지 | `#hero` — 남색 배경, 코랄 세로 막대, 카테고리 카드 3개 |
| ABOUT ME | `#about` — 본문 + 경력 카드 |
| Core Competencies | `#competency` — 흰 카드 3개 |
| PROJECT 01–05 | `#works` — 카드 클릭 시 상세 팝업 |
| WORKING STACK | `#stack` — 흰 카드 3개 + 남색 Frameworks 띠 |
| CONNECT | `#contact` — 남색 배경, 연락처 카드 그리드 |

슬라이드에 있던 개인 전화번호는 공개 사이트라 의도적으로 넣지 않았습니다.

---

## 로컬에서 보기

`index.html` 더블클릭이면 충분합니다.
서버로 띄우고 싶다면:

```bash
python -m http.server 8000
```

---

## 배포

Vercel에 GitHub 저장소를 연결합니다.
프레임워크 프리셋은 **Other**, 빌드 명령과 출력 디렉터리는 비워두면 루트가 그대로 서빙됩니다.

배포 후 내용을 수정하려면 파일을 고치고 `git push` 하면 Vercel이 자동으로 재배포합니다.
자세한 순서는 [GUIDE.md](GUIDE.md) 4번 항목에 있습니다.

---

## 브라우저 지원

Chrome, Edge, Safari, Firefox 최신 버전.
`prefers-reduced-motion` 을 켠 사용자에게는 애니메이션이 자동으로 꺼집니다.
