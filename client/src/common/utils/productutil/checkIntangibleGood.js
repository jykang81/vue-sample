import { PRODUCT_CONST } from '@/common/constants/product/product'
/**
 * 무형상품 여부 확인
 * @param {String} dispTypeCd - 전시코드
 * @returns {void}
 */
function checkIntangibleGood (dispTypeCd) {
  return PRODUCT_CONST.GOODS_DISP_TYPE_CD.CONSULTATION_PRODUCT_TYPES.includes(dispTypeCd)
}

export default checkIntangibleGood
