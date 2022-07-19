const STORE_CONST = {
  LNB_CATEGORY_CONST: {
    SORT_OBJ: {
      best: '인기순',
      new: '최신순',
      lowPrice: '낮은가격순',
      topPrice: '높은가격순',
      comment: '상품평순',
      hits: '최다조회',
      eval: '고객만족',
      weight: 'NS추천'
    },
    SORT_PARAMETERS: {
      BEST: 'best',
      NEW: 'new',
      LOW_PRICE: 'lowPrice',
      TOP_PRICE: 'topPrice',
      COMMENT: 'comment',
      HITS: 'hits',
      EVAL: 'eval',
      WEIGHT: 'weight'
    },
    SORT_LOWER_PARAMETERS: {
      best: 'best',
      new: 'new',
      lowPrice: 'lowPrice',
      topPrice: 'topPrice',
      comment: 'comment',
      hits: 'hits',
      eval: 'eval',
      weight: 'weight'
    },
    COUPON_TYPE: {
      10: '할인',
      20: '더할인',
      30: '알뜰'
    }
  },
  COMMON_STORE_TYPE: {
    isDepartment: '백화점',
    isTvShopping: 'TV쇼핑',
    isTvShopPlus: 'TV쇼핑',
    isHappyDeal: '해피딜',
    isShoppingBook: '쇼핑북'
  },
  COMMON_STORE_TYPE_CLASS: {
    isDepartment: 'department',
    isTvShopping: 'tv',
    isTvShopPlus: 'tv',
    isHappyDeal: 'happydeal',
    isShoppingBook: 'shopping_book'
  },
  BRIDGE_CONST: {
    PARAMETERS: {
      tv: {
        COMMAND_NAME: 'NSTvBroadCmd',
        SELECT_DAY: 'ONAIRPRENEXT',
        PROCESS_FLAG: 'brodcastingMobileScroll'
      },
      shopPlus: {
        COMMAND_NAME: 'NSShopPlusBroadCmd',
        SELECT_DAY: 'ONAIRPRENEXT',
        PROCESS_FLAG: 'shopPlusBrodcastingMobileScroll'
      }
    },
    PRE_BROAD_KOR: '이전 방송',
    NEXT_BROAD_KOR: '다음 방송'
  }
}

export default STORE_CONST
