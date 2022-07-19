<template>
  <div class="exhibition_detail">
    <div class="title_wrap">
      <h3 class="name">
        {{ htmlDecode(title) }}
      </h3>
      <div class="share_wrap">
        <button class="button_share" @click="onClickShareBtn">
          공유하기
        </button>
      </div>
    </div>
    <div
      id="exhibitionContent"
      class="exhibition_content"
      @click="linkview"
      v-html="htmlDecode(bannerImage)"
    />
    <template v-if="statusProduct === 1">
      <product-list
        :product-list="nsTimesPrmProductList"
        :parent-info="'ExhibitionDetail'"
        :clksrc="clksrc"
        :use-toppp="false"
        @get:product="getNSTimesPrmt"
      />
    </template>
    <template v-else-if="statusProduct === 2">
      <div>기획전 상품이 존재하지 않습니다.</div>
    </template>
  </div>
</template>

<script>
import CONST from '@constants/framework/framework'
import COMM_CONST from '@constants/framework/constants'
import COMMON_CONST from '@constants/common/common'
import uiUtil from '@/common/utils/uiUtil'
import bizUtil from '@utils/bizUtil'
import modalUtil from '@frameworks/modalUtil'
import popupUtil from '@frameworks/popupUtil'
import routerUtil from '@frameworks/routerUtil'
import messageUtil from '@/common/frameworks/messageUtil'
import localStorageUtil from '@frameworks/localStorageUtil'
import {
  isNull,
  htmlDecode,
  isOsApp
} from '@utils/commonutil/commonUtil'
import {
  getBdDay,
  getNowDate
} from '@frameworks/dateutil/dateUtil'
import META_INFO_CONST from '@constants/framework/metaInfo'
import ProductList from '@components/common/ProductList'
import shareMixin from '@/mixins/common/shareMixin'
import marketingUtil from '@utils/marketingUtil' // 마케팅 스크립트

export default {
  components: {
    ProductList
  },
  mixins: [
    shareMixin
  ],
  metaInfo () {
    return {
      meta: [
        { vmid: META_INFO_CONST.META.OG_TITLE, property: 'og:title', content: `${this.title} - NS홈쇼핑 모바일` },
        { vmid: META_INFO_CONST.META.OG_URL, property: 'og:url', content: this.shareUrl },
        { vmid: META_INFO_CONST.META.OG_IMAGE, property: 'og:image', content: this.imageUrl }
      ]
    }
  },
  data () {
    return {
      statusProduct: 0, // 0: 준비, 1: 상품있음, 2: 상품없음
      listGridClass: true,
      mInputParams: {},
      shareUrl: '',
      clksrc: '',
      title: '',
      bannerType: '',
      bannerImage: '',
      productList: [],
      nsTimesPrmProductList: [], // 카테고리 상품
      isInit: true,
      pageSize: 20,
      pageIdx: 1,
      currentPage: 0,
      totalCount: 0,
      object: {
        callback: this.getNSTimesPrmt
      }
    }
  },
  created () {
    this.init()
  },
  updated () {
    if (this.bannerType !== '2') {
      const list = document.getElementById('exhibitionContent').querySelectorAll('img')
      if (!isNull(list) && list.length > 0) {
        for (let i = 0; i < list.length; i++) {
          list[i].style.width = '100%'
        }
      }
    }
  },
  mounted () {
    // 전문매장, 혜택 높이 정렬
    const vm = this
    const productList = document.querySelectorAll('.product_list .list')
    productList.forEach(function (element, index) {
      if (index % 2 === 0) {
        const benefit = element.querySelector('.benefit')
        const nextElement = benefit.closest('.list').nextElementSibling
        if (nextElement) {
          const nextBenefit = nextElement.querySelector('.benefit')
          const benefitHeight = benefit.clientHeight
          const nextBenefitHeight = nextBenefit.clientHeight
          if (vm.listGridClass) {
            if (benefitHeight > nextBenefitHeight) {
              nextBenefit.style.height = `${benefitHeight}px`
            } else if (benefitHeight < nextBenefitHeight) {
              benefit.style.height = `${nextBenefitHeight}px`
            }
          } else {
            benefit.style.height = 'auto'
            nextBenefit.style.height = 'auto'
          }
        }
      }
    })

    this.initParamObject()
    uiUtil.bindInfiniteScroll(this, this.object)
  },
  methods: {
    htmlDecode,
    /**
     * 무한 스크롤용 객체 초기화
     * @returns {void}
     */
    initParamObject () {
      this.isApiLoding = true

      this.object.callback = this.getNSTimesPrmt
      this.object.isEnable = true
      this.object.interval = 500
      this.object.triggerHeightPercent = 70
    },
    /**
     * 초기화
     * @returns {void}
     */
    init () {
      if (Object.keys(this.$route.params).length === 0) {
        this.$route.query.catgroupId = Number(this.$route.query.catgroupId)
        this.mInputParams = this.$route.query
      } else {
        this.mInputParams = this.$route.params
      }
      this.getNSTimesPrmt()
    },
    /**
     * 기획전 정보 요청
     * @returns {void}
     */
    getNSTimesPrmt () {
      // 마지막 페이지일 경우 데이터 요청하지 않음
      if (this.pageIdx >= this.totalPage && this.totalPage !== 0) {
        return false
      }

      if (!this.isInit) {
        this.pageIdx++
      }
      const invoke = {
        processFlag: 'mobile3',
        catgroupId: this.mInputParams.catgroupId,
        rowPerPage: this.pageSize,
        pageIdx: this.pageIdx
      }

      if (this.isInit) {
        this.$nsaxios.post('NSTimesPrmtAjax', invoke, this.setNSTimesPrmt)
      } else {
        this.$nsaxios.post('NSTimesPrmtAjax', invoke, this.setNSTimesPrmtNext)
      }
    },
    /**
     * 기획전 정보결과 후 초기처리
     * @param {Object} data 기획전 정보결과
     * @returns {void}
     */
    async setNSTimesPrmt (data) {
      const titleInfo = data.msg.TitleInfoMap
      this.isInit = false

      // 마케팅 스크립트 적용 부분
      // GA360
      marketingUtil.ga360Logger.send({
        type: marketingUtil.ga360Logger.LOG_PAGE,
        data: {
          category: '',
          initFlag: true,
          subparams: {
            t1: '기획전',
            t2: isNull(titleInfo.CATGRP_NAME) ? '' : titleInfo.CATGRP_NAME,
            t3: '',
            t4: ''
          }
        }
      })

      // 기획전 날짜 체크
      // openYN 만 체크 (종료일 23시59분까지 유효하게 하기위함)
      if (titleInfo.OPENYN === 'N') {
        messageUtil.alert('종료된 기획전입니다', () => {
          routerUtil.back()
        })
      } else {
        // 모바일 배너이미지 체크
        if (!isNull(data.msg.prmtIntcont.intsecgubcd)) {
          this.bannerType = data.msg.prmtIntcont.intsecgubcd
        }

        if (data.msg.prmtIntcont) {
          if (this.bannerType !== '' && this.bannerType === '2') {
            this.bannerImage = await this.$nsaxios.request({
              method: 'get',
              url: CONST.NS_IMAGE_EXHI_SRV + data.msg.prmtIntcont.htmlfile,
              headers: {
                'Content-Type': 'text/html'
              }
            }).then(response => response.data || '')
          } else if (data.msg.prmtIntcont.dweMobileditcont) {
            this.bannerImage = data.msg.prmtIntcont.dweMobileditcont
          } else if (data.msg.prmtIntcont.dweditcont) {
            this.bannerImage = data.msg.prmtIntcont.dweditcont
          }
        }

        // 상품리스트 체크
        if (data.msg.totCnt > 0) {
          this.productList = data.msg.productList
          this.totalCount = Number(data.msg.totCnt)
          this.totalPage = Math.ceil(this.totalCount / this.pageSize)
          if (!isNull(this.productList) && this.productList.length > 0) {
            this.preMappingAttribute()
          }
          this.statusProduct = 1
        } else {
          this.statusProduct = 2
          return false
        }

        this.getEventBanner()
        this.setOpenGraphTag(titleInfo)
        this.setHistory(titleInfo)
      }
    },
    /**
     * 기획전 정보결과 후 페이지처리
     * @param {Object} data 기획전 정보결과
     * @returns {void}
     */
    setNSTimesPrmtNext (data) {
      if (!isNull(data.msg.productList) && data.msg.productList.length > 0) {
        this.productList = data.msg.productList
        this.preMappingAttribute()
      }
    },
    /**
     * 상품목록 속성정의
     * @returns {void}
     */
    preMappingAttribute () {
      for (let i = 0; i < this.productList.length; i++) {
        const item = this.productList[i].commonData

        let price = item.priceofferprice
        if (item.dispTypeCd === '45' || item.dispTypeCd === '57') {
          price = item.mmRntalPrc
        }

        if (item.brandCd !== '200000' && item.brandCd !== '250000' && item.busChnId !== 'SB') {
          item.itncatentrynm = `[${item.brand_kor_nm}] ${item.itncatentrynm}`
        }

        item.partnumber = item.partNumber
        item.dcPrice = item.pricedcprice
        item.dcRate = String(item.saleRate)
        item.price = price
        item.joinCnt = item.join_cnt
        item.scoreRate = item.score
        item.dlvrFreeYn = Number(item.dlvrPrice) === 0 ? 'Y' : 'N' // 무료배송 여부
        item.promIfiVal = Number(item.ifiValue) // 무이자 여부
        item.promPadYn = 'N' // 적립금
        item.bestYn = item.defsort

        this.nsTimesPrmProductList.push(item)
      }
    },
    /**
     * 이벤트 팝업 확인
     * @returns {void}
     */
    getEventBanner () {
      const endDate = localStorageUtil.get(COMM_CONST.STORAGE_KEY.EVENT_POPUP_EXHABIT)
      if (!endDate || !getBdDay(endDate)) {
        const params = {
          type: COMM_CONST.STORAGE_KEY.EVENT_POPUP_EXHABIT,
          categoryId: this.mInputParams.catgroupId,
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
     * OpenGraphTag 설정
     * @param {Object} titleInfo 타이틀 정보
     * @returns {void}
     */
    setOpenGraphTag (titleInfo) {
      this.title = titleInfo.CATGRP_NAME

      setTimeout(() => {
        const el = document.getElementById('exhibitionContent')

        let sharedParams = `p_espotid=${this.mInputParams.p_espotid}`
        sharedParams += `&p_bannerid=${this.mInputParams.p_bannerid}`
        sharedParams += `&catgroupId=${this.mInputParams.catgroupId}`
        sharedParams += '&via=NSMALL'

        this.shareUrl = `https://${CONST.MOBILE_NSMALL_PATH}/exhibition/detail?${sharedParams}`
        this.imageUrl = (el.querySelectorAll('img').length === 0) ? '' : el.querySelectorAll('img')[0].src
      }, 100)
    },
    /**
     * 기획전 저장
     * @param {Object} titleInfo 타이틀 정보
     * @returns {void}
     */
    setHistory (titleInfo) {
      // TODO: 기획전 -> history 변경 데이터 경량화
      const historyParams = {
        pageParams: this.mInputParams,
        catgroupId: this.mInputParams.catgroupId,
        cateGroupName: titleInfo.CATGRP_NAME,
        pageId: '',
        hisGubun: COMMON_CONST.HISTORY_GUBUN.EXHIBITION
      }
      bizUtil.setRecentlyViewedProducts(historyParams) // 기획전 저장
    },
    /**
     * 공유하기
     * @returns {void}
     */
    onClickShareBtn () {
      const param = {
        type: 'exhibition',
        title: '[NS홈쇼핑]',
        description: this.title,
        imageUrl: this.imageUrl,
        shareUrl: this.shareUrl
      }

      if (isOsApp()) {
        this.kakaoShareNative('exhibition', param)
      } else {
        modalUtil.show('common/PopupShare', param, this.sharePopupClose)
      }
    },
    /**
     * App 내 새창 열기
     *
     * @param {Object} e 클릭 이벤트
     */
    linkview (e) {
      // 앱 내에서 앵커 클릭 시
      const href = e.target.href
      if (href && !href.startsWith('javascript') && isOsApp()) {
        // TODO : App 새창 열기, 구현 후 href 이동 막기 사용 필요
        // Ns.Native.linkView(2, addr)

        // href 이동막기
        // e.preventDefault()
      }
    }
  }
}
</script>

<style lang="scss">
  @import "~@/assets/styles/views/exhibition/ExhibitionDetail";
</style>
