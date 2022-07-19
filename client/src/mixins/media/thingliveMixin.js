import {
  isEmpty,
  getImageUrl
} from '@utils/commonutil/commonUtil'

/**
 * 띵라이브 Mixin
 */
const thingliveMixin = {
  data () {
    return {
      // 공통
      MAX_EXPOSE_PRODUCT_CNT: 3
    }
  },
  methods: {
    /**
     * 상품 영역 세팅 (AS-IS: vodlive.js - drawProdArea)
     *
     * @param {Object} outputList - 변경 후 상품 목록
     * @param {Object} inputList - 변경 후 상품 목록
     * @param {String} type - 상품 구분(main:메인상품, rel:연관상품)
     * @returns {void}
     */
    setProdArea (outputList, inputList, type) {
      // 데이터가 없을 경우 함수 종료
      if (isEmpty(inputList)) {
        return
      }

      for (let i = 0; i < inputList.length; i++) {
        // 상품별 데이터
        const item = inputList[i]

        // item 데이터가 있으면
        if (item) {
          // 임시 객체
          const tempObject = {
            imageUrl: getImageUrl(item.partnumber, 224, 224, item.adultItemFlag), // 상품 이미지
            dcPrice: item.dcPrice, // 알뜰할인가
            dcRate: item.dcRate, // 할인율
            price: item.price, // 판매가
            mmRntalPrc: item.mmRntalPrc, // 렌탈 금액
            prcWaveDisp: item.prcWaveDisp, // 옵션상품 가격 '~'표시
            partnumber: item.partnumber, // 상품코드(백엔드)
            promIfiVal: item.promIfiVal !== '0', // 무이자여부
            dlvrFreeYn: item.dlvrFreeYn === 'Y', // 무료배송여부
            promPadYn: item.promPadYn === 'Y', // 적립금여부
            itncatentrynm: item.itncatentrynm, // 상품명(브랜드 노출X)
            buschnId: item.buschnId, // 방송 매체
            dispTypeCd: item.dispTypeCd, // 상품 유형
            type // 메인 상품 / 연관 상품 구분 값
          }
          outputList.push(tempObject)
        }
      }
    }
  }
}

export default thingliveMixin
