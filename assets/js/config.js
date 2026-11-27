// 에듀케이션 카페 설정 파일
// 4단계(확장팩 제안함)에서 구글 폼을 만든 뒤 아래 값을 채우면 제안서가 구글 시트로 저장됩니다.
window.CAFE_CONFIG = {
  siteName: "에듀케이션 카페",

  googleForm: {
    // 예: "https://docs.google.com/forms/d/e/XXXXXXXX/formResponse"
    action: "https://docs.google.com/forms/d/e/1FAIpQLSfV5sT6qpGF5bs2UOElGqbzuSWiF77ZxFdxfdkDm6YKj2frjg/formResponse",
    // 구글 폼 각 질문의 entry 번호 (예: "entry.123456789")
    fields: {
      title: "entry.971979800",
      problem: "entry.1989186631",
      audience: "entry.363739108",
      nickname: "entry.372314982"
    }
  },

  // 채택된 제안만 모아 둔 시트 탭을 '웹에 게시(CSV)'한 주소 (선택)
  adoptedCsvUrl: "https://docs.google.com/spreadsheets/d/e/2PACX-1vR_-zmbpVbqZAPXtmoJWLrnJjI5sA7_xs9a94w1NzMNuAM_YwO9V7zXgafaJ4KYn7FhKFECN6ZQQRL9/pub?gid=1314574463&single=true&output=csv"
};
