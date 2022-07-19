import { PRODUCT_CONST } from '@/common/constants/product/product'

/**
 * 매장에서의 무형 상품 공통로직.
 */
const storeFormlessMixin = {
  data () {
    return {
      bannerAllView: false,
      formlessType: [
        PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_TRAVEL,
        PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_INSURANCE,
        PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_RENTAL,
        PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_FUNERAL,
        PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_PHONE,
        PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_ADVERTISEMENT
      ]
    }
  },
  methods: {
    /**
     * 전시 타입코드가 무형상품이면 true, 아니면 false 반환.
     * @param {String} displayTypeCode - 전시타입 코드.
     * @returns {bool}
     */
    checkFormlessProduct (displayTypeCode) {
      const formlessType = this.formlessType
      return formlessType.includes(displayTypeCode)
    }
  }
}

export default storeFormlessMixin
