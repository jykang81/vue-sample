<template>
  <div v-if="isLoadChildComponent" id="productDetail"
       :key="reloadKey"
       class="product_detail"
  >
    <product-info
      v-if="isLoadChildComponent"
      :global-val="globalVal"
    />
    <toggle-product
      v-if="isLoadChildComponent"
      :global-val="globalVal"
    />
    <gift-product
      v-if="isLoadChildComponent"
      :global-val="globalVal"
    />
    <banner-product
      v-if="isLoadChildComponent && isBannerProductReadied"
      :global-val="globalVal"
    />
    <essential-info
      v-if="isLoadChildComponent"
      :global-val="globalVal"
    />
    <vendor-container
      v-if="isLoadChildComponent"
      :global-val="globalVal"
    />
    <section-Custom
      v-if="isLoadChildComponent"
      :global-val="globalVal"
    />
    <related-product
      v-if="isLoadChildComponent && isRecommendReadied"
      :global-val="globalVal"
      @requiresRefresh="handleRequiresRefresh"
    />
    <button-area
      v-if="isLoadChildComponent"
      :global-val="globalVal"
      @layerOpen="layerOpen"
      @layerClose="layerClose"
      @refreshPage="refreshPage"
    />
    <right-order-option
      v-if="isLoadChildComponent"
      :shows-layer="showRightOrderOption"
      :global-val="globalVal"
      @layerClose="layerClose"
    />
  </div>
</template>

<script>
import popupUtil from '@frameworks/popupUtil'
import bizUtil from '@utils/bizUtil'
import {
  isOsApp,
  isNull,
  htmlDecode
} from '@utils/commonutil/commonUtil'
import {
  format,
  getDateParse,
  getBdDay,
  getNowDate,
  getAgeInFull
} from '@frameworks/dateutil/dateUtil'
import loginUtil from '@utils/loginUtil'
import messageUtil from '@frameworks/messageUtil'
import MESSAGES from '@/common/constants/framework/messages'
import PRODUCT_MESSAGE, { PRODUCT_CONST } from '@/common/constants/product/product'
import REVIEW_CONST from '@/common/constants/product/review'
import COMMON_CONST from '@constants/common/common'
import COMM_CONST from '@/common/constants/framework/constants'
import LOGIN_CONST from '@constants/customer/login'
import ProductInfo from '@/views/product/ProductInfo'
import ToggleProduct from '@/views/product/ToggleProduct'
import BannerProduct from '@/views/product/BannerProduct'
import GiftProduct from '@/views/product/GiftProduct'
import EssentialInfo from '@/views/product/EssentialInfo'
import VendorContainer from '@/views/product/VendorContainer'
import SectionCustom from '@/views/product/SectionCustom'
import RelatedProduct from '@/views/product/RelatedProduct'
import ButtonArea from '@/views/product/ButtonArea'
import RightOrderOption from '@/components/product/RightOrderOption'
import localStorageUtil from '@frameworks/localStorageUtil'
import routerUtil from '@/common/frameworks/routerUtil'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트
import productDetailService from '@services/product/productDetailService'
import uiUtil from '@utils/uiUtil'
import cookieUtil from '@frameworks/cookieUtil'
import nsaxios from '@frameworks/axiosUtil'

export default {
  components: {
    ProductInfo,
    ToggleProduct,
    GiftProduct,
    BannerProduct,
    EssentialInfo,
    VendorContainer,
    SectionCustom,
    RelatedProduct,
    ButtonArea,
    RightOrderOption
  },
  data () {
    return {
      coCd: COMM_CONST.getCocd(),
      showRightOrderOption: false,
      MESSAGE: {
        SOLDOUT: PRODUCT_MESSAGE.SOLDOUT,
        VIP_ONLY: PRODUCT_MESSAGE.VIP_ONLY,
        LIVE_ONLY: PRODUCT_MESSAGE.LIVE_ONLY
      },
      reloadKey: 1,
      isLoadChildComponent: false,
      isRecommendReadied: false,
      isBannerProductReadied: false,
      globalVal: {
        partNumber: '', // 상품번호
        productInfo: {}, // 상품정보
        pastVod: '', // vod 경로
        userBroadInfrId: '', // 방송알리미 등록 여부
        reviewInfo: {}, // 상품평 정보
        guideDataList: [], // 상품상세 기술서 ( 이미지 )
        guideDataDetailList: [], // 상품상세 기술서( 텍스트 )
        qnaGuide: [], // 상품문의 정보
        detailQna: [], // 상품문의 목록
        ftcGuideList: [], // 공정위 항목. - 제품소재, 색상, 치수, 제조자, 취급주의사항 등 상품 정보 안내 입니다.
        togetherViewList: [], // 다른고객님이 함께 보신 상품
        togetherPurchaseList: [], // 다른 고객님이 함께 구매하신 상품
        popularProductsList: [], // 고객님들이 많이 구매하신 인기상품
        clksrc: '', // 이전 화면의 클릭 항목명
        receivedRcCode: '', // 이전 화면의 클릭 rcCode(추천 상품)
        lnbCateName: '', // 카테고리매장명
        scheduleTblName: '', // 편성표 이름. TVLIVE, NSSHO+
        slotStoreName: '', // 편성매장명
        popupId: '' // 팝업창. #popup-1
      }
    }
  },
  computed: {
    /**
     * 상품상세정보조회 API 호출을 위한 파라미터
     * @returns {Object}
     */
    productDetailParams () {
      return {
        partNumber: this.globalVal.partNumber,
        cocd: this.coCd, // 외부유입경로 코드(제휴사코드)
        imgSizeType: PRODUCT_CONST.PRODUCT_DETAIL_IMAGE_SIZE
      }
    },
    /**
     * 지금 고객님이 많이 보는 상품 API 호출을 위한 파라미터
     * @returns {Object}
     */
    togetherViewParams () {
      return {
        rccode: 'mo_detail1',
        recType: 'a002',
        iids: this.globalVal.productInfo.catentryId,
        size: 9
      }
    },
    /**
     * 고객님들이 함께 구매한 상품 API 호출을 위한 파라미터
     * @returns {Object}
     */
    togetherPurchaseParams () {
      return {
        rccode: 'mo_detail2',
        recType: 'a003',
        iids: this.globalVal.productInfo.catentryId,
        size: 9
      }
    },
    /**
     * 고객님들이 많이 구매한 인기상품 API 호출을 위한 파라미터
     * @returns {Object}
     */
    popularProductsParams () {
      const params = {
        cids: this.getCateCdEnd() || '',
        size: 9
      }
      const isTvProduct = this.globalVal.productInfo.tvList
      const isCtcomProduct = this.globalVal.productInfo.ctcomTvList

      if (isTvProduct || isCtcomProduct) {
        return Object.assign({
          rccode: 'mo_detail4',
          recType: 'c012'
        }, params)
      } else {
        return Object.assign({
          rccode: 'mo_detail3',
          recType: 'c001'
        }, params)
      }
    },
    /**
     * 상품기술서 조회 API 호출을 위한 파라미터
     * @returns {Object}
     */
    moreGeneralInfoParams () {
      return {
        cmdType: 7,
        catentryId: this.globalVal.partNumber,
        deviceChnId: 'MOBIL'
      }
    },
    /**
     * 상품평 요약정보 조회 API 호출을 위한 파라미터
     * @returns {Object}
     */
    productReviewParams () {
      return {
        cmdType: REVIEW_CONST.REVIEW_CMD_TYPE.GET_SUMMARY,
        postField1: this.globalVal.partNumber
      }
    },
    /**
     * 상품평 요약정보 조회 API 호출을 위한 파라미터
     * @returns {Object}
     */
    qaListParams () {
      return {
        catentryId: this.globalVal.partNumber,
        pageId: 1,
        pageSize: 20,
        myQnAFlag: 'off',
        logonId: loginUtil.userId()
      }
    }
  },
  watch: {
    '$route' (to, from) {
      if (to.name === 'productDetail' && from.path !== to.path) {
        this.init()
        this.reloadKey++
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    /**
     * 초기화
     *
     */
    async init () {
      this.isLoadChildComponent = false
      uiUtil.enableScroll()
      this.globalVal.partNumber = `${this.$route.params.number}`

      const [
        productDetailData, generalInfoData, productReviewData, qaListData
      ] = await Promise.all([
        this.getProductDetail(),
        this.getMoreGeneralInfo(),
        this.getProductReview(),
        this.getQAList()
      ])

      if (productDetailData?.authMsg?.authCode === '400') {
        const alertMsg = productDetailData.authMsg.message
        messageUtil.alert(alertMsg, () => {
          bizUtil.gotoMain()
        })
        return
      }

      this.checkProductValidation(productDetailData)
      this.setProductDetailData({ productDetailData, generalInfoData, productReviewData, qaListData })
      if (this.globalVal.productInfo.noSaleCatalogYn === 'Y') {
        const alertMsg = `${this.globalVal.productInfo.noSaleCatalogMsg}<br/> NSmall에서 구매하시겠습니까?`
        messageUtil.confirm(alertMsg,
          () => {
            cookieUtil.deleteCookie('co_cd', null, '.nsmall.com') // 쿠키 cocd 지움
            localStorageUtil.del('co_cd')
            const defaultCoCd = COMM_CONST.getWebAppDefaultCocd(isOsApp()) // 기본 co_cd 으로 세팅
            COMM_CONST.setCocd(defaultCoCd)
            this.coCd = COMM_CONST.getCocd()
            this.init()
          },
          () => {}
        )
      }

      const isAdultOnlyProduct = (this.globalVal.productInfo.adultItemFlag === 'Y')
      if (isAdultOnlyProduct) {
        this.checkAdultCertificated()
      }
      this.isLoadChildComponent = true
      this.setMarketing()
      this.setRecentlyViewedProducts()

      await this.getRecommend()
      this.isRecommendReadied = true

      this.setEventPopup()
    },
    /**
     * 응답받은 상품상세 데이터 세팅
     * @param {Object} productDetailData 상품상세 데이터
     * @param {Object} generalInfoData 상품상세 기술서 데이터
     * @param {Object} productReviewData 상품평 데이터
     * @param {Object} qaListData 상품문의 데이터
     */
    setProductDetailData ({ productDetailData, generalInfoData, productReviewData, qaListData }) {
      const { info, pastVod } = productDetailData.msg.goods[0]
      this.globalVal.productInfo = info
      this.globalVal.pastVod = pastVod
      this.globalVal.userBroadInfrId = productDetailData.msg.member.userBroadInfrId

      this.globalVal.productInfo.multiCd = info.mparam?.multiCd || null

      this.$store.commit('product/setProductInfo', info)
      this.$store.commit('product/setProduct', productDetailData)

      if (info.headCopyList) {
        this.isBannerProductReadied = true
      }

      this.globalVal.guideDataList = generalInfoData.jsonData.goodsGuideDataList
      this.globalVal.guideDataDetailList = generalInfoData.jsonData.goodsGuideDataDetailList
      this.globalVal.ftcGuideList = generalInfoData.jsonData.goodsFtcGuideList
      this.globalVal.reviewInfo = productReviewData.ReviewInfo
      this.globalVal.qnaGuide = qaListData.msg.root.qnaGuide
      this.globalVal.detailQna = qaListData.msg.root.detailQna
    },
    /**
     * soldout 메시지 출력하는 경우
     *
     * 알뜰 할인가 마이너스 값일 경우 처리
     * 전시타입 코드가 없는 경우
     * 미승인 상태 상품이 출력되었을 경우.
     * 판매불가 상품일 경우
     * 방송한정 상품인데 해당 시간이 아닌 경우
     * 상품 판매가능 여부 (Y=판매가능 N=판매불가)와 DB에서 삭제된 상품인지 체크
     * 실물상품권일 경우 판매 불가
     * 쇼핑북상품 확인
     * 옵션상품이면서, 일반상품의 가격이 0원일 경우
     *
     * @param {Object} info 상품정보
     * @returns {Boolean} true : 매진
     */
    getSoldout (info) {
      const { salePrice, dispTypeCd, buyable, saleYn, markForDelete, productCnt, busChnId, apprStatCd, optionList, partNumber, styleMngYn } = info
      const { multiCd } = info.mparam
      return (salePrice < 0) ||
            (!dispTypeCd) ||
            (!buyable) ||
            (saleYn === 'N' || markForDelete === 1) ||
            (productCnt < 1) ||
            (busChnId === 'SB' && !multiCd) ||
            PRODUCT_CONST.GOODS_DISP_TYPE_CD.PAPER_GIFTCARD === dispTypeCd ||
            !PRODUCT_CONST.APPROVED_STAT_CD.includes(apprStatCd) ||
            !this.getItem(optionList, partNumber) ||
            (styleMngYn === 'Y' && (PRODUCT_CONST.GOODS_DISP_TYPE_CD.GENERAL_PRODUCT_TYPES.includes(dispTypeCd) && (salePrice === 0)))
    },
    /**
     * vip 회원 전용 상품 여부
     * @param {Object} info 상품정보
     * @returns {Boolean}
     */
    getVipOnly (info) {
      const { vipFlashProdYn } = info
      return vipFlashProdYn === 'Y' && loginUtil.isVip() === 'N'
    },
    /**
     * 방송시간 중에만 구매가능한 상품 여부
     * @param {Object} info 상품정보
     * @returns {Boolean}
     */
    getLiveLimitOnly (info) {
      const { liveLimit } = info
      return (liveLimit === 'N')
    },
    /**
     * 최근 본 상품 설정
     * @returns {void}
     */
    setRecentlyViewedProducts () {
      const info = this.globalVal.productInfo
      const isAdultOnlyProduct = (this.globalVal.productInfo.adultItemFlag === 'Y')
      const isAdultCertifiedUser = (loginUtil.adultAuthYN() === 'Y')

      if (isAdultOnlyProduct && !isAdultCertifiedUser) {
        return
      }

      const historyParam = {
        catentryId: info.catentryId,
        productName: info.productName,
        partNumber: info.partNumber,
        busChnId: info.busChnId,
        dispTypeCd: info.dispTypeCd,
        salePrice: info.salePrice,
        mmRntalPrc: info.mmRntalPrc,
        hisGubun: COMMON_CONST.HISTORY_GUBUN.PRODUCT,
        adultItemFlag: info.adultItemFlag
      }
      bizUtil.setRecentlyViewedProducts(historyParam)
    },
    /**
     * 마케팅 스크립트 적용
     */
    setMarketing () {
      const info = this.globalVal.productInfo

      // 이전 화면의 클릭 항목명
      this.globalVal.clksrc = this.$route.params.clksrc
      this.globalVal.receivedRcCode = this.$route.params.rcCode
      this.globalVal.lnbCateName = this.$route.params.lnbCateName
      this.globalVal.scheduleTblName = this.$route.params.scheduleTblName
      this.globalVal.slotStoreName = this.$route.params.slotStoreName
      this.globalVal.popupId = this.$route.params.popupId

      // 마케팅 스크립트 적용 부분
      // GA 360 - 페이지 뷰
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: '',
          initFlag: true,
          isProductDetail: true,
          referer: this.$route.meta.refer, // 이전 화면명
          productName: this.globalVal.productInfo.productName, // 제품명
          lnbCateName: this.globalVal.lnbCateName, // LNB 카테고리명
          scheduleTblName: this.globalVal.scheduleTblName, // 편성표명
          slotStoreName: this.globalVal.slotStoreName, // 편성매장명
          popupId: this.globalVal.popupId // 팝업 ID
        }
      })

      this.gotoGAEcommerce(info)
      // Airbridge
      let productCategoryName = ''
      if (!isNull(info.mparam)) {
        if (!isNull(info.mparam.cate1Nm)) {
          productCategoryName = htmlDecode(info.mparam.cate1Nm)
        }
        if (!isNull(info.mparam.cate2Nm)) {
          productCategoryName += `>${htmlDecode(info.mparam.cate2Nm)}`
        }
        if (!isNull(info.mparam.cate3Nm)) {
          productCategoryName += `>${htmlDecode(info.mparam.cate3Nm)}`
        }
        if (!isNull(info.mparam.cate4Nm)) {
          productCategoryName += `>${htmlDecode(info.mparam.cate4Nm)}`
        }
        if (!isNull(info.mparam.cate5Nm)) {
          productCategoryName += `>${htmlDecode(info.mparam.cate5Nm)}`
        }
      }
      marketingUtil.airbridgeLogger.send({
        event: marketingUtil.airbridgeLogger.EVENT.PRODUCT_DETAILS_VIEW, // 상품상세 조회
        data: {
          products: [
            {
              productID: info.partNumber, // 상품ID
              name: info.productName, // 상품명
              price: Number(String(info.salePrice).replaceAll(',', '')), // 가격
              currency: 'KRW', // 통화
              position: 1 // index
            }
          ],
          customAttributes: {
            categoryNm: productCategoryName,
            gradeNm: loginUtil.getUserInfo('gradeNm')
          },
          action: '상품상세조회',
          label: '상품상세조회' // productCategoryName
        }
      })
      // 페이스북 픽셀
      marketingUtil.fbpixelLogger.send({
        type: marketingUtil.fbpixelLogger.EVENT.VIEW_CONTENT,
        data: {
          value: info.salePrice, // 제품 가격
          currency: 'KRW',
          content_name: info.productName, // 제품명
          content_type: 'product', // 고정
          content_ids: info.partNumber // 제품 id
        }
      })
      // 홈쇼핑 모아
      marketingUtil.hsmoaLogger.send({
        data: {
          co_cd: COMM_CONST.getCocd(),
          action: info.partNumber,
          category: 'product'
        }
      })
      // AIQUA
      const params = {
        rcmdGbn: 'PRODUCT',
        rcmdValue: info.partNumber
      }
      nsaxios.post('NSRcmdCmd', params, function (data) {
        marketingUtil.aiquaLogger.send({
          type: marketingUtil.aiquaLogger.USER_EVENT,
          data: {
            event: 'product_viewed',
            params: {
              category_name: !isNull(info.mparam) && !isNull(info.mparam.cate2Nm) ? htmlDecode(info.mparam.cate2Nm) : (!isNull(info.mparam) && !isNull(info.mparam.cate1Nm) ? htmlDecode(info.mparam.cate1Nm) : ''),
              product_id: info.partNumber,
              product_name: info.productName,
              product_image_url: Array.isArray(info.photoList) && info.photoList.length > 0 ? `https:${info.photoList[0].photoPath}` : '',
              product_price: Number(String(info.salePrice).replaceAll(',', '')),
              product_channel: info.busChnId,
              md_name: !isNull(data.msg.empNm) ? data.msg.empNm : '',
              md_team_name: !isNull(data.msg.orgNm) ? data.msg.orgNm : ''
            }
          }
        })
      })

      // Recobell
      marketingUtil.recobellLogger.send({
        data: {
          category: marketingUtil.CATEGORY_ADD_PRODUCTVIEW,
          action: {
            catalog: !isNull(info.mparam) ? htmlDecode(info.mparam.cate1Nm) : '',
            name: info.productName,
            id: info.partNumber,
            price: info.offerPrice,
            sale: info.offerPrice - info.salePrice
          },
          searchTerm: '',
          clickUrl: this.globalVal.receivedRcCode,
          itemType: info.dispTypeCd,
          CTCOMitemYn: info.ctcomTvList,
          TVitemYn: info.tvList
        }
      })

      // 마케팅 스크립트 적용 부분
      // 네이버 프리미엄
      marketingUtil.naverLogger.send({ // 유입
        type: marketingUtil.naverLogger.TRACE_INFLOW
      })
    },
    /**
     * GA360 - 전자상거래
     * @param {Object} info 상품정보
     */
    gotoGAEcommerce (info) {
      // 마케팅 스크립트 적용 부분
      // E-commerce
      // 카테고리 전송
      let categoryName = ''
      if (!isNull(info.mparam)) {
        if (!isNull(info.mparam.cate1Nm)) {
          categoryName = htmlDecode(info.mparam.cate1Nm)
        }
        if (!isNull(info.mparam.cate2Nm)) {
          categoryName += htmlDecode(`/${info.mparam.cate2Nm}`)
        }
        if (!isNull(info.mparam.cate3Nm)) {
          categoryName += htmlDecode(`/${info.mparam.cate3Nm}`)
        }
        if (!isNull(info.mparam.cate4Nm)) {
          categoryName += htmlDecode(`/${info.mparam.cate4Nm}`)
        }
        if (!isNull(info.mparam.cate5Nm)) {
          categoryName += htmlDecode(`/${info.mparam.cate5Nm}`)
        }
      } else {
        categoryName = null
      }

      // 제품_상품 유형
      let tvProduct = ''
      if (!isNull(info.ctcomTvList) || !isNull(info.tvList)) {
        tvProduct = 'eTV'
      } else {
        tvProduct = 'e상품'
      }

      // 제품_방송일  & 제품_방송시작시간 & 제품_방송종료시간
      let liveTime = ''
      let liveStartTime = ''
      let liveEndTime = ''
      if (this.globalVal.productInfo.tvList) {
        liveTime = info.tvList[0].brdctDate
        liveStartTime = format(getDateParse(info.tvList[0].formStartDttm), 'HH:mm')
        liveEndTime = format(getDateParse(info.tvList[0].formEndDttm), 'HH:mm')
      } else if (this.globalVal.productInfo.ctcomTvList) {
        liveTime = info.ctcomTvList[0].brdctDate
        liveStartTime = format(getDateParse(info.ctcomTvList[0].formStartDttm), 'HH:mm')
        liveEndTime = format(getDateParse(info.ctcomTvList[0].formEndDttm), 'HH:mm')
      } else {
        liveTime = null
        liveStartTime = null
        liveEndTime = null
      }

      // 제품_방송프로그램명
      let programName = ''
      if (!isNull(info.tvList)) {
        programName = 'NS LIVE'
      } else if (!isNull(info.ctcomTvList)) {
        programName = 'Shop+'
      } else {
        programName = null
      }
      if (tvProduct === 'e상품') { // 상품상세(e-상품)
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
          data: {
            step: marketingUtil.ga360Logger.ECOMMERCE_STEP_01,
            params: [
              {
                id: String(info.partNumber),
                name: info.productName,
                brand: info.brandName,
                category: categoryName,
                dimension16: tvProduct,
                dimension17: liveTime,
                dimension18: liveStartTime,
                dimension19: liveEndTime,
                dimension20: programName
              }
            ],
            subparams: {
              t1: '상품상세',
              t2: '일반상품',
              t3: info.productName
            }
          }
        })
      } else if (tvProduct === 'eTV') { // 상품상세(SHOP+ || TV)
        marketingUtil.ga360Logger.send({
          type: marketingUtil.ga360Logger.LOG_ECOMMERCE,
          data: {
            step: marketingUtil.ga360Logger.ECOMMERCE_STEP_02,
            params: [
              {
                id: String(info.partNumber),
                name: info.productName,
                brand: info.brandName,
                category: categoryName,
                dimension16: tvProduct,
                dimension17: liveTime,
                dimension18: liveStartTime,
                dimension19: liveEndTime,
                dimension20: programName
              }
            ],
            subparams: {
              t1: '상품상세',
              t2: 'TV쇼핑',
              t3: programName,
              t4: info.productName,
              partNumber: info.partNumber,
              type: tvProduct,
              type2: programName,
              list: {
                brdctDate: liveTime,
                formStartDttm: liveStartTime,
                formEndDttm: liveEndTime
              }
            }
          }
        })
      }
    },
    /**
     * 이벤트 팝업 노출
     */
    setEventPopup () {
      const endDate = localStorageUtil.get(COMM_CONST.STORAGE_KEY.EVENT_POPUP_DETAIL)
      if (!endDate || !getBdDay(endDate)) {
        const params = {
          type: COMM_CONST.STORAGE_KEY.EVENT_POPUP_DETAIL,
          vendorId: this.globalVal.productInfo.vendorId,
          partNumber: this.globalVal.productInfo.partNumber,
          okCallback () {
            const endDate = `${getNowDate()}235959`
            localStorageUtil.set(params.type, endDate)
          },
          cancelCallback () {}
        }
        popupUtil.openEventPopup(params)
      }
    },
    /**
     * 상품문의 건 수
     *
     */
    async getQAList () {
      return await productDetailService.getQAList(this.qaListParams)
    },
    /**
     * 상품평 요약정보 조회
     *
     */
    async getProductReview () {
      return await productDetailService.getProductReview(this.productReviewParams)
    },
    /**
     * 상품상세정보 조회
     */
    async getProductDetail () {
      return await productDetailService.getProductDetail(this.productDetailParams)
    },
    /**
     * 성인인증 여부 체크
     *
     */
    checkAdultCertificated () {
      if (this.checkLogin()) {
        if (this.checkAdult()) {
          this.checkAdultAuth()
        }
      }
    },
    /**
     * 로그인 유무 체크
     *
     * @returns {boolean} 로그인 유무 체크 결과
     */
    checkLogin () {
      const isLogon = loginUtil.checkLogonStatus()
      if (isLogon) {
        return true
      } else {
        bizUtil.gotoLogin(LOGIN_CONST.LOGIN_POPUP_TYPE.ORDER, null, true)
        return false
      }
    },
    /**
     * 성인 계정 체크
     *
     * @returns {boolean} 성인 여부(생년월일 정보 없는 경우 pass)
     */
    checkAdult () {
      const isAdult = getAgeInFull(loginUtil.birthday(), true, 20)

      if (isAdult) {
        return true
      } else {
        const alertMsg = '성인 전용 상품입니다.'
        messageUtil.alert(alertMsg, () => {
          bizUtil.gotoMain()
        })
        return false
      }
    },
    /**
     * 성인 인증 받았는지 여부 체크. 안받았으면 성인인증 페이지로 이동
     *
     */
    checkAdultAuth () {
      const isAdultCertifiedUser = (loginUtil.adultAuthYN() === 'Y')
      if (isAdultCertifiedUser) {
        return
      }

      const invoke = {
        name: 'adultCertify',
        params: {
          isAdultDiv: true,
          partNumber: this.globalVal.partNumber
        }
      }
      this.$router.replace(invoke)
    },
    /**
     * 상품 유효성 체크
     * @param {Object} productDetailData 상품정보
     */
    checkProductValidation (productDetailData) {
      const productInfo = productDetailData?.msg?.goods?.[0]?.info
      if (!productInfo) {
        messageUtil.alert(MESSAGES.PROCEDURE_ERROR, () => {
          routerUtil.back()
        })
      } else {
        const validationMsg = this.initValidationMessage(productInfo)
        if (validationMsg) {
          messageUtil.alert(validationMsg, () => {
            routerUtil.back()
          })
        }
      }
    },
    /**
     * 구매 가능한 상품 여부
     * @param {Object} info 상품정보
     * @returns {String} 유효하지 않은 상품인 경우 message return
     */
    initValidationMessage (info) {
      if (this.getSoldout(info)) {
        return this.MESSAGE.SOLDOUT
      } else {
        if (this.getVipOnly(info)) {
          return this.MESSAGE.VIP_ONLY
        } else {
          if (this.getLiveLimitOnly(info)) {
            return this.MESSAGE.LIVE_ONLY
          } else {
            return ''
          }
        }
      }
    },
    /**
     * partNumber 일치하는 첫번째 아이템 반환
     * @param {Array} items 옵션목록
     * @param {String} partNumber 파트넘버
     * @returns {Object}
     */
    getItem (items, partNumber) {
      return items.find(item => partNumber === item.partNumber)
    },
    /**
     * 상품기술서 조회
     */
    async getMoreGeneralInfo () {
      return await productDetailService.getMoreGeneralInfo(this.moreGeneralInfoParams)
    },
    /**
     * 상품 카테고리 코드 중 유효한 마지막 값
     * @returns {String}
     */
    getCateCdEnd () {
      const categoryCodeList = []
      Object.keys(this.globalVal.productInfo.mparam)
        .filter(key => key.startsWith('cate') && key.endsWith('Code'))
        .forEach(item => {
          categoryCodeList.push(this.globalVal.productInfo.mparam[item])
        })
      return categoryCodeList.filter(n => n).pop()
    },
    /**
     * 추천영역 조회
     */
    async getRecommend () {
      const { msg: { root: togetherViewList } } = await this.getRecommendData(this.togetherViewParams)
      const { msg: { root: togetherPurchaseList } } = await this.getRecommendData(this.togetherPurchaseParams)
      const { msg: { root: popularProductsList } } = await this.getRecommendData(this.popularProductsParams)
      this.globalVal.togetherViewList = togetherViewList
      this.globalVal.togetherPurchaseList = togetherPurchaseList
      this.globalVal.popularProductsList = popularProductsList
    },
    /**
     * 추천영역 api 호출
     * @param {Object} params 파라미터
     * @returns {Object} api 응답값
     */
    async getRecommendData (params) {
      return await productDetailService.getRecommendData(params)
    },
    /**
     * 현재 페이지 새로고침
     *
     */
    refreshPage () {
      this.coCd = COMM_CONST.getCocd()
      this.init()
    },
    /**
     * 바로구매 열기
     *
     */
    layerOpen () {
      this.showRightOrderOption = true
    },
    /**
     * 바로주문 닫기
     *
     */
    layerClose () {
      this.showRightOrderOption = false
    },
    /**
     * 갱신 처리
     */
    handleRequiresRefresh () {
      this.init()
      this.reloadKey++
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/product/ProductDetail";
</style>
