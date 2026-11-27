// 로비: 칠판 메뉴판, 층별 원목 선반, 최근 소식
renderHeader("lobby");
renderFooter();
renderLog(document.getElementById("news"), 2);

(async () => {
  const shelf = document.getElementById("shelf");
  const menu = document.getElementById("menu");
  try {
    const { floors, apps } = await loadCafeData();

    // 칠판 메뉴판: 가장 최근에 개봉한 앱 + 상태별 개수
    const count = (s) => apps.filter((a) => a.status === s).length;
    const latest = apps
      .filter((a) => a.status === "open")
      .sort((a, b) => String(b.released).localeCompare(String(a.released)))[0];
    menu.innerHTML = `
      <div class="chalk-row"><span>신작 개봉</span>${
        latest ? `<a href="rulebook.html?id=${encodeURIComponent(latest.id)}">${escapeHtml(latest.name)}</a>` : "<b>준비 중</b>"
      }</div>
      <div class="chalk-row"><span>개봉 완료</span><b>${count("open")}</b></div>
      <div class="chalk-row"><span>개발 중</span><b>${count("brewing")}</b></div>
      <div class="chalk-row"><span>개봉 예정</span><b>${count("sealed")}</b></div>
      <div class="chalk-row"><span>확장팩 제안</span><a href="suggest.html">언제나 환영</a></div>`;

    // 층마다 박스 + '곧 입고' 자리 하나 + 소품
    shelf.innerHTML = floors
      .sort((a, b) => a.floor - b.floor)
      .map((floor, i) => {
        const items = apps.filter((a) => a.floor === floor.id);
        const boxes = items.map((a, j) => boxHtml(a, j + i)).join("");
        return `
          <div class="floor">
            <div class="floor-label"><b>${floor.floor}층</b> ${escapeHtml(floor.name)}</div>
            <div class="floor-items">${boxes}${slotHtml(i)}${propsHtml(i)}</div>
            <div class="plank"></div>
          </div>`;
      })
      .join("");
  } catch (e) {
    showError(shelf, "선반을 불러오지 못했어요. 잠시 후 다시 들러 주세요.");
    console.error(e);
  }
})();
