# 에듀케이션 카페

교실과 일상을 위해 만든 웹앱을 보드게임 카페 선반에 진열하고, 하나씩 "개봉"하며 공개하는 포트폴리오 사이트입니다.

## 페이지 구성

| 파일 | 메뉴 이름 | 역할 |
|---|---|---|
| `index.html` | 로비 | 층별 선반(1층 수업용 · 2층 업무용 · 3층 생활·게임), 개봉 현황 |
| `collection.html` | 컬렉션 | 전체 앱 카드 목록, 층별 필터 |
| `rulebook.html?id=앱아이디` | 룰북 | 앱 상세 소개, 플레이하기 버튼 |
| `log.html` | 플레이 로그 | 개봉·업데이트 기록 (로비에는 최근 3개) |
| `suggest.html` | 확장팩 제안함 | 방문자 아이디어 제안서 (구글 폼으로 전송), 채택된 제안 목록 |
| `404.html` | - | 없는 주소로 들어왔을 때 |

## 새 앱을 공개하는 방법

`data/apps.json`의 `apps`에 한 묶음을 추가하거나 수정합니다.

```json
{
  "id": "dawon",
  "name": "다원",
  "floor": "life",
  "status": "open",
  "color": "#6B4FA0",
  "teaser": "박스 앞면에 들어갈 한 줄 소개",
  "summary": "룰북에 들어갈 자세한 소개",
  "audience": "누가 쓰나요 (예: 초등 3~6학년)",
  "time": "사용 시간 (예: 10분)",
  "difficulty": 2,
  "tech": ["React", "Node.js"],
  "url": "https://앱-주소",
  "screenshots": [{ "src": "assets/img/apps/dawon-1.png", "alt": "첫 화면" }],
  "released": "2026-12-01"
}
```

- `floor`: `class`(1층 수업용) · `work`(2층 업무용) · `life`(3층 생활·게임)
- `status`: `sealed`(개봉 예정) → `brewing`(개발 중) → `open`(개봉 완료)
- 층을 늘리려면 `floors`에 항목을 추가합니다.
- 룰북에 버튼을 더 달려면 `"links": [{ "label": "사용 설명서", "url": "https://..." }]`를 추가합니다.

## 플레이 로그 쓰는 방법

`data/log.json`의 `entries`에 기록을 추가합니다. 날짜순으로 자동 정렬됩니다.

```json
{ "date": "2026-12-01", "type": "release", "title": "다원 개봉!", "body": "성향 분석 서비스 다원을 공개했어요.", "app": "dawon" }
```

- `type`: `release`(신작 개봉) · `update`(업데이트) · `notice`(카페 소식) · `adopted`(제안 채택)
- `app`에 앱 id를 넣으면 룰북 바로가기 링크가 붙습니다.

## 확장팩 제안함 연결 (4단계)

`assets/js/config.js`에 구글 폼의 `formResponse` 주소와 질문별 `entry.번호`를 넣으면, 제안서가 구글 폼에 연결된 시트로 저장됩니다. 값이 비어 있으면 제안함은 "개점 준비 중"으로 표시됩니다.

채택된 제안을 보여 주려면 시트에 '채택' 탭을 만들고 첫 줄을 `제목 | 내용 | 대상 | 상태`로 둔 뒤, 그 탭만 **파일 → 공유 → 웹에 게시 → CSV**로 게시해 주소를 `adoptedCsvUrl`에 넣습니다.

## 내 컴퓨터에서 미리 보기

`apps.json`을 불러오기 때문에 파일을 더블클릭하면 선반이 보이지 않습니다. 폴더에서 아래 명령을 실행한 뒤 `http://localhost:8000`을 여세요.

```bash
python -m http.server 8000
```

## 공개 (GitHub Pages)

저장소 **Settings → Pages → Build and deployment**에서 Source를 `Deploy from a branch`, Branch를 `main` / `/ (root)`로 저장하면
`https://mary-park.github.io/mirim-education-cafe/`에 공개됩니다.
