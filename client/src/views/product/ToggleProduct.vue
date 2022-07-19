<template>
  <section class="toggle_product">
    <div class="other_product">
      <div v-if="dutyUseDur"
           class="row_group"
      >
        <p class="imp_info">
          {{ dutyUseDur }}
        </p>
      </div>
      <div
        v-if="isConsultantRequiredProduct"
        class="row_group"
      >
        <h5 v-if="isRentalProduct"
            class="imp_info"
        >
          렌탈상품
        </h5>
        <h5 v-else-if="isConsultantRequiredProduct"
            class="imp_info"
        >
          상담상품
        </h5>
        <ul class="other_product_list">
          <li v-if="isPhoneProduct" class="icon_circle">
            NS는 휴대폰 가격표시제를 준수합니다.
          </li>
          <li class="icon_circle">
            이 상품은 NS가 상담예약신청을 대행하고 있으며, 협력사가 직접 <span v-if="isRentalProduct">렌탈</span> 서비스를 제공해 드립니다.
          </li>
          <li class="icon_circle">
            상담신청시 별도 결제하실 금액은 없습니다.
          </li>
        </ul>
      </div>
    </div>
    <div
      v-if="showCardBenefit && cardBenefitList"
      class="toggle_wrap"
    >
      <div
        class="title_wrap card"
        :class="isOpenCardBenefitInfoToggle"
        @click="openCardBenefitToggle"
      >
        <button
          type="button"
          class="btn collapse"
        >
          펼치기/접기
        </button>
        <template v-for="(cardBenefit,index) in cardBenefitList ">
          <p v-if="cardBenefit.cardBnftText" :key="index" class="copy">
            {{ cardBenefit.cardBnftText[0] }}<strong>{{ cardBenefit.cardBnftText[1] }}</strong>{{ cardBenefit.cardBnftText[2] }}
          </p>
        </template>
        <div class="txt_list_box">
          <strong>카드 청구할인 안내</strong>
          <dl
            v-for="(cardBenefit,index) in cardBenefitList "
            :key="index"
          >
            <dt> {{ cardBenefit.offerNm }}</dt>
            <dd>{{ cardBenefit.advInfoText }}</dd>
          </dl>
        </div>
      </div>
    </div>
    <div v-if="savings"
         class="toggle_wrap"
    >
      <div class="title_wrap cash">
        <p class="copy">
          적립금
          <span v-if="savingRatio">{{ savingRatio }}% 최대 </span>
          <strong> {{ savings }}</strong>원
          <span v-if="savingRatio">~</span>
        </p>
      </div>
    </div>
    <div v-if="isDispTypeShowingCardBenefit "
         class="toggle_wrap"
    >
      <div v-if="interestFreeMonths"
           class="title_wrap division"
      >
        <p class="copy">
          무이자 {{ interestFreeMonths }}개월
          <template v-if="oneTimePaymentDiscount">
            <em style="color:#838383">/</em>
            일시불 할인
            <strong>-{{ oneTimePaymentDiscount }}</strong>원~
          </template>
        </p>
      </div>
    </div>
    <div v-if="showDeliveryArea"
         class="toggle_wrap"
    >
      <div class="title_wrap delivery">
        <div class="delivery_shipping">
          <span class="copy">{{ shippingDate }}</span>
          <button
            type="button"
            class="layer_alert"
            @click="tooltipDeliveryOpen"
          >
            배송 예정일 안내 팝업
          </button>
          <container-tooltip
            :show="tooltipDelivery"
            @close="tooltipDeliveryClose"
          >
            <template #title>
              배송 예정일 안내
            </template>
            <template #content>
              <p class="msg">
                배송도착정보는 최근 배송데이터에 기반하여 분석/예측한 기준으로 노출됩니다. 판매자/택배사의 사정으로 발송일/도착일/택배사정보의 변동이 있을 수 있습니다.
              </p>
            </template>
          </container-tooltip>
        </div>
        <p v-if="shippingDateInfo"
           class="copy"
        >
          {{ shippingDateInfo }}
        </p>
        <div class="delivery_guide">
          <span class="price">
            {{ deliveryPrice }}
          </span>
          <button
            v-if="showBundleProducts"
            type="button"
            class="layer_alert"
            @click="goBundleProductsList"
          >
            묶음배송상품 보기
          </button>
          <p class="copy">
            {{ deliveryPriceMsg }}
            <br
              v-if="deliveryPriceMsg"
            >
            {{ additionalDeliveryPriceInfo }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import {
  isNull,
  getHangulPrice,
  insertCommas,
  htmlDecode,
  getMoneyFormat
} from '@utils/commonutil/commonUtil'
import ContainerTooltip from '@components/frameworks/ContainerTooltip'
import {
  calcDate,
  getDateWithDayFormat
} from '@frameworks/dateutil/dateUtil'
import { PRODUCT_CONST } from '@/common/constants/product/product'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  components: {
    ContainerTooltip
  },
  props: {
    globalVal: {
      type: Object,
      required: false,
      default: Object
    }

  },
  data () {
    return {
      isOpenCardBenefitInfoToggle: { // 카드혜택 토글
        active: false
      },
      tooltipDelivery: false // 배송지안내
    }
  },
  computed: {
    /**
     * 배송비 영역 노출 여부
     *
     * @returns {Boolean}
     */
    showDeliveryArea () {
      const isConsultantProduct = PRODUCT_CONST.GOODS_DISP_TYPE_CD.CONSULTATION_PRODUCT_TYPES.includes(this.globalVal.productInfo.dispTypeCd)
      const isTravelProduct = PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_TRAVEL === this.globalVal.productInfo.dispTypeCd
      return this.globalVal.productInfo.noSaleCatalogYn === 'Y' || this.globalVal.productInfo.chcChildYn === 'Y' || !(isConsultantProduct || isTravelProduct)
    },
    /**
     * 렌탈상품 여부
     *
     * @returns {Boolean}
     */
    isRentalProduct () {
      return PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_RENTAL === this.globalVal.productInfo.dispTypeCd
    },
    /**
     * 휴대폰상품 여부
     *
     * @returns {Boolean}
     */
    isPhoneProduct () {
      return PRODUCT_CONST.GOODS_DISP_TYPE_CD.FORMLESS_PRODUCT_PHONE === this.globalVal.productInfo.dispTypeCd
    },
    /**
     * 상담이 필요한 상품 여부
     *
     * @returns {Boolean}
     */
    isConsultantRequiredProduct () {
      return PRODUCT_CONST.GOODS_DISP_TYPE_CD.CONSULTATION_PRODUCT_TYPES.includes(this.globalVal.productInfo.dispTypeCd)
    },
    /**
     * 신용카드, 제휴카드 정보 출력.
     * dispTypeCd : 전시유형
     * cardBnftList : 신용카드 및 제휴카드 정보 목록
     * salePrice : 알뜰할인가
     * @returns {Boolean}
     */
    showCardBenefit () {
      if (!this.globalVal.productInfo.cardBnftList || this.globalVal.productInfo.cardBnftList.length === 0) {
        return false
      }
      if (!this.isDispTypeShowingCardBenefit) {
        return false
      }
      let creditCardBnftYn = false
      let allianceCardBnftYn = false

      // 신용카드 혜택여부 및 제휴카드 혜택 여부가 존재하는 지 체크한다.
      for (const item of this.globalVal.productInfo.cardBnftList) {
        let isCardBnftAble = true

        // 수량제한구간 존재시
        if (item.qtyRstApplyYn === '1' && item.qtyStartVal > 1) {
          isCardBnftAble = false
        }

        if (isCardBnftAble && (item.bnftType === '33' || item.bnftType === '35')) {
          creditCardBnftYn = true
        }
        if (isCardBnftAble && item.bnftType === '31') {
          allianceCardBnftYn = true
        }
      }

      if (!creditCardBnftYn && !allianceCardBnftYn) {
        return false
      }

      return true
    },
    /**
     * 신용카드 할인
     *
     */
    cardBenefitList () {
      const returnList = []
      let cardSalePrice
      let cardDisplaySalePrice
      let maxBnftLimit = 0
      for (const items of this.globalVal.productInfo.cardBnftList) {
        if ((items.bnftType === '33' || items.bnftType === '31' || items.bnftType === '35')) {
          cardSalePrice = items.realCardVal

          // 할인금액이 최대할인한도 초과시
          if (items.realCardVal > items.maxBnftLimit && items.maxBnftLimit > 0) {
            cardSalePrice = items.maxBnftLimit
          }

          // 알뜰할인가 - 최대할인 금액
          cardDisplaySalePrice = this.globalVal.productInfo.salePrice - cardSalePrice

          if (cardDisplaySalePrice < 0) {
            cardDisplaySalePrice = 0
          }
          if (!isNull(items.maxBnftLimit)) {
            maxBnftLimit = items.maxBnftLimit
          }
          if (maxBnftLimit < 0) {
            maxBnftLimit = 0
          }

          let cardBnft
          let cardBnftText
          let advInfoText = ''

          if (items.cardBnft && items.cardBnftVal) {
            let strBnftTypeText = ''
            if (items.bnftType === '31') { // 선할인
              strBnftTypeText = '즉시'
            } else if (items.bnftType === '33' || items.bnftType === '35') { // 청구할인
              strBnftTypeText = '청구'
            }

            cardBnft = items.cardBnft.replace('NS페이-', 'NS페이 ')

            // 카드 할인 정보
            if (items.cardBnftSpr === '1') {
              cardBnft += ` ${getHangulPrice(Math.ceil(Math.floor(items.cardBnftVal) / 10) * 10)}원 ${strBnftTypeText}할인`
            } else {
              cardBnft += ` ${items.cardBnftVal}% ${strBnftTypeText}할인`
            }

            // 추가 정보
            if (items.amtStartVal && items.amtStartVal !== '0') {
              advInfoText = `${getHangulPrice(items.amtStartVal)}원 이상 결제시 `
            }
            if (maxBnftLimit > 0) {
              advInfoText += `최대 ${getHangulPrice(Math.ceil(Math.floor(items.maxBnftLimit) / 10) * 10)}원 할인`
            }

            items.offerNm = items.offerNm.replace('NS페이_', 'NS페이 ').replace('청구할인', ' 청구할인')
            const offerNm = items.offerNm
            // 결제 금액이 청구할인 최소금액보다 적을 경우
            if (Number(cardDisplaySalePrice) < Number(items.amtStartVal)) {
              cardBnftText = [`${cardBnft}(`, `${insertCommas(items.amtStartVal)}`, '원 이상)']
            } else {
              cardBnftText = [`${cardBnft}가 `, `${insertCommas(cardDisplaySalePrice)}`, `원 ${this.globalVal.productInfo.prcWaveDisp}`]
            }
            returnList.push({ cardBnftText, offerNm, advInfoText })
          }
        }
      }
      return returnList?.length ? returnList : null
    },
    /**
     * 적립금 정률
     * @returns {String|null}
     */
    savingRatio () {
      return this.globalVal.productInfo.padValueRto || null
    },
    /**
     * 적립금
     * @returns {String}
     */
    savings () {
      if (!(isNull(this.globalVal.productInfo.padDcWay) || isNull(this.globalVal.productInfo.padValue))) {
        return insertCommas(this.globalVal.productInfo.padValue)
      } else {
        return null
      }
    },
    /**
     * 모바일적립금
     * @returns {String}
     */
    mobileSavings () {
      if (!(isNull(this.globalVal.productInfo.padDcWay) || isNull(this.globalVal.productInfo.padValue))) {
        return insertCommas(this.globalVal.productInfo.padValue)
      } else {
        return null
      }
    },
    /**
     * 의무사용기간
     * @returns {String}
     */
    dutyUseDur () {
      const dutyUseDur = this.globalVal.productInfo.dutyUseDur
      const dispTypeCd = this.globalVal.productInfo.dispTypeCd
      let dutyTitle = ''

      if (this.globalVal.productInfo.chcChildYn !== 'Y' && dutyUseDur > 0) { // 초이스 상품이 아닌 경우.
        if (dispTypeCd !== '35' && dispTypeCd !== '40' && dispTypeCd !== '56' && dispTypeCd !== '58') { // 2차 컨텍 상품이 아닐경우
          dutyTitle = '의무사용기간 '

          if (this.globalVal.productInfo.dispTypeCd === '57') {
            dutyTitle = '약정기간 '
          } // 45는 의무사용기간
        }
      }

      return dutyUseDur
        ? `${dutyTitle + insertCommas(dutyUseDur)}개월`
        : null
    },
    /**
      * 신용카드 정보 노출 여부
      * 전시유형코드가 서비스상품 또는 상품권일 경우 출력 안함
      * @returns {Boolean}
      */
    isDispTypeShowingCardBenefit () {
      return !PRODUCT_CONST.GOODS_DISP_TYPE_CD.NO_CREDITCARD_BENEFIT_PRODUCT_TYPES.includes(this.globalVal.productInfo.dispTypeCd)
    },
    /**
     * 무이자 개월수
     * ifiValue : 무이자 개월수
     * @returns {Number}
     */
    interestFreeMonths () {
      return Number(this.globalVal.productInfo.ifiValue)
    },
    /**
     * 일시불 할인액
     * lspAmt : 일시불 할인액 (정률도 금액으로 환산함)
     * @returns {String|null}
     */
    oneTimePaymentDiscount () {
      return this.globalVal.productInfo.lspAmt ? insertCommas(this.globalVal.productInfo.lspAmt) : null
    },
    /**
     * 모델번호
     * @returns {String}
     */
    modelName () {
      return htmlDecode(this.globalVal.productInfo.modelName)
    },
    /**
     * 원산지,원재료 노출 여부
     * @returns {Boolean}
     */
    showCountryOfOriginInfo () {
      const isNotPack = (this.globalVal.productInfo.dispTypeCd !== '20')
      const isFood = (this.globalVal.productInfo.catGb === '10' || this.globalVal.productInfo.catGb === '20')
      return isNotPack && isFood
    },
    /**
     * 원산지,원재료
     * @returns {Boolean}
     */
    countryOfOrigin () {
      if (isNull(this.globalVal.productInfo.rmtrlpoo)) {
        return '상세페이지 참조'
      } else {
        return this.globalVal.productInfo.rmtrlpoo
      }
    },
    /**
     * 배송비
     * @returns {String}
     */
    deliveryPrice () {
      if (!this.globalVal.productInfo.dlvrPrice) {
        return '무료배송'
      } else {
        if (this.globalVal.productInfo.dlvrPrice === 9999999) {
          return '착불배송'
        } else {
          return `배송비 ${insertCommas(this.globalVal.productInfo.dlvrPrice)}원`
        }
      }
    },
    /**
     * 계산된 배송비 부과정보
     * @returns {String}
     */
    deliveryPriceMsg () {
      return this.globalVal.productInfo.dlvrPriceMsg
    },
    /**
     * 묶음배송 노출 여부
     * @returns {Boolean}
     */
    showBundleProducts () {
      return (this.globalVal.productInfo.dlvrSaveYn === 'Y')
    },
    /**
     * 배송비 추가정보
     * @returns {String}
     */
    shippingDateInfo () {
      let shippingDateInfo = null
      const custGetDttmInfo = getDateWithDayFormat(this.globalVal.productInfo.custGetDttm)

      if (this.globalVal.productInfo.dofEndDttm && this.globalVal.productInfo.dofStartDttm) {
        const endDt = this.globalVal.productInfo.dofEndDttm.split(' ')[0].replace(/-/g, '')
        const endDtString = getDateWithDayFormat(endDt)

        const startDt = this.globalVal.productInfo.dofStartDttm.split(' ')[0].replace(/-/g, '')
        const startDtString = getDateWithDayFormat(startDt)

        shippingDateInfo = `${startDtString}~${endDtString} 주문 건은 ${custGetDttmInfo}까지 배송예정입니다.`
      }
      return shippingDateInfo
    },
    /**
    * 배송일
    * @returns {String}
    */
    shippingDate () {
      const intuitiveShippingDate = this.globalVal.productInfo.intuitiveShippingDate
      let infoString = '결제후 3일이내 배송(토,일,공휴일제외)'
      if (intuitiveShippingDate) {
        if (intuitiveShippingDate === '29990101') {
          if (this.globalVal.productInfo.busChnId === 'CTCOM' || this.globalVal.productInfo.busChnId === 'TV') {
            infoString = '설치/직배송상품 별도 해피콜 예정 (약 3일 소요)'
          } else {
            infoString = '설치/직배송상품 별도 해피콜 예정'
          }
        } else if (intuitiveShippingDate === '29990102') {
          infoString = '상품설명 내 상세배송일정 참고'
        } else {
          infoString = `${this.getShippingDate(intuitiveShippingDate)} 이내 도착예정`
        }

        if (this.globalVal.productInfo.orderPostPrdnFlag === 'Y') {
          infoString += '[주문제작상품]'
        }
      } else if (this.globalVal.productInfo.custGetDttm) {
        const custGetDttmInfo = getDateWithDayFormat(this.globalVal.productInfo.custGetDttm)
        infoString = custGetDttmInfo

        if (this.globalVal.productInfo.installItemFlag === 'Y') {
          infoString += '이내 해피콜 예정'
        } else {
          infoString += '이내 도착 예정'
        }

        if (this.globalVal.productInfo.deliveryType === '10') {
          infoString = '예약일정에 따라 출고'
        }
        if (this.globalVal.productInfo.orderPostPrdnFlag === 'Y') {
          infoString += '[주문제작상품]'
        }
      }
      return infoString
    },
    /**
     * 추가배송비
     * 1. 제주 > 0 && 도서산간 >0
     * 2. 제주 > 0 && 도서산간 <= 0
     * 3. 제주 <=0 && 도서산간 > 0
     * 4. 제주 <=0 && 도서산간 <= 0
     * @returns {String}
     */
    additionalDeliveryPriceInfo () {
      let returnMsg = ''
      if (this.globalVal.productInfo.rmaDlvrYn === 'Y') {
        if (this.globalVal.productInfo.rmaJejuRegnDlvrExpns > 0 && this.globalVal.productInfo.rmaGnrlRegnDlvrExpns > 0) {
          returnMsg = `${'추가 배송비 : ' + '제주도 '}${getMoneyFormat('', this.globalVal.productInfo.rmaJejuRegnDlvrExpns)}원 / ` + `도서산간 ${getMoneyFormat('', this.globalVal.productInfo.rmaGnrlRegnDlvrExpns)}원`
        } else if (this.globalVal.productInfo.rmaJejuRegnDlvrExpns > 0 && this.globalVal.productInfo.rmaGnrlRegnDlvrExpns <= 0) {
          returnMsg = `${'추가 배송비 : ' + '제주도 '}${getMoneyFormat('', this.globalVal.productInfo.rmaJejuRegnDlvrExpns)}원`
        } else if (this.globalVal.productInfo.rmaJejuRegnDlvrExpns <= 0 && this.globalVal.productInfo.rmaGnrlRegnDlvrExpns > 0) {
          returnMsg = `${'추가 배송비 : ' + '도서산간 '}${getMoneyFormat('', this.globalVal.productInfo.rmaGnrlRegnDlvrExpns)}원`
        }
      } else if (this.globalVal.productInfo.rmaDlvrYn === 'D') {
        /* 1. 도서산간 > 0
        * 2. 도서산간 <= 0
        */
        if (this.globalVal.productInfo.rmaGnrlRegnDlvrExpns > 0) {
          returnMsg = `${'제주도 배송불가 / ' +
          '추가 배송비 : 도서산간 '}${getMoneyFormat('', this.globalVal.productInfo.rmaGnrlRegnDlvrExpns)}원`
        } else {
          returnMsg = '제주도 배송불가'
        }
      } else if (this.globalVal.productInfo.rmaDlvrYn === 'J') {
        /* 1. 제주도 > 0
        * 2. 제주도 <= 0
        */
        if (this.globalVal.productInfo.rmaJejuRegnDlvrExpns > 0) {
          returnMsg = `${'추가 배송비 : ' + '제주도 '}${getMoneyFormat('', this.globalVal.productInfo.rmaJejuRegnDlvrExpns)}원 / ` + '도서산간 배송불가 '
        } else {
          returnMsg = '도서산간 배송불가 '
        }
      } else {
        returnMsg = '제주도 / 도서산간 배송불가'
      }

      return returnMsg
    }

  },
  methods: {
    /**
     * 묶음배송상품 보기
     *
     */
    goBundleProductsList () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_상품상세',
          eventAction: '묶음배송 상품보기',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })

      const invoke = {
        name: 'bundleList',
        params: {
          globalVal: this.globalVal,
          partNumber: this.globalVal.partNumber
        }
      }
      this.$router.push(invoke)
    },
    /**
     * 카드혜택 토글 펼침 여부
     *
     */
    openCardBenefitToggle () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_상품상세',
          eventAction: '카드청구할인',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })

      const beforeAfterOffsetY = window.pageYOffset

      this.isOpenCardBenefitInfoToggle.active = !this.isOpenCardBenefitInfoToggle.active

      window.scrollTo(0, beforeAfterOffsetY)
    },
    /**
      * 배송일
      * @param {String} intuitiveShippingDate 배송예정일
      * @returns {string} 계산된 날짜
      */
    getShippingDate (intuitiveShippingDate) {
      const day = getDateWithDayFormat(intuitiveShippingDate)

      if (intuitiveShippingDate === calcDate('', 0, 0, 0, 1, 'yyyyMMdd')) {
        return `내일 ${day}`
      } else if (intuitiveShippingDate === calcDate('', 0, 0, 0, 2, 'yyyyMMdd')) {
        return `모레 ${day}`
      } else {
        return getDateWithDayFormat(intuitiveShippingDate)
      }
    },
    /**
     * 배송지안내 열기
     */
    tooltipDeliveryOpen () {
      this.tooltipDelivery = true
    },
    /**
     * 배송지안내 닫기
     */
    tooltipDeliveryClose () {
      this.tooltipDelivery = false
    }
  }

}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/product/ToggleProduct";
</style>
