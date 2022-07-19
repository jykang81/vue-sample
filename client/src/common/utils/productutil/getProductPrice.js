import { PRODUCT_CONST } from '@/common/constants/product/product'
import {
  isNull,
  insertCommas
} from '@utils/commonutil/commonUtil'
import {
  checkIntangibleGood
} from '@utils/productutil/productUtil'

/**
 * 상품 가격 영역에 노출될 텍스트를 반환한다
 *
 * @param {string} buschnId 방송 매체
 * @param {string} dispTypeCd 상품 유형
 * @param {string} mmRntalPrc 렌탈 금액
 * @param {string} dcPrice 알뜰 할인가
 * @param {string} prcWaveDisp ~
 * @param {string} dcRate 할인률
 * @param {string} price 판매가
 * @returns {object} 상품 가격 정보
 */
function getProductPrice (buschnId, dispTypeCd, mmRntalPrc, dcPrice, prcWaveDisp, dcRate, price, soldOut) {
  let priceInfo = {
    title: { show: false, value: '' }, // 가격 타이틀 ex) '월'
    altText: { show: false, value: '' }, // 대체 텍스트 ex) '상담접수상품'
    dcPrice: { show: false, value: '' }, // 알뜰할인가 ex) '15,920', '상담접수상품'
    won: { show: false, value: '' }, // ex) '원'
    prcWaveDisp: { show: false, value: '' }, // ex) '~'
    dcRate: { show: false, value: '' }, // 할인률 ex) '5%'
    price: { show: false, value: '' } // 판매가 ex) '19,900%'
  }

  // 품절 상품이면(찜의 품절상품 표시)
  if (soldOut) {
    priceInfo = setPriceType4(priceInfo)
  // 전시타입이나 매체코드가 없고, 금액이 0원 또는 '상담접수상품'인 경우(찜의 API 데이터가 상이)
  } else if ((isNull(dispTypeCd) || isNull(buschnId)) && (Number(dcPrice) === 0 || isNull(dcPrice) || dcPrice === '상담접수상품')) {
    priceInfo = setPriceType3(priceInfo)
  // 무형상품이면서, TV, Shop+ 상품
  } else if (checkIntangibleGood(dispTypeCd) && (buschnId === PRODUCT_CONST.CHANNEL_ID.TV || buschnId === PRODUCT_CONST.CHANNEL_ID.SHOPPLUS)) {
    priceInfo = setPriceType3(priceInfo)
  // 무형상품 중 렌탈 상품이면서, 모바일, 인터넷, 쇼핑북 상품
  } else if (dispTypeCd === PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_RENTAL) {
    // 렌탈 금액이 0원보다 클 경우
    if (Number(mmRntalPrc) > 0 && !isNull(mmRntalPrc)) {
      priceInfo = setPriceType2(priceInfo, mmRntalPrc)
    } else {
      priceInfo = setPriceType3(priceInfo)
    }
  // 일반 상품
  } else {
    // 0,000원 / 0,000원~ / 0,000원 0% 0,000원 / 0,000원~ 0% 0,000원
    priceInfo = setPriceType1(priceInfo, dcPrice, prcWaveDisp, dcRate, price)
  }

  priceInfo.title.show = Boolean(priceInfo.title.value)
  priceInfo.altText.show = Boolean(priceInfo.altText.value)
  priceInfo.dcPrice.show = Boolean(priceInfo.dcPrice.value)
  priceInfo.won.show = priceInfo.dcPrice.show
  priceInfo.prcWaveDisp.show = Boolean(priceInfo.prcWaveDisp.value)
  priceInfo.dcRate.show = Boolean(priceInfo.dcRate.value)
  priceInfo.price.show = Boolean(priceInfo.price.value)

  return priceInfo
}

/**
 * 일반 상품
 * '0,000원' or '0,000원~' or '0,000원 0% 0,000원' or '0,000원~ 0% 0,000원' or '0,000원 0,000원' 으로 노출
 *
 * @param {object} priceInfo 가격 정보 객체
 * @param {string} dcPrice 알뜰 할인가
 * @param {string} prcWaveDisp ~
 * @param {string} dcRate 할인률
 * @param {string} price 판매가
 * @returns {object} 상품 가격 정보
 */
function setPriceType1 (priceInfo, dcPrice, prcWaveDisp, dcRate, price) {
  priceInfo.dcPrice.value = insertCommas(dcPrice)
  priceInfo.won.value = '원'
  priceInfo.prcWaveDisp.value = prcWaveDisp
  priceInfo.dcRate.value = Number(dcRate) !== 0 && !isNull(dcRate) ? ` ${dcRate}%` : ''
  priceInfo.price.value = Number(price) > Number(dcPrice) && !isNull(price) ? `${insertCommas(price)}원` : ''

  return priceInfo
}

/**
 * 렌탈 상품(모바일/인터넷/쇼핑북)
 * '월 0,000원'으로 노출
 *
 * @param {object} priceInfo 가격 정보 객체
 * @param {string} mmRntalPrc 렌탈 금액
 * @returns {object} 상품 가격 정보
 */
function setPriceType2 (priceInfo, mmRntalPrc) {
  priceInfo.title.value = '월'
  priceInfo.dcPrice.value = insertCommas(mmRntalPrc)
  priceInfo.won.value = '원'
  return priceInfo
}

/**
 * 무형상품(TV/Shop+)
 * '상담접수상품' 또는 '본 상품은 상담 후 구매가 가능합니다.'로 노출
 *
 * @param {object} priceInfo 가격 정보 객체
 * @returns {object} 상품 가격 정보
 */
function setPriceType3 (priceInfo) {
  priceInfo.altText.value = '상담접수상품'
  return priceInfo
}

/**
 * 품절 상품
 * '0원'으로 노출
 *
 * @param {object} priceInfo 가격 정보 객체
 * @returns {object} 상품 가격 정보
 */
function setPriceType4 (priceInfo) {
  priceInfo.dcPrice.value = '0'
  priceInfo.won.value = '원'
  return priceInfo
}

export default getProductPrice
