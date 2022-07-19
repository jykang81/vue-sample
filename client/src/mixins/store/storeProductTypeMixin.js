
import { PRODUCT_CONST } from '@/common/constants/product/product'
import ANCHOR_CONST from '@/common/constants/store/anchor'
import {
  insertCommas
} from '@utils/commonutil/commonUtil'
const happyDealMixin = {
  methods: {
    /**
     * 렌탈 상품 여부
     *
     * @param {Object} product - 상품 객체
     * @returns {Boolean}
     */
    isRentalProduct (product) {
      return PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_RENTAL === product.dispTypeCd
    },
    /**
     * 휴대폰상품 여부
     *
     * @param {Obejct} product - 상품 객체
     * @returns {Boolean}
     */
    isPhoneProduct (product) {
      return PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_PHONE === product.dispTypeCd
    },
    /**
     * 상담이 필요한 상품 여부
     *
     * @param {Object} product - 상품 객체
     * @returns {Boolean}
     */
    isConsultantRequiredProduct (product) {
      if (product && product.dispTypeCd) {
        return PRODUCT_CONST.GOODS_DISP_TYPE_CD.CONSULTATION_PRODUCT_TYPES.includes(product.dispTypeCd)
      } else {
        return false
      }
    },
    /**
     * 렌탈 상품을 제외한 상담필요 상품 여부
     * @param {Object} product
     * @returns {Boolean}
     */
    isConsultantRequiredProductWithoutRental (product) {
      const isConsultRequired = PRODUCT_CONST.GOODS_DISP_TYPE_CD.CONSULTATION_PRODUCT_TYPES.includes(product.dispTypeCd)
      const isRental = PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_RENTAL === product.dispTypeCd
      if (isConsultRequired && isRental) {
        return false
      } else if (isConsultRequired) {
        return true
      } else {
        return false
      }
    },
    /**
     * 렌탈료
     *
     * @param {Object} product - 상품 객체
     * @returns {String} 렌탈료
     */
    rentalPrice (product) {
      return insertCommas(product.mmRntalPrc)
    },
    /**
     * 주문 수량.
     * @param {Number} ordCnt - 주문수량
     * @returns {String}
     */
    getOrderCount (ordCnt) {
      if (ordCnt > 9999999) {
        return '9,999,999개 구매'
      } else if (ordCnt <= 0) {
        return ''
      } else {
        return `${insertCommas(ordCnt)}개 구매`
      }
    },
    /**
     * 별점 개수
     * @param {Number} starCnt - 별점 개수
     * @returns {String}
     */
    getStarCount (starCnt) {
      if (starCnt > 9999) {
        return '+9,999'
      } else if (starCnt <= 0) {
        return ''
      } else {
        return `${insertCommas(starCnt)}`
      }
    },
    /**
     * 와이드형 상품 혜택 영역 존재여부 반환
     * @param {Object} product - 상품 객체
     */
    isBenefitExist (product) {
      const { dlvrFreeYn, promIfiVal, promPadYn, orderQty } = product
      if ((dlvrFreeYn === 'Y' && !this.isConsultantRequiredProduct(product)) || Number(promIfiVal) || promPadYn === 'Y' || orderQty !== '0') {
        return true
      } else {
        return false
      }
    },
    /**
     * 와이드형 상품 혜택 영역 존재여부 반환 (슬롯매장용)
     * @param {Object} product - 상품 객체
     * @param {String} ordQtyHide - CSS 옵션
     */
    isBenefitExistForSlot (product, ordQtyHide) {
      const { buschnId, isFlashSale, dlvrFreeYn, promIfiVal, promPadYn, orderQty } = product
      const isTv = buschnId === ANCHOR_CONST.CHANNEL_TEXT.TV
      const isShopplus = buschnId === ANCHOR_CONST.CHANNEL_TEXT.SHOPPLUS
      const isHappyDeal = isFlashSale === 'Y'
      const isFreeDlvr = dlvrFreeYn === 'Y' && !this.isConsultantRequiredProduct(product)
      const isFreeIntrst = promIfiVal > 0
      const isMailige = promPadYn === 'Y'
      const isOrdQty = ordQtyHide !== 'Y' && orderQty > 0
      if (isTv || isShopplus || isHappyDeal || isFreeDlvr || isFreeIntrst || isMailige || isOrdQty) {
        return true
      } else {
        return false
      }
    }
  }
}

export default happyDealMixin
