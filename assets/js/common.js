// 에듀케이션 카페 공통 스크립트: 머리말·꼬리말, 데이터 불러오기, 아이콘, 박스 그리기

const NAV = [
  { href: "index.html", label: "로비", key: "lobby" },
  { href: "collection.html", label: "컬렉션", key: "collection" },
  { href: "log.html", label: "플레이 로그", key: "log" },
  { href: "suggest.html", label: "확장팩 제안함", key: "suggest" }
];

const STATUS_LABEL = { open: "개봉 완료", brewing: "개발 중", sealed: "개봉 예정" };

// 선이 있는 단순한 SVG 아이콘 (장식용)
const ICONS = {
  clock:
    '<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="17"/><path d="M24 14v10l7 5"/></svg>',
  tools:
    '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="9" y="14" width="30" height="24" rx="4"/><path d="M18 14v-4h12v4M9 24h30"/></svg>',
  calendar:
    '<svg viewBox="0 0 48 48" aria-hidden="true"><rect x="9" y="11" width="30" height="28" rx="4"/><path d="M9 20h30M17 7v8M31 7v8"/></svg>',
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
      <div class="sign-wrap">
        <a class="sign" href="index.html">
          <span class="sign-icon">${ICONS.coffee}</span>
          <span class="sign-text">${window.CAFE_CONFIG.siteName}</span>
        </a>
        <span class="sign-tagline">OPEN · 교실과 일상을 위한 웹앱</span>
      </div>
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

async function loadJson(path) {
  const res = await fetch(path, { cache: "no-cache" });
  if (!res.ok) throw new Error(`${path}을(를) 불러오지 못했어요`);
  return res.json();
}

const loadCafeData = () => loadJson("data/apps.json");
const loadLog = () => loadJson("data/log.json");

const LOG_TYPE = { release: "신작 개봉", update: "업데이트", notice: "카페 소식", adopted: "제안 채택" };

// 2026-11-27 → 2026. 11. 27.
function formatDate(iso) {
  const [y, m, d] = String(iso || "").split("-");
  return y && m && d ? `${y}. ${Number(m)}. ${Number(d)}.` : escapeHtml(iso);
}

// 따옴표·쉼표·줄바꿈을 처리하는 간단한 CSV 해석기 → [{열이름: 값}]
function parseCsv(text) {
  const rows = [];
  let row = [], cell = "", quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
      else if (c === '"') quoted = false;
      else cell += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") { row.push(cell); cell = ""; }
    else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(cell); rows.push(row); row = []; cell = "";
    } else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [head, ...body] = rows.filter((r) => r.some((v) => v.trim()));
  if (!head) return [];
  const keys = head.map((h) => h.trim());
  return body.map((r) => Object.fromEntries(keys.map((k, i) => [k, (r[i] || "").trim()])));
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

// 개봉 후 30일 안이면 NEW
function isNew(app) {
  if (app.status !== "open" || !app.released) return false;
  const days = (Date.now() - new Date(app.released + "T00:00:00").getTime()) / 86400000;
  return days >= 0 && days <= 30;
}

// 선반 위 보드게임 박스 한 개
function boxHtml(app, index) {
  const heights = [164, 150, 172, 156, 144];
  const h = heights[index % heights.length];
  const status = app.status || "sealed";
  const tag = (isNew(app) ? "NEW · " : "") + (STATUS_LABEL[status] || "");
  return `
    <a class="box box--${status}${app.cover ? " has-cover" : ""}" href="rulebook.html?id=${encodeURIComponent(app.id)}"
       style="--box-color:${escapeHtml(app.color || "#B5432A")}; --box-accent:${escapeHtml(app.accent || "#F2B33D")}; --box-h:${h}px">
      ${app.cover ? `<img class="box-art" src="${escapeHtml(app.cover)}" alt="" loading="lazy">` : ""}
      <span class="box-tag">${tag}</span>
      <span class="box-name">${escapeHtml(app.name)}</span>
      ${status === "sealed" ? '<span class="box-sticker">COMING SOON</span>' : `<span class="box-teaser">${escapeHtml(app.boxLine || app.teaser)}</span>`}
    </a>`;
}

// 아직 박스가 들어오지 않은 자리
function slotHtml(index) {
  const heights = [140, 128, 148];
  return `<span class="slot" style="height:${heights[index % heights.length]}px">곧 입고</span>`;
}

// 비어 있는 자리를 채우는 소품
function propsHtml(seed) {
  const sets = [
    ["coffee", "dice"],
    ["plant", "meeple"],
    ["dice", "coffee", "meeple"]
  ];
  const items = sets[seed % sets.length]
    .map((k) => `<img class="prop prop--${k}" src="assets/img/cafe/prop-${k}.webp" alt="" loading="lazy">`)
    .join("");
  return `<span class="props" aria-hidden="true">${items}</span>`;
}

// 플레이 로그 항목 (로비의 최근 소식과 플레이 로그 페이지에서 함께 사용)
function logItemHtml(entry, appsById) {
  const app = entry.app ? appsById[entry.app] : null;
  const link = app ? ` <a href="rulebook.html?id=${encodeURIComponent(app.id)}">${escapeHtml(app.name)} 룰북 보기</a>` : "";
  return `
    <li class="log-item log-item--${escapeHtml(entry.type || "notice")}">
      <div class="log-meta">
        <time datetime="${escapeHtml(entry.date)}">${formatDate(entry.date)}</time>
        <span class="log-type">${LOG_TYPE[entry.type] || "카페 소식"}</span>
      </div>
      <h3>${escapeHtml(entry.title)}</h3>
      ${entry.body ? `<p>${escapeHtml(entry.body)}${link}</p>` : link ? `<p>${link}</p>` : ""}
    </li>`;
}

async function renderLog(target, limit) {
  try {
    const [{ entries }, { apps }] = await Promise.all([loadLog(), loadCafeData()]);
    const appsById = Object.fromEntries(apps.map((a) => [a.id, a]));
    const sorted = [...entries].sort((a, b) => String(b.date).localeCompare(String(a.date)));
    const list = limit ? sorted.slice(0, limit) : sorted;
    target.innerHTML = list.length
      ? list.map((e) => logItemHtml(e, appsById)).join("")
      : '<li class="notice">아직 기록이 없어요.</li>';
  } catch (e) {
    target.innerHTML = '<li class="notice">기록을 불러오지 못했어요.</li>';
    console.error(e);
  }
}

function showError(target, message) {
  target.innerHTML = `<p class="notice">${escapeHtml(message)}</p>`;
}
