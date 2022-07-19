import { PRODUCT_CONST } from '@constants/product/product'
import {
  insertCommas,
  arraySum,
  isNull
} from '@utils/commonutil/commonUtil'

export default {
  namespaced: true,

  state: { // 장바구니 상품 조회 결과 원본
    cartData: {
      goods: [],
      common: {},
      member: {}
    },
    totalProductList: [], // 장바구니 전체 상품 목록
    productListByType: { // 일반/상품권 상품 타입별 상품 목록
      GENERAL: [],
      CARD: []
    },
    checkedItemIdsByType: { // 체크된 상품 아이템ID
      GENERAL: [],
      CARD: []
    },
    totalPaymentPrice: { // 총 결제 예상 금액
      GENERAL: 0,
      CARD: 0
    },
    cartIconCount: 0 // 우상단 장바구니 아이콘 상품 개수
  },

  getters: {
    /**
     * 장바구니에 담은 상품 개수 70개 초과 여부
     *
     * @param {*} state (필수) 상태
     */
    isTotalCountOver70: state => {
      return state.cartData.common ? state.cartData.common.goodsCnt > 70 : false
    },
    /**
     * 장바구니 전체 상품 개수
     *
     * @param {*} state (필수) 상태
     */
    totalCount: state => {
      return isNull(state.totalProductList) ? 0 : state.totalProductList.length
    },
    /**
     * 주문번호
     *
     * @param {*} state (필수) 상태
     */
    orderId: state => {
      return state.cartData.member ? state.cartData.member.orderId : -1
    },
    /**
     * 제휴사명
     *
     * @param {*} state (필수) 상태
     */
    coNm: state => {
      return state.cartData.common ? state.cartData.common.coNm : ''
    },
    /**
     * 총 합계 금액
     *
     * @param {*} state (필수) 상태
     */
    totalPaymentPrice: state => {
      return insertCommas(arraySum(Object.values(state.totalPaymentPrice)))
    }
  },

  mutations: {
    /**
     * 상품 조회 결과 저장
     *
     * @param {*} state (필수) 상태
     * @param {object} payload (필수) 상품 조회 결과
     */
    setCartData (state, payload) {
      state.cartData = payload // 장바구니 상품 조회 결과 원본

      let totalProductList = []
      totalProductList = state.cartData.goods

      // 장바구니 전체 상품 목록 저장
      state.totalProductList = totalProductList

      if (!isNull(totalProductList)) {
        // 일반 상품 타입별 상품 목록 저장
        state.productListByType.GENERAL = totalProductList.filter(product => !PRODUCT_CONST.GOODS_DISP_TYPE_CD.NON_GENERAL_PRODUCT_TYPES.includes(product.goodsType))

        // 상품권 상품 타입별 상품 목록 저장
        state.productListByType.CARD = totalProductList.filter(product => PRODUCT_CONST.GOODS_DISP_TYPE_CD.CARD_PRODUCT_TYPES.includes(product.goodsType))
      }
    },
    /**
     * 일반/상품권 상품 타입별 상품 중 체크된 상품 아이템ID 저장
     *
     * @param {*} state (필수) 상태
     * @param {object} payload (필수) 일반/상품권 상품 타입별 상품 중 체크된 상품 아이템ID
     */
    setCheckedItemIdsByType (state, payload) {
      state.checkedItemIdsByType[payload.cartType] = payload.value
    },
    /**
     * 총 결제 예상 금액 저장
     *
     * @param {*} state (필수) 상태
     * @param {object} payload (필수) 총 결제 예상 금액
     */
    setTotalPaymentPrice (state, payload) {
      state.totalPaymentPrice[payload.cartType] = payload.price
    },
    /**
     * 우상단 장바구니 아이콘 상품 개수 저장
     *
     * @param {*} state (필수) 상태
     * @param {object} payload (필수) 우상단 장바구니 아이콘 상품 개수
     */
    setCartIconCount (state, payload) {
      state.cartIconCount = payload
    }
  }
}
