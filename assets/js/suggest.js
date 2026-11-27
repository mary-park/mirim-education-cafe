// 확장팩 제안함: 구글 폼(formResponse)으로 전송
renderHeader("suggest");
renderFooter();

(() => {
  const form = document.getElementById("proposal-form");
  const status = document.getElementById("form-status");
  const btn = document.getElementById("submit-btn");
  const cfg = window.CAFE_CONFIG.googleForm;
  const ready = Boolean(cfg.action && cfg.fields.title && cfg.fields.problem);
  const LAST_KEY = "cafe-last-proposal";

  if (!ready) {
    status.textContent = "제안함은 개점 준비 중이에요. 곧 문을 열게요!";
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const title = (data.get("title") || "").trim();
    const problem = (data.get("problem") || "").trim();

    if (data.get("website")) return; // 스팸 방지용 숨은 칸
    if (!ready) {
      status.textContent = "제안함은 개점 준비 중이에요. 곧 문을 열게요!";
      return;
    }
    if (title.length < 2 || problem.length < 10) {
      status.textContent = "제목(2자 이상)과 불편한 점(10자 이상)을 적어 주세요.";
      return;
    }
    try {
      const last = Number(localStorage.getItem(LAST_KEY) || 0);
      if (Date.now() - last < 60 * 1000) {
        status.textContent = "제안서가 방금 도착했어요. 1분 뒤에 다시 보내 주세요.";
        return;
      }
    } catch (_) { /* 저장소를 못 쓰는 환경이면 건너뜀 */ }

    const body = new URLSearchParams();
    body.append(cfg.fields.title, title);
    body.append(cfg.fields.problem, problem);
    if (cfg.fields.audience && data.get("audience")) body.append(cfg.fields.audience, data.get("audience"));
    if (cfg.fields.nickname && data.get("nickname")) body.append(cfg.fields.nickname, data.get("nickname").trim());

    btn.disabled = true;
    status.textContent = "제안서를 보내는 중이에요…";
    try {
      // 구글 폼은 응답 내용을 돌려주지 않으므로(no-cors) 요청이 나가면 성공으로 봅니다.
      await fetch(cfg.action, { method: "POST", mode: "no-cors", body });
      try { localStorage.setItem(LAST_KEY, String(Date.now())); } catch (_) {}
      form.reset();
      status.textContent = "제안서가 카페에 도착했어요. 고맙습니다!";
    } catch (err) {
      status.textContent = "전송하지 못했어요. 인터넷 연결을 확인하고 다시 시도해 주세요.";
      console.error(err);
    } finally {
      btn.disabled = false;
    }
  });
})();
