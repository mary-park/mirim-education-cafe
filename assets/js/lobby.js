// 로비: 층별 선반과 개봉 현황
renderHeader("lobby");
renderFooter();

(async () => {
  const shelf = document.getElementById("shelf");
  const counter = document.getElementById("counter");
  try {
    const { floors, apps } = await loadCafeData();

    const count = (s) => apps.filter((a) => a.status === s).length;
    counter.innerHTML = `
      <div><b>${count("open")}</b><span>개봉 완료</span></div>
      <div><b>${count("brewing")}</b><span>개발 중</span></div>
      <div><b>${count("sealed")}</b><span>개봉 예정</span></div>`;

    shelf.innerHTML = floors
      .sort((a, b) => a.floor - b.floor)
      .map((floor, i) => {
        const items = apps.filter((a) => a.floor === floor.id);
        const boxes = items.map((a, j) => boxHtml(a, j + i)).join("");
        const empty = items.length === 0 ? '<span class="empty-note">곧 채워질 자리예요</span>' : "";
        return `
          <div class="floor">
            <div class="floor-label"><b>${floor.floor}층</b> ${escapeHtml(floor.name)}</div>
            <div class="floor-items">${boxes}${empty}${propsHtml(i)}</div>
            <div class="plank"></div>
          </div>`;
      })
      .join("");
  } catch (e) {
    showError(shelf, "선반을 불러오지 못했어요. 잠시 후 다시 들러 주세요.");
    console.error(e);
  }
})();
