// 에듀케이션 카페 공통 스크립트: 머리말·꼬리말, 데이터 불러오기, 아이콘, 박스 그리기

const NAV = [
  { href: "index.html", label: "로비", key: "lobby" },
  { href: "collection.html", label: "컬렉션", key: "collection" },
  { href: "suggest.html", label: "확장팩 제안함", key: "suggest" }
];

const STATUS_LABEL = { open: "개봉 완료", brewing: "개발 중", sealed: "개봉 예정" };

// 선이 있는 단순한 SVG 아이콘 (장식용)
const ICONS = {
  coffee:
    '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M10 18h24v12a10 10 0 0 1-10 10h-4a10 10 0 0 1-10-10z"/><path d="M34 21h3a5 5 0 0 1 0 10h-3"/><path d="M17 8c0 3 3 3 3 6M24 8c0 3 3 3 3 6"/></svg>',
  dice:
    '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="8" y="8" width="32" height="32" rx="7"/><circle cx="17" cy="17" r="2.5" class="fill"/><circle cx="31" cy="17" r="2.5" class="fill"/><circle cx="24" cy="24" r="2.5" class="fill"/><circle cx="17" cy="31" r="2.5" class="fill"/><circle cx="31" cy="31" r="2.5" class="fill"/></svg>',
  meeple:
    '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M24 7a6 6 0 0 1 6 6c0 2-1 3.5-2 4.5 5 1 12 3 12 7 0 2-3 2.5-6 2.5l5 12H29l-5-8-5 8H9l5-12c-3 0-6-.5-6-2.5 0-4 7-6 12-7-1-1-2-2.5-2-4.5a6 6 0 0 1 6-6z"/></svg>',
  plant:
    '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M14 30h20l-3 12H17z"/><path d="M24 30V18"/><path d="M24 22c-6 0-9-4-9-9 5 0 9 3 9 9z"/><path d="M24 19c0-6 3-9 9-9 0 5-3 9-9 9z"/></svg>'
};

function renderHeader(activeKey) {
  const el = document.getElementById("site-header");
  if (!el) return;
  const links = NAV.map(
    (n) =>
      `<a href="${n.href}" ${n.key === activeKey ? 'aria-current="page"' : ""}>${n.label}</a>`
  ).join("");
  el.innerHTML = `
    <div class="header-inner">
      <a class="sign" href="index.html">
        <span class="sign-icon">${ICONS.coffee}</span>
        <span class="sign-text">${window.CAFE_CONFIG.siteName}</span>
      </a>
      <nav aria-label="주요 메뉴">${links}</nav>
    </div>`;
}

function renderFooter() {
  const el = document.getElementById("site-footer");
  if (!el) return;
  el.innerHTML = `
    <div class="footer-inner">
      <span>${window.CAFE_CONFIG.siteName} · 교실과 일상을 위한 웹앱 보드게임 카페</span>
      <span class="footer-icons">${ICONS.dice}${ICONS.meeple}${ICONS.coffee}</span>
    </div>`;
}

async function loadCafeData() {
  const res = await fetch("data/apps.json", { cache: "no-cache" });
  if (!res.ok) throw new Error("apps.json을 불러오지 못했어요");
  return res.json();
}

function escapeHtml(text) {
  return String(text ?? "").replace(/[&<>"']/g, (c) =>
    ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c])
  );
}

function difficultyDots(n) {
  const v = Math.max(0, Math.min(5, Number(n) || 0));
  return "●".repeat(v) + "○".repeat(5 - v);
}

// 선반 위 박스 한 개
function boxHtml(app, index) {
  const heights = [168, 150, 176, 158, 140];
  const h = heights[index % heights.length];
  const status = app.status || "sealed";
  return `
    <a class="box box--${status}" href="rulebook.html?id=${encodeURIComponent(app.id)}"
       style="--box-color:${escapeHtml(app.color || "#B5432A")}; --box-h:${h}px">
      <span class="box-tag">${STATUS_LABEL[status] || ""}</span>
      <span class="box-name">${escapeHtml(app.name)}</span>
      ${status === "sealed" ? '<span class="box-sticker">COMING SOON</span>' : ""}
    </a>`;
}

// 비어 있는 자리를 채우는 소품
function propsHtml(seed) {
  const sets = [
    ["coffee", "dice"],
    ["plant", "meeple"],
    ["dice", "coffee", "meeple"]
  ];
  return sets[seed % sets.length]
    .map((k) => `<span class="prop prop--${k}">${ICONS[k]}</span>`)
    .join("");
}

function showError(target, message) {
  target.innerHTML = `<p class="notice">${escapeHtml(message)}</p>`;
}
