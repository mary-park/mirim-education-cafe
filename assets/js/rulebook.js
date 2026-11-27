// 룰북: 앱 상세 (주소 예: rulebook.html?id=dawon)
renderHeader("");
renderFooter();

(async () => {
  const el = document.getElementById("rulebook");
  const id = new URLSearchParams(location.search).get("id");
  try {
    const { floors, apps } = await loadCafeData();
    const app = apps.find((a) => a.id === id);
    if (!app) {
      showError(el, "찾는 박스가 선반에 없어요. 선반으로 돌아가 다른 박스를 골라 주세요.");
      return;
    }
    const floor = floors.find((f) => f.id === app.floor);
    const floorText = floor ? `${floor.floor}층 ${floor.name}` : "";
    document.title = `${app.name} 룰북 · ${window.CAFE_CONFIG.siteName}`;
    el.style.setProperty("--box-color", app.color || "#B5432A");
    el.style.setProperty("--box-accent", app.accent || "#F2B33D");

    const cover = `
      <header class="rulebook-cover ${app.status !== "open" ? "is-sealed" : ""}">
        <div class="eyebrow">${escapeHtml(floorText)} · ${STATUS_LABEL[app.status] || ""}</div>
        <h1>${escapeHtml(app.name)}</h1>
        <p>${escapeHtml(app.teaser)}</p>
      </header>`;

    if (app.status !== "open") {
      el.innerHTML = `${cover}
        <div class="rulebook-body">
          <div class="sealed-panel">
            <span class="prop">${ICONS.coffee}</span>
            <h2>${app.status === "brewing" ? "지금 열심히 만드는 중이에요" : "아직 포장을 뜯는 중이에요"}</h2>
            <p>${app.status === "brewing" ? "개발이 끝나면 이 자리에서 바로 플레이할 수 있어요." : "이 박스는 곧 개봉됩니다. 커피 한 잔 하며 조금만 기다려 주세요."}</p>
            <a class="btn btn--ghost" href="index.html">다른 박스 둘러보기</a>
          </div>
        </div>`;
      return;
    }

    const specs = [
      ["meeple", "누가 쓰나요", app.audience],
      ["clock", "사용 시간", app.time],
      ["dice", "난이도", app.difficulty ? difficultyDots(app.difficulty) : ""],
      ["tools", "구성물(사용 기술)", (app.tech || []).join(", ")],
      ["calendar", "개봉일", app.released ? formatDate(app.released) : ""]
    ].filter(([, , v]) => v);

    const shots = (app.screenshots || [])
      .map((s) => `<a href="${escapeHtml(s.src)}" target="_blank" rel="noopener"><img src="${escapeHtml(s.src)}" alt="${escapeHtml(s.alt || app.name + " 화면")}" loading="lazy"></a>`)
      .join("");

    el.innerHTML = `${cover}
      <div class="rulebook-body">
        ${app.summary ? `<section><h2>어떤 앱인가요?</h2><p>${escapeHtml(app.summary)}</p></section>` : ""}
        <div class="rulebook-actions">
          ${app.url ? `<a class="btn btn--primary" href="${escapeHtml(app.url)}" target="_blank" rel="noopener">플레이하기</a>` : ""}
          ${(app.links || []).map((l) => `<a class="btn btn--ghost" href="${escapeHtml(l.url)}" target="_blank" rel="noopener">${escapeHtml(l.label)}</a>`).join("")}
        </div>
        ${specs.length ? `<div class="box-back"><div class="box-back-title">박스 뒷면 정보</div><dl class="spec-grid">${specs.map(([icon, k, v]) => `<div class="spec"><span class="spec-icon">${ICONS[icon]}</span><div><dt>${k}</dt><dd>${escapeHtml(v)}</dd></div></div>`).join("")}</dl></div>` : ""}
        ${shots ? `<section><h2>앱 화면</h2><div class="shots">${shots}</div></section>` : ""}
      </div>`;
  } catch (e) {
    showError(el, "룰북을 불러오지 못했어요.");
    console.error(e);
  }
})();
