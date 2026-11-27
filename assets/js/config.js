// 에듀케이션 카페 설정 파일
// 4단계(확장팩 제안함)에서 구글 폼을 만든 뒤 아래 값을 채우면 제안서가 구글 시트로 저장됩니다.
window.CAFE_CONFIG = {
  siteName: "에듀케이션 카페",

  googleForm: {
    // 예: "https://docs.google.com/forms/d/e/XXXXXXXX/formResponse"
    action: "",
    // 구글 폼 각 질문의 entry 번호 (예: "entry.123456789")
    fields: {
      title: "",
      problem: "",
      audience: "",
      nickname: ""
    }
  },

  // 채택된 제안만 모아 둔 시트 탭을 '웹에 게시(CSV)'한 주소 (선택)
  adoptedCsvUrl: ""
};
