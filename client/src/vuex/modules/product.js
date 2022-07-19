import productService from '@/services/modules/productService'

export default {
  namespaced: true,

  state: {
    productInfo: {},
    productData: {},
    selectedGiftList: {},
    cartOpenRightOrderLayer: {} // 바로 장바구니형에서 옵션 상품일 경우 바로구매를 열어야하며, 그 중간단계의 연결 vuex 객체.
  },

  // state는 mutation을 통해서만 수정. 여기에 로그를 남기면 됨.
  mutations: {
    /**
     * 상품상세 정보 설정
     *
     *@param {Object} state 상태
     * @param {Object} infoLoad 상품상세 정보
     */
    setProductInfo (state, infoLoad) {
      state.productInfo = infoLoad
    },
    /**
     * 상품 정보 설정
     *
     * @param {Object} state 상태
     * @param {Object} infoLoad 상품 정보
     */
    setProduct (state, infoLoad) {
      state.productData = infoLoad
    },
    /**
     * 선택한 사은품 목록 설정
     *
     * @param {Object} state 상태
     * @param {Object} infoLoad 선택한 사은품 목록
     */
    setSelectedGiftList (state, infoLoad) {
      state.selectedGiftList = infoLoad
    }
  },

  actions: {
    /**
     * 상품 조회 및 상품정보 갱신
     * @param {Object} context
     * @param {Function} context.commit
     * @param {Object} params
     */
    async getProductInfoSync ({ commit }, params) {
      const response = await productService.getProductInfo(params)

      commit('setProduct', response)
      if (response.msg?.goods?.[0]?.info) {
        const info = response.msg.goods[0].info // 상품정보
        commit('setProductInfo', info)
      }

      return response
    }
  }
}
