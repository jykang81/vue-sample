const COMMON_CONST = {
  KAKAO: {
    APP_KEY: {
      JAVASCRIPT: process.env.VUE_APP_KAKAO_APP_KEY_JAVASCRIPT
    }
  },
  // 쇼핑 히스토리 구분
  HISTORY_GUBUN: {
    PRODUCT: 'P', // 상품
    CATEGORY: 'C', // 카테고리
    EXHIBITION: 'F', // 기획전
    EVENT: 'E' // 이벤트
  }
}
export default COMMON_CONST
