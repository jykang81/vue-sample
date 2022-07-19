const REVIEW_CONST = {
  REVIEW_CMD_TYPE: { // 상품평 API(NSAjaxProductReview) 구분자
    CHECK_WRITABLE: '100', // 상품평 작성 가능 여부 체크
    CHECK_REPORTABLE: '112', // 상품평 신고 가능 여부 체크
    SET_USEFUL: '108', // 상품평 평가
    SET_REPORT: '111', // 상품평 신고
    GET_SUMMARY: '125', // 상품평 요약정보 조회
    GET_GENERAL: '116', // 일반상품평 조회
    GET_FOOD_AND_MEDICINE: '102', // 식품/의약품 상품평 조회
    GET_PHOTO_LIST: '131' // 등록한 이미지 목록 조회
  }

}

export default REVIEW_CONST
