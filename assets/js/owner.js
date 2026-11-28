// 카페 사장님: data/owner.json의 소개를 보여 줌
renderHeader("owner");
renderFooter();

const OWNER_ICONS = {
  school:
    '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 40V20l16-10 16 10v20"/><path d="M19 40V29h10v11"/><path d="M4 40h40"/></svg>',
  cap:
    '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M4 18l20-9 20 9-20 9z"/><path d="M12 22v9c0 3 5 6 12 6s12-3 12-6v-9"/><path d="M44 18v10"/></svg>',
  book:
    '<svg viewBox="0 0 48 48" aria-hidden="true"><path d="M8 10h12a4 4 0 0 1 4 4v26a3 3 0 0 0-3-3H8z"/><path d="M40 10H28a4 4 0 0 0-4 4v26a3 3 0 0 1 3-3h13z"/></svg>'
};

(async () => {
  const el = document.getElementById("owner");
  try {
    const [owner, { apps }] = await Promise.all([loadJson("data/owner.json"), loadCafeData()]);
    const opened = apps.filter((a) => a.status === "open").length;
    const waiting = apps.length - opened;

    el.innerHTML = `
      <section class="owner-hero">
        <div class="owner-portrait">
          <img src="${escapeHtml(owner.photo)}" alt="카페 사장님 캐릭터 그림: 긴 머리 선생님이 커피와 노트북을 들고 웃고 있어요">
        </div>
        <div class="owner-intro">
          <div class="eyebrow">CAFE OWNER</div>
          <h1>${escapeHtml(owner.title)}</h1>
          <p class="owner-role">${escapeHtml(owner.role)}</p>
          <p class="speech">${escapeHtml(owner.greeting)}</p>
          <div class="owner-stats">
            <div><b>${opened}</b><span>개봉한 박스</span></div>
            <div><b>${waiting}</b><span>준비 중인 박스</span></div>
          </div>
        </div>
      </section>

      <div class="owner-grid">
        <section class="player-card" aria-labelledby="profile-title">
          <h2 id="profile-title">플레이어 카드</h2>
          <dl>
            ${owner.profile
              .map(
                (p) => `
              <div class="player-row">
                <span class="spec-icon">${OWNER_ICONS[p.icon] || ICONS.meeple}</span>
                <div><dt>${escapeHtml(p.label)}</dt><dd>${escapeHtml(p.value)}</dd></div>
              </div>`
              )
              .join("")}
          </dl>
        </section>

        <section class="owner-side">
          <div class="likes" aria-labelledby="likes-title">
            <h2 id="likes-title">좋아하는 것</h2>
            <ul>${owner.likes.map((l) => `<li>${escapeHtml(l)}</li>`).join("")}</ul>
          </div>
          <div class="story-note" aria-labelledby="story-title">
            <h2 id="story-title">카페를 연 이유</h2>
            <p>${escapeHtml(owner.story)}</p>
          </div>
        </section>
      </div>

      <div class="owner-actions">
        <a class="btn btn--primary" href="collection.html">사장님이 만든 박스 보기</a>
        <a class="btn btn--ghost" href="suggest.html">사장님께 확장팩 제안하기</a>
        ${owner.workshop && owner.workshop.startsWith("https://") ? `<a class="workshop-link" href="${escapeHtml(owner.workshop)}" target="_blank" rel="noopener">카페 사장 작업실 <span>사장님 전용</span></a>` : ""}
      </div>`;
  } catch (e) {
    showError(el, "사장님 소개를 불러오지 못했어요.");
    console.error(e);
  }
})();
