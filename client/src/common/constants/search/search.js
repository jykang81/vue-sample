const SEARCH_CONST = {
  MEDIA_TYPE: {
    IS_TV_SHOPPING: { class: 'tv', viewNm: 'TV쇼핑' },
    IS_TV_SHOPPLUS: { class: 'tv', viewNm: 'TV쇼핑' },
    IS_SHOPPING_BOOK: { class: 'flag_bookshop', viewNm: '쇼핑북' },
    IS_HAPPYDEAL: { class: 'happydeal', viewNm: '해피딜' },
    IS_DEPARTMENT: { class: 'flag_department', viewNm: '백화점' }
  },
  BENEFIT_LABEL: {
    hasLspYn: '일시불',
    hasFreeDeliverYn: '무료배송',
    hasInterestFreeYn: '무이자',
    hasSaveYn: '적립금'
  },
  STORE_TYPE_LABEL: {
    channelTvShoppingCnt: 'TV쇼핑',
    channelTvShopPlusCnt: 'Shop+',
    channelDepartmentCnt: '백화점몰',
    channelSbCnt: '쇼핑북',
    channelHappyDealCnt: '해피딜'
  },
  MATCH_TO_BENEFIT_STATEDATA: {
    hasFreeDeliverYn: 'freeDeliverYn',
    hasInterestFreeYn: 'interestFreeYn',
    hasSaveYn: 'saveYn'
  },
  /**
   * AS IS 에서는 TV쇼핑과 샵플러스를 합산하고 TV쇼핑 필터만 보여줬지만,
   * TO BE 에서는 TV쇼핑과 샵플러스가 분리되고 필터를 각각 보여준다.
   * --> 기획 변경: 다시 AS-IS 대로 TV쇼핑과 샵플러스를 합산하고 TV쇼핑 필터만 보여줌.
   */
  MATCH_TO_FILTER_TYPE: {
    channelTvShoppingCnt: '1,3',
    channelHappyDealCnt: '2',
    // channelTvShopPlusCnt: '3',
    channelDepartmentCnt: '4',
    channelSbCnt: '5'
  },
  SORT_LABEL_LIST: {
    weight: 'NS추천',
    best: '판매량순',
    lowPrice: '낮은가격순',
    topPrice: '높은가격순',
    comment: '상품평순',
    eval: '별점순'
  }
}

export default SEARCH_CONST
