import router from '@/router'

export default {
  namespaced: true,

  state: {
    orderSheetInfo: null,
    orderProduct: {}, // 주문 상품 정보
    strOrderInOrderId: '', // 주문번호 (결제 중복 방지용, MainCtrl.strOrderInOrderId 대응용)
    fromOrderSheetIsNoMemberOrder: false,
    ROUTER_REPLACE_CASES: [ // 주문서 이동 시 router push가 아닌 replace 해야하는 케이스
      '/native/right-order-option',
      '/customer/login/regular-member'
    ]

  },

  mutations: {
    /**
     * 주문 상품 정보
     *
     * @param {object} state 상태
     * @param {object} payload 주문 상품 정보
     */
    orderSheetInfo (state, payload) {
      state.orderSheetInfo = payload
    },
    /**
     * 주문 상품 정보 설정 후 주문서로 이동
     *
     * @param {object} state 상태
     * @param {object} payload 주문 상품 정보
     */
    setOrderProduct (state, payload) {
      state.orderProduct = payload
      if (state.ROUTER_REPLACE_CASES.includes(router.history.current.path)) {
        router.replace('/order/sheet').catch(() => {})
      } else {
        router.push('/order/sheet').catch(() => {})
      }
    },
    /**
     * 주문 상품 정보 설정 후 상담신청 주문서로 이동
     *
     * @param {object} state 상태
     * @param {object} payload 주문 상품 정보
     */
    setOrderConsultProduct (state, payload) {
      state.orderProduct = payload
      if (state.ROUTER_REPLACE_CASES.includes(router.history.current.path)) {
        router.replace('/order/consult').catch(() => {})
      } else {
        router.push('/order/consult').catch(() => {})
      }
    },
    /**
     * 주문번호 중복 체크 관련 초기화
     *
     * @param {Object} state order sheet state 객체
     * @param {String} orderId 주문번호
     */
    setStrOrderInOrderId (state, orderId) {
      state.strOrderInOrderId = orderId
    },
    /**
     * 비회원 주문서 내에서 로그인을 해야 하는경우 사용
     * @param {Object} state order sheet state 객체
     * @param {String} payload 비회원 주문서 내에서 로그인을 해야 하는 여부
     */
    setFromOrderSheetIsNoMemberOrder (state, payload) {
      state.fromOrderSheetIsNoMemberOrder = payload
    }
  }
}
