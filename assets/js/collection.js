// 컬렉션: 층별 필터가 있는 카드 목록
renderHeader("collection");
renderFooter();

(async () => {
  const filtersEl = document.getElementById("filters");
  const cardsEl = document.getElementById("cards");
  try {
    const { floors, apps } = await loadCafeData();
    const floorName = Object.fromEntries(floors.map((f) => [f.id, `${f.floor}층 ${f.name}`]));
    const options = [{ id: "all", label: "전체" }, ...floors.map((f) => ({ id: f.id, label: floorName[f.id] }))];
    let current = "all";

    const draw = () => {
      filtersEl.innerHTML = options
        .map((o) => `<button type="button" data-id="${o.id}" aria-pressed="${o.id === current}">${escapeHtml(o.label)}</button>`)
        .join("");
      const list = apps.filter((a) => current === "all" || a.floor === current);
      cardsEl.innerHTML = list.length
        ? list
            .map(
              (a) => `
          <a class="card card--${escapeHtml(a.status)}" href="rulebook.html?id=${encodeURIComponent(a.id)}" style="--box-color:${escapeHtml(a.color || "#B5432A")}; --box-accent:${escapeHtml(a.accent || "#F2B33D")}">
            <span class="card-band"></span>
            <div class="card-body">
              <span class="card-tag">${(isNew(a) ? "NEW · " : "") + (STATUS_LABEL[a.status] || "")}</span>
              <h2>${escapeHtml(a.name)}</h2>
              <p>${escapeHtml(a.teaser)}</p>
            </div>
            <div class="card-foot"><span>${escapeHtml(floorName[a.floor] || "")}</span><span>룰북 보기 →</span></div>
          </a>`
            )
            .join("") + '<div class="card-slot">곧 입고</div>'
        : '<p class="notice">이 층은 아직 비어 있어요. 곧 새 박스가 들어올 거예요.</p>';
    };

    filtersEl.addEventListener("click", (e) => {
      const btn = e.target.closest("button[data-id]");
      if (!btn) return;
      current = btn.dataset.id;
      draw();
    });
    draw();
  } catch (e) {
    showError(cardsEl, "컬렉션을 불러오지 못했어요.");
    console.error(e);
  }
})();
