<template>
  <div class="button_area">
    <button type="button" class="button_wish">
      <i
        class="icons_wish"
        :class="onWishButton ? 'on' : ''"
        @click="bizUtil.wishToggle($event, globalVal.partNumber, globalVal.productInfo)"
      />
    </button>
    <button v-if="isLiveLimitProduct"
            type="button"
            disabled="disabled"
            class="button_buy in_active"
    >
      방송중 구매가능
    </button>
    <button
      v-else-if="isNoSaleCatalogProduct"
      type="button"
      class="button_buy"
      @click="moveNsMallRightOrder"
    >
      NSmall에서 바로 구매하기
    </button>
    <button
      v-else-if="isConsultantProduct"
      type="button"
      class="button_buy"
      @click="moveConsultationRequest"
    >
      상담 신청하기
    </button>
    <button
      v-else
      type="button"
      class="button_buy"
      @click="layerOpen"
    >
      구매하기
    </button>
  </div>
</template>

<script>
import { mapState } from 'vuex'
import { PRODUCT_CONST } from '@/common/constants/product/product'
import messageUtil from '@frameworks/messageUtil'
import bizUtil from '@utils/bizUtil'
import loginUtil from '@utils/loginUtil'
import toastUtil from '@frameworks/toastUtil'
import COMM_CONST from '@/common/constants/framework/constants'
import LOGIN_CONST from '@constants/customer/login'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import cookieUtil from '@frameworks/cookieUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import {
  isOsApp
} from '@utils/commonutil/commonUtil'

export default {
  props: {
    globalVal: {
      type: Object,
      required: true
    }

  },
  data () {
    return {
      SERVICE_PRODs: { // 렌탈 또는 휴대폰 등의 서비스 상품 상담신청 페이지로 가기위한 params
        dispTypeCd: null,
        brandName: null,
        productName: null,
        modelName: null,
        productNo: null,
        imageUrl: null,
        partNumber: null,
        quantity: 1,
        offerPrice: 0,
        orderPrgrsTypeCd: null,
        addAddressFlag: 'N'
      }
    }
  },
  computed: {
    ...mapState(['product']),
    /**
     * bizUtil
     *
     */
    bizUtil () {
      return bizUtil
    },
    /**
      * 찜 등록 여부
      * @returns {Boolean}
      */
    onWishButton () {
      return this.globalVal.productInfo.wishProduct
    },
    /**
     * 제휴사 경유 구매불가 상품인 경우
     *
     * @returns {Boolean}
     */
    isNoSaleCatalogProduct () {
      return this.globalVal.productInfo.noSaleCatalogYn === 'Y'
    },
    /**
     * 방송한정 상품인데 해당 시간이 아닌 경우 진입한 경우 여부
     *
     * @returns {Boolean}
     */
    isLiveLimitProduct () {
      return this.globalVal.productInfo.liveLimit === 'N'
    },
    /**
     * Live 방송 상품인경우
     *
     * @returns {Boolean}
     */
    isTvLiveProduct () {
      return this.globalVal.productInfo.tvLiveCd === 'A'
    },
    /**
     * 상담상품 여부
     * @returns {Boolean}
     */
    isConsultantProduct () {
      return PRODUCT_CONST.GOODS_DISP_TYPE_CD.CONSULTATION_PRODUCT_TYPES.includes(this.globalVal.productInfo.dispTypeCd)
    }
  },
  created () {
    if (this.$route?.params?.showRightOrderOptionFlag && !this.isConsultantProduct) {
      this.layerOpen()
      toastUtil.show(COMM_CONST.TOAST_MESSAGES.CART_ADD_OPTION)
      this.$route.params.showRightOrderOptionFlag = false
    }
  },
  methods: {
    /**
     * 상담신청 이동
     *
     */
    moveConsultationRequest () {
      this.checkLoginStatus(this.setParams(), true)
    },
    /**
     * NS몰에서 구매
     *
     */
    moveNsMallRightOrder () {
      cookieUtil.deleteCookie('co_cd', null, '.nsmall.com') // 쿠키 cocd 지움
      localStorageUtil.del('co_cd')
      const defaultCoCd = COMM_CONST.getWebAppDefaultCocd(isOsApp()) // 기본 co_cd 으로 세팅
      COMM_CONST.setCocd(defaultCoCd)
      this.$emit('refreshPage')
    },
    /**
     * 파라미터 세팅
     *
     * @returns {Object}
     */
    setParams () {
      const info = this.globalVal.productInfo
      const partNumber = this.globalVal.partNumber
      const {
        orderPrgrsTypeCd, goodsTypeCd, addAddressFlag, brandName, productName, modelName
        , costTypeCd, catentryId, dispTypeCd, busChnId
      } = info
      const productNo = info.mparam.multiCd || partNumber

      let pgmcd = ''
      let brdctDate = ''
      let brdctCnnlCd = ''

      let imageUrl = ''
      if (info.photoList && info.photoList.length > 0) {
        imageUrl = info.photoList?.[0].photoPath
      }

      if (this.isTvLiveProduct) {
        const items = info.tvList?.[0]
        pgmcd = items.pgmCd
        brdctCnnlCd = items.cnnlNumCd
        brdctDate = items.brdctDate
      }

      const itemNumber = this.getItem(this.globalVal.productInfo.optionList, partNumber)?.SKUs?.[0]?.uniqueID
      let offerPrice = 0
      if (dispTypeCd === '45' || dispTypeCd === '57') {
        offerPrice = info.mmRntalPrc
      } else {
        offerPrice = info.offerPrice
      }

      const params = {
        orderPrgrsTypeCd,
        brandName,
        productName,
        goodsTypeCd,
        addAddressFlag,
        productNo,
        imageUrl,
        pgmcd,
        modelName,
        brdctDate,
        brdctCnnlCd,
        costTypeCd,
        catentryId,
        itemNumber,
        dispTypeCd,
        offerPrice,
        partNumber,
        busChnId
      }

      return Object.assign(this.SERVICE_PRODs, params)
    },
    /**
     * 로그인 체크
     * @param {Object} params api 호출 파라미터
     * @param {Boolean} isOnlyUser 비회원 구매가능 여부
     */
    checkLoginStatus (params, isOnlyUser) {
      const isLogon = loginUtil.checkLogonStatus()
      if (isOnlyUser === true && !isLogon) {
        const alertMsg = '로그인이 필요한 상품입니다.'
        messageUtil.alert(alertMsg, () => {
          bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.MEMBER, 'orderConsultSheet', false, { invoke: params, isOnlyUser })
        })
      } else {
        bizUtil.gotoOrderConsult(params)
      }
    },
    /**
     * partNumber 일치하는 첫번째 아이템 반환
     * @param {Array} items 옵션목록
     * @param {String} partNumber 파트넘버
     * @returns {Object}
     */
    getItem (items, partNumber) {
      return (items && items.length > 0) ? items.find(item => partNumber === item.partNumber) : []
    },
    /**
     * 바로주문 열기
     *
     */
    layerOpen () {
      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_EVENT,
        data: {
          eventCate: 'MOBILE_상품상세',
          eventAction: '구매하기',
          eventLabel: '',
          params: {
            t1: null
          }
        }
      })
      this.$emit('layerOpen')
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/product/ButtonArea";
</style>
